# Algorithme de Calcul RS (Retenue à la Source) - Tunisie 2026

Ce document détaille les taux et règles de calcul pour la Retenue à la Source, avec un focus sur la conformité TEJ.

## 1. Règles Métier

### 1.1 Assiette
*   La RS se calcule généralement sur le montant **Brut TTC** ou **Brut HT** selon la nature.
*   *Règle Générale* : 
    *   Honoraires / Loyers : Sur le montant Brut TTC.
    *   Marchés Publics : Sur le montant TTC.

### 1.2 Taux Communs (2026)
*   **15%** : Honoraires (Personnes Physiques), Commissions, Loyers spécifiques (Hôtels/Restaurants).
*   **10%** : **Loyers d'immeubles** (Taux Standard), Honoraires servis aux personnes morales assujetties.
*   **5%** : Honoraires (Personnes Physiques soumises au régime réel/Patente).
*   **3%** : Honoraires payés aux personnes morales soumises à l'IS.
*   **1.5%** : Marchés de travaux et fournitures.
*   **20%** : Rémunérations administrateurs.

### 1.3 RS sur TVA
*   **25%** : Retenue sur le montant de la TVA facturée (Organismes publics).
*   **100%** : Retenue sur TVA pour factures de non-résidents.

## 2. Pseudo-Code

```plaintext
DEBUT ALGORITHME RS_2026

    // 1. Entrées
    LIRE Montant_Brut_TTC
    LIRE Montant_TVA
    LIRE Type_Operation (HONORAIRES, LOYER, MARCHE_TRAVAUX, MARCHE_SERVICE)
    LIRE Type_Beneficiaire (PHYSIQUE, MORALE, NON_RESIDENT)

    // 2. Détermination du Taux RS (IRPP/IS)
    Taux_RS_Principal = 0

    SELON Type_Operation
        CAS HONORAIRES:
            SI Type_Beneficiaire == PHYSIQUE ALORS Taux_RS_Principal = 0.15
            SINON Taux_RS_Principal = 0.05 // Ou 3% selon cas, 5% défaut prudence
        CAS LOYER:
            Taux_RS_Principal = 0.15
        CAS MARCHE_TRAVAUX:
            Taux_RS_Principal = 0.015 (1.5%)
        CAS MARCHE_SERVICE:
            Taux_RS_Principal = 0.15 // Souvent requalifié en honoraires
    FIN SELON

    // 3. Calcul RS Principal
    RS_Principal = Montant_Brut_TTC * Taux_RS_Principal

    // 4. Calcul RS sur TVA (Si applicable - ex: Payeur État)
    LIRE Payeur_Est_Etat (Bool)
    RS_TVA = 0
    
    SI Payeur_Est_Etat EST VRAI ALORS
        RS_TVA = Montant_TVA * 0.25
    SINON SI Type_Beneficiaire == NON_RESIDENT ALORS
        RS_TVA = Montant_TVA * 1.00
    FIN SI

    // 5. Total Retenu et Net à Payer
    Total_Retenu = RS_Principal + RS_TVA
    Net_A_Payer = Montant_Brut_TTC - Total_Retenu

    AFFICHER "Montant Brut TTC : ", Montant_Brut_TTC
    AFFICHER "Retenue IRPP/IS : ", RS_Principal
    AFFICHER "Retenue TVA : ", RS_TVA
    AFFICHER "Net à Payer Fournisseur : ", Net_A_Payer
    AFFICHER ">> CERTIFICAT TEJ OBLIGATOIRE (Arrêté Jan 2026)"

FIN ALGORITHME
```

## 3. Sources & Validation Officielle
*   **Plateforme TEJ** : Usage obligatoire pour toutes les déclarations RS à partir du 01/01/2026 (Ministère des Finances).
*   **Loi de Finances 2026** : Élargissement du champ des produits soumis à retenue.
*   **Taux Loyers** : Standardisation à 10% pour la majorité des locations immobilières (hors hôtellerie).
*   **Référence DGI** : [Plateforme TEJ](https://tej.finances.gov.tn)
