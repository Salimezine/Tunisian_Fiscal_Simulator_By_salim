/**
 * MODULE: Calendrier Fiscal Interactif
 * Gère l'affichage des échéances et les notifications locales
 */

const FISCAL_DEADLINES = [
    { date: "2026-01-15", title: "Déclaration Mensuelle (Décembre 2025)", type: "mensuel" },
    { date: "2026-01-28", title: "Acompte Provisionnel n°3 (2025)", type: "acompte" },
    { date: "2026-02-15", title: "Déclaration Mensuelle (Janvier)", type: "mensuel" },
    { date: "2026-02-28", title: "Déclaration Employeur", type: "annuel" },
    { date: "2026-03-15", title: "Déclaration Mensuelle (Février)", type: "mensuel" },
    { date: "2026-03-25", title: "Bilan & Liasses Fiscales (Sociétés)", type: "bilan" },
    { date: "2026-04-15", title: "Déclaration Mensuelle (Mars)", type: "mensuel" },
    { date: "2026-05-15", title: "Déclaration Mensuelle (Avril)", type: "mensuel" },
    { date: "2026-05-25", title: "Déclaration Revenus (Personnes Physiques)", type: "bilan" },
    { date: "2026-06-15", title: "Déclaration Mensuelle (Mai)", type: "mensuel" },
    { date: "2026-06-28", title: "Acompte Provisionnel n°1 (2026)", type: "acompte" },
    { date: "2026-07-15", title: "Déclaration Mensuelle (Juin)", type: "mensuel" },
    { date: "2026-12-05", title: "Déclaration IRPP Salaires", type: "déclaration" }
];

function initCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;

    // Check Notification Permission
    const notifStatus = ("Notification" in window) ? Notification.permission : "unsupported";

    container.innerHTML = `
        <div class="glass-card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin:0;">📅 Échéancier 2026</h3>
                <button id="btn-enable-notif" class="btn-secondary" style="padding: 8px 15px; font-size: 0.9em;">
                    ${getNotifBtnLabel(notifStatus)}
                </button>
            </div>

            <div class="timeline">
                ${renderTimelineItems()}
            </div>
        </div>
        
        <style>
            .timeline {
                position: relative;
                max-width: 100%;
                margin: 0 auto;
            }
            .timeline::after {
                content: '';
                position: absolute;
                width: 2px;
                background-color: rgba(255,255,255,0.1);
                top: 0;
                bottom: 0;
                left: 20px;
                margin-left: -1px;
            }
            .timeline-item {
                padding: 10px 10px 10px 40px;
                position: relative;
                background-color: inherit;
                width: 100%;
                box-sizing: border-box;
            }
            .timeline-item::after {
                content: '';
                position: absolute;
                width: 12px;
                height: 12px;
                right: -6px;
                background-color: var(--primary);
                border: 2px solid #111;
                top: 18px;
                border-radius: 50%;
                z-index: 1;
                left: 15px;
            }
            .content {
                padding: 15px;
                background-color: rgba(255,255,255,0.05);
                position: relative;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .date-badge {
                font-size: 0.85em;
                font-weight: bold;
                color: var(--accent);
                margin-bottom: 5px;
                display: block;
            }
        </style>
    `;

    // Attach Event Listener
    const btn = document.getElementById('btn-enable-notif');
    if (btn) {
        btn.addEventListener('click', requestNotifPermission);
    }
}

function renderTimelineItems() {
    const today = new Date().toISOString().split('T')[0];

    return FISCAL_DEADLINES.map(item => {
        const isPast = item.date < today;
        const color = isPast ? "#64748b" : "#e2e8f0";
        const icon = getIconForType(item.type);

        return `
            <div class="timeline-item" style="opacity: ${isPast ? 0.6 : 1};">
                <div class="content">
                    <span class="date-badge">${formatDate(item.date)}</span>
                    <h4 style="margin: 0 0 5px 0; color: ${color};">${icon} ${item.title}</h4>
                    ${!isPast ? '<span style="font-size:0.8em; color:#10b981;">● À venir</span>' : '<span style="font-size:0.8em;">✓ Passé</span>'}
                </div>
            </div>
        `;
    }).join('');
}

function getIconForType(type) {
    switch (type) {
        case 'mensuel': return '🗓️';
        case 'acompte': return '💰';
        case 'bilan': return '📊';
        default: return '📜';
    }
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
}

function getNotifBtnLabel(status) {
    if (status === 'granted') return "✅ Rappels Activés";
    if (status === 'denied') return "🚫 Rappels Bloqués";
    return "🔔 Activer les Rappels";
}

function requestNotifPermission() {
    if (!("Notification" in window)) {
        alert("Ce navigateur ne supporte pas les notifications.");
        return;
    }

    Notification.requestPermission().then(permission => {
        const btn = document.getElementById('btn-enable-notif');
        btn.innerText = getNotifBtnLabel(permission);

        if (permission === "granted") {
            new Notification("Simulateur Fiscal", {
                body: "Les rappels fiscaux sont activés !",
                icon: "isaas_logo.jpg"
            });
        }
    });
}
