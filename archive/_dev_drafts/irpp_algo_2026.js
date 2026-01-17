function calculerIRPP2026_Corrected(revenuBrutMensuel, typeRevenu = 'salarie', chefDeFamille = false, nbEnfants = 0, nbInfirmes = 0, nbParents = 0, nbEtudiants = 0) {
    console.log(`\n--- SIMULATION FISCALE 2026 ---`);
    console.log(`Données : Brut=${revenuBrutMensuel} DT | Type=${typeRevenu} | Chef=${chefDeFamille} | Enfants=${nbEnfants}`);

    // 1. Constantes & Taux
    const CNSS_TAUX = 0.0918;
    const FRAIS_PRO_TAUX = 0.10;
    const FRAIS_PRO_PLAFOND = 2000.0;
    const ABATTEMENT_RETRAITE = 0.25;
    const DEDUC_CHEF = 300.0;
    const DEDUC_ENFANT = 100.0;
    const DEDUC_INFIRME = 2000.0;
    const DEDUC_PARENT = 400.0;
    const DEDUC_ETUDIANT = 1000.0; // Ajout étudiant LF 2026
    const CSS_TAUX = 0.005;

    // Barème Officiel JORT 148 (8 tranches)
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

    // 2. Calculs
    const brutAnnuel = revenuBrutMensuel * 12;
    let cnss = 0;
    let abattement = 0;

    if (typeRevenu === 'salarie') {
        cnss = brutAnnuel * CNSS_TAUX;
        const brutApresCnss = brutAnnuel - cnss;
        abattement = Math.min(brutApresCnss * FRAIS_PRO_TAUX, FRAIS_PRO_PLAFOND);
    } else {
        // Pension de retraite : pas de CNSS, abattement 25%
        abattement = brutAnnuel * ABATTEMENT_RETRAITE;
    }

    let deductions = 0;
    if (chefDeFamille) deductions += DEDUC_CHEF;
    deductions += Math.min(nbEnfants, 4) * DEDUC_ENFANT;
    deductions += nbInfirmes * DEDUC_INFIRME;
    deductions += nbParents * DEDUC_PARENT;
    deductions += nbEtudiants * DEDUC_ETUDIANT;

    const assiette = Math.max(0, (brutAnnuel - cnss - abattement) - deductions);

    // 3. IRPP
    let irpp = 0;
    BAREME.forEach(tranche => {
        if (assiette > tranche.min) {
            const baseTranche = Math.min(assiette, tranche.max) - tranche.min;
            irpp += baseTranche * tranche.rate;
        }
    });

    // 4. CSS (Règle : Pas d'IRPP = Pas de CSS)
    let css = 0;
    if (irpp > 0) {
        css = assiette * CSS_TAUX;
    }
    // 5. Résultats
    const totalImpot = irpp + css;
    const netAnnuel = brutAnnuel - cnss - totalImpot;
    const netMensuel = netAnnuel / 12;

    console.log("\n--- RÉSULTATS CORRIGÉS ---");
    console.log(`Type de Revenu     : ${typeRevenu.toUpperCase()}`);
    console.log(`Brut Mensuel       : ${revenuBrutMensuel.toFixed(3)} DT`);
    console.log(`Assiette Imposable : ${assiette.toFixed(3)} DT`);
    console.log(`IRPP Dû            : ${irpp.toFixed(3)} DT`);
    console.log(`CSS Dû             : ${css.toFixed(3)} DT`);
    console.log(`NET MENSUEL        : ${netMensuel.toFixed(3)} DT`);
    console.log(`--------------------------------`);

    return { irpp, css, netMensuel };
}

// CAS DE TEST REEL : Pension 400 DT, Chef Famille, 1 Enfant Infirme
// Résultat attendu : IRPP=0, CSS=0, Net=400
calculerIRPP2026_Corrected(400, 'retraite', true, 0, 1, 0);

// Test Salaire Élevé pour vérifier le barème
calculerIRPP2026_Corrected(5000, 'salarie', true, 2, 0, 0);
