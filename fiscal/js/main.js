document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Update Buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Content
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Initialize Modules with Error Handling
    try { initIRPP(); } catch (e) { console.error("Erreur initIRPP:", e); }
    try { initIS(); } catch (e) { console.error("Erreur initIS:", e); }
    try { initTVA(); } catch (e) { console.error("Erreur initTVA:", e); }
    try { initISF(); } catch (e) { console.error("Erreur initISF:", e); }
    try { initRS(); } catch (e) { console.error("Erreur initRS:", e); }
    try { initConseiller(); } catch (e) { console.error("Erreur initConseiller:", e); }
    try { initAssistant(); } catch (e) { console.error("Erreur initAssistant:", e); }
    try { initComparative(); } catch (e) { console.error("Erreur initComparative:", e); }

    // Set Date for Print Footer
    document.body.setAttribute('data-date', new Date().toLocaleDateString('fr-TN'));
});

