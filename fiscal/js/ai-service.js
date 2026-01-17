/**
 * AI SERVICE MODULE
 * Handles OpenAI GPT API integration with streaming support
 */

class AIService {
    constructor() {
        this.provider = AI_CONFIG.n8n.enabled ? 'n8n' : 'gemini';
        this.apiKey = this.loadApiKey();
        this.conversationHistory = this.loadConversationHistory();
        this.isStreaming = false;
        this.abortController = null;
        this.currentContext = null; // Stores calculation data for AI awareness
    }

    /**
     * Load API key from localStorage
     */
    loadApiKey() {
        return localStorage.getItem(AI_CONFIG.storage.apiKey) || null;
    }

    /**
     * Save API key to localStorage
     */
    saveApiKey(key) {
        this.apiKey = key;
        localStorage.setItem(AI_CONFIG.storage.apiKey, key);
    }

    /**
     * Remove API key
     */
    removeApiKey() {
        this.apiKey = null;
        localStorage.removeItem(AI_CONFIG.storage.apiKey);
    }

    /**
     * Check if API key is configured
     */
    hasApiKey() {
        return this.apiKey && this.apiKey.trim().length > 0;
    }

    /**
     * Validate API key format
     */
    isValidApiKeyFormat(key) {
        // Gemini keys start with "AIza"
        return key && key.startsWith('AIza') && key.length > 30;
    }

    /**
     * Load conversation history from localStorage
     */
    loadConversationHistory() {
        try {
            const stored = localStorage.getItem(AI_CONFIG.storage.conversationHistory);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading conversation history:', e);
            return [];
        }
    }

    /**
     * Save conversation history to localStorage
     */
    saveConversationHistory() {
        try {
            // Keep only last 20 messages to avoid storage limits
            const recentHistory = this.conversationHistory.slice(-20);
            localStorage.setItem(
                AI_CONFIG.storage.conversationHistory,
                JSON.stringify(recentHistory)
            );
        } catch (e) {
            console.error('Error saving conversation history:', e);
        }
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        this.saveConversationHistory();
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem(AI_CONFIG.storage.conversationHistory);
    }

    /**
     * Get conversation context for API (system + last 10 messages)
     */
    getConversationContext() {
        let systemContent = AI_CONFIG.systemPrompt;

        // Add context if available
        if (this.currentContext) {
            systemContent += `\n\n**Contexte actuel du calcul:**\n${JSON.stringify(this.currentContext, null, 2)}`;
        }

        const systemPrompt = { role: 'system', content: systemContent };

        // Get last 10 messages to avoid token limits
        const recentMessages = this.conversationHistory.slice(-10);

        return [systemPrompt, ...recentMessages];
    }

