/**
 * Mode Manager - Audit vs Simulation
 * 
 * Manages the enforcement of different validation rules and behaviors
 * based on whether the calculator is in Audit mode or Simulation mode.
 * 
 * Audit Mode:
 * - Strict legal compliance
 * - No approximations allowed
 * - Full justifications required
 * - Results marked as "Audit-Ready"
 * - Blocking validation errors
 * 
 * Simulation Mode:
 * - Educational purpose
 * - Hypothesis tolerance
 * - Pedagogical explanations
 * - Non-blocking warnings
 */

class ModeManager {
    constructor() {
        this.modes = {
            audit: {
                id: 'audit',
                label: '🔒 Mode Audit Fiscal',
                description: 'Mode strict pour calculs conformes et défendables juridiquement',
                icon: '🔒',
                color: '#2563EB', // Professional blue
                features: {
                    strictValidation: true,
                    blockingErrors: true,
                    requireJustifications: true,
                    allowApproximations: false,
                    showLegalReferences: true,
                    auditReadyCertification: true,
                    pdfExportEnabled: true
                },
                warnings: {
                    level: 'ERROR',
                    blocking: true
                }
            },
            simulation: {
                id: 'simulation',
                label: '🎓 Mode Simulation',
                description: 'Mode pédagogique avec explications détaillées et hypothèses autorisées',
                icon: '🎓',
                color: '#10B981', // Educational green
                features: {
                    strictValidation: false,
                    blockingErrors: false,
                    requireJustifications: false,
                    allowApproximations: true,
                    showLegalReferences: true,
                    auditReadyCertification: false,
                    pdfExportEnabled: false
                },
                warnings: {
                    level: 'WARNING',
                    blocking: false
                }
            }
        };
    }

    /**
     * Get mode configuration
     */
    getModeConfig(mode) {
        if (!this.modes[mode]) {
            throw new Error(`Invalid mode: ${mode}`);
        }
        return this.modes[mode];
    }

    /**
     * Check if a feature is enabled for current mode
     */
    isFeatureEnabled(mode, feature) {
        const config = this.getModeConfig(mode);
        return config.features[feature] === true;
    }

    /**
     * Check if approximations are allowed
     */
    canUseApproximations(mode) {
        return this.isFeatureEnabled(mode, 'allowApproximations');
    }

    /**
     * Check if errors should block calculation
     */
    shouldBlockOnError(mode) {
        return this.isFeatureEnabled(mode, 'blockingErrors');
    }

    /**
     * Check if legal justifications are required
     */
    requiresJustifications(mode) {
        return this.isFeatureEnabled(mode, 'requireJustifications');
    }

    /**
     * Check if result can be certified as audit-ready
     */
    canCertifyAuditReady(mode) {
        return this.isFeatureEnabled(mode, 'auditReadyCertification');
    }

    /**
     * Check if PDF export is allowed
     */
    canExportPDF(mode) {
        return this.isFeatureEnabled(mode, 'pdfExportEnabled');
    }

    /**
     * Get warning level for mode
     */
    getWarningLevel(mode) {
        const config = this.getModeConfig(mode);
        return config.warnings.level;
    }

