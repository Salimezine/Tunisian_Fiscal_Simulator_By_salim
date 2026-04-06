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
            <div class="avantages-hero glass-effect" style="
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(34, 197, 94, 0.08));
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                gap: 20px;
            ">
                <div style="font-size: 3.5rem;">🎁</div>
                <div>
                    <h3 style="margin: 0; color: #fff; font-size: 1.5rem;" data-i18n="avantages_hero_title">${t('avantages_hero_title') || 'Guide des Incitations Fiscales'}</h3>
                    <p style="margin: 5px 0 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">
                        <span data-i18n="avantages_hero_desc">${t('avantages_hero_desc') || 'Tous les régimes fiscaux avantageux (LF 2026)'}</span><br>
                        <span style="font-size: 0.85em; opacity: 0.8; color: #818cf8;">
                            📚 ${AVANTAGES_CATALOG.length} régimes documentés
                        </span>
                    </p>
                </div>
            </div>

            <!-- Master-Detail Dashboard -->
            <section id="avantages-dashboard">
                <div class="avantages-grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 25px; align-items: start;">
                    
                    <!-- Sidebar (Master) -->
                    <div class="avantages-sidebar" style="display: flex; flex-direction: column; gap: 15px;">
                        
                        <!-- Filters -->
                        <div class="glass-card" style="padding: 15px; border-inline-start: 4px solid #6366f1;">
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 15px;">🔍 <span data-i18n="adv_filters">${t('adv_filters') || 'FILTRES'}</span></div>
                            <div class="avantages-filters" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                <button class="avantage-filter-btn active" data-filter="all" onclick="filterAvantages('all')">
                                    <span data-i18n="filter_all">${t('filter_all') || 'Tous'}</span>
                                </button>
                                <button class="avantage-filter-btn" data-filter="Exonération" onclick="filterAvantages('Exonération')">
                                    <span data-i18n="filter_exemption">${t('filter_exemption') || 'Exonérations'}</span>
                                </button>
                                <button class="avantage-filter-btn" data-filter="Réduction" onclick="filterAvantages('Réduction')">
                                    <span data-i18n="filter_reduction">${t('filter_reduction') || 'Réductions'}</span>
                                </button>
                                <button class="avantage-filter-btn" data-filter="Déduction" onclick="filterAvantages('Déduction')">
                                    <span data-i18n="filter_deduction">${t('filter_deduction') || 'Déductions'}</span>
                                </button>
                                <button class="avantage-filter-btn" data-filter="Crédit" onclick="filterAvantages('Crédit')">
                                    <span data-i18n="filter_credit">${t('filter_credit') || 'Crédits'}</span>
                                </button>
                            </div>
                        </div>

                        <!-- List of Advantages -->
                        <div class="glass-card" style="padding: 15px;">
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; justify-content: space-between;">
                                <span>📜 <span data-i18n="adv_list_title">${t('adv_list_title') || 'INCITATIONS'}</span></span>
                                <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">${AVANTAGES_CATALOG.length}</span>
                            </div>
                            <div id="avantages-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 550px; overflow-y: auto; padding-right: 5px;">
                                ${AVANTAGES_CATALOG.map((adv, i) => renderAvantageListItem(adv, i)).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Main Report (Detail) -->
                    <div class="avantages-main-report">
                        <div class="glass-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); min-height: 550px; display: flex; flex-direction: column;">
                            <div style="background: rgba(255,255,255,0.03); padding: 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="color: #22c55e;">●</span> <strong style="font-size: 0.9rem;" data-i18n="adv_details_title">${t('adv_details_title') || 'DÉTAILS DU RÉGIME SÉLECTIONNÉ'}</strong>
                                </div>
                            </div>
                            <div id="avantage-details-content" style="padding: 30px; flex: 1;">
                                <!-- Placeholder -->
                                <div style="text-align: center; color: #64748b; margin-top: 100px; animation: fadeIn 0.5s ease;">
                                    <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;">👈</div>
                                    <p style="font-size: 1.1rem; max-width: 300px; margin: 0 auto; line-height: 1.5;" data-i18n="adv_select_prompt">${t('adv_select_prompt') || 'Veuillez sélectionner une incitation dans la liste de gauche pour afficher ses détails.'}</p>
                                </div>
                            </div>
                        </div>

                         <!-- Legal Disclaimer -->
                        <div style="
                            margin-top: 15px;
                            padding: 15px;
                            background: rgba(245, 158, 11, 0.05);
                            border: 1px solid rgba(245, 158, 11, 0.2);
                            border-radius: 10px;
                            font-size: 0.8rem;
                            color: #94a3b8;
                            line-height: 1.5;
                        ">
                            <strong style="color: #f59e0b;">⚠️ <span data-i18n="avantages_legal_title">${t('avantages_legal_title') || 'Important'}</span></strong><br>
                            <span data-i18n="avantages_legal_text">${t('avantages_legal_text') || "Ces informations sont à titre indicatif et pédagogique."}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <style>
            /* Layout & General Styles */
            @media (max-width: 900px) {
                .avantages-grid-layout {
                    grid-template-columns: 1fr !important;
                }
            }

            /* Custom Scrollbar for sidebar list */
            #avantages-list::-webkit-scrollbar { width: 4px; }
            #avantages-list::-webkit-scrollbar-track { background: transparent; }
            #avantages-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

            /* Filter Buttons */
            .avantage-filter-btn {
                padding: 6px 12px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.03);
                color: #94a3b8;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
            }
            .avantage-filter-btn:hover { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc; }
            .avantage-filter-btn.active { background: rgba(99, 102, 241, 0.15); border-color: #6366f1; color: #a5b4fc; font-weight: 600; }

            /* List Items (Sidebar) */
            .avantage-list-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .avantage-list-item:hover {
                background: rgba(255, 255, 255, 0.05);
                transform: translateX(4px);
            }
            .dir-rtl .avantage-list-item:hover {
                transform: translateX(-4px);
            }
            .avantage-list-item.active {
                background: rgba(99, 102, 241, 0.1);
                border-color: rgba(99, 102, 241, 0.3);
            }
            
            .adv-list-icon {
                width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;
            }
            .adv-list-content { flex: 1; min-width: 0; }
            .adv-list-title { color: #cbd5e1; font-weight: 600; font-size: 0.85rem; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .adv-list-type { font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; display: inline-block; font-weight: 600; text-transform: uppercase; }

            /* Details View */
            .adv-detail-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
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
    `;

    // Global Selection Function
    window.selectAdvantage = function(id) {
        // Highlight active item within the list
        document.querySelectorAll('.avantage-list-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.getElementById(`adv-list-item-${id}`);
        if(activeItem) {
            activeItem.classList.add('active');
        }

        // Render Details in Main Report Area
        const adv = AVANTAGES_CATALOG.find(a => a.id === id);
        if(adv) {
            const container = document.getElementById('avantage-details-content');
            container.innerHTML = renderAvantageDetails(adv);
            container.style.animation = 'none';
            container.offsetHeight; /* trigger reflow */
            container.style.animation = 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Scroll to details on small screens
            if(window.innerWidth <= 900) {
                container.closest('.avantages-main-report').scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Global Filter Function
    window.filterAvantages = function(filter) {
        // Buttons
        document.querySelectorAll('.avantage-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });

        // List Items
        let firstVisible = null;
        document.querySelectorAll('.avantage-list-item').forEach(item => {
            const type = item.getAttribute('data-type');
            if (filter === 'all' || type.includes(filter)) {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.3s ease-out';
                if(!firstVisible) firstVisible = item.id.replace('adv-list-item-', '');
            } else {
                item.style.display = 'none';
            }
        });

        // Auto-select first visible if current is hidden
        const activeItem = document.querySelector('.avantage-list-item.active');
        if ((!activeItem || activeItem.style.display === 'none') && firstVisible) {
            window.selectAdvantage(firstVisible);
        }
    };
    
    // Automatically select the first advantage to populate the dashboard on load
    if (AVANTAGES_CATALOG.length > 0) {
        // Small delay to ensure render is complete
        setTimeout(() => { window.selectAdvantage(AVANTAGES_CATALOG[0].id); }, 100);
    }
}

function renderAvantageListItem(adv, index) {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || '';
    };

    const title = t(adv.title_key) || adv.title_fallback;

    return `
        <div class="avantage-list-item animate-slide-up" id="adv-list-item-${adv.id}" data-type="${adv.type}" onclick="selectAdvantage('${adv.id}')" style="border-inline-start: 3px solid ${adv.color}; animation-delay: ${0.05 * (index + 1)}s;">
            <div class="adv-list-icon" style="background: ${adv.color}15; color: ${adv.color}; border: 1px solid ${adv.color}30;">
                ${adv.icon}
            </div>
            <div class="adv-list-content">
                <div class="adv-list-title" title="${title}">${title}</div>
                <div class="adv-list-type" style="background: ${adv.color}20; color: ${adv.color};">${adv.type}</div>
            </div>
        </div>
    `;
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
            <h4>✅ Conditions d'éligibilité</h4>
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
                    <div class="adv-fiscal-label">Minimum d'Impôt (IMF)</div>
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
