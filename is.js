// IS - IMPÔT SUR LES SOCIÉTÉS - LF 2026
// Updated with Comparative Logic (Before/After Optimization)

// I18N Keys for Sectors and Groups
const SECTOR_OPTIONS = [
    // --- TAUX 10% (Prioritaires / Export) ---
    { id: "agri", lang_key: "sect_agri", type: "fixed", rate: 0.10, css: 0.03, min_tax: 0.001, group_key: "group_10" },
    { id: "artisanat", lang_key: "sect_artisanat", type: "fixed", rate: 0.10, css: 0.03, min_tax: 0.001, group_key: "group_10" },
    { id: "export", lang_key: "sect_export", type: "fixed", rate: 0.10, css: 0.03, min_tax: 0.001, group_key: "group_10" },

    // --- TAUX PROGRESSIF (Droit Commun : 15% / 20% / 25%) ---
    // CA < 5M: 15% | 5M <= CA < 20M: 20% | CA >= 20M: 25%
    { id: "commun", lang_key: "sect_common", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "commerce", lang_key: "sect_commerce", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "industrie", lang_key: "sect_industrie", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "services", lang_key: "sect_services", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "btp", lang_key: "sect_btp", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "transport", lang_key: "sect_transport", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },
    { id: "tourisme", lang_key: "sect_tourism", type: "progressive", css: 0.03, min_tax: 0.002, group_key: "group_progressive" },

    // --- TAUX 35% (Spécifiques) ---
    { id: "telecom", lang_key: "sect_telecom", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },
    { id: "petrole", lang_key: "sect_oil", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },
    { id: "grandes_surfaces", lang_key: "sect_hyper", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },
    { id: "auto", lang_key: "sect_auto", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },
    { id: "franchise", lang_key: "sect_franchise", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },
    { id: "immo", lang_key: "sect_immo", type: "fixed", rate: 0.35, css: 0.04, min_tax: 0.002, group_key: "group_35" },

    // --- TAUX 40% (Financier - Banques & Assurances - LF 2026) ---
    { id: "banque", lang_key: "sect_bank", type: "fixed", rate: 0.40, css: 0.04, min_tax: 0.002, group_key: "group_finance" },
    { id: "assurance", lang_key: "sect_insurance", type: "fixed", rate: 0.40, css: 0.04, min_tax: 0.002, group_key: "group_finance" },
    { id: "leasing", lang_key: "sect_leasing", type: "fixed", rate: 0.40, css: 0.04, min_tax: 0.002, group_key: "group_finance" },

    // --- RÉGIME SPÉCIAL : Nouvelles Entreprises ---
    // Taux dégressifs fixes pour simplification ici (ou géré via logique ZDR/New)
    { id: "nouvelle_1", lang_key: "sect_new_1", type: "fixed", rate: 0.00, css: 0, min_tax: 0, group_key: "group_new" },
    { id: "nouvelle_4", lang_key: "sect_new_4", type: "fixed", rate: 0.15, css: 0.03, min_tax: 0.002, group_key: "group_new" }
];

