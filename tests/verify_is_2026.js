const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load is.js
const isJsPath = path.join(__dirname, '../is.js');
const isJsContent = fs.readFileSync(isJsPath, 'utf8');

// Mock Browser Environment in Sandbox
const sandbox = {
    window: {
        FiscalLogic: {},
        I18N_DATA: {
            'fr': {
                'sect_agri': 'Agriculture',
                'sect_common': 'Commerce & Industrie',
                'sect_bank': 'Banques',
                'sect_retail_large': 'Grande Distribution'
            }
        },
        localStorage: {
            getItem: () => 'fr'
        }
    },
    document: {
        getElementById: () => null
    },
    console: console // Pass console to see internal logs if any
};

vm.createContext(sandbox);

try {
    vm.runInContext(isJsContent, sandbox);
} catch (e) {
    console.error("❌ Error executing is.js in sandbox:", e);
    process.exit(1);
}

const computeIS = sandbox.window.FiscalLogic.computeIS;

if (typeof computeIS !== 'function') {
    console.error("❌ Fatal: computeIS not found in sandbox.window.FiscalLogic");
    process.exit(1);
}

// Test Helper
function runTest(name, inputs, expected) {
    console.log(`\n--- Testing: ${name} ---`);
    let result;
    try {
        result = computeIS(inputs);
    } catch (e) {
        console.error(`❌ Crash in computeIS: ${e.message}`);
        return false;
    }

    if (!result || !result.optimized) {
        console.error("FAILED: No result returned");
        return false;
    }

    const opt = result.optimized;
    let passed = true;

    // Check Total IS
    if (expected.is !== undefined) {
        if (Math.abs(opt.is - expected.is) > 1.0) { // 1 DT tolerance
            console.error(`❌ IS Mismatch: Expected ${expected.is}, Got ${opt.is.toFixed(2)}`);
            passed = false;
        } else {
            console.log(`✅ IS Correct: ${opt.is.toFixed(2)}`);
        }
    }

    // Check CSS
    if (expected.css !== undefined) {
        if (Math.abs(opt.css - expected.css) > 1.0) {
            console.error(`❌ CSS Mismatch: Expected ${expected.css}, Got ${opt.css.toFixed(2)}`);
            passed = false;
        } else {
            console.log(`✅ CSS Correct: ${opt.css.toFixed(2)}`);
        }
    }

    // Check Min Tax
    if (expected.minTax !== undefined) {
        if (Math.abs(opt.minTaxCA - expected.minTax) > 1.0) {
            console.error(`❌ MinTax Mismatch: Expected ${expected.minTax}, Got ${opt.minTaxCA.toFixed(2)}`);
            passed = false;
        } else {
            console.log(`✅ MinTax Correct: ${opt.minTaxCA.toFixed(2)}`);
        }
    }

    // Check Rate (Optional)
    if (expected.rate !== undefined) {
        if (Math.abs(opt.appliedRate - expected.rate) > 0.001) {
            console.error(`❌ Rate Mismatch: Expected ${expected.rate}, Got ${opt.appliedRate}`);
            passed = false;
        } else {
            console.log(`✅ Rate Correct: ${opt.appliedRate}`);
        }
    }

    return passed;
}

// ==========================================
// TEST CASES BASSED ON "COURS COMPLET IS 2026"
// ==========================================

let allPassed = true;

// 1. STANDARD CASE (15%)
allPassed &= runTest("Standard IS 15%", {
    sectorId: "commerce",
    resComptable: 100000,
    caHt: 500000
}, {
    is: 15000,
    css: 3000,
    minTax: 1190 // 500k * 1.19 * 0.2% = 1190
});

// 2a. ZDR Group 1 (5 Years) - Exempt Total for 5 years
allPassed &= runTest("ZDR Group 1 - Year 5 (Exempt)", {
    sectorId: "industrie",
    resComptable: 100000,
    caHt: 500000,
    isZDR: true,
    zdrGroup: 1,
    anciennete: 5
}, {
    is: 0,
    css: 0
});

