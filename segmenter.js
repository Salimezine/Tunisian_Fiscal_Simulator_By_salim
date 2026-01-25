const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');

// Try basic parsing of the whole file
try {
    eval(code);
    console.log("✅ Main file is valid (Wait, then why did validate_syntax fail?)");
} catch (e) {
    console.log("❌ Main file failed:", e.message);
}

// Find lines that start a block
const lines = code.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('": {')) {
        console.log(`Potential block start at ${idx + 1}: ${line}`);
    }
});
