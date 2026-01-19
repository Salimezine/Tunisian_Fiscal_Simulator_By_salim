// IS - IMPÔT SUR LES SOCIÉTÉS - LF 2026

// I18N Keys for Sectors and Groups
const SECTOR_OPTIONS = [
    // --- TAUX 10% (Activités Spécifiques) ---
    { id: "agri", lang_key: "sect_agri", is: 0.10, css: 0.03, spec: 0, min: 0.001, group_key: "group_10" },
    { id: "artisanat", lang_key: "sect_artisanat", is: 0.10, css: 0.03, spec: 0, min: 0.001, group_key: "group_10" },
    { id: "culture", lang_key: "sect_culture", is: 0.10, css: 0.03, spec: 0, min: 0.001, group_key: "group_10" },
    { id: "recyclage", lang_key: "sect_recycling", is: 0.10, css: 0.03, spec: 0, min: 0.001, group_key: "group_10" },

    // --- TAUX 20% (Droit Commun) ---
    { id: "commun", lang_key: "sect_common", is: 0.20, css: 0.03, spec: 0, min: 0.002, group_key: "group_20" },
    { id: "commerce", lang_key: "sect_commerce", is: 0.20, css: 0.03, spec: 0, min: 0.002, group_key: "group_20" },
    { id: "industrie", lang_key: "sect_industrie", is: 0.20, css: 0.03, spec: 0, min: 0.002, group_key: "group_20" },

    // --- TAUX 35% (Haute Rentabilité) ---
    { id: "telecom", lang_key: "sect_telecom", is: 0.35, css: 0.03, spec: 0.04, min: 0.002, group_key: "group_35" },
    { id: "petrole", lang_key: "sect_oil", is: 0.35, css: 0.03, spec: 0, min: 0.002, group_key: "group_35" },
    { id: "grandes_surfaces", lang_key: "sect_hyper", is: 0.35, css: 0.03, spec: 0, min: 0.002, group_key: "group_35" },
    { id: "auto", lang_key: "sect_auto", is: 0.35, css: 0.03, spec: 0.04, min: 0.002, group_key: "group_35" },
    { id: "franchise", lang_key: "sect_franchise", is: 0.35, css: 0.03, spec: 0, min: 0.002, group_key: "group_35" },
    { id: "investissement", lang_key: "sect_invest", is: 0.35, css: 0.03, spec: 0, min: 0.002, group_key: "group_35" },

    // --- TAUX 43% (Secteur Financier - 35% + CSS 4% + Taxe Consolidée 4%) ---
    { id: "banque", lang_key: "sect_bank", is: 0.35, css: 0.04, spec: 0.04, min: 0.002, group_key: "group_finance" },
    { id: "leasing", lang_key: "sect_leasing", is: 0.35, css: 0.04, spec: 0.04, min: 0.002, group_key: "group_finance" },
    { id: "assurance", lang_key: "sect_insurance", is: 0.35, css: 0.04, spec: 0.04, min: 0.002, group_key: "group_finance" },

    // --- RÉGIME SPÉCIAL : Nouvelles Entreprises (2024-2025) ---
    { id: "nouvelle_1", lang_key: "sect_new_1", is: 0.00, css: 0, spec: 0, min: 0, group_key: "group_new" },
    { id: "nouvelle_2", lang_key: "sect_new_2", is: 0.05, css: 0.03, spec: 0, min: 0.002, group_key: "group_new" },
    { id: "nouvelle_3", lang_key: "sect_new_3", is: 0.10, css: 0.03, spec: 0, min: 0.002, group_key: "group_new" },
    { id: "nouvelle_4", lang_key: "sect_new_4", is: 0.15, css: 0.03, spec: 0, min: 0.002, group_key: "group_new" }
];

