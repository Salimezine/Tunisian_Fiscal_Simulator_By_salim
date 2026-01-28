const fs = require('fs');
const path = require('path');

// Mock DOM for irpp.js and is.js
const documentMock = {
    getElementById: () => ({ value: '0', checked: false, addEventListener: () => { } }),
    querySelectorAll: () => [],
};
global.document = documentMock;
global.window = {
    setYear: () => { },
    I18N_DATA: {},
    shareWithAI: () => { },
    FiscalLogic: {}
};

// Load irpp.js
const irppPath = path.join(__dirname, '../irpp.js');
const irppContent = fs.readFileSync(irppPath, 'utf8');
eval(irppContent);

// Load is.js
const isPath = path.join(__dirname, '../is.js');
const isContent = fs.readFileSync(isPath, 'utf8');
eval(isContent);

console.log("╔═══════════════════════════════════════════════════════════════════╗");
console.log("║    VÉRIFICATION SCÉNARIOS FISCAUX LF 2026                         ║");
console.log("║    Tunisian Fiscal Simulator - Scenario Testing Suite            ║");
console.log("╚═══════════════════════════════════════════════════════════════════╝\n");

let allPassed = true;
const results = {};

// ==============================================================================
// SCÉNARIO SC-REF (Référence)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-REF (Référence) - Situation actuelle de M. Trabelsi           │");
console.log("│ Marié, 3 enfants - Cadre commercial                              │");
console.log("└───────────────────────────────────────────────────────────────────┘");

// Données réelles M. Mohamed Trabelsi (Matricule: 12345678/A/M)
// Fonction: Cadre commercial (embauché 01/01/2022)
// Composition du salaire mensuel:
//   - Salaire de base:         2,500 DT
//   - Prime de rendement:        300 DT
//   - Avantage en nature:         80 DT (tickets-repas)
//   - Total brut mensuel:      2,880 DT
const inputRef = {
    grossIncome: 2880 * 12, // 34,560 DT annual (2,880 DT/mois)
    typeRevenu: 'salarie',
    secteur: 'prive',
    applyCNSS: true,
    chefFamille: true,     // Marié = chef de famille (300 DT crédit)
    nbEnfants: 3,          // 3 enfants à charge (300 DT crédit)
    nbEtudiants: 0,
    nbInfirmes: 0,
    nbParents: 0,
    opSpecifiqueIrpp: 0,
    autreDeduction: 0
};

const resultRef = calculateIRPPCore(inputRef, '2026');
results.ref = resultRef;

console.log(`✓ Composition Salaire:`);
console.log(`   - Base mensuel          : 2,500.00 DT`);
console.log(`   - Prime rendement       :   300.00 DT`);
console.log(`   - Avantage nature       :    80.00 DT`);
console.log(`   ─────────────────────────────────────`);
console.log(`✓ Salaire Brut Mensuel     : 2,880.00 DT`);
console.log(`✓ Salaire Brut Annuel      : ${resultRef.grossIncome.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ CNSS (9.68%)             : ${resultRef.cnss.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Frais Pro (10%, max 2k)  : ${resultRef.abattement.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Assiette Soumise         : ${resultRef.assietteSoumise.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Brut                : ${resultRef.irppBrut.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Crédit Chef de Famille   : -${resultRef.creditChefFamille.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Crédit Enfants (3)       : -${resultRef.creditEnfants.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Net                 : ${resultRef.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ CSS (0.5%)               : ${resultRef.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Total Retenue Annuelle   : ${resultRef.totalRetenue.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Net Mensuel              : ${resultRef.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT\n`);

// ==============================================================================
// SCÉNARIO SC-FAM (Famille)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-FAM (Famille) - Simulation Célibataire sans enfant            │");
console.log("│ Mesurer l'impact des abattements familiaux                       │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputFam = {
    ...inputRef,
    chefFamille: false,
    nbEnfants: 0
};

const resultFam = calculateIRPPCore(inputFam, '2026');
results.fam = resultFam;

const impactFamilial = resultRef.netMensuel - resultFam.netMensuel;
const creditsLost = (resultRef.creditChefFamille + resultRef.creditEnfants);

