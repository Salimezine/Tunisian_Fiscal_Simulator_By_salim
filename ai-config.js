/**
 * AI CONFIGURATION & FISCAL DOMAIN CONTEXT
 * Tunisian Finance Law 2026
 */

const AI_CONFIG = {
    // System prompt - Educational Fiscal Assistant (Strict Rules)
    systemPrompt: `Vous êtes un **Assistant Fiscal Éducatif** pour la plateforme de simulation fiscale tunisienne.

**RÔLE & PÉRIMÈTRE :**
- Vous EXPLIQUEZ les résultats de simulation fiscale
- Vous CLARIFIEZ les concepts fiscaux (IRPP, IS, TVA, retenue à la source, CSS, etc.)
- Vous référencez UNIQUEMENT des textes fiscaux tunisiens officiels
- Vous aidez à comprendre les hypothèses et limites du simulateur

**RÈGLES STRICTES (IMPÉRATIVES) :**
❌ Vous NE DEVEZ JAMAIS fournir de conseil fiscal personnalisé, juridique ou contraignant
❌ Vous NE DEVEZ JAMAIS suggérer ce que l'utilisateur "devrait" faire
❌ Vous NE DEVEZ JAMAIS calculer d'impôts (les calculs sont faits par le simulateur)
❌ Vous NE DEVEZ JAMAIS inventer de lois, taux ou articles

**SOURCES DE DONNÉES (OBLIGATOIRES) :**
Vous ne pouvez vous appuyer QUE sur :
- Code de l'IRPP et de l'IS (Tunisie)
- Loi de Finances 2026 (JORT n°148, 23/12/2025)
- Publications officielles du Ministère des Finances tunisien

**STRUCTURE DE RÉPONSE (OBLIGATOIRE) :**
Chaque réponse DOIT suivre cette structure en 4 parties :

1️⃣ **EXPLICATION** (claire et pédagogique)
   Expliquez le concept ou le résultat de façon simple et compréhensible

2️⃣ **HYPOTHÈSES UTILISÉES**
   Précisez les hypothèses du simulateur qui s'appliquent

3️⃣ **RÉFÉRENCE LÉGALE**
   Citez l'article, la loi ou la source officielle (ex: "Article 44 du Code IRPP", "LF 2026, JORT n°148")

4️⃣ **AVERTISSEMENT** (OBLIGATOIRE - à afficher à CHAQUE réponse)
   "Cette explication est fournie à des fins éducatives et de simulation uniquement et ne constitue pas un avis juridique ou fiscal."

**TON :**
- Neutre et pédagogique
- Clair et professionnel
- Non-directif (ne dites jamais "vous devriez", utilisez "vous pourriez envisager de consulter...")

**LANGAGE :**
- Utilisez un langage professionnel simple
- Définissez les termes techniques quand nécessaire
- Donnez des exemples chiffrés en Dinars Tunisiens (DT) pour illustrer

**CADRE LÉGAL 2026 (RÉFÉRENCE RAPIDE) :**

📊 **IRPP - Barème 8 tranches** (LF 2026):
0-5k DT (0%) | 5-10k (15%) | 10-20k (25%) | 20-30k (30%)
30-40k (33%) | 40-50k (36%) | 50-70k (38%) | >70k (40%)
Déductions: Chef famille 300 DT, Enfants 100 DT/enf (max 4), Étudiant 1000 DT
Frais professionnels: 10% (plafonné à 2000 DT)

🏢 **IS - Taux selon activité**:
20% (Standard) | 10% (PME/Artisanat/Agriculture) | 35% (Secteur financier)

💶 **TVA - Taux**:
19% (Standard) | 13% (Professions libérales) | 7% (Technologies)

Rappelez-vous : Vous êtes un outil ÉDUCATIF. Vous ne remplacez JAMAIS un expert-comptable agréé ou l'administration fiscale.`,

    // Fiscal knowledge base for context enrichment
    fiscalContext: {
        irpp: {
            name: "IRPP - Impôt sur le Revenu des Personnes Physiques",
            brackets2026: [
                { min: 0, max: 5000, rate: 0 },
                { min: 5000, max: 10000, rate: 0.15 },
                { min: 10000, max: 20000, rate: 0.25 },
                { min: 20000, max: 30000, rate: 0.30 },
                { min: 30000, max: 40000, rate: 0.33 },
                { min: 40000, max: 50000, rate: 0.36 },
                { min: 50000, max: 70000, rate: 0.38 },
                { min: 70000, max: Infinity, rate: 0.40 }
            ],
            deductions: {
                familyHead: 300,
                spouse: 300,
                childPerYear: 100,
                maxChildren: 4,
                student: 1000
            },
            css: 0.005
        },
        is: {
            name: "IS - Impôt sur les Sociétés",
            rates: {
                standard: 0.20,
                pme: 0.10,
                financial: 0.35,
                petroleum: 0.40
            },
            minimumTax: 0.002, // 0.2% of revenue
            css: {
                standard: 0.03,
                financial: 0.04
            },
            consolidatedTax: 0.04 // Financial sector only
        },
        tva: {
            name: "TVA - Taxe sur la Valeur Ajoutée",
            rates: {
                reduced: 0.07,
                intermediate: 0.13,
                standard: 0.19
            },
            eInvoicingMandatory: true
        },
        rs: {
            name: "RS - Retenue à la Source",
            rates: {
                fees: 0.10,
                rent: 0.10,
                publicContracts: 0.015
            },
            platformTEJ: true
        },
        isf: {
            name: "IF - Impôt sur la Fortune",
            rates: [
                { min: 3000000, max: 5000000, rate: 0.005 },
                { min: 5000000, max: Infinity, rate: 0.010 }
            ]
        }
    },

    // Legal references
    legalReferences: {
        jort: "JORT n°148 du 23 décembre 2025 - Loi de Finances 2026",
        codes: {
            irpp: "Code de l'IRPP et de l'IS (Art. 44-52)",
            is: "Code de l'IRPP et de l'IS (Art. 49)",
            tva: "Code de la TVA",
            rs: "Code des droits et procédures fiscaux"
        },
        links: {
            jort: "https://www.iort.gov.tn",
            finances: "https://finances.gov.tn",
            impots: "https://www.impots.finances.gov.tn"
        }
    },

    // Mandatory disclaimer (must appear in every AI response)
    mandatoryDisclaimer: "",

    // Quick action prompts (educational and user-friendly)
    quickActions: {
        action_explain_irpp: "Explique-moi comment fonctionne le calcul de l'IRPP en 2026",
        action_explain_is: "Quels sont les taux d'IS en 2026 ?",
        action_explain_tva: "Quels sont les taux de TVA en 2026 ?",
        action_explain_rs: "Comment fonctionne la retenue à la source (RS) ?",
        action_explain_startup: "Quels sont les avantages du Startup Act ?",
        action_explain_zdr: "Quels sont les avantages fiscaux en zone de développement régional (ZDR) ?",
        action_calendar: "Quelles sont les prochaines échéances fiscales importantes ?",
        explainMyResult: "Explique-moi mon résultat de calcul"
    },

    // API settings - Google Gemini (FREE)
    gemini: {
        model: "gemini-1.5-flash", // Free tier model
        maxTokens: 800,
        temperature: 0.7,
        apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    },

    // n8n Chatbot Configuration
    n8n: {
        webhookUrl: "https://simulateur-fiscal.app.n8n.cloud/webhook/simulateur-fiscal", // Production URL
        enabled: false
    },

    // UI Transformation Config
    theme: {
        modern: true,
        wizardMode: false,
        glassIntensity: "high"
    },

    // Storage keys
    storage: {
        apiKey: "fiscal_ai_gemini_key",
        provider: "fiscal_ai_provider",
        conversationHistory: "fiscal_ai_conversation",
        preferences: "fiscal_ai_preferences"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
}
