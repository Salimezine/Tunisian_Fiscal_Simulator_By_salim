
function verifyIRPP() {
    console.log("--- VÉRIFICATION CALCUL IRPP (Cas: 2500 DT/mois, Chef, 1 Enfant, 1 Etudiant) ---");

    // Données
    const brutMensuel = 2500;
    const brutAnnuel = brutMensuel * 12;
    console.log(`1. Brut Annuel: ${brutAnnuel.toFixed(3)}`);

    // CNSS (9.18% du Brut)
    const cnss = brutAnnuel * 0.0918;
    console.log(`2. CNSS (9.18% de ${brutAnnuel}): ${cnss.toFixed(3)}`);

    const brutFiscal = brutAnnuel - cnss;
    console.log(`3. Brut Fiscal (Après CNSS): ${brutFiscal.toFixed(3)}`);

    // Frais Pros (10% du Brut Fiscal, Max 2000)
    const fraisProTheorique = brutFiscal * 0.10;
    const fraisPro = Math.min(fraisProTheorique, 2000);
    console.log(`4. Frais Pros (10% de ${brutFiscal.toFixed(3)}, Max 2000): ${fraisPro.toFixed(3)}`);

    // Net Imposable Intermédiaire
    const netInter = brutFiscal - fraisPro;

    // Déductions
    const deducChef = 300;
    const deducEnfant = 100; // 1 enfant
    const deducEtudiant = 1000; // 1 étudiant
    const totalDeduc = deducChef + deducEnfant + deducEtudiant;
    console.log(`5. Déductions Famille: ${totalDeduc.toFixed(3)}`);

    // Assiette
    const assiette = Math.max(0, netInter - totalDeduc);
    console.log(`6. Assiette Imposable: ${assiette.toFixed(3)}`);

    // IRPP (Barème 2026)
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

    let irpp = 0;
    console.log("--- Détail Barème ---");
    BAREME.forEach(tranche => {
        if (assiette > tranche.min) {
            const effectiveMax = (tranche.max === Infinity) ? assiette : tranche.max;
            const base = Math.max(0, Math.min(assiette, effectiveMax) - tranche.min);
            const tax = base * tranche.rate;
            irpp += tax;
            if (base > 0) console.log(`   Tranche ${tranche.min}-${tranche.max}: ${base.toFixed(3)} * ${tranche.rate} = ${tax.toFixed(3)}`);
        }
    });
    console.log(`7. IRPP Dû: ${irpp.toFixed(3)}`);

    // CSS (0.5% de l'Assiette, pas de l'impôt)
    const css = assiette * 0.005;
    console.log(`8. CSS (0.5% de ${assiette.toFixed(3)}): ${css.toFixed(3)}`);

    const total = irpp + css;
    console.log(`9. Total Impôt à Payer: ${total.toFixed(3)}`);
}

verifyIRPP();
