
/**
 * Verification Script for IRPP Core Logic (LF 2026)
 * Extracted from irpp.js for standalone testing.
 */

// ==========================================
// 1. EXTRACTED LOGIC (Mocking Browser Context)
// ==========================================

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

    // 1. CNSS Calculation
    let cnss = 0;
    if (typeRevenu === 'salarie' && applyCNSS) {
        const tauxCNSS = (secteur === 'public') ? 0.102 : 0.0918;
        cnss = grossIncome * tauxCNSS;
    }

    // 2. Abatements
    let revenuApresCnss = grossIncome - cnss;
    let abattement = 0;

    if (typeRevenu === 'retraite') {
        abattement = revenuApresCnss * 0.25;
    } else {
        abattement = Math.min(revenuApresCnss * 0.10, 2000);
    }

    let netApresAbattement = revenuApresCnss - abattement;

    // 3. Deductions
    let familyDeductions = 0;
    if (chefFamille) familyDeductions += 300;

    // Child deductions (Correction Request: 100 DT per child, max 4)
    let childDeductions = 0;
    if (nbEnfants > 0) {
        const countableChildren = Math.min(nbEnfants, 4);
        childDeductions = countableChildren * 100;
    }
    familyDeductions += childDeductions;

    familyDeductions += nbEtudiants * 1000;
    familyDeductions += nbInfirmes * 2000;
    familyDeductions += nbParents * 450;

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

    const brackets = brackets2026;

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
                rate: bracket.rate,
                base: taxableInThisBracket,
                tax: taxForBracket
            });
        }
    });

    // 6. CSS
    let cssSolidaire = 0;
    if (assietteSoumise > 0) {
        cssSolidaire = assietteSoumise * 0.005;
    }

    const totalRetenue = impotTotal + cssSolidaire;
    const netMensuel = (grossIncome - cnss - totalRetenue) / 12;

    return {
        grossIncome,
        cnss,
        abattement,
        netApresAbattement,
        totalDeductions,
        assietteSoumise,
        irpp: impotTotal,
        css: cssSolidaire,
        totalRetenue,
        netMensuel,
        childDeductions // Added for visibility in test
    };
}

// ==========================================
// 2. TEST ORCHESTRATOR
// ==========================================

function runTest(name, input, expectedChecks) {
    console.log(`\n🔹 TESTING: ${name}`);
    const result = calculateIRPPCore(input);
    let passed = true;

    for (const [key, expectedVal] of Object.entries(expectedChecks)) {
        // Handle floating point comparison
        const actualVal = result[key];
        const diff = Math.abs(actualVal - expectedVal);

        if (diff > 0.01) { // 1 centime tolerance
            console.error(`❌ FAILED: ${key} -> Expected ${expectedVal}, Got ${actualVal.toFixed(3)}`);
            passed = false;
        } else {
            console.log(`✅ PASSED: ${key} = ${actualVal.toFixed(3)}`);
        }
    }
    return passed;
}

// ==========================================
// 3. SCENARIOS
// ==========================================

console.log("🚀 STARTING FISCAL SIMULATOR VERIFICATION SUITE");

// SCENARIO 1: Simple Employee (30k)
// 30,000 Gross
// CNSS (9.18%) = 2754
// Brut Imposable = 27246
// Abattement 10% (max 2000) = 2000
// Base = 25246
// IRPP:
// 0-5000 (0%) = 0
// 5000-10000 (15%) = 750
// 10000-20000 (25%) = 2500
// 20000-25246 (30%) = 5246 * 0.3 = 1573.8
// Total IRPP = 4823.800
// CSS = 25246 * 0.005 = 126.230
runTest("Scenario 1: Single Employee 30k",
    { grossIncome: 30000, nbEnfants: 0, chefFamille: false },
    {
        cnss: 2754.000,
        abattement: 2000.000,
        assietteSoumise: 25246.000,
        irpp: 4823.800,
        css: 126.230
    }
);

// SCENARIO 2: Married + 3 Children (30k)
// Base (from above) = 25246
// Deductions:
// Chef Famille = 300
// Children (3 * 100) = 300
// Total Deductions = 600
// New Base = 24646
// IRPP:
// 0-5000 (0%) = 0
// 5000-10000 (15%) = 750
// 10000-20000 (25%) = 2500
// 20000-24646 (30%) = 4646 * 0.3 = 1393.8
// Total IRPP = 4643.800
runTest("Scenario 2: Married + 3 Children (30k)",
    { grossIncome: 30000, nbEnfants: 3, chefFamille: true },
    {
        totalDeductions: 600.000,
        assietteSoumise: 24646.000,
        irpp: 4643.800
    }
);

// SCENARIO 3: Max Children Cap (5 Children)
// Should only count 4 (4 * 100 = 400)
// Base (from Scenario 1) = 25246
// Deductions = 300 (Chef) + 400 (Kids) = 700
// New Base = 24546
// IRPP = 750 + 2500 + (4546 * 0.3) = 3250 + 1363.8 = 4613.8
runTest("Scenario 3: 5 Children Cap (30k)",
    { grossIncome: 30000, nbEnfants: 5, chefFamille: true },
    {
        childDeductions: 400.000, // Explicit check of the cap
        totalDeductions: 700.000,
        irpp: 4613.800
    }
);

// SCENARIO 4: Student + Handicapped
// 1 Student (1000), 1 Handicapped (2000)
// Base (Scenario 1) = 25246
// Deductions = 300 (Chef) + 0 (Kids count if needed, let's assume included in others or separate)
// Let's say 2 children total: 1 student, 1 handicapped.
// The code logic adds student/handicapped ON TOP of the basic count if they are inputs.
// User inputs: nbEnfants=2, nbEtudiants=1, nbInfirmes=1
// Deductions:
// Chef: 300
// Basic 2 kids: 2 * 100 = 200
// Student Bonus: 1 * 1000 = 1000
// Handicapped Bonus: 1 * 2000 = 2000
// Total = 3500
// New Base = 21746
// IRPP = 750 + 2500 + (1746 * 0.3) = 3250 + 523.8 = 3773.8
runTest("Scenario 4: Student & Handicapped (30k)",
    { grossIncome: 30000, nbEnfants: 2, chefFamille: true, nbEtudiants: 1, nbInfirmes: 1 },
    {
        childDeductions: 200.000,
        totalDeductions: 3500.000,
        irpp: 3773.800
    }
);

console.log("\n🏁 VERIFICATION COMPLETE");
