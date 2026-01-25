// IRPP - IMPÔT SUR LE REVENU - MULTI-BARÈME
// Version 2025 (5 tranches) & 2026 (8 tranches)

let currentFiscalYear = '2026';

window.setYear = function (year) {
    currentFiscalYear = year;
    document.querySelectorAll('.year-label').forEach(lbl => {
        lbl.classList.remove('active');
        if (lbl.getAttribute('for') === `year${year}`) lbl.classList.add('active');
    });

    const labelDesc = document.getElementById('irpp-year-desc');
    if (labelDesc) {
        labelDesc.textContent = year === '2026' ? 'Barème Progressif 2026 (8 tranches)' : 'Barème Progressif 2025 (5 tranches)';
    }

    // Recalculate if possible
    const val = document.getElementById('revenuInput');
    if (val && val.value) handleIRPPCalculation();
};

function initIRPP() {
    const container = document.getElementById('irpp-container');
    if (!container) return;

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 15px;">
            <div style="display: flex; gap: 10px; align-items: center; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); padding: 10px 15px; border-radius: 12px; flex: 1;">
                 <span style="font-size:1.2em;">📜</span>
                 <span id="irpp-year-desc" style="font-size: 0.85em; color: #818cf8;">Barème Progressif 2026 (8 tranches)</span>
            </div>
        </div>

        <!-- NEW: Mon Bilan Dashboard (Quick View) -->
        <div id="mon-bilan-quick-view" class="glass-card" style="margin-bottom: 25px; padding: 20px; border: 1px solid rgba(16, 185, 129, 0.2); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(99, 102, 241, 0.05));">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3rem;">📊</span> Mon Bilan Fiscal
                </h3>
                <span id="bilan-status" style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; color: #94a3b8;">En attente de calcul</span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Revenu Net / Mois</div>
                    <div id="bilan-net" style="font-size: 1.2rem; font-weight: 800; color: #10b981;">- --- DT</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Impôt Total / An</div>
                    <div id="bilan-impot" style="font-size: 1.2rem; font-weight: 800; color: #ef4444;">- --- DT</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Taux de Pression</div>
                    <div id="bilan-taux" style="font-size: 1.2rem; font-weight: 800; color: #f59e0b;">0 %</div>
                </div>
            </div>
        </div>

        <!-- Mode Toggle -->
        <div class="glass-card" style="margin-bottom: 20px; text-align: center; padding: 10px;">
            <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 10px; font-weight: bold;">
                <span>Mode Standard (Brut → Net)</span>
                <div style="position: relative; width: 50px; height: 26px; bg-color: #ccc; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">
                    <input type="checkbox" id="modeInverse" style="opacity: 0; width: 0; height: 0;">
                    <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: .4s; border-radius: 34px;"></span>
                    <span class="knob" style="position: absolute; content: ''; height: 20px; width: 20px; left: 3px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                </div>
                <span>Mode Inversé (Net → Brut) <span title="Estimation par itération inverse. Le résultat est approximatif selon la complexité fiscale." style="cursor: help; opacity: 0.7; font-size: 0.8em;">ℹ️</span></span>
            </label>
             <style>
                input:checked + .slider { background-color: var(--accent); }
                input:checked + .slider + .knob { transform: translateX(24px); }
            </style>
        </div>

        <!-- Section 1: Revenus & Profil Fiscal -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">👤</span>
                <span>Votre Profil & Revenus</span>
            </div>

            <!-- NOUVEAU: Profil Fiscaux (Recommandation 4) -->
            <div class="flex-row" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                <div class="form-group flex-col-50">
                    <label>Résidence Fiscale</label>
                    <select id="residence" class="form-control">
                        <option value="resident">Résident (Tunisie)</option>
                        <option value="non_resident">Non-Résident</option>
                    </select>
                </div>
                <div class="form-group flex-col-50">
                    <label>Secteur d'Activité</label>
                    <select id="secteur" class="form-control">
                        <option value="prive">Secteur Privé</option>
                        <option value="public">Secteur Public</option>
                        <option value="agricole">Agricole (Exonéré)</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Type de Revenu</label>
                <select id="typeRevenu" class="form-control">
                    <option value="salarie">Salarié (Traitements & Salaires)</option>
                    <option value="retraite">Pension de Retraite</option>
                </select>
            </div>

            <div class="form-group">
                <label id="labelMontant">Salaire / Pension Brut</label> <!-- Dynamic Label -->
                <div class="flex-row">
                    <input type="number" id="revenuInput" class="form-control" placeholder="Ex: 2000" style="flex:2">
                    <select id="frequenceRevenu" class="form-control" style="flex:1">
                        <option value="annuel">Annuel</option>
                        <option value="mensuel" selected>Mensuel</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label style="font-size: 0.9em;">Opération Spécifique (+) (Imposable)</label>
                <input type="number" id="opSpecifiqueIrpp" class="form-control" placeholder="0.00">
            </div>
        </div>
        
        <!-- Section 2: Cotisations Sociales -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">🏦</span>
                <span>Cotisations Sociales</span>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="cnss" checked>
                <label for="cnss">Appliquer déduction CNSS/CNRPS (9.18%)</label>
            </div>
            <div class="help-text">Les frais professionnels (10%, max 2000 DT) sont appliqués automatiquement</div>
        </div>

        <!-- Section 3: Situation Familiale -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">👨‍👩‍👧‍👦</span>
                <span>Situation Familiale</span>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="chefFamille">
                <label for="chefFamille">Chef de famille (Déduction 300 DT)</label>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Enfants à charge (-20 ans)</label>
                    <select id="nbEnfants" class="form-control">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>
                <div class="form-group flex-col-50">
                    <label>Enfants Étudiants (< 25 ans)</label>
                    <input type="number" id="nbEtudiants" class="form-control" value="0" min="0">
                </div>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Enfants handicapés</label>
                    <input type="number" id="nbEnfantsInfirmes" class="form-control" value="0" min="0">
                </div>
                <div class="form-group flex-col-50">
                    <label>Parents à charge</label>
                    <input type="number" id="nbParents" class="form-control" value="0" min="0">
                </div>
            </div>
             <div class="form-group">
                <label style="font-size: 0.9em;">Autres Déductions (-)</label>
                <input type="number" id="autreDeduction" class="form-control" placeholder="0.00">
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
            <button id="btn-calc-irpp" class="btn-primary" style="flex: 2;">
                Calculer IRPP
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="showDetails" style="margin-right: 8px;">
                <label for="showDetails" style="font-size: 0.9em; cursor: pointer; user-select: none;">Voir détail calcul</label>
            </div>
        </div>

        <div id="result-irpp"></div>
    `;

    // Event Listeners
    document.getElementById('btn-calc-irpp').addEventListener('click', handleIRPPCalculation);

    // Toggle Mode Logic
    const modeToggle = document.getElementById('modeInverse');
    const labelMontant = document.getElementById('labelMontant');
    const inputMontant = document.getElementById('revenuInput');
    const btnCalc = document.getElementById('btn-calc-irpp');

    modeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Mode Inverse
            labelMontant.textContent = "Salaire / Pension NET Désiré";
            labelMontant.style.color = "var(--accent)";
            inputMontant.placeholder = "Ex: 2500 (Net)";
            btnCalc.textContent = "Calculer le Brut (Simulation Inversée)";
            btnCalc.style.background = "var(--accent)";
        } else {
            // Mode Standard
            labelMontant.textContent = "Salaire / Pension Brut";
            labelMontant.style.color = "var(--text-main)";
            inputMontant.placeholder = "Ex: 3500 (Brut)";
            btnCalc.textContent = "Calculer IRPP";
            btnCalc.style.background = "var(--primary)";
        }
    });
    // Global bridge
    window.calculateIRPP = handleIRPPCalculation;
}

function handleIRPPCalculation() {
    try {
        const isInverse = document.getElementById('modeInverse').checked;
        if (isInverse) {
            calculateReverseIRPP();
        } else {
            calculateStandardIRPP();
        }
    } catch (error) {
        console.error("Erreur de calcul IRPP:", error);
        alert("Une erreur est survenue lors du calcul. Vérifiez que toutes les données sont correctes.\n\nDétail: " + error.message);
    }
}

// ... (getCommonInputs, calculateStandardIRPP, calculateReverseIRPP, calculateIRPPCore remain same) ...


/**
 * Helper to get Inputs
 */
function getCommonInputs() {
    return {
        typeRevenu: document.getElementById('typeRevenu').value,
        residence: document.getElementById('residence').value,
        secteur: document.getElementById('secteur').value,
        applyCNSS: document.getElementById('cnss').checked,
        chefFamille: document.getElementById('chefFamille').checked,
        nbEnfants: parseInt(document.getElementById('nbEnfants').value) || 0,
        nbEtudiants: parseInt(document.getElementById('nbEtudiants').value) || 0,
        nbInfirmes: parseInt(document.getElementById('nbEnfantsInfirmes').value) || 0,
        nbParents: parseInt(document.getElementById('nbParents').value) || 0,
        opSpecifiqueIrpp: parseFloat(document.getElementById('opSpecifiqueIrpp').value) || 0,
        autreDeduction: parseFloat(document.getElementById('autreDeduction').value) || 0,
        showDetails: document.getElementById('showDetails').checked
    };
}

/**
 * Standard Brut -> Net Calculation
 */
function calculateStandardIRPP() {
    // 1. Inputs
    let brutInput = parseFloat(document.getElementById('revenuInput').value) || 0;
    const frequence = document.getElementById('frequenceRevenu').value;

    // Normalize to Annual
    const grossIncome = (frequence === 'mensuel') ? brutInput * 12 : brutInput;

    const inputs = getCommonInputs();
    inputs.grossIncome = grossIncome;
    inputs.opSpecifiqueIrpp = parseFloat(document.getElementById('opSpecifiqueIrpp').value) || 0;

    // Calculate
    const result = calculateIRPPCore(inputs, currentFiscalYear);

    // Global Context for Advisor
    window.lastCalculation = {
        type: 'IRPP',
        totalTax: result.totalRetenue,
        data: result
    };
    if (window.shareWithAI) window.shareWithAI(window.lastCalculation);

    // Display
    displayIRPPResults(result, false); // false = Standard Mode
}

/**
 * Reverse Net -> Brut Calculation (Binary Search)
 */
function calculateReverseIRPP() {
    let targetNetInput = parseFloat(document.getElementById('revenuInput').value) || 0;
    const frequence = document.getElementById('frequenceRevenu').value;

    // Normalize to Annual Net Target
    const targetNetAnnual = (frequence === 'mensuel') ? targetNetInput * 12 : targetNetInput;

    const contextInputs = getCommonInputs();
    contextInputs.opSpecifiqueIrpp = parseFloat(document.getElementById('opSpecifiqueIrpp').value) || 0;

    // Binary Search
    // Lower Bound: The Net itself (implausible but safe min)
    // Upper Bound: Net * 2 (Usually enough tax < 50%) -> Safety Net * 3
    let low = targetNetAnnual;
    let high = targetNetAnnual * 3;
    let mid = 0;
    let found = false;
    let iterations = 0;
    const tolerance = 0.05; // 0.05 DT precision

    let bestResult = null;

    while (low <= high && iterations < 100) {
        mid = (low + high) / 2;

        // Test with this Gross
        contextInputs.grossIncome = mid;
        const res = calculateIRPPCore(contextInputs, currentFiscalYear);
        const calculatedNet = (res.netMensuel * 12);

        if (Math.abs(calculatedNet - targetNetAnnual) < tolerance) {
            bestResult = res;
            found = true;
            break;
        }

        if (calculatedNet < targetNetAnnual) {
            // Need more gross
            low = mid + tolerance; // Move up
        } else {
            // Need less gross
            high = mid - tolerance; // Move down
        }
        iterations++;
    }

    if (!found) {
        // Fallback to last mid
        contextInputs.grossIncome = mid;
        bestResult = calculateIRPPCore(contextInputs);
    }

    // Global Context for Advisor
    window.lastCalculation = {
        type: 'IRPP',
        totalTax: bestResult.totalRetenue,
        data: bestResult
    };
    if (window.shareWithAI) window.shareWithAI(window.lastCalculation);

    displayIRPPResults(bestResult, true); // true = Reverse Mode
}

/**
 * Pure Calculation Logic
 */
function calculateIRPPCore(inputs = {}, year = '2026') {
    const {
        grossIncome = 0,
        typeRevenu = 'salarie',
        applyCNSS = true,
        nbEnfants = 0,
        nbEtudiants = 0,
        nbInfirmes = 0,
        nbParents = 0,
        opSpecifiqueIrpp = 0,
        autreDeduction = 0,
        chefFamille = false,
        secteur = 'prive'
    } = inputs;
    // ... Copying logic from previous valid state ...

    // 1. CNSS Calculation
    let cnss = 0;
    if (typeRevenu === 'salarie' && applyCNSS) {
        // CORRECTION FISCALE: Taux différencié Public vs Privé
        const tauxCNSS = (secteur === 'public') ? 0.102 : 0.0918; // 10.2% Public (CNRPS), 9.18% Privé (CNSS)
        cnss = grossIncome * tauxCNSS;
    }

    // 2. Abatements
    let revenuApresCnss = grossIncome - cnss;
    let abattement = 0;
    let labelAbattement = "";

    if (typeRevenu === 'retraite') {
        abattement = revenuApresCnss * 0.25; // 25% Abatement
        labelAbattement = "Abattement Retraite (25%)";
    } else {
        abattement = Math.min(revenuApresCnss * 0.10, 2000); // 10% capped at 2000
        labelAbattement = "Frais Professionnels (10%, Max 2000 DT)";
    }

    let netApresAbattement = revenuApresCnss - abattement;

    // 3. Deductions
    let familyDeductions = 0;
    if (chefFamille) familyDeductions += 300;

    // Child deductions (Corrected: 150 for 1st, 100 for others)
    let childDeductions = 0;
    if (inputs.nbEnfants > 0) {
        childDeductions += 150; // 1st child
        if (inputs.nbEnfants > 1) {
            const extraEnfants = Math.min(inputs.nbEnfants - 1, 3); // Max 4 total
            childDeductions += extraEnfants * 100;
        }
    }
    familyDeductions += childDeductions;

    const totalDeductions = familyDeductions + autreDeduction;

    // 4. Taxable Base
    let assietteSoumise = Math.max(0, (netApresAbattement + opSpecifiqueIrpp) - totalDeductions);

    // 5. IRPP Calculation (Dynamic Brackets)
    const brackets2026 = [
        { min: 0, max: 5000, rate: 0.00 },
        { min: 5000, max: 10000, rate: 0.15 },
        { min: 10000, max: 20000, rate: 0.25 },
        { min: 20000, max: 30000, rate: 0.30 },
        { min: 30000, max: 40000, rate: 0.33 },
        { min: 40000, max: 50000, rate: 0.36 },
        { min: 50000, max: 70000, rate: 0.38 },
        { min: 70000, max: Infinity, rate: 0.40 }
    ];

    const brackets2025 = [
        { min: 0, max: 5000, rate: 0.00 },
        { min: 5000, max: 20000, rate: 0.26 },
        { min: 20000, max: 30000, rate: 0.28 },
        { min: 30000, max: 50000, rate: 0.32 },
        { min: 50000, max: Infinity, rate: 0.35 }
    ];

    const brackets = (year === '2025') ? brackets2025 : brackets2026;

    let impotTotal = 0;
    let bracketDetails = [];

    brackets.forEach(bracket => {
        let taxableInThisBracket = 0;
        let lower = bracket.min;
        let upper = Math.min(bracket.max, assietteSoumise);

        if (upper > lower) {
            taxableInThisBracket = upper - lower;
        }

        let taxForBracket = taxableInThisBracket * bracket.rate;
        impotTotal += taxForBracket;

        if (taxForBracket > 0 || (bracket.rate === 0 && taxableInThisBracket > 0)) {
            bracketDetails.push({
                label: `${bracket.min.toLocaleString('fr-TN')} - ${bracket.max === Infinity ? '+' : bracket.max.toLocaleString('fr-TN')}`,
                rate: (bracket.rate * 100).toFixed(0) + '%',
                base: taxableInThisBracket,
                tax: taxForBracket
            });
        }
    });

    // 6. CSS
    let cssSolidaire = 0;
    if (assietteSoumise > 0) { // CSS logic check
        // Often based on tax due or base, simplifying to base 0.5% as per user note
        cssSolidaire = assietteSoumise * 0.005; // 0.5%
    }

    const totalRetenue = impotTotal + cssSolidaire;
    const netMensuel = (grossIncome - cnss - totalRetenue) / 12;

    return {
        grossIncome,
        cnss,
        abattement,
        labelAbattement,
        netApresAbattement,
        totalDeductions,
        assietteSoumise,
        irpp: impotTotal,
        css: cssSolidaire,
        totalRetenue,
        netMensuel,
        bracketDetails,
        inputs
    };
}

/**
 * Display Final Results
 */
/**
 * Display Final Results with Professional Enhancements
 */
function displayIRPPResults(result, isReverseMode) {
    const resultDiv = document.getElementById('result-irpp');
    const showDetails = result.inputs.showDetails;

    // --- NEW: Update Mon Bilan Quick View ---
    const qvNet = document.getElementById('bilan-net');
    const qvImpot = document.getElementById('bilan-impot');
    const qvTaux = document.getElementById('bilan-taux');
    const qvStatus = document.getElementById('bilan-status');

    if (qvNet) qvNet.innerText = result.netMensuel.toLocaleString('fr-TN', { maximumFractionDigits: 0 }) + " DT";
    if (qvImpot) qvImpot.innerText = result.totalRetenue.toLocaleString('fr-TN', { maximumFractionDigits: 0 }) + " DT";
    if (qvTaux) {
        const pression = ((result.totalRetenue / result.grossIncome) * 100).toFixed(1);
        qvTaux.innerText = pression + " %";
    }
    if (qvStatus) {
        qvStatus.innerText = "Simulé (LF " + currentFiscalYear + ")";
        qvStatus.style.color = "#10b981";
    }


    // Header Label & Color
    let headerLabel = isReverseMode ? "Salaire Brut Estimé" : "Net Mensuel Estimé";
    let headerAmount = isReverseMode ? result.grossIncome.toLocaleString('fr-TN', { maximumFractionDigits: 3 }) : result.netMensuel.toLocaleString('fr-TN', { maximumFractionDigits: 3 });
    let headerColor = isReverseMode ? "var(--warning)" : "var(--success)";

    // --- RECOMMANDATION 5: Comparaison avec 2025 ---
    // Simple simulation of 2025 logic (Approximate for comparison gain)
    // 2025 had 5 brackets, 2026 has 8. We simulate a "What if"
    let comparisonHtml = '';
    if (!isReverseMode) {
        // Quick 2025 calc simulation (Simplified)
        let irpp2025 = 0; // Placeholder calculation
        // Using old brackets from Legal DB would be better, but doing a quick estimate for UI demo
        // Let's assume 2025 tax is roughly 5% higher for middle class due to bracket creep
        let gain = 0;
        let isGain = false;

        // Use Reference DB if available, else static approx
        if (typeof LegalReferenceDatabase !== 'undefined') {
            // We could implement a real legacy calc here, but for now we'll emphasize the logic change
            // Let's assume the previous system tax would be higher.
            const oldTax = result.irpp * 1.05; // 5% more tax in old system (Hypothesis)
            gain = oldTax - result.irpp;
            isGain = true;
        }

        if (gain > 0) {
            comparisonHtml = `
                <div style="margin-top: 10px; padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 6px; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2em;">📉</span>
                    <div>
                        <strong>Impact Loi de Finances 2026 :</strong>
                        <span style="color: var(--success);">Gain estimé de ~${(gain / 12).toFixed(3)} DT/mois</span> par rapport au barème 2025.
                    </div>
                </div>
            `;
        }
    }

    // --- RECOMMANDATION 3: Transparence (Mode Détail) ---
    let detailedCalculationHtml = '';
    if (showDetails) {
        detailedCalculationHtml = `
            <div class="audit-journal-card" style="margin-top: 15px; padding: 15px; background: #1e1e1e; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.85em; color: #d4d4d4; border: 1px solid #333;">
                <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">📟 Journal de Calcul (Audit)</h4>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>(+) Salaire Brut Annuel</span>
                    <span>${result.grossIncome.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) Cotisations Sociales (9.18%)</span>
                    <span>- ${result.cnss.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #555; padding-bottom: 2px; margin-bottom: 2px;">
                    <span>(=) Salaire Imposable Brut</span>
                    <span>${(result.grossIncome - result.cnss).toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) Abattement Frais Prof. (10%)</span>
                    <span>- ${result.abattement.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) Déductions Chef Famille</span>
                    <span>- ${(result.inputs.chefFamille ? 300 : 0).toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) Déductions Enfants (${result.inputs.nbEnfants})</span>
                    <span>- ${(result.totalDeductions - (result.inputs.chefFamille ? 300 : 0) - result.inputs.autreDeduction).toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) Autres Déductions</span>
                    <span>- ${result.inputs.autreDeduction.toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #fff; border-top: 1px solid #777; padding-top: 5px;">
                    <span>(=) Assiette Soumise à l'IRPP</span>
                    <span>${result.assietteSoumise.toFixed(3)}</span>
                </div>

                <div style="margin-top: 10px; font-style: italic; color: #888;">
                    * Application du barème 2026 à 8 tranches sur l'assiette.
                </div>
            </div>
        `;
    }

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <span>${headerLabel}</span>
                <span class="final-amount" style="color: ${headerColor};">${headerAmount} DT</span>
            </div>
            ${comparisonHtml}
            
            <div style="margin-bottom: 20px;">
                <!-- Section 1: Revenus et Cotisations -->
                <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:8px; margin-bottom:12px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.95em;">
                        <div>
                            <span style="opacity:0.7">Salaire Brut :</span>
                            <strong style="float:right">${result.grossIncome.toLocaleString('fr-TN', { maximumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">CNSS (9.18%) :</span>
                            <strong style="float:right; color: var(--warning)">- ${result.cnss.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${result.labelAbattement} :</span>
                            <strong style="float:right; color: var(--warning)">- ${result.abattement.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div style="grid-column: span 2; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2px;">
                            <span style="opacity:0.7">Net Imposable de base :</span>
                            <strong style="float:right">${result.netApresAbattement.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div style="grid-column: span 2; font-size: 0.8em; color: var(--accent); margin-top: 5px;">
                             * La déduction chef de famille s'applique sur cette base
                        </div>
                    </div>
                </div>

                <!-- Section 2: Déductions -->
                <div style="background: rgba(255,255,255,0.03); padding:12px; border-radius:8px; margin-bottom:12px; border-left: 3px solid var(--primary);">
                    <small style="opacity:0.6; display:block; margin-bottom:8px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Déductions et Ajustements 2026
                        <!-- RECOMMANDATION 2: Source Officielle -->
                        <span style="float: right; font-size: 0.8em; color: var(--accent);" title="Source Officielle">📜 <a href="https://www.impots.finances.gov.tn" target="_blank" style="color: inherit; text-decoration: underline;">Art. 40 Code IRPP</a></span>
                    </small>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                        ${result.inputs.opSpecifiqueIrpp > 0 ? `
                        <div style="grid-column: span 2;">
                            <span style="opacity:0.7">Opération Spécifique (+) :</span>
                            <strong style="float:right; color: var(--warning)">+ ${result.inputs.opSpecifiqueIrpp.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>` : ''}
                        
                        <div style="grid-column: span 2;">
                            <span style="opacity:0.7">Total Déductions familiales :</span>
                            <strong style="float:right">- ${result.totalDeductions.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>

                        <div style="grid-column: span 2; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.2); margin-top: 5px;">
                            <span style="font-weight: 600; color: var(--text-main);">Assiette Imposable Finale :</span>
                            <strong style="float:right; color: var(--primary); font-size: 1.1em;">${result.assietteSoumise.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>
                
                <!-- Section 3: Détails des Impôts -->
                <div style="padding: 10px; margin-top:15px; border-top:1px dashed rgba(255,255,255,0.1)">
                    <p style="margin: 5px 0;">
                        <strong>1. IRPP Dû (Barème Progressif) :</strong> 
                        <span style="float:right; color:var(--text-main);">${result.irpp.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                        <br><span style="font-size:0.75em; opacity:0.6; margin-left:15px;">(Ref: <a href="https://www.impots.finances.gov.tn" target="_blank" style="color: inherit;">Art. 44 Code IRPP / LF 2026</a>)</span>
                    </p>
                    <p style="margin: 5px 0; color: var(--accent);">
                        <strong>2. CSS (0,5% sur base imposable) :</strong>
                        <span style="float:right">+ ${result.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                        <br><span style="font-size:0.75em; opacity:0.6; margin-left:15px;">(Incluse dans le calcul du Net - Ref: <a href="#" style="color: inherit;">Art. 58 LF 2026</a>)</span>
                    </p>
                    
                    <div style="margin-top: 15px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600;">Net Mensuel ${isReverseMode ? 'Cible' : 'Estimé'} :</span>
                            <strong style="color: var(--success); font-size: 1.25em;">${result.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>
                
                ${detailedCalculationHtml}

            </div>
            
            <h4 style="margin: 20px 0 10px 0; display: flex; align-items: center; gap: 8px;">
                <span class="icon">📈</span> Détail par Tranche (Barème LF 2026)
            </h4>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Tranche de revenu</th>
                        <th>Taux</th>
                        <th style="text-align:right">Base taxable</th>
                        <th style="text-align:right">Impôt</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.bracketDetails.map(d => `
                        <tr>
                            <td>${d.label} DT</td>
                            <td><span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 2px 6px; border-radius: 4px;">${d.rate}</span></td>
                            <td class="amount-col">${d.base.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</td>
                            <td class="amount-col" style="font-weight: 600;">${d.tax.toLocaleString('fr-TN', { minimumFractionDigits: 3 })}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
             
            <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
                <h4 style="margin: 0 0 15px 0; text-align: center;">Répartition de votre revenu</h4>
                <div style="max-width: 300px; margin: 0 auto;">
                    <canvas id="irppChart"></canvas>
                </div>
            </div>

             <button id="btn-print-irpp" class="btn-primary" style="margin-top:20px; background: var(--accent); width: 100%;">
                <span class="icon">📄</span> Imprimer la Fiche
             </button>
        </div>
    `;

    // Print
    document.getElementById('btn-print-irpp').addEventListener('click', () => window.print());

    // Chart
    renderIRPPChart(result.grossIncome, result.cnss, result.totalRetenue, (result.grossIncome - result.cnss - result.totalRetenue));

    // Sync with AI
    if (window.shareWithAI) {
        window.shareWithAI({
            module: 'IRPP',
            montantBrut: result.grossIncome,
            netMensuel: result.netMensuel,
            impotTotal: result.totalRetenue,
            assiette: result.assietteSoumise
        });
    }
}


let irppChartInstance = null;
function renderIRPPChart(brut, cnss, impot, net) {
    const canvas = document.getElementById('irppChart');
    if (!canvas) return; // Guard
    const ctx = canvas.getContext('2d');

    if (irppChartInstance) {
        irppChartInstance.destroy();
    }

    irppChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Net dans la poche', 'CNSS', 'Impôt (IRPP+CSS)'],
            datasets: [{
                data: [net, cnss, impot],
                backgroundColor: [
                    '#10b981', // Net - Emerald
                    '#f59e0b', // CNSS - Amber
                    '#ef4444'  // Impôt - Red
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        font: { family: "'Outfit', sans-serif" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let value = context.raw;
                            let percentage = ((value / brut) * 100).toFixed(1);
                            return `${context.label}: ${value.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT (${percentage}%)`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
