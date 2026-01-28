const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');
const lines = code.split('\n');

// This script will try to parse the file and find where it breaks.
// Since it's a large object, we'll look for lines that look like "key": "value" 
// and check if they are missing a comma if followed by another key.

for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    // Simple check: line ends with " and next line starts with "
    if (line.endsWith('"') && nextLine.startsWith('"')) {
        console.log(`Potential missing comma at line ${i + 1}:`);
        console.log(`Line ${i + 1}: ${lines[i]}`);
        console.log(`Line ${i + 2}: ${lines[i + 1]}`);
    }
}
