function calculerIS2026_Strict(params) {
    console.log(`\n=== AUDIT FISCAL IS 2026 (STRICT) ===`);
    console.log(`Société : ${params.nom}`);

    // --- 1. BASE IMPOSABLE ---
    const reintegrations = params.reintegrations || 0;
    const deductions = params.deductions || 0;
    const baseGlobal = Math.max(0, params.res_comptable + reintegrations - deductions);
    const years = params.annee_activite || 1;
    const caTtc = params.ca_ttc;

    // --- 2. SECTOR & RATE LOGIC ---
    let tauxFacial = 0.15;
    let isStrategic = false;
    let isEnvironmental = false;
    let isExemptPeriod = false;
    let advantageRate = 0.15;

    // Mapping sectors
    if (['BANQUE', 'TELECOM', 'ASSURANCE', 'AUTO'].includes(params.secteur)) {
        tauxFacial = 0.35;
        isStrategic = true;
    } else if (['AGRI', 'SANTE', 'EDU'].includes(params.secteur)) {
        tauxFacial = 0.10;
    } else if (['IND'].includes(params.secteur)) {
        isEnvironmental = true;
    }

    // Regime Logic
    if (params.regime === 'ZDR') {
        if (years <= 10) isExemptPeriod = true;
        else advantageRate = 0.10;
    } else if (params.regime === 'STARTUP') {
        if (years <= 8) isExemptPeriod = true;
    } else if (params.regime === 'ETE') {
        if (years <= 10) isExemptPeriod = true;
    }

    // --- 3. IS BRUT ---
    let isDu = 0;
    let beneficeEligible = baseGlobal;
    let beneficeTaxable = 0;

    if (isExemptPeriod) {
        isDu = 0;
    } else if (params.regime === 'ETE' && years > 10) {
        // Déduction 50%
        isDu = (baseGlobal * 0.5) * tauxFacial;
    } else if (params.regime === 'ZDR' && years > 10) {
        isDu = baseGlobal * 0.10;
    } else {
        isDu = baseGlobal * tauxFacial;
    }

    // --- 4. MINIMUM IS (CA TTC) ---
    let minTax = 0;
    let minAbsolu = 500;
    let plafondMin = Infinity;

    if (tauxFacial <= 0.10 || params.regime === 'ZDR') {
        minTax = caTtc * 0.001;
        minAbsolu = 100;
        plafondMin = 300;
    } else {
        minTax = caTtc * 0.002;
        minAbsolu = 500;
    }

    const isFinalMin = Math.max(minAbsolu, Math.min(minTax, plafondMin));

    // Exemption rules for Minimum
    if (isExemptPeriod) {
        isDu = 0;
    } else {
        isDu = Math.max(isDu, isFinalMin);
    }

    // --- 5. CSS ---
    let montantCSS = 0;
    if (isExemptPeriod) {
        montantCSS = 0;
    } else if (params.regime === 'ZDR' && years > 10) {
        montantCSS = caTtc * 0.001; // Specific ZDR rule
    } else {
        const tauxCSS = (tauxFacial >= 0.35) ? 0.04 : 0.03;
        montantCSS = baseGlobal * tauxCSS;
    }

    // --- 6. CONTRIBUTIONS ---
    let montantStrategic = (!isExemptPeriod && isStrategic) ? baseGlobal * 0.04 : 0;
    let montantEnv = (!isExemptPeriod && isEnvironmental) ? baseGlobal * 0.01 : 0;

    const total = isDu + montantCSS + montantStrategic + montantEnv;

    console.log(`> IS DÛ            : ${isDu.toFixed(3)} DT`);
    console.log(`+ CSS              : ${montantCSS.toFixed(3)} DT`);
    if (montantStrategic > 0) console.log(`+ Contrib. Strat. : ${montantStrategic.toFixed(3)} DT`);
    if (montantEnv > 0) console.log(`+ Prélèvement Env. : ${montantEnv.toFixed(3)} DT`);
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