function initIS() {
    const container = document.getElementById('is-container');

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Group options by category
    let groups = {};
    SECTOR_OPTIONS.forEach(s => {
        if (!groups[s.group_key]) groups[s.group_key] = [];
        groups[s.group_key].push(s);
    });

    // Generate grouped options HTML
    let optionsHtml = '';
    for (const [groupKey, sectors] of Object.entries(groups)) {
        optionsHtml += `<optgroup label="${t(groupKey)}">`;
        sectors.forEach(s => {
            optionsHtml += `<option value="${s.id}">${t(s.lang_key)}</option>`;
        });
        optionsHtml += `</optgroup>`;
    }

    container.innerHTML = `
        <!-- Main Form -->
        <!-- Section 1: Secteur -->
        <div class="form-section" style="border-left: 4px solid var(--primary);">
            <div class="section-title">
                <span class="icon">🏢</span>
                <span data-i18n="label_sector">Secteur d'Activité</span>
            </div>
            
            <div class="form-group">
                <select id="secteurActivite" class="form-control" style="font-weight: 500;">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="info-bubble" id="taux-info" style="font-size: 0.9em;">
                <!-- Will be updated by JS -->
            </div>
        </div>

        <!-- Section 2: Résultats -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">📊</span>
                <span data-i18n="label_financial_results">Résultats Financiers</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_accounting_result">${t("label_accounting_result")}</label>
                    <input type="number" id="resComptable" class="form-control" data-i18n="[placeholder]placeholder_benefit_loss" placeholder="${t("placeholder_benefit_loss")}">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_turnover_ttc">${t("label_turnover_ttc")}</label>
                    <input type="number" id="caTtc" class="form-control" data-i18n="[placeholder]placeholder_min_tax_base" placeholder="${t("placeholder_min_tax_base")}">
                    <div class="help-text" data-i18n="help_min_tax_base">${t("help_min_tax_base")}</div>
                </div>
            </div>
        </div>

        <!-- Section 3: Ajustements Fiscaux -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">⚖️</span>
                <span data-i18n="label_fiscal_adjustments">Ajustements Fiscaux</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_reintegrations">Réintégrations (+)</label>
                    <div class="info-bubble" style="font-size: 0.75em; color: var(--warning); margin-bottom: 5px;" data-i18n="help_reintegrations">
                        ${t("help_reintegrations")}
                    </div>
                    <input type="number" id="reintegrations" class="form-control" value="0">
                    
                    <label style="margin-top:10px; display:block" data-i18n="label_op_specific">${t("label_op_specific")}</label>
                    <input type="number" id="opSpecifiqueIs" class="form-control" placeholder="0.00">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_deductions">${t("label_deductions")}</label>
                    <div class="info-bubble" style="font-size: 0.75em; color: var(--success); margin-bottom: 5px;" data-i18n="help_deductions">
                        ${t("help_deductions")}
                    </div>
                    <input type="number" id="deductions" class="form-control" value="0">
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
            <button id="btn-calc-is" class="btn-primary" style="flex: 2;" data-i18n="btn_calc_is">
                <span class="icon">📊</span> ${t("btn_calc_is")}
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="showDetailsIS" style="margin-right: 8px;">
                <label for="showDetailsIS" style="font-size: 0.9em; cursor: pointer; user-select: none;" data-i18n="label_details">Voir détail calcul</label>
            </div>
        </div>
        <div id="result-is"></div>
    `;

    // Event Listeners
    document.getElementById('btn-calc-is').addEventListener('click', calculateIS);
    document.getElementById('secteurActivite').addEventListener('change', updateSectorInfo);

    // Dynamic ZDR Form Container
    const zdrSection = document.createElement('div');
    zdrSection.id = 'zdr-extra-fields';
    container.insertBefore(zdrSection, document.getElementById('btn-calc-is'));

    // Init Info
    updateSectorInfo();
}

