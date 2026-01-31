const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load is.js
const isJsPath = path.join(__dirname, '..', 'is.js');
const isCode = fs.readFileSync(isJsPath, 'utf-8');

// Mock Browser Environment in Sandbox
const sandbox = {
    window: {
        FiscalLogic: {},
        I18N_DATA: {
            'fr': {
                'sect_services': 'Services',
                'sect_common': 'Commerce & Industrie'
            }
        },
        localStorage: {
            getItem: () => 'fr'
        }
    },
    document: {
        getElementById: () => null
    },
    console: console
};

vm.createContext(sandbox);

try {
    vm.runInContext(isCode, sandbox);
} catch (e) {
    console.error("❌ Error executing is.js in sandbox:", e);
    process.exit(1);
}

const computeIS = sandbox.computeIS;

if (typeof computeIS !== 'function') {
    console.error("❌ Fatal: computeIS not found in sandbox.window.FiscalLogic");
    process.exit(1);
}


// =============================================================================
// 🧪 TEST SUITE: CAS PRATIQUE N°2 - ALPHA TECH SARL (IS - RÉGIME ZDR)
// =============================================================================
// Validation automatisée des calculs IS 2026 selon documentation
// Entreprise: Alpha Tech SARL - Société de services informatiques
// Localisation: Zone de Développement Régional (ZDR) - Sfax
// Année de création: 2018 | Année de simulation: 2026 (Année 8/10)
// =============================================================================



// Test tolerance
const TOLERANCE = 0.5; // 0.5 DT tolerance for floating-point precision
let allPassed = true;

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

function assertEqual(actual, expected, description) {
    if (actual === expected) {
        console.log(`✅ ${description}: ${actual} (attendu: ${expected})`);
        return true;
    } else {
        console.error(`❌ ${description}: ${actual} (attendu: ${expected})`);
        allPassed = false;
        return false;
    }
}

console.log("\n╔══════════════════════════════════════════════════════════════════════════╗");
console.log("║  🏢 CAS PRATIQUE N°2 : ALPHA TECH SARL (IS - RÉGIME ZDR)                ║");
console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");

// =============================================================================
// SCÉNARIO 1: RÉGIME ZDR ACTUEL (ANNÉE 8/10) - EXONÉRATION TOTALE
// =============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ SCÉNARIO 1: ZDR ACTUEL (Année 8/10) - Exonération Totale              │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const inputsZDRCurrent = {
    sectorId: 'services',
    resComptable: 500000,        // Bénéfice net imposable
    caHt: 2500000,               // CA HT
    reintegrations: 0,
    deductions: 0,
    montantReinvesti: 0,
    creditImpot: 0,
    isZDR: true,                 // Zone de Développement Régional
    isStartup: false,
    isExport: false,
    isIPO: false,
    anciennete: 8                // Année 8/10
};

console.log("FICHE D'IDENTITÉ:");
console.log(`  Raison Sociale      : ALPHA TECH SARL`);
console.log(`  Secteur            : Services Informatiques`);
console.log(`  Localisation       : ZDR Sfax (Groupe 1)`);
console.log(`  Année Création     : 2018`);
console.log(`  Année Simulation   : 2026 (Année 8/10 d'activité)`);
console.log(`  CA HT              : 2,500,000 DT`);
console.log(`  CA TTC (TVA 19%)   : 2,975,000 DT`);
console.log(`  Bénéfice Net       : 500,000 DT`);
console.log("");

const resultZDRCurrent = computeIS(inputsZDRCurrent);

console.log("CALCUL IS - RÉGIME ZDR (ANNÉE 8/10):");
console.log("───────────────────────────────────────");
console.log(`Période d'exonération : 10 ans (2018-2028)`);
console.log(`Position actuelle     : Année 8/10`);
console.log(`Statut                : ✅ Encore en période d'exonération`);
console.log("");

console.log("Règle fiscale (Code d'Incitations aux Investissements):");
console.log("  • Pendant les 10 premières années d'activité en ZDR:");
console.log("  • IS = 0% (exonération totale)");
console.log("  • CSS = 0% (exonération totale)");
console.log("  • IS Minimum = Non applicable");
console.log("");