function initIS() {
    const container = document.getElementById('is-container');

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Group options
    let groups = {};
    SECTOR_OPTIONS.forEach(s => {
        if (!groups[s.group_key]) groups[s.group_key] = [];
        groups[s.group_key].push(s);
    });

    let optionsHtml = '';
    // Priority order for groups
    const order = ['group_progressive', 'group_10', 'group_35', 'group_finance', 'group_new'];

    order.forEach(groupKey => {
        if (groups[groupKey]) {
            optionsHtml += `<optgroup label="${t(groupKey) || groupKey}">`;
            groups[groupKey].forEach(s => {
                optionsHtml += `<option value="${s.id}">${t(s.lang_key)}</option>`;
            });
            optionsHtml += `</optgroup>`;
        }
    });

    container.innerHTML = `
        <div class="form-section" style="border-left: 4px solid var(--primary);">
            <div class="section-title">
                <span class="icon">🏢</span> <span data-i18n="label_sector">Secteur d'Activité</span>
            </div>
            <div class="form-group">
                <select id="secteurActivite" class="form-control" style="font-weight: 500;">
                    ${optionsHtml}
                </select>
            </div>
            <div class="info-bubble" id="taux-info" style="font-size: 0.9em;"></div>
        </div>

        <div class="form-section">
            <div class="section-title">
                <span class="icon">📊</span> <span data-i18n="label_financial_results">Résultats Financiers</span>
            </div>
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_turnover_ttc">${t("label_turnover_ttc")}</label>
                    <input type="number" id="caTtc" class="form-control" placeholder="Total TTC (Min. Impôt)" oninput="updateSectorInfo()"> 
                    <!-- Trigger update because rate depends on CA now -->
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_accounting_result">${t("label_accounting_result")}</label>
                    <input type="number" id="resComptable" class="form-control" placeholder="Bénéfice Net">
                </div>
            </div>
        </div>

        <div class="form-section">
            <div class="section-title">
                <span class="icon">⚖️</span> <span data-i18n="label_fiscal_adjustments">Ajustements & Avantages</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_reintegrations">Réintégrations (+)</label>
                    <input type="number" id="reintegrations" class="form-control" value="0">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_deductions">Déductions Classiques (-)</label>
                    <input type="number" id="deductions" class="form-control" value="0">
                </div>
            </div>

            <!-- New: Reinvestment Section -->
            <div class="form-group" style="margin-top: 15px; background: rgba(34, 197, 94, 0.05); padding: 10px; border-radius: 8px; border: 1px dashed rgba(34, 197, 94, 0.3);">
                <div class="flex-row">
                    <div class="flex-col-50">
                        <label style="color: var(--success); font-weight: 600;">🌱 ${t("label_reinvested_amount")}</label>
                        <div style="font-size: 0.8em; opacity: 0.7; margin-bottom: 5px;">${t("help_reinvest_limit")}</div>
                        <input type="number" id="montantReinvesti" class="form-control" placeholder="Déduction Base" value="0">
                    </div>
                    <div class="flex-col-50">
                        <label style="color: var(--accent); font-weight: 600;">💳 ${t("label_tax_credit") || "Crédit d'Impôt"}</label>
                        <div style="font-size: 0.8em; opacity: 0.7; margin-bottom: 5px;">${t("help_tax_credit") || "Déduction directe de l'IS dû."}</div>
                        <input type="number" id="creditImpot" class="form-control" placeholder="R&D, Formation..." value="0">
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
            <button id="btn-calc-is" class="btn-primary" style="flex: 2;">
                <span class="icon">📊</span> ${t("btn_compare_history") || "Simuler & Comparer"}
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="showDetailsIS" style="margin-right: 8px;">
                <label for="showDetailsIS" style="font-size: 0.9em; cursor: pointer;">${t("label_details")}</label>
            </div>
        </div>
        <div id="result-is"></div>
    `;

    document.getElementById('btn-calc-is').addEventListener('click', calculateIS);
    document.getElementById('secteurActivite').addEventListener('change', updateSectorInfo);

    updateSectorInfo();
}

function updateSectorInfo() {
    const sectorId = document.getElementById('secteurActivite').value;
    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);
    if (!s) return;

    const ca = parseFloat(document.getElementById('caTtc').value) || 0;

    // Determine Rate
    let currentRate = s.rate;
    let rateText = "";

    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    if (s.type === 'progressive') {
        if (ca < 5000000) { currentRate = 0.15; rateText = "15% (CA < 5 MDT)"; }
        else if (ca < 20000000) { currentRate = 0.20; rateText = "20% (CA < 20 MDT)"; }
        else { currentRate = 0.25; rateText = "25% (CA > 20 MDT)"; }
    } else {
        rateText = `${(s.rate * 100).toFixed(0)}% (${t(s.lang_key)})`;
    }

    const infoDiv = document.getElementById('taux-info');
    infoDiv.innerHTML = `
        <strong>Taux IS 2026 :</strong> <span class="highlight">${rateText}</span><br>
        <small>CSS : ${(s.css * 100).toFixed(0)}% | Min. Impôt : ${(s.min_tax * 100).toFixed(1)}% CA</small>
    `;
}

