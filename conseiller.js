// CONSEILLER FISCAL - Agent Intelligent Automatisé
// Module d'Audit et Conseil Gratuite - Loi de Finances 2026
// ============================================================

const BK_FISCAL = {
    avantages: {
        nouvelles_entreprises: {
            id: "nouvelles_entreprises",
            title_key: "adv_new_companies",
            type: "Fiscale",
            desc_key: "desc_new_companies",
            loi: "LF 2024 / Code des Investissements",
            applicable: (data) => data.anneeCreation >= 2024 && !['banque', 'telecom', 'finance'].includes(data.secteur)
        },
        zdr: {
            id: "zdr",
            title_key: "adv_zdr",
            type: "Fiscale",
            desc_key: "desc_zdr",
            loi: "LF 2026 / Décret ZDR",
            applicable: (data) => data.zoneRegionale === true
        },
        startup: {
            id: "startup",
            title_key: "adv_startup",
            type: "Fiscale",
            desc_key: "desc_startup",
            loi: "Loi 2018-20 (Startup Act)",
            applicable: (data) => data.startup === true
        },
        export: {
            id: "export",
            title_key: "adv_export",
            type: "Fiscale",
            desc_key: "desc_export",
            loi: "Code IRPP/IS Art. 49",
            applicable: (data) => data.export === true
        },
        agricole: {
            id: "agricole",
            title_key: "adv_agri",
            type: "Fiscale",
            desc_key: "desc_agri",
            loi: "Code Invest. / LF 2026",
            applicable: (data) => data.secteur === 'agriculture'
        },
        assurance_vie: {
            id: "assurance_vie",
            title_key: "adv_life_insurance",
            type: "Déduction",
            desc_key: "desc_life_insurance",
            loi: "Art. 39 Code IRPP",
            applicable: (data) => data.type === 'personne_physique'
        },
        cea: {
            id: "cea",
            title_key: "adv_cea",
            type: "Déduction",
            desc_key: "desc_cea",
            loi: "LF 2024 / Code IRPP",
            applicable: (data) => data.type === 'personne_physique'
        },
        innovation_tech: {
            id: "innovation_tech",
            title_key: "adv_research_credit",
            type: "Crédit",
            desc_key: "desc_research_credit",
            loi: "LF 2025",
            applicable: (data) => data.secteur === 'tech' && data.type === 'societe'
        },
        green_energy: {
            id: "green_energy",
            title_key: "adv_green",
            type: "Amortissement",
            desc_key: "desc_green",
            loi: "LF 2024 (Art. 48) / LF 2026",
            applicable: (data) => data.secteur === 'industrie' || data.secteur === 'agriculture'
        }
    }
};

