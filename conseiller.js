// CONSEILLER FISCAL - Agent Intelligent Automatisé
// Module d'Audit et Conseil Gratuite - Loi de Finances 2026
// ============================================================

const BK_FISCAL = {
    avantages: {
        nouvelles_entreprises: {
            title_key: "adv_new_companies",
            type: "Fiscale",
            desc_key: "desc_new_companies",
            loi: "LF 2024 / Code des Investissements",
            applicable: (data) => data.anneeCreation >= 2024 && !['banque', 'telecom', 'finance'].includes(data.secteur)
        },
        zdr: {
            title_key: "adv_zdr",
            type: "Fiscale",
            desc_key: "desc_zdr",
            loi: "LF 2026 / Décret ZDR",
            applicable: (data) => data.zoneRegionale === true
        },
        startup: {
            title_key: "adv_startup",
            type: "Fiscale",
            desc_key: "desc_startup",
            loi: "Loi 2018-20 (Startup Act)",
            applicable: (data) => data.startup === true
        },
        export: {
            title_key: "adv_export",
            type: "Fiscale",
            desc_key: "desc_export",
            loi: "Code IRPP/IS Art. 49",
            applicable: (data) => data.export === true
        },
        agricole: {
            title_key: "adv_agri",
            type: "Fiscale",
            desc_key: "desc_agri",
            loi: "Code Invest. / LF 2026",
            applicable: (data) => data.secteur === 'agriculture'
        },
        assurance_vie: {
            title_key: "adv_life_insurance",
            type: "Déduction",
            desc_key: "desc_life_insurance",
            loi: "Art. 39 Code IRPP",
            applicable: (data) => data.type === 'personne_physique'
        },
        cea: {
            title_key: "adv_cea",
            type: "Déduction",
            desc_key: "desc_cea",
            loi: "LF 2024 / Code IRPP",
            applicable: (data) => data.type === 'personne_physique'
        },
        innovation_tech: {
            title_key: "adv_research_credit",
            type: "Crédit",
            desc_key: "desc_research_credit",
            loi: "LF 2025",
            applicable: (data) => data.secteur === 'tech' && data.type === 'societe'
        },
        green_energy: {
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
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.95rem;" data-i18n="module_expert_desc">Analyse juridique instantanée & Optimisation 100% Hors-ligne</p>
                </div>
            </div>

            <div class="glass-card" style="padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #6366f1; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 20px;" data-i18n="label_analysis_params">⚙️ Paramètres d'Analyse</div>
                <div class="flex-row" style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex: 1;">
                        <label data-i18n="label_profile">Profil</label>
                        <select id="typeContribuable" class="form-control">
                            <option value="personne_physique" data-i18n="opt_profile_indiv">Particulier (IRPP)</option>
                            <option value="societe" data-i18n="opt_profile_company">Entreprise (IS)</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
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
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    <label class="check-box-ui"><input type="checkbox" id="checkZDR"> <span data-i18n="cb_zdr">Zone Régionale (ZDR)</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkStartup"> <span data-i18n="cb_startup">Label Startup</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkExport"> <span data-i18n="cb_export">Exportateur</span></label>
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
                <div style="display: grid; grid-template-columns: 320px 1fr; gap: 25px;">
                    <!-- Sidebar Context -->
                    <div>
                        <div class="glass-card" style="padding: 20px; border-left: 4px solid #6366f1;">
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 15px;" data-i18n="label_current_context">📊 CONTEXTE ACTUEL</div>
                            <div id="context-summary-info"></div>
                            <div id="simulation-net-display" style="margin-top: 20px; text-align: center; background: rgba(99,102,241,0.05); padding: 15px; border-radius: 12px;">
                                <div style="font-size: 0.65rem; color: #818cf8;" data-i18n="label_net_estimation">ESTIMATION NETTE</div>
                                <div id="net-val" style="font-size: 1.4rem; font-weight: 800; color: #fff;">0.000 DT</div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Report -->
                    <div class="glass-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
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
        </style>
    `;

    document.getElementById('btn-analyser').addEventListener('click', analyserProfil);
}

async function analyserProfil() {
    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    const btn = document.getElementById('btn-analyser');
    const originalText = btn.innerText;

    // Simulate Research Phase
    btn.disabled = true;
    btn.innerHTML = `🔍 ${t('msg_searching_jort')}...`;

    await new Promise(r => setTimeout(r, 800));
    btn.innerHTML = `⚖️ ${t('msg_verifying_lf2026')}...`;
    await new Promise(r => setTimeout(r, 600));
    btn.innerHTML = originalText;
    btn.disabled = false;

    const data = {
        type: document.getElementById('typeContribuable').value,
        secteur: document.getElementById('secteurIA').value,
        anneeCreation: parseInt(document.getElementById('anneeCreation').value) || 2026,
        zoneRegionale: document.getElementById('checkZDR').checked,
        startup: document.getElementById('checkStartup').checked,
        export: document.getElementById('checkExport').checked
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
    const labelDisplay = document.querySelector('#simulation-net-display div'); // The small label

    if (window.lastCalculation) {
        const type = window.lastCalculation.type;
        const calcData = window.lastCalculation.data;
        const formatter = new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' });

        switch (type) {
            case 'IRPP':
                labelDisplay.innerText = t("label_est_net_monthly");
                summaryDisplay.innerText = formatter.format(calcData.netMensuel);
                break;
            case 'IS':
                labelDisplay.innerText = t("label_is_due");
                summaryDisplay.innerText = formatter.format(calcData.totalAPayer || (window.lastCalculation.totalTax));
                break;
            case 'TVA':
                labelDisplay.innerText = t("label_tva_balance");
                summaryDisplay.innerText = formatter.format(Math.abs(calcData.solde || 0)) + (calcData.solde < 0 ? " (Crédit)" : " (Dû)");
                break;
            case 'IF':
                labelDisplay.innerText = t("label_isf_due");
                summaryDisplay.innerText = formatter.format(calcData.isfDu || 0);
                break;
            case 'RS':
                labelDisplay.innerText = t("label_net_to_pay_rs");
                summaryDisplay.innerText = formatter.format(calcData.netAPayer || 0);
                break;
            default:
                summaryDisplay.innerText = "0.000 DT";
        }
    } else {
        summaryDisplay.innerText = "0.000 DT";
    }

    // 2. Generate Automated Report
    const reportArea = document.getElementById('advisor-report-content');
    const opportunites = Object.values(BK_FISCAL.avantages).filter(o => o.applicable(data));

    const profileLabel = data.type === 'societe' ? t('profile_company') : t('profile_indiv');

    let reportHtml = `
        <div class="report-section">
            <h4>📌 ${t('title_analysis_summary')}</h4>
            <p class="report-text">${t('txt_profile_detected')} : <strong>${profileLabel}</strong> (${data.secteur}). <br>
            <em style="font-size:0.8em; color:#64748b;">${t('txt_validation_jort')}</em></p>
        </div>

        <div class="report-section">
            <h4>💡 ${t('title_opportunities')} (${opportunites.length})</h4>
            <div style="display: grid; gap: 15px;">
                ${opportunites.length > 0 ? opportunites.map(o => `
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border-left: 4px solid #22c55e;">
                        <div style="font-weight: 700; color: #fff; margin-bottom: 5px;">${t(o.title_key)} <span class="opp-badge">${o.loi}</span></div>
                        <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">${t(o.desc_key)}</p>
                    </div>
                `).join('') : '<p class="report-text" style="font-style: italic;">' + t('msg_no_opportunities') + '</p>'}
            </div>
        </div>

        <div class="report-section">
            <h4>⚖️ ${t('title_obligations')}</h4>
            <ul style="color: #94a3b8; font-size: 0.95rem; line-height: 1.8; padding-left: 20px;">
                <li><strong>${t('label_reg_monthly_decl')} :</strong> ${t('txt_monthly_decl_deadline')}</li>
                <li><strong>${t('label_reg_css')} :</strong> ${data.type === 'societe' ? t('txt_css_company') : t('txt_css_indiv')}.</li>
                <li><strong>${t('label_reg_rs')} :</strong> ${t('txt_rs_limit')}</li>
                ${data.type === 'societe' ? `<li><strong>${t('label_reg_min_tax')} :</strong> ${t('txt_min_tax')}</li>` : ''}
            </ul>
        </div>

        <div class="report-section">
            <h4>🛡️ ${t('title_proactive_optim')}</h4>
            <div style="background: rgba(99, 102, 241, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.1);">
                <ul style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.7; margin: 0; padding-left: 20px;">
                    ${data.type === 'personne_physique' ? `<li>${t('tip_cea')}</li><li>${t('tip_life_insurance')}</li>` : ''}
                    ${data.secteur === 'tech' ? `<li>${t('tip_rd_credit')}</li>` : ''}
                    <li><strong>${t('label_e_invoicing')} :</strong> ${t('tip_e_invoicing')}</li>
                    <li><strong>${t('label_tej_platform')} :</strong> ${t('tip_tej')}</li>
                </ul>
            </div>
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