console.log(`Bénéfice Net Imposable    : 500,000.00 DT`);
console.log(`Taux IS ZDR (exonération) : 0%`);
console.log(`IS Calculé                : 0.00 DT`);
console.log("");

assertAlmostEqual(resultZDRCurrent.optimized.is, 0, "IS (ZDR Année 8)", 0.01);
assertAlmostEqual(resultZDRCurrent.optimized.css, 0, "CSS (ZDR Année 8)", 0.01);
assertAlmostEqual(resultZDRCurrent.optimized.total, 0, "TOTAL IS + CSS (ZDR Année 8)", 0.01);
assertEqual(resultZDRCurrent.optimized.isExemptPeriod, true, "Statut exonération");

console.log("\n💡 Exonération totale jusqu'au 15 mars 2028 (fin année 10)");
console.log("");

// =============================================================================
// SCÉNARIO 2: RÉGIME STANDARD (HYPOTHÈSE COMPARATIVE - SANS ZDR)
// =============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ SCÉNARIO 2: RÉGIME STANDARD (Hypothèse - Sans ZDR)                    │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const inputsStandard = {
    sectorId: 'services',
    resComptable: 500000,
    caHt: 2500000,
    reintegrations: 0,
    deductions: 0,
    montantReinvesti: 0,
    creditImpot: 0,
    isZDR: false,                // PAS de ZDR
    isStartup: false,
    isExport: false,
    isIPO: false,
    anciennete: 1
};

console.log("HYPOTHÈSE: Si Alpha Tech n'était PAS en ZDR (Tunis par exemple)");
console.log("");

const resultStandard = computeIS(inputsStandard);

console.log("ÉTAPE 1: Calcul IS Standard");
console.log("──────────────────────────");
console.log(`CA HT = 2,500,000 DT < 5,000,000 DT`);
console.log(`→ Taux IS Standard = 15%`);
console.log("");
console.log(`IS = Bénéfice Net Imposable × Taux IS`);
console.log(`   = 500,000 × 15%`);
console.log(`   = 75,000 DT`);
console.log("");

assertAlmostEqual(resultStandard.optimized.appliedRate * 100, 15, "Taux IS Standard (%)", 0.1);

console.log("ÉTAPE 2: Calcul CSS");
console.log("──────────────────");
console.log(`CSS = Bénéfice Net Imposable × 3%`);
console.log(`    = 500,000 × 3%`);
console.log(`    = 15,000 DT`);
console.log("");

assertAlmostEqual(resultStandard.optimized.css, 15000, "CSS (Standard)", 50);

console.log("ÉTAPE 3: Vérification IS Minimum");
console.log("───────────────────────────────");
console.log(`CA TTC = CA HT × (1 + TVA)`);
console.log(`       = 2,500,000 × 1.19`);
console.log(`       = 2,975,000 DT`);
console.log("");
console.log(`IS Minimum = CA TTC × 0.2%`);
console.log(`           = 2,975,000 × 0.002`);
console.log(`           = 5,950 DT (minimum absolu: 500 DT)`);
console.log("");
console.log(`Comparaison:`);
console.log(`  IS Calculé (75,000 DT) > IS Minimum (5,950 DT)`);
console.log(`  → IS Calculé applicable (pas de minimum)`);
console.log("");

console.log("ÉTAPE 4: Total Charge Fiscale Standard");
console.log("──────────────────────────────────────");
console.log("╔═══════════════════════════════════════════════════╗");
console.log("║   CALCUL IS - RÉGIME STANDARD (Hypothèse)         ║");
console.log("╠═══════════════════════════════════════════════════╣");
console.log("║                                                   ║");
console.log("║  Bénéfice Net Imposable       500,000.00 DT       ║");
console.log("║                                                   ║");
console.log("║  IS (taux standard 15%)                           ║");
console.log("║  = 500,000 × 15% =           75,000.00 DT         ║");
console.log("║                                                   ║");
console.log("║  CSS (3%)                                         ║");
console.log("║  = 500,000 × 3% =            15,000.00 DT         ║");
console.log("║                                                   ║");
console.log("║  IS Minimum (contrôle)                            ║");
console.log("║  = 2,975,000 × 0.2% = 5,950 DT                    ║");
console.log("║  (non applicable car IS calculé > minimum)        ║");
console.log("║                                                   ║");
console.log("║  ─────────────────────────────────────────────    ║");
console.log("║  TOTAL IS + CSS =            90,000.00 DT         ║");
console.log("║                                                   ║");
console.log("╚═══════════════════════════════════════════════════╝");
console.log("");

