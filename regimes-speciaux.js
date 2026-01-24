/**
 * MODULE: Régimes Spéciaux (Startup Act & ZDR)
 * Simule les avantages fiscaux comparés au régime de droit commun.
 */

function initRegimes() {
    const container = document.getElementById('regimes-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card" style="padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                <button class="filter-btn active" id="btn-mode-startup" onclick="switchRegimeMode('startup')">🚀 Startup Act</button>
                <button class="filter-btn" id="btn-mode-zdr" onclick="switchRegimeMode('zdr')">📍 ZDR (Régional)</button>
            </div>

            <!-- STARTUP MODE -->
            <div id="mode-startup-content">
                <div class="info-box">
                    <span class="icon">ℹ️</span>
                    <p>Le <strong>Startup Act</strong> offre une exonération totale d'IS et une prise en charge des charges sociales. Les fondateurs bénéficient aussi d'une exonération d'IRPP.</p>
                </div>

                <div class="form-grid" style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Résultat Fiscal Avant Impôt (Bénéfice)</label>
                        <input type="number" id="startup-resultat" class="form-control" placeholder="Ex: 50 000">
                    </div>
                    <div class="form-group">
                        <label>Masse Salariale Brute (Annuelle)</label>
                        <input type="number" id="startup-salaires" class="form-control" placeholder="Ex: 120 000">
                    </div>
                </div>
                
                <button class="btn-primary" style="width:100%; margin-top: 15px;" onclick="calculateStartupAdvantage()">
                    Calculer mes économies
                </button>
            </div>

            <!-- ZDR MODE -->
            <div id="mode-zdr-content" style="display:none;">
                <div class="info-box" style="border-left: 4px solid #10b981;">
                    <span class="icon">📍</span>
                    <p>Les <strong>ZDR</strong> (Zones de Développement Régional) offrent 5 à 10 ans d'exonération totale d'IS.</p>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label>Zone d'Implantation</label>
                    <select id="zdr-type" class="form-control">
                        <option value="1">Groupe 1 (5 ans exonération puis 10%)</option>
                        <option value="2">Groupe 2 (10 ans exonération puis 10%)</option>
                    </select>
                </div>

                <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Année d'Activité</label>
                        <input type="number" id="zdr-annee" class="form-control" value="1" min="1">
                    </div>
                    <div class="form-group">
                        <label>Bénéfice Imposable</label>
                        <input type="number" id="zdr-benefice" class="form-control" placeholder="Ex: 80 000">
                    </div>
                </div>

                <button class="btn-primary" style="width:100%; margin-top: 15px;" onclick="calculateZDRAdvantage()">
                    Simuler l'Impôt ZDR
                </button>
            </div>
        </div>

        <!-- RESULTS CONTAINER -->
        <div id="regime-results" style="display:none;"></div>
    `;

    // Inject CSS for filter buttons if not exists
    if (!document.getElementById('regime-styles')) {
        const style = document.createElement('style');
        style.id = 'regime-styles';
        style.innerHTML = `
            .filter-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: var(--text-muted);
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                transition: 0.3s;
            }
            .filter-btn.active {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            .info-box {
                background: rgba(59, 130, 246, 0.1);
                border-left: 4px solid var(--primary);
                padding: 10px 15px;
                border-radius: 4px;
                display: flex;
                gap: 10px;
                font-size: 0.9em;
                color: #e2e8f0;
            }
            .economy-tag {
                background: #10b981;
                color: black;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 0.8em;
            }
        `;
        document.head.appendChild(style);
    }
}

// Global functions for HTML interaction
window.switchRegimeMode = function (mode) {
    document.getElementById('mode-startup-content').style.display = (mode === 'startup') ? 'block' : 'none';
    document.getElementById('mode-zdr-content').style.display = (mode === 'zdr') ? 'block' : 'none';

    document.getElementById('btn-mode-startup').classList.toggle('active', mode === 'startup');
    document.getElementById('btn-mode-zdr').classList.toggle('active', mode === 'zdr');

    document.getElementById('regime-results').style.display = 'none';
};

window.calculateStartupAdvantage = function () {
    const benefice = parseFloat(document.getElementById('startup-resultat').value) || 0;
    const salaires = parseFloat(document.getElementById('startup-salaires').value) || 0;

    // Standard Regime
    const isStandard = Math.max(benefice * 0.15, benefice * 0.002); // 15% Standard (Simplified)
    const cnssStandard = salaires * 0.1657; // Patronal ~16.57%

    // Startup Regime
    const isStartup = 0; // Exonerated
    const cnssStartup = 0; // State covered

    const totalSaved = (isStandard + cnssStandard);

    renderRegimeResult(
        "Startup Act",
        { label: "IS à payer", standard: isStandard, special: isStartup },
        { label: "Charges Patronales", standard: cnssStandard, special: cnssStartup },
        totalSaved
    );
};

window.calculateZDRAdvantage = function () {
    const group = document.getElementById('zdr-type').value;
    const year = parseInt(document.getElementById('zdr-annee').value) || 1;
    const benefice = parseFloat(document.getElementById('zdr-benefice').value) || 0;

    // Standard Regime
    const isStandard = Math.max(benefice * 0.15, benefice * 0.002);

    // ZDR Rules
    let taux = 0.15;
    let periodExo = (group === "1") ? 5 : 10;

    if (year <= periodExo) {
        taux = 0; // Exoneration
    } else {
        taux = 0.10; // Rate reduced to 10% after
    }

    const isZDR = Math.max(benefice * taux, benefice * 0.002); // Min tax applies? Usually yes but often exonerated too. Assuming partial exemption of Min Tax in practice allowed during holiday? Let's stay standard: Min Tax applies unless specific decree. For simulation, let's assume total exemption includes Min Tax for ZDR. 
    // Correction: ZDR exemption implies 0 IS.

    const finalISZDR = (year <= periodExo) ? 0 : isZDR;

    const saved = isStandard - finalISZDR;

    renderRegimeResult(
        `ZDR Groupe ${group} (Année ${year})`,
        { label: "Impôt Sociétés (IS)", standard: isStandard, special: finalISZDR },
        null,
        saved
    );
};

function renderRegimeResult(title, row1, row2, totalSaved) {
    const container = document.getElementById('regime-results');
    container.style.display = 'block';

    let rowsHtml = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #444; padding-bottom: 5px;">
            <span>${row1.label}</span>
            <div style="text-align: right;">
                <div style="color: #94a3b8; font-size: 0.9em; text-decoration: line-through;">${row1.standard.toLocaleString()} DT</div>
                <div style="color: #10b981; font-weight: bold;">${row1.special.toLocaleString()} DT</div>
            </div>
        </div>
    `;

    if (row2) {
        rowsHtml += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #444; padding-bottom: 5px;">
                <span>${row2.label}</span>
                <div style="text-align: right;">
                    <div style="color: #94a3b8; font-size: 0.9em; text-decoration: line-through;">${row2.standard.toLocaleString()} DT</div>
                    <div style="color: #10b981; font-weight: bold;">${row2.special.toLocaleString()} DT</div>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="result-card" style="animation: fadeIn 0.5s;">
            <h3 style="margin-top: 0;">📊 Bilan : ${title}</h3>
            ${rowsHtml}
            
            <div style="margin-top: 20px; background: rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #10b981;">
                <div style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; color: #a7f3d0;">Économie Totale Réalisée</div>
                <div style="font-size: 2em; font-weight: 800; color: #fff;">${totalSaved.toLocaleString('fr-TN')} DT</div>
                <div style="font-size: 0.8em; opacity: 0.8;">par an grâce à ce régime</div>
            </div>
        </div>
    `;
}
