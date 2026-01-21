const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'autaux.json');
const LEGAL_REFS_PATH = path.join(__dirname, '..', 'legal-references.js');

function verifyUpdates() {
    console.log("=== Verification of Auto-Entrepreneur Rates Updates ===\n");

    // 1. Verify JSON file existence and structure
    if (!fs.existsSync(DATA_PATH)) {
        console.error("❌ ERROR: data/autaux.json not found!");
        return;
    }

    try {
        const rawBody = fs.readFileSync(DATA_PATH, 'utf8');
        const data = JSON.parse(rawBody);
        console.log("✅ JSON Structure: Valid");
        console.log(`📌 Version: ${data.version}`);
        console.log(`📌 Last Updated: ${data.last_updated}`);

        const ae = data.auto_entrepreneur;
        if (ae && ae.rates && ae.thresholds) {
            console.log("✅ Rates & Thresholds: Present");
            console.log(`   - Income Tax: ${ae.rates.income_tax * 100}%`);
            console.log(`   - Social Security: ${ae.rates.social_security * 100}%`);
            console.log(`   - Max Turnover: ${ae.thresholds.max_turnover_services} DT`);
        } else {
            console.error("❌ ERROR: Missing required fields in JSON.");
        }
    } catch (err) {
        console.error(`❌ ERROR: Failed to parse JSON: ${err.message}`);
    }

    // 2. Verify link in legal-references.js
    if (!fs.existsSync(LEGAL_REFS_PATH)) {
        console.error("❌ ERROR: legal-references.js not found!");
    } else {
        const legalRefs = fs.readFileSync(LEGAL_REFS_PATH, 'utf8');
        if (legalRefs.includes('autoEntrepreneur:') && legalRefs.includes('data/autaux.json')) {
            console.log("✅ Legal References: Correctly updated and linked to JSON");
        } else {
            console.error("❌ ERROR: legal-references.js does not contain autoEntrepreneur reference or link.");
        }
    }

    console.log("\n=== End of Verification ===");
}

verifyUpdates();
