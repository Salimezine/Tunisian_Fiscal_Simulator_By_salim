// RETENUES À LA SOURCE (RS) 2026
// RS - RETENUE À LA SOURCE - LF 2026
// Version Standalone - Simplifiée

const RS_RATES = [
    { id: 'rs_is_1', label: 'RS 1% (Achats > 1000 DT - Standard)', rate: 0.01, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_1_5', label: 'RS 1.5% (Taux Spécifique)', rate: 0.015, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_5', label: 'RS 5% (Honoraires Non-Commerciaux IR)', rate: 0.05, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_10', label: 'RS 10% (Loyers, Honoraires Non-Commerciaux IS)', rate: 0.10, type: 'is_irpp', base: 'HT' },
    { id: 'rs_is_15', label: 'RS 15% (Honoraires Spécifiques / Jetons)', rate: 0.15, type: 'is_irpp', base: 'HT' },
    { id: 'rs_tva_25', label: 'RS TVA sur Marchés (25% de la TVA)', rate: 0.25, type: 'tva', base: 'TVA' },
    { id: 'rs_tva_100', label: 'RS TVA sur Marchés avec Non-Résidents (100% TVA)', rate: 1.00, type: 'tva', base: 'TVA' }
];

function initRS() {
    const container = document.getElementById('rs-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); margin-bottom: 20px;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:1.5em;">🧾</span>
                <div>
                    <strong style="color: #34d399;">Module de Trésorerie : Retenue à la Source & TEJ</strong>
                    <p style="font-size: 0.85em; opacity: 0.9; margin:5px 0 0 0;">
                        Calculez les montants Nets à Payer et gérez vos retenues via la plateforme obligatoire <strong>TEJ</strong> dès le 01/01/2026.
                    </p>
                </div>
            </div>
        </div>

        <div class="form-section">
            <div class="section-title">
                <span class="icon">⚙️</span>
                <span>Paramètres de la Transaction</span>
            </div>
            
            <div class="form-group">
                <label>Nature de l'Opération</label>
                <select id="natureRS" class="form-control">
                    <optgroup label="Retenues IRPP / IS">
                        ${RS_RATES.filter(r => r.type === 'is_irpp').map(r => `<option value="${r.id}">${r.label} (${(r.rate * 100).toFixed(0)}%)</option>`).join('')}
                    </optgroup>
                    <optgroup label="Retenues TVA">
                        ${RS_RATES.filter(r => r.type === 'tva').map(r => `<option value="${r.id}">${r.label}</option>`).join('')}
                    </optgroup>
                </select>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Montant Brut (HT) (DT)</label>
                    <input type="number" id="brutHT_RS" class="form-control" placeholder="0.000">
                </div>
                <div class="form-group flex-col-50">
                    <label>Taux TVA applicable (%)</label>
                    <select id="tauxTVA_RS" class="form-control">
                        <option value="0.19">19% (Standard)</option>
                        <option value="0.07">7% (Réduit)</option>
                        <option value="0.13">13% (Spécifique)</option>
                        <option value="0">0% (Exonéré/Suspension)</option>
                    </select>
                </div>
            </div>
        </div>

        <button id="btn-calc-rs" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669);">
            <span class="icon">🧮</span> Calculer Net à Payer
        </button>

        <div id="result-rs"></div>
    `;

    document.getElementById('btn-calc-rs').addEventListener('click', calculateRS);
}

function calculateRS() {
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
        detailRS = `RS IRPP/IS (${(nature.rate * 100).toFixed(0)}% sur ${nature.base})`;
        baseDetail = nature.base;
    } else if (nature.type === 'tva') {
        rsAmount = tvaAmount * nature.rate;
        detailRS = `RS TVA (${(nature.rate * 100).toFixed(0)}% de la TVA)`;
        baseDetail = "TVA";
    }

    const netAPayer = brutTTC - rsAmount;

    // Affichage de l'alerte assiette si base == TTC
    const resultDiv = document.getElementById('result-rs');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid #10b981;">
            <div class="result-header">
                <span>Net à Payer au Fournisseur</span>
                <span class="final-amount" style="color: #34d399;">${netAPayer.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
                <div style="display: grid; gap: 8px; font-size: 0.9em;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Montant Brut HT :</span>
                        <span>${brutHT.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>TVA (${(tauxTVA * 100).toFixed(0)}%) :</span>
                        <span>+ ${tvaAmount.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:600; padding:5px 0; border-top:1px solid rgba(255,255,255,0.1);">
                        <span>Total TTC :</span>
                        <span>${brutTTC.toLocaleString('fr-TN')} DT</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; color: #fb7185; font-weight:600;">
                        <span>${detailRS} :</span>
                        <span>- ${rsAmount.toLocaleString('fr-TN')} DT</span>
                    </div>
                </div>
            </div>

            <div style="margin-top:20px; text-align:center;">
                <button onclick="window.print()" class="btn-primary" style="background: var(--accent); font-size: 0.9em; padding: 10px;">
                    📄 Générer Certificat de Retenue
                </button>
            </div>
            
            <div id="assiette-warning" class="hidden" style="margin-top: 10px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 3px solid var(--warning); font-size: 0.85em; color: var(--warning);">
                ⚠️ <strong>Alerte Assiette :</strong> Bien que la pratique TTC soit courante pour certains marchés, la loi prévoit souvent une RS sur le montant <strong>HT (Hors TVA)</strong>. Vérifiez impérativement votre convention ou bon de commande.
            </div>

            <div style="margin-top: 15px; font-size: 0.85em; opacity: 0.9; padding:12px; background:rgba(239, 68, 68, 0.1); border-radius:8px; border-left: 3px solid #ef4444;">
                <p><strong>🚨 Alerte Conformité TEJ :</strong></p>
                <p>Toute attestation émise hors plateforme <strong>TEJ</strong> après le 01/01/2026 expose l'émetteur à une pénalité de <strong>30% du montant retenu</strong> (Min. 50 DT).</p>
            </div>

            <div style="margin-top: 15px; font-size: 0.8em; opacity: 0.7; padding:10px; background:rgba(0,0,0,0.1); border-radius:6px;">
                <p><strong>📌 Note Expert :</strong> La RS sur marchés (> 1000 DT) est obligatoire même pour les services. Le certificat doit être émis exclusivement sur TEJ.</p>
            </div>
        </div>
    `;

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
