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
        <div class="avantages-wrapper">
            <!-- Hero Section -->
            <div class="avantages-hero glass-effect animate-slide-up" style="
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
                    <h3 style="margin: 0; color: #fff; font-size: 1.5rem;" data-i18n="avantages_hero_title">Guide des Incitations Fiscales</h3>
                    <p style="margin: 5px 0 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">
                        <span data-i18n="avantages_hero_desc">Tous les régimes fiscaux avantageux prévus par la Loi de Finances 2026</span><br>
                        <span style="font-size: 0.85em; opacity: 0.8; color: #818cf8;">
                            📚 ${AVANTAGES_CATALOG.length} régimes documentés — Cliquez pour en savoir plus
                        </span>
                    </p>
                </div>
            </div>

            <!-- Filter Bar -->
            <div class="avantages-filters animate-slide-up" style="
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-bottom: 20px;
                animation-delay: 0.05s;
            ">
                <button class="avantage-filter-btn active" data-filter="all" onclick="filterAvantages('all')">
                    🔍 <span data-i18n="filter_all">Tous</span>
                </button>
                <button class="avantage-filter-btn" data-filter="Exonération" onclick="filterAvantages('Exonération')">
                    🛡️ <span data-i18n="filter_exemption">Exonérations</span>
                </button>
                <button class="avantage-filter-btn" data-filter="Réduction" onclick="filterAvantages('Réduction')">
                    📉 <span data-i18n="filter_reduction">Réductions</span>
                </button>
                <button class="avantage-filter-btn" data-filter="Déduction" onclick="filterAvantages('Déduction')">
                    🌱 <span data-i18n="filter_deduction">Déductions</span>
                </button>
                <button class="avantage-filter-btn" data-filter="Crédit" onclick="filterAvantages('Crédit')">
                    💳 <span data-i18n="filter_credit">Crédits</span>
                </button>
            </div>

            <!-- Cards Grid -->
            <div class="avantages-grid" id="avantages-grid">
                ${AVANTAGES_CATALOG.map((adv, i) => renderAdvantageCard(adv, i)).join('')}
            </div>

            <!-- Legal Disclaimer -->
            <div style="
                margin-top: 25px;
                padding: 15px;
                background: rgba(245, 158, 11, 0.05);
                border: 1px solid rgba(245, 158, 11, 0.2);
                border-radius: 10px;
                font-size: 0.85rem;
                color: #94a3b8;
                line-height: 1.6;
            ">
                <strong style="color: #f59e0b;">⚠️ <span data-i18n="avantages_legal_title">Important</span></strong><br>
                <span data-i18n="avantages_legal_text">Ces informations sont à titre indicatif et pédagogique. 
                Les conditions d'éligibilité et les taux peuvent évoluer. 
                Consultez un expert-comptable ou la DGI pour une application conforme à votre situation.</span>
            </div>
        </div>

        <style>
            .avantages-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                gap: 16px;
            }

            .avantage-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }

            .avantage-card:hover {
                transform: translateY(-3px);
                border-color: rgba(255, 255, 255, 0.15);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }

            .avantage-card.expanded {
                grid-column: 1 / -1;
            }

            .avantage-card-header {
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .avantage-icon-box {
                width: 52px;
                height: 52px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.6rem;
                flex-shrink: 0;
            }

            .avantage-card-header-info {
                flex: 1;
                min-width: 0;
            }

            .avantage-card-header-info h4 {
                margin: 0;
                color: #fff;
                font-size: 1rem;
                font-weight: 700;
                line-height: 1.3;
            }

            .avantage-type-badge {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
            }

            .avantage-card-summary {
                padding: 0 20px 15px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .avantage-summary-item {
                font-size: 0.8rem;
                color: #94a3b8;
                display: flex;
                align-items: baseline;
                gap: 6px;
            }

            .avantage-summary-item strong {
                color: #cbd5e1;
                font-weight: 600;
            }

            .avantage-card-details {
                display: none;
                padding: 0 20px 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .avantage-card.expanded .avantage-card-details {
                display: block;
            }

            .avantage-detail-section {
                margin-top: 15px;
            }

            .avantage-detail-section h5 {
                color: #818cf8;
                font-size: 0.85rem;
                margin: 0 0 8px;
                font-weight: 700;
            }

            .avantage-detail-section p,
            .avantage-detail-section li {
                font-size: 0.85rem;
                color: #94a3b8;
                line-height: 1.6;
            }

            .avantage-detail-section ul {
                padding-left: 18px;
                margin: 0;
            }

            .avantage-detail-section li {
                margin-bottom: 4px;
            }

            .avantage-legal-ref {
                font-size: 0.75rem;
                color: #818cf8;
                font-style: italic;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed rgba(129, 140, 248, 0.2);
            }

            .avantage-expand-hint {
                text-align: center;
                padding: 8px;
                font-size: 0.75rem;
                color: #64748b;
                transition: color 0.2s;
            }

            .avantage-card:hover .avantage-expand-hint {
                color: #818cf8;
            }

            .avantage-filter-btn {
                padding: 6px 14px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.03);
                color: #94a3b8;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
            }

            .avantage-filter-btn:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: rgba(99, 102, 241, 0.3);
                color: #a5b4fc;
            }

            .avantage-filter-btn.active {
                background: rgba(99, 102, 241, 0.15);
                border-color: #6366f1;
                color: #a5b4fc;
                font-weight: 600;
            }

            @media (max-width: 700px) {
                .avantages-grid {
                    grid-template-columns: 1fr;
                }
                .avantage-card-summary {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    // Global function for card toggle
    window.toggleAdvantageCard = function(id) {
        const card = document.getElementById(`adv-card-${id}`);
        if (!card) return;

        const wasExpanded = card.classList.contains('expanded');

        // Close all cards first
        document.querySelectorAll('.avantage-card.expanded').forEach(c => {
            c.classList.remove('expanded');
            const hint = c.querySelector('.avantage-expand-hint');
            if (hint) hint.textContent = '▼ Voir détails';
        });

        // Toggle clicked card
        if (!wasExpanded) {
            card.classList.add('expanded');
            const hint = card.querySelector('.avantage-expand-hint');
            if (hint) hint.textContent = '▲ Réduire';
            // Smooth scroll to card
            setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    };

    // Global filter function
    window.filterAvantages = function(filter) {
        // Update button states
        document.querySelectorAll('.avantage-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });

        // Filter cards
        document.querySelectorAll('.avantage-card').forEach(card => {
            const type = card.getAttribute('data-type');
            if (filter === 'all' || type.includes(filter)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    };
}

function renderAdvantageCard(adv, index) {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || '';
    };

    const title = t(adv.title_key) || adv.title_fallback;

    return `
        <div class="avantage-card animate-slide-up" 
             id="adv-card-${adv.id}" 
             data-type="${adv.type}"
             style="animation-delay: ${0.05 * (index + 1)}s; border-left: 3px solid ${adv.color};"
             onclick="toggleAdvantageCard('${adv.id}')">
            
            <div class="avantage-card-header">
                <div class="avantage-icon-box" style="background: ${adv.color}15; border: 1px solid ${adv.color}30;">
                    ${adv.icon}
                </div>
                <div class="avantage-card-header-info">
                    <h4>${title}</h4>
                    <span class="avantage-type-badge" style="background: ${adv.color}20; color: ${adv.color};">${adv.type}</span>
                </div>
            </div>

            <div class="avantage-card-summary">
                <div class="avantage-summary-item">
                    ⏱️ <strong>${adv.duration}</strong>
                </div>
                <div class="avantage-summary-item">
                    📊 <strong>${adv.rate_benefit}</strong>
                </div>
            </div>

            <div class="avantage-card-details">
                <div class="avantage-detail-section">
                    <h5>📋 Description</h5>
                    <p>${adv.details}</p>
                </div>

                <div class="avantage-detail-section">
                    <h5>✅ Conditions d'éligibilité</h5>
                    <ul>
                        ${adv.eligibility.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>

                <div class="avantage-detail-section">
                    <h5>📊 Détails Fiscaux</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem;">
                        <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                            <div style="color: #64748b; font-size: 0.75rem;">Minimum d'Impôt</div>
                            <div style="color: #cbd5e1; font-weight: 600; margin-top: 2px;">${adv.min_tax}</div>
                        </div>
                        <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                            <div style="color: #64748b; font-size: 0.75rem;">CSS</div>
                            <div style="color: #cbd5e1; font-weight: 600; margin-top: 2px;">${adv.css}</div>
                        </div>
                    </div>
                </div>

                <div class="avantage-legal-ref">
                    📖 Référence : ${adv.legal}
                </div>
            </div>

            <div class="avantage-expand-hint">▼ Voir détails</div>
        </div>
    `;
}

// Global Exports
window.AvantagesLogic = { AVANTAGES_CATALOG };
