import re

with open('i18n-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('"') and stripped.endswith('"'):
        # Property line missing comma?
        # Check next non-empty line
        found_next = False
        for j in range(i + 1, len(lines)):
            next_stripped = lines[j].strip()
            if not next_stripped: continue
            if next_stripped.startswith('"'):
                # Yes, next line is a property, so this one NEEDS a comma
                line = line.rstrip('\n\r') + ',\n'
                break
            if next_stripped.startswith('}') or next_stripped.startswith('//'):
                # Next line closes or is comment, comma optional but safer to NOT add if it's the very last
                break
            break
    new_lines.append(line)

with open('i18n-data.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
