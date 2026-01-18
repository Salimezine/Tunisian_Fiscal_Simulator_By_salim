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
     * LOCAL KNOWLEDGE ENGINE (Standalone)
     * Replaces Gemini/n8n with immediate deterministic responses based on JORT 148
     */
    getLocalResponse(userMessage) {
        const query = userMessage.toLowerCase();
        let response = "";

        // Keywords matching with high detail
        if (query.includes("irpp") || query.includes("impôt sur le revenu") || query.includes("salaire")) {
            response = `### 👤 Focus Approfondi IRPP (LF 2026)

Le calcul de l'IRPP en 2026 repose sur un **barème progressif à 8 tranches**, conçu pour favoriser l'équité fiscale :

**1. Le Barème Permanent :**
- 🟢 **0 - 5 000 DT** : 0% (Seuil d'exonération)
- 🟡 **5 001 - 10 000 DT** : 15%
- 🟠 **10 001 - 20 000 DT** : 25%
- 🔴 **20 001 - 30 000 DT** : 30%
- 🔴 **30 001 - 40 000 DT** : 33%
- 🔴 **40 001 - 50 000 DT** : 36%
- 🔴 **50 001 - 70 000 DT** : 38%
- 🔥 **Au-delà de 70 000 DT** : 40%

**2. Les Abattements et Déductions :**
- **Frais Professionnels** : 10% du salaire brut, mais plafonnés strictement à **2 000 DT** par an (LF 2026).
- **Situation Familiale** : Déduction de **300 DT** pour le chef de famille, **300 DT** pour le conjoint sans revenu.
- **Enfants à charge** : **100 DT** par enfant (max 4), avec des majorations pour les étudiants (**1000 DT**) ou les enfants handicapés (**2000 DT**).

**3. Cotisations Sociales :** N'oubliez pas que le calcul du net imposable déduit d'abord la CNSS (9.18% secteur privé) ou la CNRPS (10.2% secteur public).

*Source : Articles 44 à 52 du Code de l'IRPP.*`;

        } else if (query.includes("is") || query.includes("société") || query.includes("entreprise")) {
            response = `### 🏢 Focus Approfondi IS (LF 2026)

L'Impôt sur les Sociétés subit une refonte majeure pour les exercices 2026 :

**1. Taux Progressifs selon l'activité :**
- **10%** : Taux préférentiel pour l'Agriculture, la Pêche, l'Artisanat et les entreprises totalement exportatrices.
- **20%** : Taux de droit commun pour la majorité des entreprises commerciales et industrielles.
- **35%** : Taux majoré pour les grandes surfaces, les concessionnaires automobiles, et les opérateurs télécoms.
- **40%** : Taux spécifique pour le secteur bancaire, financier et les compagnies d'assurances.

**2. Minimum d'Impôt :** Même en cas de perte, les sociétés sont redevables d'un minimum d'impôt égal à **0.2% du chiffre d'affaires total brut**, plafonné ou non selon le régime.

**3. Taxe Conjoncturelle (CSS) :** Une contribution sociale de solidarité s'ajoute, variant généralement de **3% à 4%** du bénéfice fiscal.

*Source : Article 49 du Code de l'IRPP et de l'IS.*`;

        } else if (query.includes("tva") || query.includes("taxe sur la valeur ajoutée")) {
            response = `### 💸 Focus Approfondi TVA (LF 2026)

La TVA est un impôt indirect collecté pour le compte de l'État :

**1. Structure des Taux :**
- **7%** : Taux réduit (Produits de santé, informatique, hôtellerie, journalisme).
- **13%** : Taux intermédiaire (Services de transport, électricité basse tension, certaines professions libérales).
- **19%** : Taux standard (Vente de biens, prestations de services générales, produits de luxe).

**2. Révolution Digitale :** En 2026, la **facturation électronique (E-Invoicing)** est généralisée. Toute déduction de TVA nécessite désormais une facture validée sur la plateforme nationale TEJ.

**3. Droits à Déduction :** Seule la TVA mentionnée sur les factures conformes et payée par un moyen traçable est récupérable (règle du prorata si nécessaire).

*Source : Code de la TVA Tunisienne.*`;

        } else if (query.includes("rs") || query.includes("retenue") || query.includes("source")) {
            response = `### ⚡ Focus Retenues à la Source (RS)

La RS est un mécanisme de précompte de l'impôt à la source :

- **Honoraires et Commissions** : **10%** pour les résidents, **15%** pour les non-résidents.
- **Loyers** : **10%** sur le montant brut du loyer.
- **Marchés Publics** : Généralement **1.5%** sur le montant des factures.
- **Dividendes** : **10%** lors de la distribution aux personnes physiques.

*Note : Toutes les attestations de RS doivent obligatoirement être générées via la plateforme **TEJ** en 2026.*`;

        } else if (query.includes("fortune") || query.includes("if") || query.includes("isf") || query.includes("immobilier")) {
            response = `### 💎 Impôt sur la Fortune Immobilière (IF)

Introduit pour renforcer la justice fiscale, cet impôt concerne le patrimoine immobilier :

- **Seuil d'imposition** : S'applique si la valeur vénale totale du patrimoine immobilier dépasse **2 000 000 DT**.
- **Taux** : **0.5%** sur la valeur du patrimoine.
- **Exonérations** : La résidence principale est généralement exclue (sous réserve des limites de surface) ainsi que les biens productifs utilisés pour l'exploitation économique.

*Réf : Loi de Finances 2023 et actualisations LF 2026.*`;

        } else if (query.includes("zdr") || query.includes("développement regional") || query.includes("avantage")) {
            response = `### 📍 Avantages Zones de Développement Régional (ZDR)

La Tunisie encourage l'investissement dans les régions intérieures via :

- **Exonération totale d'IS** : Pendant les **5 premières années** (Groupe 1) ou **10 premières années** (Groupe 2).
- **Réduction de 50%** de l'impôt après la période d'exonération totale.
- **Prise en charge CNSS** : L'État prend en charge la part patronale des cotisations sociales pendant 5 ou 10 ans.
- **Prime d'investissement** : Aide financière directe pouvant atteindre 15% à 30% du coût du projet.`;

        } else if (query.includes("startup") || query.includes("act") || query.includes("innovation")) {
            response = `### 🚀 Le Startup Act (Loi 2018-20)

Un cadre unique pour les entreprises innovantes labellisées :

1. **Avantages Fiscaux** : Exonération totale d'IS pour la startup. Exonération d'IRPP pour les fondateurs sur les revenus issus de la startup.
2. **Social** : Prise en charge intégrale des charges sociales par l'État.
3. **Change** : Autorisation de détenir des comptes en devises pour faciliter les opérations internationales.
4. **Bourse de Startup** : Allocation mensuelle versée aux fondateurs pendant la première année.`;

        } else if (query.includes("bilan") || query.includes("résultat") || query.includes("mon calcul")) {
            const snapshot = this._getFiscalSnapshot();
            response = `### 📊 Diagnostic de votre Simulation

Sur la base des données saisies dans le simulateur :

> **${snapshot}**

**Analyse Pédagogique :**
Ce résultat tient compte du barème **LF 2026** (8 tranches). Si vous basculez sur 2025, vous remarquerez une différence notable due à l'ancienne structure à 5 tranches. 

Pour optimiser votre situation, vérifiez si vous avez bien saisi vos **avantages famille** (Chef de famille, enfants étudiants) qui impactent directement votre base imposable.`;

        } else {
            response = `### 🤖 Assistant Fiscal Expert (Local)

Je suis configuré pour vous aider sur tous les modules de la plateforme. Posez-moi une question détaillée sur :

- **IRPP** : Barèmes 2025/2026, déductions familiales, frais pros.
- **IS** : Taux selon l'activité (10/20/35/40%), CSS, minimum d'impôt.
- **TVA** : Taux (7, 13, 19%), E-Invoicing, récupérabilité.
- **Retenues à la Source** : Honoraires, loyers, plateforme TEJ.
- **Impôt Fortune** : Seuils et taux immobiliers.
- **Incitations** : ZDR, Startup Act, Exportation.

*Je fonctionne en mode local pour garantir votre confidentialité et une réponse instantanée sans internet.*`;
        }

        return response;
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
