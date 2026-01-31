const fs = require('fs');
const path = require('path');

// Mock DOM for irpp.js
const documentMock = {
    getElementById: (id) => {
        return { value: '0', checked: false, addEventListener: () => { } };
    },
    querySelectorAll: () => [],
};
global.document = documentMock;
global.window = {
    setYear: () => { },
    I18N_DATA: {},
    shareWithAI: () => { },
};

// Load irpp.js
const irppPath = path.join(__dirname, '../irpp.js');
const irppContent = fs.readFileSync(irppPath, 'utf8');
eval(irppContent);

console.log("╔══════════════════════════════════════════════════════════════════════════╗");
console.log("║        CAS PRATIQUE N°1 : M. MOHAMED TRABELSI (IRPP SALARIÉ)            ║");
console.log("║        Vérification des Calculs Documentés - LF 2026                    ║");
console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");

let allPassed = true;
const TOLERANCE = 0.1; // 0.10 DT tolerance for floating point precision

// Helper function for comparison with tolerance
function assertAlmostEqual(actual, expected, description, tolerance = TOLERANCE) {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
        console.log(`✅ ${description}: ${actual.toFixed(3)} DT (attendu: ${expected.toFixed(3)} DT)`);
        return true;
    } else {
        console.error(`❌ ${description}: ${actual.toFixed(3)} DT (attendu: ${expected.toFixed(3)} DT) - Écart: ${diff.toFixed(3)} DT`);
        allPassed = false;
        return false;
    }
}

function assertEquals(actual, expected, description) {
    if (actual === expected) {
        console.log(`✅ ${description}: ${actual}`);
        return true;
    } else {
        console.error(`❌ ${description}: ${actual} (attendu: ${expected})`);
        allPassed = false;
        return false;
    }
}

// ==============================================================================
// TEST 1: PROFIL DE M. MOHAMED TRABELSI
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 1. FICHE D'IDENTITÉ FISCALE                                            │");
console.log("└────────────────────────────────────────────────────────────────────────┘");

console.log("Données profil:");
console.log("  • Nom: M. Mohamed TRABELSI");
console.log("  • Situation familiale: Marié");
console.log("  • Enfants à charge: 3 (âgés de 8, 12 et 15 ans)");
console.log("  • Fonction: Cadre Commercial");
console.log("  • Employeur: Alpha Tech SARL (Sfax)");
console.log("");
console.log("Rémunération mensuelle:");
console.log("  • Salaire de base      : 2,500.00 DT");
console.log("  • Prime de rendement   :   300.00 DT");
console.log("  • Tickets-repas        :    80.00 DT");
console.log("  ─────────────────────────────────────");
console.log("  • TOTAL BRUT MENSUEL   : 2,880.00 DT");
console.log("  • TOTAL BRUT ANNUEL    : 34,560.00 DT (2,880 × 12)");
console.log("");

// ==============================================================================
// TEST 2: CALCUL ÉTAPE PAR ÉTAPE
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 2. SAISIE DANS LE SIMULATEUR ET CALCUL                                │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const inputTrabelsi = {
    grossIncome: 34560,         // 2,880 DT/mois × 12
    typeRevenu: 'salarie',
    secteur: 'prive',
    applyCNSS: true,
    chefFamille: true,          // Marié = chef de famille (300 DT crédit)
    nbEnfants: 3,               // 3 enfants à charge (3 × 100 DT = 300 DT crédit)
    nbEtudiants: 0,
    nbInfirmes: 0,
    nbParents: 0,
    opSpecifiqueIrpp: 0,
    autreDeduction: 0
};

const result = calculateIRPPCore(inputTrabelsi, '2026');

// ==============================================================================
// ÉTAPE 1: Cotisations CNSS
// ==============================================================================
console.log("ÉTAPE 1: Calcul des Cotisations CNSS");
console.log("─────────────────────────────────────");
console.log("Formule: CNSS = Salaire Brut Annuel × 9.68%");
console.log(`Calcul: 34,560 × 0.0968 = ${(34560 * 0.0968).toFixed(3)} DT`);
assertAlmostEqual(result.cnss, 3345.41, "CNSS calculée", 0.5);
console.log("");

// ==============================================================================
// ÉTAPE 2: Frais Professionnels
// ==============================================================================
console.log("ÉTAPE 2: Calcul des Frais Professionnels");
console.log("─────────────────────────────────────────");
console.log("Formule: min(Salaire Brut × 10%, 2,000 DT)");
const fraisTheorique = 34560 * 0.10;
console.log(`Frais théoriques: 34,560 × 10% = ${fraisTheorique.toFixed(3)} DT`);
console.log(`Plafond: 2,000 DT`);
console.log(`Frais retenus: min(${fraisTheorique.toFixed(3)}, 2,000) = 2,000 DT`);
assertAlmostEqual(result.abattement, 2000, "Frais professionnels");
console.log("");