// Core Logic (Refactored for Comparison)
function computeIS(inputs) {
    const {
        sectorId, resComptable, caTtc,
        reintegrations, deductions, montantReinvesti, creditImpot,
        isZDR, isStartup, isExport // Advantages Flags
    } = inputs;

    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);
    if (!s) return null;

    // --- Helper for Single Run Calculation ---
    const runCalculation = (config) => {
        const { sector, ca, res, reinvest, credit, reintegrations, deductions, zdrOverride, startupOverride, exportOverride } = config;

        // 1. Rate logic
        let rate = sector.rate;
        if (sector.type === 'progressive') {
            if (ca < 5000000) rate = 0.15;
            else if (ca < 20000000) rate = 0.20;
            else rate = 0.25;
        }

        // --- OVERRIDES (Priority: Full Exemption > Reduced Rate) ---

        // ZDR or Startup: 0% (Full Exemption takes precedence)
        if (zdrOverride || startupOverride) {
            rate = 0;
        }
        // Export: 10% (unless already lower or exempt by ZDR/Startup)
        else if (exportOverride) {
            rate = 0.10;
        }

        // 2. Base Global
        const baseGlobal = Math.max(0, res + reintegrations - deductions);

        // 3. Deduction for Reinvestment (with 35% legal cap per Tunisian law)
        const REINVESTMENT_CAP_RATE = 0.35;
        const reinvestCap = baseGlobal * REINVESTMENT_CAP_RATE;
        const deductionAmount = Math.min(reinvest, reinvestCap, baseGlobal);
        const baseNet = baseGlobal - deductionAmount;
        const wasReinvestCapped = reinvest > reinvestCap && reinvest > 0;

        // 4. IS Net (after reinvestment deduction)
        const isGlobal = baseGlobal * rate; // IS before any reinvestment deduction
        let isNet = baseNet * rate; // IS after reinvestment deduction

        // 5. Floor Logic for Reinvestment (20% of IS before deduction)
        // If ZDR/Startup/Export, Floor is NOT APPLICABLE (Exempt/Special).
        const isSpecialSector = ['agri', 'export', 'nouvelle_1'].includes(sector.id) || zdrOverride || startupOverride || exportOverride;

        let isDuCalc = isNet;
        if (!isSpecialSector && reinvest > 0) {
            const floorReinvest = isGlobal * 0.20; // 20% of IS before reinvestment deduction
            isDuCalc = Math.max(isNet, floorReinvest);
        }

        // 6. Tax Credit Deduction (Step 5 of User's Algorithm)
        if (credit > 0) {
            isDuCalc = Math.max(0, isDuCalc - credit);
        }

        // 7. Minimum Tax (CA)
        let minTaxCA = ca * sector.min_tax;
        minTaxCA = Math.max(minTaxCA, 500); // Minimum 500 DT

        let isFinal = isDuCalc;
        if (!isSpecialSector) {
            isFinal = Math.max(isDuCalc, minTaxCA);
        } else if (zdrOverride || startupOverride) {
            // Full Exemption usually implies No Min Tax during exemption period
            if (rate === 0) isFinal = 0;
        } else if (exportOverride) {
            // Export (if not fully exempt) typically has a 0.1% minimum tax on CA.
            let exportMin = ca * 0.001;
            isFinal = Math.max(isDuCalc, exportMin);
        }

        // 8. CSS
        const cssRate = sector.css;
        let css = baseNet * cssRate;
        if ((zdrOverride || startupOverride) && rate === 0) css = 0; // No CSS if exempt

        return {
            total: isFinal + css,
            is: isFinal,
            css: css,
            baseGlobal: baseGlobal,
            baseNet: baseNet,
            appliedRate: rate,
            minTaxCA: minTaxCA,
            isBeforeMin: isDuCalc,
            reinvestmentDeducted: deductionAmount,
            reinvestmentCapped: wasReinvestCapped,
            reinvestmentDeclared: reinvest
        };
    };

    // --- 1. Current Scenario (Optimized) ---
    const optimized = runCalculation({
        sector: s,
        ca: caTtc,
        res: resComptable,
        reinvest: montantReinvesti,
        credit: creditImpot || 0,
        reintegrations: reintegrations,
        deductions: deductions,
        zdrOverride: isZDR,
        startupOverride: isStartup,
        exportOverride: isExport
    });

    // --- 2. Standard Scenario (No Advantages) ---
    // Ignore all checkbox overrides for Standard
    const isSpecialExempt = ['agri', 'export', 'nouvelle_1', 'nouvelle_4'].includes(s.id);
    const standardSector = isSpecialExempt ? SECTOR_OPTIONS.find(o => o.id === 'commun') : s;

    const standard = runCalculation({
        sector: standardSector,
        ca: caTtc,
        res: resComptable,
        reinvest: 0,
        credit: 0,
        reintegrations: reintegrations,
        deductions: deductions,
        zdrOverride: false,
        startupOverride: false,
        exportOverride: false
    });

    return {
        optimized: optimized,
        standard: standard,
        savings: standard.total - optimized.total,
        savingsPct: standard.total > 0 ? ((standard.total - optimized.total) / standard.total) * 100 : 0
    };
}

