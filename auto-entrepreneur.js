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
                <span data-i18n="label_situation">Activité & Chiffre d'Affaires</span>
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
                <label for="ae-first-year">Première année d'activité (Exonération totale)</label>
            </div>
        </div>

        <button id="btn-calc-ae" class="btn-primary" style="width: 100%; margin-top: 15px;">
            Calculer Contribution Unique
        </button>

        <div id="result-ae" style="margin-top: 20px;"></div>
    `;

    document.getElementById('btn-calc-ae').addEventListener('click', calculateAE);
}

async function calculateAE() {
    const turnover = parseFloat(document.getElementById('ae-turnover').value) || 0;
    const isFirstYear = document.getElementById('ae-first-year').checked;
    const resultDiv = document.getElementById('result-ae');

    // Fetch rates from the JSON file
    let rates;
    try {
        const response = await fetch('data/autaux.json');
        const data = await response.json();
        rates = data.auto_entrepreneur;
    } catch (e) {
        console.error("Erreur chargement rates AE:", e);
        // Fallback
        rates = {
            rates: { income_tax: 0.005, social_security: 0.075, smig_2026_estimated: 480 },
            thresholds: { max_turnover: 75000 }
        };
    }

    if (turnover > 75000) {
        resultDiv.innerHTML = `
            <div class="result-card" style="border-color: var(--error);">
                <h3 style="color: var(--error);">⚠️ Seuil Dépassé</h3>
                <p>Le régime Auto-Entrepreneur est limité à un CA de <strong>75,000 DT</strong>. 
                Vous devez opter pour le régime Réel ou Forfaitaire.</p>
            </div>
        `;
        return;
    }

    if (isFirstYear) {
        resultDiv.innerHTML = `
            <div class="result-card" style="border-color: var(--success);">
                <h3 style="color: var(--success);">✨ Exonération Totale</h3>
                <p>Pour la première année d'activité, vous êtes exonéré de la contribution unique 
                et des charges sociales (Prises en charge par l'État).</p>
                <div style="font-size: 1.5rem; font-weight: 800; text-align: center; margin: 15px 0;">0.000 DT</div>
            </div>
        `;
        return;
    }

    // Calculation:
    // 1. Income Tax (Contribution Unique) = 0.5% of turnover
    const incomeTax = turnover * rates.rates.income_tax;

    // 2. Social Security = 7.5% of (2/3 of SMIG * 12)
    // Based on user prompt: 7.5% de 2/3 de SMIG
    const smigAnnual = rates.rates.smig_2026_estimated * 12;
    const socialBase = (2 / 3) * smigAnnual;
    const socialSecurity = socialBase * rates.rates.social_security;

    const total = incomeTax + socialSecurity;

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <h3>Contribution Unique Totale</h3>
                <span class="final-amount" style="color: var(--primary);">${total.toFixed(3)} DT</span>
            </div>
            
            <div style="margin-top: 15px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Impôt (0.5% du CA) :</span>
                    <strong>${incomeTax.toFixed(3)} DT</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="opacity: 0.7;">Charges Sociales (CNSS) :</span>
                    <strong>${socialSecurity.toFixed(3)} DT</strong>
                </div>
            </div>

            <p style="font-size: 0.85em; opacity: 0.6; margin-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px;">
                * Les charges sociales sont calculées sur la base de 2/3 du SMIG (Estimation 2026: ${rates.rates.smig_2026_estimated} DT/mois).
            </p>
        </div>
    `;
}

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    initAutoEntrepreneur();
});
