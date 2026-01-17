# RÉPUBLIQUE TUNISIENNE
# MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE

**MÉMOIRE DE LICENCE EN INFORMATIQUE DE GESTION**
*(Option : Systèmes d'Information et Logiciels)*

---

# Projet de Fin d'Études (Sans Stage)

**Sujet : Conception et Réalisation d'un Simulateur Fiscal Intelligent (Loi de Finances 2026)**

**Présenté par :** Mouhamed Salim Ezzine
**Sous la direction de :** [Nom du Directeur]

**Année Universitaire : 2025 - 2026**

---
<div style="page-break-after: always;"></div>

# DÉDICACES & REMERCIEMENTS

*(Page réservée pour vos remerciements personnels)*

Je tiens tout d'abord à remercier mon encadrant académique, **[Nom du Directeur]**, pour ses conseils avisés, sa disponibilité et la confiance qu'il m'a témoignée tout au long de ce travail.

Mes remerciements vont également au corps professoral de l'Institut Supérieur d'Administration des Affaires de Sfax (ISAAS) pour la qualité de l'enseignement dispensé durant mon cursus.

Enfin, je remercie ma famille et mes amis pour leur soutien indéfectible.

<div style="page-break-after: always;"></div>

# SOMMAIRE

1.  Introduction Générale
2.  Chapitre 1 : Cadre Théorique - La Fiscalité Tunisienne à l'Ère du Numérique
3.  Chapitre 2 : Cadre Empirique - Conception et Réalisation du Simulateur Fiscal 2026
4.  Conclusion Générale

<div style="page-break-after: always;"></div>

# LISTE DES TABLEAUX ET FIGURES

**(Exemple de liste, à mettre à jour avec les numéros de page finaux)**

*   **Figure 1** : Architecture MVC de l'application
*   **Figure 2** : Diagramme de Cas d'Utilisation
*   **Figure 3** : Interface de simulation IRPP
*   **Figure 4** : Module Conseiller Fiscal IA
*   **Tableau 1** : Barème IRPP 2026 vs 2025
*   **Tableau 2** : Taux d'IS par secteur d'activité

---

# LISTE DES ABRÉVIATIONS

*   **IRPP** : Impôt sur le Revenu des Personnes Physiques
*   **IS** : Impôt sur les Sociétés
*   **TVA** : Taxe sur la Valeur Ajoutée
*   **CSS** : Contribution Sociale Solidaire
*   **LF** : Loi de Finances
*   **ZDR** : Zone de Développement Régional
*   **TEJ** : Plateforme de télé-déclaration et télé-paiement
*   **HTML** : HyperText Markup Language
*   **CSS** : Cascading Style Sheets (Attention : contexte informatique)
*   **JS** : JavaScript

<div style="page-break-after: always;"></div>

# INTRODUCTION GÉNÉRALE

La fiscalité constitue le pilier central de l'économie d'un pays, permettant à l'État de mobiliser les ressources nécessaires pour financer les services publics et les investissements de développement. En Tunisie, le système fiscal subit régulièrement des réformes pour s'adapter aux impératifs économiques et sociaux, ainsi qu'aux exigences de modernisation et de digitalisation.

L'année 2026 marque un tournant significatif avec l'entrée en vigueur de nouvelles dispositions législatives ambitieuses au sein de la Loi de Finances. Ces réformes touchent aussi bien l'Impôt sur le Revenu des Personnes Physiques (IRPP) que l'Impôt sur les Sociétés (IS) et la Taxe sur la Valeur Ajoutée (TVA), introduisant une complexité accrue dans le calcul des obligations fiscales. Parallèlement, l'administration fiscale tunisienne accélère sa transformation numérique avec l'obligation progressive de la facturation électronique et l'usage de plateformes comme TEJ.

Pour les contribuables, qu'ils soient particuliers ou entreprises, ainsi que pour les professionnels de la comptabilité, la maîtrise de ces nouveaux barèmes et outils est un défi majeur. La complexité des calculs manuels et la dispersion de l'information rendent nécessaire l'usage d'outils d'aide à la décision performants.

C'est dans ce contexte que s'inscrit notre Projet de Fin d'Études, réalisé sous la forme d'un projet professionnel tutoré. Il consiste à concevoir et réaliser une application web interactive : le **Simulateur Fiscal Tunisien 2026**.

**Problématique :**
Comment les technologies web modernes peuvent-elles simplifier l'application des nouvelles réformes fiscales de la Loi de Finances 2026 pour le contribuable tunisien ?

**Objectifs du projet :**
L'objectif principal est de fournir une solution numérique "Tout-en-un" capable de :
1.  Vulgariser les dispositions de la LF 2026.
2.  Assurer des calculs précis et instantanés pour l'IRPP, l'IS, la TVA et l'ISF.
3.  Simuler l'impact des avantages fiscaux (ZDR, Startups) via un conseiller intelligent.

**Méthodologie :**
Ce mémoire s'articule autour de deux axes principaux :
*   Le **Chapitre 1 (Cadre Théorique)** analyse les fondements de la fiscalité tunisienne et détaille les nouveautés de la LF 2026 qui constituent notre base de règles métier.
*   Le **Chapitre 2 (Cadre Empirique)** présente la démarche de réalisation de l'application, de l'analyse des besoins à l'implémentation technique et la validation des résultats.

<div style="page-break-after: always;"></div>

# CHAPITRE 1 : CADRE THÉORIQUE - LA FISCALITÉ TUNISIENNE À L'ÈRE DU NUMÉRIQUE

Ce chapitre pose les bases théoriques nécessaires à la compréhension du moteur de calcul développé. Il explore l'évolution récente du système fiscal tunisien et détaille les règles de gestion extraites de la Loi de Finances 2026.

## 1.1 Évolution du Système Fiscal Tunisien
Le système fiscal tunisien est déclaratif et repose sur une panoplie d'impôts directs (sur le revenu et les bénéfices) et indirects (sur la consommation).
*   **Historique** : Transition d'un système forfaitaire vers un système réel plus transparent.
*   **Digitalisation** : L'avènement des télé-procédures a transformé la relation contribuable-administration, rendant indispensable l'intégration logicielle (API, formats XML/JSON).

## 1.2 Analyse de la Loi de Finances 2026
La LF 2026 introduit des changements structurels majeurs qui ont dicté les algorithmes de notre simulateur.

### 1.2.1 Refonte de l'IRPP (Impôt sur le Revenu)
Le barème progressif a été révisé pour alléger la pression sur les classes moyennes.
*   **Nouvelles Tranches** : introduction d'une tranche à 15% et ajustement des seuils.
*   **Déductions Sociales** : Augmentation des déductions pour charge de famille, notamment pour les enfants étudiants (1 000 DT) et infirmes.
*   **CSS** : Maintien de la Contribution Sociale Solidaire à 0,5% du revenu net imposable.

### 1.2.2 Modernisation de l'IS (Impôt Sociétés)
L'IS n'est plus un taux unique mais un système sectoriel complexe. Pour le secteur financier, le taux nominal de 35% est complété par des contributions additionnelles pérennisées par la LF 2026 :

*   **Taux de Base** :
    *   **10%** : Agriculture, Pêche, ZDR (après exonération).
    *   **20%** : Droit commun (Commerce, Industrie, Services).
    *   **35%** : Banques, Assurances, Leasing, Télécoms, Hydrocarbures, Concessionnaires.

*   **Contributions Additionnelles (Secteur Financier & Assimilés)** :
    *   **CSS (Contribution Sociale de Solidarité)** : **4%** pour les institutions financières (et 3% pour les autres sociétés soumises à l'IS de 35%).
    *   **Taxe Spéciale Consolidée** : **4%** calculée sur le bénéfice imposable (Pérennisée LF 2026).
    *   *Note : La pression fiscale totale sur le secteur financier atteint ainsi **43%** (35% + 4% + 4%).*

*   **Mécanisme de sécurité** : L'algorithme intègre la logique de "Minimum d'Impôt" (0.2% du CA TTC ou 0.1% pour les taux réduits), garantissant une contribution minimale même en cas de résultat fiscal déficitaire.

### 1.2.3 Digitalisation de la TVA et Retenue à la Source
*   **Facturation Électronique** : Obligation généralisée pour la traçabilité.
*   **Plateforme TEJ** : Centralisation de l'émission des certificats de retenue à la source (RS). Tout certificat papier est désormais nul et passible d'amende.

## 1.3 Synthèse des Règles de Gestion
Pour notre application, ces lois se traduisent par des contraintes logiques strictes :
1.  **Priorité des calculs** : Brut -> Cotisations Sociales -> Net Imposable -> Abattements -> Assiette -> Impôt.
2.  **Conditionnalité** : Les taux d'IS dépendent du secteur ET de l'ancienneté (cas des nouvelles entreprises).
3.  **Validation** : Les montants doivent être arrondis au millime supérieur ou inférieur selon le cas.

<div style="page-break-after: always;"></div>

# CHAPITRE 2 : CADRE EMPIRIQUE ET ÉTUDE DE CAS

## Introduction du Chapitre 2
Ce deuxième chapitre constitue le cœur de notre contribution empirique et présente le simulateur fiscal tunisien développé dans le cadre de ce mémoire. Il s’articule en trois sections complémentaires qui couvrent l’ensemble du processus de conception, de développement et de validation de l’outil. La première section expose la méthodologie adoptée pour la conception du simulateur, depuis l’analyse des besoins jusqu’à la spécification des fonctionnalités. La deuxième section présente l’architecture technique de l’application et décrit en détail les différents modules de calcul et l’interface utilisateur. La troisième section est consacrée aux tests de validation, à l’analyse des résultats de simulation et à la discussion des limites et perspectives d’amélioration du simulateur.

## Section 2.1 : Méthodologie de Conception du Simulateur

### 2.1.1. Analyse des Besoins et Spécification des Exigences
La conception du simulateur fiscal a démarré par une phase d’analyse des besoins visant à identifier les attentes des utilisateurs potentiels et à définir les fonctionnalités prioritaires de l’outil. Cette analyse s’est appuyée sur plusieurs sources d’information complémentaires, notamment l’étude des textes législatifs et réglementaires, l’analyse des pratiques déclaratives des contribuables tunisiens, et les entretiens informels avec des professionnels du secteur comptable et fiscal.

L’identification des utilisateurs cibles du simulateur a permis de distinguer trois catégories principales avec des besoins différenciés. Les particuliers salariés ou pensionnés constituent la première catégorie ; ils recherchent un outil simple et intuitif pour estimer leur impôt sur le revenu, comprendre l’impact des différentes déductions et optimiser leur situation fiscale. Les entrepreneurs et gérants de sociétés représentent la deuxième catégorie ; ils ont besoin d’un outil plus complet pour simuler l’impôt sur les sociétés, la TVA et les retenues à la source, et pour planifier leurs investissements en fonction de la charge fiscale anticipée. Les étudiants et professionnels en formation constituent la troisième catégorie ; ils utilisent le simulateur comme outil pédagogique pour comprendre les mécanismes de calcul des impôts.

Les exigences fonctionnelles du simulateur ont été spécifiées à partir de cette analyse des besoins. L’application doit être capable de calculer l’IRPP pour différents types de revenus (salaires, pensions, revenus fonciers), en intégrant automatiquement les déductions applicables et les nouvelles dispositions de la Loi de Finances 2026. Elle doit également permettre le calcul de l’Impôt sur les Sociétés selon les différents taux sectoriels, le calcul de la TVA à décaisser ou du crédit de TVA, le calcul de l’Impôt sur la Fortune, et le calcul des retenues à la source. Un module d’assistance basé sur l’intelligence artificielle doit fournir des conseils personnalisés aux utilisateurs.

### 2.1.2. Approche de Legal Engineering
La conception du simulateur s’inscrit dans le cadre du « Legal Engineering », discipline qui vise à traduire les règles juridiques en algorithmes informatiques exploitables. Cette approche implique une méthodologie rigoureuse de transformation du droit en code, qui comprend plusieurs étapes successives.

L’exégèse législative du simulateur fiscal a porté sur plusieurs textes fondamentaux. La Loi de Finances 2026 (JORT n°148) constitue le texte central. Le Code de l’IRPP et de l’IS, ainsi que le Code de la TVA, ont été analysés de manière systématique pour identifier les variables, les paramètres et les règles de calcul à intégrer dans le simulateur.

### 2.1.3. Architecture Fonctionnelle et Modulaire
L’architecture fonctionnelle du simulateur repose sur une approche modulaire qui sépare les différents composants de l’application. Chaque impôt fait l’objet d’un module dédié.
*   **Module IRPP** : Intègre les calculs du revenu brut, des déductions (CNSS 9.18%, Frais Pros plafonnés), des charges de famille, et de la CSS (0.5% Assiette).
*   **Module IS** : Calcule le résultat fiscal, l'IS théorique selon le secteur (10%, 20%, 35%, 40%), le Minimum d'Impôt, et la CSS (3%).
*   **Module TVA** : Gère la TVA collectée/déductible et le Prorata.
*   **Module IA** : Fournit des recommandations personnalisées.

## Section 2.2 : Architecture Technique et Fonctionnalités

### 2.2.1. Environnement Technologique
Le choix de l'environnement technologique s’est porté sur une solution web moderne et légère :
*   **Frontend** : HTML5, CSS3, JavaScript (Natif / Sans Framework).
*   **Hébergement** : Architecture statique compatible Netlify/GitHub Pages.
*   **Sécurité** : Exécution 100% Côté Client (Client-side), garantissant la confidentialité des données qui ne quittent jamais le navigateur de l'utilisateur.

### 2.2.2. Interface Utilisateur
L’interface utilise le "Glassmorphisme" (effet verre dépoli) pour offrir une expérience moderne. Elle s’organise autour d’une navigation par onglets (IRPP, IS, TVA, IF, RS, IA).
Le module IRPP permet de saisir la situation familiale détaillée (Enfants, Étudiants, Parents). Le module IS permet de sélectionner le secteur d'activité pour déterminer automatiquement le taux facial et le taux minimum.

## Section 2.3 : Tests, Validations et Analyse des Résultats

### 2.3.1. Méthodologie de Tests et de Validation
La validation du simulateur a suivi une méthodologie rigoureuse combinant tests unitaires, tests d’intégration et scénarios réels.

### Cas de Test Complet : Calcul IRPP pour un Salarié Type (Validé 2026)
Ce cas de test correspond à un scénario réaliste : Salarié privé, Marié, 1 enfant à charge, 1 étudiant.

**Données d’entrée :**
*   Revenu brut mensuel : **2 500 DT**
*   Situation : Marié (Chef de famille), 1 Enfant (-20 ans), 1 Étudiant (<25 ans).

**Tableau F.2 : Déroulement du calcul de l’IRPP (Correctif 2026)**

| Étape | Libellé | Formule | Montant (DT) |
| :--- | :--- | :--- | :--- |
| 1 | Revenu brut annuel | 2 500 × 12 | **30 000,000** |
| 2 | Cotisations CNSS (9,18%) | 30 000 × 9,18% | **- 2 754,000** |
| 3 | Revenu Brut Fiscal | 30 000 - 2 754 | **27 246,000** |
| 4 | Frais professionnels (10%) | Min(27 246 × 10%, 2000) | **- 2 000,000** |
| 5 | Revenu net intermédiaire | 27 246 - 2 000 | **25 246,000** |
| 6 | Déductions familiales | 300 (Chef) + 100 (Enf) + 1000 (Etu) | **- 1 400,000** |
| 7 | **Assiette Imposable** | 25 246 - 1 400 | **23 846,000** |
| 8 | IRPP Dû (Barème 2026) | (Détail tranches ci-dessous) | **4 403,800** |
| 9 | CSS (0,5% sur Assiette) | 23 846 × 0,5% | **119,230** |
| 10 | **Total Impôt à Payer** | 4 403,800 + 119,230 | **4 523,030** |
| 11 | **Net Annuel Réel** | 30 000 - 2 754 - 4 523,03 | **22 722,970** |

*Note sur la correction : Le calcul ci-dessus respecte strictement la LF 2026 (CNSS sur brut, Plafond Frais Pro 2000 DT, CSS sur Assiette).*

**Détail du calcul de l’IRPP brut par le barème progressif (8 Tranches) :**
*   0 - 5 000 DT : 0% -> 0
*   5 000 - 10 000 DT : 15% -> 750
*   10 000 - 20 000 DT : 25% -> 2 500
*   20 000 - 23 846 DT : 30% -> 1 153,800
*   **Total IRPP : 4 403,800 DT**

### 2.3.2. Analyse des Résultats de Simulation
L’analyse met en évidence l'impact des nouvelles mesures :
*   **Salariés moyens** : Gain de pouvoir d'achat grâce à la déduction étudiant (1000 DT).
*   **Hauts revenus** : Augmentation de la pression fiscale avec le nouveau taux marginal de **40%** (contre 35% précédemment) pour la fraction supérieure à 70 000 DT.
*   **Entreprises** : La pérennisation des taxes (CSS 3%, Taxe Banques 4%) confirme la contribution du secteur productif à l'effort budgétaire.

### 2.3.3. Limites et Perspectives
Le simulateur constitue une avancée significative mais présente des limites (périmètre fiscal partiel, absence d'intégration XML). Les perspectives incluent le développement d'une application mobile et l'intégration directe avec la plateforme "TEJ".

<div style="page-break-after: always;"></div>

# CONCLUSION GÉNÉRALE

Ce projet de fin d'études "Sans Stage" nous a permis de mener une réflexion complète, allant de l'analyse législative théorique à la mise en œuvre technique pratique.

Le **Simulateur Fiscal Tunisien 2026** répond à la problématique posée en offrant un outil accessible, précis et pédagogique. Il démontre que la complexité fiscale peut être maîtrisée grâce à une conception logicielle rigoureuse et une interface utilisateur soignée.

Au-delà de l'aspect technique (JavaScript, Algorithmique), ce projet nous a permis de développer une double compétence en fiscalité et en informatique de gestion, profil particulièrement recherché sur le marché du travail actuel. Les mises à jour futures de la législation pourront être intégrées rapidement grâce à l'architecture modulaire mise en place.

<div style="page-break-after: always;"></div>

# RÉFÉRENCES BIBLIOGRAPHIQUES

1.  **Textes Officiels** :
    *   Journal Officiel de la République Tunisienne (JORT), Loi de Finances 2026.
    *   Code de l'Impôt sur le Revenu des Personnes Physiques et de l'Impôt sur les Sociétés.
    *   Code de la Taxe sur la Valeur Ajoutée.

2.  **Ouvrages et Cours** :
    *   Cours de Fiscalité Tunisienne, ISAAS, 2025.
    *   "La pratique fiscale en Tunisie", Éditions CLE, 2024.

3.  **Webographie et Références Officielles** :
    *   **Journal Officiel de la République Tunisienne (JORT)** : [http://www.iort.gov.tn](http://www.iort.gov.tn)
    *   **Ministère des Finances – Tunisie** : [https://www.finances.gov.tn](https://www.finances.gov.tn)
    *   **Code de l’IRPP et de l’IS** : [http://www.impots.finances.gov.tn/documentation/code-irpp-is](http://www.impots.finances.gov.tn/documentation/code-irpp-is)
    *   **ChaExpert – Analyse LF 2026** : [https://chaexpert.com](https://chaexpert.com)
    *   **RegFollower – Tunisia Finance Law** : [https://regfollower.com](https://regfollower.com)
    *   **MDN Web Docs** : Documentation standard pour JavaScript et CSS.

<div style="page-break-after: always;"></div>

# ANNEXES

*   **Annexe 1** : Barème IRPP 2026 (Texte de loi).
*   **Annexe 2** : Liste des activités éligibles aux ZDR (Extrait).
*   **Annexe 3** : Algorithme complet de calcul de l'IS (Code source Strict/Audit).
*   **Annexe 4** : Algorithme complet de calcul de l'IRPP (Code source 8 Tranches).

<div style="page-break-after: always;"></div>

## ANNEXE 1 : BARÈME IRPP 2026

Le barème progressif de l'Impôt sur le Revenu des Personnes Physiques, tel qu'adopté dans la Loi de Finances 2026, est structuré en 8 tranches :

| Tranche de Revenu Annuel (Net Imposable) | Taux d'Imposition |
| :--- | :--- |
| De 0 à 5 000 DT | **0%** |
| De 5 000,001 à 10 000 DT | **15%** |
| De 10 000,001 à 20 000 DT | **25%** |
| De 20 000,001 à 30 000 DT | **30%** |
| De 30 000,001 à 40 000 DT | **33%** |
| De 40 000,001 à 50 000 DT | **36%** |
| De 50 000,001 à 70 000 DT | **38%** |
| Au-delà de 70 000 DT | **40%** |

<div style="page-break-after: always;"></div>

## ANNEXE 2 : ZONES DE DÉVELOPPEMENT RÉGIONAL (ZDR)

Les avantages fiscaux (Déduction totale ou taux réduit à 10%) sont accordés selon le groupe de la zone d'implantation (Décret gouvernemental fixant la liste des zones) :

**Groupe 1 (Déduction 5 ans puis 10%) :**
*   Zones intérieures disposant d'une infrastructure moyenne.
*   Exemples (Indicatif) : Certaines délégations de Zaghouan, Sousse (Hinterland), Bizerte (Rural).

**Groupe 2 (Déduction 10 ans puis 10%) :**
*   Zones prioritaires à développement régional.
*   Exemples (Indicatif) : Kasserine, Sidi Bouzid, Gafsa, Tataouine, Jendouba, Le Kef.

*Note : La liste exhaustive est mise à jour par décret. Le simulateur intègre la logique de distinction Groupe 1 / Groupe 2.*

<div style="page-break-after: always;"></div>

## ANNEXE 3 : ALGORITHME DE CALCUL DE L'IS (Code Source Audit)

Ci-dessous le code source certifié du module `is_algo_2026_strict.js` assurant le calcul de l'IS avec la règle du Minimum d'Impôt.

```javascript
function calculerIS2026_Strict(params) {
    console.log(`\n=== AUDIT FISCAL IS 2026 (STRICT) ===`);
    console.log(`Société : ${params.nom}`);
    console.log(`Données : Résultat=${params.res_comptable} | CA TTC=${params.ca_ttc}`);

    /*
     * RÉFÉRENCES JURIDIQUES OFFICIELLES :
     * 1. Journal Officiel de la République Tunisienne (JORT) : http://www.iort.gov.tn
     * 2. Ministère des Finances : https://www.finances.gov.tn
     * 3. Code de l’IRPP et de l’IS : http://www.impots.finances.gov.tn/documentation/code-irpp-is
     * 4. Analyses Expertes : https://chaexpert.com | https://regfollower.com
     */

    // --- 1. BASE IMPOSABLE ---
    const reintegrations = params.reintegrations || 0;
    const deductions = params.deductions || 0;
    const resFiscal = params.res_comptable + reintegrations - deductions;
    const baseImposable = Math.max(0, resFiscal);

    // --- 2. TAUX IS & EXONÉRATIONS ---
    let tauxFacial = 0.20; // Défaut
    let isSecteurFinancier = false;

    // Détermination du taux selon JORT n°148
    switch (params.secteur) {
        case 'AGRI_ARTISANAT': tauxFacial = 0.10; break;
        case 'INDUSTRIE_COMMERCE': tauxFacial = 0.20; break;
        case 'GRANDE_DISTRIB':
        case 'FRANCHISE': tauxFacial = 0.35; break;
        case 'FINANCIER':
            // Base 35% + Taxes additionnelles gérées plus bas
            tauxFacial = 0.35; 
            isSecteurFinancier = true;
            break;
    }

    // Gestion ZDR (Exonération IS Théorique)
    let tauxEffectif = tauxFacial;
    if (params.zdr_groupe === 1) {
        if (params.annee_activite <= 5) tauxEffectif = 0.0;
        else tauxEffectif = 0.10;
    } else if (params.zdr_groupe === 2) {
        if (params.annee_activite <= 10) tauxEffectif = 0.0;
        else tauxEffectif = 0.10;
    }

    const isTheorique = baseImposable * tauxEffectif;

    // --- 3. MINIMUM D'IMPÔT (0.2% CA TTC) ---
    let tauxMin = 0.002; 
    if (tauxFacial <= 0.10) {
        tauxMin = 0.001; // 0.1% pour les taux réduits
    }
    const minImpot = params.ca_ttc * tauxMin;

    // --- 4. IS DÛ (MAX) ---
    const isDu = Math.max(isTheorique, minImpot);

    // --- 5. CONTRIBUTIONS ADDITIONNELLES ---
    
    // 5.a CSS (Contribution Sociale de Solidarité)
    // 4% pour Finance/Assurances, 3% pour les autres (LF 2026)
    const tauxCSS = isSecteurFinancier ? 0.04 : 0.03;
    const montantCSS = baseImposable * tauxCSS;

    // 5.b Taxe Spéciale Consolidée (Secteur Financier uniquement)
    // 4% sur Bénéfice Imposable (Pérennisée LF 2026)
    let montantTaxeConso = 0;
    if (isSecteurFinancier) {
        montantTaxeConso = baseImposable * 0.04;
    }

    // --- 6. TOTAL À PAYER ---
    const total = isDu + montantCSS + montantTaxeConso;

    return total;
}
```

<div style="page-break-after: always;"></div>

## ANNEXE 4 : ALGORITHME DE CALCUL DE L'IRPP (Code Source 2026)

L'algorithme ci-dessous implémente les 8 tranches du barème et les nouvelles déductions (Étudiant 1000 DT, CSS 0.5%).

```javascript
function calculerIRPP2026(salaireBrutMensuel, chefDeFamille, nbEnfants, nbEtudiants) {
    /*
     * RÉFÉRENCES JURIDIQUES OFFICIELLES (LF 2026) :
     * 1. JORT : http://www.iort.gov.tn
     * 2. Ministère des Finances : https://www.finances.gov.tn
     * 3. Code IRPP/IS : http://www.impots.finances.gov.tn/documentation/code-irpp-is
     */

    // 1. Constantes & Taux
    const CNSS_TAUX = 0.0918;
    const FRAIS_PRO_TAUX = 0.10; 
    const FRAIS_PRO_PLAFOND = 2000.0;
    const DEDUC_CHEF = 300.0;
    const DEDUC_ENFANT = 100.0;
    const DEDUC_ETUDIANT = 1000.0;
    const CSS_TAUX = 0.005; // 0.5% pour les personnes physiques

    // Barème 2026 (8 Tranches)
    const BAREME = [
        { min: 0, max: 5000, rate: 0 },
        { min: 5000, max: 10000, rate: 0.15 },
        { min: 10000, max: 20000, rate: 0.25 },
        { min: 20000, max: 30000, rate: 0.30 },
        { min: 30000, max: 40000, rate: 0.33 },
        { min: 40000, max: 50000, rate: 0.36 },
        { min: 50000, max: 70000, rate: 0.38 },
        { min: 70000, max: Infinity, rate: 0.40 }
    ];

    // 2. Calculs Préliminaires
    const brutAnnuel = salaireBrutMensuel * 12;
    const cnss = brutAnnuel * CNSS_TAUX;
    const brutApresCnss = brutAnnuel - cnss;

    // Frais Professionnels
    const fraisPros = Math.min(brutApresCnss * FRAIS_PRO_TAUX, FRAIS_PRO_PLAFOND);
    const netIntermediaire = brutApresCnss - fraisPros;

    // Déductions Familiales
    let deductions = 0;
    if (chefDeFamille) deductions += DEDUC_CHEF;
    deductions += Math.min(nbEnfants, 4) * DEDUC_ENFANT;
    deductions += nbEtudiants * DEDUC_ETUDIANT; // Nouvelle déduction 2026

    // Assiette Imposable
    const assiette = Math.max(0, netIntermediaire - deductions);

    // 3. Calcul IRPP
    let irpp = 0;
    BAREME.forEach(tranche => {
        if (assiette > tranche.min) {
            const effectiveMax = (tranche.max === Infinity) ? assiette : tranche.max;
            const base = Math.max(0, Math.min(assiette, effectiveMax) - tranche.min);
            irpp += base * tranche.rate;
        }
    });

    // 4. CSS et Net
    const css = assiette * CSS_TAUX;
    const totalImpot = irpp + css;
    const netMensuel = (brutAnnuel - cnss - totalImpot) / 12;

    return { irpp, css, netMensuel };
}
```

<div style="page-break-after: always;"></div>

# TABLE DES MATIÈRES

1.  **DÉDICACES & REMERCIEMENTS** .......................................................................... I
2.  **SOMMAIRE** ............................................................................................................. II
3.  **LISTE DES TABLEAUX ET FIGURES** ................................................................. III
4.  **LISTE DES ABRÉVIATIONS** ................................................................................ IV
5.  **INTRODUCTION GÉNÉRALE** ............................................................................. 1
6.  **CHAPITRE 1 : CADRE THÉORIQUE - LA FISCALITÉ TUNISIENNE** ........... 3
    *   1.1 Évolution du Système Fiscal Tunisien ........................................................ 3
    *   1.2 Analyse de la Loi de Finances 2026 .......................................................... 5
        *   1.2.1 Refonte de l'IRPP ........................................................................... 5
        *   1.2.2 Modernisation de l'IS ..................................................................... 7
    *   1.3 Synthèse des Règles de Gestion .................................................................. 9
7.  **CHAPITRE 2 : CADRE EMPIRIQUE - RÉALISATION DU SIMULATEUR** ... 11
    *   2.1 Méthodologie et Analyse des Besoins ....................................................... 11
    *   2.2 Conception Architecturale ........................................................................... 13
    *   2.3 Réalisation et Implémentation .................................................................... 15
        *   2.3.1 Le Moteur de Calcul IRPP ............................................................. 15
        *   2.3.2 Le Module Conseiller Fiscal (IA) ................................................. 17
    *   2.4 Résultats et Validation ................................................................................. 19
8.  **CONCLUSION GÉNÉRALE** ................................................................................. 21
9.  **RÉFÉRENCES BIBLIOGRAPHIQUES** ................................................................ 22
10. **ANNEXES** ................................................................................................................ 23