function updateSectorInfo() {
    const sectorId = document.getElementById('secteurActivite').value;
    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);
    if (!s) return;

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    const infoDiv = document.getElementById('taux-info');

    let infoText = `<strong>${t("label_rates_2026")} :</strong> IS <span class="highlight">${(s.is * 100).toFixed(0)}%</span>`;

    if (s.css > 0) infoText += ` | CSS <span class="highlight">${(s.css * 100).toFixed(0)}%</span>`;
    if (s.spec > 0) infoText += ` | Taxe Consolidée <span class="highlight">${(s.spec * 100).toFixed(0)}%</span>`;
    if (s.min > 0) infoText += ` | Min. Impôt <span class="highlight">${(s.min * 100).toFixed(1)}%</span> CA`;

    // Special notes
    if (s.id.startsWith('nouvelle_')) {
        infoText += `<br><small style="color: var(--success);">${t("msg_new_company_regime")}</small>`;
    }
    if (s.id === 'zdr') {
        infoText += `<br><small style="color: var(--success);">${t("msg_zdr_exo_possible")}</small>`;
    }
    if (s.spec > 0) {
        infoText += `<br><small style="color: var(--warning);">${t("msg_spec_tax_warning")}</small>`;
    }
    infoText += `<br><small style="color: #60a5fa;">${t("msg_tcl_note")}</small>`;

    infoDiv.innerHTML = infoText;

    // --- MISE À JOUR FORMULAIRE ZDR ---
    const zdrContainer = document.getElementById('zdr-extra-fields');
    if (s.id === 'zdr') {
        zdrContainer.innerHTML = `
            <div class="form-section" style="border-left: 4px solid var(--success); background: rgba(16, 185, 129, 0.05);">
                <div class="section-title">
                    <span class="icon">📍</span>
                    <span>${t("label_zdr_details")}</span>
                </div>
                
                <div class="flex-row">
                    <div class="form-group flex-col-50">
                        <label>${t("label_zdr_group")}</label>
                        <select id="zdrGroupe" class="form-control">
                            <option value="1">${t("opt_zdr_group_1")}</option>
                            <option value="2">${t("opt_zdr_group_2")}</option>
                        </select>
                    </div>
                    <div class="form-group flex-col-50">
                        <label>${t("label_zdr_year")}</label>
                        <input type="number" id="zdrAnnee" class="form-control" value="1" min="1" max="50">
                        <div class="help-text">${t("help_zdr_year")}</div>
                    </div>
                </div>

                <div class="flex-row" style="margin-top: 15px;">
                    <div class="form-group flex-col-50">
                        <label>${t("label_zdr_invest")}</label>
                        <input type="number" id="zdrInvestissement" class="form-control" placeholder="Coût du projet" value="0">
                        <div class="help-text">${t("help_zdr_invest")}</div>
                    </div>
                    <div class="form-group flex-col-50">
                        <label>${t("label_zdr_wages")}</label>
                        <input type="number" id="zdrMasseSalariale" class="form-control" placeholder="Total salaires bruts" value="0">
                        <div class="help-text">${t("help_zdr_wages")}</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        zdrContainer.innerHTML = '';
    }
}

function calculateIS() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Inputs
    const sectorId = document.getElementById('secteurActivite').value;
    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);

    const resComptable = parseFloat(document.getElementById('resComptable').value) || 0;
    const caTtc = parseFloat(document.getElementById('caTtc').value) || 0;

    const reintegrations = parseFloat(document.getElementById('reintegrations').value) || 0;
    const opSpecifiqueIs = parseFloat(document.getElementById('opSpecifiqueIs').value) || 0;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;

    // 1. Resultat Fiscal
    const resFiscal = resComptable + reintegrations + opSpecifiqueIs - deductions;
    const baseImposable = Math.max(0, resFiscal);

    // --- LOGIQUE ZDR ---
    let isAppliedRate = s.is;
    let isExoTotale = false;
    let zdrPrime = 0;
    let cnssEconomie = 0;
    let zdrStatus = "";

    if (sectorId === 'zdr') {
        const groupe = parseInt(document.getElementById('zdrGroupe').value);
        const annee = parseInt(document.getElementById('zdrAnnee').value);
        const invest = parseFloat(document.getElementById('zdrInvestissement').value) || 0;
        const masseSalariale = parseFloat(document.getElementById('zdrMasseSalariale').value) || 0;

        const limitExo = (groupe === 1) ? 5 : 10;
        if (annee <= limitExo) {
            isAppliedRate = 0;
            isExoTotale = true;
            zdrStatus = t("res_zdr_exo_total").replace("{{annee}}", annee).replace("{{total}}", limitExo);
        } else {
            isAppliedRate = 0.10;
            zdrStatus = t("res_zdr_reduced_late");
        }

        // Prime d'investissement
        const primeRate = (groupe === 1) ? 0.15 : 0.30;
        const primeMax = (groupe === 1) ? 1500000 : 3000000;
        zdrPrime = Math.min(invest * primeRate, primeMax);

        // Economie CNSS (16.57%)
        if (annee <= limitExo) {
            cnssEconomie = masseSalariale * 0.1657;
        }
    }

    // 2. IS Calculé
    const isCalcule = baseImposable * isAppliedRate;

    // 3. Minimum d'Impôt (0.2% standard, 0.1% pour taux 10%)
    const minImpot = caTtc * s.min;

    // 4. IS Dû (Le plus élevé entre IS Calculé et Min Impôt)
    const isDu = Math.max(isCalcule, minImpot);

    // 5. Contributions Additionnelles
    let cssAmount = 0;
    let specTaxAmount = 0;

    if (baseImposable > 0) {
        // 5.a CSS (Art. 88 LF 2024 / LF 2026) 
        // 4% Banques/Assurances, 3% Autres Sociétés
        cssAmount = baseImposable * s.css;

        // 5.b Taxe Spéciale Consolidée (4% - LF 2026)
        if (s.spec > 0) {
            specTaxAmount = baseImposable * s.spec;
        }
    }

    // 6. TCL (Taxe Locative / Établissements) - 0.2% du CA Local
    const tclAmount = caTtc * 0.002;

    const totalAPayer = isDu + cssAmount + specTaxAmount + tclAmount;

    // Which tax applies?
    const isMinApplied = minImpot > isCalcule;

    // Display
    const resultDiv = document.getElementById('result-is');
    const showDetails = document.getElementById('showDetailsIS').checked;

    // --- RECOMMANDATION 3: Transparence (Mode Détail) ---
    let detailedCalculationHtml = '';
    if (showDetails) {
        detailedCalculationHtml = `
            <div class="audit-journal-card" style="margin-top: 15px; padding: 15px; background: #1e1e1e; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.85em; color: #d4d4d4; border: 1px solid #333;">
                <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">📟 ${t("label_audit_is")} (Audit IS)</h4>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>(+) ${t("label_accounting_result")}</span>
                    <span>${resComptable.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(+) ${t("label_reintegrations")}</span>
                    <span>+ ${reintegrations.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #10b981;">
                    <span>(-) ${t("label_deductions")}</span>
                    <span>- ${deductions.toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #fff; border-top: 1px solid #777; padding-top: 5px;">
                    <span>(=) ${t("res_fiscal_result")}</span>
                    <span>${resFiscal.toFixed(3)}</span>
                </div>

                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #444;">
                   <div style="display: flex; justify-content: space-between;">
                        <span>(x) Taux IS (${(isAppliedRate * 100).toFixed(0)}%)</span>
                        <span>= ${isCalcule.toFixed(3)}</span>
                    </div>
                     <div style="display: flex; justify-content: space-between;">
                        <span>(vs) Minimum (${(s.min * 100).toFixed(1)}% CA)</span>
                        <span>= ${minImpot.toFixed(3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight:bold; color: #fbbf24;">
                        <span>(>) IS Dû Retenu</span>
                        <span>${isDu.toFixed(3)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    let detailsHtml = `
        <div style="margin-bottom: 20px;">
            <!-- Section 1: Résultat Fiscal -->
            <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:8px; margin-bottom:12px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.95em;">
                    <div>
                        <span style="opacity:0.7">${t("label_accounting_result")} :</span>
                        <strong style="float:right">${resComptable.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">${t("label_reintegrations")} :</span>
                        <strong style="float:right; color: var(--warning)">+ ${reintegrations.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">${t("label_op_specific")} :</span>
                        <strong style="float:right; color: var(--warning)">+ ${opSpecifiqueIs.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">${t("label_deductions")} :</span>
                        <strong style="float:right; color: var(--success)">- ${deductions.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2px;">
                        <span style="font-weight: 600;">= ${t("res_fiscal_result")} :</span>
                        <strong style="float:right; color: var(--text-main); font-size: 1.1em;">${resFiscal.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <!-- Section 2: Calcul de l'Impôt -->
            <div style="background: rgba(255,255,255,0.03); padding:12px; border-radius:8px; border-left: 3px solid var(--primary); margin-bottom: 12px;">
                <small style="opacity:0.6; display:block; margin-bottom:8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${t("label_liquidation_impot")}
                    <span style="float: right; font-size: 0.8em; color: var(--accent);" title="Source Officielle">📜 <a href="https://www.impots.finances.gov.tn" target="_blank" style="color: inherit; text-decoration: underline;">Art. 49 Code IS</a></span>
                </small>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                    <div>
                        <span style="opacity:0.7">${t("label_is_theoretic")} (${(isAppliedRate * 100)}%) :</span>
                        <strong style="float:right">${isCalcule.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7" data-tooltip="Impôt Minimum Forfaitaire (IMF).">${t("label_is_min_impot")} (${(s.min * 100).toFixed(1)}%) :</span>
                        <strong style="float:right">${minImpot.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding: 5px 0; color: var(--primary); font-weight: 600;">
                        <span>👉 ${t("label_is_du_retenu")} :</span>
                        <span style="float:right">${isDu.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT ${isMinApplied ? '⚠️' : ''}</span>
                    </div>

                    ${s.css > 0 ? `
                    <div style="grid-column: span 2;">
                        <span style="opacity:0.7">${t("res_css_due")} (${(s.css * 100)}%) :</span>
                        <strong style="float:right">+ ${cssAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>` : ''}
                    
                    ${s.spec > 0 ? `
                    <div style="grid-column: span 2;">
                        <span style="opacity:0.7">Taxe Consolidée (${(s.spec * 100)}%) :</span>
                        <strong style="float:right">+ ${specTaxAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>` : ''}

                    <div style="border-top: 1px dotted rgba(255,255,255,0.1); padding-top: 5px; grid-column: span 2;">
                        <span style="opacity:0.7">${t("label_tcl_ca")} :</span>
                        <strong style="float:right">+ ${tclAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <!-- Section 3: Avantages ZDR (Si applicable) -->
            ${sectorId === 'zdr' ? `
            <div style="background: rgba(16, 185, 129, 0.1); padding:12px; border-radius:8px; border-left: 3px solid var(--success);">
                <div style="font-size: 0.9em;">
                    <div style="color: var(--success); font-weight: 600; margin-bottom: 8px;">${t("label_zdr_booster")}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>
                            <span style="opacity:0.8">${t("label_fiscal_regime")}</span>
                            <strong style="float:right; color: var(--success)">${zdrStatus}</strong>
                        </div>
                        <div>
                            <span style="opacity:0.8">${t("label_invest_bonus")}</span>
                            <strong style="float:right; color: #10b981">+ ${zdrPrime.toLocaleString('fr-TN')} DT</strong>
                        </div>
                        <div style="grid-column: span 2;">
                            <span style="opacity:0.8">${t("label_cnss_saving")}</span>
                            <strong style="float:right; color: #10b981">+ ${cnssEconomie.toLocaleString('fr-TN')} DT / an</strong>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${detailedCalculationHtml}
        </div>
    `;

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <span>${t("label_is_total_pay")}</span>
                <span class="final-amount">${totalAPayer.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>
            ${detailsHtml}
            
            <button onclick="window.print()" class="btn-primary" style="margin-top:20px; background: var(--accent);">
                <span class="icon">🖨️</span> <span data-i18n="btn_print">${t("btn_print")}</span>
            </button>
        </div>
    `;

    // LOG & Global Sync
    window.lastCalculation = {
        type: 'IS',
        totalTax: totalAPayer,
        data: {
            resComptable,
            resFiscal,
            isDu,
            cssAmount,
            specTaxAmount,
            tclAmount,
            totalAPayer
        }
    };

    if (window.shareWithAI) {
        window.shareWithAI(window.lastCalculation);
    }
}
