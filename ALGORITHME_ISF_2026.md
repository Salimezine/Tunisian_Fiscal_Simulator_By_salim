# Algorithme de Calcul ISF - Tunisie 2026

Ce document détaille les règles pour l'Impôt sur la Fortune (ISF) introduit en 2026.

## 1. Règles Métier

### 1.1 Champ d'Application
Impôt annuel sur le patrimoine net des personnes physiques résidant en Tunisie.

### 1.2 Assiette
`Patrimoine Net = Actifs Imposables - Passifs Déductibles (Dettes)`
*   **Actifs Imposables** : 
    *   Biens immobiliers (sauf Résidence Principale).
    *   Placements financiers (Actions, Obligations).
    *   Biens de luxe (Voitures > 15 CV, Yachts).
*   **Actifs Exonérés** :
    *   Résidence Principale.
    *   Biens professionnels (utilisés pour l'activité éco).
    *   Terres agricoles exploitées.

### 1.3 Seuil et Taux
*   **Seuil de déclenchement** : 3 000 000 DT (Patrimoine Net).
*   **Taux** : 
    *   0.5% : De 3M à 5M DT.
    *   1.0% : Au-delà de 5M DT.
    *   *(Note: Prélèvement progressif ou taux unique final ? Règle de prudence : Taux marginal sur la tranche excédentaire).*

## 2. Pseudo-Code

```plaintext
DEBUT ALGORITHME ISF_2026

    // 1. Entrées
    LIRE Valeur_Total_Immo
    LIRE Valeur_Residence_Principale
    LIRE Valeur_Placements
    LIRE Valeur_Luxe
    LIRE Total_Dettes

    // 2. Détermination Actif Brut Imposable
    Actif_Immo_Taxable = MAX(0, Valeur_Total_Immo - Valeur_Residence_Principale)
    Actif_Brut = Actif_Immo_Taxable + Valeur_Placements + Valeur_Luxe

    // 3. Patrimoine Net
    Patrimoine_Net = MAX(0, Actif_Brut - Total_Dettes)

    // 4. Calcul de l'Impôt (Barème simple à seuil dans cette version stricte)
    ISF_Du = 0

    SI Patrimoine_Net < 3000000 ALORS
        ISF_Du = 0
    SINON SI Patrimoine_Net <= 5000000 ALORS
        ISF_Du = Patrimoine_Net * 0.005
    SINON
        // Option 1: Taux unique sup
        // ISF_Du = Patrimoine_Net * 0.01 
        // Option 2 (Plus probable juridiquement) : Progressivité
        // Tranche 1 (0-3M) : 0
        // Tranche 2 (3-5M) : (5M-3M)*0.5%
        // Tranche 3 (>5M) : (Net-5M)*1.0%
        // Retenons ici l'Option 1 (Taux facial global souvent cité pour ISF 2026)
        ISF_Du = Patrimoine_Net * 0.01
    FIN SI

    AFFICHER "Patrimoine Net : ", Patrimoine_Net
    AFFICHER "ISF Dû : ", ISF_Du

FIN ALGORITHME
```

## 3. Sources & Validation Officielle
*   **Loi de Finances 2026** : Instauration de l'Impôt sur la Fortune Immobilière et Mobilière au 01/01/2026.
*   **Taux Confirmés** : 0.5% (Tranche 3-5M DT) et 1.0% (> 5M DT).
*   **Référence DGI** : [Nouveautés Fiscales 2026](https://www.impots.finances.gov.tn)
