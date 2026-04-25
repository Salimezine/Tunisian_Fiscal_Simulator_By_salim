/**
 * Service d'exportation pour le Simulateur Fiscal
 * Gère la génération de PDF (Fiche de Simulation) et Excel
 */
class ExportService {
    constructor() {
        this.doc = null;
    }

    /**
     * Génère un PDF "Fiche de Simulation" professionnelle
     * @param {Object} data - Les données du calcul (IRPP, IS, etc.)
     * @param {String} type - Le type de simulation ('IRPP', 'IS', 'TVA', 'RS'...)
     */
    generatePDF(data, type) {
        if (!window.jspdf) {
            console.error("jsPDF not loaded");
            return;
        }

        const { jsPDF } = window.jspdf;
        this.doc = new jsPDF();
        const doc = this.doc;

        // --- EN-TÊTE ACADÉMIQUE ---
        this._addHeader(doc);

        // --- TITRE DU DOCUMENT ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246); // Primary Blue
        doc.text(`FICHE DE SIMULATION FISCALE - ${type}`, 105, 55, null, null, "center");

        // --- DÉTAILS DE LA SIMULATION ---
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        let yPos = 70;

        if (type === 'IRPP') {
            this._renderIRPPDetails(doc, data, yPos);
        } else if (type === 'IS') {
            this._renderISDetails(doc, data, yPos);
        } else if (type === 'TVA') {
            this._renderTVADetails(doc, data, yPos);
        } else if (type === 'RS') {
            this._renderRSDetails(doc, data, yPos);
        }

        // --- PIED DE PAGE ---
        this._addFooter(doc);

        // --- SAUVEGARDE ---
        const validName = `Simulation_Fiscale_${type}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(validName);
    }

    /**
     * Helper pour l'en-tête (Logo, Titre Université)
     */
    _addHeader(doc) {
        // Fond gris léger pour l'en-tête
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("INSTITUT SUPÉRIEUR D'ADMINISTRATION", 105, 15, null, null, "center");
        doc.text("DES AFFAIRES DE SFAX (ISAAS)", 105, 22, null, null, "center");

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Projet de Fin d'Études 2026 - Simulateur Fiscal Intelligent", 105, 30, null, null, "center");

        doc.setDrawColor(200, 200, 200);
        doc.line(10, 40, 200, 40);
    }

    /**
     * Rendu spécifique pour l'IRPP
     */
    _renderIRPPDetails(doc, data, startY) {
        let y = startY;
        const now = new Date();
        const inputs = data.inputs || {};

        // --- EN-TÊTE BULLETIN ---
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("BULLETIN DE PAIE", 105, y, null, null, "center");
        y += 10;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        
        // Cadre Employeur & Employé
        doc.rect(14, y, 90, 25); // Employeur
        doc.rect(106, y, 90, 25); // Employé
        
        doc.setFont("helvetica", "bold");
        doc.text("EMPLOYEUR:", 16, y + 5);
        doc.text("SALARIÉ:", 108, y + 5);
        
        doc.setFont("helvetica", "normal");
        doc.text("SOCIETE SIMULATION FISCALE", 16, y + 10);
        doc.text("1002 TUNIS", 16, y + 15);
        doc.text("CNSS: 00000000-00", 16, y + 20);
        
        doc.text(`NOM: NOM & PRÉNOM`, 108, y + 10);
        doc.text(`CIN: 00000000 | Matricule: 001`, 108, y + 15);
        doc.text(`Situation: ${inputs.chefFamille ? 'Chef de famille' : 'Célibataire'}`, 108, y + 20);
        
        y += 30;

        // Période
        doc.setFont("helvetica", "bold");
        doc.text(`PÉRIODE: ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`, 14, y);
        doc.text(`DATE: ${now.toLocaleDateString()}`, 160, y);
        y += 8;

        // Table des rubriques
        const tableData = [
            ["Salaire de base", "1", data.grossIncome.toFixed(3), data.grossIncome.toFixed(3), "", "", ""],
            ["Cotisation CNSS (9.18%)", "", data.grossIncome.toFixed(3), "", data.cnss.toFixed(3), "16.57%", (data.grossIncome * 0.1657).toFixed(3)],
            ["Accident du travail", "", data.grossIncome.toFixed(3), "", "", "0.50%", (data.grossIncome * 0.005).toFixed(3)],
            ["Salaire Brut Imposable", "", "", data.assietteSoumise.toFixed(3), "", "", ""],
            ["IRPP", "", "", "", data.irppNet.toFixed(3), "", ""],
            ["CSS (0.5%)", "", "", "", data.css.toFixed(3), "", ""],
        ];

        doc.autoTable({
            startY: y,
            head: [['Désignation', 'Nb', 'Base', 'Gain', 'Retenue', 'Taux Pat.', 'Ret. Pat.']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40], textColor: 255 },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Total Net
        doc.setFillColor(240, 240, 240);
        doc.rect(130, y, 66, 15, 'F');
        doc.rect(130, y, 66, 15, 'D');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("NET À PAYER", 135, y + 6);
        doc.setFontSize(12);
        doc.text(`${data.netMensuel.toFixed(3)} DT`, 135, y + 12);
    }

        y = doc.lastAutoTable.finalY + 15;

        if (data.bracketDetails && data.bracketDetails.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("3. VENTILATION PAR TRANCHE", 14, y);
            y += 5;

            const bracketRows = data.bracketDetails.map(b => [b.label, b.rate, `${parseFloat(b.base).toFixed(3)} DT`, `${parseFloat(b.tax).toFixed(3)} DT`]);

            doc.autoTable({
                startY: y,
                head: [['Tranche', 'Taux', 'Base', 'Montant']],
                body: bracketRows,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129] }
            });
        }
    }

    /**
     * Rendu spécifique pour l'IS
     */
    _renderISDetails(doc, data, startY) {
        let y = startY;
        const opt = data.optimized || data;
        const inputs = data.inputs || {};

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("1. INFORMATIONS SOCIÉTÉ", 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const details = [
            `• Date : ${new Date().toLocaleString('fr-TN')}`,
            `• Secteur d'activité : ${inputs.sectorName || inputs.sectorId || 'Non défini'}`,
            `• Chiffre d'Affaires TTC : ${parseFloat(inputs.caTtc || 0).toLocaleString()} DT`
        ];

