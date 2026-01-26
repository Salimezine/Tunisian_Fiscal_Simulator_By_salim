const fs = require('fs');
const path = require('path');
const file = process.argv[2];
try {
    const code = fs.readFileSync(file, 'utf8');
    // Simple way to check syntax in Node
    new Function(code);
    console.log("✅ Syntax VALID");
} catch (e) {
    console.error("❌ Syntax ERROR:");
    console.error(e.message);
    // Find approximate line number from stack trace if possible
    if (e.stack) {
        console.error(e.stack.split('\n')[0]);
    }
}
