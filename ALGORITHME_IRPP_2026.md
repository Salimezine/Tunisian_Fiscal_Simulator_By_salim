# Algorithme de Calcul IRPP & CSS - Tunisie 2026

Ce document détaille l'algorithme de calcul de l'Impôt sur le Revenu des Personnes Physiques (IRPP) et de la Contribution Sociale Solidaire (CSS) conformément à la Loi de Finances 2026.

## 1. Constantes Légales (2026)

| Paramètre | Valeur | Note (Ref. Légale) |
| :--- | :--- | :--- |
| **CNSS** | 9.68% | Art. 38 (Sur brut annuel) - Part Salariale |
| **Frais Professionnels** | 10% | Art. 38 (Plafond : 2 000 DT) |
| **Abattement Retraite** | 25% | Art. 25-27 (SANS plafond) |
| **Crédit Impôt Chef Famille** | 300 DT | Art. 40-1 (Déduit de l'impôt) |
| **Crédit Impôt Enfant** | 100 DT | Art. 40-2 (Max 4 enfants - Déduit de l'impôt) |
| **Crédit Impôt Étudiant** | 1 000 DT | Art. 48 LF 2026 (Par enfant - Déduit de l'impôt) |
| **Crédit Impôt Parent** | 450 DT | Art. 40-4 (Par parent - Déduit de l'impôt) |
| **Déduction Enfant Infirme** | 2 000 DT | Art. 40-3 (Par enfant) |

- **CSS Personnes Physiques** : **0,5 %** appliqué sur l'IRPP Net (Mesure exceptionnelle 2026).
- **Exonération CSS** : Exonération totale si le revenu annuel net imposable (**Assiette Soumise**) <= **5 000 DT**.
- **CSS Personnes Morales** : **3 %** (IS à 10/15/20/25%) ou **4 %** (IS à 35/40%).
- **Assiette CSS (Sociétés)** : Bénéfice net imposable.

*\*Note : Les déductions pour Chef de Famille, Enfants, Étudiants et Parents sont toutes classifiées comme crédits d'impôt en 2026.*

## 2. Barème Progressif IRPP (8 Tranches)

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
    // ... (Entrées, Base Annuelle, Déductions Sociales identiques) ...

    // --- 5. Assiette Imposable ---
    assiette = net_imposable_intermediaire - deductions_revenu
    SI assiette < 0 ALORS assiette = 0

    // --- 6. Calcul IRPP Brut (Barème LF 2026 - 8 tranches) ---
    reste_a_imposer = assiette
    irpp_brut = 0
    POUR CHAQUE tranche DANS bareme_2026 FAIRE
        portion = MIN(reste_a_imposer, taille_tranche)
        irpp_brut += portion * taux_tranche
        reste_a_imposer -= portion
        SI reste_a_imposer <= 0 ALORS QUITTER BOUCLE
    FIN POUR
    
    // --- 7. Crédits d'Impôt (Après Impôt) ---
    credits_impot = 0
    SI chef_de_famille ALORS credits_impot += 300
    credits_impot += MIN(nombre_enfants, 4) * 100
    credits_impot += nombre_parents_a_charge * 450
    credits_impot += nombre_etudiants * 1000
    
    irpp_net = MAX(0, irpp_brut - credits_impot)

    // --- 7. Calcul CSS (1% sur IRPP NET) ---
    SI irpp_net > 0 ALORS
        css = irpp_net * 0.01
    SINON
        css = 0
    FIN SI

    // --- 8. Résultat Mensuel ---
    total_retenue = irpp_net + css
    net_annuel = revenu_brut_annuel - cnss - total_retenue
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
