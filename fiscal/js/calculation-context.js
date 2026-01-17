/**
 * Calculation Context Manager
 * 
 * Manages the state and context of fiscal calculations including:
 * - Calculation mode (Audit vs Simulation)
 * - Finance Law version selection
 * - User session and preferences
 * - Calculation history and versioning
 * 
 * This is the central state manager for audit-ready calculations.
 */

class CalculationContext {
    constructor() {
        this.mode = null; // 'audit' or 'simulation'
        this.financeLawVersion = '2026'; // Default to current year
        this.sessionId = this.generateSessionId();
        this.calculationHistory = [];
        this.userPreferences = this.loadUserPreferences();
        this.initialized = false;
    }

    /**
     * Generate a unique session ID for tracking
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `SESSION_${timestamp}_${random}`;
    }

    /**
     * Initialize the calculation context (must be called before any calculation)
     */
    initialize(mode, financeLawVersion = '2026') {
        if (!mode || !['audit', 'simulation'].includes(mode)) {
            throw new Error('Mode must be either "audit" or "simulation"');
        }

        if (!['2024', '2025', '2026'].includes(financeLawVersion)) {
            throw new Error('Finance Law version must be 2024, 2025, or 2026');
        }

        this.mode = mode;
        this.financeLawVersion = financeLawVersion;
        this.initialized = true;

        console.log(`✅ Calculation Context Initialized:`, {
            mode: this.mode,
            financeLawVersion: this.financeLawVersion,
            sessionId: this.sessionId
        });

        return {
            success: true,
            mode: this.mode,
            financeLawVersion: this.financeLawVersion,
            sessionId: this.sessionId
        };
    }

    /**
     * Check if context is properly initialized before calculation
     */
    ensureInitialized() {
        if (!this.initialized) {
            throw new Error('Calculation context not initialized. Please select mode and Finance Law version first.');
        }
    }

    /**
     * Get current mode
     */
    getMode() {
        return this.mode;
    }

    /**
     * Get Finance Law version
     */
    getFinanceLawVersion() {
        return this.financeLawVersion;
    }

    /**
     * Check if in Audit mode
     */
    isAuditMode() {
        return this.mode === 'audit';
    }

    /**
     * Check if in Simulation mode
     */
    isSimulationMode() {
        return this.mode === 'simulation';
    }

    /**
     * Change Finance Law version (will affect all subsequent calculations)
     */
    changeFinanceLawVersion(version) {
        if (!['2024', '2025', '2026'].includes(version)) {
            throw new Error('Invalid Finance Law version');
        }

        const oldVersion = this.financeLawVersion;
        this.financeLawVersion = version;

        console.log(`📊 Finance Law version changed from ${oldVersion} to ${version}`);

        return {
            success: true,
            oldVersion,
            newVersion: version
        };
    }

    /**
     * Change calculation mode
     */
    changeMode(newMode) {
        if (!['audit', 'simulation'].includes(newMode)) {
            throw new Error('Invalid mode');
        }

        const oldMode = this.mode;
        this.mode = newMode;

        console.log(`🔄 Mode changed from ${oldMode} to ${newMode}`);

        return {
            success: true,
            oldMode,
            newMode
        };
    }

    /**
     * Add calculation to history
     */
    addToHistory(calculationType, inputs, result, auditLog) {
        const historyEntry = {
            id: this.generateCalculationId(),
            timestamp: new Date().toISOString(),
            calculationType, // 'irpp', 'is', 'tva', etc.
            mode: this.mode,
            financeLawVersion: this.financeLawVersion,
            inputs,
            result,
            auditLogId: auditLog ? auditLog.id : null
        };

        this.calculationHistory.push(historyEntry);

        // Keep only last 50 calculations in memory
        if (this.calculationHistory.length > 50) {
            this.calculationHistory = this.calculationHistory.slice(-50);
        }

        return historyEntry;
    }

    /**
     * Generate unique calculation ID
     */
    generateCalculationId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `CALC_${timestamp}_${random}`;
    }

    /**
     * Get calculation history
     */
    getHistory(calculationType = null) {
        if (calculationType) {
            return this.calculationHistory.filter(entry => entry.calculationType === calculationType);
        }
        return this.calculationHistory;
    }

    /**
     * Clear calculation history
     */
    clearHistory() {
        this.calculationHistory = [];
        console.log('🗑️ Calculation history cleared');
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        try {
            const stored = localStorage.getItem('fiscalSimulatorPreferences');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }

        // Default preferences
        return {
            defaultMode: 'simulation',
            defaultFinanceLawVersion: '2026',
            showLegalWarnings: true,
            autoSaveAuditLogs: true
        };
    }

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        try {
            localStorage.setItem('fiscalSimulatorPreferences', JSON.stringify(this.userPreferences));
            console.log('✅ User preferences saved');
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }

    /**
     * Get context summary for display
     */
    getContextSummary() {
        return {
            sessionId: this.sessionId,
            mode: this.mode,
            modeLabel: this.mode === 'audit' ? '🔒 Mode Audit' : '🎓 Mode Simulation',
            financeLawVersion: this.financeLawVersion,
            financeLawLabel: `Loi de Finances ${this.financeLawVersion}`,
            initialized: this.initialized,
            calculationCount: this.calculationHistory.length
        };
    }

    /**
     * Reset context (for new session)
     */
    reset() {
        this.mode = null;
        this.initialized = false;
        this.sessionId = this.generateSessionId();
        this.clearHistory();
        console.log('🔄 Calculation context reset');
    }

    /**
     * Export context state (for debugging or backup)
     */
    exportState() {
        return {
            sessionId: this.sessionId,
            mode: this.mode,
            financeLawVersion: this.financeLawVersion,
            initialized: this.initialized,
            calculationHistory: this.calculationHistory,
            userPreferences: this.userPreferences,
            exportedAt: new Date().toISOString()
        };
    }
}

// Create global singleton instance
const calculationContext = new CalculationContext();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CalculationContext, calculationContext };
}