// ==============================================================================
// ÉTAPE 3: Déductions Familiales
// ==============================================================================
console.log("ÉTAPE 3: Calcul des Déductions Familiales (Crédits d'impôt)");
console.log("────────────────────────────────────────────────────────────");
console.log("Barème LF 2026:");
console.log("  • Chef de famille: 300 DT");
console.log("  • Enfant 1 (8 ans):  100 DT");
console.log("  • Enfant 2 (12 ans): 100 DT");
console.log("  • Enfant 3 (15 ans): 100 DT");
console.log("Calcul: 300 + 100 + 100 + 100 = 600 DT");
const totalCredits = result.creditChefFamille + result.creditEnfants;
assertAlmostEqual(result.creditChefFamille, 300, "Crédit chef de famille");
assertAlmostEqual(result.creditEnfants, 300, "Crédit enfants (3 × 100 DT)");
assertAlmostEqual(totalCredits, 600, "Total crédits familiaux");
console.log("");

// ==============================================================================
// ÉTAPE 4: Revenu Net Imposable
// ==============================================================================
console.log("ÉTAPE 4: Détermination du Revenu Net Imposable");
console.log("───────────────────────────────────────────────");
console.log("Formule: Salaire Brut - CNSS - Frais Pro");
console.log("(SANS les charges familiales - appliquées après comme crédits d'impôt)");
console.log("");
console.log("Calcul:");
console.log(`  Salaire Brut Annuel     : 34,560.00 DT`);
console.log(`  - CNSS (9.68%)          :  3,345.41 DT`);
console.log(`  - Frais pro (10% max)   :  2,000.00 DT`);
console.log(`  = Revenu Net Imposable  : 29,214.59 DT`);

const expectedAssiette = 34560 - 3345.41 - 2000;
assertAlmostEqual(result.assietteSoumise, 29214.59, "Revenu net imposable");
console.log("");

// ==============================================================================
// ÉTAPE 5: Application du Barème Progressif
// ==============================================================================
console.log("ÉTAPE 5: Application du Barème Progressif IRPP");
console.log("───────────────────────────────────────────────");
console.log("Barème IRPP 2026 (8 tranches) appliqué sur 29,214.59 DT:");
console.log("┌─────────────────────┬───────┬────────────────┐");
console.log("│ Tranche de Revenu   │ Taux  │ IRPP           │");
console.log("├─────────────────────┼───────┼────────────────┤");
console.log("│ 0 - 5,000 DT        │   0%  │       0.00 DT  │");
console.log("│ 5,001 - 10,000 DT   │  15%  │     750.00 DT  │");
console.log("│ 10,001 - 20,000 DT  │  25%  │   2,500.00 DT  │");
console.log("│ 20,001 - 29,215 DT  │  30%  │   2,764.38 DT  │");
console.log("└─────────────────────┴───────┴────────────────┘");
console.log("");

// Manual calculation
const tranche1 = 5000 * 0.00;     // 0
const tranche2 = 5000 * 0.15;     // 750
const tranche3 = 10000 * 0.25;    // 2,500
const tranche4 = 9214.59 * 0.30;  // 2,764.38
const expectedIRPPBrut = tranche1 + tranche2 + tranche3 + tranche4;

console.log(`Calcul par tranches:`);
console.log(`  Tranche 1 (0-5K):        5,000 × 0%  =       0.00 DT`);
console.log(`  Tranche 2 (5K-10K):      5,000 × 15% =     750.00 DT`);
console.log(`  Tranche 3 (10K-20K):    10,000 × 25% =   2,500.00 DT`);
console.log(`  Tranche 4 (20K-29.2K):   9,214.59 × 30% = 2,764.38 DT`);
console.log(`  ────────────────────────────────────────────────────`);
console.log(`  IRPP BRUT                          = 6,014.38 DT`);
console.log("");

assertAlmostEqual(result.irppBrut, 6014.38, "IRPP Brut (barème progressif)", 0.5);
console.log("");

