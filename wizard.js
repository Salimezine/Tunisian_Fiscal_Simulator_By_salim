/**
 * 🧙 IRPP WIZARD MODULE
 * Handles the step-by-step fiscal profile builder
 */

class IRPPWizard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0; // Index-based (0 to steps.length - 1)
        this.data = {
            profil: 'standard',
            situation: 'celibataire',
            enfants: 0,
            salaireBrut: 0,
            frequence: 'mensuel',
            secteur: 'prive',
            assuranceVie: 0,
            cea: 0
        };
        this.steps = [
            { id: 0, title: "wizard_step_option", field: 'profil' },
            { id: 1, title: "wizard_title_1", field: 'situation' },
            { id: 2, title: "wizard_title_2", field: 'enfants' },
            { id: 3, title: "wizard_title_3", field: 'salaireBrut' },
            { id: 5, title: "wizard_title_invest", field: 'invest' },
            { id: 4, title: "wizard_title_4", field: 'confirm' }
        ];
    }

    init() {
        if (!this.container) return;
        this.render();
    }

    render() {
        const step = this.steps[this.currentStep];
        const t = (key) => (window.t ? window.t(key) : key);

        if (!step) return;

        this.container.innerHTML = `
            <div class="wizard-step animate-slide-up">
                <div class="wizard-progress">
                    ${this.steps.map((s, idx) => `
                        <div class="progress-step ${idx === this.currentStep ? 'active' : (idx < this.currentStep ? 'completed' : '')}"></div>
                    `).join('')}
                </div>
                <h3>${t(step.title)}</h3>
                <div class="wizard-content">
                    ${this.renderStepContent(step.id)}
                </div>
                <div class="wizard-nav" style="display: flex; justify-content: space-between; margin-top: 30px;">
                    ${this.currentStep > 0 ? `<button class="btn-secondary" onclick="irppWizard.prev()">${t('btn_back')}</button>` : '<div></div>'}
                    ${this.currentStep < this.steps.length - 1
                ? `<button class="btn-primary" onclick="irppWizard.next()" style="width: auto; padding: 12px 30px;">${t('btn_continue')}</button>`
                : `<button class="btn-primary" onclick="irppWizard.finish()" style="width: auto; padding: 12px 30px;">${t('btn_finish')}</button>`
            }
                </div>
                <div style="text-align: center; margin-top: 20px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 15px;">
                    <a href="javascript:void(0)" onclick="irppWizard.skip()" style="font-size: 0.85rem; color: var(--accent); opacity: 0.7; text-decoration: none;">
                        ${t('btn_skip_wizard')}
                    </a>
                </div>
            </div>
        `;
    }

    skip() {
        const wizardContainer = document.getElementById('irpp-wizard');
        const irppContainer = document.getElementById('irpp-container');
        if (wizardContainer) wizardContainer.classList.add('hidden');
        if (irppContainer) {
            irppContainer.classList.remove('hidden');
            irppContainer.classList.add('animate-fade-in');
        }
    }

    renderStepContent(stepId) {
        const t = (key) => (window.t ? window.t(key) : key);
        switch (stepId) {
            case 0:
                return `
                    <div class="wizard-options-grid">
                        <div class="wizard-opt-card glass-effect ${this.data.profil === 'standard' ? 'selected' : ''}" onclick="irppWizard.setData('profil', 'standard')">
                            <span style="font-size: 2rem;">👤</span>
                            <p>${t('opt_wizard_standard')}</p>
                        </div>
                        <div class="wizard-opt-card glass-effect ${this.data.profil === 'startup' ? 'selected' : ''}" onclick="irppWizard.setData('profil', 'startup')">
                            <span style="font-size: 2rem;">🚀</span>
                            <p>${t('opt_wizard_startup')}</p>
                        </div>
                        <div class="wizard-opt-card glass-effect ${this.data.profil === 'zdr' ? 'selected' : ''}" onclick="irppWizard.setData('profil', 'zdr')">
                            <span style="font-size: 2rem;">📍</span>
                            <p>${t('opt_wizard_zdr')}</p>
                        </div>
                        <div class="wizard-opt-card glass-effect ${this.data.profil === 'investisseur' ? 'selected' : ''}" onclick="irppWizard.setData('profil', 'investisseur')">
                            <span style="font-size: 2rem;">🏦</span>
                            <p>${t('opt_wizard_investor')}</p>
                        </div>
                    </div>
                `;
            case 1:
                return `
                    <div class="wizard-options-grid">
                        <div class="wizard-opt-card glass-effect ${this.data.situation === 'celibataire' ? 'selected' : ''}" onclick="irppWizard.setData('situation', 'celibataire')">
                            <span style="font-size: 2rem;">👤</span>
                            <p>${t('opt_single')}</p>
                        </div>
                        <div class="wizard-opt-card glass-effect ${this.data.situation === 'marie' ? 'selected' : ''}" onclick="irppWizard.setData('situation', 'marie')">
                            <span style="font-size: 2rem;">👫</span>
                            <p>${t('opt_married')}</p>
                        </div>
                    </div>
                `;
            case 2:
                return `
                    <div class="form-group">
                        <label>${t('label_children_charge')}</label>
                        <input type="number" class="form-control" value="${this.data.enfants}" oninput="irppWizard.setData('enfants', this.value, true)" min="0" max="10">
                    </div>
                `;
            case 3:
                return `
                    <div class="form-group">
                        <label>${t('label_salary_monthly')}</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="number" class="form-control" style="flex: 2;" value="${this.data.salaireBrut}" oninput="irppWizard.setData('salaireBrut', this.value, true)" placeholder="ex: 2000">
                            <select class="form-control" style="flex: 1;" onchange="irppWizard.setData('frequence', this.value)">
                                <option value="mensuel" ${this.data.frequence === 'mensuel' ? 'selected' : ''}>${t('opt_monthly')}</option>
                                <option value="annuel" ${this.data.frequence === 'annuel' ? 'selected' : ''}>${t('opt_annual')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 20px;">
                        <label>${t('label_sector')}</label>
                        <select class="form-control" onchange="irppWizard.setData('secteur', this.value)">
                            <option value="prive" ${this.data.secteur === 'prive' ? 'selected' : ''}>${t('opt_prive_cnss')}</option>
                            <option value="public" ${this.data.secteur === 'public' ? 'selected' : ''}>${t('opt_public_cnrps')}</option>
                        </select>
                    </div>
                `;
            case 5:
                return `
                    <div class="form-group">
                        <label>Assurance Vie (Plafond 10k DT)</label>
                        <input type="number" class="form-control" value="${this.data.assuranceVie}" oninput="irppWizard.setData('assuranceVie', this.value, true)" placeholder="0">
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Compte Épargne Actions (CEA - Plafond 100k DT)</label>
                        <input type="number" class="form-control" value="${this.data.cea}" oninput="irppWizard.setData('cea', this.value, true)" placeholder="0">
                    </div>
                `;
            case 4:
                return `
                    <div class="glass-card" style="padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1);">
                        <p><strong>Profil :</strong> ${t('opt_wizard_' + this.data.profil)}</p>
                        <p><strong>${t('label_situation')} :</strong> ${this.data.situation === 'celibataire' ? t('opt_single') : t('opt_married')}</p>
                        <p><strong>${t('label_children_count')} :</strong> ${this.data.enfants}</p>
                        <p><strong>${t('label_salary_short')} :</strong> ${this.data.salaireBrut} ${t('unit_dt')} (${t('opt_' + this.data.frequence)})</p>
                        <p><strong>${t('label_sector_short')} :</strong> ${this.data.secteur === 'prive' ? t('opt_prive') : t('opt_public')}</p>
                        ${this.data.profil === 'investisseur' ? `
                            <p><strong>Assur. Vie :</strong> ${this.data.assuranceVie} DT</p>
                            <p><strong>CEA :</strong> ${this.data.cea} DT</p>
                        ` : ''}
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); padding: 0 10px;">
                        ${t('msg_wizard_finish')}
                    </p>
                `;
        }
    }

    setData(key, value, silent = false) {
        this.data[key] = value;
        if (!silent) this.render();
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            // Skip investment step (id 5) if not an investor
            if (this.steps[this.currentStep].id === 5 && this.data.profil !== 'investisseur') {
                return this.next(); // Recursive skip to next valid step
            }
            this.render();
        }
    }

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            // Skip investment step (id 5) if not an investor
            if (this.steps[this.currentStep].id === 5 && this.data.profil !== 'investisseur') {
                return this.prev(); // Recursive skip back to next valid step
            }
            this.render();
        }
    }

    finish() {
        const container = document.getElementById('irpp-wizard');
        container.classList.add('hidden');

        // Map Profil to IRPP Sections
        if (this.data.profil === 'startup') {
            // No direct field in Standard IRPP? 
            // We might need to handle this via AI or a hidden field
        }

        // Populate the real IRPP form
        if (window.populateIRPP) {
            window.populateIRPP(this.data);
        }

        // Handle specific investments
        if (this.data.profil === 'investisseur') {
            const extraDeductionInput = document.getElementById('autreDeduction');
            if (extraDeductionInput) {
                // Approximate: Summing deductions (real IRPP logic for CEA/Assur is complex)
                extraDeductionInput.value = (parseFloat(this.data.assuranceVie) || 0) + (parseFloat(this.data.cea) || 0);
            }
        }

        // Trigger calculation
        if (window.calculateIRPP) {
            window.calculateIRPP();
        }

        // Show result analysis via AI automatically
        if (window.shareWithAI) {
            window.shareWithAI({
                module: 'IRPP',
                data: this.data,
                context: `Profil: ${this.data.profil}`
            });
        }
    }
}

// Global instance
const irppWizard = new IRPPWizard('irpp-wizard');
window.irppWizard = irppWizard;
