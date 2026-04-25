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
        this.interviewState = {
            active: false,
            step: 0,
            answers: {}
        };
        this.diagnosisQuestions = [
            { id: 'assurance_vie', text: "📊 Payez-vous des primes d'**Assurance Vie** ?" },
            { id: 'credit_logement', text: "🏠 Avez-vous un **Crédit Logement** en cours ?" },
            { id: 'epargne_actions', text: "📉 Avez-vous un **Compte Épargne en Actions (CEA)** ?" },
            { id: 'dividendes', text: "💰 Percevez-vous des **Dividendes** d'actions ?" }
        ];
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
        if (!key || typeof key !== 'string') return false;
        // Gemini keys: AIza... (~39 chars)
        return key.startsWith('AIza') && key.length >= 35;
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
                    console.warn("⚠️ N8n unreachable, falling back to Gemini/Local:", n8nError);
                }
            }

            // Priority 1.5: Groq Fast API
            let groqKey = localStorage.getItem(AI_CONFIG.storage.groqKey) || AI_CONFIG.groq.apiKey;
            if (AI_CONFIG.groq && AI_CONFIG.groq.enabled && groqKey) {
                try {
                    return await this.callGroqAPI(userMessage, groqKey, onChunk, onComplete);
                } catch (groqError) {
                    console.warn("⚠️ Groq API error, falling back to Gemini:", groqError);
                }
            }

            // Priority 2: Direct Gemini Call (Robust Key Selection)
            let apiKey = this.loadApiKey();
            if (!this.isValidApiKeyFormat(apiKey)) {
                apiKey = AI_CONFIG.gemini.apiKey;
            }

            if (apiKey && this.isValidApiKeyFormat(apiKey)) {
                try {
                    return await this.callGeminiAPI(userMessage, apiKey, onChunk, onComplete);
                } catch (geminiError) {
                    console.warn("⚠️ Gemini API error, falling back to Local Expert:", geminiError);
                    if (onChunk) onChunk("⚠️ *Mode Hors-ligne (Gemini Indisponible)*\n\n", "⚠️ *Mode Hors-ligne (Gemini Indisponible)*\n\n");
                }
            }

            // Priority 3: Hugging Face API (Qwen)
            if (AI_CONFIG.huggingface && AI_CONFIG.huggingface.enabled) {
                let hfKey = localStorage.getItem('fiscal_ai_hf_key') || AI_CONFIG.huggingface.apiKey;
                if (hfKey) {
                    try {
                        return await this.callHuggingFaceAPI(userMessage, hfKey, onChunk, onComplete);
                    } catch (hfError) {
                        console.warn("⚠️ Hugging Face error, falling back to Local Expert:", hfError);
                    }
                }
            }

            // Priority 4: Fallback to Local Intelligence (Deterministic)
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
     * Call Google Gemini API
     */
    async callGeminiAPI(userMessage, apiKey, onChunk, onComplete) {
        const url = `${AI_CONFIG.gemini.apiUrl}?key=${apiKey}`;

        // Prepare Rich Snapshot
        const snapshot = this._getFiscalSnapshot();
        const systemPrompt = AI_CONFIG.systemPrompt;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: `SYSTEM_PROMPT: ${systemPrompt}\n\nFISCAL_SNAPSHOT: ${JSON.stringify(snapshot)}\n\nUSER_MESSAGE: ${userMessage}` }]
                }
            ],
            generationConfig: {
                maxOutputTokens: AI_CONFIG.gemini.maxTokens,
                temperature: AI_CONFIG.gemini.temperature
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP Error ${response.status}`);
        }

        const data = await response.json();
        let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu générer de réponse.";

        // Add a discreet indicator for verification
        aiResponse = `### 🤖 Assistant Fiscal (Gemini AI)\n\n${aiResponse}`;

        if (onChunk) onChunk(aiResponse, aiResponse);
        if (onComplete) onComplete(aiResponse);

        this.addToHistory('assistant', aiResponse);
        return aiResponse;
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
     * Call Groq Inference API
     */
    async callGroqAPI(userMessage, apiKey, onChunk, onComplete) {
        const url = AI_CONFIG.groq.apiUrl;
        const snapshot = this._getFiscalSnapshot();
        const systemPrompt = AI_CONFIG.systemPrompt;

        const payload = {
            model: AI_CONFIG.groq.model,
            messages: [
                {
                    role: "system",
                    content: `${systemPrompt}\n\nContext: ${JSON.stringify(snapshot)}`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq Error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        let aiResponse = "";

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            aiResponse = data.choices[0].message.content;
        } else {
            throw new Error("Invalid Groq API response format");
        }

        aiResponse = `### 🤖 Assistant Fiscal (Groq AI)\n\n${aiResponse}`;

        if (onChunk) onChunk(aiResponse, aiResponse);
        if (onComplete) onComplete(aiResponse);

        this.addToHistory('assistant', aiResponse);
        return aiResponse;
    }

    /**
     * Call Hugging Face Inference API (Qwen)
     */
    async callHuggingFaceAPI(userMessage, apiKey, onChunk, onComplete) {
        const url = AI_CONFIG.huggingface.apiUrl;
        const snapshot = this._getFiscalSnapshot();
        const systemPrompt = AI_CONFIG.systemPrompt;

        const payload = {
            inputs: `<|im_start|>system\n${systemPrompt}\nContext: ${JSON.stringify(snapshot)}<|im_end|>\n<|im_start|>user\n${userMessage}<|im_end|>\n<|im_start|>assistant\n`,
            parameters: {
                max_new_tokens: 512,
                temperature: 0.7,
                return_full_text: false
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HF Error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        let aiResponse = "";

        if (Array.isArray(data) && data[0].generated_text) {
            aiResponse = data[0].generated_text;
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            aiResponse = JSON.stringify(data);
        }

        aiResponse = `### 🤖 Assistant Qwen (Hugging Face AI)\n\n${aiResponse}`;

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

        // --- SPECIAL CONSULTATION MODES ---
        if (query.includes("consultation_irpp") || query.includes("analyse ma situation")) {
            return this.analyzeIRPP(this.currentContext);
        }

        if (query.includes("diagnostic_interactif") || query.includes("poser des questions")) {
            return this.startDiagnosis();
        }

        // --- INTERVIEW MODE HANDLING ---
        if (this.interviewState.active) {
            return this.processInterviewAnswer(query);
        }

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

**Déductions Mise à Jour LF 2026 :**
- **Frais Pro** : 10% du brut (Plafonné à **2 000 DT**).
- **Chef de famille** : **300 DT** (Crédit d'impôt).
- **Enfants** : **100 DT** par enfant (Crédit d'impôt, max 4).
- **Enfant Étudiant** : **1 000 DT** (Crédit d'impôt).
- **Parents à charge** : **450 DT** par parent (LF 2026 - Nouveau montant).
`;
        }
        // --- IS LOGIC (Advanced detailing) ---
        else if (matches("is") || matches("société") || query.includes("impôt sur les sociétés")) {
            const isRates = db.is.rates["2026"];
            response = `### 🏢 Régime de l'IS (Loi de Finances 2026)
            
**1. Taux d'Imposition (Art. 49) :**
- **15%** : Taux Standard (Industrie, Commerce, Services).
- **10%** : Développement Régional (après 10 ans) & Export (Période transitoire).
- **35%** : Banques, Assurances, Grande Distribution (>2500m²).
- **20%** : Introduction en Bourse (IPO) pendant 5 ans.

**2. Régimes Privilégiés (ZDR & Export) :**
- **ZDR** : Exonération Totale (0%) pendant 10 ans. 
  - *Après 10 ans* : IS 10% + CSS 0.1% du Bénéfice.
- **Export (ETE)** : Exonération Totale (0%) pendant 10 ans.
  - *Après 10 ans* : IS 7.5% (Taux Effectif) + CSS 0%.

**3. Charges Fiscales Minimales :**
- **Minimum d'Impôt** : 0.2% du CA TTC (Général) ou 0.1% (ZDR < 10 ans).
- **CSS** : 3% (Standard) ou 4% (activités à 35%).`;
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
        // --- RS LOGIC ---
        else if (matches("rs") || query.includes("retenue à la source")) {
            response = `### ⚡ Retenue à la Source (RS) 2026
            
La RS est une avance sur l'impôt (IRPP ou IS). Voici les taux principaux :
- **1,5%** : Marchés publics et achats de services/marchandises (Art. 52).
- **10%** : Honoraires (avocats, experts, etc.) & Loyers.
- **20%** : Retenue sur les honoraires de non-résidents.

⚠️ **Plateforme TEJ** : L'Art. 18 de la LF 2026 généralise l'utilisation de la plateforme **TEJ** pour le dépôt des certificats de retenue.`;
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
     * Helper to create a rich data snapshot of the current calculation
     */
    _getFiscalSnapshot() {
        if (!this.currentContext) return { status: "no_data" };

        const ctx = this.currentContext;
        const type = ctx.type || ctx.module || "Fiscal";

        try {
            if (type === 'IRPP') {
                return {
                    type: 'IRPP',
                    year: currentFiscalYear || '2026',
                    gross: ctx.data.grossIncome,
                    netMensuel: ctx.data.netMensuel,
                    totalTax: ctx.totalTax,
                    taxableBase: ctx.data.assietteSoumise,
                    brackets: ctx.data.bracketDetails,
                    credits: {
                        chefFamille: ctx.data.creditChefFamille,
                        enfants: ctx.data.creditEnfants,
                        etudiants: ctx.data.creditEtudiants,
                        parents: ctx.data.creditParents
                    }
                };
            } else if (type === 'IS') {
                return {
                    type: 'IS',
                    resultatFiscal: ctx.data.resultatFiscal,
                    totalTax: ctx.totalTax,
                    isDû: ctx.data.isNet,
                    css: ctx.data.css
                };
            }
            return { type, total: ctx.totalTax || 0 };
        } catch (e) {
            return { type, error: "Snapshot error" };
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

    /**
     * INTELLIGENT IRPP ANALYSIS
     * Rule-based engine to suggest optimizations
     */
    analyzeIRPP(context) {
        if (!context || context.type !== 'IRPP') {
            return "⚠️ **Aucune donnée analysable.**\nVeuillez d'abord effectuer une simulation IRPP pour que je puisse l'analyser.";
        }

        const data = context.data;
        const inputs = data.inputs;
        let advice = [];

        // Header
        let response = `### 🕵️ Audit Fiscal Précis (Analyste AI)\n`;
        response += `**Base Imposable**: ${data.assietteSoumise.toLocaleString('fr-TN')} DT | **Impôt (IRPP+CSS)**: ${data.totalRetenue.toLocaleString('fr-TN')} DT\n\n`;

        // 1. Bracket Awareness Analysis
        const lastBracket = data.bracketDetails[data.bracketDetails.length - 1];
        if (lastBracket) {
            response += `📊 **Analyse de Tranche** : Vous êtes actuellement imposé dans la tranche à **${lastBracket.rate}**. `;

            // Find next bracket limit
            const allBrackets = AI_CONFIG.fiscalContext.irpp.brackets2026;
            const nextBracket = allBrackets.find(b => b.min > data.assietteSoumise);

            if (nextBracket) {
                const distance = nextBracket.min - data.assietteSoumise;
                response += `Il vous reste **${distance.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT** de marge avant de passer à la tranche supérieure de **${(nextBracket.rate * 100).toFixed(0)}%**.\n\n`;
            } else {
                response += `Vous êtes déjà dans la tranche marginale maximale de la Loi de Finances 2026.\n\n`;
            }
        }

        // 2. Specific Optimization Rules
        if (data.irppNet > 0) {
            if (inputs.nbEtudiants === 0) {
                advice.push(`🎓 **Optimisation Étudiant** : Avez-vous des enfants poursuivant des études supérieures ? 
                La LF 2026 permet un crédit d'impôt de **1 000 DT** par étudiant non boursier.`);
            }

            // CEA calculation proof
            const ceaGain = Math.min(data.irppNet, 1500); // estimated
            advice.push(`📉 **Levier CEA** : En versant 5 000 DT sur un **Compte Épargne en Actions**, vous pourriez économiser environ **${ceaGain.toLocaleString('fr-TN')} DT** d'impôt.`);
        }

        if (inputs.nbEnfants > 4) {
            advice.push(`⚠️ **Limite Enfants** : Vous avez déclaré ${inputs.nbEnfants} enfants. Notez que les déductions forfaitaires sont plafonnées aux **4 premiers enfants** (Art. 40).`);
        }

        if (inputs.nbParents === 0) {
            advice.push(`👵 **Parents à Charge** : N'oubliez pas le crédit de **450 DT** par parent à charge si applicable.`);
        }

        if (advice.length === 0) {
            response += "✅ **Votre situation semble optimisée sur les bases déclarées.**";
        } else {
            response += advice.map(a => `- ${a}`).join('\n\n');
        }

        response += "\n\n💡 *Note : Pour un audit sur vos revenus mobiliers, posez une question directe.*";

        return response;
    }

    /**
     * Start Interactive Diagnosis
     */
    startDiagnosis() {
        this.interviewState = {
            active: true,
            step: 0,
            answers: {}
        };
        return `🕵️ **Démarrage du Diagnostic Interactif**\n\nJe vais vous poser **${this.diagnosisQuestions.length} questions** pour mieux comprendre votre situation.\n\nrépondez simplement par 'oui' ou 'non'.\n\n1️⃣ ${this.diagnosisQuestions[0].text}`;
    }

    /**
     * Process User Answer in Interview Mode
     */
    processInterviewAnswer(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        const currentQ = this.diagnosisQuestions[this.interviewState.step];

        // Interpret YES/NO
        let val = null;
        if (msg.includes('oui') || msg.includes('yes') || msg.includes('ouais')) val = true;
        else if (msg.includes('non') || msg.includes('no')) val = false;
        else return "⚠️ Je n'ai pas compris. Répondez par **Oui** ou **Non**.";

        // Store Answer
        this.interviewState.answers[currentQ.id] = val;
        this.interviewState.step++;

        // Next Question or Finish
        if (this.interviewState.step < this.diagnosisQuestions.length) {
            const nextQ = this.diagnosisQuestions[this.interviewState.step];
            return `${this.interviewState.step + 1}️⃣ ${nextQ.text}`;
        } else {
            return this.finalizeDiagnosis();
        }
    }

    /**
     * Finalize Diagnosis and Generate Report
     */
    finalizeDiagnosis() {
        this.interviewState.active = false;
        const answers = this.interviewState.answers;
        let report = `### ✅ Diagnostic Terminé !\nVoici mes recommandations basées sur vos réponses :\n\n`;
        let tips = [];

        if (answers.assurance_vie) {
            tips.push(`✅ **Assurance Vie** : Excellent. Vérifiez que vous déduisez bien le montant max (**10 000 DT**) de votre revenu.`);
        } else {
            tips.push(`💡 **Assurance Vie** : Vous ne payez pas de primes. En souscrire une permettrait de déduire jusqu'à **10 000 DT** de votre assiette imposable tout en épargnant.`);
        }

        if (answers.credit_logement) {
            tips.push(`🏠 **Crédit Logement** : N'oubliez pas que les **intérêts** (marge bénéficiaire) sont déductibles (selon le contrat et l'année de construction).`);
        }

        if (answers.epargne_actions) {
            tips.push(`📉 **CEA** : Très bien. Le plafond de déduction est de **50 000 DT** par an.`);
        } else {
            tips.push(`📉 **CEA** : Pensez-y. C'est l'un des moyens les plus puissants pour réduire l'impôt (Déduction jusqu'à **50 000 DT**).`);
        }

        if (answers.dividendes) {
            tips.push(`💰 **Dividendes** : Attention, ils subissent une retenue à la source libératoire de **10%**.`);
        }

        if (tips.length === 0) report += "Tout semble en ordre !";
        else report += tips.map(t => `- ${t}`).join('\n\n');

        return report;
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
