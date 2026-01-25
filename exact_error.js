const fs = require('fs');
const code = fs.readFileSync('i18n-data.js', 'utf8');

try {
    eval(code);
    console.log("✅ Still valid in eval? Wait.");
} catch (e) {
    console.log("Error message:", e.message);
    // Find where eval failed
    // We can try to parse chunks
    const lines = code.split('\n');
    let accumulated = '';
    for (let i = 0; i < lines.length; i++) {
        accumulated += lines[i] + '\n';
        try {
            // Check if parsing this chunk (wrapped in { ... }) works?
            // Tricky with global assignments.
        } catch (err) { }
    }
}

// Aggressive approach: use a regex to find missing commas or double quotes
const lines = code.split('\n');
lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('"') && !trimmed.endsWith(',') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.endsWith('[') && !trimmed.endsWith(']')) {
        // If next line starts with a quote, this line is suspicious
        let nextLine = '';
        for (let j = idx + 1; j < lines.length; j++) {
            if (lines[j].trim()) {
                nextLine = lines[j].trim();
                break;
            }
        }
        if (nextLine.startsWith('"')) {
            console.log(`SUSPICIOUS line ${idx + 1}: ${line}`);
            console.log(`FOLLOWED BY: ${nextLine}`);
        }
    }
});
