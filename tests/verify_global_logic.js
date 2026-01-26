
/**
 * Verification Script for IS, TVA, RS (LF 2026)
 * Extracted core logic for standalone testing.
 */

console.log("🚀 STARTING GLOBAL FISCAL VERIFICATION SUITE (IS, TVA, RS)");

// ==========================================
// 1. IS - IMPÔT SUR LES SOCIÉTÉS
// ==========================================
console.log("\n🔷 MODULE 1: Impôt sur les Sociétés (IS)");

const SECTOR_OPTIONS = [
    { id: "agri", rate: 0.10, css: 0.01, min_tax: 0.001, type: "fixed" },
    { id: "commun", type: "progressive", css: 0.01, min_tax: 0.002, rate: 0.15 }, // Default min
    { id: "telecom", rate: 0.35, css: 0.04, min_tax: 0.002, type: "fixed" },
    { id: "banque", rate: 0.40, css: 0.04, min_tax: 0.002, type: "fixed" },
    { id: "nouvelle_1", rate: 0.00, css: 0, min_tax: 0, type: "fixed" }
];

// Re-implement computeIS logic (simplified from is.js)
function computeIS(inputs) {
    const {
        sectorId, resComptable, caHt,
        reintegrations = 0, deductions = 0, montantReinvesti = 0, creditImpot = 0,
        isZDR = false, isExport = false
    } = inputs;

    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId) || SECTOR_OPTIONS[1]; // Default commun

    const runCalculation = (config) => {
        const { sector, ca, res, reinvest, credit, reintegrations, deductions, zdrOverride, exportOverride } = config;

        // Rate
        let standardRate = sector.rate;
        if (sector.type === 'progressive') {
            if (ca < 5000000) standardRate = 0.15;
            else if (ca < 20000000) standardRate = 0.20;
            else standardRate = 0.25;
        }

        // Advantage Rate
        let advantageRate = standardRate;
        if (zdrOverride) advantageRate = 0;
        else if (exportOverride) advantageRate = 0.10;

        // Base
        const baseGlobal = Math.max(0, res + reintegrations - deductions);

        // Assumption: Single Basket (Simple Mode)
        const beneficeEligible = baseGlobal;
        const beneficeTaxable = 0;

        const isBeforeDeduction = (beneficeEligible * advantageRate);

        // Reinvestment
        const isPrivilegedSector = zdrOverride || sector.id === 'agri';
        const REINVESTMENT_CAP_RATE = isPrivilegedSector ? 1.0 : 0.35;
        const reinvestCap = baseGlobal * REINVESTMENT_CAP_RATE;
        const deductionAmount = Math.min(reinvest, reinvestCap, baseGlobal);
        const baseNet = baseGlobal - deductionAmount;

        let isAfterReinvest = 0;
        if (baseGlobal > 0) {
            isAfterReinvest = isBeforeDeduction * (baseNet / baseGlobal);
        }

        // Floor logic
        const isSpecialSector = ['agri', 'export', 'nouvelle_1'].includes(sector.id) || zdrOverride;
        let isDuCalc = isAfterReinvest;
        if (!isSpecialSector && reinvest > 0) {
            const floorReinvest = isBeforeDeduction * 0.20;
            isDuCalc = Math.max(isAfterReinvest, floorReinvest);
        }

        if (credit > 0) {
            isDuCalc = Math.max(0, isDuCalc - credit);
        }

        // Min Tax
        let minTaxCA = ca * sector.min_tax;
        minTaxCA = Math.max(minTaxCA, 500);

        if (isPrivilegedSector) minTaxCA = 0;

        let isFinal = isDuCalc;
        if (!isSpecialSector && minTaxCA > 0) {
            isFinal = Math.max(isDuCalc, minTaxCA);
        } else if (zdrOverride && advantageRate === 0) {
            isFinal = 0;
        }

        const cssRate = sector.css;
        let css = baseNet * cssRate;
        if (zdrOverride && advantageRate === 0) css = 0;

        return { is: isFinal, css: css, total: isFinal + css };
    };

    return runCalculation({
        sector: s, ca: caHt, res: resComptable, reinvest: montantReinvesti,
        credit: creditImpot, reintegrations, deductions, zdrOverride: isZDR, exportOverride: isExport
    });
}

function verifyIS(name, input, expected) {
    console.log(`🔹 TEST IS: ${name}`);
    const res = computeIS(input);
    let passed = true;
    if (Math.abs(res.is - expected.is) > 1) {
        console.error(`❌ FAILED IS: Expected ${expected.is}, Got ${res.is.toFixed(3)}`);
        passed = false;
    }
    if (Math.abs(res.css - expected.css) > 1) {
        console.error(`❌ FAILED CSS: Expected ${expected.css}, Got ${res.css.toFixed(3)}`);
        passed = false;
    }
    if (passed) console.log(`✅ PASSED (${res.is.toFixed(3)} | ${res.css.toFixed(3)})`);
}