        details.forEach(line => {
            doc.text(line, 20, y);
            y += 6;
        });

        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("2. DÉTAIL DU CALCUL FISCAL", 14, y);
        y += 10;

        const tableData = [
            ["Résultat Comptable", `${parseFloat(inputs.resComptable || 0).toFixed(3)} DT`],
            ["Réintégrations / Déductions (Net)", `${(parseFloat(inputs.reintegrations || 0) - parseFloat(inputs.deductions || 0)).toFixed(3)} DT`],
            ["Bénéfice Fiscal Avant Avantages", `${parseFloat(opt.baseGlobal || 0).toFixed(3)} DT`],
            ["Déduction Réinvestissement", `-${parseFloat(opt.reinvestmentDeducted || 0).toFixed(3)} DT`],
            ["Bénéfice Fiscal Net", `${parseFloat(opt.baseNet || 0).toFixed(3)} DT`],
            ["Taux IS Appliqué", `${(parseFloat(opt.appliedRate || 0) * 100).toFixed(0)}%`],
            ["IS Théorique", `${parseFloat(opt.isBeforeMin || 0).toFixed(3)} DT`],
            ["Minimum d'Impôt (CA)", `${parseFloat(opt.minTaxCA || 0).toFixed(3)} DT`],
            ["IS Dû Retenu", `${parseFloat(opt.is || 0).toFixed(3)} DT`],
            ["CSS Sociétale", `${parseFloat(opt.css || 0).toFixed(3)} DT`],
            ["TOTAL À PAYER (IS + CSS)", `${parseFloat(opt.total || 0).toFixed(3)} DT`]
        ];

        doc.autoTable({
            startY: y,
            head: [['Rubrique', 'Montant / Info']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });
    }

