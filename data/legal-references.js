/**
 * Legal Reference Database for Tunisian Finance Laws 2024-2026
 * 
 * This database contains all legal articles, tax brackets, ceilings, and rules
 * for IRPP, IS, TVA, CSS, and other fiscal regulations across multiple Finance Law versions.
 * 
 * References:
 * - Code IRPP/IS: https://www.legislation.tn/detailtexte/CodeIRPPIS
 * - Lois de Finances: https://www.finances.gov.tn/fr/lois-de-finances
 * - DGI Tunisia: https://www.impots.finances.gov.tn
 */

const LegalReferenceDatabase = {

    // ==================== IRPP (Impôt sur le Revenu des Personnes Physiques) ====================

    irpp: {

        // Tax brackets configuration per Finance Law version
        brackets: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Article 44 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                description: "Barème progressif à 8 tranches",
                tranches: [
                    { min: 0, max: 5000, rate: 0, description: "Exonération jusqu'à 5 000 DT" },
                    { min: 5000, max: 10000, rate: 0.26, description: "26% de 5 000 à 10 000 DT" },
                    { min: 10000, max: 15000, rate: 0.28, description: "28% de 10 000 à 15 000 DT" },
                    { min: 15000, max: 20000, rate: 0.32, description: "32% de 15 000 à 20 000 DT" },
                    { min: 20000, max: 30000, rate: 0.35, description: "35% de 20 000 à 30 000 DT" },
                    { min: 30000, max: 50000, rate: 0.37, description: "37% de 30 000 à 50 000 DT" },
                    { min: 50000, max: 100000, rate: 0.39, description: "39% de 50 000 à 100 000 DT" },
                    { min: 100000, max: Infinity, rate: 0.40, description: "40% au-delà de 100 000 DT" }
                ]
            },
            "2025": {
                version: "Loi de Finances 2025",
                article: "Article 44 du Code IRPP (ancien)",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                description: "Ancien barème à 5 tranches",
                tranches: [
                    { min: 0, max: 5000, rate: 0, description: "Exonération jusqu'à 5 000 DT" },
                    { min: 5000, max: 20000, rate: 0.26, description: "26% de 5 000 à 20 000 DT" },
                    { min: 20000, max: 30000, rate: 0.28, description: "28% de 20 000 à 30 000 DT" },
                    { min: 30000, max: 50000, rate: 0.32, description: "32% de 30 000 à 50 000 DT" },
                    { min: 50000, max: Infinity, rate: 0.35, description: "35% au-delà de 50 000 DT" }
                ]
            },
            "2024": {
                version: "Loi de Finances 2024",
                article: "Article 44 du Code IRPP (ancien)",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                description: "Ancien barème à 5 tranches",
                tranches: [
                    { min: 0, max: 5000, rate: 0, description: "Exonération jusqu'à 5 000 DT" },
                    { min: 5000, max: 20000, rate: 0.26, description: "26% de 5 000 à 20 000 DT" },
                    { min: 20000, max: 30000, rate: 0.28, description: "28% de 20 000 à 30 000 DT" },
                    { min: 30000, max: 50000, rate: 0.32, description: "32% de 30 000 à 50 000 DT" },
                    { min: 50000, max: Infinity, rate: 0.35, description: "35% au-delà de 50 000 DT" }
                ]
            }
        },

        // Deductions and allowances
        deductions: {
            student: {
                article: "Article 40 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                amount: 1000,
                description: "Déduction pour enfant étudiant (1 000 DT par étudiant)",
                applicationType: "base_abatement" // Applied before tax calculation
            },
            family: {
                article: "Article 40 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                spouse: 300,
                children: [150, 100, 100, 100], // First child, second, third, fourth+
                description: "Déductions familiales"
            },
            professionalExpenses: {
                article: "Article 40 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                rate: 0.10, // 10% of gross salary
                description: "Déduction forfaitaire pour frais professionnels (10%)"
            }
        },

        // Special cases
        specialCases: {
            retirement: {
                article: "Article 38 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                description: "Régime spécial pour pensions de retraite",
                incompatibleWith: ["cnss"] // Cannot combine CNSS with retirement
            },
            exoneration: {
                article: "Article 38 du Code IRPP",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                description: "Revenus exonérés d'IRPP",
                types: [
                    "Certains revenus agricoles",
                    "Revenus d'exportation (conditions spécifiques)",
                    "Revenus des zones de développement régional (ZDR)"
                ]
            }
        }
    },

    // ==================== CSS (Contribution Sociale de Solidarité) ====================

    css: {
        rates: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Article 58 de la Loi de Finances 2026",
                url: "https://www.finances.gov.tn/fr/lois-de-finances",
                individual: 0.01, // 1% for individuals
                company: 0.03, // 3% for companies
                description: "CSS applicable sur le revenu net après déductions"
            },
            "2025": {
                version: "Loi de Finances 2025",
                article: "Article 58 de la Loi de Finances 2025",
                url: "https://www.finances.gov.tn/fr/lois-de-finances",
                individual: 0.01, // 1%
                company: 0.03, // 3%
                description: "CSS applicable sur le revenu net après déductions"
            },
            "2024": {
                version: "Loi de Finances 2024",
                article: "Article 58 de la Loi de Finances 2024",
                url: "https://www.finances.gov.tn/fr/lois-de-finances",
                individual: 0.01, // 1%
                company: 0.03, // 3%
                description: "CSS applicable sur le revenu net après déductions"
            }
        },
        rules: {
            incompatibleWithRetirement: {
                article: "Article 58 de la Loi de Finances",
                url: "https://www.finances.gov.tn/fr/lois-de-finances",
                description: "La CSS ne s'applique pas aux pensions de retraite"
            },
            requiresPositiveIRPP: {
                article: "Règlement CSS",
                url: "https://www.impots.finances.gov.tn",
                description: "La CSS n'est exigible que si l'IRPP est positif",
                warning: "ATTENTION: CSS avec IRPP nul détecté - incohérence juridique"
            }
        }
    },

    // ==================== IS (Impôt sur les Sociétés) ====================

    is: {
        rates: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Article 49 du Code IS",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                standard: 0.15, // 15% standard
                financial: 0.35, // 35% for financial institutions
                description: "Taux IS selon secteur d'activité"
            }
        },
        minimumTax: {
            article: "Article 12 de la Loi de Finances 2026",
            url: "https://www.finances.gov.tn/fr/lois-de-finances",
            rate: 0.002, // 0.2% of turnover
            description: "Impôt minimum forfaitaire (IMF) - 0.2% du CA",
            rule: "L'IS dû ne peut être inférieur à 0.2% du chiffre d'affaires"
        },
        cssCompany: {
            article: "Article 58 de la Loi de Finances 2026",
            url: "https://www.finances.gov.tn/fr/lois-de-finances",
            rate: 0.03, // 3%
            description: "CSS société - 3% du bénéfice imposable"
        },
        taxeConsolidee: {
            article: "Code IS",
            url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
            financialSector: 0.04, // 4% for financial institutions
            description: "Taxe consolidée pour secteur financier - 4%"
        },
        zdr: {
            article: "Code d'Incitation aux Investissements (CII)",
            url: "https://www.legislation.tn",
            zones: {
                zone1: {
                    description: "Zone de développement régional prioritaire (1ère catégorie)",
                    exemptionYears: 10,
                    rateAfterExemption: 0, // 0% total exemption for 10 years
                    governorates: ["Kasserine", "Sidi Bouzid", "Kairouan", "Jendouba", "Le Kef", "Siliana", "Tataouine", "Kebili", "Tozeur", "Gafsa", "Medenine", "Gabès"]
                },
                zone2: {
                    description: "Zone de développement régional (2ème catégorie)",
                    exemptionYears: 5,
                    rateAfterExemption: 0.10, // 10% for next 5 years, then standard
                    governorates: ["Béja", "Zaghouan", "Mahdia", "Sfax", "Monastir", "Sousse", "Bizerte"]
                }
            },
            description: "Avantages fiscaux pour investissements en ZDR"
        }
    },

    // ==================== TVA (Taxe sur la Valeur Ajoutée) ====================

    tva: {
        rates: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Articles 6 et 7 du Code TVA",
                url: "https://www.legislation.tn",
                standard: 0.19, // 19%
                intermediate: 0.13, // 13%
                reduced1: 0.07, // 7%
                reduced2: 0.075, // 7.5% (nouvelle catégorie 2026)
                categories: {
                    "19%": ["Services généraux", "Commerce de détail", "Prestations standard"],
                    "13%": ["Restauration", "Hôtellerie", "Services touristiques"],
                    "7%": ["Produits alimentaires de base", "Médicaments", "Équipements médicaux", "Recharge véhicules électriques (nouveau 2026)"],
                    "7.5%": ["Nouvelles catégories LF 2026"]
                },
                description: "Taux TVA applicables selon la nature de l'opération"
            }
        },
        eInvoicing: {
            article: "Article 18 de la Loi de Finances 2026",
            url: "https://www.finances.gov.tn/fr/lois-de-finances",
            mandatory: true,
            mandatoryDate: "2026-01-01",
            description: "Facturation électronique obligatoire à partir de 2026",
            warning: "ATTENTION: La facturation électronique est obligatoire pour toutes les opérations TVA à partir du 1er janvier 2026"
        }
    },

    // ==================== RS (Retenue à la Source) ====================

    rs: {
        rates: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Code IRPP - Retenue à la source",
                url: "https://www.legislation.tn/detailtexte/CodeIRPPIS",
                realEstate: 0.10, // 10% for real estate rents
                professionalServices: 0.15, // 15% for professional services
                description: "Taux de retenue à la source selon la nature du revenu"
            }
        },
        tejPlatform: {
            article: "Arrêté du Ministère des Finances 2025",
            url: "https://www.impots.finances.gov.tn",
            mandatory: true,
            description: "Plateforme TEJ obligatoire pour la délivrance des attestations de retenue à la source",
            warning: "OBLIGATOIRE: Utiliser la plateforme TEJ pour générer l'attestation de retenue à la source"
        }
    },

    // ==================== ISF (Impôt sur la Fortune) ====================

    isf: {
        rates: {
            "2026": {
                version: "Loi de Finances 2026",
                article: "Code des droits d'enregistrement et de timbre",
                url: "https://www.legislation.tn",
                brackets: [
                    { min: 0, max: 1000000, rate: 0, description: "Exonération jusqu'à 1 000 000 DT" },
                    { min: 1000000, max: 2000000, rate: 0.005, description: "0.5% de 1M à 2M DT" },
                    { min: 2000000, max: Infinity, rate: 0.01, description: "1% au-delà de 2M DT" }
                ],
                description: "Barème ISF - Impôt sur la fortune (patrimoine net)"
            }
        }
    },

    // ==================== CNSS (Caisse Nationale de Sécurité Sociale) ====================

    cnss: {
        rates: {
            employee: 0.0925, // 9.25%
            employer: 0.1625, // 16.25%
            total: 0.255, // 25.5%
            article: "Code de Sécurité Sociale",
            url: "http://www.cnss.tn",
            description: "Cotisations sociales CNSS",
            ceiling: 6000, // Plafond mensuel de 6 000 DT
            incompatibleWith: ["retirement"]
        }
    },

    // ==================== VALIDATION RULES ====================

    validationRules: {
        cnssRetirementIncompatibility: {
            id: "RULE_001",
            severity: "ERROR",
            article: "Code de Sécurité Sociale + Code IRPP",
            message: "INCOHÉRENCE JURIDIQUE: Les cotisations CNSS ne s'appliquent pas aux pensions de retraite",
            blocking: true // Blocks in Audit mode
        },
        cssNullIrpp: {
            id: "RULE_002",
            severity: "WARNING",
            article: "Règlement CSS",
            message: "ATTENTION: La CSS est calculée alors que l'IRPP est nul. Vérifier la cohérence juridique.",
            blocking: true // Blocks in Audit mode
        },
        deductionCeilingExceeded: {
            id: "RULE_003",
            severity: "ERROR",
            article: "Article 40 du Code IRPP",
            message: "DÉPASSEMENT DE PLAFOND: Les déductions dépassent le plafond légal autorisé",
            blocking: true
        },
        minimumTaxIS: {
            id: "RULE_004",
            severity: "WARNING",
            article: "Article 12 de la Loi de Finances 2026",
            message: "L'IS calculé est inférieur au minimum forfaitaire (0.2% du CA). Application du minimum.",
            blocking: false // Just a warning
        },
        eInvoicingRequired: {
            id: "RULE_005",
            severity: "INFO",
            article: "Article 18 de la Loi de Finances 2026",
            message: "INFO: La facturation électronique est obligatoire pour cette opération TVA en 2026",
            blocking: false
        },
        tejPlatformRequired: {
            id: "RULE_006",
            severity: "INFO",
            article: "Arrêté Ministériel 2025",
            message: "INFO: L'attestation de retenue à la source doit être générée via la plateforme TEJ",
            blocking: false
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LegalReferenceDatabase;
}
