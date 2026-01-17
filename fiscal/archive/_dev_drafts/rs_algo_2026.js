function calculerRS2026(params) {
    console.log(`\n=== AUDIT FISCAL RS 2026 ===`);
    console.log(`Opération : ${params.type_operation} | Bénéficiaire : ${params.type_beneficiaire}`);
    console.log(`Données : Brut TTC=${params.montant_ttc} DT | dont TVA=${params.montant_tva} DT`);

    // 1. DÉTERMINATION TAUX RS (Principal)
    let tauxRS = 0;

    switch (params.type_operation) {
        case 'HONORAIRES':
            if (params.type_beneficiaire === 'PHYSIQUE') tauxRS = 0.15;
            else if (params.type_beneficiaire === 'MORALE') tauxRS = 0.03; // Taux réduit souvent 3% ou 5%
            else tauxRS = 0.15; // Défaut
            break;
        case 'LOYER':
            tauxRS = 0.10; // 10% Standard (Immeubles) - 15% pour Hôtels
            break;
        case 'MARCHE_TRAVAUX':
            tauxRS = 0.015; // 1.5%
            break;
        case 'DIVIDENDES':
            tauxRS = 0.10; // 10% Libératoire
            break;
        default:
            tauxRS = 0;
    }

    const rsPrincipal = params.montant_ttc * tauxRS;

    // 2. RS SUR TVA
    let rsTVA = 0;
    if (params.payeur_public) {
        rsTVA = params.montant_tva * 0.25; // 25% de la TVA
    } else if (params.type_beneficiaire === 'NON_RESIDENT') {
        rsTVA = params.montant_tva * 1.00; // 100% de la TVA
    }

    // 3. TOTAUX
    const totalRetenu = rsPrincipal + rsTVA;
    const netAPayer = params.montant_ttc - totalRetenu;

    // 4. AFFICHAGE
    console.log(`Taux RS Appliqué   : ${(tauxRS * 100).toFixed(2)}% sur TTC`);
    console.log(`Retenue IRPP/IS    : ${rsPrincipal.toFixed(3)} DT`);
    if (rsTVA > 0) {
        console.log(`Retenue sur TVA    : ${rsTVA.toFixed(3)} DT`);
    }
    console.log(`--------------------------------`);
    console.log(`TOTAL RETENU       : ${totalRetenu.toFixed(3)} DT`);
    console.log(`NET À PAYER        : ${netAPayer.toFixed(3)} DT`);
    console.log(`⚠️ OBLIGATION : Émettre Certificat via Plateforme TEJ`);
    console.log(`================================`);

    return totalRetenu;
}

// TEST 1: Loyer payé par une société à un propriétaire (Physique)
calculerRS2026({
    type_operation: 'LOYER',
    type_beneficiaire: 'PHYSIQUE',
    montant_ttc: 2000,
    montant_tva: 0, // Loyer souvent exonéré ou HC, supposons montant brut
    payeur_public: false
});

// TEST 2: Marché public de travaux
calculerRS2026({
    type_operation: 'MARCHE_TRAVAUX',
    type_beneficiaire: 'MORALE',
    montant_ttc: 119000, // 100k + 19% TVA
    montant_tva: 19000,
    payeur_public: true // Organisme public
});
