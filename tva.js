// TVA - TAXE SUR LA VALEUR AJOUTÉE - LF 2026

const TAUX_TVA = [
    {
        value: 0.19,
        lang_key: "tva_rate_19",
        description_key: "desc_rate_19"
    },
    {
        value: 0.13,
        lang_key: "tva_rate_13",
        description_key: "desc_rate_13"
    },
    {
        value: 0.07,
        lang_key: "tva_rate_7",
        description_key: "desc_rate_7"
    },
    {
        value: 0.075,
        lang_key: "tva_rate_7_5", // New rate logic if applicable
        description_key: "desc_rate_7_5"
    },
    {
        value: 0,
        lang_key: "tva_rate_0",
        description_key: "desc_rate_0"
    }
];

// Catégories de produits/services avec taux suggéré
const CATEGORIES_TVA = [
    { id: "standard", lang_key: "cat_standard", taux: 0.19 },
    { id: "electricite", lang_key: "cat_elec", taux: 0.13 },
    { id: "petrole", lang_key: "cat_petrole", taux: 0.13 },
    { id: "equipements", lang_key: "cat_equip", taux: 0.13 },
    { id: "restauration", lang_key: "cat_resto", taux: 0.07 },
    { id: "hebergement", lang_key: "cat_hotel", taux: 0.07 },
    { id: "services_pro", lang_key: "cat_transport", taux: 0.07 },
    { id: "vehicules", lang_key: "cat_cars", taux: 0.07 },
    { id: "recharge_elec", lang_key: "cat_elec_charge", taux: 0.07 },
    { id: "immo_social", lang_key: "cat_immo_soc", taux: 0.07 },
    { id: "immo_standing", lang_key: "cat_immo_lux", taux: 0.19 },
    { id: "medicaments", lang_key: "cat_meds", taux: 0 },
    { id: "export", lang_key: "cat_export", taux: 0 },
    { id: "exonere", lang_key: "cat_exempt", taux: 0 }
];