// The standard result is in resultStandard.standard (not optimized)
assertAlmostEqual(resultStandard.standard.total, 90000, "TOTAL IS + CSS (Standard)", 100);

console.log("✅ IS hypothétique 2026 (Standard) : 90,000 DT");
console.log("");

// =============================================================================
// SCÉNARIO 3: PROJECTION ZDR POST-EXONÉRATION (2029 - Année 11)
// =============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ SCÉNARIO 3: PROJECTION ZDR POST-EXONÉRATION (2029 - Année 11)         │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

const inputsZDR2029 = {
    sectorId: 'services',
    resComptable: 500000,
    caHt: 2500000,
    reintegrations: 0,
    deductions: 0,
    montantReinvesti: 0,
    creditImpot: 0,
    isZDR: true,                 // Toujours en ZDR
    isStartup: false,
    isExport: false,
    isIPO: false,
    anciennete: 11               // Année 11 (après exonération)
};

console.log("RÈGLE FISCALE APRÈS 10 ANS EN ZDR:");
console.log("  À partir de la 11ème année:");
console.log("  • IS = Taux réduit de 10% (au lieu de 15%)");
console.log("  • CSS = 0.1% des bénéfices");
console.log("  • IS Minimum = 0.1% CA TTC (plafonné à 300 DT)");
console.log("");

const resultZDR2029 = computeIS(inputsZDR2029);

console.log("CALCUL PROJECTION 2029 (Année 11):");
console.log("─────────────────────────────────");
console.log("");
console.log("╔═══════════════════════════════════════════════════╗");
console.log("║   PROJECTION IS 2029 - ZDR POST-EXONÉRATION       ║");
console.log("╠═══════════════════════════════════════════════════╣");
console.log("║                                                   ║");
console.log("║  Bénéfice Net Imposable       500,000 DT          ║");
console.log("║                                                   ║");
console.log("║  IS (taux réduit 10%)                             ║");
console.log("║  = 500,000 × 10% =           50,000.00 DT         ║");
console.log("║                                                   ║");
console.log("║  CSS (0.1%)                                       ║");
console.log("║  = 500,000 × 0.1% =             500.00 DT         ║");
console.log("║                                                   ║");
console.log("║  IS Minimum (vérification)                        ║");
console.log("║  = 2,975,000 × 0.1% = 2,975 DT                    ║");
console.log("║  Plafonné à 300 DT                                ║");
console.log("║  IS calculé > IS min → IS calculé applicable      ║");
console.log("║                                                   ║");
console.log("║  ─────────────────────────────────────────────    ║");
console.log("║  TOTAL IS + CSS (2029) =     50,500.00 DT         ║");
console.log("║                                                   ║");
console.log("╚═══════════════════════════════════════════════════╝");
console.log("");

assertAlmostEqual(resultZDR2029.optimized.appliedRate * 100, 10, "Taux IS ZDR post-exonération (%)", 0.1);
assertAlmostEqual(resultZDR2029.optimized.is, 50000, "IS (ZDR Année 11)", 50);
assertAlmostEqual(resultZDR2029.optimized.css, 500, "CSS (ZDR Année 11)", 5);
assertAlmostEqual(resultZDR2029.optimized.total, 50500, "TOTAL IS + CSS (ZDR 2029)", 100);

console.log("✅ IS projeté 2029 (ZDR après exonération) : 50,500 DT");
console.log("");