// 2b. ZDR Group 1 (5 Years) - 10% after 5 years
allPassed &= runTest("ZDR Group 1 - Year 6 (10%)", {
    sectorId: "industrie",
    resComptable: 100000,
    caHt: 500000,
    isZDR: true,
    zdrGroup: 1,
    anciennete: 6
}, {
    is: 10000,
    css: 100, // 0.1% Profit (ZDR specific)
    minTax: 300
});

// 2c. ZDR Group 2 (10 Years) - Exempt Total for 10 years
allPassed &= runTest("ZDR Group 2 - Year 10 (Exempt)", {
    sectorId: "industrie",
    resComptable: 100000,
    caHt: 500000,
    isZDR: true,
    zdrGroup: 2,
    anciennete: 10
}, {
    is: 0,
    css: 0
});

// 3. ZDR (> 10 Years)
// IS: 10% = 10,000
// CSS: 0.1% Profit => 100 DT (Fixed Logic)
// Min Tax: 0.1% CA TTC (max 300) => 300 DT
allPassed &= runTest("ZDR After 10y", {
    sectorId: "industrie",
    resComptable: 100000,
    caHt: 500000,
    isZDR: true,
    anciennete: 11
}, {
    is: 10000,
    css: 100,
    minTax: 300
});

// 4. ETE (0-10 Years) - Exempt Total
allPassed &= runTest("ETE First 10y", {
    sectorId: "export",
    resComptable: 100000,
    caHt: 500000,
    isExport: true,
    anciennete: 5
}, {
    is: 0,
    css: 0
});

// 5. ETE (> 10 Years)
// IS: 15% on 50% profit = 7,500
// CSS: 0% (Strict Exemption - Fixed Logic)
// Min Tax: 0.2% CA TTC (Fixed Logic)
allPassed &= runTest("ETE After 10y", {
    sectorId: "export",
    resComptable: 100000,
    caHt: 500000,
    isExport: true,
    anciennete: 11
}, {
    is: 7500,
    css: 0,
    minTax: 1190
});

// 6. Grande Distribution (35%) - NEW FROM LF 2026
allPassed &= runTest("Grande Distrib (35%)", {
    sectorId: "grande_distrib",
    resComptable: 100000,
    caHt: 5000000
}, {
    is: 35000,
    css: 4000
});

// 7. IPO Advantage (20%) - NEW
allPassed &= runTest("IPO Advantage (20%)", {
    sectorId: "commerce", // Normally 25% if > 20MD? No, 15%.
    // To test IPO, we need a base rate > 20% or verify 20% replaces 15%? 
    // Course: "Taux Particulier : 20%".
    // If IS is 15%, 20% is HIGHER. So IPO only useful if IS was 35% or 25%?
    // Actually, normally IS is 15%. 20% is for those introducing to stock exchange.
    // Wait, is it an ADVANTAGE or a PENALTY?
    // Course says "Encourager l'introduction...". 
    // But standard rate is 15%. Why pay 20%?
    // Ah, before 2021 rates were higher (25%). 
    // Now, IPO rate 20% might be RELEVANT for 35% sectors?
    // "Le taux de 20% est accordé aux sociétés qui introduisent..."
    // If I am a Bank (35%), and I IPO, do I pay 20%?
    // If I am commerce (15%), do I pay 20%? NO.
    // Let's assume it applies if Standard Rate > 20%.
    sectorId: "banque", // 35%
    resComptable: 100000,
    caHt: 1000000,
    isIPO: true, // Need to add this flag
    anciennete: 2
}, {
    rate: 0.20,
    is: 20000
});

if (allPassed) {
    console.log("\n✅ ALL TESTS PASSED");
} else {
    console.error("\n❌ SOME TESTS FAILED");
    process.exit(1);
}
