# SOP: Qwen Chatbot Operations

This directive defines the process for configuring and using the Qwen2.5-1.5B-Instruct chatbot.

## 1. Setup & Configuration

### Obtaining a Hugging Face API Token
1. Create an account at [huggingface.co](https://huggingface.co/).
2. Go to **Settings > Access Tokens**.
3. Create a new "Read" token.
4. Add the token to your environment variables:
   - Variable name: `HUGGINGFACE_API_KEY`
   - Value: `your_token_here`

### Adding to .env
Add the following line to your `.env` file:
```bash
HUGGINGFACE_API_KEY=your_hf_token_here
```

## 2. Execution (Deterministic Tools)

### Using the Python Adapter
The Python adapter allows for CLI-based interaction with the model.

**Command:**
```powershell
python execution/qwen_hf_adapter.py "Explain IRPP in Tunisia"
```

## 3. Web Service Integration

### Configuration (`ai-config.js`)
Ensure the `huggingface` section is updated with the correct model ID and API settings.

### Service Layer (`ai-service.js`)
The `AIService` class manages the fallback logic. By default, it will attempt to use Gemini or N8n first, then fallback to Hugging Face if configured, and finally to the local deterministic rule engine.

## 4. Troubleshooting
- **503 Error**: The model is likely being loaded into Hugging Face's serverless infrastructure. Wait 30 seconds and try again.
- **401/403 Error**: Verify your API token and ensure it has "Read" permissions for the model.
