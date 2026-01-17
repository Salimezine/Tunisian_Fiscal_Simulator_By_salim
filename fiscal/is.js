// IS - IMPÔT SUR LES SOCIÉTÉS - LF 2026
const SECTOR_OPTIONS = [
    // --- TAUX 10% (Activités Spécifiques) ---
    {
        id: "agri",
        label: "Agriculture & Pêche",
        is: 0.10,
        css: 0.03,
        spec: 0,
        min: 0.001,
        group: "Taux Réduit 10%"
    },
    {
        id: "artisanat",
        label: "Artisanat",
        is: 0.10,
        css: 0.03,
        spec: 0,
        min: 0.001,
        group: "Taux Réduit 10%"
    },
    {
        id: "zdr",
        label: "Zone de Développement Régional (ZDR)",
        is: 0.10,
        css: 0.03,
        spec: 0,
        min: 0.001,
        group: "Taux Réduit 10%"
    },
    {
        id: "culture",
        label: "Activités Culturelles",
        is: 0.10,
        css: 0.03,
        spec: 0,
        min: 0.001,
        group: "Taux Réduit 10%"
    },
    {
        id: "recyclage",
        label: "Tri, Collecte & Recyclage",
        is: 0.10,
        css: 0.03,
        spec: 0,
        min: 0.001,
        group: "Taux Réduit 10%"
    },

    // --- TAUX 20% (Droit Commun) ---
    {
        id: "commun",
        label: "Commerce, Industrie, Services (Droit Commun)",
        is: 0.20,
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Taux Standard 20%"
    },

    // --- TAUX 35% (Haute Rentabilité) ---
    {
        id: "telecom",
        label: "Télécommunications",
        is: 0.35,
        css: 0.03,
        spec: 0.04, // Taxe Consolidée 4% (LF 2026)
        min: 0.002,
        group: "Taux Majoré 35%"
    },
    {
        id: "petrole",
        label: "Services Pétroliers",
        is: 0.35,
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Taux Majoré 35%"
    },
    {
        id: "grandes_surfaces",
        label: "Grandes Surfaces & Hypermarchés",
        is: 0.35,
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Taux Majoré 35%"
    },
    {
        id: "auto",
        label: "Concessionnaires Automobiles",
        is: 0.35,
        css: 0.03,
        spec: 0.04, // Taxe Consolidée 4% (LF 2026)
        min: 0.002,
        group: "Taux Majoré 35%"
    },
    {
        id: "franchise",
        label: "Franchises (Faible Intégration Locale)",
        is: 0.35,
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Taux Majoré 35%"
    },
    {
        id: "investissement",
        label: "Sociétés d'Investissement",
        is: 0.35,
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Taux Majoré 35%"
    },

    // --- TAUX 40% (Secteur Financier) ---
    {
        id: "banque",
        label: "Banques & Établissements Financiers",
        is: 0.35, // Rate often 35% but sector 40% total
        css: 0.04, // Secteur Financier (LF 2026 - Conjoncturel 4%)
        spec: 0.04, // Taxe Consolidée 4% (LF 2026)
        min: 0.002,
        group: "Secteur Financier 43%"
    },
    {
        id: "leasing",
        label: "Leasing & Affacturage",
        is: 0.35,
        css: 0.04, // Secteur Financier
        spec: 0.04,
        min: 0.002,
        group: "Secteur Financier 43%"
    },
    {
        id: "assurance",
        label: "Assurances & Réassurances",
        is: 0.35,
        css: 0.04, // Secteur Financier
        spec: 0.04, // Taxe Consolidée 4% (LF 2026)
        min: 0.002,
        group: "Secteur Financier 43%"
    },

    // --- RÉGIME SPÉCIAL : Nouvelles Entreprises ---
    {
        id: "nouvelle_1",
        label: "🆕 Nouvelle Entreprise - 1ère Année (Exonération 100%)",
        is: 0.00,
        css: 0,
        spec: 0,
        min: 0,
        group: "Nouvelles Entreprises (2024-2025)"
    },
    {
        id: "nouvelle_2",
        label: "🆕 Nouvelle Entreprise - 2ème Année (Exonération 75%)",
        is: 0.05, // 20% * 25% = 5% effectif
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Nouvelles Entreprises (2024-2025)"
    },
    {
        id: "nouvelle_3",
        label: "🆕 Nouvelle Entreprise - 3ème Année (Exonération 50%)",
        is: 0.10, // 20% * 50% = 10% effectif
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Nouvelles Entreprises (2024-2025)"
    },
    {
        id: "nouvelle_4",
        label: "🆕 Nouvelle Entreprise - 4ème Année (Exonération 25%)",
        is: 0.15, // 20% * 75% = 15% effectif
        css: 0.03,
        spec: 0,
        min: 0.002,
        group: "Nouvelles Entreprises (2024-2025)"
    }
];

