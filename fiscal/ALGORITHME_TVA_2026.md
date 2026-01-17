# Algorithme de Calcul TVA - Tunisie 2026

Ce document détaille les règles strictes de gestion de la Taxe sur la Valeur Ajoutée (TVA) pour 2026.

## 1. Règles Métier

### 1.1 Taux en Vigueur
*   **19%** : Taux standard (Biens et services courants).
*   **13%** : Professions libérales (Avocats, Experts), Immobilier professionnel.
*   **7%** : Technologies de l'information, Santé, Transport, **Recharge Véhicules Électriques (Nouv. 2026)**.
*   **0%** : Exportations, Vente en suspension (Sur autorisation).

### 1.2 Mécanisme de Calcul
`TVA à Payer = (TVA Collectée - TVA Déductible - Crédit Reportable)`
*   **TVA Collectée** : CA Hors Taxe × Taux.
*   **TVA Déductible** : Sur achats (Biens, Services, Immobilisations).
*   **Prorata** : Si l'entreprise a une activité mixte (Assujettie / Non Assujettie), la déduction est limitée au pourcentage de chiffre d'affaires assujetti.
*   **Suspension** : Si certificat valide, TVA Collectée = 0 (mais droit à déduction maintenu).

## 2. Pseudo-Code

```plaintext
DEBUT ALGORITHME TVA_2026

    // 1. Entrées
    LIRE CA_HT_Local
    LIRE CA_Export (Taux 0%)
    LIRE Taux_Applicable (19%, 13%, 7%)
    LIRE Suspension_Valide (Bool)
    
    LIRE Achats_TTC_Exploitation
    LIRE Achats_TTC_Immo
    LIRE Credit_Reportable_Mois_Precedent

    // 2. TVA Collectée
    SI Suspension_Valide EST VRAI ALORS
        TVA_Collectee = 0
    SINON
        TVA_Collectee = CA_HT_Local * Taux_Applicable
    FIN SI
    // Export est toujours à 0%

    // 3. Prorata de Déduction (% d'activité imposable)
    CA_Total = CA_HT_Local + CA_Export
    CA_Imposable = CA_HT_Local + CA_Export // Export ouvre droit à déduction
    Prorata = 100% // Simplification ici (supposons tout ouvre droit)
    
    // 4. Base Déductible (Conversion TTC -> HT si nécessaire, ici on suppose saisie TVA directe ou calcul inverse)
    // Supposons entrée des montants de TVA déductible directement pour précision
    LIRE MT_TVA_Ded_Exploitation
    LIRE MT_TVA_Ded_Immo
    
    Total_Deductible = (MT_TVA_Ded_Exploitation + MT_TVA_Ded_Immo) * Prorata
    
    // 5. Calcul Final
    Solde = TVA_Collectee - Total_Deductible - Credit_Reportable_Mois_Precedent
    
    SI Solde > 0 ALORS
        AFFICHER "TVA À PAYER : ", Solde
    SINON
        AFFICHER "CRÉDIT DE TVA À REPORTER : ", ABS(Solde)
    FIN SI

FIN ALGORITHME
```

## 3. Sources & Validation Officielle
*   **Loi de Finances 2026** : Extension du taux de 7% (Bornes de recharge, Équipements culturels).
*   **Facturation Électronique** : Obligatoire pour tous les services dès le 01/01/2026 (Lutte contre la fraude).
*   **Référence DGI** : [Taux TVA 2026](https://www.impots.finances.gov.tn)