// Scenarios IS
// 1. Standard (15%): Profit 100k, CA 500k (<5M)
// IS = 100k * 15% = 15,000. MinTax = 500k * 0.002 = 1,000. Final = 15,000.
// CSS = 100k * 1% = 1,000.
verifyIS("Standard 15%", { sectorId: "commun", resComptable: 100000, caHt: 500000 }, { is: 15000, css: 1000 });

// 2. High Rate (35%): Franchise, Profit 100k
// IS = 35,000. CSS (4%) = 4,000.
verifyIS("High Rate 35%", { sectorId: "telecom", resComptable: 100000, caHt: 500000 }, { is: 35000, css: 4000 });

// 3. Min Tax: Deficit -10k, CA 500k
// IS = 0 (Profit < 0). MinTax = 1000. Final = 1000. CSS = 0.
verifyIS("Min Tax (Deficit)", { sectorId: "commun", resComptable: -10000, caHt: 500000 }, { is: 1000, css: 0 });


// ==========================================
// 2. TVA - TAXE SUR LA VALEUR AJOUTÉE
// ==========================================
console.log("\n🔷 MODULE 2: TVA");

function computeTVA(input) {
    const { baseHt, collectedRate, deductible, prorata = 1 } = input;
    const collected = baseHt * collectedRate;
    const deductibleNet = deductible * prorata;
    const solde = collected - deductibleNet;
    return {
        collected,
        deductibleNet,
        payable: solde > 0 ? solde : 0,
        credit: solde < 0 ? Math.abs(solde) : 0
    };
}

function verifyTVA(name, input, expected) {
    console.log(`🔹 TEST TVA: ${name}`);
    const res = computeTVA(input);
    let passed = true;
    if (Math.abs(res.payable - expected.payable) > 0.01) {
        console.error(`❌ FAILED Payable: Expected ${expected.payable}, Got ${res.payable}`);
        passed = false;
    }
    if (Math.abs(res.credit - expected.credit) > 0.01) {
        console.error(`❌ FAILED Credit: Expected ${expected.credit}, Got ${res.credit}`);
        passed = false;
    }
    if (passed) console.log(`✅ PASSED`);
}

// Scenarios TVA
// 1. Standard: Base 1000, Rate 19%, ded 0 -> Pay 190
verifyTVA("Standard 19%", { baseHt: 1000, collectedRate: 0.19, deductible: 0 }, { payable: 190, credit: 0 });

// 2. Deductible > Collected: Base 1000, Rate 19% (190), Ded 300 -> Credit 110
verifyTVA("Credit Situation", { baseHt: 1000, collectedRate: 0.19, deductible: 300 }, { payable: 0, credit: 110 });

// 3. Prorata: Base 1000, Rate 19% (190), Ded 300, Prorata 50% -> DedNet 150 -> Pay 40
verifyTVA("Prorata 50%", { baseHt: 1000, collectedRate: 0.19, deductible: 300, prorata: 0.5 }, { payable: 40, credit: 0 });


// ==========================================
// 3. RS - RETENUE À LA SOURCE
// ==========================================
console.log("\n🔷 MODULE 3: RS");

const RS_RATES = [
    { id: 'rs_is_1', rate: 0.01, type: 'is_irpp', base: 'HT' },
    { id: 'rs_tva_25', rate: 0.25, type: 'tva', base: 'TVA' }
];

function computeRS(input) {
    const { amount, rsId, tvaRate = 0 } = input;
    const rule = RS_RATES.find(r => r.id === rsId);

    let rsVal = 0;
    if (rule.type === 'is_irpp') {
        rsVal = amount * rule.rate; // Base HT
    } else if (rule.type === 'tva') {
        const tvaVal = amount * tvaRate;
        rsVal = tvaVal * rule.rate;
    }
    return rsVal;
}

function verifyRS(name, input, expectedRs) {
    console.log(`🔹 TEST RS: ${name}`);
    const valid = computeRS(input);
    if (Math.abs(valid - expectedRs) < 0.01) {
        console.log(`✅ PASSED`);
    } else {
        console.error(`❌ FAILED: Expected ${expectedRs}, Got ${valid}`);
    }
}

// Scenarios RS
// 1. Market Deal > 1000 DT (1% RS): HT 2000 -> RS 20
verifyRS("Market Deal 1%", { amount: 2000, rsId: 'rs_is_1' }, 20);

// 2. RS TVA 25%: HT 1000, TVA 19% (190) -> RS 25% of 190 = 47.5
verifyRS("RS TVA 25%", { amount: 1000, rsId: 'rs_tva_25', tvaRate: 0.19 }, 47.5);

console.log("\n🏁 GLOBAL VERIFICATION COMPLETE");
