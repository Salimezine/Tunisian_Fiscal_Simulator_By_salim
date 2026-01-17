function calculerISF2026(params) {
    console.log(`\n=== AUDIT FISCAL ISF 2026 ===`);
    console.log(`Contribuable : ${params.nom}`);

    // 1. ACTIF BRUT TAXABLE
    // Résidence principale exonérée
    const immoTaxable = Math.max(0, params.valeur_immo_totale - params.valeur_residence_principale);
    const actifBrut = immoTaxable + params.valeur_placements + params.valeur_luxe + params.valeur_autres;

    // 2. PATRIMOINE NET
    const patrimoineNet = Math.max(0, actifBrut - params.testtel_dettes);

    // 3. CALCUL ISF
    let isfDu = 0;

    // Seuil de 3 Millions de DT
    if (patrimoineNet >= 3000000) {
        if (patrimoineNet < 5000000) {
            isfDu = patrimoineNet * 0.005; // 0.5%
        } else {
            isfDu = patrimoineNet * 0.01; // 1.0% sur la totalité (règle de prudence max)
        }
    }

    // 4. AFFICHAGE
    console.log(`Immobilier Total       : ${params.valeur_immo_totale.toFixed(3)} DT`);
    console.log(`(-) Résidence Principale : -${params.valeur_residence_principale.toFixed(3)} DT`);
    console.log(`(+) Placements         : +${params.valeur_placements.toFixed(3)} DT`);
    console.log(`(+) Biens Luxe         : +${params.valeur_luxe.toFixed(3)} DT`);
    console.log(`Actif Brut Taxable     : ${actifBrut.toFixed(3)} DT`);
    console.log(`(-) Dettes Déductibles  : -${params.testtel_dettes.toFixed(3)} DT`);
    console.log(`--------------------------------`);
    console.log(`PATRIMOINE NET         : ${patrimoineNet.toFixed(3)} DT`);

    if (isfDu > 0) {
        console.log(`> ISF DÛ               : ${isfDu.toFixed(3)} DT`);
    } else {
        console.log(`> ISF DÛ               : 0.000 DT (Non Imposable < 3M)`);
    }
    console.log(`================================`);
    return isfDu;
}

// TEST: Riche héritier
calculerISF2026({
    nom: "MR FORTUNE",
    valeur_immo_totale: 4500000,
    valeur_residence_principale: 1000000,
    valeur_placements: 2000000,
    valeur_luxe: 600000,
    valeur_autres: 0,
    testtel_dettes: 100000
});