    /**
     * Validate calculation inputs based on mode
     */
    validateInputs(mode, inputs, validationRules) {
        const config = this.getModeConfig(mode);
        const errors = [];
        const warnings = [];

        // Run validation rules
        validationRules.forEach(rule => {
            const result = rule.validate(inputs);

            if (!result.valid) {
                if (rule.severity === 'ERROR') {
                    errors.push({
                        ruleId: rule.id,
                        message: result.message,
                        article: rule.article,
                        blocking: config.features.blockingErrors && rule.blocking
                    });
                } else if (rule.severity === 'WARNING') {
                    warnings.push({
                        ruleId: rule.id,
                        message: result.message,
                        article: rule.article,
                        blocking: false
                    });
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            canProceed: config.features.blockingErrors ? errors.length === 0 : true
        };
    }

    /**
     * Format result with mode-specific metadata
     */
    formatResult(mode, calculationResult) {
        const config = this.getModeConfig(mode);

        return {
            ...calculationResult,
            mode: mode,
            modeLabel: config.label,
            certified: config.features.auditReadyCertification,
            certificationBadge: config.features.auditReadyCertification ?
                '✅ AUDIT-READY - Conforme et défendable juridiquement' :
                '🎓 SIMULATION - À titre pédagogique uniquement',
            exportOptions: {
                pdf: config.features.pdfExportEnabled,
                excel: true,
                csv: true
            }
        };
    }

    /**
     * Get mode selection UI configuration
     */
    getModeSelectionUI() {
        return Object.values(this.modes).map(mode => ({
            id: mode.id,
            label: mode.label,
            description: mode.description,
            icon: mode.icon,
            color: mode.color,
            recommended: mode.id === 'simulation' ? 'Pour débuter' : 'Pour usage professionnel'
        }));
    }

    /**
     * Create mode badge HTML
     */
    createModeBadge(mode) {
        const config = this.getModeConfig(mode);

        return `
      <div class="mode-badge" style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: ${config.color}15;
        border: 2px solid ${config.color};
        border-radius: 8px;
        color: ${config.color};
        font-weight: 600;
        font-size: 14px;
      ">
        <span style="font-size: 18px;">${config.icon}</span>
        <span>${config.label}</span>
      </div>
    `;
    }

    /**
     * Create certification badge HTML
     */
    createCertificationBadge(mode) {
        if (!this.canCertifyAuditReady(mode)) {
            return `
        <div class="certification-badge simulation" style="
          padding: 12px 20px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          text-align: center;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        ">
          🎓 SIMULATION - À titre pédagogique uniquement
        </div>
      `;
        }

        return `
      <div class="certification-badge audit" style="
        padding: 12px 20px;
        background: linear-gradient(135deg, #2563EB, #1E40AF);
        border-radius: 8px;
        color: white;
        font-weight: 600;
        text-align: center;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      ">
        ✅ AUDIT-READY - Conforme et défendable juridiquement
      </div>
    `;
    }

    /**
     * Get mode comparison table
     */
    getModeComparison() {
        return {
            headers: ['Fonctionnalité', 'Mode Audit', 'Mode Simulation'],
            rows: [
                ['Validation stricte', '✅ Oui', '⚠️ Souple'],
                ['Blocage sur erreurs', '🔒 Oui', '➡️ Non'],
                ['Approximations', '❌ Non', '✅ Oui'],
                ['Justifications légales', '✅ Obligatoires', '📚 Optionnelles'],
                ['Certification Audit-Ready', '✅ Oui', '❌ Non'],
                ['Export PDF officiel', '✅ Oui', '❌ Non'],
                ['Références légales', '✅ Systématiques', '✅ Affichées'],
                ['Utilisation recommandée', '👔 Professionnel', '🎓 Apprentissage']
            ]
        };
    }

    /**
     * Switch mode warning message
     */
    getModeSwitchWarning(fromMode, toMode) {
        if (fromMode === 'simulation' && toMode === 'audit') {
            return {
                type: 'info',
                title: 'Passage en Mode Audit',
                message: 'Les règles de validation vont devenir plus strictes. Toute incohérence juridique bloquera le calcul.',
                icon: '🔒'
            };
        }

        if (fromMode === 'audit' && toMode === 'simulation') {
            return {
                type: 'warning',
                title: 'Passage en Mode Simulation',
                message: 'Attention : Les résultats en mode Simulation ne sont pas certifiés Audit-Ready et ne peuvent pas être utilisés pour des déclarations fiscales officielles.',
                icon: '⚠️'
            };
        }

        return null;
    }
}

// Create global singleton instance
const modeManager = new ModeManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModeManager, modeManager };
}
