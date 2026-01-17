// TVA - TAXE SUR LA VALEUR AJOUTÉE - LF 2026
const TAUX_TVA = [
    {
        value: 0.19,
        label: "19% - Taux Standard",
        description: "Majorité des biens et services"
    },
    {
        value: 0.13,
        label: "13% - Taux Intermédiaire",
        description: "Électricité basse tension, produits pétroliers, certains équipements"
    },
    {
        value: 0.07,
        label: "7% - Taux Réduit",
        description: "Restauration, hébergement, services professionnels, véhicules (conditions)"
    },
    {
        value: 0,
        label: "0% - Exonéré / Export / Suspension",
        description: "Exportations, médicaments (suspension jusqu'au 31/12/2026)"
    }
];

// Catégories de produits/services avec taux suggéré
const CATEGORIES_TVA = [
    { id: "standard", label: "Biens et Services (Droit Commun)", taux: 0.19 },
    { id: "electricite", label: "Électricité Basse Tension", taux: 0.13 },
    { id: "petrole", label: "Produits Pétroliers", taux: 0.13 },
    { id: "equipements", label: "Équipements Spécifiques", taux: 0.13 },
    { id: "restauration", label: "Restauration", taux: 0.07 },
    { id: "hebergement", label: "Hébergement / Hôtellerie", taux: 0.07 },
    { id: "services_pro", label: "Services Professionnels Libéraux", taux: 0.07 },
    { id: "vehicules", label: "Véhicules Importés (Résidents)", taux: 0.07 },
    { id: "recharge_elec", label: "Recharge Véhicules Électriques (Nouveau 2026)", taux: 0.07 },
    { id: "immo_social", label: "Logement social/économique (< 400 DT)", taux: 0.07 },
    { id: "immo_standing", label: "Logement standing (> 400 DT)", taux: 0.19 },
    { id: "medicaments", label: "Médicaments (Suspension 2026)", taux: 0 },
    { id: "export", label: "Exportations", taux: 0 },
    { id: "exonere", label: "Produits Exonérés", taux: 0 }
];

