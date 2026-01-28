// ============================================================
// IF - IMPÔT SUR LA FORTUNE 2026
// Loi de Finances Tunisienne 2026
// ============================================================

function initISF() {
    const container = document.getElementById('isf-container');
    if (!container) return;

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    container.innerHTML = `
        <div class="glass-card" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); margin-bottom: 20px;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:1.5em;">⚠️</span>
                <div>
                    <strong style="color: #ef4444;" data-i18n="module_isf_title">Impôt sur la Fortune (IF) - LF 2026</strong>
                    <p style="font-size: 0.85em; opacity: 0.9; margin:5px 0 0 0;" data-i18n="module_isf_desc">
                        Le nouvel Impôt sur la Fortune (IF) porte sur le patrimoine net global dépassant 3 Millions DT.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section 1: Patrimoine Immobilier -->
        <div class="form-section" style="border-left: 4px solid #8b5cf6;">
            <div class="section-title">
                <span class="icon">🏠</span>
                <span data-i18n="label_real_estate">Patrimoine Immobilier</span>
            </div>
            
            <div class="form-group">
                <label data-i18n="label_real_estate_total">Valeur totale des biens immobiliers (DT)</label>
                <input type="number" id="immoTotal" class="form-control" data-i18n="placeholder_real_estate" placeholder="Terrains, villas, appartements...">
                <div class="help-text" data-i18n="help_real_estate_exempt"><strong>Exonération :</strong> Résidence principale et biens à usage professionnel.</div>
            </div>
        </div>

        <!-- Section 2: Patrimoine Mobilier -->
        <div class="form-section" style="border-left: 4px solid #3b82f6;">
            <div class="section-title">
                <span class="icon">💰</span>
                <span data-i18n="label_movable_assets">Patrimoine Mobilier & Valeurs</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_placements">Placements (hors dépôts bancaires TN)</label>
                    <input type="number" id="mobilierLiquide" class="form-control" data-i18n="placeholder_placements" placeholder="Compte chèque étranger, Espèces coffre...">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_intangibles">Valeurs Incorporelles (DT)</label>
                    <input type="number" id="mobilierIncorporel" class="form-control" data-i18n="placeholder_intangibles" placeholder="Actions, parts sociales, brevets...">
                </div>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_luxury_vehicles">Véhicules de Luxe (> 12 CV)</label>
                    <input type="number" id="mobilierLuxe" class="form-control" data-i18n="placeholder_vehicles" placeholder="Voitures, bateaux...">
                    <div class="help-text" data-i18n="help_vehicles_exempt">Les véhicules ≤ 12 CV sont exonérés.</div>
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_jewelry_art">Bijoux & Objets d'art (DT)</label>
                    <input type="number" id="mobilierAutres" class="form-control" placeholder="0.000">
                </div>
            </div>
            
            <div class="info-bubble" style="font-size: 0.8em; margin-top: 5px;" data-i18n="info_children_assets">
                💡 <strong>Rappel Art. 88 :</strong> Le patrimoine des enfants mineurs est agrégé à celui du tuteur.
            </div>
        </div>

        <!-- Section 3: Passif -->
        <div class="form-section" style="border-left: 4px solid var(--warning);">
            <div class="section-title">
                <span class="icon">📉</span>
                <span data-i18n="label_liabilities">Passif (Dettes déductibles)</span>
            </div>
            
            <div class="form-group">
                <label data-i18n="label_total_debts">Total des dettes justifiées (DT)</label>
                <input type="number" id="passifDettes" class="form-control" data-i18n="placeholder_debts" placeholder="Crédits immobiliers, dettes fiscales...">
                <div class="help-text" data-i18n="help_debts_deductible">Uniquement les dettes liées aux biens imposables.</div>
            </div>
        </div>

        <button id="btn-calc-if" class="btn-primary" style="background: linear-gradient(135deg, #8b5cf6, #6366f1);" data-i18n="btn_calc_isf">
            <span class="icon">💎</span> Calculer IF 2026
        </button>
        <div id="result-if"></div>
    `;

    document.getElementById('btn-calc-if').addEventListener('click', calculateIF);
}

function calculateIF() {
    const immo = parseFloat(document.getElementById('immoTotal').value) || 0;
    const liquide = parseFloat(document.getElementById('mobilierLiquide').value) || 0;
    const incorporel = parseFloat(document.getElementById('mobilierIncorporel').value) || 0;
    const luxe = parseFloat(document.getElementById('mobilierLuxe').value) || 0;
    const autres = parseFloat(document.getElementById('mobilierAutres').value) || 0;
    const dettes = parseFloat(document.getElementById('passifDettes').value) || 0;

    const patrimoineBrut = immo + liquide + incorporel + luxe + autres;
    const patrimoineNet = Math.max(0, patrimoineBrut - dettes);

    let isfDu = 0;
    let trancheKey = "";

    if (patrimoineNet <= 3000000) {
        isfDu = 0;
        trancheKey = "isf_tranche_0"; // "Non imposable (< 3M DT)"
    } else if (patrimoineNet <= 5000000) {
        isfDu = patrimoineNet * 0.005;
        trancheKey = "isf_tranche_1"; // "Tranche 1 (0,5%)"
    } else {
        isfDu = patrimoineNet * 0.01;
        trancheKey = "isf_tranche_2"; // "Tranche 2 (1%)"
    }

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    const resultDiv = document.getElementById('result-if');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid #8b5cf6;">
            <div class="result-header">
                <span data-i18n="res_isf_due">${t('res_isf_due')}</span>
                <span class="final-amount" style="color: #a78bfa;">${isfDu.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.95em;">
                    <div>
                        <span style="opacity:0.7">${t('label_gross_assets')} :</span>
                        <strong style="float:right">${patrimoineBrut.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">${t('label_liabilities')} :</span>
                        <strong style="float:right; color: var(--warning)">- ${dettes.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 5px;">
                        <span style="font-weight: 600;">${t('label_net_taxable')} :</span>
                        <strong style="float:right; color: #a78bfa; font-size: 1.2em;">${patrimoineNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <div style="padding: 12px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500;">${t('label_status')} :</span>
                    <span class="badge" style="background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 20px;">${t(trancheKey)}</span>
                </div>
            </div>

            <div style="margin-top: 20px; font-size: 0.8em; opacity: 0.7; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 6px;">
                <p><strong>📌 ${t('label_isf_reminders_title')} :</strong></p>
                <ul style="padding-left: 15px; margin-top: 5px;" data-i18n="isf_reminders_list">
                    <li>Exclusions: Résidence principale, biens pro, épargne bancaire.</li>
                    <li>Déclaration annuelle avant le 30 juin.</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="btn-explain-isf" class="btn-primary" style="flex: 2; background: var(--primary-gradient);">
                    <span class="icon">🤖</span> <span data-i18n="label_explain_results">${t("label_explain_results")}</span>
                </button>
                <button onclick="window.print()" class="btn-primary" style="flex: 1; background: var(--accent);">
                    <span class="icon">📄</span> <span data-i18n="btn_print">${t("btn_print")}</span>
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-explain-isf').addEventListener('click', () => {
        if (window.askAssistant) window.askAssistant(t("chat_suggest_bilan"));
    });

    // Global Sync
    window.lastCalculation = {
        type: 'IF',
        totalTax: isfDu,
        data: {
            patrimoineBrut,
            patrimoineNet,
            isfDu
        }
    };
    if (window.shareWithAI) window.shareWithAI(window.lastCalculation);
}