// ==============================================================================
// ÉTAPE 6: Contribution Sociale de Solidarité (CSS)
// ==============================================================================
console.log("ÉTAPE 6: Calcul de la CSS");
console.log("─────────────────────────");
console.log("Règles LF 2026:");
console.log("  • Taux: 0.5% du revenu net imposable");
console.log("  • Exonération si revenu < 5,000 DT");
console.log("");
console.log(`Vérification: Revenu Net Imposable = 29,214.59 DT > 5,000 DT`);
console.log(`→ CSS applicable`);
console.log("");
console.log(`Calcul: 29,214.59 × 0.5% = ${(29214.59 * 0.005).toFixed(3)} DT`);
assertAlmostEqual(result.css, 146.07, "CSS (0,5%)", 0.5);
console.log("");

// ==============================================================================
// ÉTAPE 7: Total IRPP + CSS
// ==============================================================================
console.log("ÉTAPE 7: Total IRPP + CSS à Payer");
console.log("──────────────────────────────────");
console.log("╔═════════════════════════════════════════════════╗");
console.log("║          CALCUL FINAL IRPP 2026                 ║");
console.log("╠═════════════════════════════════════════════════╣");
console.log(`║  IRPP Brut (barème progressif)   6,014.38 DT   ║`);
console.log(`║  - Crédit chef de famille         -300.00 DT   ║`);
console.log(`║  - Crédit enfants (3)             -300.00 DT   ║`);
console.log(`║  ───────────────────────────────────────────    ║`);
console.log(`║  = IRPP Net                     5,414.38 DT    ║`);
console.log(`║  + CSS (0,5%)                     146.07 DT    ║`);
console.log(`║  ───────────────────────────────────────────    ║`);
console.log(`║  TOTAL IRPP + CSS À PAYER     = 5,560.45 DT    ║`);
console.log("╚═════════════════════════════════════════════════╝");
console.log("");

// Apply credits to get net IRPP
const expectedIRPPNet = expectedIRPPBrut - 600; // 6,014.38 - 600 = 5,414.38
assertAlmostEqual(result.irppNet, 5414.38, "IRPP Net (après crédits)", 0.5);

const expectedTotal = result.irppNet + result.css;
assertAlmostEqual(result.totalRetenue, expectedTotal, "Total IRPP + CSS", 0.5);
console.log("");

// Retenue mensuelle
const retenueMensuelle = result.totalRetenue / 12;
console.log(`Retenue mensuelle (estimation):`);
console.log(`  ${result.totalRetenue.toFixed(3)} ÷ 12 = ${retenueMensuelle.toFixed(2)} DT/mois`);
console.log("");

// ==============================================================================
// TEST 3: VALIDATION DÉTAILLÉE DES TRANCHES
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 3. VALIDATION DÉTAILLÉE DES TRANCHES                                   │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

console.log("Détail de l'impact de chaque tranche:");
result.bracketDetails.forEach((bracket, idx) => {
    console.log(`  Tranche ${idx + 1}: ${bracket.label} DT @ ${bracket.rate}`);
    console.log(`    Base imposable: ${bracket.base.toFixed(3)} DT`);
    console.log(`    IRPP tranche:   ${bracket.tax.toFixed(3)} DT`);
});
console.log("");

// ==============================================================================
// TEST 4: INDICATEURS FISCAUX
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 4. INDICATEURS CLÉS                                                    │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const tauxEffectif = (result.totalRetenue / result.grossIncome) * 100;
const revenuNetAnnuel = result.grossIncome - result.cnss - result.totalRetenue;
const revenuNetMensuel = revenuNetAnnuel / 12;
const pourcentageDeductions = ((result.cnss + result.abattement) / result.grossIncome) * 100;

console.log(`Taux effectif d'imposition:`);
console.log(`  (IRPP + CSS) / Salaire Brut × 100`);
console.log(`  = ${result.totalRetenue.toFixed(3)} / ${result.grossIncome.toFixed(3)} × 100`);
console.log(`  = ${tauxEffectif.toFixed(2)}%`);
console.log("");

assertAlmostEqual(tauxEffectif, 16.09, "Taux effectif d'imposition (%)", 0.1);

console.log(`Salaire net annuel après impôt:`);
console.log(`  Salaire Brut    : ${result.grossIncome.toFixed(3)} DT`);
console.log(`  - CNSS          : ${result.cnss.toFixed(3)} DT`);
console.log(`  - IRPP + CSS    : ${result.totalRetenue.toFixed(3)} DT`);
console.log(`  ──────────────────────────────────────`);
console.log(`  = Net annuel    : ${revenuNetAnnuel.toFixed(3)} DT`);
console.log(`  = Net mensuel   : ${revenuNetMensuel.toFixed(3)} DT/mois`);
console.log("");

assertAlmostEqual(result.netMensuel, revenuNetMensuel, "Salaire net mensuel", 1);

