// RETENUES À LA SOURCE (RS) 2026
// RS - RETENUE À LA SOURCE - LF 2026

const RS_RATES = [
    { id: 'rs_is_1', lang_key: 'rs_rate_1', rate: 0.01, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_1_5', lang_key: 'rs_rate_1_5', rate: 0.015, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_5', lang_key: 'rs_rate_5', rate: 0.05, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_10', lang_key: 'rs_rate_10', rate: 0.10, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_15', lang_key: 'rs_rate_15', rate: 0.15, type: 'is_irpp', base: 'HT' },
    { id: 'rs_tva_25', lang_key: 'rs_tva_25', rate: 0.25, type: 'tva', base: 'TVA' },
    { id: 'rs_tva_100', lang_key: 'rs_tva_100', rate: 1.00, type: 'tva', base: 'TVA' }
];

function initRS() {
    const container = document.getElementById('rs-container');
    if (!container) return;

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Generate options dynamically
    const optionsIsIrpp = RS_RATES.filter(r => r.type === 'is_irpp').map(r =>
        `<option value="${r.id}">${t(r.lang_key)} (${(r.rate * 100).toFixed(parseFloat(r.rate) < 0.02 ? 1 : 0)}%)</option>`
    ).join('');

    const optionsTva = RS_RATES.filter(r => r.type === 'tva').map(r =>
        `<option value="${r.id}">${t(r.lang_key)}</option>`
    ).join('');


    container.innerHTML = `
        <div class="glass-card" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); margin-bottom: 20px;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:1.5em;">🧾</span>
                <div>
                    <strong style="color: #34d399;" data-i18n="module_rs_title">Module de Trésorerie : Retenue à la Source & TEJ</strong>
                    <p style="font-size: 0.85em; opacity: 0.9; margin:5px 0 0 0;" data-i18n="module_rs_desc">
                        Calculez les montants Nets à Payer et gérez vos retenues via la plateforme obligatoire TEJ.
                    </p>
                </div>
            </div>
        </div>

        <div class="form-section glass-effect animate-slide-up" style="padding: 25px; margin-bottom: 20px;">
            <div class="section-title">
                <span class="icon">⚙️</span>
                <span data-i18n="label_transaction_params">Paramètres de la Transaction</span>
            </div>
            
            <div class="form-group">
                <label data-i18n="label_operation_nature">Nature de l'Opération</label>
                <select id="natureRS" class="form-control">
                    <optgroup label="${t('label_rs_is_irpp')}">
                        ${optionsIsIrpp}
                    </optgroup>
                    <optgroup label="${t('label_rs_tva')}">
                        ${optionsTva}
                    </optgroup>
                </select>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_amount_ht">Montant Brut (HT) (DT)</label>
                    <input type="number" id="brutHT_RS" class="form-control" placeholder="0.000">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_tva_rate">Taux TVA applicable (%)</label>
                    <select id="tauxTVA_RS" class="form-control">
                        <option value="0.19">19% (${t('rate_standard')})</option>
                        <option value="0.07">7% (${t('rate_reduced')})</option>
                        <option value="0.13">13% (${t('rate_intermediate')})</option>
                        <option value="0">0% (${t('rate_exempt')})</option>
                    </select>
                </div>
            </div>
        </div>

        <button id="btn-calc-rs" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669);" data-i18n="btn_calc_net">
            <span class="icon">🧮</span> Calculer Net à Payer
        </button>

        <div id="result-rs"></div>
    `;

    document.getElementById('btn-calc-rs').addEventListener('click', calculateRS);
}

