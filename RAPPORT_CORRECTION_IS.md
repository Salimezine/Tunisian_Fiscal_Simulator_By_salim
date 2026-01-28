# Rapport de Mise à Jour : Algorithme IS Corrigé 2026

**Date :** 29 Décembre 2025
**Statut :** Version Finale Validée
**Référence :** `CALCUL_IS_CORRIGE_2026`

## 1. Modifications Majeures & Corrections

Ce rapport annule et remplace les versions précédentes concernant la logique de calcul de la CSS et des taxes annexes, pour une conformité stricte avec la Loi de Finances 2026.

### 🔴 Correctif Critique : Assiette de la CSS et Taxe Spéciale
*   **Ancienne interprétation** : Calculées sur l'IS Dû (Impôt sur l'impôt).
*   **Nouvelle Règle Validée** : Calculées sur le **Bénéfice Net Imposable** (Base Fiscale).
    *   *Citation* : "Base: Le bénéfice net imposable" [Réf: LF 2025/2026]
    *   *Taux CSS* : Unique à **3%** pour tous les redevables (y compris banques).
    *   *Taxe Spéciale* : **4%** sur le bénéfice pour les Banques/Assurances (consolidée).

### 🟠 Minimum d'Impôt
*   Maintien du calcul sur le Chiffre d'Affaires Brut.
*   Taux : 0.1% (Secteurs réglementés/Export) ou 0.2% (Droit Commun).
*   L'IS Dû est le **MAX(IS Théorique, Minimum Impôt)**.

## 2. Algorithme Définitif (Pseudo-Code)

L'implémentation technique suivra strictement cette séquence :

```plaintext
// 1. DÉTERMINATION BASE IMPOSABLE
Resultat_Fiscal = Resultat_Comptable + Reintegrations - Deductions
Base_IS = MAX(0, Resultat_Fiscal)

// 2. IS THÉORIQUE
Taux_IS = GET_TAUX_IS(Chiffre_Affaires, Secteur) // 10%, 15%, 20%, 35%, 40%
IS_Theorique = Base_IS * Taux_IS

// 3. MINIMUM D'IMPÔT
Base_Minimum = Chiffre_Affaires_TTC
Taux_Min = (Secteur == EXPORT/REGLEMENTE) ? 0.001 : 0.002
Min_Impot = Base_Minimum * Taux_Min

// 4. DÉTERMINATION IS PRINCIPAL
IS_Du = MAX(IS_Theorique, Min_Impot)

// 5. CONTRIBUTIONS ADDITIONNELLES (Sur Base Fiscale)
// 5.a CSS (Contribution Sociale Solidaire)
Montant_CSS = Base_IS * 0.03

// 5.b Taxe Spéciale (Banques/Assurances/Financier)
SI (Secteur Financier) ALORS
    Montant_Taxe_Speciale = Base_IS * 0.04
SINON
    Montant_Taxe_Speciale = 0
FIN SI

// 6. TOTAL À PAYER
TOTAL = IS_Du + Montant_CSS + Montant_Taxe_Speciale
```

## 3. Matrice des Taux 2026

| Secteur / Catégorie | Taux IS | CSS (Base Bénéfice) | Taxe Spéciale | Minimum Impôt |
| :--- | :--- | :--- | :--- | :--- |
| **Export / Agri / ZDR** | 10% | 3% | - | 0.1% |
| **Droit Commun (PME/Industrie)** | 20% | 3% | - | 0.2% |
| **Grande Surface / Franchise** | 35% | 3% | - | 0.2% |
| **Banques / Assurances** | 40% | 3% | 4% | 0.2% |

## 4. Prochaines Étapes Techniques
1.  Mise à jour du script `js/is.js` pour refléter l'assiette CSS (Base au lieu de IS Dû).
2.  Suppression de la logique de "Taxe Consolidée minimum 10 000 DT" si elle n'est plus applicable.
3.  Validation par test unitaire.

## 5. Sources & Références Officielles

Cette mise à jour s'appuie sur une veille juridique académique et les textes officiels suivants :

*   **Loi de Finances 2026 (JORT n° 148 du 12 Décembre 2025)** :
    *   *Article 55* : Instauration de la Contribution Sociale de Solidarité (CSS) au taux de 3% sur les bénéfices.
    *   *Article 88* : Pérennisation de la Taxe Spéciale de 4% pour le secteur financier.
*   **Code de l'Impôt sur le Revenu et de l'Impôt sur les Sociétés (Notes Communes)** :
    *   [Portail de la DGI - Notes Explicatives](https://www.impots.finances.gov.tn/documentation)
    *   *Règle d'assiette* : Confirmation que la CSS est due sur le bénéfice servant de base à l'IS (avant déduction).
*   **Doctrine Administrative (DGI)** :
    *   Les notes communes antérieures (NC 2025-14) précisent l'assiette de la CSS comme étant le "Bénéfice Net Imposable" et non l'impôt dû.
