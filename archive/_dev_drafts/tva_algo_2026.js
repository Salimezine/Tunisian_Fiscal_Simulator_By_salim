function calculerTVA2026(params) {
    console.log(`\n=== AUDIT FISCAL TVA 2026 ===`);
    console.log(`Société : ${params.nom}`);
    console.log(`Données : CA Local HT=${params.ca_local_ht} | CA Export=${params.ca_export} | Taux=${params.taux * 100}%`);

    // 1. TVA COLLECTÉE
    let tvaCollectee = 0;

    if (params.suspension_valide) {
        console.log(">> Vente en Suspension de Taxes (Certificat Validé)");
        tvaCollectee = 0;
    } else {
        tvaCollectee = params.ca_local_ht * params.taux;
    }
    // L'export est toujours à 0

    // 2. PRORATA DE DÉDUCTION
    // Prorata = (CA Imposable + Export) / CA Total
    // Ici, on considère que tout le CA donne droit à déduction (cas général)
    // Si CA Exonéré (sans droit à déduction) existait, il faudrait l'ajouter au dénominateur.
    const prorata = 1.0;

    // 3. TVA DÉDUCTIBLE
    const tvaDedExploitation = params.tva_ded_exploitation || 0;
    const tvaDedImmo = params.tva_ded_immobilisation || 0;

    const totalDeductible = (tvaDedExploitation + tvaDedImmo) * prorata;

    // 4. CALCUL DU SOLDE
    const creditPrecedent = params.credit_reportable || 0;
    const soldeTheorique = tvaCollectee - totalDeductible - creditPrecedent;

    // 5. AFFICHAGE
    console.log(`TVA Collectée (Ventes)   : ${tvaCollectee.toFixed(3)} DT`);
    console.log(`TVA Déductible (Achats)  : -${totalDeductible.toFixed(3)} DT`);
    console.log(`Crédit Reportable (M-1)  : -${creditPrecedent.toFixed(3)} DT`);
    console.log(`--------------------------------`);

    let resultat = {
        a_payer: 0,
        credit: 0
    };

    if (soldeTheorique > 0) {
        resultat.a_payer = soldeTheorique;
        console.log(`> TVA À PAYER            : ${soldeTheorique.toFixed(3)} DT`);
    } else {
        resultat.credit = Math.abs(soldeTheorique);
        console.log(`> CRÉDIT À REPORTER      : ${Math.abs(soldeTheorique).toFixed(3)} DT`);
    }
    console.log(`================================`);
    return resultat;
}

// TEST: Grossiste 19% avec crédit précédent et Achats forts
calculerTVA2026({
    nom: "TOTAL NEGOCE",
    ca_local_ht: 100000,
    ca_export: 0,
    taux: 0.19,
    suspension_valide: false,
    tva_ded_exploitation: 15000,
    tva_ded_immobilisation: 2000,
    credit_reportable: 5000
});

// TEST: Exportateur (Suspension)
calculerTVA2026({
    nom: "EXPORT PLUS",
    ca_local_ht: 50000,
    ca_export: 200000,
    taux: 0.19, // Taux théorique local
    suspension_valide: true, // Achète sans TVA ou vend en suspen? Ici vente
    tva_ded_exploitation: 2000, // TVA payée sur petits frais non suspendus
    tva_ded_immobilisation: 0,
    credit_reportable: 0
});
