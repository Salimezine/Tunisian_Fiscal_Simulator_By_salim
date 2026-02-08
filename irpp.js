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
                 <span id="irpp-year-desc" data-i18n="label_year_2026" style="font-size: 0.85em; color: #818cf8;">Barème Progressif 2026 (8 tranches)</span>
            </div>
            <a href="javascript:void(0)" onclick="launchWizard()" style="font-size: 0.8rem; color: var(--accent); text-decoration: none; display: flex; align-items: center; gap: 5px;">
                <span data-i18n="btn_back_to_wizard">🔄 Retourner au Wizard</span>
            </a>
        </div>

        <!-- NEW: Mon Bilan Dashboard (Quick View) -->
        <div id="mon-bilan-quick-view" class="glass-card" style="margin-bottom: 25px; padding: 20px; border: 1px solid rgba(16, 185, 129, 0.2); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(99, 102, 241, 0.05));">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3rem;">📊</span> <span data-i18n="irpp_mon_bilan">Mon Bilan Fiscal</span>
                </h3>
                <span id="bilan-status" data-i18n="irpp_status_pending" style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; color: #94a3b8;">En attente de calcul</span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div data-i18n="res_net_estimated" style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Revenu Net / Mois</div>
                    <div id="bilan-net" style="font-size: 1.2rem; font-weight: 800; color: #10b981;">--- DT</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div data-i18n="res_impot_total" style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Impôt Total / An</div>
                    <div id="bilan-impot" style="font-size: 1.2rem; font-weight: 800; color: #ef4444;">--- DT</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                    <div data-i18n="res_taux_pression" style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Taux de Pression</div>
                    <div id="bilan-taux" style="font-size: 1.2rem; font-weight: 800; color: #f59e0b;">0 %</div>
                </div>
            </div>
        </div>

        <!-- Mode Toggle -->
        <div class="glass-card" style="margin-bottom: 20px; text-align: center; padding: 10px;">
            <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 10px; font-weight: bold;">
                <span data-i18n="btn_calculate">Calculer (Standard)</span>
                <div style="position: relative; width: 50px; height: 26px; bg-color: #ccc; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">
                    <input type="checkbox" id="modeInverse" style="opacity: 0; width: 0; height: 0;">
                    <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: .4s; border-radius: 34px;"></span>
                    <span class="knob" style="position: absolute; content: ''; height: 20px; width: 20px; left: 3px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                </div>
                <span data-i18n="btn_calculate_inverse">Inversé (Net → Brut)</span> <span title="Info" style="cursor: help; opacity: 0.7;">ℹ️</span>
            </label>
             <style>
                input:checked + .slider { background-color: var(--accent); }
                input:checked + .slider + .knob { transform: translateX(24px); }
            </style>
        </div>

        <!-- Section 1: Revenus & Profil Fiscal -->
        <div class="form-section glass-effect animate-slide-up" style="padding: 25px; margin-bottom: 20px;">
            <div class="section-title">
                <span class="icon">👤</span>
                <span data-i18n="label_situation">Votre Profil & Revenus</span>
            </div>

            <div class="flex-row" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_residence">Résidence Fiscale</label>
                    <select id="residence" class="form-control">
                        <option value="resident" data-i18n="opt_resident">Résident (Tunisie)</option>
                        <option value="non_resident" data-i18n="opt_non_resident">Non-Résident</option>
                    </select>
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_sector">Secteur d'Activité</label>
                    <select id="secteur" class="form-control">
                        <option value="prive" data-i18n="opt_prive">Secteur Privé</option>
                        <option value="public" data-i18n="opt_public">Secteur Public</option>
                        <option value="agricole" data-i18n="opt_agricole">Agricole (Exonéré)</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group flex-col-50">
                <label data-i18n="label_revenue_type">Type de Revenu</label>
                <select id="typeRevenu" class="form-control" onchange="calculerIRPP()">
                    <option value="salarie" data-i18n="opt_salary">Salarié</option>
                    <option value="retraite" data-i18n="opt_pension">Pensionné</option>
                </select>
            </div>
            <div class="form-group flex-col-50">
                <label data-i18n="label_situation">Situation Familiale</label>
                <select id="etatCivil" class="form-control" onchange="calculerIRPP()">
                    <option value="celibataire" data-i18n="opt_single">Célibataire</option>
                    <option value="marie" data-i18n="opt_married">Marié(e)</option>
                    <option value="divorce" data-i18n="opt_divorced">Divorcé(e)</option>
                </select>
            </div>


            <div class="form-group">
                <label id="labelMontant" data-i18n="label_salary_monthly">Salaire Brut Mensuel (DT)</label>
                <div class="flex-row">
                    <input type="number" id="revenuInput" class="form-control" placeholder="Ex: 2000" style="flex:2">
                    <select id="frequenceRevenu" class="form-control" style="flex:1" onchange="updateSalaryLabel()">
                        <option value="annuel" data-i18n="opt_annual">Annuel</option>
                        <option value="mensuel" data-i18n="opt_monthly" selected>Mensuel</option>
                    </select>
                </div>
                <!-- Help Text for Salary -->
                <div id="salary-help-text" style="font-size: 0.8em; opacity: 0.7; margin-top: 5px; color: #94a3b8; font-style: italic;"></div>
            </div>
            
            <div class="form-group">
                <label style="font-size: 0.9em;" data-i18n="label_op_specific">Opération Spécifique (+) (Imposable)</label>
                <input type="number" id="opSpecifiqueIrpp" class="form-control" placeholder="0.00">
            </div>
        </div>
        
        <!-- Section 2: Cotisations Sociales -->
        <div class="form-section glass-effect animate-slide-up" style="padding: 25px; margin-bottom: 20px; animation-delay: 0.1s;">
            <div class="section-title">
                <span class="icon">🏦</span>
                <span>Cotisations Sociales</span>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="cnss" checked>
                <label for="cnss" data-i18n="label_cnss_deduction">Appliquer déduction CNSS/CNRPS (9.68%)</label>
            </div>
            <div class="help-text" data-i18n="desc_cnss_help">Les frais professionnels (10%, max 2000 DT) sont appliqués automatiquement</div>
        </div>

        <!-- Section 3: Situation Familiale -->
        <div class="form-section glass-effect animate-slide-up" style="padding: 25px; margin-bottom: 20px; animation-delay: 0.2s;">
            <div class="section-title">
                <span class="icon">👨‍👩‍👧‍👦</span>
                <span data-i18n="label_situation">Situation Familiale</span>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="chefFamille">
                <label for="chefFamille" data-i18n="label_head_family">Chef de famille (Crédit d'impôt 300 DT)</label>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_kids_charge">Enfants à charge (-20 ans)</label>
                    <select id="nbEnfants" class="form-control">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_kids_student">Enfants Étudiants (< 25 ans)</label>
                    <input type="number" id="nbEtudiants" class="form-control" value="0" min="0">
                </div>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label data-i18n="label_kids_handicapped">Enfants handicapés</label>
                    <input type="number" id="nbEnfantsInfirmes" class="form-control" value="0" min="0">
                </div>
                <div class="form-group flex-col-50">
                    <label data-i18n="label_parents_charge">Parents à charge</label>
                    <input type="number" id="nbParents" class="form-control" value="0" min="0">
                </div>
            </div>
             <div class="form-group">
                <label style="font-size: 0.9em;" data-i18n="label_other_deductions">Autres Déductions (-)</label>
                <input type="number" id="autreDeduction" class="form-control" placeholder="0.00">
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
            <button id="btn-calc-irpp" class="btn-primary" style="flex: 2;" data-i18n="btn_calculate">
                Calculer IRPP
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="showDetails" style="margin-right: 8px;">
                <label for="showDetails" style="font-size: 0.9em; cursor: pointer; user-select: none;" data-i18n="label_details">Voir détail calcul</label>
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
        updateSalaryLabel();

        const btnCalc = document.getElementById('btn-calc-irpp');
        if (e.target.checked) {
            btnCalc.setAttribute('data-i18n', 'btn_calculate_inverse');
            btnCalc.style.background = "var(--accent)";
        } else {
            btnCalc.setAttribute('data-i18n', 'btn_calculate');
            btnCalc.style.background = "var(--primary)";
        }

        // Trigger translation update
        if (typeof changeLanguage === 'function') {
            const currentLang = localStorage.getItem('language') || 'fr';
            changeLanguage(currentLang);
        }
    });

    // Initial label set
    window.updateSalaryLabel = function () {
        const isInverse = document.getElementById('modeInverse').checked;
        const frequence = document.getElementById('frequenceRevenu').value;
        const labelMontant = document.getElementById('labelMontant');
        const helpText = document.getElementById('salary-help-text');

        let key = "label_salary_monthly";
        let helpKey = "help_salary_gross";

        if (isInverse) {
            key = (frequence === 'annuel') ? "label_salary_inverse_annual" : "label_salary_inverse_monthly";
            helpKey = "help_salary_net";
            labelMontant.style.color = "var(--accent)";
        } else {
            key = (frequence === 'annuel') ? "label_salary_annual" : "label_salary_monthly";
            helpKey = "help_salary_gross";
            labelMontant.style.color = "var(--text-main)";
        }

        labelMontant.setAttribute('data-i18n', key);
        if (helpText) {
            helpText.setAttribute('data-i18n', helpKey);
        }

        // Immediate update of text
        if (typeof t === 'function') {
            labelMontant.textContent = t(key);
            if (helpText) helpText.textContent = t(helpKey);
        }
    };

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

    // Store for dashboard
    window.lastIRPPResult = result;
    if (window.updateDashboard) window.updateDashboard();
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
        bestResult = calculateIRPPCore(contextInputs, currentFiscalYear);
    }

    // Global Context for Advisor
    window.lastCalculation = {
        type: 'IRPP',
        totalTax: bestResult.totalRetenue,
        data: bestResult
    };
    if (window.shareWithAI) window.shareWithAI(window.lastCalculation);

    displayIRPPResults(bestResult, true); // true = Reverse Mode

    // Store for dashboard
    window.lastIRPPResult = bestResult;
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
        // CORRECTION FISCALE LF 2026: Taux 9.68% Privé (CNSS), 10.2% Public (CNRPS)
        // Part salariale (déductible IRPP) : 9,68 %
        const tauxCNSS = (secteur === 'public') ? 0.102 : 0.0968;
        cnss = grossIncome * tauxCNSS;
    }

    // 2. Abatements
    let revenuApresCnss = grossIncome - cnss;
    let abattement = 0;
    let labelAbattement = "";

    if (typeRevenu === 'retraite') {
        abattement = revenuApresCnss * 0.25; // 25% Abatement (SANS plafond)
        labelAbattement = "label_abattement_retraite";
    } else {
        // Frais professionnels (10% du Salaire Net de CNSS plafonné à 2000 DT)
        // Source LF 2026: (Brut - CNSS) x 10%
        abattement = Math.min(revenuApresCnss * 0.10, 2000);
        labelAbattement = "label_abattement_pro";
    }

    let netApresAbattement = revenuApresCnss - abattement;

    // 3. Deductions (From income)
    let extraDeductions = autreDeduction;
    // CORRECTION ERREUR 2: "Parents" et "Etudiants" sont des CREDITS D'IMPOT (Déduits après IRPP)
    // On ne les déduit plus de l'assiette imposable ici.
    extraDeductions += nbInfirmes * 2000;

    // 4. Taxable Base
    let assietteSoumise = Math.max(0, (netApresAbattement + opSpecifiqueIrpp) - extraDeductions);

    // 5. IRPP Calculation (Barème LF 2026 - 8 Tranches)
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
    let remainingBase = assietteSoumise;

    brackets.forEach(bracket => {
        let taxableInThisBracket = 0;
        let bracketSize = bracket.max - bracket.min;

        if (remainingBase > 0) {
            taxableInThisBracket = Math.min(remainingBase, bracketSize);
            remainingBase -= taxableInThisBracket;
        }

        let taxForBracket = taxableInThisBracket * bracket.rate;
        impotTotal += taxForBracket;

        if (taxableInThisBracket > 0 || (bracket.rate === 0 && bracket.min === 0)) {
            bracketDetails.push({
                label: `${bracket.min.toLocaleString('fr-TN')} - ${bracket.max === Infinity ? '+' : bracket.max.toLocaleString('fr-TN')}`,
                rate: (bracket.rate * 100).toFixed(0) + '%',
                base: taxableInThisBracket,
                tax: taxForBracket
            });
        }
    });

    // 6. Family Credits (Applied AFTER tax) - LF 2026
    let creditChefFamille = chefFamille ? 300 : 0;
    // LF 2026: 100 DT par enfant (4 premiers)
    let creditEnfants = Math.min(nbEnfants, 4) * 100;

    // CREDITS D'IMPOT (Déduits après IRPP)
    let creditParents = nbParents * 450;
    let creditEtudiants = nbEtudiants * 1000;

    let totalCredits = creditChefFamille + creditEnfants + creditParents + creditEtudiants;

    let irppNet = Math.max(0, impotTotal - totalCredits);

    // 7. CSS (Contribution Sociale de Solidarité)
    // CORRECTION LF 2026 : Mesures exceptionnelles maintenues
    // Taux Personnes Physiques : réduit de 0,5 point => 0,5%
    // Base de calcul : Revenu Net Imposable (Assiette Soumise)
    // Exonération totale si Assiette Soumise <= 5000 DT
    let cssSolidaire = 0;
    if (assietteSoumise > 5000) {
        cssSolidaire = assietteSoumise * 0.005;
    }

    const totalRetenue = irppNet + cssSolidaire;
    const netMensuel = (grossIncome - cnss - totalRetenue) / 12;

    // 8. Charges Patronales (Info)
    const tfp = grossIncome * 0.01;
    const foprolos = grossIncome * 0.01;

    return {
        grossIncome,
        cnss,
        abattement,
        labelAbattement,
        netApresAbattement,
        totalDeductions: extraDeductions, // Income deductions
        familyCredits: totalCredits, // Tax credits
        creditChefFamille,
        creditEnfants,
        creditParents,
        creditEtudiants,
        assietteSoumise,
        irppBrut: impotTotal,
        irppNet: irppNet,
        css: cssSolidaire,
        totalRetenue,
        netMensuel,
        bracketDetails,
        tfp,
        foprolos,
        inputs
    };
}