function initConseiller() {
    const container = document.getElementById('conseiller-container');
    if (!container) return;

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    container.innerHTML = `
        <div class="advisor-wrapper">
            <div class="advisor-hero" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 20px; padding: 30px; margin-bottom: 25px; display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 3.5rem;">🤖</div>
                <div>
                    <h3 style="margin: 0; color: #fff; font-size: 1.6rem;" data-i18n="module_expert_title">Expert Fiscal Automatisé</h3>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.4;">
                        <span data-i18n="module_expert_desc">Analyse juridique instantanée & Optimisation 100% Hors-ligne</span><br>
                        <span style="font-size: 0.85em; opacity: 0.8; color: #818cf8;">✨ Nouveau : Simulation IS incluse !</span>
                    </p>
                </div>
            </div>

            <div class="glass-card" style="padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #6366f1; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 20px;" data-i18n="label_analysis_params">⚙️ Paramètres d'Analyse</div>
                
                <div class="flex-row" style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="form-group" style="flex: 1; min-width: 200px;">
                        <label data-i18n="label_profile">Profil</label>
                        <select id="typeContribuable" class="form-control" onchange="toggleExpertInputs()">
                            <option value="personne_physique" data-i18n="opt_profile_indiv">Particulier (IRPP)</option>
                            <option value="societe" data-i18n="opt_profile_company">Entreprise (IS)</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1; min-width: 200px;">
                        <label data-i18n="label_sector">Secteur</label>
                        <select id="secteurIA" class="form-control">
                            <option value="tech" data-i18n="opt_sect_tech">Technologie / Startup</option>
                            <option value="services" selected data-i18n="opt_sect_services">Services / Commerce</option>
                            <option value="banque" data-i18n="opt_sect_bank">Banque / Finance</option>
                            <option value="industrie" data-i18n="opt_sect_industry">Industrie</option>
                            <option value="agriculture" data-i18n="opt_sect_agri">Agriculture & Pêche</option>
                        </select>
                    </div>
                </div>

                <!-- IS Specifc Inputs (Initially Hidden) -->
                <div id="expert-is-inputs" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 0.8em; color: #94a3b8; margin-bottom: 10px;">📊 Données Financières (Estimation)</div>
                    <div class="flex-row" style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <div class="form-group" style="flex: 1;">
                            <label data-i18n="label_turnover_ttc">Chiffre d'Affaires (TTC)</label>
                            <input type="number" id="expertCa" class="form-control" placeholder="Ex: 100000">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label data-i18n="label_accounting_result">Résultat Comptable</label>
                            <input type="number" id="expertRes" class="form-control" placeholder="Ex: 20000">
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    <label class="check-box-ui"><input type="checkbox" id="checkZDR" onchange="validateAdvantages()"> <span data-i18n="cb_zdr">Zone Régionale (ZDR)</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkStartup" onchange="validateAdvantages()"> <span data-i18n="cb_startup">Label Startup</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkExport" onchange="validateAdvantages()"> <span data-i18n="cb_export">Exportateur</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkExtension" onchange="validateAdvantages()"> <span data-i18n="cb_extension">Extension Activité</span></label>
                </div>
                
                <!-- Validation Warning -->
                <div id="advantage-warning" style="display: none; margin-top: 10px; padding: 10px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 6px; font-size: 0.85rem; color: #f59e0b;">
                    ⚠️ <span data-i18n="warn_multiple_advantages">Plusieurs avantages cochés : seul l'avantage le plus favorable sera appliqué (non-cumul légal).</span>
                </div>
                
                <input type="hidden" id="anneeCreation" value="2026">
                <input type="hidden" id="trancheCA" value="standard">
            </div>

            <div style="text-align: center;">
                <button id="btn-analyser" class="btn-primary" style="padding: 15px 40px; font-size: 1.1rem; border-radius: 50px; background: #6366f1; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);" data-i18n="btn_start_audit">
                    ⚡ Lancer l'Audit Automatique
                </button>
            </div>
            
            <section id="advisor-dashboard" style="display: none; margin-top: 40px;">
                <div class="advisor-grid" style="display: grid; grid-template-columns: 320px 1fr; gap: 25px;">
                    <!-- Sidebar Context -->
                    <div class="advisor-sidebar">
                        <div class="glass-card advisor-sidebar-card" style="padding: 20px; border-left: 4px solid #6366f1;">
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 15px;" data-i18n="label_current_context">📊 CONTEXTE ACTUEL</div>
                            <div id="context-summary-info"></div>
                            <div id="simulation-net-display" style="margin-top: 20px; text-align: center; background: rgba(99,102,241,0.05); padding: 15px; border-radius: 12px;">
                                <div style="font-size: 0.65rem; color: #818cf8;" data-i18n="label_net_estimation">ESTIMATION FISCALE</div>
                                <div id="net-val" style="font-size: 1.4rem; font-weight: 800; color: #fff;">-</div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Report -->
                    <div class="advisor-main-report">
                        <div class="glass-card main-report-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="background: rgba(255,255,255,0.03); padding: 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="color: #22c55e;">●</span> <strong style="font-size: 0.9rem;" data-i18n="label_expert_report">RAPPORT D'EXPERTISE ADVISOR</strong>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="btn-n8n" onclick="sendToWebhook()" style="background: rgba(255,102,0,0.1); border: 1px solid rgba(255,102,0,0.3); color: #ff6600; padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 5px;">
                                    🚀 <span id="n8n-status" data-i18n="btn_sync_n8n">Synchroniser n8n</span>
                                </button>
                                <button onclick="exportDiscussion()" style="background: none; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;" data-i18n="btn_download">📥 Télécharger</button>
                            </div>
                        </div>
                        <div id="advisor-report-content" style="padding: 30px; min-height: 400px; background: rgba(0,0,0,0.2);">
                            <!-- Report injected here -->
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <style>
            .check-box-ui { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #cbd5e1; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 8px; transition: 0.2s; }
            .check-box-ui:hover { background: rgba(255,255,255,0.05); }
            .report-section { margin-bottom: 25px; }
            .report-section h4 { color: #818cf8; margin-bottom: 10px; font-size: 1rem; border-bottom: 1px solid rgba(129, 140, 248, 0.2); padding-bottom: 5px; }
            .report-text { line-height: 1.6; color: #94a3b8; font-size: 0.95rem; }
            .opp-badge { display: inline-block; padding: 2px 8px; background: rgba(34, 197, 94, 0.1); color: #4ade80; border-radius: 4px; font-size: 0.75rem; margin-right: 5px; font-weight: 600; }
            
            @media (max-width: 800px) {
                .advisor-grid { grid-template-columns: 1fr; }
            }
        </style>
    `;

    document.getElementById('btn-analyser').addEventListener('click', analyserProfil);

    // Global helper for input toggling
    window.toggleExpertInputs = function () {
        const type = document.getElementById('typeContribuable').value;
        const isInputs = document.getElementById('expert-is-inputs');
        if (type === 'societe') {
            isInputs.style.display = 'block';
        } else {
            isInputs.style.display = 'none';
        }
    };

    // Global helper for advantage validation
    window.validateAdvantages = function () {
        const zdr = document.getElementById('checkZDR').checked;
        const startup = document.getElementById('checkStartup').checked;
        const exportChecked = document.getElementById('checkExport').checked;
        const extension = document.getElementById('checkExtension').checked;

        const count = [zdr, startup, exportChecked, extension].filter(Boolean).length;
        const warning = document.getElementById('advantage-warning');

        if (count > 1) {
            warning.style.display = 'block';
        } else {
            warning.style.display = 'none';
        }
    };

    // Initialize toggle state
    toggleExpertInputs();
}