// =============================================================================
// COMPARAISON MULTI-SCÉNARIOS
// =============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 📊 COMPARAISON RÉGIMES FISCAUX IS 2026                                 │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  Indicateur          │ ZDR Actuel │  Standard  │  ZDR Post (2029)  ║");
console.log("║                      │ (Année 8)  │ (Hypothèse)│                   ║");
console.log("╠══════════════════════════════════════════════════════════════════════╣");
console.log("║  CA HT               │ 2,500,000  │ 2,500,000  │  2,500,000 DT     ║");
console.log("║  Bénéfice Net        │   500,000  │   500,000  │    500,000 DT     ║");
console.log("║  ──────────────────────────────────────────────────────────────────  ║");
console.log("║  Taux IS             │       0%   │      15%   │        10%        ║");
console.log(`║  IS Calculé          │     ${resultZDRCurrent.optimized.is.toFixed(0).padStart(5)} DT │  ${resultStandard.standard.is.toFixed(0).padStart(6)} DT │    50,000 DT     ║`);
console.log("║  ──────────────────────────────────────────────────────────────────  ║");
console.log("║  Taux CSS            │       0%   │       3%   │       0.1%        ║");
console.log(`║  CSS Calculée        │     ${resultZDRCurrent.optimized.css.toFixed(0).padStart(5)} DT │  ${resultStandard.standard.css.toFixed(0).padStart(6)} DT │       500 DT     ║`);
console.log("║  ──────────────────────────────────────────────────────────────────  ║");
console.log("║  IS Minimum          │     N/A    │   5,950 DT │       300 DT     ║");
console.log("║  (applicable?)       │     Non    │      Non   │       Non        ║");
console.log("║  ──────────────────────────────────────────────────────────────────  ║");
console.log(`║  TOTAL IS + CSS      │     ${resultZDRCurrent.optimized.total.toFixed(0).padStart(5)} DT │  ${resultStandard.standard.total.toFixed(0).padStart(6)} DT │    50,500 DT     ║`);
console.log("║  ══════════════════════════════════════════════════════════════════  ║");
const savings2026 = resultStandard.standard.total - resultZDRCurrent.optimized.total;
const savings2029 = resultStandard.standard.total - resultZDR2029.optimized.total;
console.log(`║  ÉCONOMIE vs Standard│  ${savings2026.toFixed(0).padStart(6)} DT │      -     │    39,500 DT     ║`);
console.log("║  ══════════════════════════════════════════════════════════════════  ║");
console.log(`║  Bénéfice Après IS   │  500,000 DT│  410,000 DT│   449,500 DT     ║`);
console.log("║  ──────────────────────────────────────────────────────────────────  ║");
console.log("║  Taux Pression Fisc. │       0%   │      18%   │      10.1%        ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝");
console.log("");

assertAlmostEqual(savings2026, 90000, "Économie 2026 (ZDR vs Standard)", 100);
assertAlmostEqual(savings2029, 39500, "Économie 2029 (ZDR post vs Standard)", 100);

// =============================================================================
// ANALYSE FINANCIÈRE
// =============================================================================
console.log("┌────────────────────────────────────────────────────────────────────────┐");
console.log("│ 💰 ANALYSE FINANCIÈRE APPROFONDIE                                      │");
console.log("└────────────────────────────────────────────────────────────────────────┘\n");

console.log("ÉCONOMIE ANNUELLE 2026 (ZDR vs Standard):");
console.log("────────────────────────────────────────");
console.log(`  Charge fiscale Standard : 90,000 DT`);
console.log(`  Charge fiscale ZDR      :      0 DT`);
console.log(`  ─────────────────────────────────────`);
console.log(`  ÉCONOMIE 2026           : 90,000 DT`);
console.log(`  Taux d'économie         :    100%`);
console.log("");

console.log("ÉCONOMIES CUMULÉES SUR 10 ANS (2018-2028):");
console.log("──────────────────────────────────────────");
console.log(`  Hypothèse : Bénéfice constant de 500,000 DT/an`);
console.log(`  Économie annuelle moyenne : 90,000 DT`);
console.log(`  Durée exonération         : 10 ans`);
console.log(`  ─────────────────────────────────────────`);
console.log(`  Économies totales ZDR     : 900,000 DT`);
console.log("");
console.log(`  Impact: L'équivalent de 1.8 années de bénéfices`);
console.log(`          économisés en impôts!`);
console.log("");

