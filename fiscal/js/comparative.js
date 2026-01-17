/**
 * COMPARATIV FISCAL - LOGIQUE
 * Compare l'IRPP (Personne Physique) vs IS (Société)
 */

function initComparative() {
    const container = document.getElementById('comparative-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card" style="background: rgba(251, 191, 36, 0.05); border-color: rgba(251, 191, 36, 0.2);">
            <p style="font-size: 0.9em; margin-bottom: 15px;">
                Ce module permet d'arbitrer entre l'exercice en nom propre (IRPP) et la création d'une société (IS). 
                Il compare la pression fiscale totale sur un même bénéfice annuel.
            </p>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label>Bénéfice Annuel Estimé (DT)</label>
                <input type="number" id="comp-profit" value="50000" class="form-control">
            </div>

            <button id="btn-run-comp" class="btn-primary" style="width: 100%; background: var(--primary-gradient);">
                Lancer la Comparaison Expert
            </button>
        </div>

        <div id="result-comparative" style="margin-top: 25px;"></div>
    `;

    document.getElementById('run-comp-btn')?.addEventListener('click', runComparative); // Fallback
    document.getElementById('btn-run-comp').addEventListener('click', runComparative);
}

function runComparative() {
    const profit = parseFloat(document.getElementById('comp-profit').value) || 0;

    // --- 1. Simulation IRPP (Nom Propre) ---
    // On utilise les tranches simplifiées 2026
    const irpp = simulateIRPP(profit);
    const cssPP = profit * 0.005;
    const totalPP = irpp + cssPP;

    // --- 2. Simulation IS (Société) ---
    // IS (15%) + CSS (3%) + Retenue sur dividende (assumée 100% distribution pour le test)
    const is = profit * 0.15;
    const cssIS = profit * 0.03;
    const netApresIS = profit - is - cssIS;
    const rsDividende = netApresIS * 0.10; // 10% Retenue à la source sur dividendes
    const totalIS = is + cssIS + rsDividende;

    const resultDiv = document.getElementById('result-comparative');

    const isPPBetter = totalPP < totalIS;
    const diff = Math.abs(totalPP - totalIS);

    resultDiv.innerHTML = `
        <div class="glass-card" style="border-left: 5px solid ${isPPBetter ? 'var(--success)' : 'var(--warning)'}">
            <h3 style="margin-bottom: 20px;">Verdict : ${isPPBetter ? 'Régime IRPP (Nom Propre)' : 'Régime IS (Société)'} est optimal</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px;">
                    <h4 style="color: var(--text-muted); font-size: 0.9em;">SCÉNARIO IRPP</h4>
                    <div style="font-size: 1.4em; font-weight: 700;">${totalPP.toLocaleString('fr-TN')} DT</div>
                    <small style="opacity: 0.6;">Pression Totale : ~${((totalPP / profit) * 100).toFixed(1)}%</small>
                </div>
                
                <div style="padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px;">
                    <h4 style="color: var(--text-muted); font-size: 0.9em;">SCÉNARIO IS</h4>
                    <div style="font-size: 1.4em; font-weight: 700;">${totalIS.toLocaleString('fr-TN')} DT</div>
                    <small style="opacity: 0.6;">Pression Totale : ~${((totalIS / profit) * 100).toFixed(1)}%</small>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: ${isPPBetter ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; border-radius: 8px; text-align: center;">
                Économie annuelle estimée : <strong>${diff.toLocaleString('fr-TN')} DT</strong>
            </div>

            <p style="margin-top: 20px; font-size: 0.85em; opacity: 0.7; font-style: italic;">
                * Hypothèses : Distribution de 100% des bénéfices pour le scénario IS. Pas de déductions spécifiques incluses.
                Se base sur la Loi de Finances 2026.
            </p>
        </div>
    `;
}

function simulateIRPP(income) {
    // Barème simplifié 2026 (Assiette nette de frais pro 10%)
    const netAssiette = income * 0.90;
    const brackets = [
        { min: 0, max: 5000, rate: 0 },
        { min: 5000, max: 10000, rate: 0.15 },
        { min: 10000, max: 20000, rate: 0.25 },
        { min: 20000, max: 30000, rate: 0.30 },
        { min: 30000, max: 50000, rate: 0.33 },
        { min: 50000, max: 70000, rate: 0.36 },
        { min: 70000, max: Infinity, rate: 0.40 }
    ];

    let tax = 0;
    brackets.forEach(b => {
        if (netAssiette > b.min) {
            const range = Math.min(netAssiette, b.max) - b.min;
            tax += range * b.rate;
        }
    });
    return tax;
}