/**
 * Display Final Results
 */
/**
 * Display Final Results with Professional Enhancements
 */
/**
 * Display Final Results with Professional Enhancements
 */
function displayIRPPResults(result, isReverseMode) {
    const resultDiv = document.getElementById('result-irpp');
    const showDetails = result.inputs.showDetails;

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        const data = window.I18N_DATA || {};
        return (data[lang] && data[lang][key]) || key;
    };

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
        qvStatus.innerText = (result.grossIncome > 0) ? "LF " + currentFiscalYear : t("irpp_status_pending");
        qvStatus.style.color = (result.grossIncome > 0) ? "#10b981" : "#94a3b8";
    }


    // Header Label & Color
    let headerLabel = isReverseMode ? t("res_gross_estimated") : t("res_net_estimated");
    // Fallback if key missing
    if (!headerLabel) headerLabel = isReverseMode ? "Salaire Brut Estimé" : "Net Mensuel Estimé";

    let headerAmount = isReverseMode ? result.grossIncome.toLocaleString('fr-TN', { maximumFractionDigits: 3 }) : result.netMensuel.toLocaleString('fr-TN', { maximumFractionDigits: 3 });
    let headerColor = isReverseMode ? "var(--warning)" : "var(--success)";

    // --- RECOMMANDATION 5: Comparaison avec 2025 ---
    let comparisonHtml = '';
    if (!isReverseMode) {
        let gain = 0;
        // CORRECTION: Utilisation de irppNet au lieu de irpp (qui était undefined -> NaN)
        const currentTax = result.irppNet;
        const oldTax = currentTax * 1.05; // Simulation simplifiée de l'ancien barème
        gain = oldTax - currentTax;

        if (gain > 0) {
            comparisonHtml = `
                <div style="margin-top: 10px; padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 6px; font-size: 0.85em; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2em;">📉</span>
                    <div>
                        <strong>${t("res_impact_lf2026")} :</strong>
                        <span style="color: var(--success);">${t("res_gain")} ~${(gain / 12).toFixed(3)} DT/${t("opt_monthly").toLowerCase()}</span>
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
                <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">📟 ${t("label_details")} (Audit)</h4>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>(+) ${t("res_gross_annual")}</span>
                    <span>${result.grossIncome.toFixed(3)}</span>
                </div>
                ${result.inputs.opSpecifiqueIrpp !== 0 ? `
                <div style="display: flex; justify-content: space-between; color: var(--warning);">
                    <span>(+) Op. Spécifique</span>
                    <span>+ ${result.inputs.opSpecifiqueIrpp.toFixed(3)}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) CNSS salariale (9.68%)</span>
                    <span>- ${result.cnss.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #555; padding-bottom: 2px; margin-bottom: 2px;">
                    <span>(=) Brut Imposable</span>
                    <span>${(result.grossIncome - result.cnss + (result.inputs.opSpecifiqueIrpp || 0)).toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) ${t(result.labelAbattement)}</span>
                    <span>- ${result.abattement.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(-) ${t("label_other_deductions")}</span>
                    <span>- ${result.inputs.autreDeduction.toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #fff; border-top: 1px solid #777; padding-top: 5px;">
                    <span>(=) ${t("res_taxable_annual")}</span>
                    <span>${result.assietteSoumise.toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; color: #34d399; margin-top: 5px; border-top: 1px solid #444; padding-top: 5px;">
                    <span>Calcul IRPP (Sur barème)</span>
                    <span>${result.irppBrut.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #34d399;">
                    <span>(-) Crédit Chef de Famille</span>
                    <span>- ${result.creditChefFamille.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #34d399;">
                    <span>(-) Crédit Enfants (${result.inputs.nbEnfants})</span>
                    <span>- ${result.creditEnfants.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #34d399;">
                    <span>(-) Crédit Parents (${result.inputs.nbParents})</span>
                    <span>- ${result.creditParents.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #34d399;">
                    <span>(-) Crédit Etudiants (${result.inputs.nbEtudiants})</span>
                    <span>- ${result.creditEtudiants.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: #fff;">
                    <span>(=) IRPP Net à payer</span>
                    <span>${result.irppNet.toFixed(3)}</span>
                </div>
                
                 <div style="margin-top: 10px; padding-top: 5px; border-top: 1px dashed #555; font-size: 0.9em; opacity: 0.8;">
                    <strong style="color: #94a3b8; display:block; margin-bottom:3px;">Charges Patronales (Info):</strong>
                    <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                        <span>TFP (1%)</span>
                        <span>${result.tfp.toFixed(3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                        <span>FOPROLOS (1%)</span>
                        <span>${result.foprolos.toFixed(3)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <h3><span>${headerLabel}</span></h3>
                <span class="final-amount" style="color: ${headerColor};">${headerAmount} DT</span>
            </div>
            ${comparisonHtml}

            <!-- AI Consultation Trigger -->
            <div style="margin: 15px 0;">
                <button onclick="window.triggerConsultation()" class="btn-primary" style="background: linear-gradient(135deg, #a855f7, #6366f1); width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2);">
                    <span>💡</span> <span data-i18n="btn_ai_audit">Analyser ce résultat avec l'IA</span>
                </button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <!-- Section 1: Revenus et Cotisations -->
                <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:8px; margin-bottom:12px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.95em;">
                        <div>
                            <span style="opacity:0.7">${t("res_gross_annual")} :</span>
                            <strong style="float:right">${result.grossIncome.toLocaleString('fr-TN', { maximumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">CNSS :</span>
                            <strong style="float:right; color: var(--warning)">- ${result.cnss.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">${t(result.labelAbattement)} :</span>
                            <strong style="float:right; color: var(--warning)">- ${result.abattement.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Détails des Impôts -->
                <div style="padding: 10px; margin-top:15px; border-top:1px dashed rgba(255,255,255,0.1)">
                    <p style="margin: 5px 0;">
                        <strong>1. ${t("label_irpp_bracket")} :</strong> 
                        <span style="float:right; color:var(--text-main);">${result.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                    </p>
                    <p style="margin: 5px 0; color: var(--accent);">
                        <strong>2. ${t("label_css_short")} (0,5% Assiette) :</strong>
                        <span style="float:right">+ ${result.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                    </p>
                    
                    <p style="margin: 10px 0 5px 0; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 5px; font-weight: bold; color: #ef4444;">
                        <strong data-i18n="label_total_irpp_css">${t("label_total_irpp_css")} :</strong>
                        <span style="float:right">${result.totalRetenue.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
                    </p>
                    
                    <div style="margin-top: 15px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600;">${isReverseMode ? t("label_salary_inverse") : t("res_net_estimated")} :</span>
                            <strong style="color: var(--success); font-size: 1.25em;">${result.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>
                
                ${detailedCalculationHtml}

            </div>
            
            <h4 style="margin: 20px 0 10px 0; display: flex; align-items: center; gap: 8px;">
                <span class="icon">📈</span> <span>${t("label_detail_tranche")}</span>
            </h4>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>${t("table_tranche")}</th>
                        <th>${t("table_taux")}</th>
                        <th style="text-align:right">${t("table_base")}</th>
                        <th style="text-align:right">${t("table_impot")}</th>
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
                <h4 style="margin: 0 0 15px 0; text-align: center;">${t("res_distribution_header")}</h4>
                <div style="max-width: 300px; margin: 0 auto;">
                    <canvas id="irppChart"></canvas>
                </div>
            </div>

            <!-- NEW: Fiscal Pressure Curve -->
            <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
                <h4 style="margin: 0 0 15px 0; text-align: center;">📈 Courbe de Pression Fiscale</h4>
                <div style="height: 250px;">
                    <canvas id="pressureChart"></canvas>
                </div>
                <p style="font-size: 0.8em; opacity: 0.7; text-align: center; margin-top: 10px;">
                    Cette courbe montre comment votre taux d'imposition augmente avec vos revenus (Progressivité de l'impôt).
                </p>
            </div>

             <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="btn-explain-irpp" class="btn-primary" style="flex: 2; background: var(--primary-gradient);">
                    <span class="icon">🤖</span> <span data-i18n="label_explain_results">Expliquez-moi mes résultats 🤖</span>
                </button>
                <button id="btn-print-irpp" class="btn-primary" style="flex: 1; background: var(--accent);">
                    <span class="icon">🖨️</span> <span data-i18n="btn_print">Imprimer</span>
                </button>
             </div>

             <!-- NEW: Export Buttons -->
             <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="btn-export-pdf" class="btn-secondary" style="flex: 1; border: 1px solid var(--primary); color: var(--primary);">
                    <span class="icon">📄</span> PDF
                </button>
                <button id="btn-export-excel" class="btn-secondary" style="flex: 1; border: 1px solid #10b981; color: #10b981;">
                    <span class="icon">📊</span> Excel
                </button>
             </div>

             <!-- NEW: Optimization Suggestions -->
             <div id="optimization-suggestions"></div>
        </div>
    `;

    // Explain
    document.getElementById('btn-explain-irpp').addEventListener('click', () => {
        if (window.askAssistant) {
            window.askAssistant(t("chat_suggest_bilan"));
        }
    });

    // Print
    document.getElementById('btn-print-irpp').addEventListener('click', () => window.print());

    // Exports
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generatePDF(result, 'IRPP');
    });

    document.getElementById('btn-export-excel').addEventListener('click', () => {
        if (window.FiscalExport) window.FiscalExport.generateExcel(result, 'IRPP');
    });

    // Run Optimization Check
    checkOptimization(result);

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

    // I18N Helper
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    if (irppChartInstance) {
        irppChartInstance.destroy();
    }

    irppChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [t('res_net_pocket'), 'CNSS', t('result_tax')],
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

    // Render Pressure Chart
    renderPressureChart(brut);
}

let pressureChartInstance = null;
function renderPressureChart(currentGross) {
    const canvas = document.getElementById('pressureChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate Data Points
    const points = [];
    const labels = [];
    const maxRange = Math.max(currentGross * 1.5, 60000); // At least 60k or 1.5x current
    const steps = 10;

    // Simulations for curve
    for (let i = 0; i <= steps; i++) {
        const simGross = (maxRange / steps) * i;
        if (simGross === 0) {
            points.push(0);
            labels.push("0");
            continue;
        }

        // Quick simulation (simplified mostly for curve shape)
        // We reuse the core logic but need a lightweight version or just call core
        // calling core is safer but we need inputs.
        // Let's make a mock input object
        const mockInputs = {
            grossIncome: simGross,
            typeRevenu: 'salarie',
            applyCNSS: true,
            chefFamille: false,
            nbEnfants: 0,
            nbEtudiants: 0,
            nbInfirmes: 0,
            nbParents: 0,
            opSpecifiqueIrpp: 0,
            autreDeduction: 0
        };
        const res = calculateIRPPCore(mockInputs);
        const rate = (res.totalRetenue / simGross) * 100;
        points.push(rate.toFixed(1)); // %
        labels.push((simGross / 1000).toFixed(0) + "k");
    }

    if (pressureChartInstance) {
        pressureChartInstance.destroy();
    }

    // Current User Point
    const currentRate = ((window.lastCalculation.totalTax / currentGross) * 100).toFixed(1);

    pressureChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pression Fiscale (%)',
                data: points,
                borderColor: '#3b82f6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Votre Position',
                data: labels.map((l, i) => {
                    // Try to place the point exactly on the X axis where user is
                    // ChartJS categorical axis makes this tricky, simpler approach:
                    // Just dataset with one point? 
                    // Better: Annotation or mixed scatter. 
                    // For simplicity: We won't plot a second dataset for the point in this quick version
                    // unless we use scatter.
                    // Instead: We rely on the tooltip of the main curve.
                    return null;
                }),
                // ...
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                annotation: {
                    // Requires plugin, skipping complex annotations
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Pression: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Taux Imposition (%)', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    title: { display: true, text: 'Revenu Brut (DT)', color: '#94a3b8' },
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
 * Check for Fiscal Optimization
 */
function checkOptimization(result) {
    const container = document.getElementById('optimization-suggestions');
    if (!container) return;

    container.innerHTML = ''; // Clear

    const suggestions = [];
    const t = (key) => (window.I18N_DATA && window.I18N_DATA['fr'] && window.I18N_DATA['fr'][key]) || key; // Helper simple

    // Rule 1: CEA (Compte Epargne Actions)
    // If Net Annual > 20k and Tax > 1000, suggest CEA
    if (result.netMensuel * 12 > 20000 && result.irpp > 1000) {
        const potentialSave = Math.min(result.irpp, 500); // Rough estimate
        suggestions.push({
            icon: '📉',
            title: 'Compte Épargne en Actions (CEA)',
            text: `Vous pouvez déduire jusqu'à 20 000 DT par an. Gain d'impôt estimé : jusqu'à 35% du montant versé.`
        });
    }

    // Rule 2: Assurance Vie
    if (result.netMensuel * 12 > 15000) {
        suggestions.push({
            icon: '🛡️',
            title: 'Assurance Vie',
            text: `Déduction possible jusqu'à 10 000 DT / an. Utile pour préparer la retraite et réduire l'assiette imposable.`
        });
    }

    if (suggestions.length > 0) {
        let html = `
            <div style="margin-top: 25px; padding: 15px; border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.1); border-radius: 12px;">
                <h4 style="margin: 0 0 10px 0; color: #f59e0b; display: flex; align-items: center; gap: 8px;">
                    ⚡ Pistes d'Optimisation Fiscale
                </h4>
        `;

        suggestions.forEach(s => {
            html += `
                <div style="margin-bottom: 10px; display: flex; gap: 10px;">
                    <span style="font-size: 1.2em;">${s.icon}</span>
                    <div>
                        <strong style="color: #fbbf24;">${s.title}</strong>
                        <p style="margin: 2px 0; font-size: 0.9em; opacity: 0.8;">${s.text}</p>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }
}
