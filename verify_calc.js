
function calculateIRPP(scenario) {
    console.log(`\n--- VÉRIFICATION: ${scenario.name} ---`);
    console.log(`Données: ${scenario.brutMensuel} DT/mois, Chef: ${scenario.chef}, Enfants: ${scenario.enfants}, Etudiants: ${scenario.etudiants}`);

    const brutAnnuel = scenario.brutMensuel * 12;
    // CNSS (9.18% du Brut)
    const cnss = brutAnnuel * 0.0918;
    const brutFiscal = brutAnnuel - cnss;

    // Frais Pros (10% du Brut Fiscal, Max 2000)
    const fraisProTheorique = brutFiscal * 0.10;
    const fraisPro = Math.min(fraisProTheorique, 2000);

    // Net Imposable Intermédiaire
    const netInter = brutFiscal - fraisPro;

    // Déductions
    const deducChef = scenario.chef ? 300 : 0;
    const deducEnfant = scenario.enfants * 100;
    const deducEtudiant = scenario.etudiants * 1000;
    const totalDeduc = deducChef + deducEnfant + deducEtudiant;

    // Assiette
    const assiette = Math.max(0, netInter - totalDeduc);

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
    BAREME.forEach(tranche => {
        if (assiette > tranche.min) {
            const effectiveMax = (tranche.max === Infinity) ? assiette : tranche.max;
            const base = Math.max(0, Math.min(assiette, effectiveMax) - tranche.min);
            const tax = base * tranche.rate;
            irpp += tax;
        }
    });

    // CSS (0.5% de l'Assiette, pas de l'impôt)
    const css = assiette * 0.005;
    const total = irpp + css;

    // Net Mensuel
    const netAnnuel = brutAnnuel - cnss - total;
    const netMensuel = netAnnuel / 12;

    console.log(`> Brut Annuel: ${brutAnnuel.toFixed(3)}`);
    console.log(`> Assiette: ${assiette.toFixed(3)}`);
    console.log(`> IRPP Dû: ${irpp.toFixed(3)}`);
    console.log(`> CSS: ${css.toFixed(3)}`);
    console.log(`> Total Impôt: ${total.toFixed(3)}`);
    console.log(`> Net Mensuel: ${netMensuel.toFixed(3)}`);
}

const scenarios = [
    { name: "Cas Standard", brutMensuel: 2500, chef: true, enfants: 1, etudiants: 1 },
    { name: "Salaire Modeste (SMIG+)", brutMensuel: 600, chef: false, enfants: 0, etudiants: 0 },
    { name: "Haut Revenu", brutMensuel: 10000, chef: true, enfants: 2, etudiants: 0 },
    { name: "Famille Nombreuse", brutMensuel: 3500, chef: true, enfants: 4, etudiants: 0 }
];

scenarios.forEach(calculateIRPP);
