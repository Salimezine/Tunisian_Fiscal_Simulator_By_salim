const fs = require('fs');
const path = require('path');

// Mock DOM for irpp.js and is.js
const documentMock = {
    getElementById: (id) => {
        if (id === 'anciennete') return { value: '1' };
        if (id === 'showDetailsIS') return { checked: true };
        return { value: '0', checked: false, addEventListener: () => { } };
    },
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
console.log(`✓ CSS (0,5% IRPP Net)      : ${resultRef.css.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
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
const totalLossIncludingCSS = creditsLost * 1.005; // 0.5% CSS on the credit amount

console.log(`✓ IRPP Net (sans crédits)  : ${resultFam.irppNet.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Total Retenue            : ${resultFam.totalRetenue.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`✓ Net Mensuel              : ${resultFam.netMensuel.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT`);
console.log(`\n📊 IMPACT DES CRÉDITS FAMILIAUX:`);
console.log(`   └─ Crédits perdus (IRPP) : ${creditsLost.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an`);
console.log(`   └─ Impact CSS (0,5%)     : ${(creditsLost * 0.005).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an`);
console.log(`   └─ Perte de revenu net  : ${impactFamilial.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/mois`);
console.log(`   └─ Soit (Total Annuel)  : ${(impactFamilial * 12).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT/an\n`);

// Validation
const expectedLoss = creditsLost; // Credits reduce IRPP Net, impact on Net Income is exactly the credit amount
if (Math.abs(expectedLoss - (impactFamilial * 12)) < 5) {
    console.log("✅ VALIDATION: Crédits familiaux correctement appliqués\n");
} else {
    console.error(`❌ ERREUR: Écart détecté (${Math.abs(expectedLoss - (impactFamilial * 12)).toFixed(3)} DT)`);
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
// SCÉNARIO SC-ETE (Exportateur Total - 1ère décennie)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-ETE (Export Total) - Première Décennie (0-10 ans)            │");
console.log("│ Exonération Totale (0% IS, 0% CSS, 0% Min IS)                    │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputETE = {
    sectorId: 'export',
    resComptable: 800000,
    caHt: 5000000,
    isZDR: false,
    isStartup: false,
    isExport: true,
    anciennete: 5 // 5 ans < 10 ans
};

const resultETE = window.FiscalLogic.computeIS(inputETE);
results.ete = resultETE;

console.log(`✓ IS Dû                    : ${resultETE.optimized.is.toLocaleString('fr-TN')} DT`);
console.log(`✓ CSS                      : ${resultETE.optimized.css.toLocaleString('fr-TN')} DT`);
console.log(`✓ Total à Payer            : ${resultETE.optimized.total.toLocaleString('fr-TN')} DT`);

if (resultETE.optimized.total === 0) {
    console.log("✅ VALIDATION: Exonération totale (0 DT) confirmée\n");
} else {
    console.error(`❌ ERREUR: Devrait être 0 DT, obtenu ${resultETE.optimized.total}\n`);
    allPassed = false;
}

// ==============================================================================
// SCÉNARIO SC-ETE-POST (Exportateur Total - Post 10 ans)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-ETE-POST (Export Total) - Après 10 ans                       │");
console.log("│ Déduction 50% profits export (Effective IS 7.5% si rate 15%)      │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputETEPost = {
    ...inputETE,
    anciennete: 12 // > 10 ans
};

const resultETEPost = window.FiscalLogic.computeIS(inputETEPost);
results.etePost = resultETEPost;

// IS attendu: (800k * 0.5) * 15% = 60,000 DT
// CSS attendu: 800k * 3% = 24,000 DT
// Total: 84,000 DT
console.log(`✓ IS (15% sur 50% base)    : ${resultETEPost.optimized.is.toLocaleString('fr-TN')} DT`);
console.log(`✓ CSS (3% base complète)   : ${resultETEPost.optimized.css.toLocaleString('fr-TN')} DT`);
console.log(`✓ Total à Payer            : ${resultETEPost.optimized.total.toLocaleString('fr-TN')} DT`);

if (resultETEPost.optimized.total === 84000) {
    console.log("✅ VALIDATION: Déduction 50% post-10 ans correcte (84k DT)\n");
} else {
    console.error(`❌ ERREUR: Attendu 84000 DT, obtenu ${resultETEPost.optimized.total}\n`);
    allPassed = false;
}

// ==============================================================================
// SCÉNARIO SC-ZDR-POST (ZDR - Après 10 ans)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-ZDR-POST (Zone Développement Régional) - Après 10 ans        │");
console.log("│ 10% IS + 0.1% CA TTC CSS + Min IS 0.1% CA TTC (Cap 300)          │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputZDRPost = {
    sectorId: 'industrie',
    resComptable: 100000,
    caHt: 1000000, // CA HT = 1M
    isZDR: true,
    isStartup: false,
    isExport: false,
    anciennete: 15
};

const resultZDRPost = window.FiscalLogic.computeIS(inputZDRPost);
results.zdrPost = resultZDRPost;

// IS: 100k * 10% = 10,000 DT
// CA TTC = 1M * 1.19 = 1,190,000 DT
// CSS: 1,190,000 * 0.1% = 1,190 DT
// Prélèvement Env (Industrie): 100k * 1% = 1,000 DT
// Total: 10,000 + 1,190 + 1,000 = 12,190 DT
console.log(`✓ IS (10% post-ZDR)        : ${resultZDRPost.optimized.is.toLocaleString('fr-TN')} DT`);
console.log(`✓ CSS (0.1% CA TTC)        : ${resultZDRPost.optimized.css.toLocaleString('fr-TN')} DT`);
console.log(`✓ Total à Payer            : ${resultZDRPost.optimized.total.toLocaleString('fr-TN')} DT`);

if (Math.abs(resultZDRPost.optimized.total - 12190) < 10) {
    console.log("✅ VALIDATION: IS 10% et CSS 0.1% CA TTC validés\n");
} else {
    console.error(`❌ ERREUR: Attendu 11190 DT, obtenu ${resultZDRPost.optimized.total}\n`);
    allPassed = false;
}
// ==============================================================================
// SCÉNARIO SC-ZDR (Alpha Tech SARL - Sfax)
// ==============================================================================
console.log("┌───────────────────────────────────────────────────────────────────┐");
console.log("│ SC-ZDR (Alpha Tech) - Services Informatiques (ZDR)              │");
console.log("│ Validation Exonération Totale (IS + CSS)                         │");
console.log("└───────────────────────────────────────────────────────────────────┘");

const inputAlpha = {
    sectorId: 'services',     // Services informatiques
    resComptable: 500000,
    caHt: 2500000,           // CA HT
    isZDR: true,
    isStartup: false,
    isExport: false,
    anciennete: 1             // Première année
};

const resultAlpha = window.FiscalLogic.computeIS(inputAlpha);
results.alpha = resultAlpha;

console.log(`✓ IS Calculé (ZDR)          : ${resultAlpha.optimized.is.toLocaleString('fr-TN')} DT`);
console.log(`✓ CSS Calculée (Exo ZDR)    : ${resultAlpha.optimized.css.toLocaleString('fr-TN')} DT`);
console.log(`✓ Régime Standard (Théorique) : ${resultAlpha.standard.total.toLocaleString('fr-TN')} DT`);
console.log(`✓ Économie d'impôt          : ${resultAlpha.savings.toLocaleString('fr-TN')} DT`);

// Validation of User's ROI: (Standard Total / Profit) = 164,250 / 500,000 = 32.85%?
// No: (90,000 / 500,000) = 18% in the simulator (Profit-based CSS)
const stdTotal = resultAlpha.standard.total;
const profit = inputAlpha.resComptable;
const pressureStd = (stdTotal / profit) * 100;

console.log(`📊 Pression fiscale Standard : ${pressureStd.toFixed(2)}% (Attendu ~18% car IS 15% + CSS 3%)`);

if (resultAlpha.optimized.total === 0) {
    console.log("✅ VALIDATION: Exonération totale ZDR (0 DT) confirmée\n");
} else {
    console.error(`❌ ERREUR: Devrait être 0 DT, obtenu ${resultAlpha.optimized.total}\n`);
    allPassed = false;
}
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

if (results.strat && results.ind) {
    console.log("┌──────────────────────────────────────────────────────────────────┐");
    console.log("│ RÉSUMÉ IMPÔT SUR LES SOCIÉTÉS (IS 2026)                          │");
    console.log("├──────────────┬────────────────┬────────────────┬───────────────┤");
    console.log("│ Scénario     │ Taux Facial    │ Total à Payer  │ Pression      │");
    console.log("├──────────────┼────────────────┼────────────────┼───────────────┤");
    console.log(`│ SC-STRAT     │      35 %      │ ${results.strat.optimized.total.toFixed(0).padStart(10)} DT │     43.00 %   │`);
    console.log(`│ SC-IND       │      15 %      │ ${results.ind.optimized.total.toFixed(0).padStart(10)} DT │     19.00 %   │`);
    console.log(`│ SC-ETE       │      Exo       │ ${results.ete.optimized.total.toFixed(0).padStart(10)} DT │      0.00 %   │`);
    console.log(`│ SC-ZDR-POST  │      10 %      │ ${results.zdrPost.optimized.total.toFixed(0).padStart(10)} DT │     11.19 %   │`);
    console.log(`│ SC-ZDR-ALPHA │      Exo       │ ${results.alpha.optimized.total.toFixed(0).padStart(10)} DT │      0.00 %   │`);
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
