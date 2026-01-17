/**
 * Rule Engine - Legal Validation System
 * 
 * Validates fiscal calculations against Tunisian Finance Law rules.
 * Detects and blocks legal inconsistencies such as:
 * - CNSS + retirement incompatibility
 * - CSS with null IRPP
 * - Deduction ceiling violations
 * - Cross-module inconsistencies
 * 
 * Rules are configurable per Finance Law version and mode (Audit/Simulation).
 */

class RuleEngine {
    constructor(legalDatabase) {
        this.legalDatabase = legalDatabase;
        this.rules = [];
        this.initializeRules();
    }

    /**
     * Initialize all validation rules
     */
    initializeRules() {
        // Load validation rules from legal database
        const dbRules = this.legalDatabase.validationRules;

        // Rule 1: CNSS + Retirement Incompatibility
        this.rules.push({
            id: dbRules.cnssRetirementIncompatibility.id,
            name: 'CNSS + Retirement Incompatibility',
            severity: dbRules.cnssRetirementIncompatibility.severity,
            article: dbRules.cnssRetirementIncompatibility.article,
            message: dbRules.cnssRetirementIncompatibility.message,
            blocking: dbRules.cnssRetirementIncompatibility.blocking,
            validate: (inputs) => {
                // If retirement is selected, CNSS should not be applied
                if (inputs.isRetirement && inputs.applyCNSS) {
                    return {
                        valid: false,
                        message: dbRules.cnssRetirementIncompatibility.message,
                        article: dbRules.cnssRetirementIncompatibility.article,
                        reference: this.legalDatabase.irpp.specialCases.retirement
                    };
                }
                return { valid: true };
            }
        });

        // Rule 2: CSS with Null IRPP
        this.rules.push({
            id: dbRules.cssNullIrpp.id,
            name: 'CSS with Null IRPP',
            severity: dbRules.cssNullIrpp.severity,
            article: dbRules.cssNullIrpp.article,
            message: dbRules.cssNullIrpp.message,
            blocking: dbRules.cssNullIrpp.blocking,
            validate: (inputs, calculationResult) => {
                // CSS should not be applied if IRPP is zero
                if (calculationResult && calculationResult.css > 0 && calculationResult.irpp === 0) {
                    return {
                        valid: false,
                        message: dbRules.cssNullIrpp.message,
                        article: dbRules.cssNullIrpp.article,
                        reference: this.legalDatabase.css.rules.requiresPositiveIRPP
                    };
                }
                return { valid: true };
            }
        });

        // Rule 3: Deduction Ceiling Exceeded
        this.rules.push({
            id: dbRules.deductionCeilingExceeded.id,
            name: 'Deduction Ceiling Exceeded',
            severity: dbRules.deductionCeilingExceeded.severity,
            article: dbRules.deductionCeilingExceeded.article,
            message: dbRules.deductionCeilingExceeded.message,
            blocking: dbRules.deductionCeilingExceeded.blocking,
            validate: (inputs) => {
                // Check if total deductions exceed gross income (impossible scenario)
                if (inputs.totalDeductions > inputs.grossIncome) {
                    return {
                        valid: false,
                        message: dbRules.deductionCeilingExceeded.message,
                        article: dbRules.deductionCeilingExceeded.article,
                        details: {
                            grossIncome: inputs.grossIncome,
                            totalDeductions: inputs.totalDeductions,
                            excess: inputs.totalDeductions - inputs.grossIncome
                        }
                    };
                }
                return { valid: true };
            }
        });

        // Rule 4: IS Minimum Tax
        this.rules.push({
            id: dbRules.minimumTaxIS.id,
            name: 'IS Minimum Tax',
            severity: dbRules.minimumTaxIS.severity,
            article: dbRules.minimumTaxIS.article,
            message: dbRules.minimumTaxIS.message,
            blocking: dbRules.minimumTaxIS.blocking,
            validate: (inputs, calculationResult) => {
                // Check if IS is below minimum (0.2% of CA)
                if (inputs.calculationType === 'is' && calculationResult) {
                    const minimumTax = inputs.turnover * this.legalDatabase.is.minimumTax.rate;
                    if (calculationResult.is < minimumTax) {
                        return {
                            valid: false,
                            message: dbRules.minimumTaxIS.message,
                            article: dbRules.minimumTaxIS.article,
                            details: {
                                calculatedIS: calculationResult.is,
                                minimumTax: minimumTax,
                                shouldApply: true
                            },
                            reference: this.legalDatabase.is.minimumTax
                        };
                    }
                }
                return { valid: true };
            }
        });

        // Rule 5: E-Invoicing Required (2026)
        this.rules.push({
            id: dbRules.eInvoicingRequired.id,
            name: 'E-Invoicing Required',
            severity: dbRules.eInvoicingRequired.severity,
            article: dbRules.eInvoicingRequired.article,
            message: dbRules.eInvoicingRequired.message,
            blocking: dbRules.eInvoicingRequired.blocking,
            validate: (inputs, calculationResult, context) => {
                // Check if TVA calculation in 2026 should trigger e-invoicing warning
                if (inputs.calculationType === 'tva' && context.financeLawVersion === '2026') {
                    return {
                        valid: false, // Treated as warning, not error
                        message: dbRules.eInvoicingRequired.message,
                        article: dbRules.eInvoicingRequired.article,
                        reference: this.legalDatabase.tva.eInvoicing
                    };
                }
                return { valid: true };
            }
        });

        // Rule 6: TEJ Platform Required
        this.rules.push({
            id: dbRules.tejPlatformRequired.id,
            name: 'TEJ Platform Required',
            severity: dbRules.tejPlatformRequired.severity,
            article: dbRules.tejPlatformRequired.article,
            message: dbRules.tejPlatformRequired.message,
            blocking: dbRules.tejPlatformRequired.blocking,
            validate: (inputs) => {
                // Check if RS calculation should trigger TEJ warning
                if (inputs.calculationType === 'rs') {
                    return {
                        valid: false, // Treated as info, not error
                        message: dbRules.tejPlatformRequired.message,
                        article: dbRules.tejPlatformRequired.article,
                        reference: this.legalDatabase.rs.tejPlatform
                    };
                }
                return { valid: true };
            }
        });
    }

