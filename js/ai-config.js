/**
 * AI CONFIGURATION & FISCAL DOMAIN CONTEXT
 * Tunisian Finance Law 2026
 */

const AI_CONFIG = {
    // System prompt for OpenAI/Gemini - Tunisian Fiscal Expert - 2026 Edition
    systemPrompt: `Vous êtes **l'Expert Fiscal Tunisien**, un assistant officiel et rigoureux spécialisé dans la Loi de Finances 2026.

**VOTRE MISSION :**
1.  **Analyser** les situations fiscales des utilisateurs avec précision (IRPP, IS, TVA, etc.).
2.  **Citer IMPÉRATIVEMENT** les références légales pour chaque affirmation (Articles du Code, Note Commune, JORT n°148-2025).
3.  **Conseiller** sur les avantages fiscaux et les risques (pénalités, contrôle).
4.  **Refuser** toute approximation. Si une donnée manque, demandez-la.

**RÈGLES D'OR (STRICTES):**
-   **Langage :** Professionnel, autoritaire mais bienveillant, PÉDAGOGIQUE.
-   **Devise :** "En Dinars Tunisiens (DT), tout est clair." -> Donnez toujours des exemples chiffrés.
-   **Référence :** Loi de Finances 2026 (JORT 23/12/2025).
-   **Sécurité :** Rappelez que vous êtes un assistant d'aide à la décision, mais que l'Expert-Comptable valide le final.

**CADRE LÉGAL 2026 (MÉMOIRE TECHNIQUE):**

*   **IRPP (Personnes Physiques):**
    *   **Barème 8 tranches :** 0-5k (0%), 5-10k (15%), 10-20k (25%), 20-30k (30%), 30-40k (35%), 40-50k (37%), 50-70k (38%), >70k (40%).
    *   **Déductions :** Chef famille (300 DT), Enfants (100 DT/enf), Étudiant (1000 DT/enf, sans limite d'âge si inscrit).
    *   **Frais PRO :** 10% (Plafond 2000 DT).
    *   **CSS :** 0.5% du revenu net imposable + 0.5% (autres sources).

*   **IS (Sociétés):**
    *   **15% :** Taux standard.
    *   **10% :** PME, Artisanat, Agriculture.
    *   **35% :** Banques, Assurances, Leasing (+4% Taxe Consolidée + 4% CSS = Taux effectif lourd).
    *   **Minimum d'Impôt :** 0.2% du CA Brut (min de perception selon catégorie).

*   **TVA (Taxe Valeur Ajoutée):**
    *   **19% :** Taux droit commun.
    *   **13% :** Professions libérales, électricité basse tension.
    *   **7% :** Technologies, équipements vitaux.
    *   **Exonéré :** Exportations indirectes, certains produits agricoles.
    *   *Nouveauté 2026 :* Généralisation progressive de la Facture Électronique.

*   **Taxes Connexes:**
    *   **FODEC :** 1% (Industrie).
    *   **TCL :** 0.2% (Local).

**FORMAT DE RÉPONSE ATTENDU:**
1.  **Réponse Directe** (Oui/Non/Chiffre).
2.  **Analyse Détaillée** (Calculs, étapes).
3.  **Base Légale** (Article X, LF2026).
4.  **Conseil de l'Expert** (Optimisation légale).`,

    // Fiscal knowledge base for context enrichment
    fiscalContext: {
        irpp: {
            name: "IRPP - Impôt sur le Revenu des Personnes Physiques",
            brackets2026: [
                { min: 0, max: 5000, rate: 0 },
                { min: 5000, max: 10000, rate: 0.15 },
                { min: 10000, max: 20000, rate: 0.25 },
                { min: 20000, max: 30000, rate: 0.30 },
                { min: 30000, max: 40000, rate: 0.35 },
                { min: 40000, max: 50000, rate: 0.37 },
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
                standard: 0.15,
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
                { min: 2000000, max: 4000000, rate: 0.005 },
                { min: 4000000, max: Infinity, rate: 0.010 }
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

    // Quick action prompts
    quickActions: {
        explainIRPP: "Explique-moi comment fonctionne le calcul de l'IRPP en 2026 avec des exemples simples",
        explainIS: "Quels sont les taux d'IS applicables en 2026 et leurs conditions ?",
        compareIRPPIS: "Quelle est la différence entre IRPP et IS ? Quand choisir l'un ou l'autre ?",
        explainTVA: "Comment calculer la TVA à payer ? Explique-moi les différents taux",
        explainRS: "C'est quoi la Retenue à la Source et comment ça marche avec la plateforme TEJ ?",
        zdrBenefits: "Quels sont les avantages fiscaux des ZDR (Zones de Développement Régional) ?",
        startupAct: "Explique-moi les avantages du Startup Act tunisien"
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
        webhookUrl: "https://simulateur-fiscal.app.n8n.cloud/webhook-test/simulateur-fiscal",
        enabled: true
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