    /**
     * Send message to Google Gemini API with streaming
     */
    async sendMessage(userMessage, onChunk = null, onComplete = null, onError = null) {
        // Skip API key check if using n8n
        if (this.provider !== 'n8n' && !this.hasApiKey()) {
            const error = new Error('API key not configured');
            if (onError) onError(error);
            throw error;
        }

        // Add user message to history
        this.addToHistory('user', userMessage);

        // Create abort controller for cancellation
        this.abortController = new AbortController();

        try {
            // Build conversation context (system + history)
            const messages = this.getConversationContext();

            // Format for Gemini prompt string
            const conversationText = messages
                .map(msg => `${msg.role === 'user' ? 'User' : (msg.role === 'system' ? 'Instruction' : 'Assistant')}: ${msg.content}`)
                .join('\n\n');

            const fullPrompt = `${conversationText}\n\nAssistant:`;

            // If using n8n, redirect to that flow
            if (this.provider === 'n8n') {
                return await this.sendToN8N(userMessage, onChunk, onComplete, onError);
            }

            // Gemini API endpoint with streaming
            const url = `${AI_CONFIG.gemini.apiUrl}?key=${this.apiKey}&alt=sse`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: AI_CONFIG.gemini.temperature,
                        maxOutputTokens: AI_CONFIG.gemini.maxTokens
                    }
                }),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            this.isStreaming = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

                            if (content) {
                                fullResponse += content;
                                if (onChunk) {
                                    onChunk(content, fullResponse);
                                }
                            }
                        } catch (e) {
                            // Skip malformed JSON
                        }
                    }
                }
            }

            this.isStreaming = false;

            // Add assistant response to history
            this.addToHistory('assistant', fullResponse);

            if (onComplete) {
                onComplete(fullResponse);
            }

            return fullResponse;

        } catch (error) {
            this.isStreaming = false;
            if (error.name === 'AbortError') {
                console.log('Request cancelled');
                return null;
            }
            console.error('Gemini API error:', error);
            if (onError) onError(error);
            throw error;
        }
    }

    /**
     * Send message to n8n Webhook
     */
    async sendToN8N(userMessage, onChunk = null, onComplete = null, onError = null) {
        try {
            // 1, 2, 3: Simplified flattened payload with renamed keys
            const payload = {
                chatInput: userMessage,
                fiscalSnapshot: this._getFiscalSnapshot(),
                chatHistory: this.conversationHistory
                    .slice(-5)
                    .map(m => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
                    .join('\n'),
                timestamp: new Date().toISOString()
            };

            const response = await fetch(AI_CONFIG.n8n.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: this.abortController?.signal
            });

            if (!response.ok) {
                throw new Error(`n8n Error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.output || data.response || data.text || (typeof data === 'string' ? data : 'Pas de réponse du serveur.');

            if (onChunk) {
                onChunk(reply, reply);
            }

            this.addToHistory('assistant', reply);
            if (onComplete) onComplete(reply);

            return reply;

        } catch (error) {
            console.error('n8n post error:', error);
            if (onError) onError(error);
            throw error;
        }
    }

    /**
     * Helper to create a simple text summary of the current calculation
     */
    _getFiscalSnapshot() {
        if (!this.currentContext) return "Aucun calcul en cours.";

        const ctx = this.currentContext;
        const type = ctx.type || ctx.module || "Fiscal";

        try {
            if (type === 'IRPP') {
                return `IRPP 2026 | Brut: ${ctx.data.grossIncome.toFixed(3)} DT | Net: ${ctx.data.netMensuel.toFixed(3)} DT/mois | Impôt: ${ctx.totalTax.toFixed(3)} DT`;
            } else if (type === 'IS') {
                return `IS 2026 | Résultat: ${ctx.data.resultatFiscal.toFixed(3)} DT | Impôt dû: ${ctx.totalTax.toFixed(3)} DT`;
            } else if (type === 'TVA') {
                return `TVA 2026 | Chiffre Affaires: ${ctx.data.totalCA.toFixed(3)} DT | Solde: ${ctx.data.soldeTVA.toFixed(3)} DT (${ctx.data.soldeTVA >= 0 ? 'À payer' : 'Crédit'})`;
            }
            return `${type} | Total: ${ctx.totalTax || 0} DT`;
        } catch (e) {
            return `Calcul ${type} en cours...`;
        }
    }

    /**
     * Send message without streaming (simpler)
     */
    async sendMessageSimple(userMessage) {
        if (this.provider !== 'n8n' && !this.hasApiKey()) {
            throw new Error('API key not configured');
        }

        this.addToHistory('user', userMessage);

        try {
            const messages = this.getConversationContext();

            // Format for Gemini prompt string
            const conversationText = messages
                .map(msg => `${msg.role === 'user' ? 'User' : (msg.role === 'system' ? 'Instruction' : 'Assistant')}: ${msg.content}`)
                .join('\n\n');

            const fullPrompt = `${conversationText}\n\nAssistant:`;

            const url = `${AI_CONFIG.gemini.apiUrl}?key=${this.apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: AI_CONFIG.gemini.temperature,
                        maxOutputTokens: AI_CONFIG.gemini.maxTokens
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je n\'ai pas pu générer de réponse.';

            this.addToHistory('assistant', assistantMessage);

            return assistantMessage;

        } catch (error) {
            console.error('Gemini API error (simple):', error);
            throw error;
        }
    }

    /**
     * Cancel ongoing streaming request
     */
    cancelRequest() {
        if (this.abortController) {
            this.abortController.abort();
            this.isStreaming = false;
        }
    }

    /**
     * Get conversation statistics
     */
    getStats() {
        return {
            messageCount: this.conversationHistory.length,
            hasApiKey: this.hasApiKey(),
            provider: this.provider
        };
    }

    /**
     * Export conversation as text
     */
    exportConversation() {
        let text = '=== Conversation - Simulateur Fiscal Tunisien 2026 ===\n\n';

        this.conversationHistory.forEach((msg, index) => {
            const speaker = msg.role === 'user' ? '👤 Vous' : '🤖 Assistant Fiscal';
            text += `${speaker}:\n${msg.content}\n\n`;
        });

        text += `\n--- Exporté le ${new Date().toLocaleString('fr-TN')} ---`;

        return text;
    }

    /**
     * Download conversation as text file
     */
    downloadConversation() {
        const text = this.exportConversation();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-fiscal-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Update current calculation context
     */
    setContext(context) {
        this.currentContext = context;
    }
}

// Global instance
let aiServiceInstance = null;

function getAIService() {
    if (!aiServiceInstance) {
        aiServiceInstance = new AIService();
    }
    return aiServiceInstance;
}
