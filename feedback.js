/**
 * MODULE: Feedback System
 * Collects user ratings and comments (Local Storage)
 */

function initFeedback() {
    // Append feedback modal to body
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="glass-card" style="max-width: 400px; margin: 100px auto; padding: 25px; position: relative;">
            <button onclick="toggleFeedback()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:white; font-size:1.5em; cursor:pointer;">&times;</button>
            
            <h3 style="margin-top:0;">Votre Avis Compte ! 🌟</h3>
            <p>Aidez-nous à améliorer ce projet PFE.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <div class="stars" style="font-size: 2em; cursor: pointer;">
                    <span onclick="setRating(1)">★</span>
                    <span onclick="setRating(2)">★</span>
                    <span onclick="setRating(3)">★</span>
                    <span onclick="setRating(4)">★</span>
                    <span onclick="setRating(5)">★</span>
                </div>
                <input type="hidden" id="feedback-rating" value="0">
            </div>
            
            <textarea id="feedback-text" class="form-control" rows="4" placeholder="Votre commentaire..."></textarea>
            
            <button class="btn-primary" style="width:100%; margin-top:15px;" onclick="submitFeedback()">Envoyer</button>
        </div>
        <style>
            .stars span { color: #ccc; transition: 0.2s; }
            .stars span.active { color: #fbbf24; }
            .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; }
            .modal.hidden { display: none; }
        </style>
    `;
    document.body.appendChild(modal);

    // Add Feedback Button to Footer if not present
    const footer = document.querySelector('.main-footer');
    if (footer) {
        const btn = document.createElement('button');
        btn.innerText = "💬 Donnez votre avis";
        btn.style.cssText = "background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px 10px; border-radius: 15px; cursor: pointer; margin-top: 10px; font-size: 0.8em;";
        btn.onclick = toggleFeedback;
        footer.appendChild(btn);
    }
}

window.toggleFeedback = function () {
    const el = document.getElementById('feedback-modal');
    el.classList.toggle('hidden');
};

window.setRating = function (n) {
    document.getElementById('feedback-rating').value = n;
    const stars = document.querySelectorAll('.stars span');
    stars.forEach((s, i) => {
        s.classList.toggle('active', i < n);
    });
};

window.submitFeedback = function () {
    const rating = document.getElementById('feedback-rating').value;
    const text = document.getElementById('feedback-text').value;

    if (rating == 0) { alert("Veuillez sélectionner une note !"); return; }

    const feedback = {
        date: new Date().toISOString(),
        rating,
        text
    };

    // Save to Local Storage
    const existing = JSON.parse(localStorage.getItem('fiscal_feedback') || '[]');
    existing.push(feedback);
    localStorage.setItem('fiscal_feedback', JSON.stringify(existing));

    alert("Merci pour votre retour ! 🙏");
    toggleFeedback();
};