// Global Export
window.FiscalLogic = window.FiscalLogic || {};
window.FiscalLogic.computeIS = computeIS;

function calculateIS() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Inputs
    const sectorId = document.getElementById('secteurActivite').value;
    const resComptable = parseFloat(document.getElementById('resComptable').value) || 0;
    const caTtc = parseFloat(document.getElementById('caTtc').value) || 0;
    const reintegrations = parseFloat(document.getElementById('reintegrations').value) || 0;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    const montantReinvesti = parseFloat(document.getElementById('montantReinvesti').value) || 0;
    const creditImpot = parseFloat(document.getElementById('creditImpot').value) || 0;

    // Perform Calculation
    const result = computeIS({
        sectorId, resComptable, caTtc, reintegrations, deductions, montantReinvesti, creditImpot
    });

    if (!result) return;

    // Destructure results
    const opt = result.optimized;
    const std = result.standard;
    const savings = result.savings;

    // Display
    const resultDiv = document.getElementById('result-is');
    const showDetails = document.getElementById('showDetailsIS').checked;

    // Comparison Chart Logic
    const barMax = Math.max(std.total, opt.total);
    const stdWidth = (std.total / barMax) * 100;
    const optWidth = (opt.total / barMax) * 100;

    let comparisonsHtml = '';
    if (savings > 100) { // Show comparison if significant saving
        comparisonsHtml = `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h4 style="margin:0 0 10px 0; font-size:0.95em; color:#fff;">🎁 ${t("label_comparative_analysis") || "Analyse d'Impact Fiscal"}</h4>
                
                <!-- Standard Bar -->
                <div style="display: flex; align-items: center; margin-bottom: 8px; font-size: 0.85em;">
                    <div style="width: 120px; color: #94a3b8;">${t("label_standard_mode") || "Régime Standard"}</div>
                    <div style="flex: 1; height: 18px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative;">
                        <div style="width: ${stdWidth}%; height: 100%; background: #64748b;"></div>
                        <span style="position: absolute; right: 8px; top: 1px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${std.total.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                    </div>
                </div>

                <!-- Optimized Bar -->
                <div style="display: flex; align-items: center; margin-bottom: 12px; font-size: 0.85em;">
                    <div style="width: 120px; color: var(--success); font-weight: 600;">${t("label_optimized_mode") || "Avec Avantages"}</div>
                    <div style="flex: 1; height: 18px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative;">
                        <div style="width: ${optWidth}%; height: 100%; background: var(--success);"></div>
                        <span style="position: absolute; right: 8px; top: 1px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-weight: bold;">${opt.total.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                    </div>
                </div>

                <!-- Message -->
                <div style="background: rgba(34, 197, 94, 0.1); padding: 10px; border-radius: 6px; border: 1px solid rgba(34, 197, 94, 0.3); text-align: center;">
                    <span style="color: var(--success);">📉 ${t("msg_you_save") || "Vous économisez"} <strong>${savings.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong> (${result.savingsPct.toFixed(1)}%)</span>
                </div>
            </div>
        `;
    }

    // --- RECOMMANDATION 3: Transparence (Mode Détail) ---
    let detailedCalculationHtml = '';
    if (showDetails) {
        detailedCalculationHtml = `
            <div class="audit-journal-card" style="margin-top: 15px; padding: 15px; background: #1e1e1e; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.85em; color: #d4d4d4; border: 1px solid #333;">
                <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">📟 ${t("label_audit_is")} (Audit IS)</h4>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>(+) ${t("label_accounting_result")}</span>
                    <span>${resComptable.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(+) ${t("label_reintegrations")}</span>
                    <span>+ ${reintegrations.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #10b981;">
                    <span>(-) ${t("label_deductions")}</span>
                    <span>- ${deductions.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--success);">
                    <span>(-) ${t("label_reinvested_amount")}</span>
                    <span>- ${montantReinvesti.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #fff; border-top: 1px solid #777; padding-top: 5px;">
                    <span>(=) ${t("res_fiscal_result")} (Net)</span>
                    <span>${(opt.baseGlobal - Math.min(montantReinvesti, opt.baseGlobal)).toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                </div>

                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #444;">
                   <div style="display: flex; justify-content: space-between;">
                        <span>(x) Taux IS (${(opt.appliedRate * 100).toFixed(0)}%)</span>
                        <span>= ${opt.isBeforeMin.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                    </div>
                     <div style="display: flex; justify-content: space-between;">
                        <span>(vs) Minimum (${(opt.minTaxCA / caTtc * 100).toFixed(1)}% CA)</span>
                        <span>= ${opt.minTaxCA.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight:bold; color: #fbbf24;">
                        <span>(>) IS Dû Retenu</span>
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
                            <strong style="float:right; color: var(--success)">${zdrStatusStr}</strong>
                        </div>
                        <div>
                            <span style="opacity:0.8">${t("label_invest_bonus")}</span>
                            <strong style="float:right; color: #10b981">+ ${zdr.prime.toLocaleString('fr-TN')} DT</strong>
                        </div>
                        <div style="grid-column: span 2;">
                            <span style="opacity:0.8">${t("label_cnss_saving")}</span>
                            <strong style="float:right; color: #10b981">+ ${zdr.cnss.toLocaleString('fr-TN')} DT / an</strong>
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
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="btn-explain-is" class="btn-primary" style="flex: 2; background: var(--primary-gradient);">
                    <span class="icon">🤖</span> <span data-i18n="label_explain_results">${t("label_explain_results")}</span>
                </button>
                <button onclick="window.print()" class="btn-primary" style="flex: 1; background: var(--accent);">
                    <span class="icon">🖨️</span> <span data-i18n="btn_print">${t("btn_print")}</span>
                </button>
            </div>
        </div>
    `;

        document.getElementById('btn-explain-is').addEventListener('click', () => {
            if (window.askAssistant) window.askAssistant(t("chat_suggest_bilan"));
        });

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

    } // Close if(result) scope if needed or just end function
}

