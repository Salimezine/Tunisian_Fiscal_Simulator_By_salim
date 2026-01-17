/**
 * Example Usage Demonstration
 * 
 * This file demonstrates how to use the core audit system infrastructure
 * for audit-ready fiscal calculations.
 */

// Example 1: Initialize Calculation Context
console.log('=== Example 1: Initialize Calculation Context ===');

// User must select mode and Finance Law version before any calculation
calculationContext.initialize('audit', '2026');
// or
// calculationContext.initialize('simulation', '2026');

console.log('Context Summary:', calculationContext.getContextSummary());

// Example 2: Validate Inputs with Rule Engine
console.log('\n=== Example 2: Validate Inputs with Rule Engine ===');

// Initialize rule engine with legal database
const ruleEngine = new RuleEngine(LegalReferenceDatabase);

// Example: Valid IRPP inputs
const validInputs = {
    calculationType: 'irpp',
    grossIncome: 50000,
    totalDeductions: 5000,
    isRetirement: false,
    applyCNSS: true
};

const validation1 = ruleEngine.validateWithMode(
    validInputs,
    null,
    calculationContext.getContextSummary(),
    'audit'
);

console.log('Validation Result (Valid):', validation1);

// Example: Invalid IRPP inputs (CNSS + Retirement)
const invalidInputs = {
    calculationType: 'irpp',
    grossIncome: 50000,
    totalDeductions: 5000,
    isRetirement: true, // Retirement
    applyCNSS: true // Incompatible!
};

const validation2 = ruleEngine.validateWithMode(
    invalidInputs,
    null,
    calculationContext.getContextSummary(),
    'audit'
);

console.log('Validation Result (Invalid):', validation2);

// Example 3: Create Audit Log
console.log('\n=== Example 3: Create Audit Log ===');

const calculationSteps = [
    {
        description: 'Revenu brut annuel',
        value: 50000,
        legalReference: {
            article: 'Article 40 du Code IRPP',
            url: 'https://www.legislation.tn/detailtexte/CodeIRPPIS',
            description: 'Détermination du revenu imposable'
        }
    },
    {
        description: 'Déduction CNSS (9.25%)',
        value: -4625,
        legalReference: {
            article: 'Code de Sécurité Sociale',
            url: 'http://www.cnss.tn',
            description: 'Cotisations sociales CNSS'
        }
    },
    {
        description: 'Revenu net imposable',
        value: 45375,
        legalReference: null
    },
    {
        description: 'IRPP calculé (barème progressif 2026)',
        value: 8500,
        legalReference: {
            article: 'Article 44 du Code IRPP',
            url: 'https://www.legislation.tn/detailtexte/CodeIRPPIS',
            description: 'Barème progressif à 8 tranches'
        }
    }
];

const result = {
    irpp: 8500,
    css: 454, // 1% of net income
    totalTax: 8954,
    netIncome: 36421
};

const auditLog = auditTrail.createLog(
    'irpp',
    validInputs,
    calculationSteps,
    result,
    calculationContext.getContextSummary(),
    validation1
);

console.log('Audit Log Created:', auditLog.id);
console.log('Log Hash:', auditLog.hash);

// Example 4: Export Audit Log
console.log('\n=== Example 4: Export Audit Log ===');

// Export to JSON
const jsonExport = auditTrail.exportLogToJSON(auditLog.id);
console.log('JSON Export:', jsonExport);

// Export to CSV
const csvExport = auditTrail.exportLogToCSV(auditLog.id);
console.log('CSV Export (first 200 chars):', csvExport.content.substring(0, 200));

// Example 5: Verify Log Integrity
console.log('\n=== Example 5: Verify Log Integrity ===');

const integrity = auditTrail.verifyLogIntegrity(auditLog.id);
console.log('Integrity Check:', integrity);

// Example 6: Get Legal References for IRPP 2026
console.log('\n=== Example 6: Get Legal References for IRPP 2026 ===');

const irppBrackets2026 = LegalReferenceDatabase.irpp.brackets['2026'];
console.log('IRPP 2026 Brackets:', irppBrackets2026);

const studentDeduction = LegalReferenceDatabase.irpp.deductions.student;
console.log('Student Deduction:', studentDeduction);

// Example 7: Mode Manager Features
console.log('\n=== Example 7: Mode Manager Features ===');

const auditModeConfig = modeManager.getModeConfig('audit');
console.log('Audit Mode Config:', auditModeConfig);

const simulationModeConfig = modeManager.getModeConfig('simulation');
console.log('Simulation Mode Config:', simulationModeConfig);

console.log('\nCan use approximations in Audit mode?', modeManager.canUseApproximations('audit'));
console.log('Can use approximations in Simulation mode?', modeManager.canUseApproximations('simulation'));

// Example 8: Get Audit Trail Statistics
console.log('\n=== Example 8: Get Audit Trail Statistics ===');

const stats = auditTrail.getStatistics();
console.log('Audit Trail Statistics:', stats);

// Example 9: Format Validation Messages for Display
console.log('\n=== Example 9: Format Validation Messages for Display ===');

if (validation2.errors.length > 0) {
    const formatted = ruleEngine.formatValidationResult(validation2);
    console.log('Formatted Validation Messages:', formatted);

    // Generate HTML for first error
    const errorHTML = ruleEngine.createValidationMessageHTML(formatted.messages[0]);
    console.log('Error HTML (first 300 chars):', errorHTML.substring(0, 300));
}

// Example 10: Change Finance Law Version
console.log('\n=== Example 10: Change Finance Law Version ===');

console.log('Current version:', calculationContext.getFinanceLawVersion());

// Switch to 2025
calculationContext.changeFinanceLawVersion('2025');
console.log('New version:', calculationContext.getFinanceLawVersion());

// Get 2025 brackets
const irppBrackets2025 = LegalReferenceDatabase.irpp.brackets['2025'];
console.log('IRPP 2025 Brackets (5 tranches):', irppBrackets2025.tranches.length, 'brackets');
console.log('IRPP 2026 Brackets (8 tranches):', irppBrackets2026.tranches.length, 'brackets');

console.log('\n=== Demonstration Complete ===');
console.log('✅ Core audit infrastructure is ready for integration with IRPP, IS, TVA, RS, and ISF modules');
