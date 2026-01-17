# Livrables : Algorithmes Fiscaux Certifiés 2026

Ce document recense l'ensemble des modules fiscaux dont les algorithmes ont été audités, corrigés et validés pour une conformité stricte avec la Loi de Finances 2026.

## 1. Modules Principaux

### 📘 [IRPP - Impôt sur le Revenu](file:///c:/Users/ezzin/Downloads/fiscal/ALGORITHME_IRPP_2026.md)
*   **Script Validé** : `irpp_algo_2026.js`
*   **Points Clés** : Barème progressif 2026, Déduction "Étudiant" (1000 DT), Plafond Frais Pros (2000 DT).

### 📙 [IS - Impôt Sociétés (Strict)](file:///c:/Users/ezzin/Downloads/fiscal/ALGORITHME_IS_2026.md)
*   **Script Validé** : `is_algo_2026_strict.js`
*   **Corrections Majeures** : Minimum d'Impôt toujours dû (même sous ZDR), CSS calculée sur l'IS Dû.

### 📗 [TVA - Taxe Valeur Ajoutée](file:///c:/Users/ezzin/Downloads/fiscal/ALGORITHME_TVA_2026.md)
*   **Script Validé** : `tva_algo_2026.js`
*   **Fonctionnalités** : Gestion Multi-taux (19, 13, 7%), Prorata de déduction, Suspension.

### 📓 [ISF - Impôt sur la Fortune](file:///c:/Users/ezzin/Downloads/fiscal/ALGORITHME_ISF_2026.md)
*   **Script Validé** : `isf_algo_2026.js`
*   **Règles** : Seuil de déclenchement à 3M DT, Exonération Résidence Principale.

### 📕 [RS - Retenue à la Source](file:///c:/Users/ezzin/Downloads/fiscal/ALGORITHME_RS_2026.md)
*   **Script Validé** : `rs_algo_2026.js`
*   **Conformité** : Taux spécifiques (Loyers, Marchés), Retenue sur TVA (Secteur Public), Alertes TEJ.

## 2. Statut de Validation

| Module | Statut Juridique | Test Technique |
| :--- | :--- | :--- |
| **IRPP** | ✅ Conforme LF 2026 | ✅ Succès |
| **IS** | ✅ Conforme & Strict | ✅ Succès |
| **TVA** | ✅ Conforme | ✅ Succès |
| **ISF** | ✅ Conforme | ✅ Succès |
| **RS** | ✅ Conforme | ✅ Succès |

## 3. Utilisation
Chaque algorithme est fourni avec :
1.  Un document de conception (`.md`) pour l'audit.
2.  Un script exécutable (`.js`) pour la simulation.

Pour tester un module, utiliser la commande : `node [nom_du_script].js`
