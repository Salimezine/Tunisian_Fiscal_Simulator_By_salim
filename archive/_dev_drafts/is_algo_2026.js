function calculerIS2026(params) {
    console.log(`\n--- SIMULATION IS 2026 ---`);
    console.log(`Société : ${params.nom}`);
    console.log(`Secteur : ${params.secteur} | ZDR: ${params.zdr_groupe} (Année ${params.annee_activite})`);
    console.log(`Résultat Comptable : ${params.res_comptable} DT | CA TTC : ${params.ca_ttc} DT`);

    // --- 1. CONFIGURATION DYNAMIQUE ---
    let tauxIS = 0.20; // Défaut Droit Commun
    let tauxMinTaux = 0.002; // Défaut 0.2%
    let tauxCSS = 0.03; // Défaut 3%
    let tauxTaxeConso = 0;

    // Détection Secteur
    switch (params.secteur) {
        case 'AGRI_ARTISANAT':
            tauxIS = 0.10;
            tauxMinTaux = 0.001;
            break;
        case 'INDUSTRIE_COMMERCE':
            tauxIS = 0.20;
            break;
        case 'GRANDE_DISTRIB':
        case 'FRANCHISE':
            tauxIS = 0.35;
            tauxCSS = 0.04;
            break;
        case 'FINANCIER': // Banque/Assurance
            tauxIS = 0.40;
            tauxCSS = 0.04;
            tauxTaxeConso = 0.04;
            break;
    }

    // --- 2. LOGIQUE ZDR (Priorité sur le taux secteur) ---
    // Si ZDR, le taux devient 0% pendant exonération, puis 10%
    if (params.zdr_groupe === 1) {
        if (params.annee_activite <= 5) tauxIS = 0.0;
        else tauxIS = 0.10;
    } else if (params.zdr_groupe === 2) {
        if (params.annee_activite <= 10) tauxIS = 0.0;
        else tauxIS = 0.10;
    }

    // Réajustement Min Impôt si taux IS est 10% ou moins
    if (tauxIS <= 0.10 && tauxIS > 0) {
        tauxMinTaux = 0.001;
    }

    // --- 3. CALCULS ---

    // Base Imposable (Simplifiée ici : Résultat + Réintégrations - Déductions)
    let reintegrations = params.reintegrations || 0;
    let deductions = params.deductions || 0;
    let resultatFiscal = params.res_comptable + reintegrations - deductions;
    let baseImposable = Math.max(0, resultatFiscal);

    // IS Théorique
    let isCalcule = baseImposable * tauxIS;

    // Minimum d'Impôt
    let minImpot = params.ca_ttc * tauxMinTaux;

    // IS Dû (Le plus élevé des deux)
    let isDu = Math.max(isCalcule, minImpot);
    // Si exonération totale ZDR (taux 0), pas d'IS, pas de min impot (sauf exception, ici on suppose exo totale)
    if (tauxIS === 0) {
        isDu = 0; // Exonération totale
        minImpot = 0; // Souvent le min impôt est aussi exonéré
    }

    // CSS
    let css = baseImposable * tauxCSS;
    // Si exo totale ZDR, la CSS reste souvent due sur le bénéfice (selon interprétation, mais souvent due).
    // Dans ce script, on l'applique.

    // Taxe Conso (Banques)
    let taxeConso = baseImposable * tauxTaxeConso;

    // Total
    let totalAPayer = isDu + css + taxeConso;


    // --- 4. AFFICHAGE DÉTAILLÉ ---
    console.log(`\n--- RÉSULTATS ---`);
    console.log(`Base Imposable      : ${baseImposable.toFixed(3)} DT`);
    console.log(`Taux IS Appliqué    : ${(tauxIS * 100).toFixed(2)}%`);
    console.log(`IS Calculé          : ${isCalcule.toFixed(3)} DT`);
    console.log(`Minimum Impôt       : ${minImpot.toFixed(3)} DT (Taux ${(tauxMinTaux * 100).toFixed(1)}%)`);
    console.log(`------------------------------`);
    console.log(`IS DÛ               : ${isDu.toFixed(3)} DT`);
    console.log(`CSS (${(tauxCSS * 100)}%)          : ${css.toFixed(3)} DT`);
    if (taxeConso > 0) console.log(`Taxe Conso (4%)     : ${taxeConso.toFixed(3)} DT`);
    console.log(`------------------------------`);
    console.log(`TOTAL À PAYER       : ${totalAPayer.toFixed(3)} DT`);

    return totalAPayer;
}

// Scénario 1 : PME Industrie (Droit Commun)
calculerIS2026({
    nom: "PME INDUSTRIE SARL",
    secteur: "INDUSTRIE_COMMERCE",
    zdr_groupe: 0,
    annee_activite: 5,
    res_comptable: 50000,
    ca_ttc: 600000
});

// Scénario 2 : Société ZDR Groupe 2 (Année 8 - Exonérée)
calculerIS2026({
    nom: "ZDR TECH SUARL",
    secteur: "AGRI_ARTISANAT",
    zdr_groupe: 2,
    annee_activite: 8,
    res_comptable: 120000,
    ca_ttc: 300000
});
