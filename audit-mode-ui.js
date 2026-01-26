/**
 * Audit Mode UI Components
 * 
 * Provides UI components for mode selection, Finance Law version selection,
 * and audit status display.
 */

class AuditModeUI {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the audit mode UI
   */
  initialize() {
    if (this.initialized) return;

    // Initialize Audit Mode Context
    try {
      if (!calculationContext.initialized) {
        calculationContext.initialize('audit', '2026');
        this.enableCalculator();
      }
    } catch (error) {
      console.error('Initialization failed:', error);
    }

    // Inject Hero Banner - DISABLED (Simplified/Professional View)
    // this.injectAuditHero();

    this.initialized = true;
    console.log('✅ Audit Mode UI initialized (Silent Expert Mode)');
  }

  /**
   * Inject Audit Hero Banner (Static Expert Mode)
   */
  injectAuditHero() {
    const container = document.querySelector('.glass-card');
    if (!container) return;

    const heroHTML = `
      <div class="audit-hero-banner" style="
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.6));
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        animation: slideDown 0.5s ease-out;
      ">
        <div style="
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        ">
          🔒
        </div>
        
        <div style="flex: 1;">
          <h3 style="color: white; margin-bottom: 5px; font-size: 1.2rem; display: flex; align-items: center; gap: 10px;">
            Mode Expert : Audit Fiscal 2026
            <span style="font-size: 0.7em; background: rgba(16, 185, 129, 0.2); color: #34D399; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
              Activé
            </span>
          </h3>
          <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.4;">
            Configuration stricte conforme à la Loi de Finances 2026 (JORT n°148). 
            <br>Validation juridique active pour tous les calculs.
          </p>
        </div>

        <div style="text-align: right; border-left: 1px solid rgba(255, 255, 255, 0.1); padding-left: 20px;">
          <div style="font-size: 0.8rem; color: #64748B; margin-bottom: 5px;">RÉFÉRENCE</div>
          <div style="color: #60A5FA; font-weight: 600; font-family: monospace;">LF-2026-STRICT</div>
        </div>
      </div>
      
      <style>
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    `;

    // Insert before tabs navigation
    const tabsNav = container.querySelector('.tabs-nav');
    if (tabsNav) {
      tabsNav.insertAdjacentHTML('beforebegin', heroHTML);
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const modeCards = document.querySelectorAll('.mode-card');
    const confirmButton = document.getElementById('confirm-mode-selection');
    const financeLawSelect = document.getElementById('finance-law-version');

    let selectedMode = null;

    // Mode card selection
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        selectedMode = card.dataset.mode;

        // Visual feedback
        modeCards.forEach(c => {
          c.style.opacity = '0.5';
          c.style.transform = 'scale(0.98)';
        });

        card.style.opacity = '1';
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';

        // Enable confirm button
        if (confirmButton) {
          confirmButton.disabled = false;
          confirmButton.style.opacity = '1';
          confirmButton.style.pointerEvents = 'auto';
          confirmButton.innerHTML = selectedMode === 'audit'
            ? '🔒 Confirmer Mode Audit Fiscal'
            : '🎓 Confirmer Mode Simulation';
        }
      });
    });

    // Confirm mode selection
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        if (!selectedMode) return;

        const financeLawVersion = financeLawSelect.value;

        // Initialize calculation context
        try {
          calculationContext.initialize(selectedMode, financeLawVersion);

          // Show success status
          this.showModeStatus(selectedMode, financeLawVersion);

          // Hide mode selection, show status
          document.querySelector('.audit-mode-controls').style.display = 'none';
          this.createModeBadge(selectedMode, financeLawVersion);

          // Enable calculator
          this.enableCalculator();

        } catch (error) {
          console.error('Error initializing calculation context:', error);
          alert('Erreur lors de l\'initialisation du mode: ' + error.message);
        }
      });
    }

    // Finance Law version change listener
    if (financeLawSelect) {
      financeLawSelect.addEventListener('change', () => {
        if (calculationContext.initialized) {
          const newVersion = financeLawSelect.value;
          calculationContext.changeFinanceLawVersion(newVersion);
          this.updateModeBadge();
        }
      });
    }
  }

  /**
   * Show mode status
   */
  showModeStatus(mode, version) {
    const statusDiv = document.getElementById('mode-status');
    if (!statusDiv) return;

    const modeConfig = modeManager.getModeConfig(mode);

    statusDiv.innerHTML = `
      <div style="--mode-color: ${modeConfig.color}; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 2em;">${modeConfig.icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: var(--mode-color); margin-bottom: 4px;">
            ${modeConfig.label}
          </div>
          <div style="font-size: 0.85em; color: var(--text-muted);">
            Loi de Finances ${version} | ${modeConfig.description}
          </div>
        </div>
        <button onclick="auditModeUI.resetMode()" class="change-mode-btn">
          Changer
        </button>
      </div>
    `;

    statusDiv.style.display = 'block';
  }

  /**
   * Create mode badge in header
   */
  createModeBadge(mode, version) {
    const header = document.querySelector('.main-header');
    if (!header) return;

    const modeConfig = modeManager.getModeConfig(mode);

    const badgeHTML = `
      <div id="mode-badge-header" class="mode-badge-header" style="--mode-color: ${modeConfig.color}; border-color: var(--mode-color); background: color-mix(in srgb, var(--mode-color), transparent 85%);">
        <span style="font-size: 1.5em;">${modeConfig.icon}</span>
        <div>
          <div style="font-weight: 600; color: var(--mode-color);">
            ${modeConfig.label}
          </div>
          <div style="font-size: 0.85em; color: var(--text-muted);">
            Loi de Finances ${version}
          </div>
        </div>
      </div>
    `;

    header.insertAdjacentHTML('beforeend', badgeHTML);
  }

  /**
   * Update mode badge when version changes
   */
  updateModeBadge() {
    const badge = document.getElementById('mode-badge-header');
    if (badge) {
      badge.remove();
    }

    const context = calculationContext.getContextSummary();
    this.createModeBadge(context.mode, context.financeLawVersion);
  }

  /**
   * Enable calculator functionality
   */
  enableCalculator() {
    // Remove any disabled states from tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.disabled = false;
      tab.style.opacity = '1';
    });

    console.log('✅ Calculator enabled');
  }

  /**
   * Reset mode selection
   */
  resetMode() {
    if (confirm('Voulez-vous vraiment changer de mode de calcul? Tous les calculs en cours seront perdus.')) {
      calculationContext.reset();
      location.reload();
    }
  }
}

// Create global instance
const auditModeUI = new AuditModeUI();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => auditModeUI.initialize());
} else {
  auditModeUI.initialize();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuditModeUI, auditModeUI };
}