console.log(`Poids des déductions:`);
console.log(`  Déductions totales = CNSS + Frais Pro`);
console.log(`  = ${result.cnss.toFixed(3)} + ${result.abattement.toFixed(3)}`);
console.log(`  = ${(result.cnss + result.abattement).toFixed(3)} DT`);
console.log(`  Soit ${pourcentageDeductions.toFixed(2)}% du salaire brut`);
console.log("");

// ==============================================================================
// TEST 5: SCÉNARIO PROMOTION (+20%)
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 5. SIMULATION SCÉNARIO \"PROMOTION +20%\"                                │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const inputPromotion = {
    ...inputTrabelsi,
    grossIncome: 34560 * 1.20  // 41,472 DT
};

const resultPromotion = calculateIRPPCore(inputPromotion, '2026');

console.log("Nouveaux Paramètres:");
console.log(`  Nouveau salaire brut = 34,560 × 1.20 = 41,472 DT`);
console.log("");

console.log("┌─────────────────────┬─────────────┬─────────────┬─────────────┐");
console.log("│ Indicateur          │ Avant       │ Après +20%  │ Variation   │");
console.log("├─────────────────────┼─────────────┼─────────────┼─────────────┤");
console.log(`│ Salaire brut        │  34,560 DT  │  41,472 DT  │  +6,912 DT  │`);
console.log(`│ IRPP + CSS          │  ${result.totalRetenue.toFixed(0).padStart(6)} DT  │  ${resultPromotion.totalRetenue.toFixed(0).padStart(6)} DT  │  +${(resultPromotion.totalRetenue - result.totalRetenue).toFixed(0).padStart(5)} DT  │`);
console.log(`│ Salaire net/mois    │   ${result.netMensuel.toFixed(0).padStart(5)} DT  │   ${resultPromotion.netMensuel.toFixed(0).padStart(5)} DT  │  +${(resultPromotion.netMensuel - result.netMensuel).toFixed(0).padStart(5)} DT  │`);
console.log("└─────────────────────┴─────────────┴─────────────┴─────────────┘");
console.log("");

const augmentationBrute = resultPromotion.grossIncome - result.grossIncome;
const augmentationNette = (resultPromotion.netMensuel - result.netMensuel) * 12;
const perteFiscale = (resultPromotion.totalRetenue - result.totalRetenue);
const partImpotAugmentation = (perteFiscale / augmentationBrute) * 100;

console.log("Analyse:");
console.log(`  • Augmentation brute : +${augmentationBrute.toFixed(0)} DT (+20%)`);
console.log(`  • Augmentation nette : +${augmentationNette.toFixed(0)} DT (+${((augmentationNette / augmentationBrute) * 100).toFixed(1)}%)`);
console.log(`  • Perte fiscale      : ${perteFiscale.toFixed(0)} DT (${partImpotAugmentation.toFixed(1)}% de l'augmentation part en impôt)`);
console.log("");

console.log("Explication:");
console.log(`  L'augmentation propulse M. Trabelsi dans la tranche à 33%`);
console.log(`  (30,001-40,000 DT), d'où une taxation marginale plus élevée`);
console.log(`  sur la partie excédentaire.`);
console.log("");

// ==============================================================================
// TEST 6: CONSEILS D'OPTIMISATION
// ==============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 6. CONSEILS D'OPTIMISATION FISCALE                                     │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

console.log("💡 Opportunités légales identifiées:\n");

// Test 1: Enfant étudiant
console.log("1. Enfants Étudiants");
console.log("   Si un enfant poursuit des études supérieures (non boursier):");
const inputEtudiant = {
    ...inputTrabelsi,
    nbEnfants: 2,      // 2 enfants standard
    nbEtudiants: 1     // 1 enfant étudiant
};
const resultEtudiant = calculateIRPPCore(inputEtudiant, '2026');
const gainEtudiant = result.totalRetenue - resultEtudiant.totalRetenue;
console.log(`   • Déduction enfant standard : 100 DT`);
console.log(`   • Déduction enfant étudiant : 1,000 DT`);
console.log(`   • Gain : 900 DT de déduction supplémentaire`);
console.log(`   • Économie IRPP estimée : ~${gainEtudiant.toFixed(0)} DT/an`);
console.log("");

// Test 2: Parents à charge
console.log("2. Parents à Charge");
const inputParents = {
    ...inputTrabelsi,
    nbParents: 1
};
const resultParents = calculateIRPPCore(inputParents, '2026');
const gainParents = result.totalRetenue - resultParents.totalRetenue;
console.log(`   • Crédit d'impôt : 450 DT par parent`);
console.log(`   • Économie IRPP : ~${gainParents.toFixed(0)} DT/an pour 1 parent`);
console.log("");

