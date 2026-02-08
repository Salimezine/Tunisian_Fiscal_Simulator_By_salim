/**
 * 📊 DASHBOARD MODULE
 * Orchestrates the central summary view
 */

class DashboardManager {
    constructor() {
        this.containerId = 'dashboard-container';
    }

    init() {
        this.update();
    }

    update() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const results = this.collectAllResults();

        if (Object.keys(results).length === 0) {
            this.renderEmptyState(container);
        } else {
            this.renderDashboard(container, results);
        }
    }

    collectAllResults() {
        const results = {};
        if (window.lastIRPPResult) results.irpp = window.lastIRPPResult;
        if (window.lastISResult) results.is = window.lastISResult;
        if (window.lastTVAResult) results.tva = window.lastTVAResult;
        return results;
    }

    renderEmptyState(container) {
        const t = (key) => (window.t ? window.t(key) : key);
        container.innerHTML = `
            <div class="dashboard-grid animate-fade-in">
                <div class="glass-card welcome-card">
                    <div class="card-icon">🚀</div>
                    <h3 data-i18n="welcome_title">${t('welcome_title')}</h3>
                    <p data-i18n="welcome_msg">${t('welcome_msg')}</p>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                        <button class="btn-primary" onclick="switchTab('irpp')" style="width: auto;">👤 IRPP</button>
                        <button class="btn-primary" onclick="switchTab('is')" style="width: auto; background: var(--secondary-hue)">🏢 IS</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboard(container, results) {
        const t = (key) => (window.t ? window.t(key) : key);
        let cardsHtml = '';

        if (results.irpp) {
            cardsHtml += `
                <div class="dashboard-card animate-slide-up premium-pulse">
                    <div class="card-icon">👤</div>
                    <div class="card-label">${t('label_total_tax_irpp')}</div>
                    <div class="card-value">${Math.round(results.irpp.irppBrut).toLocaleString()} DT</div>
                    <div class="card-label">${t('label_monthly_net')} : ${Math.round(results.irpp.netMensuel).toLocaleString()} DT</div>
                    <button class="btn-secondary" onclick="switchTab('irpp')" style="margin-top: 10px; font-size: 0.8rem;">${t('btn_details')}</button>
                </div>
            `;
        }

        if (results.is) {
            cardsHtml += `
                <div class="dashboard-card animate-slide-up" style="animation-delay: 0.1s">
                    <div class="card-icon">🏢</div>
                    <div class="card-label">${t('label_total_tax_is')}</div>
                    <div class="card-value">${Math.round(results.is.isPayable).toLocaleString()} DT</div>
                    <div class="card-label">Taux effectif : ${((results.is.isPayable / results.is.beneficeNet) * 100).toFixed(1)}%</div>
                    <button class="btn-secondary" onclick="switchTab('is')" style="margin-top: 10px; font-size: 0.8rem;">${t('btn_details')}</button>
                </div>
            `;
        }

        if (results.tva) {
            cardsHtml += `
                <div class="dashboard-card animate-slide-up" style="animation-delay: 0.2s">
                    <div class="card-icon">💸</div>
                    <div class="card-label">${t('label_tva_payable')}</div>
                    <div class="card-value">${Math.round(results.tva.tvaNet).toLocaleString()} DT</div>
                    <div class="card-label">CA Hors Taxe : ${Math.round(results.tva.caHta).toLocaleString()} DT</div>
                    <button class="btn-secondary" onclick="switchTab('tva')" style="margin-top: 10px; font-size: 0.8rem;">${t('btn_details')}</button>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="dashboard-grid">
                ${cardsHtml}
            </div>
            <div class="animate-fade-in" style="margin-top: 30px; text-align: center; border-top: 1px solid var(--glass-border); padding-top: 20px;">
                <p style="font-size: 0.9rem; color: var(--text-muted);">${t('msg_dashboard_complete')}</p>
            </div>
        `;
    }
}

// Global instance
const dashboardManager = new DashboardManager();
window.dashboardManager = dashboardManager;
window.updateDashboard = () => dashboardManager.update();
