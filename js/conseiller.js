// CONSEILLER FISCAL - Agent Intelligent Automatisé
// Module d'Audit et Conseil Gratuite - Loi de Finances 2026
// ============================================================

const BK_FISCAL = {
    avantages: {
        nouvelles_entreprises: {
            titre: "Régime des Nouvelles Entreprises",
            type: "Fiscale",
            description: "Exonération dégressive sur 4 ans.",
            loi: "LF 2024-2026",
            applicable: (data) => data.anneeCreation >= 2024 && !['banque', 'telecom'].includes(data.secteur)
        },
        zdr: {
            titre: "Développement Régional (ZDR)",
            description: "Exonération totale d'IS (5-10 ans) + Prise en charge CNSS.",
            loi: "Code d'Incitation",
            applicable: (data) => data.zoneRegionale === true
        },
        startup: {
            titre: "Startup Act",
            description: "Prise en charge des charges patronales et exonération IS.",
            loi: "Loi Startup",
            applicable: (data) => data.startup === true
        },
        export: {
            titre: "Régime Exportation Totale",
            description: "Taux réduit d'IS à 10% après période de franchise.",
            loi: "Code IRPP/IS",
            applicable: (data) => data.export === true
        }
    }
};

function initConseiller() {
    const container = document.getElementById('conseiller-container');
    if (!container) return;

    container.innerHTML = `
        <div class="advisor-wrapper">
            <div class="advisor-hero" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 20px; padding: 30px; margin-bottom: 25px; display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 3.5rem;">🤖</div>
                <div>
                    <h3 style="margin: 0; color: #fff; font-size: 1.6rem;">Expert Fiscal Automatisé</h3>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.95rem;">Analyse juridique instantanée & Optimisation 100% Hors-ligne</p>
                </div>
            </div>

            <div class="glass-card" style="padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #6366f1; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 20px;">⚙️ Paramètres d'Analyse</div>
                <div class="flex-row" style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex: 1;">
                        <label>Profil</label>
                        <select id="typeContribuable" class="form-control">
                            <option value="personne_physique">Particulier (IRPP)</option>
                            <option value="societe">Entreprise (IS)</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Secteur</label>
                        <select id="secteurIA" class="form-control">
                            <option value="tech">Technologie / Startup</option>
                            <option value="services" selected>Services / Commerce</option>
                            <option value="banque">Banque / Finance</option>
                            <option value="industrie">Industrie</option>
                        </select>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    <label class="check-box-ui"><input type="checkbox" id="checkZDR"> <span>Zone Régionale</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkStartup"> <span>Label Startup</span></label>
                    <label class="check-box-ui"><input type="checkbox" id="checkExport"> <span>Exporter</span></label>
                </div>
                <input type="hidden" id="anneeCreation" value="2026">
                <input type="hidden" id="trancheCA" value="standard">
            </div>

            <div style="text-align: center;">
                <button id="btn-analyser" class="btn-primary" style="padding: 15px 40px; font-size: 1.1rem; border-radius: 50px; background: #6366f1; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
                    ⚡ Lancer l'Audit Automatique
                </button>
            </div>
            
            <section id="advisor-dashboard" style="display: none; margin-top: 40px;">
                <div style="display: grid; grid-template-columns: 320px 1fr; gap: 25px;">
                    <!-- Sidebar Context -->
                    <div>
                        <div class="glass-card" style="padding: 20px; border-left: 4px solid #6366f1;">
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 15px;">📊 CONTEXTE ACTUEL</div>
                            <div id="context-summary-info"></div>
                            <div id="simulation-net-display" style="margin-top: 20px; text-align: center; background: rgba(99,102,241,0.05); padding: 15px; border-radius: 12px;">
                                <div style="font-size: 0.65rem; color: #818cf8;">ESTIMATION NETTE</div>
                                <div id="net-val" style="font-size: 1.4rem; font-weight: 800; color: #fff;">0.000 DT</div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Report -->
                    <div class="glass-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="background: rgba(255,255,255,0.03); padding: 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="color: #22c55e;">●</span> <strong style="font-size: 0.9rem;">RAPPORT D'EXPERTISE ADVISOR</strong>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="btn-n8n" onclick="sendToWebhook()" style="background: rgba(255,102,0,0.1); border: 1px solid rgba(255,102,0,0.3); color: #ff6600; padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 5px;">
                                    🚀 <span id="n8n-status">Synchroniser n8n</span>
                                </button>
                                <button onclick="exportDiscussion()" style="background: none; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">📥 Télécharger</button>
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

function analyserProfil() {
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
            <span style="color: #64748b;">Régime :</span> <span style="color: #fff; font-weight: 600;">${data.type === 'societe' ? 'IS' : 'IRPP'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
            <span style="color: #64748b;">Secteur :</span> <span style="color: #fff; font-weight: 600;">${data.secteur || 'Services'}</span>
        </div>
    `;

    if (window.lastCalculation && window.lastCalculation.type === 'IRPP') {
        document.getElementById('net-val').innerText = new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(window.lastCalculation.data.netMensuel) + " (Net/m)";
    }

    // 2. Generate Automated Report
    const reportArea = document.getElementById('advisor-report-content');
    const opportunites = Object.values(BK_FISCAL.avantages).filter(o => o.applicable(data));

    let reportHtml = `
        <div class="report-section">
            <h4>📌 Synthèse de l'Analyse</h4>
            <p class="report-text">Profil détecté : <strong>${data.type === 'societe' ? 'Personne Morale' : 'Personne Physique'}</strong> exerçant dans le secteur <strong>${data.secteur}</strong>. L'analyse porte sur les dispositions de la <strong>Loi de Finances 2026</strong>.</p>
        </div>

        <div class="report-section">
            <h4>💡 Opportunités Détectées (${opportunites.length})</h4>
            <div style="display: grid; gap: 15px;">
                ${opportunites.length > 0 ? opportunites.map(o => `
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border-left: 4px solid #22c55e;">
                        <div style="font-weight: 700; color: #fff; margin-bottom: 5px;">${o.titre} <span class="opp-badge">${o.loi}</span></div>
                        <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">${o.description}</p>
                    </div>
                `).join('') : '<p class="report-text" style="font-style: italic;">Aucun avantage spécifique majeur détecté pour ces paramètres.</p>'}
            </div>
        </div>

        <div class="report-section">
            <h4>⚖️ Obligations & Points de Vigilance</h4>
            <ul style="color: #94a3b8; font-size: 0.95rem; line-height: 1.8; padding-left: 20px;">
                <li><strong>Déclaration Mensuelle :</strong> À déposer avant le 15 (physique) ou 28 (morale) sous peine de pénalités de retard.</li>
                <li><strong>CSS :</strong> Application automatique du taux de 0.5% (IRPP) ou 3% (IS) sur le bénéfice net.</li>
                <li><strong>Facturation :</strong> Passage obligatoire à la facture électronique pour les transactions > 1000 DT en 2026.</li>
            </ul>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: rgba(245, 158, 11, 0.05); border-radius: 15px; border: 1px dashed rgba(245, 158, 11, 0.2); text-align: center;">
            <p style="margin: 0; color: #f59e0b; font-size: 0.85rem;">⚠️ Ce rapport est généré automatiquement par l'algorithme "Advisor Core" et n'a qu'une valeur indicative. Consultez un expert-comptable agréé pour toute décision fiscale.</p>
        </div>
    `;

    reportArea.innerHTML = reportHtml;
    document.getElementById('advisor-dashboard').scrollIntoView({ behavior: 'smooth' });
}

async function sendToWebhook() {
    const webhookUrl = AI_CONFIG.n8n.webhookUrl;
    const statusEl = document.getElementById('n8n-status');
    const btn = document.getElementById('btn-n8n');

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
        statusEl.innerText = "Envoi...";
        btn.style.opacity = "0.7";

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            statusEl.innerText = "Synchronisé !";
            btn.style.background = "rgba(34, 197, 94, 0.1)";
            btn.style.borderColor = "rgba(34, 197, 94, 0.3)";
            btn.style.color = "#4ade80";
        } else {
            throw new Error("Erreur serveur");
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        statusEl.innerText = "Échec";
        btn.style.background = "rgba(239, 68, 68, 0.1)";
        btn.style.borderColor = "rgba(239, 68, 68, 0.3)";
        btn.style.color = "#ef4444";

        setTimeout(() => {
            statusEl.innerText = "Ressayer";
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

window.addEventListener('DOMContentLoaded', initConseiller);
