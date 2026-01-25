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
            
            /* Typing Indicator */
            .typing-indicator { display: flex; gap: 5px; }
            .typing-dot { width: 8px; height: 8px; background: #818cf8; border-radius: 50%; opacity: 0.4; animation: typing 1s infinite ease-in-out; }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing { 
                0%, 100% { transform: translateY(0); opacity: 0.4; } 
                50% { transform: translateY(-5px); opacity: 1; } 
            }

            @media (max-width: 800px) {
                .advisor-grid { grid-template-columns: 1fr; }
            }
        </style>
    `;

    document.getElementById('btn-analyser').addEventListener('click', analyserProfil);

    // Global helper for input toggling
    window.toggleExpertInputs = function () {
        // Inputs removed, function kept for compatibility if called elsewhere but does nothing
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

// function generateAIAdvice removed - now integrated into analyserProfil

async function analyserProfil() {
    // AI Service Instance
    const ai = typeof getAIService !== 'undefined' ? getAIService() : null;

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

    // Simulate Research Phase (Faster)
    btn.disabled = true;
    btn.innerHTML = `🔍 ${t('msg_searching_jort')}...`;

    await new Promise(r => setTimeout(r, 400));
    btn.innerHTML = `⚖️ ${t('msg_verifying_lf2026')}...`;

    // 1. Data Capture
    const data = {
        type: typeProfile,
        secteur: secteur,
        anneeCreation: 2026,
        zoneRegionale: isZDR,
        startup: document.getElementById('checkStartup').checked,
        export: document.getElementById('checkExport').checked,
        extension: document.getElementById('checkExtension').checked
    };

    // financial calculations removed per user request

    await new Promise(r => setTimeout(r, 400));
    btn.innerHTML = originalText;
    btn.disabled = false;

    // 2. Show Dashboard container
    document.getElementById('advisor-dashboard').style.display = 'block';

    // 3. Update Context Sidebar
    const contextInfo = document.getElementById('context-summary-info');
    contextInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
            <span style="color: #64748b;">${t('label_regime')} :</span> <span style="color: #fff; font-weight: 600;">${data.type === 'societe' ? 'IS' : 'IRPP'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
            <span style="color: #64748b;">${t('label_sector')} :</span> <span style="color: #fff; font-weight: 600;">${data.secteur || 'Services'}</span>
        </div>
    `;

    // 4. Report Initialization & AI logic
    const reportArea = document.getElementById('advisor-report-content');
    reportArea.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #818cf8;">
            <div class="typing-indicator" style="margin-bottom: 20px;">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <p><strong data-i18n="msg_ai_writing">${t('msg_ai_writing')}</strong></p>
        </div>
    `;

    let aiAnalysis = "";
    let aiVerdict = "good";
    const isDroitCommun = ![data.startup, data.zoneRegionale, data.export, data.extension].some(Boolean);

    if (ai) {
        const prompt = `Analyse fiscale experte pour ce profil en Tunisie (LF 2026) :
        - Type : ${data.type === 'societe' ? 'Société (IS)' : 'Particulier (IRPP)'}
        - Secteur : ${data.secteur}
        - Régime : ${isDroitCommun ? 'Droit Commun (Général)' : 'Incitations fiscales'}
        - Avantages cochés : ${[data.startup ? 'Startup Act' : '', data.zoneRegionale ? 'ZDR' : '', data.export ? 'Export' : '', data.extension ? 'Extension' : ''].filter(Boolean).join(', ') || 'Aucun (Droit Commun)'}.

        IMPORTANT : Réponds au format JSON strict suivant :
        {
          "verdict": "very_favorable" | "favorable" | "good" | "optimize" | "unfavorable",
          "analysis": "Texte de l'analyse stratégique pédagogique en 3-4 phrases."
        }`;

        try {
            const response = await ai.sendMessageSimple(prompt);
            const jsonMatch = response.match(/\{.*\}/s);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                aiVerdict = parsed.verdict || "good";
                aiAnalysis = parsed.analysis || "";
            } else {
                aiAnalysis = response;
            }
        } catch (e) {
            console.error("AI Analysis Error:", e);
            aiAnalysis = "⚠️ Impossible de générer l'analyse automatique.";
        }
    }

    // Assign AI verdict to data for badge display
    data.verdict = aiVerdict;

    // 5. Final Report Rendering
    let badgesHtml = "";
    if (data.startup) badgesHtml += `<div class="opp-badge">Startup Act</div>`;
    if (data.zoneRegionale) badgesHtml += `<div class="opp-badge">ZDR</div>`;
    if (data.export) badgesHtml += `<div class="opp-badge">Export</div>`;
    if (isDroitCommun) badgesHtml += `<div class="opp-badge" style="background: rgba(148, 163, 184, 0.1); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2);" data-i18n="label_regime_dc">Droit Commun</div>`;

    const reportNarrative = generateNarrative(data, aiAnalysis);

    reportArea.innerHTML = `
        <div class="report-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h4 style="margin:0;">🚀 Synthèse Stratégique Advisor</h4>
                <div>${badgesHtml}</div>
            </div>
            ${reportNarrative}
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(129, 140, 248, 0.05); border-radius: 12px; border: 1px dashed rgba(129, 140, 248, 0.3);">
                <h5 style="color: #818cf8; margin-bottom: 15px; font-weight: 700;">🛡️ Obligations & Rappels 2026</h5>
                <ul style="font-size: 0.9rem; color: #94a3b8; padding-left: 20px; line-height: 1.8;">
                    <li><strong>Déclaration Mensuelle :</strong> Obligatoire avant le 15 ou 28 du mois suivant.</li>
                    <li><strong>Contribution Sociale (CSS) :</strong> Due sur le bénéfice à hauteur de 1% (Général) ou 4% (Spécifique).</li>
                    <li><strong>Minimum d'Impôt :</strong> 0.2% de votre Chiffre d'Affaires quel que soit l'avantage (Hors ZDR/Agri).</li>
                </ul>
            </div>
        </div>
    `;

    // Global Sync for Assistant
    window.lastCalculation = { type: 'ADVISOR', data: data, result: null };

    // Auto-scroll
    document.getElementById('advisor-dashboard').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Educational Narrative Generator
 */
function generateNarrative(data, aiAnalysis = "") {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    // Helper to format AI response (basic markdown)
    const formatAI = (text) => {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    };

    const verdictConfig = {
        'very_favorable': { color: '#22c55e', icon: '🌟', label: t('opt_verdict_very_favorable') },
        'favorable': { color: '#4ade80', icon: '✅', label: t('opt_verdict_favorable') },
        'good': { color: '#818cf8', icon: '👍', label: t('opt_verdict_good') },
        'optimize': { color: '#f59e0b', icon: '⚖️', label: t('opt_verdict_to_optimize') },
        'unfavorable': { color: '#ef4444', icon: '⚠️', label: t('opt_verdict_unfavorable') }
    };

    const v = verdictConfig[data.verdict] || verdictConfig['good'];

    // NEW SECTION: Verdict de l'Expert
    let html = `
        <div class="report-section" style="margin-bottom: 30px;">
            <h4 data-i18n="label_expert_opinion">🛡️ Verdict de l'Expert</h4>
            
            <!-- VERDICT BADGE -->
            <div style="background: ${v.color}20; border: 1px solid ${v.color}40; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                <div style="font-size: 2.5rem;">${v.icon}</div>
                <div>
                    <div style="font-size: 0.75rem; color: ${v.color}; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">SITUATION GLOBALE</div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: #fff;">${v.label}</div>
                </div>
            </div>

            <p class="report-text" data-i18n="msg_expert_opinion_intro" style="margin-bottom: 15px;">
                Basé sur votre profil et les avantages sélectionnés, voici notre analyse stratégique :
            </p>

            <!-- AI GENERATED CONTENT -->
            ${aiAnalysis ? `
            <div style="background: rgba(99, 102, 241, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); margin-bottom: 20px; color: #cbd5e1; line-height: 1.6;">
                <div style="font-size: 0.75rem; color: #818cf8; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1rem;">🤖</span> Analyse par Intelligence Artificielle
                </div>
                ${formatAI(aiAnalysis)}
            </div>` : ''}
        </div>
    `;

    if (data.startup) {
        html += `<div style="background: rgba(99, 102, 241, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #6366f1; margin-bottom: 15px;">
            <strong style="color: #fff; display: block; margin-bottom: 5px;">🚀 Éligibilité Startup Act</strong>
            <p class="report-text" style="margin:0;">Grâce au Label Startup, vous pouvez prétendre à une <strong>exonération totale d'impôt (IS)</strong> pendant 8 ans. 
            C'est l'incitation fiscale la plus performante en Tunisie.</p>
        </div>`;
    }

    if (data.zoneRegionale) {
        html += `<div style="background: rgba(34, 197, 94, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #22c55e; margin-bottom: 15px;">
            <strong style="color: #fff; display: block; margin-bottom: 5px;">📍 Avantages Développement Régional</strong>
            <p class="report-text" style="margin:0;">Votre implantation en zone prioritaire vous permet de ne payer <strong>aucun impôt sur les sociétés</strong> pendant 5 ou 10 ans. 
            Note : Vous êtes également dispensé du minimum d'impôt (IMF).</p>
        </div>`;
    }

    if (data.export) {
        html += `<div style="background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b; margin-bottom: 15px;">
            <strong style="color: #fff; display: block; margin-bottom: 5px;">🌍 Incitations à l'Exportation</strong>
            <p class="report-text" style="margin:0;">Votre profil exportateur bénéficie d'une exonération initiale suivie d'une imposition réduite de <strong>10%</strong>. 
            Le pro-rata entre revenus locaux et export est essentiel dans votre cas.</p>
        </div>`;
    }

    if (data.extension) {
        html += `<div style="background: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #8b5cf6; margin-bottom: 15px;">
            <strong style="color: #fff; display: block; margin-bottom: 5px;">🏗️ Déduction pour Extension</strong>
            <p class="report-text" style="margin:0;">L'extension d'activité permet une déduction fiscale via l'amortissement exceptionnel. 
            C'est un levier puissant pour réduire votre base imposable sans être une exonération totale.</p>
        </div>`;
    }

    if (!data.startup && !data.zoneRegionale && !data.export && !data.extension) {
        html += `<p class="report-text" style="text-align: center; color: #64748b; padding: 20px;">
            🔍 Aucun avantage spécifique n'a été coché.<br>Sélectionnez des options au-dessus pour voir vos gains potentiels.</p>`;
    }

    html += `<p style="font-size: 0.8rem; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
        💡 <strong>Recommandation :</strong> Pour un audit financier complet avec calcul du minimum d'impôt et de la CSS, utilisez l'onglet <strong>🏢 IS</strong>.</p>`;

    return html;
}

// Webhook removed per user request

function exportDiscussion() {
    const report = document.getElementById('advisor-report-content').innerText;
    const blob = new Blob(["RAPPORT EXPERT FISCAL TUNISIE 2026\n\n" + report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Rapport_Advisor_2026.txt";
    a.click();
}

// Global Exports
window.AdvisorLogic = { analyserProfil, exportDiscussion };