    /**
     * Rendu spécifique pour la TVA
     */
    _renderTVADetails(doc, data, startY) {
        let y = startY;
        const d = data.data || data;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("1. RÉSUMÉ DE LA DÉCLARATION", 14, y);
        y += 10;

        const tableData = [
            ["Chiffre d'Affaires HT", `${parseFloat(d.baseHT || 0).toFixed(3)} DT`],
            ["TVA Collectée (Facturée)", `${parseFloat(d.tvaCollectee || 0).toFixed(3)} DT`],
            ["Montant TTC des Ventes", `${parseFloat(d.montantTTC || 0).toFixed(3)} DT`],
            ["TVA Déductible (Récupérable)", `-${parseFloat(d.totalDeductible || 0).toFixed(3)} DT`],
            ["SOLDE DE TVA", `${parseFloat(d.solde || 0).toFixed(3)} DT`]
        ];

        doc.autoTable({
            startY: y,
            head: [['Poste', 'Montant']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });

        y = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const status = d.solde > 0 ? "👉 RÉSULTAT : TVA À REVERSER À L'ÉTAT" : "👉 RÉSULTAT : CRÉDIT DE TVA À REPORTER";
        doc.text(status, 14, y);
    }

    /**
     * Rendu spécifique pour la Retenue à la Source (RS)
     */
    _renderRSDetails(doc, data, startY) {
        let y = startY;
        const d = data.data || data;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("1. RÉCAPITULATIF DE LA TRANSACTION", 14, y);
        y += 10;

        const tableData = [
            ["Montant Brut (HT)", `${parseFloat(d.brutHT || 0).toFixed(3)} DT`],
            ["TVA de la transaction", `${parseFloat(d.tvaAmount || 0).toFixed(3)} DT`],
            ["Montant Total TTC", `${parseFloat(d.brutTTC || 0).toFixed(3)} DT`],
            ["Retenue à la Source", `-${parseFloat(d.rsAmount || 0).toFixed(3)} DT`],
            ["NET À PAYER AU FOURNISSEUR", `${parseFloat(d.netAPayer || 0).toFixed(3)} DT`]
        ];

        doc.autoTable({
            startY: y,
            head: [['Désignation', 'Montant']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }
        });
    }

    _addFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Ce document est généré à titre indicatif et ne remplace pas une consultation officielle.', 105, 285, null, null, "center");
            doc.text(`Page ${i} / ${pageCount}`, 195, 285, null, null, "right");
        }
    }

    /**
     * Génère un fichier Excel (.xlsx)
     */
    generateExcel(data, type) {
        if (!window.XLSX) {
            console.error("SheetJS not loaded");
            return;
        }

        let rows = [];
        const timestamp = new Date().toLocaleString();

        const formatDT = (val) => typeof val === 'number' ? val.toFixed(3) : val;

        if (type === 'IRPP') {
            const now = new Date();
            rows = [
                ["SOCIETE SIMULATION FISCALE", "", "", "", "", "", "Année :", now.getFullYear()],
                ["1002 TUNIS, TUNISIE", "", "", "", "", "", "Mois de paie :", now.getMonth() + 1],
                ["Affiliation CNSS: 00000000-00", "", "", "", "", "", "Date de paiement :", now.toLocaleDateString()],
                [],
                ["Matricule :", "001", "Emploi :", "Collaborateur", "Nom & Prénom :", "NOM & PRÉNOM"],
                ["CIN :", "00000000", "Catégorie :", "A", ""],
                ["N° CNSS :", "00000000-00", "Echelon :", "1", "Adresse :", "Tunis, Tunisie"],
                ["Situation familiale :", data.inputs?.chefFamille ? "Chef de famille" : "Célibataire", "Salaire de base :", formatDT(data.grossIncome)],
                ["Enfants à charge :", data.inputs?.nbEnfants || 0, "Taux horaire :", ""],
                [],
                ["Désignation", "Nombre", "Base", "Part Salariale", "", "", "Part Patronale"],
                ["", "", "", "Taux %", "Gain", "Retenue", "Taux %", "Gain", "Retenue"],
                ["Salaire de base", "1", formatDT(data.grossIncome), "", formatDT(data.grossIncome), "", "", "", ""],
                ["TOTAL BRUT", "", "", "", formatDT(data.grossIncome), "", "", "", ""],
                [],
                ["Retenue CNSS (9.18%)", "", formatDT(data.grossIncome), "9.18", "", formatDT(data.cnss), "16.57", "", formatDT(data.grossIncome * 0.1657)],
                ["Accident du travail", "", formatDT(data.grossIncome), "", "", "", "0.50", "", formatDT(data.grossIncome * 0.005)],
                ["TOTAL COTISATIONS", "", "", "", "", formatDT(data.cnss), "", "", formatDT(data.grossIncome * 0.1707)],
                [],
                ["Salaire Brut Imposable", "", "", "", formatDT(data.assietteSoumise), "", "", "", ""],
                ["IRPP", "", "", "", "", formatDT(data.irppNet), "", "", ""],
                ["CSS (0.5%)", "", "", "", "", formatDT(data.css), "", "", ""],
                [],
                ["Salaire Net", "", "", "", formatDT(data.netMensuel), "", "", "", ""],
                ["NET À PAYER", "", "", "", formatDT(data.netMensuel), "", "", "", ""],
                [],
                ["NET À PAYER EN DINARS", "", "", "", formatDT(data.netMensuel), "DT"]
            ];
        } else if (type === 'IS') {
            const opt = data.optimized || data;
            const inputs = data.inputs || {};
            rows = [
                ["", "SIMULATION FISCALE - IS 2026"],
                ["", `Généré le : ${timestamp}`],
                [],
                ["PARAMÈTRES"],
                ["Secteur", inputs.sectorName || inputs.sectorId || "Non défini"],
                ["Chiffre d'Affaires (TTC)", formatDT(inputs.caTtc)],
                ["Résultat Comptable", formatDT(inputs.resComptable)],
                [],
                ["RÉSULTATS FISCAUX (DT)"],
                ["Bénéfice Fiscal (Base Globale)", formatDT(opt.baseGlobal)],
                ["Déduction Réinvestissement", formatDT(opt.reinvestmentDeducted)],
                ["Base Nette Imposable", formatDT(opt.baseNet)],
                ["Taux IS Appliqué", (opt.appliedRate * 100).toFixed(0) + "%"],
                [],
                ["IMPÔTS DUS (DT)"],
                ["IS Théorique", formatDT(opt.isBeforeMin)],
                ["Minimum d'Impôt", formatDT(opt.minTaxCA)],
                ["IS Final Retenu", formatDT(opt.is)],
                ["CSS Sociétale", formatDT(opt.css)],
                ["Total à Payer", formatDT(opt.total)]
            ];
        } else if (type === 'TVA') {
            const d = data.data || data;
            rows = [
                ["", "SIMULATION FISCALE - TVA"],
                ["", `Généré le : ${timestamp}`],
                [],
                ["TVA COLLECTÉE (VENTES)"],
                ["Chiffre d'Affaires HT", formatDT(d.baseHT)],
                ["TVA Facturée", formatDT(d.tvaCollectee)],
                ["Total TTC", formatDT(d.montantTTC)],
                [],
                ["TVA DÉDUCTIBLE (ACHATS)"],
                ["TVA Récupérable Totale", formatDT(d.totalDeductible)],
                [],
                ["SOLDE FISCAL"],
                ["Solde de TVA", formatDT(d.solde)],
                ["Statut", d.solde > 0 ? "À REVERSER" : "CRÉDIT DE TVA"]
            ];
        } else if (type === 'RS') {
            const d = data.data || data;
            rows = [
                ["", "SIMULATION FISCALE - RETENUE À LA SOURCE"],
                ["", `Généré le : ${timestamp}`],
                [],
                ["DÉTAILS DE LA TRANSACTION"],
                ["Montant HT", formatDT(d.brutHT)],
                ["Montant TVA", formatDT(d.tvaAmount)],
                ["Montant TTC", formatDT(d.brutTTC)],
                [],
                ["RETENUES À LA SOURCE (DT)"],
                ["Montant RS", formatDT(d.rsAmount)],
                ["NET À PAYER AU FOURNISSEUR", formatDT(d.netAPayer)]
            ];
        }

        // Add Academic Footer to all
        rows.push([], ["Note : Ce document est généré par le Simulateur Fiscal Intelligent (PFE 2026 - ISAAS)"]);


        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Simulation");
        const validName = `Fiscal_Export_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, validName);
    }
}

// Instance globale
window.FiscalExport = new ExportService();
