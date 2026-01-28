# Algorithme de Calcul de l'IS - Tunisie 2026 (CORRIGÉ & VALIDÉ)

Ce document décrit l'algorithme strict pour le calcul de l'Impôt sur les Sociétés, conforme aux directives de la Loi de Finances 2026, incluant les corrections juridiques majeures.

## 1. Règles Fondamentales Strictes

### 1. Assiette de la CSS
**Règle** : La Contribution Sociale Solidaire (CSS) est calculée sur le montant du **Bénéfice Net Imposable**.
*Taux : 3% (Standard) ou 4% (Institutions Financières).*


### 2. Le Minimum d'Impôt (Barrière Infranchissable)
**Règle** : Le minimum d'impôt est **TOUJOURS DÛ**, même en cas de déficit ou d'exonération (ZDR).
*Base : Chiffre d'Affaires TTC + Produits Financiers.*

### 3. Hiérarchie ZDR
Les avantages ZDR (exonération 5 ou 10 ans) s'appliquent uniquement à l'**IS Théorique**. Ils n'exonèrent pas du Minimum d'Impôt.

## 2. Pseudo-Code Certifié

```plaintext
DEBUT ALGORITHME CALCUL_IS_STRICT

    // 1. Détermination de la Base Imposable
    Resultat_Fiscal = Resultat_Comptable + Reintegrations - Deductions
    Base_IS = MAX(0, Resultat_Fiscal)

    // 2. Calcul IS Théorique (Avant Minimum)
    Taux_Facial = GET_TAUX_SECTEUR(Secteur) // 10%, 20%, 35%, 40%
    
    // Application Exonération ZDR
    SI (ZDR_ZONE == 1 ET ANNEE <= 5) OU (ZDR_ZONE == 2 ET ANNEE <= 10) ALORS
        Taux_Effectif = 0%
    SINON SI (ZDR_ZONE != NULL) ALORS
        Taux_Effectif = 10%
    SINON
        Taux_Effectif = Taux_Facial
    FIN SI
    
    IS_Theorique = Base_IS * Taux_Effectif

    // 3. Calcul Minimum d'Impôt
    Base_Min = CA_TTC + Produits_Financiers
    SI Secteur IN [AGRI, EXPORT, REGLEMENTE] OU Taux_Facial == 10% ALORS
        Taux_Min = 0.001 (0.1%)
    SINON
        Taux_Min = 0.002 (0.2%)
    FIN SI
    
    Min_Impot_Du = Base_Min * Taux_Min

    // 4. Détermination IS Dû
    IS_Du = MAX(IS_Theorique, Min_Impot_Du)

### 4. Contributions Additionnelles LF 2026 (Non-déductibles)
- **Contribution Stratégique (4%)** : Due par les banques, assurances, télécoms et **concessionnaires automobiles**.
- **Prélèvement Justice Environnementale (1%)** : Dû par les entreprises manufacturières et extractives.
- **Assiette** : Ces contributions sont calculées sur la même base que l’IS.

## 2. Pseudo-Code Certifié

```plaintext
DEBUT ALGORITHME CALCUL_IS_STRICT

    // 1. Détermination de la Base Imposable
    Resultat_Fiscal = Resultat_Comptable + Reintegrations - Deductions
    Base_IS = MAX(0, Resultat_Fiscal)

    // 2. Calcul IS Théorique (Avant Minimum)
    Taux_Facial = GET_TAUX_SECTEUR(Secteur) // 10%, 15%, 35%
    
    // Application Exonération ZDR
    SI (ZDR_ZONE == 1 ET ANNEE <= 5) OU (ZDR_ZONE == 2 ET ANNEE <= 10) ALORS
        Taux_Effectif = 0%
    SINON SI (ZDR_ZONE != NULL) ALORS
        Taux_Effectif = 10%
    SINON
        Taux_Effectif = Taux_Facial
    FIN SI
    
    IS_Theorique = Base_IS * Taux_Effectif

    // 3. Calcul Minimum d'Impôt
    Base_Min = CA_TTC + Produits_Financiers
    SI Secteur IN [AGRI, EXPORT, SANTE] OU Taux_Facial == 10% ALORS
        Taux_Min = 0.001 (0.1%)
    SINON
        Taux_Min = 0.002 (0.2%)
    FIN SI
    
    Min_Impot_Du = Base_Min * Taux_Min

    // 4. Détermination IS Dû
    IS_Du = MAX(IS_Theorique, Min_Impot_Du)

    // 5. Contributions (Sur Base Imposable)
    
    // 5.a CSS (3% ou 4%)
    Taux_CSS = (Taux_Facial >= 0.35) ? 0.04 : 0.03
    Montant_CSS = Base_IS * Taux_CSS

    // 5.b Contribution Stratégique (4%)
    SI Secteur IN [BANQUE, ASSURANCE, TELECOM, AUTO] ALORS
        Montant_Strategic = Base_IS * 0.04
    FIN SI

    // 5.c Prélèvement Justice Env. (1%)
    SI Secteur IN [INDUSTRIE, EXTRACTION] ALORS
        Montant_Env = Base_IS * 0.01
    FIN SI

    // 6. Total
    TOTAL_A_PAYER = IS_Du + Montant_CSS + Montant_Strategic + Montant_Env

FIN ALGORITHME
```
