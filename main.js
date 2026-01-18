/**
 * MAIN APP INITIALIZATION
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Tabs (Updated for Dashboard)
    initTabs();

    // 2. Load Modules with Error Handling
    try { initIRPP(); } catch (e) { console.error("Erreur initIRPP:", e); }
    try { initIS(); } catch (e) { console.error("Erreur initIS:", e); }
    try { initTVA(); } catch (e) { console.error("Erreur initTVA:", e); }
    try { initISF(); } catch (e) { console.error("Erreur initISF:", e); }
    try { initRS(); } catch (e) { console.error("Erreur initRS:", e); }
    try { initConseiller(); } catch (e) { console.error("Erreur initConseiller:", e); }
    try { initAssistant(); } catch (e) { console.error("Erreur initAssistant:", e); }
    try { initComparative(); } catch (e) { console.error("Erreur initComparative:", e); }

    // 3. Initialize Wizard
    try {
        if (typeof irppWizard !== 'undefined') irppWizard.init();
    } catch (e) {
        console.error("Erreur initWizard:", e);
    }

    // Set Date for Print Footer
    document.body.setAttribute('data-date', new Date().toLocaleDateString('fr-TN'));

    console.log('✨ Simulateur Fiscal Tunisien Initialisé (Phase 3)');
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            switchTab(target);
        });
    });
}

function switchTab(targetId) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.add('hidden'));

    const activeTab = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
    const activeContent = document.getElementById(targetId);

    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.remove('hidden');

    // Auto-scroll to top
    window.scrollTo(0, 0);

    // Special logic for Wizard initiation in IRPP
    const wizardContainer = document.getElementById('irpp-wizard');
    const irppContainer = document.getElementById('irpp-container');

    if (targetId === 'irpp') {
        if (wizardContainer) wizardContainer.classList.add('hidden');
        if (irppContainer) irppContainer.classList.remove('hidden');
    }
}

// Global bridge for dashboard cards
window.switchTab = switchTab;

/**
 * Global Bridge for populateIRPP from Wizard
 */
window.populateIRPP = function (data) {
    const brutInput = document.getElementById('revenuInput');
    const situationSelect = document.getElementById('typeRevenu'); // Note: 'situation' in wizard maps to 'typeRevenu' or similar?
    const enfantsInput = document.getElementById('nbEnfants');

    if (brutInput) brutInput.value = data.salaireBrut;
    if (enfantsInput) {
        // Find option with data.enfants or closest
        enfantsInput.value = data.enfants > 4 ? "4" : data.enfants.toString();
    }

    // Ensure Chef de Famille is checked if married in wizard
    const chefFamilleCheck = document.getElementById('chefFamille');
    if (chefFamilleCheck) {
        chefFamilleCheck.checked = (data.situation === 'marie');
    }

    // Switch UI to show the real form and results
    const wizardContainer = document.getElementById('irpp-wizard');
    const irppContainer = document.getElementById('irpp-container');
    if (wizardContainer) wizardContainer.classList.add('hidden');
    if (irppContainer) irppContainer.classList.remove('hidden');

    // Scroll to the button to trigger final calculation
    const calcBtn = document.getElementById('btn-calc-irpp');
    if (calcBtn) calcBtn.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Global bridge to launch Wizard
 */
window.launchWizard = function () {
    const wizardContainer = document.getElementById('irpp-wizard');
    const irppContainer = document.getElementById('irpp-container');
    if (wizardContainer) wizardContainer.classList.remove('hidden');
    if (irppContainer) irppContainer.classList.add('hidden');
    if (typeof irppWizard !== 'undefined') {
        irppWizard.currentStep = 1;
        irppWizard.render();
    }
};

