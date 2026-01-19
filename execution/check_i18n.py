
import json
import re

def extract_keys_from_js(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find the I18N_DATA object
    # This is a bit fragile but should work for the current file structure
    match = re.search(r'window\.I18N_DATA\s*=\s*({.*?});', content, re.DOTALL)
    if not match:
        match = re.search(r'const I18N_DATA\s*=\s*({.*?});', content, re.DOTALL)
    
    if match:
        data_str = match.group(1)
        # Convert JS object-like string to JSON by adding quotes to keys if missing
        # This is very simplified and might fail on complex JS objects
        # Instead, let's try a more robust approach if needed
        import collections
        
        # Actually, let's just use string parsing to get keys per language block
        languages = {}
        current_lang = None
        
        lines = content.split('\n')
        for line in lines:
            lang_match = re.search(r'"(fr|tn|ar)":\s*{', line)
            if lang_match:
                current_lang = lang_match.group(1)
                languages[current_lang] = set()
                continue
            
            if current_lang:
                key_match = re.search(r'"([^"]+)":', line)
                if key_match:
                    languages[current_lang].add(key_match.group(1))
                
                if '},' in line or '}' in line and current_lang and not '"' in line:
                    # End of lang block?
                    # This is also a bit loose
                    pass
        return languages
    return {}

def main():
    with open('.tmp_keys_utf8.txt', 'r', encoding='utf-8') as f:
        required_keys = set(line.strip() for line in f if line.strip())
    
    i18n_data = extract_keys_from_js('i18n-data.js')
    
    results = {}
    for lang, defined_keys in i18n_data.items():
        missing = required_keys - defined_keys
        results[lang] = sorted(list(missing))
    
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