console.log("3. Dons Déductibles");
console.log("   Faire un don de 500 DT à une association reconnue :");
console.log("   • Déduction : 500 DT");
console.log("   • Économie IRPP : 150 DT (500 × 30% taux marginal)");
console.log("   • Coût réel du don : 350 DT");
console.log("");

console.log("4. Négociation Avantages en Nature");
console.log("   Privilégier les avantages exonérés :");
console.log("   • Transport collectif fourni par l'employeur (exonéré IRPP)");
console.log("   • Formation professionnelle prise en charge");
console.log("   • Au lieu d'augmentation de salaire brut (fortement taxée)");
console.log("");

// ==============================================================================
// RÉSUMÉ FINAL
// ==============================================================================
console.log("╔══════════════════════════════════════════════════════════════════════════╗");
console.log("║                        RÉSUMÉ DE LA VALIDATION                           ║");
console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");

console.log("┌────────────────────────────────────┬────────────────┬─────────────────┐");
console.log("│ Élément de Calcul                  │ Calculé        │ Attendu LF 2026 │");
console.log("├────────────────────────────────────┼────────────────┼─────────────────┤");
console.log(`│ Salaire Brut Annuel                │ ${result.grossIncome.toFixed(2).padStart(10)} DT │  34,560.00 DT   │`);
console.log(`│ CNSS (9.68%)                       │  ${result.cnss.toFixed(2).padStart(9)} DT │   3,345.41 DT   │`);
console.log(`│ Frais Professionnels (10%, max 2k) │  ${result.abattement.toFixed(2).padStart(9)} DT │   2,000.00 DT   │`);
console.log(`│ Revenu Net Imposable               │ ${result.assietteSoumise.toFixed(2).padStart(10)} DT │  29,214.59 DT   │`);
console.log(`│ IRPP Brut                          │  ${result.irppBrut.toFixed(2).padStart(9)} DT │   6,014.38 DT   │`);
console.log(`│ Crédit Chef de Famille             │   -${result.creditChefFamille.toFixed(2).padStart(8)} DT │    -300.00 DT   │`);
console.log(`│ Crédit Enfants (3)                 │   -${result.creditEnfants.toFixed(2).padStart(8)} DT │    -300.00 DT   │`);
console.log(`│ IRPP Net                           │  ${result.irppNet.toFixed(2).padStart(9)} DT │   5,414.38 DT   │`);
console.log(`│ CSS (0.5%)                         │    ${result.css.toFixed(2).padStart(7)} DT │     146.07 DT   │`);
console.log(`│ TOTAL IRPP + CSS                   │  ${result.totalRetenue.toFixed(2).padStart(9)} DT │   5,560.45 DT   │`);
console.log(`│ Taux Effectif                      │     ${tauxEffectif.toFixed(2).padStart(6)} % │      16.09 %    │`);
console.log("└────────────────────────────────────┴────────────────┴─────────────────┘\n");

// ==============================================================================
// CONCLUSION
// ==============================================================================
console.log("═══════════════════════════════════════════════════════════════════════════");
if (allPassed) {
    console.log("✅ VALIDATION COMPLÈTE : TOUS LES CALCULS SONT CONFORMES LF 2026");
    console.log("═══════════════════════════════════════════════════════════════════════════");
    console.log("");
    console.log("Le simulateur produit des résultats parfaitement conformes à la");
    console.log("législation fiscale tunisienne 2026 (LF 2026).");
    console.log("");
    console.log("✓ Revenu net imposable: 29,214.59 DT (SANS charges familiales)");
    console.log("✓ Barème progressif à 8 tranches correctement appliqué");
    console.log("✓ IRPP Brut: 6,014.38 DT calculé sur 29,214.59 DT");
    console.log("✓ Crédits d'impôt familiaux: 600 DT appliqués APRÈS calcul IRPP");
    console.log("✓ IRPP Net: 5,414.38 DT (après crédits)");
    console.log("✓ CSS: 146.07 DT (0.5% sur 29,214.59 DT)");
    console.log("✓ TOTAL: 5,560.45 DT/an (463 DT/mois)");
    console.log("");
    process.exit(0);
} else {
    console.error("❌ VALIDATION ÉCHOUÉE : DES ÉCARTS ONT ÉTÉ DÉTECTÉS");
    console.log("═══════════════════════════════════════════════════════════════════════════");
    console.log("");
    console.log("Veuillez vérifier les calculs ci-dessus et corriger les écarts identifiés.");
    console.log("");
    process.exit(1);
}
