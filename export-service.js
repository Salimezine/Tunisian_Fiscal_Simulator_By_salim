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
     * @param {String} type - Le type de simulation ('IRPP', 'IS'...)
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

        // Informations Générales
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("1. SITUATION DU CONTRIBUABLE", 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const inputs = data.inputs || {};

        const details = [
            `• Date de la simulation : ${new Date().toLocaleString('fr-TN')}`,
            `• Revenu Brut Annuel : ${data.grossIncome.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}`,
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

        // Tableau des chiffres clés
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
            headStyles: { fillColor: [59, 130, 246] }, // Blue header
            styles: { fontSize: 10, cellPadding: 3 },
            alternateRowStyles: { fillColor: [240, 249, 255] }
        });

        y = doc.lastAutoTable.finalY + 15;

        // Tableau des tranches si disponible
        if (data.bracketDetails && data.bracketDetails.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("3. VENTILATION PAR TRANCHE", 14, y);
            y += 5;

            const bracketRows = data.bracketDetails.map(b => [b.label, b.rate, `${b.base.toFixed(3)} DT`, `${b.tax.toFixed(3)} DT`]);

            doc.autoTable({
                startY: y,
                head: [['Tranche', 'Taux', 'Base', 'Montant']],
                body: bracketRows,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129] } // Green header
            });
        }
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

        // Préparation des données aplaties
        let rows = [];

        if (type === 'IRPP') {
            rows = [
                ["SIMULATION FALCALE - IRPP 2026"],
                ["Date", new Date().toLocaleString()],
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

            // Ajout des tranches
            if (data.bracketDetails) {
                rows.push([], ["DÉTAIL TRANCHES"]);
                rows.push(["Tranche", "Taux", "Base", "Impôt"]);
                data.bracketDetails.forEach(b => {
                    rows.push([b.label, b.rate, b.base, b.tax]);
                });
            }
        }

        // Création du Workbook
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Simulation");

        // Sauvegarde
        const validName = `Fiscal_Export_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, validName);
    }
}

// Instance globale
window.FiscalExport = new ExportService();
