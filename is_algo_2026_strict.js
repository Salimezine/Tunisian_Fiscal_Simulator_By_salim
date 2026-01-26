function calculerIS2026_Strict(params) {
    console.log(`\n=== AUDIT FISCAL IS 2026 (STRICT) ===`);
    console.log(`Société : ${params.nom}`);
    console.log(`Données : Résultat=${params.res_comptable} | CA TTC=${params.ca_ttc}`);

    // --- 1. BASE IMPOSABLE ---
    const reintegrations = params.reintegrations || 0;
    const deductions = params.deductions || 0;
    const resFiscal = params.res_comptable + reintegrations - deductions;
    const baseImposable = Math.max(0, resFiscal);

    // --- 2. TAUX IS & EXONÉRATIONS ---
    let tauxFacial = 0.20; // Défaut
    let isSecteurFinancier = false;
    let isSecteur35 = false;

    switch (params.secteur) {
        case 'AGRI_ARTISANAT': tauxFacial = 0.10; break;
        case 'INDUSTRIE_COMMERCE': tauxFacial = 0.20; break;
        case 'GRANDE_DISTRIB':
        case 'FRANCHISE':
            tauxFacial = 0.35;
            isSecteur35 = true;
            break;
        case 'FINANCIER':
            tauxFacial = 0.40;
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

    // --- 3. MINIMUM D'IMPÔT ---
    let tauxMin = 0.002; // 0.2% par défaut
    if (tauxFacial <= 0.10 || params.secteur === 'AGRI_ARTISANAT') {
        tauxMin = 0.001; // 0.1% pour les taux réduits
    }
    const minImpot = params.ca_ttc * tauxMin;

    // --- 4. IS DÛ (MAX) ---
    const isDu = Math.max(isTheorique, minImpot);

    // --- 5. CONTRIBUTIONS (SUR BASE IMPOSABLE) ---
    // CSS : 3% sur le Bénéfice (LF 2026 - Art. 55)
    // Note: Le taux de 4% pour le secteur financier concerne la Taxe Spéciale, la CSS est à 3%.
    let tauxCSS = 0.03;

    // CORRECTIF MAJEUR : CSS sur Bénéfice Net Imposable
    const montantCSS = baseImposable * tauxCSS;

    // Taxe Spéciale (Finance uniquement, 4% sur Bénéfice)
    let montantTaxeConso = 0;
    if (isSecteurFinancier) {
        montantTaxeConso = baseImposable * 0.04;
    }

    // --- 6. TOTAL ---
    const total = isDu + montantCSS + montantTaxeConso;

    // --- AFFICHAGE AUDIT ---
    console.log(`Base Imposable     : ${baseImposable.toFixed(3)} DT`);
    console.log(`IS Théorique       : ${isTheorique.toFixed(3)} DT (Taux ${(tauxEffectif * 100)}%)`);
    console.log(`Minimum Impôt      : ${minImpot.toFixed(3)} DT (Taux ${(tauxMin * 100)}%)`);
    console.log(`> IS DÛ            : ${isDu.toFixed(3)} DT`);
    console.log(`+ CSS (3% Bénéfice)    : ${montantCSS.toFixed(3)} DT`);
    if (montantTaxeConso > 0) console.log(`+ Taxe Spéciale (4% Bénéfice): ${montantTaxeConso.toFixed(3)} DT`);
    console.log(`================================`);
    console.log(`TOTAL À PAYER      : ${total.toFixed(3)} DT`);

    return total;
}

// TEST: Société ZDR (Exonérée théoriquement) avec CA important
// Doit payer le Minimum Impôt + CSS sur ce minimum
calculerIS2026_Strict({
    nom: "ZDR EXPORT SA",
    secteur: "INDUSTRIE_COMMERCE", // Normalement 20%, mais ZDR
    zdr_groupe: 2,
    annee_activite: 4, // Période < 10 ans -> Exo
    res_comptable: 200000,
    ca_ttc: 5000000 // Gros CA
});