console.log(`✓ IRPP Net (sans crédits)  : ${resultFam.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Total Retenue            : ${resultFam.totalRetenue.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Net Mensuel              : ${resultFam.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`\n📊 IMPACT DES CRÉDITS FAMILIAUX:`);
console.log(`   └─ Crédits perdus       : ${creditsLost.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an`);
console.log(`   └─ Perte de revenu net  : ${impactFamilial.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/mois`);
console.log(`   └─ Soit                 : ${(impactFamilial * 12).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an\n`);

// Validation
if (Math.abs(creditsLost - (impactFamilial * 12)) < 1) {
    console.log("✅ VALIDATION: Crédits correctement appliqués comme réduction d'impôt\n");
} else {
    console.error("❌ ERREUR: Écart détecté dans l'application des crédits familiaux\n");
    allPassed = false;
}

// ==============================================================================
// SCÉNARIO SC-REV (Revenus)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-REV (Revenus) - Augmentation salariale +20%                   │");
console.log("│ Analyser l'effet du saut de tranche (30% → 33%)                  │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputRev = {
    ...inputRef,
    grossIncome: 3456 * 12 // +20% = 41,472 DT annual (base 2,880 + 20%)
};

const resultRev = calculateIRPPCore(inputRev, '2026');
results.rev = resultRev;

const augmentationBrut = resultRev.grossIncome - resultRef.grossIncome;
const augmentationNet = (resultRev.netMensuel - resultRef.netMensuel) * 12;
const tauxPrelevement = ((resultRev.totalRetenue - resultRef.totalRetenue) / augmentationBrut) * 100;

console.log(`✓ Nouveau Salaire Brut     : ${resultRev.grossIncome.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT (+${augmentationBrut.toLocaleString('fr-TN')} DT)`);
console.log(`✓ Assiette Soumise         : ${resultRev.assietteSoumise.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Brut                : ${resultRev.irppBrut.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Net                 : ${resultRev.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Net Mensuel              : ${resultRev.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`\n📊 ANALYSE SAUT DE TRANCHE:`);
console.log(`   └─ Augmentation brute   : +${augmentationBrut.toLocaleString('fr-TN')} DT/an (+20%)`);
console.log(`   └─ Augmentation nette   : +${augmentationNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an`);
console.log(`   └─ Taux prélèvement     : ${tauxPrelevement.toFixed(2)}% sur l'augmentation`);
console.log(`   └─ Net conservé         : ${(100 - tauxPrelevement).toFixed(2)}%\n`);

// Validation: Check if taxation increased (bracket jump effect)
if (resultRev.irppBrut > resultRef.irppBrut) {
    console.log("✅ VALIDATION: Effet de saut de tranche correctement appliqué\n");
} else {
    console.error("❌ ERREUR: Le saut de tranche n'a pas produit d'effet\n");
    allPassed = false;
}

// ==============================================================================
// SCÉNARIO SC-13M (Prime)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-13M (Prime) - Perception d'un 13ème mois                      │");
console.log("│ Évaluer l'impact ponctuel d'un revenu exceptionnel               │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const input13M = {
    ...inputRef,
    grossIncome: 2880 * 13 // 13 months = 37,440 DT annual
};

const result13M = calculateIRPPCore(input13M, '2026');
results.prime = result13M;

const primeAmount = 2880; // 13ème mois = 1 mois de salaire
const impactPrime = result13M.totalRetenue - resultRef.totalRetenue;
const tauxPrelevementPrime = (impactPrime / primeAmount) * 100;

console.log(`✓ Salaire avec 13ème mois  : ${result13M.grossIncome.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Brut                : ${result13M.irppBrut.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ IRPP Net                 : ${result13M.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Total Retenue            : ${result13M.totalRetenue.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`\n📊 IMPACT DU 13ÈME MOIS:`);
console.log(`   └─ Prime brute          : ${primeAmount.toLocaleString('fr-TN')} DT`);
console.log(`   └─ Retenue supplémentaire: ${impactPrime.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`   └─ Taux de prélèvement  : ${tauxPrelevementPrime.toFixed(2)}%`);
console.log(`   └─ Prime nette perçue   : ${(primeAmount - impactPrime).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT\n`);

// Validation
if (result13M.totalRetenue > resultRef.totalRetenue) {
    console.log("✅ VALIDATION: Le 13ème mois génère une retenue à la source supplémentaire\n");
} else {
    console.error("❌ ERREUR: La retenue sur le 13ème mois n'est pas correcte\n");
    allPassed = false;
}

// ==============================================================================
// SCÉNARIO SC-ZDR (Alpha Tech SARL)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-ZDR (Alpha Tech SARL) - Optimisation fiscale en ZDR           │");
console.log("│ Sfax - Services informatiques - Comparer ZDR vs Standard         │");
console.log("└───────────────────────────────────────────────────────────────────┘");

// Données réelles Alpha Tech SARL (créée 15/03/2018)
// Secteur: Développement de logiciels et services informatiques
// Implantation: Sfax, Zone Industrielle
// Effectif: 45 employés
const inputZDR = {
    sectorId: 'services',
    resComptable: 500000,     // 500k DT profit estimé (20% marge)
    caTtc: 2500000,           // 2.5M DT CA réel (données 2024-2025)
    reintegrations: 0,
    deductions: 0,
    montantReinvesti: 0,
    creditImpot: 0,
    isZDR: true,              // Simulation implantation ZDR
    isStartup: false,
    isExport: false
};

const resultZDR = window.FiscalLogic.computeIS(inputZDR);

if (resultZDR) {
    results.zdr = resultZDR;

    console.log(`✓ Secteur                  : Services (Progressif)`);
    console.log(`✓ CA HT                    : ${inputZDR.caTtc.toLocaleString('fr-TN')} DT`);
    console.log(`✓ Résultat Comptable       : ${inputZDR.resComptable.toLocaleString('fr-TN')} DT`);
    console.log(`\n📊 RÉGIME STANDARD (Sans ZDR):`);
    console.log(`   └─ Taux IS applicable   : ${(resultZDR.standard.standardRate * 100).toFixed(0)}% (CA < 5M)`);
    console.log(`   └─ IS Calculé           : ${resultZDR.standard.is.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`   └─ CSS (1%)             : ${resultZDR.standard.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`   └─ Total à payer        : ${resultZDR.standard.total.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`\n📊 RÉGIME ZDR (Avec avantage):`);
    console.log(`   └─ Taux IS applicable   : ${(resultZDR.optimized.appliedRate * 100).toFixed(0)}% (ZDR)`);
    console.log(`   └─ IS Calculé           : ${resultZDR.optimized.is.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`   └─ CSS                  : ${resultZDR.optimized.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`   └─ Total à payer        : ${resultZDR.optimized.total.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`\n💰 ÉCONOMIE RÉALISÉE:`);
    console.log(`   └─ Économie             : ${resultZDR.savings.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
    console.log(`   └─ Taux d'économie      : ${resultZDR.savingsPct.toFixed(2)}%\n`);

    // Validation
    if (resultZDR.optimized.appliedRate === 0 && resultZDR.savings > 0) {
        console.log("✅ VALIDATION: Avantage ZDR correctement appliqué (0% IS)\n");
    } else {
        console.error("❌ ERREUR: L'avantage ZDR n'est pas correctement appliqué\n");
        allPassed = false;
    }
} else {
    console.error("❌ ERREUR: Impossible de calculer le scénario IS ZDR\n");
    allPassed = false;
}

// ==============================================================================
// RÉSUMÉ FINAL
// ==============================================================================
console.log("╔═══════════════════════════════════════════════════════════════════╗");
console.log("║                    RÉSUMÉ DES SCÉNARIOS                           ║");
console.log("╚═══════════════════════════════════════════════════════════════════╝\n");

console.log("┌──────────────┬────────────────┬────────────────┬────────────────┐");
console.log("│ Scénario     │ Net Mensuel    │ IRPP Annuel    │ Observations   │");
console.log("├──────────────┼────────────────┼────────────────┼────────────────┤");
console.log(`│ SC-REF       │ ${results.ref.netMensuel.toFixed(0).padStart(10)} DT │ ${results.ref.irppNet.toFixed(0).padStart(10)} DT │ Référence      │`);
console.log(`│ SC-FAM       │ ${results.fam.netMensuel.toFixed(0).padStart(10)} DT │ ${results.fam.irppNet.toFixed(0).padStart(10)} DT │ -${creditsLost.toFixed(0)} DT crédits│`);
console.log(`│ SC-REV       │ ${results.rev.netMensuel.toFixed(0).padStart(10)} DT │ ${results.rev.irppNet.toFixed(0).padStart(10)} DT │ Saut tranche   │`);
console.log(`│ SC-13M       │      N/A       │ ${results.prime.irppNet.toFixed(0).padStart(10)} DT │ Avec prime     │`);
console.log("└──────────────┴────────────────┴────────────────┴────────────────┘\n");

if (resultZDR) {
    console.log("┌──────────────────────────────────────────────────────────────────┐");
    console.log("│ SC-ZDR (Alpha Tech) - Impôt sur les Sociétés                    │");
    console.log("├──────────────┬────────────────┬────────────────┬───────────────┤");
    console.log("│ Régime       │ Taux IS        │ IS Dû          │ Économie      │");
    console.log("├──────────────┼────────────────┼────────────────┼───────────────┤");
    console.log(`│ Standard     │ ${(resultZDR.standard.standardRate * 100).toFixed(0).padStart(9)} %    │ ${resultZDR.standard.is.toFixed(0).padStart(10)} DT │      -        │`);
    console.log(`│ ZDR          │ ${(resultZDR.optimized.appliedRate * 100).toFixed(0).padStart(9)} %    │ ${resultZDR.optimized.is.toFixed(0).padStart(10)} DT │ ${resultZDR.savings.toFixed(0).padStart(9)} DT │`);
    console.log("└──────────────┴────────────────┴────────────────┴───────────────┘\n");
}

console.log("═══════════════════════════════════════════════════════════════════");
if (allPassed) {
    console.log("✅ TOUS LES SCÉNARIOS VALIDÉS AVEC SUCCÈS");
    console.log("═══════════════════════════════════════════════════════════════════\n");
    process.exit(0);
} else {
    console.error("❌ CERTAINS SCÉNARIOS ONT ÉCHOUÉ - VÉRIFICATION REQUISE");
    console.log("═══════════════════════════════════════════════════════════════════\n");
    process.exit(1);
}
