/**
 * 🧙 IRPP WIZARD MODULE
 * Handles the step-by-step fiscal profile builder
 */

class IRPPWizard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.data = {
            situation: 'celibataire',
            enfants: 0,
            salaireBrut: 0,
            secteur: 'prive'
        };
        this.steps = [
            { id: 1, title: "wizard_title_1", field: 'situation' },
            { id: 2, title: "wizard_title_2", field: 'enfants' },
            { id: 3, title: "wizard_title_3", field: 'salaireBrut' },
            { id: 4, title: "wizard_title_4", field: 'confirm' }
        ];
    }

    init() {
        if (!this.container) return;
        this.render();
    }

    render() {
        const step = this.steps.find(s => s.id === this.currentStep);
        const t = (key) => (window.t ? window.t(key) : key);

        this.container.innerHTML = `
            <div class="wizard-step">
                <div class="wizard-progress">
                    ${this.steps.map(s => `
                        <div class="progress-step ${s.id === this.currentStep ? 'active' : (s.id < this.currentStep ? 'completed' : '')}"></div>
                    `).join('')}
                </div>
                <h3>${t(step.title)}</h3>
                <div class="wizard-content">
                    ${this.renderStepContent(step.id)}
                </div>
                <div class="wizard-nav" style="display: flex; justify-content: space-between; margin-top: 30px;">
                    ${this.currentStep > 1 ? `<button class="btn-secondary" onclick="irppWizard.prev()">${t('btn_back')}</button>` : '<div></div>'}
                    ${this.currentStep < this.steps.length
                ? `<button class="btn-primary" onclick="irppWizard.next()" style="width: auto; padding: 12px 30px;">${t('btn_continue')}</button>`
                : `<button class="btn-primary" onclick="irppWizard.finish()" style="width: auto; padding: 12px 30px;">${t('btn_finish')}</button>`
            }
                </div>
            </div>
        `;
    }

    renderStepContent(stepId) {
        const t = (key) => (window.t ? window.t(key) : key);
        switch (stepId) {
            case 1:
                return `
                    <div class="wizard-options-grid">
                        <div class="wizard-opt-card ${this.data.situation === 'celibataire' ? 'selected' : ''}" onclick="irppWizard.setData('situation', 'celibataire')">
                            <span style="font-size: 2rem;">👤</span>
                            <p>${t('opt_single')}</p>
                        </div>
                        <div class="wizard-opt-card ${this.data.situation === 'marie' ? 'selected' : ''}" onclick="irppWizard.setData('situation', 'marie')">
                            <span style="font-size: 2rem;">👫</span>
                            <p>${t('opt_married')}</p>
                        </div>
                    </div>
                `;
            case 2:
                return `
                    <div class="form-group">
                        <label>${t('label_children_charge')}</label>
                        <input type="number" class="form-control" value="${this.data.enfants}" onchange="irppWizard.setData('enfants', this.value)" min="0" max="10">
                    </div>
                `;
            case 3:
                return `
                    <div class="form-group">
                        <label>${t('label_salary_annual')}</label>
                        <input type="number" class="form-control" value="${this.data.salaireBrut}" onchange="irppWizard.setData('salaireBrut', this.value)" placeholder="ex: 24000">
                    </div>
                    <div class="form-group" style="margin-top: 20px;">
                        <label>${t('label_sector')}</label>
                        <select class="form-control" onchange="irppWizard.setData('secteur', this.value)">
                            <option value="prive" ${this.data.secteur === 'prive' ? 'selected' : ''}>${t('opt_prive_cnss')}</option>
                            <option value="public" ${this.data.secteur === 'public' ? 'selected' : ''}>${t('opt_public_cnrps')}</option>
                        </select>
                    </div>
                `;
            case 4:
                return `
                    <div class="glass-card" style="padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1);">
                        <p><strong>${t('label_situation')} :</strong> ${this.data.situation === 'celibataire' ? t('opt_single') : t('opt_married')}</p>
                        <p><strong>${t('label_children_count')} :</strong> ${this.data.enfants}</p>
                        <p><strong>${t('label_gross_income')} :</strong> ${this.data.salaireBrut} ${t('unit_dt')}</p>
                        <p><strong>${t('label_sector_short')} :</strong> ${this.data.secteur === 'prive' ? t('opt_prive') : t('opt_public')}</p>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); padding: 0 10px;">
                        ${t('msg_wizard_finish')}
                    </p>
                `;
        }
    }

    setData(key, value) {
        this.data[key] = value;
        this.render();
    }

    next() {
        if (this.currentStep < this.steps.length) {
            this.currentStep++;
            this.render();
        }
    }

    prev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    finish() {
        // Switch to the classic IRPP tab and fill data
        const container = document.getElementById('irpp-wizard');
        container.classList.add('hidden');

        // Populate the real IRPP form (assuming it's available)
        if (window.populateIRPP) {
            window.populateIRPP(this.data);
        }

        // Trigger calculation
        if (window.calculateIRPP) {
            window.calculateIRPP();
        }

        // Show result analysis via AI automatically
        if (window.shareWithAI) {
            window.shareWithAI({ module: 'IRPP', data: this.data });
        }
    }
}

// Global instance
const irppWizard = new IRPPWizard('irpp-wizard');
window.irppWizard = irppWizard;
