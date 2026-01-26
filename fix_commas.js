const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');
const lines = code.split('\n');

const newLines = lines.map((line, i) => {
    let stripped = line.trim();
    // If it's a property line like "key": "value"
    if (stripped.startsWith('"') && stripped.endsWith('"')) {
        // Look ahead for next non-empty line
        for (let j = i + 1; j < lines.length; j++) {
            let nextStripped = lines[j].trim();
            if (!nextStripped) continue;
            // If next line starts with another key, THIS line needs a comma
            if (nextStripped.startsWith('"')) {
                return line.replace(/\s+$/, '') + ',';
            }
            break;
        }
    }
    return line;
});

fs.writeFileSync('i18n-data.js', newLines.join('\n'));
console.log("🛠️ Repaired commas");