    /**
     * Validate inputs against all rules
     */
    validateInputs(inputs, calculationResult = null, context = null) {
        const errors = [];
        const warnings = [];
        const info = [];

        this.rules.forEach(rule => {
            const result = rule.validate(inputs, calculationResult, context);

            if (!result.valid) {
                const violation = {
                    ruleId: rule.id,
                    ruleName: rule.name,
                    severity: rule.severity,
                    message: result.message,
                    article: result.article,
                    blocking: rule.blocking,
                    reference: result.reference || null,
                    details: result.details || null
                };

                if (rule.severity === 'ERROR') {
                    errors.push(violation);
                } else if (rule.severity === 'WARNING') {
                    warnings.push(violation);
                } else if (rule.severity === 'INFO') {
                    info.push(violation);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            info,
            canProceed: errors.filter(e => e.blocking).length === 0
        };
    }

    /**
     * Validate in context of current mode
     */
    validateWithMode(inputs, calculationResult, context, mode) {
        const validation = this.validateInputs(inputs, calculationResult, context);

        // In Audit mode, even warnings might block
        if (mode === 'audit') {
            // Warnings become blocking in audit mode for certain rules
            const blockingWarnings = validation.warnings.filter(w =>
                w.ruleId === 'RULE_002' // CSS with null IRPP
            );

            if (blockingWarnings.length > 0) {
                validation.errors.push(...blockingWarnings);
                validation.warnings = validation.warnings.filter(w =>
                    !blockingWarnings.includes(w)
                );
                validation.valid = false;
                validation.canProceed = false;
            }
        }

        return validation;
    }

    /**
     * Get rule by ID
     */
    getRule(ruleId) {
        return this.rules.find(r => r.id === ruleId);
    }

    /**
     * Get all rules
     */
    getAllRules() {
        return this.rules;
    }

    /**
     * Format validation result for display
     */
    formatValidationResult(validation) {
        const messages = [];

        // Add errors
        validation.errors.forEach(error => {
            messages.push({
                type: 'error',
                icon: '🚫',
                title: error.ruleName,
                message: error.message,
                article: error.article,
                blocking: error.blocking,
                color: '#DC2626'
            });
        });

        // Add warnings
        validation.warnings.forEach(warning => {
            messages.push({
                type: 'warning',
                icon: '⚠️',
                title: warning.ruleName,
                message: warning.message,
                article: warning.article,
                blocking: false,
                color: '#F59E0B'
            });
        });

        // Add info
        validation.info.forEach(info => {
            messages.push({
                type: 'info',
                icon: 'ℹ️',
                title: info.ruleName,
                message: info.message,
                article: info.article,
                blocking: false,
                color: '#3B82F6'
            });
        });

        return {
            valid: validation.valid,
            canProceed: validation.canProceed,
            messages,
            summary: {
                errors: validation.errors.length,
                warnings: validation.warnings.length,
                info: validation.info.length,
                blockingErrors: validation.errors.filter(e => e.blocking).length
            }
        };
    }

    /**
     * Create validation message HTML
     */
    createValidationMessageHTML(message) {
        return `
      <div class="validation-message validation-${message.type}" style="
        padding: 16px;
        margin: 12px 0;
        background: ${message.color}15;
        border-left: 4px solid ${message.color};
        border-radius: 8px;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <span style="font-size: 24px;">${message.icon}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: ${message.color}; margin-bottom: 8px;">
              ${message.title}
            </div>
            <div style="color: #374151; margin-bottom: 8px;">
              ${message.message}
            </div>
            <div style="font-size: 12px; color: #6B7280;">
              📚 Référence légale: ${message.article}
            </div>
            ${message.blocking ? `
              <div style="
                margin-top: 8px;
                padding: 4px 8px;
                background: ${message.color};
                color: white;
                display: inline-block;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
              ">
                🔒 BLOQUANT EN MODE AUDIT
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Export validation report
     */
    exportValidationReport(validation, calculationType) {
        return {
            calculationType,
            timestamp: new Date().toISOString(),
            valid: validation.valid,
            canProceed: validation.canProceed,
            summary: {
                totalErrors: validation.errors.length,
                totalWarnings: validation.warnings.length,
                totalInfo: validation.info.length,
                blockingErrors: validation.errors.filter(e => e.blocking).length
            },
            violations: [
                ...validation.errors.map(e => ({ ...e, type: 'ERROR' })),
                ...validation.warnings.map(w => ({ ...w, type: 'WARNING' })),
                ...validation.info.map(i => ({ ...i, type: 'INFO' }))
            ]
        };
    }
}

// Create global singleton instance
const ruleEngine = new RuleEngine(LegalReferenceDatabase);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RuleEngine, ruleEngine };
}
