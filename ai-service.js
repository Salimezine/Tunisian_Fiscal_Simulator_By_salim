/**
 * AI SERVICE MODULE
 * Handles OpenAI GPT API integration with streaming support
 */

class AIService {
    constructor() {
        this.provider = 'local';
        this.apiKey = null;
        this.conversationHistory = this.loadConversationHistory();
        this.isStreaming = false;
        this.abortController = null;
        this.currentContext = null;
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
     * Send message to Google Gemini API with streaming
     */
    async sendMessage(userMessage, onChunk = null, onComplete = null, onError = null) {
        // Add user message to history
        this.addToHistory('user', userMessage);
        this.abortController = new AbortController();

        try {
            // Priority 1: Check if N8n is enabled
            if (AI_CONFIG.n8n && AI_CONFIG.n8n.enabled) {
                try {
                    return await this.callN8NWebhook(userMessage, onChunk, onComplete);
                } catch (n8nError) {
                    console.warn("⚠️ N8n unreachable, falling back to Local Expert:", n8nError);
                    if (onChunk) onChunk("⚠️ *Mode Hors-ligne activé (Réseau indisponible)*\n\n", "⚠️ *Mode Hors-ligne activé (Réseau indisponible)*\n\n");
                }
            }

            // Priority 2: Fallback to Local Intelligence (Deterministic)
            // Instant Local Response (Fast & Private)
            const response = this.getLocalResponse(userMessage);

            // Simulate brief "typing" for UX
            await new Promise(resolve => setTimeout(resolve, 800));

            if (onChunk) onChunk(response, response);
            if (onComplete) onComplete(response);

            this.addToHistory('assistant', response);
            return response;

        } catch (error) {
            console.error('AI Service Error:', error);
            if (onError) onError(error);
            return "Une erreur critique est survenue.";
        }
    }

    /**
     * Call N8n Webhook
     */
    async callN8NWebhook(userMessage, onChunk, onComplete) {
        const webhookUrl = AI_CONFIG.n8n.webhookUrl;

        // Context Preparation
        const payload = {
            chatInput: userMessage,
            fiscalSnapshot: this._getFiscalSnapshot(), // Flattened context
            chatHistory: this.conversationHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n'), // Last 5 messages
            timestamp: new Date().toISOString()
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            throw new Error(`N8n Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming N8n returns { output: "text response" } or similar structure
        // Adapt this based on your actual N8n node output
        const aiResponse = data.output || data.text || data.message || JSON.stringify(data);

        if (onChunk) onChunk(aiResponse, aiResponse);
        if (onComplete) onComplete(aiResponse);

        this.addToHistory('assistant', aiResponse);
        return aiResponse;
    }

    /**
     * LOCAL KNOWLEDGE ENGINE (Standalone & RAG-ready)
     */
    getLocalResponse(userMessage) {
        const query = userMessage.toLowerCase();
        let response = "";

        const db = window.LegalReferenceDatabase || {};
        if (!db.irpp) return "⚠️ Erreur: Base de données légale non chargée.";

        const matches = (word) => new RegExp(`\\b${word}\\b`, 'i').test(query);

        // --- IRPP LOGIC (Advanced detailing) ---
        if (matches("irpp") || query.includes("impôt sur le revenu") || matches("salaire")) {
            const rules = db.irpp.brackets["2026"];
            const family = db.irpp.deductions.family;

            response = `### 📊 Diagnostic Précis IRPP 2026 (JORT 148)
            
Le nouveau barème ${rules.version} (Art. 44) s'articule autour de 8 tranches :

| Tranche de Revenu (DT) | Taux |
| :--- | :--- |
| 0 - 5 000 | **0%** |
| 5 000 - 10 000 | **15%** |
| 10 000 - 20 000 | **25%** |
| 20 000 - 30 000 | **30%** |
| 30 000 - 40 000 | **33%** |
| 40 000 - 50 000 | **36%** |
| 50 000 - 70 000 | **38%** |
| Au-delà de 70 000 | **40%** |

**Déductions & Abattements (Art. 40) :**
- **Frais Pro** : 10% du brut (Plafonné à **2000 DT**).
- **Chef de famille** : **300 DT**.
- **Enfants** : 150 (1er), 100 (others). Max 4 enfants.
- **Étudiant** : **1000 DT** par enfant étudiant non boursier.
- **Parents à charge** : **450 DT** (LF 2026)`;
        }
        // --- IS LOGIC (Advanced detailing) ---
        else if (matches("is") || matches("société") || query.includes("impôt sur les sociétés")) {
            const isRates = db.is.rates["2026"];
            response = `### 🏢 Régime de l'IS (Loi de Finances 2026)
            
Les taux applicables selon l'Art. 49 sont :
- **${isRates.standard * 100}%** : Taux standard (PME, Industries, Services).
- **${isRates.financial * 100}%** : Banques, Assurances, Telecoms (Secteur financier).
- **10%** : Entreprises totalement exportatrices (sous conditions).

**Minimum d'Impôt (Art. 12 LF 2026) :**
L'impôt ne peut être < **0.2% du CA brut**, même en cas de déficit.
**CSS Entreprise** : 3% du bénéfice imposable.`;
        }
        // --- TVA LOGIC ---
        else if (matches("tva")) {
            const tva = db.tva.rates["2026"];
            response = `### 💸 TVA & Fiscalité Indirecte 2026
           
Les articles 6 et 7 fixent les taux suivants :
- **19%** : Taux de droit commun (Opérations standard).
- **13%** : Taux intermédiaire (Tourisme, Restauration).
- **7%** : Taux réduit (Médicaments, Aliments de base).

⚠️ **Réforme Facturation** : L'Art. 18 de la LF 2026 rend la **Facture Électronique** obligatoire. Sans facture numérique conforme, la déduction de la TVA peut être remise en cause.`;
        }
        // --- DEADLINES (Full 상세 Month-by-Month) ---
        else if (query.includes("échéance") || query.includes("calendrier") || query.includes("date")) {
            response = `### 📅 Calendrier Fiscal Complet 2026
            
Voici l'agenda exhaustif des obligations :

**Mensuellement (Avant le 15 ou 28) :**
- Déclaration Mensuelle (TVA, RS, TFP, FOPROLOS).

**Échéances Exceptionnelles :**
- **25 Janvier** : Bilan IRPP (Salaires de Décembre).
- **28 Février** : Déclaration Employeur (DE).
- **25 Mars** : Déclaration Annuelle IS (Sociétés commerciales).
- **25 Mai** : Déclaration Annuelle IRPP (Personnes Physiques).
- **28 Juin** : **Acompte Provisionnel n°1** (20% de l'IS/IRPP 2025).
- **28 Septembre** : **Acompte Provisionnel n°2** (20%).
- **28 Décembre** : **Acompte Provisionnel n°3** (20%).

*Note : Si la date tombe un jour férié, l'échéance est reportée au premier jour ouvrable suivant.*`;
        }
        // --- STARTUP / REGIMES ---
        else if (query.includes("startup") || query.includes("avantage") || query.includes("zdr")) {
            response = `### 🚀 Incitations & Régimes Spéciaux
            
**Startup Act :**
- Exonération totale d'IS pendant 8 ans.
- Prise en charge des charges sociales (Patronales + Salariales) par l'État.

**Zones de Développement Régional (ZDR) :**
- Déduction de 100% des revenus pendant 10 ans (Zone 1) ou 5 ans (Zone 2).
- Prime d'investissement pouvant atteindre 30%.`;
        }
        // --- DEFAULT ---
        else {
            response = `### 🤖 Expert Fiscal AI (Mode Précis)
             
Je suis programmé avec les détails de la **Loi de Finances 2026**. 
Je peux vous donner des détails précis sur :
- **Le Barème IRPP** (Tableau des tranches)
- **Le Calendrier 2026** (Dates des acomptes)
- **L'IS & TVA** (Secteurs et Facturation)
- **Les Avantages** (Startup Act, ZDR)

Posez une question spécifique pour obtenir les détails techniques !`;
        }

        return response;
    }

    /**
     * Builds the System Prompt Analysis Context (RAG)
     * Injects the entire LegalReferenceDatabase as text for the AI
     */
    buildRAGContext() {
        const db = window.LegalReferenceDatabase;
        if (!db) return "";

        return `
CONTEXTE LÉGAL OFFICIEL (TUNISIE 2026) :
1. IRPP : ${JSON.stringify(db.irpp.brackets["2026"])}
2. DÉDUCTIONS : ${JSON.stringify(db.irpp.deductions)}
3. IS : ${JSON.stringify(db.is.rates["2026"])}
4. TVA : ${JSON.stringify(db.tva.rates["2026"])}
5. ZDR : ${JSON.stringify(db.is.zdr)}
`;
    }

    async sendToN8N(userMessage, onChunk = null, onComplete = null, onError = null) {
        return this.sendMessage(userMessage, onChunk, onComplete, onError);
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
        return this.sendMessage(userMessage);
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
