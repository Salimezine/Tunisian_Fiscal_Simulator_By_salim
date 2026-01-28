const fs = require('fs');
const path = require('path');

// Mock DOM for irpp.js
const documentMock = {
    getElementById: () => ({ value: '0', checked: false, addEventListener: () => { } }),
    querySelectorAll: () => [],
};
global.document = documentMock;
global.window = {
    setYear: () => { },
    I18N_DATA: {},
    shareWithAI: () => { }
};

// Load irpp.js content manually since it's not a module
const irppPath = path.join(__dirname, '../irpp.js');
const irppContent = fs.readFileSync(irppPath, 'utf8');
eval(irppContent);

function runTests() {
    console.log("=== VERIFICATION IRPP LF 2026 (8 TRANCHES) ===");
    let allPassed = true;

    // --- TEST 1: CNSS Rate Check (9.68%) ---
    console.log("\n[TEST 1] CNSS Rate Check (Standard Private Sector)");
    const input1 = {
        grossIncome: 10000, // 10k annual
        typeRevenu: 'salarie',
        secteur: 'prive',
        applyCNSS: true,
        nbEnfants: 0
    };
    const result1 = calculateIRPPCore(input1, '2026');
    const expectedCnss = 10000 * 0.0968;

    if (Math.abs(result1.cnss - expectedCnss) < 0.001) {
        console.log(`✅ CNSS Correct: ${result1.cnss.toFixed(3)} (Expected: ${expectedCnss.toFixed(3)})`);
    } else {
        console.error(`❌ CNSS Failed: Got ${result1.cnss.toFixed(3)}, Expected ${expectedCnss.toFixed(3)}`);
        allPassed = false;
    }

    // --- TEST 2: Family Tax Credits (Chef + 2 Kids) ---
    // Should deduct 300 (Chef) + 600 (2 * 300) = 900 DT from IRPP DUE
    console.log("\n[TEST 2] Family Tax Credits (Chef + 2 Kids)");

    // Use a high income to ensure there is enough tax to deduct credits from
    const gross2 = 30000;
    const input2_base = {
        grossIncome: gross2,
        typeRevenu: 'salarie',
        secteur: 'prive',
        applyCNSS: true,
        chefFamille: false,
        nbEnfants: 0
    };
    const resBase = calculateIRPPCore(input2_base, '2026');

    const input2_credits = {
        ...input2_base,
        chefFamille: true,
        nbEnfants: 2
    };
    const resCredits = calculateIRPPCore(input2_credits, '2026');

    // Expected logic:
    // Base Tax (IRPP Brut) should be identical (since credits are AFTER tax)
    // Net Tax should be Base Tax - 900

    if (Math.abs(resBase.irppBrut - resCredits.irppBrut) < 0.001) {
        console.log(`✅ Tax Base Unaffected by Credits: ${resBase.irppBrut.toFixed(3)}`);
    } else {
        console.error(`❌ Tax Base Changed! Credits might be applied as deductions! Base: ${resBase.irppBrut}, Credits: ${resCredits.irppBrut}`);
        allPassed = false;
    }

    const expectedCredit = 300 + (2 * 300); // 900
    const actualCredit = resBase.irppNet - resCredits.irppNet;

    // Note: irppNet might hit 0, so ensure we have enough tax
    if (resBase.irppNet > 900) {
        if (Math.abs(actualCredit - expectedCredit) < 0.001) {
            console.log(`✅ Tax Credit Applied Correctly: -${actualCredit.toFixed(3)} DT (Expected -900.000)`);
        } else {
            console.error(`❌ Tax Credit Error: Diff is ${actualCredit.toFixed(3)}, Expected ${expectedCredit.toFixed(3)}`);
            allPassed = false;
        }
    } else {
        console.warn("⚠️ Warning: Not enough base tax to fully test credit deduction magnitude.");
    }

    // --- TEST 3: Max 4 Children ---
    console.log("\n[TEST 3] Max 4 Children Rule (5 Children Input)");
    const input3 = {
        grossIncome: 40000,
        typeRevenu: 'salarie',
        secteur: 'prive',
        applyCNSS: true,
        nbEnfants: 5 // Should cap at 4
    };
    const res3 = calculateIRPPCore(input3, '2026');
    // Credit should be 4 * 300 = 1200
    if (res3.creditEnfants === 1200) {
        console.log(`✅ Max 4 Children Cap Correct: Credit is ${res3.creditEnfants} DT`);
    } else {
        console.error(`❌ Max 4 Children Cap Failed: Got ${res3.creditEnfants} DT, Expected 1200 DT`);
        allPassed = false;
    }

    // --- TEST 4: 8-Tranche Scale Check ---
    console.log("\n[TEST 4] 8-Tranche Scale Check");
    // 0-5000: 0%
    // 5000-10000: 15%
    // 10000-20000: 25%
    // Let's test income of 15,000 (after abatements/deductions)
    // Taxable = 15,000
    // Tax = (5000 * 0) + (5000 * 0.15) + (5000 * 0.25)
    //     = 0 + 750 + 1250 = 2000

    // We need to reverse-engineer an input that gives exactly 15,000 taxable base.
    // Simplest: No CNSS, No Abatement (e.g. specialized input or just checking logic function directly if possible, but here we use main function)
    const input4 = {
        grossIncome: 20000,
        typeRevenu: 'retraite',
        chefFamille: false,
        nbEnfants: 0
    };
    // Note: Retraite abatement in this code is 25% on net. No CNSS.
    // Base = 20000. Abatement = 5000. Taxable = 15000.

    const res4 = calculateIRPPCore(input4, '2026');
    const expectedTax4 = (5000 * 0.15) + (5000 * 0.25); // 2000

    if (Math.abs(res4.irppBrut - expectedTax4) < 1) {
        console.log(`✅ 8-Tranche Scale Correct: Tax is ${res4.irppBrut} DT (Expected ~2000)`);
    } else {
        console.error(`❌ 8-Tranche Scale Failed: Got ${res4.irppBrut}, Expected ${expectedTax4}`);
        // If it was 5-tranche (2025 scale):
        // 0-5000: 0%
        // 5000-20000: 26%
        // Tax = 10000 * 0.26 = 2600
        console.error(`   (Note: 5-Tranche 2025 tax would be ~2600 DT)`);
        allPassed = false;
    }


    // --- TEST 5: Parents & Students as Tax Credits Check ---
    console.log("\n[TEST 5] Parents & Students as Tax Credits Check");
    // Setup: Salary with potential tax
    const input5_base = {
        grossIncome: 30000,
        typeRevenu: 'salarie',
        applyCNSS: true,
        chefFamille: false,
        nbEnfants: 0,
        nbParents: 0,
        nbEtudiants: 0
    };
    const resBase5 = calculateIRPPCore(input5_base, '2026');

    // Add 1 Parent (450 DT Credit) and 1 Student (1000 DT Credit)
    const input5_credits = {
        ...input5_base,
        nbParents: 1,
        nbEtudiants: 1
    };
    const resCredits5 = calculateIRPPCore(input5_credits, '2026');

    // 1. Check Taxable Base is UNCHANGED
    if (Math.abs(resBase5.assietteSoumise - resCredits5.assietteSoumise) < 0.001) {
        console.log(`✅ Taxable Base Unchanged: ${resBase5.assietteSoumise.toFixed(3)} DT`);
    } else {
        console.error(`❌ Taxable Base Changed! Credits are wrongly applied as deductions. Diff: ${resBase5.assietteSoumise - resCredits5.assietteSoumise}`);
        allPassed = false;
    }

    // 2. Check Tax Reduction = 1450 DT
    const taxDiff = resBase5.irppNet - resCredits5.irppNet;
    const expectedDiff = 450 + 1000;

    // Note: irppNet might be 0 if credits > tax. Check max limit.
    // Base Tax ~ 30k income -> ~4500 tax. So 1450 should be fully deductible.
    if (Math.abs(taxDiff - expectedDiff) < 0.001) {
        console.log(`✅ Tax Credits Applied Correctly: -${taxDiff.toFixed(3)} DT (Expected -1450.000)`);
    } else {
        console.error(`❌ Tax Credit Error: Got reduction of ${taxDiff.toFixed(3)}, Expected ${expectedDiff.toFixed(3)}`);
        allPassed = false;
    }

    console.log("\n=============================");
    if (allPassed) {
        console.log("✅ ALL TESTS PASSED");
    } else {
        console.error("❌ SOME TESTS FAILED");
        process.exit(1);
    }
}

runTests();
