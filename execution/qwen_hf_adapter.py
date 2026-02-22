import os
import requests
import json
import sys

# Qwen HF Adapter
# Uses Hugging Face Inference API for serverless inference

MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

def query_qwen(prompt, api_token):
    headers = {"Authorization": f"Bearer {api_token}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
            "top_p": 0.9,
            "return_full_text": False
        }
    }
    
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 503:
        # Model loading
        return {"error": "Model is loading, please try again in a moment.", "status_code": 503}
    else:
        return {"error": f"API Error: {response.text}", "status_code": response.status_code}

if __name__ == "__main__":
    # Get API Token from environment or argument
    hf_token = os.getenv("HUGGINGFACE_API_KEY")
    
    if not hf_token:
        print(json.dumps({"error": "HUGGINGFACE_API_KEY environment variable not set."}))
        sys.exit(1)
        
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No prompt provided. Usage: python qwen_hf_adapter.py \"your prompt\""}))
        sys.exit(1)
        
    user_prompt = sys.argv[1]
    result = query_qwen(user_prompt, hf_token)
    print(json.dumps(result, indent=2))
