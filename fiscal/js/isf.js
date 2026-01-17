// ============================================================
// IF - IMPÔT SUR LA FORTUNE 2026
// Loi de Finances Tunisienne 2026
// ============================================================

function initISF() {
    const container = document.getElementById('isf-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); margin-bottom: 20px;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:1.5em;">⚠️</span>
                <div>
                    <strong style="color: #ef4444;">Impôt sur la Fortune (IF) - LF 2026</strong>
                    <p style="font-size: 0.85em; opacity: 0.9; margin:5px 0 0 0;">
                        Le nouvel Impôt sur la Fortune (IF) porte sur le patrimoine net global dépassant 3 Millions DT. Les taux progressifs de <strong>0,5%</strong> et <strong>1%</strong> sont désormais effectifs pour 2026.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section 1: Patrimoine Immobilier -->
        <div class="form-section" style="border-left: 4px solid #8b5cf6;">
            <div class="section-title">
                <span class="icon">🏠</span>
                <span>Patrimoine Immobilier</span>
            </div>
            
            <div class="form-group">
                <label>Valeur totale des biens immobiliers (DT)</label>
                <input type="number" id="immoTotal" class="form-control" placeholder="Terrains, villas, appartements...">
                <div class="help-text"><strong>Exonération :</strong> Résidence principale et biens à usage professionnel.</div>
            </div>
        </div>

        <!-- Section 2: Patrimoine Mobilier -->
        <div class="form-section" style="border-left: 4px solid #3b82f6;">
            <div class="section-title">
                <span class="icon">💰</span>
                <span>Patrimoine Mobilier & Valeurs</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Placements & Liquidités (DT)</label>
                    <input type="number" id="mobilierLiquide" class="form-control" placeholder="Comptes, placements...">
                </div>
                <div class="form-group flex-col-50">
                    <label>Valeurs Incorporelles (DT)</label>
                    <input type="number" id="mobilierIncorporel" class="form-control" placeholder="Actions, parts sociales, brevets...">
                </div>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Véhicules de Luxe (> 12 CV)</label>
                    <input type="number" id="mobilierLuxe" class="form-control" placeholder="Voitures, bateaux...">
                    <div class="help-text">Les véhicules ≤ 12 CV sont exonérés.</div>
                </div>
                <div class="form-group flex-col-50">
                    <label>Bijoux & Objets d'art (DT)</label>
                    <input type="number" id="mobilierAutres" class="form-control" placeholder="0.000">
                </div>
            </div>
            
            <div class="info-bubble" style="font-size: 0.8em; margin-top: 5px;">
                💡 <strong>Rappel Art. 88 :</strong> Le patrimoine des enfants mineurs est agrégé à celui du tuteur.
            </div>
        </div>

        <!-- Section 3: Passif -->
        <div class="form-section" style="border-left: 4px solid var(--warning);">
            <div class="section-title">
                <span class="icon">📉</span>
                <span>Passif (Dettes déductibles)</span>
            </div>
            
            <div class="form-group">
                <label>Total des dettes justifiées (DT)</label>
                <input type="number" id="passifDettes" class="form-control" placeholder="Crédits immobiliers, dettes fiscales...">
                <div class="help-text">Uniquement les dettes liées aux biens imposables.</div>
            </div>
        </div>

        <button id="btn-calc-if" class="btn-primary" style="background: linear-gradient(135deg, #8b5cf6, #6366f1);">
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
    let tranche = "";

    if (patrimoineNet <= 3000000) {
        isfDu = 0;
        tranche = "Non imposable (< 3M DT)";
    } else if (patrimoineNet <= 5000000) {
        isfDu = patrimoineNet * 0.005;
        tranche = "Tranche 1 (0,5%)";
    } else {
        isfDu = patrimoineNet * 0.01;
        tranche = "Tranche 2 (1%)";
    }

    const resultDiv = document.getElementById('result-if');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid #8b5cf6;">
            <div class="result-header">
                <span>Montant de l'IF Dû</span>
                <span class="final-amount" style="color: #a78bfa;">${isfDu.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.95em;">
                    <div>
                        <span style="opacity:0.7">Patrimoine Brut :</span>
                        <strong style="float:right">${patrimoineBrut.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">Dettes déductibles :</span>
                        <strong style="float:right; color: var(--warning)">- ${dettes.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 5px;">
                        <span style="font-weight: 600;">Patrimoine Net Imposable :</span>
                        <strong style="float:right; color: #a78bfa; font-size: 1.2em;">${patrimoineNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <div style="padding: 12px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500;">Statut / Tranche :</span>
                    <span class="badge" style="background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 20px;">${tranche}</span>
                </div>
            </div>

            <div style="margin-top: 20px; font-size: 0.8em; opacity: 0.7; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 6px;">
                <p><strong>📌 Rappels Réglementaires IF 2026 (Art. 88) :</strong></p>
                <ul style="padding-left: 15px; margin-top: 5px;">
                    <li><strong>Exclusions :</strong> Résidence principale, biens pro, dépôts bancaires (non spécifiés), véhicules ≤ 12 CV.</li>
                    <li><strong>Agrégation :</strong> Incorporels inclus, patrimoine des enfants mineurs agrégé.</li>
                    <li><strong>Déclaration :</strong> Annuelle obligatoire avant le 30 juin via plateforme électronique.</li>
                </ul>
            </div>
            
            <button onclick="window.print()" class="btn-primary" style="margin-top:15px; background: var(--accent);">📄 Générer Certificat Patrimoine</button>
        </div>
    `;
}