// Minimum de la Taxe Consolidée 4% (Supprimé pour conformité stricte LF 2026 - Calcul sur Bénéfice)
// const MIN_TAXE_CONSOLIDEE = 10000;

function initIS() {
    const container = document.getElementById('is-container');

    // Group options by category
    let groups = {};
    SECTOR_OPTIONS.forEach(s => {
        if (!groups[s.group]) groups[s.group] = [];
        groups[s.group].push(s);
    });

    // Generate grouped options HTML
    let optionsHtml = '';
    for (const [groupName, sectors] of Object.entries(groups)) {
        optionsHtml += `<optgroup label="${groupName}">`;
        sectors.forEach(s => {
            optionsHtml += `<option value="${s.id}">${s.label}</option>`;
        });
        optionsHtml += `</optgroup>`;
    }

    container.innerHTML = `
        <!-- Main Form -->


        <!-- Section 1: Secteur -->
        <div class="form-section" style="border-left: 4px solid var(--primary);">
            <div class="section-title">
                <span class="icon">🏢</span>
                <span>Secteur d'Activité</span>
            </div>
            
            <div class="form-group">
                <select id="secteurActivite" class="form-control" style="font-weight: 500;">
                    ${optionsHtml}
                </select>
            </div>
            
            <div class="info-bubble" id="taux-info" style="font-size: 0.9em;">
                <!-- Will be updated by JS -->
            </div>
        </div>

        <!-- Section 2: Résultats -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">📊</span>
                <span>Résultats Financiers</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Résultat Comptable (DT)</label>
                    <input type="number" id="resComptable" class="form-control" placeholder="Bénéfice ou Perte (+/-)">
                </div>
                <div class="form-group flex-col-50">
                    <label>Chiffre d'Affaires TTC (DT)</label>
                    <input type="number" id="caTtc" class="form-control" placeholder="Pour calcul Minimum d'Impôt">
                    <div class="help-text">Base du minimum d'impôt</div>
                </div>
            </div>
        </div>

        <!-- Section 3: Ajustements Fiscaux -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">⚖️</span>
                <span>Ajustements Fiscaux</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Réintégrations (+)</label>
                    <div class="info-bubble" style="font-size: 0.75em; color: var(--warning); margin-bottom: 5px;">
                        Charges non déductibles (amendes, dons excessifs, etc.)
                    </div>
                    <input type="number" id="reintegrations" class="form-control" value="0">
                    
                    <label style="margin-top:10px; display:block">Opération Spécifique (+)</label>
                    <input type="number" id="opSpecifiqueIs" class="form-control" placeholder="0.00">
                </div>
                <div class="form-group flex-col-50">
                    <label>Déductions (-)</label>
                    <div class="info-bubble" style="font-size: 0.75em; color: var(--success); margin-bottom: 5px;">
                        Produits non imposables, reports déficitaires
                    </div>
                    <input type="number" id="deductions" class="form-control" value="0">
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
            <button id="btn-calc-is" class="btn-primary" style="flex: 2;">
                <span class="icon">📊</span> Calculer IS 2026
            </button>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <input type="checkbox" id="showDetailsIS" style="margin-right: 8px;">
                <label for="showDetailsIS" style="font-size: 0.9em; cursor: pointer; user-select: none;">Voir détail calcul</label>
            </div>
        </div>
        <div id="result-is"></div>
    `;

    // Event Listeners
    document.getElementById('btn-calc-is').addEventListener('click', calculateIS);
    document.getElementById('secteurActivite').addEventListener('change', updateSectorInfo);

    // Dynamic ZDR Form Container
    const zdrSection = document.createElement('div');
    zdrSection.id = 'zdr-extra-fields';
    container.insertBefore(zdrSection, document.getElementById('btn-calc-is'));

    // Init Info
    updateSectorInfo();
}