function calculateRS() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    const brutHT = parseFloat(document.getElementById('brutHT_RS').value) || 0;
    const tauxTVA = parseFloat(document.getElementById('tauxTVA_RS').value) || 0;
    const natureId = document.getElementById('natureRS').value;
    const nature = RS_RATES.find(r => r.id === natureId);

    const tvaAmount = brutHT * tauxTVA;
    const brutTTC = brutHT + tvaAmount;

    let rsAmount = 0;
    let detailRS = "";
    let baseDetail = "";

    if (nature.type === 'is_irpp') {
        const baseCalcul = (nature.base === 'TTC') ? brutTTC : brutHT;
        rsAmount = baseCalcul * nature.rate;
        // e.g. "RS IRPP/IS (5% sur HT)"
        detailRS = `RS IRPP/IS (${(nature.rate * 100).toFixed(parseFloat(nature.rate) < 0.02 ? 1 : 0)}% ${t('label_on')} ${nature.base})`;
        baseDetail = nature.base;
    } else if (nature.type === 'tva') {
        rsAmount = tvaAmount * nature.rate;
        detailRS = `RS TVA (${(nature.rate * 100).toFixed(0)}% ${t('label_of_tva')})`;
        baseDetail = "TVA";
    }

    const netAPayer = brutTTC - rsAmount;

    // Affichage de l'alerte assiette si base == TTC
    const resultDiv = document.getElementById('result-rs');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid #10b981;">
            <div class="result-header">
                <span data-i18n="res_net_to_pay">${t('res_net_to_pay')}</span>
                <span class="final-amount" style="color: #34d399;">${netAPayer.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
                <div style="display: grid; gap: 8px; font-size: 0.9em;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${t('label_amount_ht')} :</span>
                        <span>${brutHT.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>TVA (${(tauxTVA * 100).toFixed(0)}%) :</span>
                        <span>+ ${tvaAmount.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:600; padding:5px 0; border-top:1px solid rgba(255,255,255,0.1);">
                        <span>${t('label_total_ttc')} :</span>
                        <span>${brutTTC.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; color: #fb7185; font-weight:600;">
                        <span>${detailRS} :</span>
                        <span>- ${rsAmount.toLocaleString('fr-TN')} DT</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="btn-explain-rs" class="btn-primary" style="flex: 2; background: var(--primary-gradient);">
                    <span class="icon">🤖</span> <span data-i18n="label_explain_results">${t("label_explain_results")}</span>
                </button>
                <button id="btn-print-rs" class="btn-primary" style="flex: 1; background: var(--accent);">
                    <span class="icon">📄</span> <span data-i18n="btn_print">${t("btn_print")}</span>
                </button>
            </div>

            <!-- Export Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="btn-export-pdf-rs" class="btn-secondary" style="flex: 1; border: 1px solid var(--primary); color: var(--primary);">
                    <span class="icon">📄</span> PDF
                </button>
                <button id="btn-export-excel-rs" class="btn-secondary" style="flex: 1; border: 1px solid #10b981; color: #10b981;">
                    <span class="icon">📊</span> Excel
                </button>
            </div>
            
            <div id="assiette-warning" class="hidden" style="margin-top: 10px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 3px solid var(--warning); font-size: 0.85em; color: var(--warning);">
                ⚠️ <strong>Alerte Assiette :</strong> Bien que la pratique TTC soit courante pour certains marchés, la loi prévoit souvent une RS sur le montant <strong>HT (Hors TVA)</strong>. Vérifiez impérativement votre convention ou bon de commande.
            </div>

            <div style="margin-top: 15px; font-size: 0.85em; opacity: 0.9; padding:12px; background:rgba(239, 68, 68, 0.1); border-radius:8px; border-left: 3px solid #ef4444;">
                <p><strong>🚨 ${t('label_tej_warning')} :</strong></p>
                <p data-i18n="msg_tej_compliance">Toute attestation émise hors plateforme TEJ expose l'émetteur à une pénalité de 30% du montant retenu.</p>
            </div>

            <div style="margin-top: 15px; font-size: 0.8em; opacity: 0.7; padding:10px; background:rgba(0,0,0,0.1); border-radius:6px;">
                <p><strong>📌 Note Expert :</strong> La RS sur marchés (> 1000 DT) est obligatoire même pour les services. Le certificat doit être émis exclusivement sur TEJ.</p>
            </div>
        </div>
    `;

    document.getElementById('btn-explain-rs').addEventListener('click', () => {
        if (window.askAssistant) window.askAssistant(t("chat_suggest_bilan"));
    });

    document.getElementById('btn-print-rs').addEventListener('click', () => window.print());

    document.getElementById('btn-export-pdf-rs').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generatePDF(window.lastCalculation.data, 'RS');
    });

    document.getElementById('btn-export-excel-rs').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generateExcel(window.lastCalculation.data, 'RS');
    });


    // Global Sync
    window.lastCalculation = {
        type: 'RS',
        totalTax: rsAmount,
        data: {
            brutHT,
            tvaAmount,
            brutTTC,
            rsAmount,
            netAPayer
        }
    };
    if (window.shareWithAI) window.shareWithAI(window.lastCalculation);
}
