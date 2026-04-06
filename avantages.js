// AVANTAGES FISCAUX - Module Référence des Incitations Fiscales
// Loi de Finances 2026 - Tunisie
// ============================================================

/**
 * Complete catalog of Tunisian fiscal advantages (LF 2026)
 */
const AVANTAGES_CATALOG = [
    {
        id: 'zdr',
        icon: '📍',
        color: '#22c55e',
        title_key: 'adv_zdr',
        title_fallback: 'Zone de Développement Régional (ZDR)',
        type: 'Exonération',
        legal: 'Code des Investissements / LF 2026 / Décret ZDR',
        duration: '5 ou 10 ans (selon Groupe)',
        rate_benefit: 'IS = 0% pendant la période, puis 10%',
        min_tax: 'Dispensé du minimum d\'impôt',
        css: 'CSS = 0% pendant exonération, 0.1% après',
        eligibility: [
            'Implantation en zone prioritaire (Groupe 1 ou 2)',
            'Activité industrielle, agricole ou de services',
            'Hors secteurs financiers et télécoms'
        ],
        details: `Les Zones de Développement Régional offrent l'avantage fiscal le plus complet en Tunisie. 
        Le Groupe 1 (5 ans) couvre les zones semi-prioritaires, le Groupe 2 (10 ans) les zones hautement prioritaires. 
        Après la période d'exonération, le taux réduit de 10% s'applique indéfiniment.`
    },
    {
        id: 'startup',
        icon: '🚀',
        color: '#6366f1',
        title_key: 'adv_startup',
        title_fallback: 'Label Startup Act',
        type: 'Exonération',
        legal: 'Loi 2018-20 (Startup Act)',
        duration: '8 ans',
        rate_benefit: 'IS = 0% pendant 8 ans',
        min_tax: 'Dispensé du minimum d\'impôt',
        css: 'Exonéré de CSS pendant la période',
        eligibility: [
            'Label délivré par le Startup Act Committee',
            'Entreprise innovante (< 8 ans d\'existence)',
            'CA < 100 000 DT / an',
            'Hors secteurs réglementés (banques, assurances)'
        ],
        details: `Le Startup Act est l'incitation fiscale la plus performante en Tunisie pour les jeunes entreprises innovantes.
        Exonération totale d'IS, de CSS, et du minimum d'impôt pendant 8 ans.
        Les fondateurs bénéficient également d'un congé d'un an de leur emploi actuel et d'une bourse mensuelle.`
    },
    {
        id: 'export',
        icon: '🌍',
        color: '#f59e0b',
        title_key: 'adv_export',
        title_fallback: 'Exportateur Total (ETE)',
        type: 'Exonération + Réduction',
        legal: 'Code IRPP/IS Art. 49 / Note 20/2008',
        duration: '10 ans exonération + réduction permanente',
        rate_benefit: 'IS = 0% (10 ans), puis déduction 50% bénéfice export',
        min_tax: '0.2% du CA TTC',
        css: 'Exonéré pendant les 10 premières années',
        eligibility: [
            'Exportation ≥ 80% du chiffre d\'affaires',
            'Classement Note 20/2008 (Cat. A/B)',
            'Pro-rata export applicable pour les partiels'
        ],
        details: `Les entreprises totalement exportatrices (ETE) bénéficient d'une exonération totale d'IS pendant 10 ans.
        Après cette période, une déduction de 50% du bénéfice provenant de l'export est accordée.
        La Note 20/2008 classe les revenus en Catégorie A (éligible) et B (exclu) pour le calcul de l'exonération.`
    },
    {
        id: 'ipo',
        icon: '📈',
        color: '#ec4899',
        title_key: 'adv_ipo',
        title_fallback: 'Introduction en Bourse (IPO)',
        type: 'Réduction',
        legal: 'Code IRPP/IS / LF 2026',
        duration: '5 ans',
        rate_benefit: 'Taux plafonné à 20% (si taux standard > 20%)',
        min_tax: 'Applicable normalement',
        css: 'Applicable normalement',
        eligibility: [
            'Introduction effective à la Bourse de Tunis (BVMT)',
            'Applicable uniquement si taux standard > 20%',
            'Valable pendant les 5 premières années post-IPO'
        ],
        details: `L'introduction en bourse permet aux sociétés dont le taux d'IS est supérieur à 20% de bénéficier d'un plafonnement à 20% pendant 5 ans.
        Cet avantage est particulièrement intéressant pour les secteurs à 35% (banques, télécoms, hydrocarbures).`
    },
    {
        id: 'reinvest',
        icon: '🌱',
        color: '#10b981',
        title_key: 'adv_reinvest',
        title_fallback: 'Réinvestissement des Bénéfices',
        type: 'Déduction',
        legal: 'Code IRPP/IS Art. 7 / LF 2026',
        duration: 'Permanent',
        rate_benefit: 'Déduction jusqu\'à 35% du bénéfice (100% en ZDR/Agri)',
        min_tax: 'Plancher de 20% de l\'IS dû',
        css: 'Applicable normalement',
        eligibility: [
            'Réinvestissement dans des actifs productifs',
            'Plafond 35% du bénéfice fiscal (standard)',
            'Plafond 100% pour ZDR et agriculture',
            'Non cumulable avec exonération totale'
        ],
        details: `Le réinvestissement des bénéfices permet de déduire de la base imposable les montants réinvestis dans l'entreprise.
        En régime standard, la déduction est plafonnée à 35% du bénéfice fiscal.
        Un plancher de 20% de l'IS normalement dû est imposé pour éviter un IS nul via réinvestissement.`
    },
    {
        id: 'agri',
        icon: '🌾',
        color: '#84cc16',
        title_key: 'adv_agri',
        title_fallback: 'Agriculture & Pêche',
        type: 'Taux Réduit',
        legal: 'Code des Investissements / LF 2026',
        duration: 'Permanent',
        rate_benefit: 'IS = 10% (au lieu de 15-35%)',
        min_tax: '0.1% du CA TTC (plafond 300 DT)',
        css: '3%',
        eligibility: [
            'Activité agricole, pêche ou aquaculture',
            'Transformation de produits agricoles',
            'Élevage et activités connexes'
        ],
        details: `Le secteur agricole bénéficie d'un taux d'IS réduit de 10% de façon permanente.
        Le minimum d'impôt est également réduit à 0.1% du CA TTC avec un plafond à 300 DT.
        C'est le régime sectoriel le plus avantageux en termes de taux effectif.`
    },
    {
        id: 'auto_entrepreneur',
        icon: '👤',
        color: '#8b5cf6',
        title_key: 'adv_auto_entrepreneur',
        title_fallback: 'Régime Auto-Entrepreneur',
        type: 'Contribution Unique',
        legal: 'LF 2026 (Nouveau)',
        duration: 'Permanent (tant que CA < seuil)',
        rate_benefit: 'Contribution unique forfaitaire (pas d\'IS/IRPP)',
        min_tax: 'Remplacé par la contribution unique',
        css: 'Incluse dans la contribution',
        eligibility: [
            'Chiffre d\'affaires < 75 000 DT/an (services)',
            'Chiffre d\'affaires < 150 000 DT/an (commerce)',
            'Personne physique uniquement',
            'Hors professions libérales réglementées'
        ],
        details: `Le régime Auto-Entrepreneur (LF 2026) simplifie la fiscalité pour les micro-entrepreneurs.
        Une contribution unique forfaitaire remplace l'IRPP, la CSS et le minimum d'impôt.
        Ce régime est idéal pour les freelances, petits commerçants et artisans individuels.`
    },
    {
        id: 'credit_impot',
        icon: '💳',
        color: '#06b6d4',
        title_key: 'adv_tax_credit',
        title_fallback: 'Crédit d\'Impôt R&D',
        type: 'Crédit',
        legal: 'LF 2025 / LF 2026',
        duration: 'Annuel (renouvelable)',
        rate_benefit: 'Crédit d\'impôt sur les dépenses de R&D et formation',
        min_tax: 'Applicable normalement',
        css: 'Applicable normalement',
        eligibility: [
            'Dépenses de Recherche & Développement documentées',
            'Dépenses de formation professionnelle',
            'Secteur technologique ou industriel',
            'Sociétés uniquement (pas personnes physiques)'
        ],
        details: `Le crédit d'impôt pour R&D permet de déduire directement de l'IS calculé les dépenses engagées en recherche et développement.
        Contrairement au réinvestissement (déduction de la base), le crédit d'impôt se déduit de l'IS lui-même.
        C'est un mécanisme très avantageux car il offre une réduction DT pour DT.`
    }
];

