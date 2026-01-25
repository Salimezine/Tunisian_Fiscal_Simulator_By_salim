const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');
const lines = code.split('\n');

// Filter out lines containing tej_
const newLines = lines.filter(line => !line.includes('"tej_'));

// Now we need to fix commas. 
// A line ending with a property needs a comma if the next property exists.
const cleanedLines = newLines.map((line, i) => {
    let stripped = line.trim();
    if (stripped.startsWith('"') && stripped.endsWith('"')) {
        // Find next property
        for (let j = i + 1; j < newLines.length; j++) {
            let nextStripped = newLines[j].trim();
            if (!nextStripped) continue;
            if (nextStripped.startsWith('"')) {
                return line.replace(/\s+$/, '') + ',';
            }
            break;
        }
    }
    // Also handle trailing commas before closing braces if any (JSON-like)
    if (stripped.endsWith('",')) {
        // Find next significant line
        for (let j = i + 1; j < newLines.length; j++) {
            let nextStripped = newLines[j].trim();
            if (!nextStripped) continue;
            if (nextStripped.startsWith('}')) {
                // Last item in object, remove comma for strictness? 
                // JS allows it, but sometimes better to remove.
                return line.replace(/,(\s*)$/, '$1');
            }
            break;
        }
    }
    return line;
});

fs.writeFileSync('i18n-data.js', cleanedLines.join('\n'));
console.log("🔥 Purged TEJ keys and repaired commas");