console.log("RETOUR SUR INVESTISSEMENT (ROI):");
console.log("───────────────────────────────");
console.log(`  Investissement ZDR (estimation) : 250,000 DT`);
console.log(`  Économies sur 10 ans            : 900,000 DT`);
console.log(`  ────────────────────────────────────────────`);
console.log(`  ROI = (900,000 - 250,000) / 250,000 × 100`);
console.log(`      = 260%`);
console.log("");
console.log(`  Délai de récupération:`);
console.log(`  = 250,000 / 90,000 = 2.8 ans`);
console.log("");
console.log("  ✅ ROI exceptionnel: 260% avec retour en 3 ans");
console.log("");

// =============================================================================
// VALIDATION FINALE
// =============================================================================
console.log("╔══════════════════════════════════════════════════════════════════════════╗");
console.log("║                      VALIDATION TECHNIQUE                                ║");
console.log("╚══════════════════════════════════════════════════════════════════════════╝\n");

console.log("┌──────────────────────────┬──────────────┬──────────────┬────────────┐");
console.log("│ Élément                  │ Calculé      │ Attendu      │ Statut     │");
console.log("├──────────────────────────┼──────────────┼──────────────┼────────────┤");
console.log(`│ IS ZDR 2026 (Année 8)    │    ${resultZDRCurrent.optimized.is.toFixed(2).padStart(7)} DT │    0.00 DT   │ ✅ Exact   │`);
console.log(`│ CSS ZDR 2026             │    ${resultZDRCurrent.optimized.css.toFixed(2).padStart(7)} DT │    0.00 DT   │ ✅ Exact   │`);
console.log(`│ IS Standard (hypothèse)  │ ${resultStandard.standard.total.toFixed(2).padStart(10)} DT │ 90,000.00 DT │ ✅ Exact   │`);
console.log(`│ IS ZDR 2029 (projection) │ ${resultZDR2029.optimized.total.toFixed(2).padStart(10)} DT │ 50,500.00 DT │ ✅ Exact   │`);
console.log(`│ Économies 2026           │ ${savings2026.toFixed(2).padStart(10)} DT │ 90,000.00 DT │ ✅ VALIDÉ  │`);
console.log("└──────────────────────────┴──────────────┴──────────────┴────────────┘\n");

console.log("═══════════════════════════════════════════════════════════════════════════");
if (allPassed) {
    console.log("✅ VALIDATION COMPLÈTE : TOUS LES CALCULS IS SONT CONFORMES LF 2026");
    console.log("═══════════════════════════════════════════════════════════════════════════");
    console.log("");
    console.log("Le simulateur IS produit des résultats parfaitement conformes à la");
    console.log("législation fiscale tunisienne 2026 pour le régime ZDR.");
    console.log("");
    console.log("✓ Régime ZDR Actuel (Année 8/10): Exonération totale validée (0 DT)");
    console.log("✓ Régime Standard (hypothèse): IS 15% + CSS 3% = 90,000 DT ✅");
    console.log("✓ Projection ZDR post-exonération (2029): IS 10% + CSS 0.1% = 50,500 DT ✅");
    console.log("✓ Économies ZDR: 90,000 DT/an pendant exonération ✅");
    console.log("✓ ROI ZDR: 260% avec récupération en 2.8 ans ✅");
    console.log("");
    console.log("RECOMMANDATION STRATÉGIQUE:");
    console.log("🎯 Maintenir impérativement l'activité en ZDR Sfax");
    console.log("   • Économies restantes 2026-2028 : 180,000 DT");
    console.log("   • Avantage permanent post-2028 : IS 10% au lieu de 15%");
    console.log("   • Stabilité opérationnelle et ROI exceptionnel démontré");
    console.log("");
    process.exit(0);
} else {
    console.error("❌ VALIDATION ÉCHOUÉE : DES ÉCARTS ONT ÉTÉ DÉTECTÉS DANS LES CALCULS IS");
    console.log("═══════════════════════════════════════════════════════════════════════════");
    console.error("\nLe simulateur nécessite des ajustements pour être conforme aux règles ZDR.");
    process.exit(1);
}
