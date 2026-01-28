/**
 * Auto-Entrepreneur Module Logic
 * Based on LF 2026 and Decree-law 2020-33
 */

function initAutoEntrepreneur() {
    const container = document.getElementById('ae-container');
    if (!container) return;

    container.innerHTML = `
        <div class="form-section">
            <div class="section-title">
                <span class="icon">💼</span>
                <span data-i18n="label_ae_activity_section">Activité & Chiffre d'Affaires</span>
            </div>
            
            <div class="form-group">
                <label data-i18n="label_turnover_annual">Chiffre d'Affaires Annuel Estimé (DT)</label>
                <input type="number" id="ae-turnover" class="form-control" placeholder="Max 75,000 DT">
            </div>

            <div class="form-group">
                <label data-i18n="label_ae_activity">Secteur d'Activité</label>
                <select id="ae-activity" class="form-control">
                    <option value="services" data-i18n="opt_services">Services / Artisanat</option>
                    <option value="commerce" data-i18n="opt_commerce">Commerce / Industrie</option>
                </select>
            </div>

            <div class="checkbox-group">
                <input type="checkbox" id="ae-first-year">
                <label for="ae-first-year" data-i18n="label_ae_first_year">Première année d'activité (Exonération totale)</label>
            </div>
        </div>

        <button id="btn-calc-ae" class="btn-primary" style="width: 100%; margin-top: 15px;" data-i18n="btn_calc_ae">
            Calculer Contribution Unique
        </button>

        <div id="result-ae" style="margin-top: 20px;"></div>
    `;

    document.getElementById('btn-calc-ae').addEventListener('click', calculateAE);
}

async function calculateAE() {
    const turnover = parseFloat(document.getElementById('ae-turnover').value) || 0;
    const isFirstYear = document.getElementById('ae-first-year').checked;
    const activity = document.getElementById('ae-activity').value;
    const resultDiv = document.getElementById('result-ae');

    // I18N Helper
    const t = (key) => window.t ? window.t(key) : key;

    // LF 2026 RULES
    const RULES = {
        threshold: 75000,
        flat_cnss: 288.000,
        rates: {
            commerce: 0.005, // 0.5%
            services: 0.01   // 1%
        }
    };

    if (turnover > RULES.threshold) {
        resultDiv.innerHTML = `
            <div class="result-card" style="border-color: var(--error);">
                <h3 style="color: var(--error);" data-i18n="title_threshold_exceeded">${t('title_threshold_exceeded')}</h3>
                <p data-i18n="msg_ae_threshold_desc">${t('msg_ae_threshold_desc')}</p>
            </div>
        `;
        return;
    }

    // 1. Calculate Tax (Contribution Unique)
    const taxRate = RULES.rates[activity] || RULES.rates.commerce;
    let incomeTax = turnover * taxRate;

    // Apply First Year Exemption (Tax only)
    if (isFirstYear) {
        incomeTax = 0;
    }

    // 2. Fixed CNSS (Still due in first year)
    const socialSecurity = RULES.flat_cnss;

    // 3. Total
    const total = incomeTax + socialSecurity;

    const ratePct = (taxRate * 100).toString().replace('.', ',');

    resultDiv.innerHTML = `
        <div class="result-card">
            ${isFirstYear ? `
                <div style="background: rgba(34, 197, 94, 0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(34, 197, 94, 0.2); margin-bottom: 15px; font-size: 0.85rem; color: #4ade80;">
                    <strong data-i18n="title_ae_exo">${t('title_ae_exo')}</strong> : ${t('msg_ae_exo_desc')}
                </div>
            ` : ''}

            <div class="result-header">
                <h3 data-i18n="label_ae_total_contribution">${t('label_ae_total_contribution')}</h3>
                <span class="final-amount" style="color: var(--primary);">${total.toFixed(3)} DT</span>
            </div>
            
            <div style="margin-top: 15px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="opacity: 0.7;">${t('label_ae_tax_only').replace('{{rate}}', ratePct)} :</span>
                    <strong>${incomeTax.toFixed(3)} DT</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="opacity: 0.7;">${t('label_ae_social_short')} :</span>
                    <strong>${socialSecurity.toFixed(3)} DT</strong>
                </div>
            </div>

            <!-- Detailed Explanations -->
            <div style="margin-top: 20px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 15px;">
                <div style="color: #818cf8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;" data-i18n="label_ae_learn_more">
                    ${t('label_ae_learn_more')}
                </div>
                <ul style="font-size: 0.85rem; color: #94a3b8; padding-left: 18px; line-height: 1.6; margin: 0;">
                    <li style="margin-bottom: 6px;">${t('msg_ae_explain_tax').replace('{{rate}}', ratePct)}</li>
                    <li style="margin-bottom: 6px;">${t('msg_ae_explain_social')}</li>
                    <li>${t('msg_ae_explain_threshold')}</li>
                </ul>
            </div>

            <p style="font-size: 0.75em; opacity: 0.5; margin-top: 20px; font-style: italic;">
                ${t('msg_ae_footnote').replace('{{smig}}', '480')}
            </p>
        </div>
    `;
}

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    initAutoEntrepreneur();
});
