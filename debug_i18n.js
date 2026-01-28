const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');
const lines = code.split('\n');
let currentCode = '';
for (let i = 0; i < lines.length; i++) {
    currentCode += lines[i] + '\n';
    try {
        new Function(currentCode + '}'); // Try to close it roughly? No.
    } catch (e) {
        // This is tricky for objects.
    }
}
// Better way: use acorn or similar? Not available.
// Just try to parse the whole thing and catch the error.
try {
    eval(code);
} catch (e) {
    console.log(e.message);
    console.log(e.stack);
}