function initTVA() {
    const container = document.getElementById('tva-container');

    // Generate Options for rate selector
    let tauxOptionsHtml = TAUX_TVA.map(t => `<option value="${t.value}">${t.label}</option>`).join('');

    // Group categories by tax rate
    const groupedCategories = {};
    CATEGORIES_TVA.forEach(c => {
        const rateLabel = (c.taux * 100).toFixed(0) + "%";
        if (!groupedCategories[rateLabel]) groupedCategories[rateLabel] = [];
        groupedCategories[rateLabel].push(c);
    });

    let categoriesHtml = '';
    for (const [rate, categories] of Object.entries(groupedCategories)) {
        categoriesHtml += `<optgroup label="Taux ${rate}">`;
        categories.forEach(c => {
            categoriesHtml += `<option value="${c.id}" data-taux="${c.taux}">${c.label}</option>`;
        });
        categoriesHtml += `</optgroup>`;
    }

    container.innerHTML = `
        <!-- E-Invoicing Alert 2026 -->
        <div class="glass-card" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); margin-bottom: 20px;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:1.5em;">📢</span>
                <div>
                    <strong style="color: #93c5fd;">Nouveauté 2026 : Facturation Électronique Obligatoire</strong>
                    <p style="font-size: 0.85em; opacity: 0.9; margin:5px 0 0 0;">
                        À partir du <strong>1er Janvier 2026</strong>, la facturation électronique (e-invoicing) devient obligatoire pour <strong>tous les biens et services</strong> soumis à TVA.
                    </p>
                </div>
            </div>
        </div>

        <!-- Récapitulatif Taux 2026 -->
        <div class="glass-card" style="margin-bottom: 20px; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3);">
            <h4 style="color: #34d399; margin-bottom: 10px;">📋 Taux TVA 2026</h4>
            <div style="font-size: 0.85em; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <div><strong>19%</strong> : Taux normal (majorité des biens/services)</div>
                <div><strong>13%</strong> : Électricité, produits pétroliers</div>
                <div><strong>7%</strong> : Restauration, hébergement, services pro</div>
                <div><strong>0%</strong> : Export, médicaments (suspension)</div>
            </div>
        </div>

        <!-- Section 1: Type d'opération -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">🏷️</span>
                <span>Type d'Opération</span>
            </div>
            
            <div class="form-group">
                <label>Catégorie de Produit/Service</label>
                <select id="categorieTva" class="form-control">
                    ${categoriesHtml}
                </select>
                <div class="help-text" id="categorie-info">Le taux sera automatiquement suggéré</div>
            </div>
        </div>

        <!-- Section 2: TVA Collectée -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">💳</span>
                <span>TVA Collectée (Ventes)</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Chiffre d'Affaires HT (Base Imposable)</label>
                    <input type="number" id="baseHt" class="form-control" placeholder="Montant HT">
                </div>
                <div class="form-group flex-col-50">
                    <label>Opération Spécifique (+) </label>
                    <input type="number" id="opSpecifiqueTva" class="form-control" placeholder="0.000">
                    <div class="help-text">Opérations additive à la base imposable</div>
                </div>
            </div>

            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Taux de TVA</label>
                    <select id="tauxTva" class="form-control">
                        ${tauxOptionsHtml}
                    </select>
                </div>
                <div class="form-group flex-col-50" style="display:flex; align-items:center; padding-top:25px;">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="checkSuspension" style="width:20px; height:20px;">
                        <span>Vente en Suspension</span>
                    </label>
                </div>
            </div>

            <div id="suspension-details" class="form-group hidden" style="margin-top: -10px; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                 <label style="font-size:0.9em;">N° Attestation / Bon de Commande</label>
                 <input type="text" id="numAttestation" class="form-control" placeholder="Ex: 2026/00123">
                 <div class="help-text" style="color: var(--success);">✅ Attestation requise pour justifier la suspension</div>
            </div>

            <!-- Warning Immobilière -->
            <div id="immo-warning" class="hidden" style="margin-top: 10px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 3px solid var(--warning); font-size: 0.85em; color: var(--warning);">
                ⚠️ <strong>Réserve Juridique :</strong> Le taux réduit de 7 % s’applique exclusivement aux logements neufs destinés à l’habitation (surface < 100m² ou convention sociale), vendus par des promoteurs immobiliers, dont le prix n’excède pas 400 000 DT.
            </div>
            
            <div style="text-align:right; font-size: 0.9em; margin-top:5px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                <span>Montant TTC : </span>
                <strong id="preview-ttc" style="color:var(--text-main);">0.000 DT</strong>
                <br>
                <span>TVA Facturée : </span>
                <strong id="preview-tva" style="color:var(--primary);">0.000 DT</strong>
            </div>
        </div>

        <!-- Section 3: TVA Déductible -->
        <div class="form-section">
            <div class="section-title">
                <span class="icon">🧾</span>
                <span>TVA Déductible (Achats)</span>
            </div>
            
            <div class="flex-row">
                <div class="form-group flex-col-50">
                    <label>Sur Immobilisations</label>
                    <input type="number" id="tvaImmobilisation" class="form-control" placeholder="0.00">
                    <div class="help-text">Équipements, véhicules, locaux...</div>
                </div>
                <div class="form-group flex-col-50">
                    <label>Sur Achats / Exploitation</label>
                    <input type="number" id="tvaExploitation" class="form-control" placeholder="0.00">
                    <div class="help-text">Marchandises, fournitures, services...</div>
                </div>
            </div>
             
             <div class="form-group">
                <label>Crédit de TVA Antérieur (Report)</label>
                <input type="number" id="reportTva" class="form-control" placeholder="0.00">
            </div>

            <div class="form-group" style="margin-top:20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:15px;">
                <div class="info-bubble" style="background: rgba(16, 185, 129, 0.05); border-color: var(--success); font-size: 0.8em;">
                    ℹ️ <strong>Note sur le Prorata :</strong> La déduction est calculée sur la base du CA HT. Une régularisation annuelle (et sur immobilisations) est obligatoire conformément aux articles 9 et 9 bis du Code de la TVA.
                </div>
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox" id="checkProrata" style="width:18px; height:18px;">
                    <span>Appliquer la règle du Prorata (Assujetti Mixte)</span>
                </label>
                <div id="prorata-input-container" class="hidden" style="margin-top:10px;">
                    <div style="display:flex; gap:10px;">
                         <div style="flex:1">
                            <label>Prorata (%)</label>
                            <input type="number" id="prorataValue" class="form-control" value="100" min="0" max="100">
                         </div>
                         <div style="flex:1">
                            <label>Type de bien</label>
                            <select id="typeBienRegul" class="form-control">
                                <option value="equip">Équipement (1/5ème)</option>
                                <option value="immo">Bâtiment (1/10ème)</option>
                            </select>
                         </div>
                    </div>
                    <div class="help-text">Droit à déduction limité au prorata. Régularisation sur 5 ans (matériel) ou 10 ans (immo).</div>
                </div>
            </div>
        </div>

        <button id="btn-calc-tva" class="btn-primary" style="background: var(--primary);">
            <span class="icon">🧮</span> Calculer Déclaration TVA
        </button>
        <div id="result-tva"></div>
    `;

    // Listeners
    document.getElementById('btn-calc-tva').addEventListener('click', calculateTVA);

    // Category change updates rate
    document.getElementById('categorieTva').addEventListener('change', () => {
        const select = document.getElementById('categorieTva');
        const selectedOption = select.options[select.selectedIndex];
        const suggestedRate = parseFloat(selectedOption.dataset.taux);

        document.getElementById('tauxTva').value = suggestedRate;

        const category = CATEGORIES_TVA.find(c => c.id === select.value);

        // Show/Hide Immo Warning
        const immoWarning = document.getElementById('immo-warning');
        if (select.value === 'immo_social') {
            immoWarning.classList.remove('hidden');
        } else {
            immoWarning.classList.add('hidden');
        }

        if (category) {
            document.getElementById('categorie-info').innerHTML =
                `<span style="color: var(--primary);">Taux suggéré : ${(suggestedRate * 100).toFixed(0)}%</span>`;
        }

        updatePreview();
    });

    // Dynamic Preview
    const updatePreview = () => {
        const base = parseFloat(document.getElementById('baseHt').value) || 0;
        const opSpec = parseFloat(document.getElementById('opSpecifiqueTva').value) || 0;
        const totalBase = base + opSpec;
        const taux = parseFloat(document.getElementById('tauxTva').value);
        const isSuspended = document.getElementById('checkSuspension').checked;
        const details = document.getElementById('suspension-details');

        if (isSuspended) {
            details.classList.remove('hidden');
            document.getElementById('preview-tva').textContent = "0.000 DT (Suspendue)";
            document.getElementById('preview-tva').style.color = "var(--success)";
            document.getElementById('preview-ttc').textContent = totalBase.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
        } else {
            details.classList.add('hidden');
            const tva = totalBase * taux;
            const ttc = totalBase + tva;
            document.getElementById('preview-tva').textContent = tva.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
            document.getElementById('preview-tva').style.color = "var(--primary)";
            document.getElementById('preview-ttc').textContent = ttc.toLocaleString('fr-TN', { minimumFractionDigits: 3 }) + " DT";
        }
    };

    document.getElementById('baseHt').addEventListener('input', updatePreview);
    document.getElementById('opSpecifiqueTva').addEventListener('input', updatePreview);
    document.getElementById('tauxTva').addEventListener('change', updatePreview);
    document.getElementById('checkSuspension').addEventListener('change', updatePreview);
    document.getElementById('checkProrata').addEventListener('change', () => {
        const container = document.getElementById('prorata-input-container');
        if (document.getElementById('checkProrata').checked) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
}

function calculateTVA() {
    // 1. Collectée
    const base = parseFloat(document.getElementById('baseHt').value) || 0;
    const opSpec = parseFloat(document.getElementById('opSpecifiqueTva').value) || 0;
    const totalBase = base + opSpec;
    const taux = parseFloat(document.getElementById('tauxTva').value);
    const isSuspended = document.getElementById('checkSuspension').checked;
    const numAttestation = document.getElementById('numAttestation').value;

    // Get selected category
    const categorieSelect = document.getElementById('categorieTva');
    const categorieName = categorieSelect.options[categorieSelect.selectedIndex].text;

    let tvaCollectee = 0;
    if (!isSuspended) {
        tvaCollectee = totalBase * taux;
    }

    const montantTTC = totalBase + tvaCollectee;

    // 2. Déductible
    const tvaImmo = parseFloat(document.getElementById('tvaImmobilisation').value) || 0;
    const tvaExploitation = parseFloat(document.getElementById('tvaExploitation').value) || 0;
    const report = parseFloat(document.getElementById('reportTva').value) || 0;

    // Prorata calculation
    let prorata = 1;
    let prorataLabel = "";
    if (document.getElementById('checkProrata').checked) {
        prorata = (parseFloat(document.getElementById('prorataValue').value) || 100) / 100;
        prorataLabel = ` (Prorata ${(prorata * 100).toFixed(0)}%)`;
    }

    const tvaRecuperableBrute = tvaImmo + tvaExploitation;
    const tvaRecuperableNette = tvaRecuperableBrute * prorata;

    // Calcul de la fraction de régularisation si variation > 5% (simulé ici dans le détail)
    const typeBien = document.getElementById('typeBienRegul')?.value || 'equip';
    const fraction = (typeBien === 'immo') ? '1/10ème' : '1/5ème';

    const totalDeductible = tvaRecuperableNette + report;

    // 3. Solde
    const solde = tvaCollectee - totalDeductible;

    let message = "";
    let amount = 0;
    let isCredit = false;

    if (solde > 0) {
        message = "TVA À PAYER (Net à verser au Trésor)";
        amount = solde;
    } else if (solde < 0) {
        message = "CRÉDIT DE TVA (À reporter sur déclaration suivante)";
        amount = Math.abs(solde);
        isCredit = true;
    } else {
        message = "SOLDE NUL";
        amount = 0;
    }

    // Get rate label
    const tauxLabel = TAUX_TVA.find(t => t.value === taux)?.label || `${(taux * 100).toFixed(0)}%`;

    const resultDiv = document.getElementById('result-tva');
    resultDiv.innerHTML = `
        <div class="result-card" style="border-left: 5px solid ${isCredit ? 'var(--success)' : (amount === 0 ? 'var(--accent)' : 'var(--warning)')};">
            <div class="result-header">
                <span>${message}</span>
                <span class="final-amount" style="color: ${isCredit ? 'var(--success)' : (amount === 0 ? 'var(--accent)' : 'var(--warning)')}">
                    ${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT
                </span>
            </div>
            
            <div style="margin-bottom: 20px;">
                <!-- Détail Opération -->
                <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:6px; margin-bottom:12px;">
                    <p style="margin:0 0 8px 0; color: var(--text-muted); font-size:0.85em;">🏷️ Catégorie : <strong style="color:var(--text-main)">${categorieName}</strong></p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                        <div>
                            <span style="opacity:0.7">Base HT :</span>
                            <strong style="float:right">${base.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">Op. Spécifique :</span>
                            <strong style="float:right; color: var(--warning)">+ ${opSpec.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">Total Base :</span>
                            <strong style="float:right">${totalBase.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">Taux :</span>
                            <strong style="float:right; color: var(--primary)">${isSuspended ? '0% (Suspension)' : (taux * 100).toFixed(0) + '%'}</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">TVA Facturée :</span>
                            <strong style="float:right; color: var(--primary)">${tvaCollectee.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                        <div>
                            <span style="opacity:0.7">Montant TTC :</span>
                            <strong style="float:right">${montantTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</strong>
                        </div>
                    </div>
                </div>

                <!-- Collectée vs Déductible -->
                <div style="padding:10px;">
                    <p style="margin:5px 0;"><strong>+ TVA Collectée :</strong> <span style="float:right; color:var(--warning); font-weight:bold;">${tvaCollectee.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span></p>
                    
                    <div style="margin: 10px 0; padding-left: 15px; border-left: 2px solid rgba(255,255,255,0.1);">
                        <p style="margin:5px 0; font-size: 0.9em;"><strong>– TVA Déductible Net :</strong> <span style="float:right; color:var(--success); font-weight:bold;">${totalDeductible.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</span></p>
                        <ul style="font-size:0.85em; opacity:0.8; padding-left:15px; margin: 5px 0;">
                            <li>Brut (Immo + Exp) : ${tvaRecuperableBrute.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                            ${prorata < 1 ? `
                            <li style="color:var(--warning)">Réduction Prorata : - ${(tvaRecuperableBrute * (1 - prorata)).toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                            <li style="font-size:0.85em; opacity:0.7;">Note : Régularisation sur base de ${fraction} annuelle.</li>` : ''}
                            <li>Report antérieur : ${report.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT</li>
                        </ul>
                    </div>
                    
                    <p style="margin:10px 0 0 0; padding-top:10px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 1.05em;">
                        <strong>= Solde :</strong> 
                        <span style="float:right; font-weight:bold; color: ${isCredit ? 'var(--success)' : 'var(--warning)'}">
                            ${isCredit ? '(' : ''}${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} DT${isCredit ? ')' : ''}
                        </span>
                    </p>
                </div>
                
                ${isSuspended ? `
                <div style="margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border-left: 3px solid var(--success);">
                    <p style="font-size:0.9em; color: var(--success); margin: 0;">
                        ✅ Opération en suspension de TVA (Art. 11/13 du Code TVA)
                        ${numAttestation ? `<br><span style="opacity:0.8">N° Attestation : <strong>${numAttestation}</strong></span>` : ''}
                    </p>
                </div>
                ` : ''}
            </div>

            <div style="margin-top: 15px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 6px; font-size: 0.85em;">
                <p style="margin: 0 0 5px 0;"><strong>📌 Rappels LF 2026 :</strong></p>
                <ul style="margin: 0; padding-left: 15px; opacity: 0.85;">
                    <li>Taux : 19% (normal), 13% (intermédiaire), 7% (réduit), 0% (export/exonéré)</li>
                    <li><strong>Facturation électronique (Art. 53) :</strong> Utilisation obligatoire de <strong>TTN / El Fatoora</strong>.</li>
                    <li><strong>Sanctions :</strong> Papier au lieu d'électronique (100-500 DT/facture), non-conformité (250-10 000 DT).</li>
                    <li>Suspension TVA médicaments (équivalent local) jusqu'au 31/12/2026</li>
                </ul>
            </div>

            <button onclick="window.print()" class="btn-primary" style="margin-top:15px; background: var(--accent);">
               📄 Imprimer la Déclaration
            </button>
        </div>
    `;
    // Sync with AI
    if (window.shareWithAI) {
        window.shareWithAI({
            module: 'TVA',
            categorie: categorieName,
            baseHT: totalBase,
            tvaCollectee: tvaCollectee,
            solde: solde,
            montantTTC: montantTTC
        });
    }
}
