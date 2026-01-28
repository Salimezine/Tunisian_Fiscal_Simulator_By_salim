const fs = require('fs');
const path = require('path');

// Mock DOM
const documentMock = {
    getElementById: (id) => {
        if (id === 'irpp-wizard') return { classList: { add: () => { }, remove: () => { } } };
        return { value: '0', checked: false, addEventListener: () => { }, scrollIntoView: () => { } };
    }
};
global.document = documentMock;
global.window = {
    t: (key) => key,
    populateIRPP: (data) => {
        console.log("✅ populateIRPP called with:", JSON.stringify(data));
        window.receivedData = data;
    },
    calculateIRPP: () => {
        console.log("✅ calculateIRPP called");
        window.calcCalled = true;
    },
    shareWithAI: () => { }
};

// Load wizard.js
const wizardPath = path.join(__dirname, '../wizard.js');
const wizardContent = fs.readFileSync(wizardPath, 'utf8');
eval(wizardContent);

console.log("=== VERIFYING WIZARD DATA FLOW ===");

// 1. Initialize
const wizard = global.window.irppWizard;
console.log("Wizard initialized");

// 2. Simulate entering data (using oninput pattern)
wizard.setData('salaireBrut', '36000', true); // Silent update as programmed
wizard.setData('enfants', '2', true);
wizard.setData('situation', 'marie'); // Non-silent (renders)

console.log("Data set in wizard:", JSON.stringify(wizard.data));

// 3. Simulate Finish
wizard.finish();

// 4. Verify results
if (window.receivedData && window.receivedData.salaireBrut === '36000' && window.receivedData.enfants === '2') {
    console.log("✅ SUCCESS: Data correctly passed to IRPP module");
} else {
    console.error("❌ FAILURE: Data mismatch in IRPP module");
    console.error("Received:", JSON.stringify(window.receivedData));
    process.exit(1);
}

if (window.calcCalled) {
    console.log("✅ SUCCESS: Calculation triggered automatically");
} else {
    console.error("❌ FAILURE: Calculation NOT triggered");
    process.exit(1);
}

console.log("=== ALL WIZARD FLOW TESTS PASSED ===");