function initTVA() {
    const container = document.getElementById('tva-container');

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Generate Options for rate selector
    let tauxOptionsHtml = TAUX_TVA.map(tn => `<option value="${tn.value}">${t(tn.lang_key)}</option>`).join('');

    // Group categories by tax rate
    const groupedCategories = {};
    CATEGORIES_TVA.forEach(c => {
        const rateLabel = (c.taux * 100).toFixed(0) + "%";
        if (!groupedCategories[rateLabel]) groupedCategories[rateLabel] = [];
        groupedCategories[rateLabel].push(c);
    });

    let categoriesHtml = '';
    for (const [rate, categories] of Object.entries(groupedCategories)) {
        // Translate "Taux X%"? Maybe just assume rate is number.
        // Or "Rate X%"
        categoriesHtml += `<optgroup label="${t("label_rate")} ${rate}">`;
        categories.forEach(c => {
            categoriesHtml += `<option value="${c.id}" data-taux="${c.taux}">${t(c.lang_key)}</option>`;
        });
        categoriesHtml += `</optgroup>`;
    }

    container.innerHTML = `
        <!-- Main Form -->
        <!-- Section 1: Type d'opération -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">🏷️</span>
                <span data-i18n="label_operation_type">Type d'Opération</span>
            </div>
            
            <div class="form-group">
                <label data-i18n="label_category">Catégorie de Produit/Service</label>
                <select id="categorieTva" class="form-control">
                    ${categoriesHtml}
                </select>
                <div class="help-text" id="categorie-info" data-i18n="help_auto_rate">Le taux sera automatiquement suggéré</div>
            </div>
        </div>

        <!-- Section 2: TVA Collectée -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">💳</span>
                <span data-i18n="label_tva_collected">TVA Collectée (Ventes)</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_turnover_ht">Chiffre d'Affaires HT (Base Imposable)</label>
                    <input type="number" id="baseHt" class="form-control" data-i18n="placeholder_amount_ht" placeholder="Montant HT">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_op_specific">Opération Spécifique (+) </label>
                    <input type="number" id="opSpecifiqueTva" class="form-control" placeholder="0.000">
                    <div class="help-text" data-i18n="help_op_specific">Opérations additive à la base imposable</div>
                </div>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_tva_rate">Taux de TVA</label>
                    <select id="tauxTva" class="form-control">
                        ${tauxOptionsHtml}
                    </select>
                </div>
                <div class="form-group flex-col-50" style="display:flex; align-items:center; padding-top:25px;">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="checkSuspension" style="width:20px; height:20px;">
                        <span data-i18n="label_suspension">Vente en Suspension</span>
                    </label>
                </div>
            </div>

            <div id="suspension-details" class="form-group hidden" style="margin-top: -10px; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                 <label style="font-size:0.9em;" data-i18n="label_cert_num">N° Attestation / Bon de Commande</label>
                 <input type="text" id="numAttestation" class="form-control" placeholder="Ex: 2026/00123">
                 <div class="help-text" style="color: var(--success);" data-i18n="help_cert_required">✅ Attestation requise pour justifier la suspension</div>
            </div>

            <!-- Warning Immobilière -->
            <div id="immo-warning" class="hidden" style="margin-top: 10px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 3px solid var(--warning); font-size: 0.85em; color: var(--warning);">
                ${t("msg_immo_legal_warning")}
            </div>
            
            <div style="text-align:right; font-size: 0.9em; margin-top:5px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                <span>${t("label_ttc_amount")} : </span>
                <strong id="preview-ttc" style="color:var(--text-main);">0.000 DT</strong>
                <br>
                <span>${t("label_tva_invoiced")} : </span>
                <strong id="preview-tva" style="color:var(--primary);">0.000 DT</strong>
            </div>
        </div>

        <!-- Section 3: TVA Déductible -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">🧾</span>
                <span data-i18n="label_tva_deductible">TVA Déductible (Achats)</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_on_assets">Sur Immobilisations</label>
                    <input type="number" id="tvaImmobilisation" class="form-control" placeholder="0.00">
                    <div class="help-text" data-i18n="help_assets">Équipements, véhicules, locaux...</div>
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_on_purchases">Sur Achats / Exploitation</label>
                    <input type="number" id="tvaExploitation" class="form-control" placeholder="0.00">
                    <div class="help-text" data-i18n="help_purchases">Marchandises, fournitures, services...</div>
                </div>
            </div>
             
             <div class="form-group">
                <label data-i18n="label_prev_credit">Crédit de TVA Antérieur (Report)</label>
                <input type="number" id="reportTva" class="form-control" placeholder="0.00">
            </div>

            <div class="form-group" style="margin-top:20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:15px;">
                <div class="info-bubble" style="background: rgba(16, 185, 129, 0.05); border-color: var(--success); font-size: 0.8em;" data-i18n="info_prorata">
                    ℹ️ <strong>Note sur le Prorata :</strong> La déduction est calculée sur la base du CA HT. Une régularisation annuelle (et sur immobilisations) est obligatoire conformément aux articles 9 et 9 bis du Code de la TVA.
                </div>
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox" id="checkProrata" style="width:18px; height:18px;">
                    <span data-i18n="label_apply_prorata">Appliquer la règle du Prorata (Assujetti Mixte)</span>
                </label>
                <div id="prorata-input-container" class="hidden" style="margin-top:10px;">
                    <div style="display:flex; gap:10px;">
                         <div style="flex:1">
                            <label>Prorata (%)</label>
                            <input type="number" id="prorataValue" class="form-control" value="100" min="0" max="100">
                         </div>
                         <div style="flex:1">
                            <label>Type de bien</label>
                            <select id="typeBienRegul" class="form-control">
                                <option value="equip">Équipement (1/5ème)</option>
                                <option value="immo">Bâtiment (1/10ème)</option>
                            </select>
                         </div>
                    </div>
                    <div class="help-text">Droit à déduction limité au prorata. Régularisation sur 5 ans (matériel) ou 10 ans (immo).</div>
                </div>
            </div>
        </div>

        <button id="btn-calc-tva" class="btn-primary" style="background: var(--primary);" data-i18n="btn_calc_tva">
            <span class="icon">🧮</span> Calculer Déclaration TVA
        </button>
        <div id="result-tva"></div>
    `;

    // Listeners
    document.getElementById('btn-calc-tva').addEventListener('click', calculateTVA);

    // Category change updates rate
    document.getElementById('categorieTva').addEventListener('change', () => {
        const select = document.getElementById('categorieTva');
        const selectedOption = select.options[select.selectedIndex];
        const suggestedRate = parseFloat(selectedOption.dataset.taux);

        document.getElementById('tauxTva').value = suggestedRate;

        const category = CATEGORIES_TVA.find(c => c.id === select.value);

        // Show/Hide Immo Warning
        const immoWarning = document.getElementById('immo-warning');
        if (select.value === 'immo_social') {
            immoWarning.classList.remove('hidden');
        } else {
            immoWarning.classList.add('hidden');
        }

        if (category) {
            document.getElementById('categorie-info').innerHTML =
                `<span style="color: var(--primary);">${t("label_rate_suggested")} : ${(suggestedRate * 100).toFixed(0)}%</span>`;
        }

        updatePreview();
    });

    // Dynamic Preview
    const updatePreview = () => {
        const base = parseFloat(document.getElementById('baseHt').value) || 0;
        const opSpec = parseFloat(document.getElementById('opSpecifiqueTva').value) || 0;
        const totalBase = base + opSpec;
        const taux = parseFloat(document.getElementById('tauxTva').value);
        const isSuspended = document.getElementById('checkSuspension').checked;
        const details = document.getElementById('suspension-details');

        if (isSuspended) {
            details.classList.remove('hidden');
            document.getElementById('preview-tva').textContent = "0.000 DT (" + t("label_suspension") + ")";
            document.getElementById('preview-tva').style.color = "var(--success)";
            document.getElementById('preview-ttc').textContent = totalBase.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
        } else {
            details.classList.add('hidden');
            const tva = totalBase * taux;
            const ttc = totalBase + tva;
            document.getElementById('preview-tva').textContent = tva.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
            document.getElementById('preview-tva').style.color = "var(--primary)";
            document.getElementById('preview-ttc').textContent = ttc.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
        }
    };

    document.getElementById('baseHt').addEventListener('input', updatePreview);
    document.getElementById('opSpecifiqueTva').addEventListener('input', updatePreview);
    document.getElementById('tauxTva').addEventListener('change', updatePreview);
    document.getElementById('checkSuspension').addEventListener('change', updatePreview);
    document.getElementById('checkProrata').addEventListener('change', () => {
        const container = document.getElementById('prorata-input-container');
        if (document.getElementById('checkProrata').checked) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
}

function calculateTVA() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // 1. Collectée
    const base = parseFloat(document.getElementById('baseHt').value) || 0;
    const opSpec = parseFloat(document.getElementById('opSpecifiqueTva').value) || 0;
    const totalBase = base + opSpec;
    const taux = parseFloat(document.getElementById('tauxTva').value);
    const isSuspended = document.getElementById('checkSuspension').checked;
    const numAttestation = document.getElementById('numAttestation').value;

    // Get selected category
    const categorieSelect = document.getElementById('categorieTva');
    const categorieId = categorieSelect.value;
    const selectedCategory = CATEGORIES_TVA.find(c => c.id === categorieId);
    const categorieName = selectedCategory ? t(selectedCategory.lang_key) : "";

    let tvaCollectee = 0;
    if (!isSuspended) {
        tvaCollectee = totalBase * taux;
    }

    const montantTTC = totalBase + tvaCollectee;

    // 2. Déductible
    const tvaImmo = parseFloat(document.getElementById('tvaImmobilisation').value) || 0;
    const tvaExploitation = parseFloat(document.getElementById('tvaExploitation').value) || 0;
    const report = parseFloat(document.getElementById('reportTva').value) || 0;

    // Prorata calculation
    let prorata = 1;
    let prorataLabel = "";
    if (document.getElementById('checkProrata').checked) {
        prorata = (parseFloat(document.getElementById('prorataValue').value) || 100) / 100;
        prorataLabel = ` (Prorata ${(prorata * 100).toFixed(0)}%)`;
    }

    const tvaRecuperableBrute = tvaImmo + tvaExploitation;
    const tvaRecuperableNette = tvaRecuperableBrute * prorata;

    // Calcul de la fraction de régularisation si variation > 5% (simulé ici dans le détail)
    const typeBien = document.getElementById('typeBienRegul')?.value || 'equip';
    const fraction = (typeBien === 'immo') ? t("label_fraction_10th") : t("label_fraction_5th");

    const totalDeductible = tvaRecuperableNette + report;

    // 3. Solde
    const solde = tvaCollectee - totalDeductible;

    let message = "";
    let amount = 0;
    let isCredit = false;

    if (solde > 0) {
        message = t("res_tva_payable"); // "TVA À PAYER"
        amount = solde;
    } else if (solde < 0) {
        message = t("res_tva_credit"); // "CRÉDIT DE TVA"
        amount = Math.abs(solde);
        isCredit = true;
    } else {
        message = t("label_tva_balance_null");
        amount = 0;
    }

    const resultDiv = document.getElementById('result-tva');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid ${isCredit ? 'var(--success)' : (amount === 0 ? 'var(--accent)' : 'var(--warning)')};">
            <div class="result-header">
                <span>${message}</span>
                <span class="final-amount" style="color: ${isCredit ? 'var(--success)' : (amount === 0 ? 'var(--accent)' : 'var(--warning)')}">
                    ${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT
                </span>
            </div>
            
            <div style="margin-bottom: 20px;">
                <!-- Détail Opération -->
                <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:6px; margin-bottom:12px;">
                    <p style="margin:0 0 8px 0; color: var(--text-muted); font-size:0.85em;">🏷️ ${t("label_category")} : <strong style="color:var(--text-main)">${categorieName}</strong></p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                        <div>
                            <span style="opacity:0.7">${t("label_base_ht")} :</span>
                            <strong style="float:right">${base.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t("label_op_specific")} :</span>
                            <strong style="float:right; color: var(--warning)">+ ${opSpec.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t("label_total_base")} :</span>
                            <strong style="float:right">${totalBase.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t("label_tva_rate")} :</span>
                            <strong style="float:right; color: var(--primary)">${isSuspended ? '0% (' + t("label_suspension") + ')' : (taux * 100).toFixed(0) + '%'}</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t("label_tva_invoiced")} :</span>
                            <strong style="float:right; color: var(--primary)">${tvaCollectee.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t("label_ttc_amount")} :</span>
                            <strong style="float:right">${montantTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>

                <!-- Collectée vs Déductible -->
                <div style="padding:10px;">
                    <p style="margin:5px 0;"><strong>+ ${t("label_tva_collected")} :</strong> <span style="float:right; color:var(--warning); font-weight:bold;">${tvaCollectee.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span></p>
                    
                    <div style="margin: 10px 0; padding-left: 15px; border-left: 2px solid rgba(255,255,255,0.1);">
                        <p style="margin:5px 0; font-size: 0.9em;"><strong>– ${t("label_tva_deductible")} :</strong> <span style="float:right; color:var(--success); font-weight:bold;">${totalDeductible.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span></p>
                        <ul style="font-size:0.85em; opacity:0.8; padding-left:15px; margin: 5px 0;">
                            <li>${t("label_gross_taxable")} (Immo + Exp) : ${tvaRecuperableBrute.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                            ${prorata < 1 ? `
                            <li style="color:var(--warning)">Réduction Prorata : - ${(tvaRecuperableBrute * (1 - prorata)).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                            <li style="font-size:0.85em; opacity:0.7;">${t("msg_regul_note").replace("{{fraction}}", fraction)}</li>` : ''}
                            <li>${t("label_prev_credit")} : ${report.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                        </ul>
                    </div>
                    
                    <p style="margin:10px 0 0 0; padding-top:10px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 1.05em;">
                        <strong>= ${t("label_solde")} :</strong> 
                        <span style="float:right; font-weight:bold; color: ${isCredit ? 'var(--success)' : 'var(--warning)'}">
                            ${isCredit ? '(' : ''}${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT${isCredit ? ')' : ''}
                        </span>
                    </p>
                </div>
                
                ${isSuspended ? `
                <div style="margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border-left: 3px solid var(--success);">
                    <p style="font-size:0.9em; color: var(--success); margin: 0;">
                        ${t("msg_tva_suspension_legal")}
                        ${numAttestation ? `<br><span style="opacity:0.8">${t("label_cert_short")} <strong>${numAttestation}</strong></span>` : ''}
                    </p>
                </div>
                ` : ''}
            </div>

            <div style="margin-top: 15px; padding: 12px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; font-size: 0.85em;">
                <p style="margin: 0 0 5px 0;"><strong>📌 ${t("label_rappels_lf2026")} :</strong></p>
                <ul style="margin: 0; padding-left: 15px; opacity: 0.85;">
                    <li>Taux : 19% (normal), 13% (intermédiaire), 7% (réduit), 0% (export/exonéré)</li>
                    <li><strong>${t("label_e_invoicing_title")} :</strong> ${t("msg_e_invoicing_desc")}</li>
                    <li><strong>${t("label_sanctions")} :</strong> ${t("msg_sanctions_desc")}</li>
                    <li>${t("label_suspension_meds")}</li>
                </ul>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="btn-explain-tva" class="btn-primary" style="flex: 2; background: var(--primary-gradient);">
                    <span class="icon">🤖</span> <span data-i18n="label_explain_results">${t("label_explain_results")}</span>
                </button>
                <button id="btn-print-tva" class="btn-primary" style="flex: 1; background: var(--accent);">
                    <span class="icon">📄</span> <span data-i18n="btn_print">${t("btn_print")}</span>
                </button>
            </div>

            <!-- Export Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="btn-export-pdf-tva" class="btn-secondary" style="flex: 1; border: 1px solid var(--primary); color: var(--primary);">
                    <span class="icon">📄</span> PDF
                </button>
                <button id="btn-export-excel-tva" class="btn-secondary" style="flex: 1; border: 1px solid #10b981; color: #10b981;">
                    <span class="icon">📊</span> Excel
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-explain-tva').addEventListener('click', () => {
        if (window.askAssistant) window.askAssistant(t("chat_suggest_bilan"));
    });

    document.getElementById('btn-print-tva').addEventListener('click', () => window.print());

    document.getElementById('btn-export-pdf-tva').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generatePDF(window.lastCalculation.data, 'TVA');
    });

    document.getElementById('btn-export-excel-tva').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generateExcel(window.lastCalculation.data, 'TVA');
    });
    // LOG & Global Sync
    window.lastCalculation = {
        type: 'TVA',
        totalTax: solde > 0 ? solde : 0,
        data: {
            baseHT: totalBase,
            tvaCollectee,
            totalDeductible,
            solde,
            montantTTC
        }
    };

    if (window.shareWithAI) {
        window.shareWithAI(window.lastCalculation);
    }
}
