import sys

def find_missing_comma(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for i in range(len(lines) - 1):
            line = lines[i].strip()
            next_line = lines[i+1].strip()
            
            if line.endswith('"') and next_line.startswith('"'):
                print(f"Potential missing comma at line {i+1}:")
                print(f"Line {i+1}: {lines[i].strip()}")
                print(f"Line {i+2}: {lines[i+1].strip()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_missing_comma('i18n-data.js')
