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

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("1. SITUATION DU CONTRIBUABLE", 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const inputs = data.inputs || {};

        const details = [
            `• Date de la simulation : ${new Date().toLocaleString('fr-TN')}`,
            `• Revenu Brut Annuel : ${data.grossIncome.toLocaleString('fr-TN')} DT`,
            `• Situation : ${inputs.typeRevenu || 'Non défini'}, ${inputs.nbEnfants || 0} enfant(s)`,
            `• Chef de famille : ${inputs.chefFamille ? 'Oui' : 'Non'}`
        ];

        details.forEach(line => {
            doc.text(line, 20, y);
            y += 6;
        });

        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("2. DÉTAIL DU CALCUL (LF 2026)", 14, y);
        y += 10;

        const tableData = [
            ["Salaire Brut Annuel", `${data.grossIncome.toFixed(3)} DT`],
            ["Cotisations Sociales (CNSS)", `-${data.cnss.toFixed(3)} DT`],
            ["Frais Professionnels (10%, Max 2000)", `-${data.abattement.toFixed(3)} DT`],
            ["Déductions Familiales", `-${data.totalDeductions.toFixed(3)} DT`],
            ["Assiette Imposable", `${data.assietteSoumise.toFixed(3)} DT`],
            ["IRPP Dû (Barème)", `${data.irpp.toFixed(3)} DT`],
            ["CSS (0.5%)", `${data.css.toFixed(3)} DT`],
            ["TOTAL IMPÔT", `${data.totalRetenue.toFixed(3)} DT`],
            ["SALAIRE NET ANNUEL", `${(data.netMensuel * 12).toFixed(3)} DT`],
            ["SALAIRE NET MENSUEL", `${data.netMensuel.toFixed(3)} DT`]
        ];

        doc.autoTable({
            startY: y,
            head: [['Rubrique', 'Montant']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10, cellPadding: 3 },
            alternateRowStyles: { fillColor: [240, 249, 255] }
        });

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
            `• Secteur d'activité : ${inputs.sectorId || 'Non défini'}`,
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

        if (type === 'IRPP') {
            rows = [
                [`SIMULATION FISCALE - IRPP 2026`],
                ["Date", timestamp],
                [],
                ["PARAMÈTRES"],
                ["Brut Annuel", data.grossIncome],
                ["Situation", data.inputs.typeRevenu],
                ["Enfants", data.inputs.nbEnfants],
                [],
                ["RÉSULTATS"],
                ["CNSS", data.cnss],
                ["Frais Pro", data.abattement],
                ["Assiette", data.assietteSoumise],
                ["IRPP", data.irpp],
                ["CSS", data.css],
                ["Total Retenues", data.totalRetenue],
                ["Net Annuel", data.netMensuel * 12],
                ["Net Mensuel", data.netMensuel]
            ];
            if (data.bracketDetails) {
                rows.push([], ["DÉTAIL TRANCHES"], ["Tranche", "Taux", "Base", "Impôt"]);
                data.bracketDetails.forEach(b => rows.push([b.label, b.rate, b.base, b.tax]));
            }
        } else if (type === 'IS') {
            const opt = data.optimized || data;
            const inputs = data.inputs || {};
            rows = [
                [`SIMULATION FISCALE - IS 2026`],
                ["Date", timestamp],
                [],
                ["DONNÉES"],
                ["Secteur", inputs.sectorId],
                ["CA TTC", inputs.caTtc],
                ["Résultat Comptable", inputs.resComptable],
                [],
                ["RÉSULTATS FISCAUX"],
                ["Base Globale", opt.baseGlobal],
                ["Réinvestissement", opt.reinvestmentDeducted],
                ["Base Nette", opt.baseNet],
                ["Taux IS", opt.appliedRate],
                ["IS Dû", opt.is],
                ["CSS", opt.css],
                ["Charge Fiscale Totale", opt.total]
            ];
        } else if (type === 'TVA') {
            const d = data.data || data;
            rows = [
                [`SIMULATION FISCALE - TVA`],
                ["Date", timestamp],
                [],
                ["COLLECTÉE"],
                ["Base HT", d.baseHT],
                ["TVA Facturée", d.tvaCollectee],
                ["Total TTC", d.montantTTC],
                [],
                ["DÉDUCTIBLE"],
                ["TVA Récupérable Totale", d.totalDeductible],
                [],
                ["BILAN"],
                ["Solde", d.solde],
                ["Statut", d.solde > 0 ? "À payer" : "Crédit"]
            ];
        } else if (type === 'RS') {
            const d = data.data || data;
            rows = [
                [`SIMULATION FISCALE - RS`],
                ["Date", timestamp],
                [],
                ["TRANSACTION"],
                ["Montant HT", d.brutHT],
                ["Montant TVA", d.tvaAmount],
                ["Montant TTC", d.brutTTC],
                [],
                ["RETENUE"],
                ["Montant RS", d.rsAmount],
                ["NET À PAYER", d.netAPayer]
            ];
        }

        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Simulation");
        const validName = `Fiscal_Export_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, validName);
    }
}

// Instance globale
window.FiscalExport = new ExportService();