function updateSectorInfo() {
    const sectorId = document.getElementById('secteurActivite').value;
    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);
    if (!s) return;

    const infoDiv = document.getElementById('taux-info');

    let infoText = `<strong>Taux applicables 2026 :</strong> IS <span class="highlight">${(s.is * 100).toFixed(0)}%</span>`;

    if (s.css > 0) infoText += ` | CSS (conj.) <span class="highlight">${(s.css * 100).toFixed(0)}%</span>`;
    if (s.spec > 0) infoText += ` | Taxe Consolidée <span class="highlight">${(s.spec * 100).toFixed(0)}%</span>`;
    if (s.min > 0) infoText += ` | Min. Impôt <span class="highlight">${(s.min * 100).toFixed(1)}%</span> CA`;

    // Special notes
    if (s.id.startsWith('nouvelle_')) {
        infoText += `<br><small style="color: var(--success);">✅ Régime dégressif pour nouvelles entreprises (Art. 2017-8)</small>`;
    }
    if (s.id === 'zdr') {
        infoText += `<br><small style="color: var(--success);">✅ Possibilité d'exonération totale 5-10 ans selon la zone</small>`;
    }
    if (s.spec > 0) {
        infoText += `<br><small style="color: var(--warning);">⚠️ Taxe Consolidée 4% (Fisc. Financière/Auto/Telecom - Art. 88)</small>`;
    }
    infoText += `<br><small style="color: #60a5fa;">📍 Note TCL : Taxe sur les établissements (0.2% du CA Local)</small>`;

    infoDiv.innerHTML = infoText;

    // --- MISE À JOUR FORMULAIRE ZDR ---
    const zdrContainer = document.getElementById('zdr-extra-fields');
    if (s.id === 'zdr') {
        zdrContainer.innerHTML = `
            <div class="form-section" style="border-left: 4px solid var(--success); background: rgba(16, 185, 129, 0.05);">
                <div class="section-title">
                    <span class="icon">📍</span>
                    <span>Détails Zone de Développement Régional (ZDR)</span>
                </div>
                
                <div class="flex-row">
                    <div class="form-group flex-col-50">
                        <label>Groupe de la Zone</label>
                        <select id="zdrGroupe" class="form-control">
                            <option value="1">Groupe 1 (Exo. 5 ans - Zaghouan, Mahdia, etc.)</option>
                            <option value="2">Groupe 2 (Exo. 10 ans - Jendouba, Kef, etc.)</option>
                        </select>
                        <div class="help-text">Le groupe 2 offre des avantages plus importants.</div>
                    </div>
                    <div class="form-group flex-col-50">
                        <label>Année d'exploitation actuelle</label>
                        <input type="number" id="zdrAnnee" class="form-control" value="1" min="1" max="50">
                        <div class="help-text">L'exonération totale dépend de l'âge du projet.</div>
                    </div>
                </div>

                <div class="flex-row" style="margin-top: 15px;">
                    <div class="form-group flex-col-50">
                        <label>Investissement Total (DT)</label>
                        <input type="number" id="zdrInvestissement" class="form-control" placeholder="Coût du projet" value="0">
                        <div class="help-text">Utilisé pour calculer la prime d'investissement.</div>
                    </div>
                    <div class="form-group flex-col-50">
                        <label>Masse Salariale Annuelle (DT)</label>
                        <input type="number" id="zdrMasseSalariale" class="form-control" placeholder="Total salaires bruts" value="0">
                        <div class="help-text">Pour calculer l'économie CNSS (approx. 16.57%).</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        zdrContainer.innerHTML = '';
    }
}

function calculateIS() {
    // Inputs
    const sectorId = document.getElementById('secteurActivite').value;
    const s = SECTOR_OPTIONS.find(opt => opt.id === sectorId);

    const resComptable = parseFloat(document.getElementById('resComptable').value) || 0;
    const caTtc = parseFloat(document.getElementById('caTtc').value) || 0;

    const reintegrations = parseFloat(document.getElementById('reintegrations').value) || 0;
    const opSpecifiqueIs = parseFloat(document.getElementById('opSpecifiqueIs').value) || 0;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;

    // 1. Resultat Fiscal
    const resFiscal = resComptable + reintegrations + opSpecifiqueIs - deductions;
    const baseImposable = Math.max(0, resFiscal);

    // --- LOGIQUE ZDR ---
    let isAppliedRate = s.is;
    let isExoTotale = false;
    let zdrPrime = 0;
    let cnssEconomie = 0;
    let zdrStatus = "";

    if (sectorId === 'zdr') {
        const groupe = parseInt(document.getElementById('zdrGroupe').value);
        const annee = parseInt(document.getElementById('zdrAnnee').value);
        const invest = parseFloat(document.getElementById('zdrInvestissement').value) || 0;
        const masseSalariale = parseFloat(document.getElementById('zdrMasseSalariale').value) || 0;

        const limitExo = (groupe === 1) ? 5 : 10;
        if (annee <= limitExo) {
            isAppliedRate = 0;
            isExoTotale = true;
            zdrStatus = `Exonération Totale (Année ${annee} / ${limitExo})`;
        } else {
            isAppliedRate = 0.10;
            zdrStatus = `Taux Réduit 10% (Fin d'exonération)`;
        }

        // Prime d'investissement
        const primeRate = (groupe === 1) ? 0.15 : 0.30;
        const primeMax = (groupe === 1) ? 1500000 : 3000000;
        zdrPrime = Math.min(invest * primeRate, primeMax);

        // Economie CNSS (16.57%)
        if (annee <= limitExo) {
            cnssEconomie = masseSalariale * 0.1657;
        }
    }

    // 2. IS Calculé
    const isCalcule = baseImposable * isAppliedRate;

    // 3. Minimum d'Impôt (0.2% standard, 0.1% pour taux 10%)
    const minImpot = caTtc * s.min;

    // 4. IS Dû (Le plus élevé entre IS Calculé et Min Impôt)
    const isDu = Math.max(isCalcule, minImpot);

    // 5. Contributions Additionnelles
    let cssAmount = 0;
    let specTaxAmount = 0;

    if (baseImposable > 0) {
        // 5.a CSS (Art. 88 LF 2024 / LF 2026) 
        // 4% Banques/Assurances, 3% Autres Sociétés
        cssAmount = baseImposable * s.css;

        // 5.b Taxe Spéciale Consolidée (4% - LF 2026)
        if (s.spec > 0) {
            specTaxAmount = baseImposable * s.spec;
        }
    }

    // 6. TCL (Taxe Locative / Établissements) - 0.2% du CA Local
    const tclAmount = caTtc * 0.002;

    const totalAPayer = isDu + cssAmount + specTaxAmount + tclAmount;

    // Which tax applies?
    const isMinApplied = minImpot > isCalcule;

    // Display
    const resultDiv = document.getElementById('result-is');
    const showDetails = document.getElementById('showDetailsIS').checked;

    // --- RECOMMANDATION 3: Transparence (Mode Détail) ---
    let detailedCalculationHtml = '';
    if (showDetails) {
        detailedCalculationHtml = `
            <div class="audit-journal-card" style="margin-top: 15px; padding: 15px; background: #1e1e1e; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.85em; color: #d4d4d4; border: 1px solid #333;">
                <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">📟 Journal de Calcul (Audit IS)</h4>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>(+) Résultat Comptable</span>
                    <span>${resComptable.toFixed(3)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #f59e0b;">
                    <span>(+) Réintégrations</span>
                    <span>+ ${reintegrations.toFixed(3)}</span>
                </div>
                 <div style="display: flex; justify-content: space-between; color: #10b981;">
                    <span>(-) Déductions</span>
                    <span>- ${deductions.toFixed(3)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #fff; border-top: 1px solid #777; padding-top: 5px;">
                    <span>(=) Résultat Fiscal (Assiette)</span>
                    <span>${resFiscal.toFixed(3)}</span>
                </div>

                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #444;">
                   <div style="display: flex; justify-content: space-between;">
                        <span>(x) Taux IS (${(isAppliedRate * 100).toFixed(0)}%)</span>
                        <span>= ${isCalcule.toFixed(3)}</span>
                    </div>
                     <div style="display: flex; justify-content: space-between;">
                        <span>(vs) Minimum d'Impôt (${(s.min * 100).toFixed(1)}% CA)</span>
                        <span>= ${minImpot.toFixed(3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight:bold; color: #fbbf24;">
                        <span>(>) IS Dû Retenu</span>
                        <span>${isDu.toFixed(3)}</span>
                    </div>
                </div>
                
                ${cssAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; color: #ef4444;">
                    <span>(+) CSS (${(s.css * 100).toFixed(0)}% Assiette)</span>
                    <span>+ ${cssAmount.toFixed(3)}</span>
                </div>` : ''}
            </div>
        `;
    }

    let detailsHtml = `
        <div style="margin-bottom: 20px;">
            <!-- Section 1: Résultat Fiscal -->
            <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:8px; margin-bottom:12px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.95em;">
                    <div>
                        <span style="opacity:0.7">Résultat Comptable :</span>
                        <strong style="float:right">${resComptable.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">Réintégrations (+) :</span>
                        <strong style="float:right; color: var(--warning)">+ ${reintegrations.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">Op. Spécifique (+) :</span>
                        <strong style="float:right; color: var(--warning)">+ ${opSpecifiqueIs.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7">Déductions (-) :</span>
                        <strong style="float:right; color: var(--success)">- ${deductions.toLocaleString('fr-TN')} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2px;">
                        <span style="font-weight: 600;">= Résultat Fiscal :</span>
                        <strong style="float:right; color: var(--text-main); font-size: 1.1em;">${resFiscal.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <!-- Section 2: Calcul de l'Impôt -->
            <div style="background: rgba(255,255,255,0.03); padding:12px; border-radius:8px; border-left: 3px solid var(--primary); margin-bottom: 12px;">
                <small style="opacity:0.6; display:block; margin-bottom:8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Liquidation de l'impôt
                    <span style="float: right; font-size: 0.8em; color: var(--accent);" title="Source Officielle">📜 <a href="https://www.impots.finances.gov.tn" target="_blank" style="color: inherit; text-decoration: underline;">Art. 49 Code IS</a></span>
                </small>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                    <div>
                        <span style="opacity:0.7">IS Théorique (${(isAppliedRate * 100)}%) :</span>
                        <strong style="float:right">${isCalcule.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                    <div>
                        <span style="opacity:0.7" data-tooltip="Impôt Minimum Forfaitaire (IMF) calculé sur le Chiffre d'Affaires.">Min. d'Impôt (${(s.min * 100).toFixed(1)}%) :</span>
                        <strong style="float:right">${minImpot.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                    <div style="grid-column: span 2; padding: 5px 0; color: var(--primary); font-weight: 600;">
                        <span>👉 IS Dû (Maximum) :</span>
                        <span style="float:right">${isDu.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT ${isMinApplied ? '⚠️' : ''}</span>
                    </div>

                    ${s.css > 0 ? `
                    <div style="grid-column: span 2;">
                        <span style="opacity:0.7">CSS (Conjoncturelle) (${(s.css * 100)}%) :</span>
                        <strong style="float:right">+ ${cssAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        <br><span style="font-size:0.75em; opacity: 0.5; float:right;">(<a href="https://www.impots.finances.gov.tn" target="_blank" style="color: inherit;">Art. 58 LF 2026</a>)</span>
                    </div>` : ''}
                    
                    ${s.spec > 0 ? `
                    <div style="grid-column: span 2;">
                        <span style="opacity:0.7">Taxe Consolidée (${(s.spec * 100)}%) :</span>
                        <strong style="float:right">+ ${specTaxAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>` : ''}

                    <div style="border-top: 1px dotted rgba(255,255,255,0.1); padding-top: 5px; grid-column: span 2;">
                        <span style="opacity:0.7" data-tooltip="Taxe aux Collectivités Locales (0,2% du CA Local).">TCL (0.2% CA) :</span>
                        <strong style="float:right">+ ${tclAmount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                    </div>
                </div>
            </div>

            <!-- Section 3: Avantages ZDR (Si applicable) -->
            ${sectorId === 'zdr' ? `
            <div style="background: rgba(16, 185, 129, 0.1); padding:12px; border-radius:8px; border-left: 3px solid var(--success);">
                <div style="font-size: 0.9em;">
                    <div style="color: var(--success); font-weight: 600; margin-bottom: 8px;">🎁 Booster ZDR Détecté :</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>
                            <span style="opacity:0.8">Régime Fiscal :</span>
                            <strong style="float:right; color: var(--success)">${zdrStatus}</strong>
                        </div>
                        <div>
                            <span style="opacity:0.8">Prime Invest. :</span>
                            <strong style="float:right; color: #10b981">+ ${zdrPrime.toLocaleString('fr-TN')} DT</strong>
                        </div>
                        <div style="grid-column: span 2;">
                            <span style="opacity:0.8">Economie CNSS (approx.) :</span>
                            <strong style="float:right; color: #10b981">+ ${cnssEconomie.toLocaleString('fr-TN')} DT / an</strong>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${detailedCalculationHtml}
        </div>
    `;

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <span>Total à Payer (IS + Contributions)</span>
                <span class="final-amount">${totalAPayer.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span>
            </div>
            ${detailsHtml}
            
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 0.85em; opacity: 0.8;">
                <p><strong>📌 Notes Fiscales 2026 :</strong></p>
                <ul style="font-size: 0.85em; padding-left: 15px; margin-top: 5px;">
                    ${sectorId === 'zdr' ? `
                        <li style="color:var(--success)">Exonération totale d'IS pendant les premières années en ZDR (<a href="#" style="color:inherit">Art. 23 Code Incit. Invest.</a>).</li>
                        <li>Après exonération, le taux est fixé à 10%.</li>
                    ` : ''}
                    <li>CSS maintenue à titre conjoncturel (3% et 4% selon secteur) - <span style="opacity:0.7">Loi de Finances</span>.</li>
                    <li>Minimum d'impôt applicable même en cas d'exonération d'IS.</li>
                </ul>
            </div>
            <button onclick="window.print()" class="btn-primary" style="margin-top:20px; background: var(--accent);">🖨️ Imprimer Simulation</button>
        </div>
    `;

    // LOG & Global Sync
    window.lastCalculation = {
        type: 'IS',
        totalTax: totalAPayer,
        data: {
            resComptable,
            resFiscal,
            isDu,
            cssAmount,
            specTaxAmount,
            tclAmount,
            totalAPayer
        }
    };

    if (window.shareWithAI) {
        window.shareWithAI(window.lastCalculation);
    }
}