async function analyserProfil() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    const btn = document.getElementById('btn-analyser');
    const originalText = btn.innerText;

    // Inputs
    const typeProfile = document.getElementById('typeContribuable').value;
    const secteur = document.getElementById('secteurIA').value;
    const isZDR = document.getElementById('checkZDR').checked;

    // Simulate Research Phase
    btn.disabled = true;
    btn.innerHTML = `🔍 ${t('msg_searching_jort')}...`;

    await new Promise(r => setTimeout(r, 600));
    btn.innerHTML = `⚖️ ${t('msg_verifying_lf2026')}...`;

    // RUN CALCULATION (If Society)
    let calcResult = null;
    if (typeProfile === 'societe' && window.FiscalLogic && window.FiscalLogic.computeIS) {
        // Map Sector ID for calculation
        // 'tech' -> 'nouvelle_1' if startup? or standard 15%? Let's assume standard 'commun' (20%) or 'nouvelle_4' (15%) for now
        // For simplicity, we map generic sectors to specific IDs expected by IS module or pick defaults
        const sectorMap = {
            'tech': 'commun', // Or specific
            'services': 'commun',
            'banque': 'banque',
            'industrie': 'industrie',
            'agriculture': 'agri'
        };

        const ca = parseFloat(document.getElementById('expertCa').value) || 0;
        const res = parseFloat(document.getElementById('expertRes').value) || 0;

        const isStartup = document.getElementById('checkStartup').checked;
        const isExport = document.getElementById('checkExport').checked;

        calcResult = window.FiscalLogic.computeIS({
            sectorId: sectorMap[secteur] || 'commun',
            resComptable: res,
            caTtc: ca,
            reintegrations: 0,
            deductions: 0,
            montantReinvesti: 0,
            isZDR: isZDR, // Pass ZDR Status
            isStartup: isStartup, // Pass Startup Status
            isExport: isExport // Pass Export Status
        });
    }

    await new Promise(r => setTimeout(r, 600));
    btn.innerHTML = originalText;
    btn.disabled = false;

    const data = {
        type: typeProfile,
        secteur: secteur,
        anneeCreation: parseInt(document.getElementById('anneeCreation').value) || 2026,
        zoneRegionale: isZDR,
        startup: document.getElementById('checkStartup').checked,
        export: document.getElementById('checkExport').checked,
        extension: document.getElementById('checkExtension').checked
    };

    document.getElementById('advisor-dashboard').style.display = 'block';

    // 1. Update Context Sidebar
    const contextInfo = document.getElementById('context-summary-info');
    contextInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
            <span style="color: #64748b;">${t('label_regime')} :</span> <span style="color: #fff; font-weight: 600;">${data.type === 'societe' ? 'IS' : 'IRPP'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
            <span style="color: #64748b;">${t('label_sector')} :</span> <span style="color: #fff; font-weight: 600;">${data.secteur || 'Services'}</span>
        </div>
    `;

    const summaryDisplay = document.getElementById('net-val');
    const labelDisplay = document.querySelector('#simulation-net-display div');

    if (calcResult && calcResult.optimized) {
        labelDisplay.innerText = t("label_is_due") || "IS Dû Estimé";
        summaryDisplay.innerText = calcResult.optimized.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' });
    } else {
        summaryDisplay.innerText = "---";
    }

    // --- GENERATE EDUCATIONAL NARRATIVE ---
    const generateNarrative = (res, data) => {
        // Safe access to properties
        const stdRate = res && res.standard ? (res.standard.appliedRate * 100).toFixed(0) : "15";
        const savings = res ? res.savings : 0;

        let text = "";

        // 1. Context Standard
        text += `<p class="report-text">L'entreprise relève du régime de l'Impôt sur les Sociétés (IS) au taux de <strong>${stdRate}%</strong> (Régime de Droit Commun).<br>`;

        // 2. Advantage Explanation (distinguishing Exemption vs Deduction)
        if (data.startup) {
            text += `Toutefois, en raison de son éligibilité au label <strong>Startup Act</strong>, elle bénéficie d'une <strong>exonération totale de l'IS</strong> pour la période légale (4 à 8 ans).<br>`;
        } else if (data.zoneRegionale) {
            text += `Toutefois, son implantation en <strong>Zone de Développement Régional (ZDR)</strong> lui ouvre droit à une <strong>exonération totale de l'IS</strong> (pendant 5 ou 10 ans selon le groupe).<br>`;
        } else if (data.export) {
            text += `Toutefois, son statut <strong>Totalement Exportateur</strong> lui permet de bénéficier d'une <strong>exonération temporaire</strong> puis d'un taux réduit de <strong>10%</strong>.<br>`;
        }

        // 3. Conclusion & Savings
        if (savings > 0) {
            // Check if IS due is 0
            if (res.optimized.is === 0) {
                text += `En conséquence, le montant de l'IS dû est <strong>nul</strong>, générant une économie fiscale estimée à <strong style="color:#4ade80;">${savings.toLocaleString()} DT</strong>.</p>`;
            } else {
                text += `En conséquence, le montant de l'IS dû est ramené à <strong>${res.optimized.total.toLocaleString()} DT</strong>, générant une économie fiscale estimée à <strong style="color:#4ade80;">${savings.toLocaleString()} DT</strong>.</p>`;
            }
        } else {
            text += `Aucun avantage fiscal spécifique (exonération ou déduction) n'a été détecté.</p>`;
        }

        // 4. Add clarification note if Extension is checked
        if (data.extension) {
            text += `<p class="report-text" style="font-size:0.85rem; color:#94a3b8; margin-top:10px;"><em>Note : L'extension d'activité constitue une <strong>déduction fiscale</strong> (non une exonération), entraînant une réduction de la base imposable via amortissements accélérés.</em></p>`;
        }

        return text;
    };

    let reportNarrative = "";
    if (calcResult) {
        reportNarrative = generateNarrative(calcResult, data);
    } else {
        reportNarrative = `<p class="report-text">${t('txt_profile_detected')} : <strong>${data.type}</strong> (${data.secteur}).</p>`;
    }

    // 2. Generate Automated Report HTML
    const reportArea = document.getElementById('advisor-report-content');

    // Determine badges
    let badgesHtml = "";
    if (data.startup) badgesHtml += `<div class="opp-badge">Startup Act</div>`;
    if (data.zoneRegionale) badgesHtml += `<div class="opp-badge">ZDR</div>`;
    if (data.export) badgesHtml += `<div class="opp-badge">Export</div>`;

    const reportHtml = `
        <div class="report-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4>📌 Synthèse Fiscale Advisor</h4>
                <div>${badgesHtml}</div>
            </div>
            ${reportNarrative}
        </div>

        ${calcResult ? `
        <div class="report-section">
            <h4>💡 Détails du Calcul</h4>
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem;">
                    <span>Résultat Fiscal Global :</span> <strong>${calcResult.optimized.baseGlobal.toLocaleString()} DT</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem;">
                    <span>Taux Retenu :</span> <strong>${(calcResult.optimized.appliedRate * 100).toFixed(0)}%</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.1); padding-top:5px; color:#c7d2fe; font-size:1rem;">
                    <span>IS Net Dû :</span> <strong>${calcResult.optimized.total.toLocaleString()} DT</strong>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="report-section">
            <h4>⚖️ ${t('title_obligations')}</h4>
            <ul style="color: #94a3b8; font-size: 0.95rem; line-height: 1.8; padding-left: 20px;">
                <li><strong>${t('label_reg_monthly_decl')} :</strong> ${t('txt_monthly_decl_deadline')}</li>
                <li><strong>${t('label_reg_css')} :</strong> ${data.type === 'societe' ? t('txt_css_company') : t('txt_css_indiv')}.</li>
                ${data.type === 'societe' ? `<li><strong>${t('label_reg_min_tax')} :</strong> ${t('txt_min_tax')}</li>` : ''}
            </ul>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: rgba(245, 158, 11, 0.05); border-radius: 15px; border: 1px dashed rgba(245, 158, 11, 0.2); text-align: center;">
            <p style="margin: 0; color: #f59e0b; font-size: 0.85rem;">⚠️ ${t('disclaimer_auto_generated')}</p>
        </div>
    `;

    reportArea.innerHTML = reportHtml;
    document.getElementById('advisor-dashboard').scrollIntoView({ behavior: 'smooth' });
}

async function sendToWebhook() {
    const webhookUrl = AI_CONFIG.n8n.webhookUrl;
    const statusEl = document.getElementById('n8n-status');
    const btn = document.getElementById('btn-n8n');

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Prepare Data
    const payload = {
        timestamp: new Date().toISOString(),
        calculation: window.lastCalculation || null,
        report: document.getElementById('advisor-report-content').innerText,
        profile: {
            type: document.getElementById('typeContribuable').value,
            secteur: document.getElementById('secteurIA').value,
            zdr: document.getElementById('checkZDR').checked,
            startup: document.getElementById('checkStartup').checked,
            export: document.getElementById('checkExport').checked
        }
    };

    try {
        statusEl.innerText = t("status_sending"); // "Envoi..."
        btn.style.opacity = "0.7";

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            statusEl.innerText = t("status_synced"); // "Synchronisé !"
            btn.style.background = "rgba(34, 197, 94, 0.1)";
            btn.style.borderColor = "rgba(34, 197, 94, 0.3)";
            btn.style.color = "#4ade80";
        } else {
            throw new Error("Erreur serveur");
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        statusEl.innerText = t("status_failed"); // "Échec"
        btn.style.background = "rgba(239, 68, 68, 0.1)";
        btn.style.borderColor = "rgba(239, 68, 68, 0.3)";
        btn.style.color = "#ef4444";

        setTimeout(() => {
            statusEl.innerText = t("status_retry"); // "Ressayer"
            btn.style.opacity = "1";
        }, 3000);
    }
}

function exportDiscussion() {
    const report = document.getElementById('advisor-report-content').innerText;
    const blob = new Blob(["RAPPORT D'EXPERTISE FISCALE - LF 2026\n\n" + report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Rapport_Fiscal_Automatise.txt";
    a.click();
}