function initAvantages() {
    const container = document.getElementById('avantages-container');
    if (!container) return;

    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || '';
    };

    container.innerHTML = `
        <div class="avantages-wrapper animate-slide-up">
            <!-- Hero Section -->
            <div class="advisor-hero" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 20px; padding: 30px; margin-bottom: 25px; display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 3.5rem;">🎁</div>
                <div>
                    <h3 style="margin: 0; color: #fff; font-size: 1.6rem;" data-i18n="avantages_hero_title">${t("avantages_hero_title") || "Simulateur d'Incitations Fiscales"}</h3>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.4;">
                        <span data-i18n="avantages_hero_desc">${t("avantages_hero_desc") || "Calculez vos économies d'impôts avec les régimes avantageux (LF 2026)"}</span><br>
                        <span style="font-size: 0.85em; opacity: 0.8; color: #818cf8;">✨ ${AVANTAGES_CATALOG.length} régimes documentés</span>
                    </p>
                </div>
            </div>

            <!-- Paramètres Form (Calculator) -->
            <div class="glass-card" style="padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="color: #6366f1; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 20px;">
                    ⚙️ <span data-i18n="adv_filters">${t("adv_filters") || "Paramètres de Simulation"}</span>
                </div>
                
                <div class="flex-row" style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="form-group" style="flex: 1; min-width: 200px;">
                        <label>Catégorie</label>
                        <select id="adv-filter-type" class="form-control" onchange="filterAvantages(this.value)">
                            <option value="all">Toutes Catégories</option>
                            <option value="Exonération">Exonération (IS=0%)</option>
                            <option value="Réduction">Réduction d'Impôt</option>
                            <option value="Déduction">Déduction Frais</option>
                            <option value="Crédit">Crédit d'Impôt</option>
                            <option value="Contribution Unique">Contribution Unique</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 2; min-width: 250px;">
                        <label>Choix du Régime / Avantage</label>
                        <select id="adv-select-regime" class="form-control" onchange="selectAdvantage(this.value)">
                            ${AVANTAGES_CATALOG.map(a => `<option value="${a.id}">${a.icon} ${t(a.title_key) || a.title_fallback}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="flex-row" style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px;">
                    <div class="form-group" style="flex: 2; min-width: 200px;">
                        <label>Bénéfice estimé (DT)</label>
                        <div class="input-with-icon" style="position: relative;">
                            <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8;">💰</span>
                            <input type="number" id="adv-benefice" class="form-control" placeholder="Ex: 50000" style="padding-left: 40px;" onkeypress="if(event.key === 'Enter') calculerAvantage()" />
                        </div>
                    </div>
                    <div class="form-group" style="flex: 1; min-width: 150px; display: flex; align-items: flex-end;">
                        <button class="btn btn-primary w-100" onclick="calculerAvantage()" style="height: 48px; border-radius: 12px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                            <span style="font-size: 1.2rem; margin-right: 8px;">🧮</span> Calculer mon Gain
                        </button>
                    </div>
                </div>
            </div>

            <!-- Simulation Result Container -->
            <div id="avantage-simulation-result" style="display: none; margin-bottom: 25px;"></div>

            <!-- Report Area -->
            <div class="avantages-main-report">
                <div class="glass-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;">
                    <div style="background: rgba(255,255,255,0.03); padding: 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #22c55e;">●</span> <strong style="font-size: 0.9rem;" data-i18n="adv_details_title">${t("adv_details_title") || "GUIDE THÉORIQUE DU RÉGIME SÉLECTIONNÉ"}</strong>
                        </div>
                    </div>
                    <div id="avantage-details-content" style="padding: 30px; flex: 1;"></div>
                </div>
            </div>
            
            <style>
                .adv-detail-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                @media (max-width: 600px) {
                    .adv-detail-header { flex-direction: column; align-items: center; text-align: center; }
                }
                .adv-detail-icon { font-size: 3rem; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 20px; flex-shrink: 0; }
                .adv-detail-title { margin: 0 0 10px; font-size: 1.4rem; color: #fff; font-weight: 700; }
                .adv-detail-badge { font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; font-weight: 700; display: inline-block; }
                
                .adv-detail-section { margin-bottom: 25px; }
                .adv-detail-section h4 { color: #818cf8; font-size: 0.95rem; margin: 0 0 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                .adv-detail-text { color: #cbd5e1; line-height: 1.7; font-size: 0.95rem; }
                .adv-detail-list { margin: 0; padding-inline-start: 22px; color: #cbd5e1; font-size: 0.95rem; }
                .adv-detail-list li { margin-bottom: 8px; line-height: 1.5; }
                
                .adv-fiscal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
                @media (max-width: 600px) { .adv-fiscal-grid { grid-template-columns: 1fr; } }
                .adv-fiscal-box { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; }
                .adv-fiscal-label { color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
                .adv-fiscal-value { color: #fff; font-size: 1.05rem; font-weight: 600; }
                
                .adv-legal-ref { margin-top: 30px; padding: 15px; background: rgba(99, 102, 241, 0.05); border-inline-start: 3px solid #818cf8; border-radius: 0 8px 8px 0; font-style: italic; color: #a5b4fc; font-size: 0.85rem; }
            </style>
        </div>
    `;

    // Global Filter Function
    window.filterAvantages = function(filter) {
        const selectBox = document.getElementById('adv-select-regime');
        if (!selectBox) return;
        
        selectBox.innerHTML = '';
        
        let foundAny = false;
        AVANTAGES_CATALOG.forEach(adv => {
            if (filter === 'all' || adv.type.includes(filter)) {
                foundAny = true;
                const title = t(adv.title_key) || adv.title_fallback;
                selectBox.innerHTML += \`<option value="\${adv.id}">\${adv.icon} \${title}</option>\`;
            }
        });
        
        if(foundAny) {
            window.selectAdvantage(selectBox.options[0].value);
        } else {
            document.getElementById('avantage-details-content').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    Aucun régime trouvé.
                </div>
            `;
        }
    };

    // Global Selection Function
    window.selectAdvantage = function(id) {
        const adv = AVANTAGES_CATALOG.find(a => a.id === id);
        if(adv) {
            const container = document.getElementById('avantage-details-content');
            container.innerHTML = renderAvantageDetails(adv);
            container.style.animation = 'none';
            container.offsetHeight; /* trigger reflow */
            container.style.animation = 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

            // Hide calculation result when switching regime, until they click Calculate again
            const resBox = document.getElementById('avantage-simulation-result');
            if(resBox) resBox.style.display = 'none';
        }
    };

    // Global Calculate Function
    window.calculerAvantage = function() {
        const id = document.getElementById('adv-select-regime').value;
        const benefStr = document.getElementById('adv-benefice').value;
        const benefice = parseFloat(benefStr);
        
        if (isNaN(benefice) || benefice <= 0) {
            // Simple visual error state if no amount
            const inputEl = document.getElementById('adv-benefice');
            inputEl.style.border = "1px solid #ef4444";
            setTimeout(() => inputEl.style.border = "1px solid rgba(255,255,255,0.1)", 1000);
            return;
        }

        const adv = AVANTAGES_CATALOG.find(a => a.id === id);
        if(!adv) return;
        
        // STANDARD IS RATE
        // En Tunisie, le taux IS par défaut est de 15% pour la plupart des PMEs selon LF 2026.
        const tauxStandard = 0.15; 
        let impotNormal = benefice * tauxStandard;
        let impotAvantage = impotNormal;
        
        // APPLY RULES based on ID
        if (adv.id === 'zdr' || adv.id === 'startup' || adv.id === 'export') {
            impotAvantage = 0; // Exonération totale
        } else if (adv.id === 'agri') {
            impotAvantage = benefice * 0.10; // Taux réduit à 10%
        } else if (adv.id === 'reinvest') {
            const plafondDed = benefice * 0.35; // Déduction max 35%
            const baseImposable = benefice - plafondDed;
            impotAvantage = baseImposable * tauxStandard;
            // Floor is min tax (which is handled later or simplified here as lower)
        } else if (adv.id === 'ipo') {
            // Assume the user wants to IPO because their tax rate is high e.g. 35%. 
            // So we mock the standard rate at 35% and the advantaged at 20%
            impotNormal = benefice * 0.35;
            impotAvantage = benefice * 0.20;
        } else if (adv.id === 'auto_entrepreneur') {
            if (benefice > 75000) {
                alert("Le bénéfice saisi dépasse le plafond de l'Auto-Entrepreneur (75 000 DT) ! Simulation impossible.");
                return;
            }
            impotAvantage = 200; // Contribution unique annuelle forfaitaire min
        } else if (adv.id === 'credit_impot') {
            // Hypothesis: user spends 20% of their profit in RD
            const rdSpend = benefice * 0.20; 
            impotAvantage = impotNormal - rdSpend; 
            if(impotAvantage < 0) impotAvantage = 0;
        }
        
        const economie = impotNormal - impotAvantage;
        const formatDT = (n) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n) + ' DT';
        
        const resultBox = document.getElementById('avantage-simulation-result');
        resultBox.style.display = 'block';
        
        let insightMsg = ``;
        if(adv.id === 'credit_impot') insightMsg = "Hypothèse de base : dépenses en R&D équivalentes à 20% de votre bénéfice.";
        if(adv.id === 'ipo') insightMsg = "Hypothèse : Vous faites partie d'un secteur taxé à 35% (Plafonné à 20%).";

        resultBox.innerHTML = `
            <div class="glass-card animate-slide-up" style="border-inline-start: 5px solid ${adv.color}; background: linear-gradient(90deg, rgba(34,197,94,0.05), rgba(0,0,0,0));">
                <h4 style="color: ${adv.color}; margin-top:0; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
                    📊 Simulation d'économie : ${adv.title_fallback}
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.8rem; color:#94a3b8; text-transform: uppercase;">Impôt Standard (15%)</div>
                        <div style="font-size: 1.4rem; font-weight: bold; color: #ef4444; opacity: 0.8; text-decoration: line-through;">${formatDT(impotNormal)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.8rem; color:#94a3b8; text-transform: uppercase;">Impôt avec Avantage</div>
                        <div style="font-size: 1.4rem; font-weight: bold; color: ${adv.color};">${formatDT(impotAvantage)}</div>
                    </div>
                    <div style="background: rgba(34,197,94,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(34,197,94,0.4);">
                        <div style="font-size: 0.8rem; color:#22c55e; text-transform: uppercase; font-weight: 800;">Économie Nette 🚀</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #22c55e;">+ ${formatDT(economie)}</div>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color:#94a3b8; margin-top:15px; font-style:italic; line-height: 1.4;">
                    * Ce calcul est une <strong>estimation simplifiée</strong> basée sur les taux réglementaires de l'IS (LF 2026). Le minimum d'impôt (IMF) et la CSS peuvent impacter ce montant en situation réelle. <br> ${insightMsg}
                </div>
            </div>
        `;
        
        // Scroll slightly down to focus on result
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    
    // Auto-select first item
    if (AVANTAGES_CATALOG.length > 0) {
        setTimeout(() => { window.selectAdvantage(AVANTAGES_CATALOG[0].id); }, 100);
    }
}

function renderAvantageDetails(adv) {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || '';
    };

    const title = t(adv.title_key) || adv.title_fallback;

    return `
        <div class="adv-detail-header">
            <div class="adv-detail-icon" style="background: ${adv.color}15; border: 2px solid ${adv.color}40; box-shadow: 0 0 20px ${adv.color}20;">
                ${adv.icon}
            </div>
            <div>
                <h3 class="adv-detail-title">${title}</h3>
                <div class="adv-detail-badge" style="background: ${adv.color}20; color: ${adv.color}; border: 1px solid ${adv.color}40;">${adv.type}</div>
            </div>
        </div>

        <div class="adv-detail-section">
            <h4>📋 Description</h4>
            <p class="adv-detail-text">${adv.details.replace(/\n\s+/g, '<br><br>')}</p>
        </div>

        <div class="adv-detail-section">
            <h4>✅ Conditions d\'éligibilité</h4>
            <ul class="adv-detail-list">
                ${adv.eligibility.map(e => `<li>${e}</li>`).join('')}
            </ul>
        </div>

        <div class="adv-detail-section">
            <h4>📊 Détails Fiscaux</h4>
            <div class="adv-fiscal-grid">
                <div class="adv-fiscal-box">
                    <div class="adv-fiscal-label">Taux / Avantage</div>
                    <div class="adv-fiscal-value" style="color: ${adv.color};">${adv.rate_benefit}</div>
                </div>
                <div class="adv-fiscal-box">
                    <div class="adv-fiscal-label">Durée</div>
                    <div class="adv-fiscal-value">⏱️ <span dir="auto">${adv.duration}</span></div>
                </div>
            </div>
        </div>
        
        <div class="adv-detail-section" style="margin-top: 25px;">
            <h4>⚙️ Autres Taxes (Impact)</h4>
            <div class="adv-fiscal-grid">
                <div class="adv-fiscal-box" style="padding: 12px;">
                    <div class="adv-fiscal-label">Minimum d\'Impôt (IMF)</div>
                    <div class="adv-fiscal-value" style="font-size: 0.9rem;">${adv.min_tax}</div>
                </div>
                <div class="adv-fiscal-box" style="padding: 12px;">
                    <div class="adv-fiscal-label">Contributions Sociales (CSS)</div>
                    <div class="adv-fiscal-value" style="font-size: 0.9rem;">${adv.css}</div>
                </div>
            </div>
        </div>

        <div class="adv-legal-ref">
            <strong>📖 Référence légale :</strong> <span dir="auto">${adv.legal}</span>
        </div>
    `;
}

// Global Exports
window.AvantagesLogic = { AVANTAGES_CATALOG };
