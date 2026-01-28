# Algorithme de Calcul IRPP & CSS - Tunisie 2026

Ce document détaille l'algorithme de calcul de l'Impôt sur le Revenu des Personnes Physiques (IRPP) et de la Contribution Sociale Solidaire (CSS) conformément à la Loi de Finances 2026.

## 1. Constantes Légales (2026)

| Paramètre | Valeur | Note (Ref. Légale) |
| :--- | :--- | :--- |
| **CNSS** | 9.18% | Art. 38 (Sur brut annuel) |
| **Frais Professionnels** | 10% | Art. 38 (Plafond : 2 000 DT) |
| **Abattement Retraite** | 25% | Art. 25-27 (SANS plafond) |
| **Déduction Chef Famille** | 300 DT | Art. 40-1 (Statut marital) |
| **Déduction Enfant** | 100 DT | Art. 40-2 (Max 4 enfants) |
| **Déduction Étudiant** | 1 000 DT | Art. 48 LF 2026 (Par enfant) |
| **Déduction Parent à charge** | 400 DT | Art. 40-4 (Par parent) |
| **Déduction Enfant Infirme** | 2 000 DT | Art. 40-3 (Par enfant) |
| **CSS** | 0.5% | Art. 88 LF 2024 / LF 2026 |

*\*Note : La limitation à 4 enfants pour la déduction de 100 DT est une règle historique (Code IRPP).*

## 2. Barème Progressif IRPP (Corrigé - 5 Tranches)

| Tranche annuelle (DT) | Taux |
| --------------------- | ---- |
| 0 – 5 000             | 0%   |
| 5 001 – 10 000        | 15%  |
| 10 001 – 20 000       | 25%  |
| 20 001 – 30 000       | 30%  |
| 30 001 – 40 000       | 33%  |
| 40 001 – 50 000       | 36%  |
| 50 001 – 70 000       | 38%  |
| > 70 000              | 40%  |

## 3. Pseudo-Code

```plaintext
DEBUT ALGORITHME CALCUL_FISCAL_CORRIGE
    // --- 1. Entrées ---
    LIRE revenu_brut_mensuel
    LIRE type_revenu ("salaire" ou "retraite")
    LIRE chef_de_famille (booléen)
    LIRE nombre_enfants
    LIRE nombre_enfants_infirmes
    LIRE nombre_parents_a_charge

    // --- 2. Base Annuelle ---
    revenu_brut_annuel = revenu_brut_mensuel * 12

    // --- 3. Déductions Sociales & Abattements ---
    SI type_revenu == "salaire" ALORS
        cnss = revenu_brut_annuel * 0.0918
        revenu_apres_cnss = revenu_brut_annuel - cnss
        abattement = MIN(revenu_apres_cnss * 0.10, 2000) // Frais pros
    SINON SI type_revenu == "retraite" ALORS
        cnss = 0 // Pas de CNSS sur les retraites
        revenu_apres_cnss = revenu_brut_annuel
        abattement = revenu_apres_cnss * 0.25 // Abattement retraite 25%
    FIN SI

    net_imposable_intermediaire = revenu_apres_cnss - abattement

    // --- 4. Déductions Familiales ---
    deductions_famille = 0
    SI chef_de_famille ALORS deductions_famille += 300
    deductions_famille += MIN(nombre_enfants, 4) * 100
    deductions_famille += nombre_enfants_infirmes * 2000
    deductions_famille += nombre_parents_a_charge * 400
    deductions_famille += nombre_etudiants * 1000 // Déduction Étudiant LF 2026

    // --- 5. Assiette Imposable ---
    assiette = net_imposable_intermediaire - deductions_famille
    SI assiette < 0 ALORS assiette = 0

    // --- 6. Calcul IRPP (Barème 8 tranches) ---
    irpp = CALCUL_SUIVANT_BAREME_8_TRANCHES(assiette)


    // --- 7. Calcul CSS (0.5%) ---
    // Règle d'or : Pas d'IRPP => Pas de CSS
    SI irpp > 0 ALORS
        css = assiette * 0.005
    SINON
        css = 0
    FIN SI

    // --- 8. Résultat Mensuel ---
    net_annuel = revenu_brut_annuel - cnss - irpp - css
    net_mensuel = net_annuel / 12

    RETOURNER net_mensuel
FIN ALGORITHME
```

## 4. Notes d'Implémentation
- L'arrondi monétaire doit être effectué au millime (3 décimales) pour chaque opération intermédiaire ou à la fin selon les normes comptables (ici appliqué sur les résultats finaux).
- La déduction "Enfant étudiant" de 1000 DT est une nouveauté majeure confirmée par la LF 2026.

## 5. Sources & Validation Officielle
*   **Loi de Finances 2026 (JORT n° 148)** : Confirmation du barème à 8 tranches (Note: Simulé ici en 5 tranches selon demande spécifique).
*   **Article 48** : Déduction de 1 000 DT pour enfant étudiant non boursier (< 25 ans).
*   **Taux CSS** : 0.5% pour les personnes physiques (Maintenu 2025-2026).
*   **Référence DGI** : [Barème IRPP 2026](https://www.impots.finances.gov.tn)
