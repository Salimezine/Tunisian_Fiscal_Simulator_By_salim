let aiService = null;

function initAssistant() {
    // Initialize AI service
    aiService = getAIService();

    // Global hook for modules to share context
    window.shareWithAI = (context) => {
        if (aiService) {
            aiService.setContext(context);
        }
    };

    // Setup event listeners
    setupChatListeners();
    setupFloatingBubble();
}

/**
 * Switch categories of shortcuts inside chat
 */
window.switchChatTab = function (tab) {
    const tabs = ['math', 'biz', 'misc'];
    const target = tab || 'misc';

    // Toggle containers
    tabs.forEach(t => {
        const el = document.getElementById(`shortcuts-${t}`);
        if (el) el.classList.toggle('hidden', t !== target);
    });

    // Update active button state
    const btns = document.querySelectorAll('.chat-tab-btn');
    btns.forEach(btn => {
        const label = btn.innerText.toLowerCase();
        btn.classList.toggle('active',
            (target === 'math' && label.includes('calcul')) ||
            (target === 'biz' && label.includes('business')) ||
            (target === 'misc' && label.includes('autre'))
        );
    });
};

/**
 * Global bridge to ask a question to the assistant
 */
window.askAssistant = function (message) {
    const container = document.getElementById('ai-chat-container');
    if (container && (container.style.display === 'none' || !container.classList.contains('active'))) {
        // Toggle chat visible
        container.style.display = 'flex';
        container.classList.add('active');
    }

    const input = document.getElementById('chat-input');
    if (input) {
        input.value = message;
        handleUserInput();
    }
};

/**
 * Trigger Consultation Logic
 */
window.triggerConsultation = function () {
    window.askAssistant("consultation_irpp");
};

// --- VOICE RECOGNITION SETUP ---
let recognition = null;
let isVoiceEnabled = false;

function initVoice() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'fr-FR';

        recognition.onstart = function () {
            const micBtn = document.getElementById('mic-btn');
            if (micBtn) micBtn.classList.add('listening');
        };

        recognition.onend = function () {
            const micBtn = document.getElementById('mic-btn');
            if (micBtn) micBtn.classList.remove('listening');
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('chat-input');
            if (input) {
                input.value = transcript;
                isVoiceEnabled = true; // Auto-enable TTS if user used voice
                handleUserInput();
            }
        };

        recognition.onerror = function (event) {
            console.error("Voice Error:", event.error);
            const micBtn = document.getElementById('mic-btn');
            if (micBtn) micBtn.classList.remove('listening');

            if (event.error === 'not-allowed') {
                alert("⚠️ Accès micro refusé. Veuillez autoriser le microphone.");
            } else if (event.error === 'network') {
                alert("⚠️ Erreur réseau : Une connexion internet est requise pour la reconnaissance vocale.");
            } else if (event.error === 'no-speech') {
                // Ignore
            } else {
                alert("⚠️ Erreur vocale : " + event.error);
            }
        };
    } else {
        console.warn("Web Speech API non supportée sur ce navigateur.");
    }
}

function startListening() {
    if (!recognition) {
        initVoice();
    }

    if (recognition) {
        try {
            recognition.start();
        } catch (e) {
            console.error("Erreur startListening:", e);
        }
    } else {
        alert("❌ La reconnaissance vocale n'est pas supportée. Essayez Google Chrome.");
    }
}

function speakResponse(text) {
    if (!isVoiceEnabled) return;

    window.speechSynthesis.cancel(); // Stop previous
    const cleanText = text.replace(/[*#_`]/g, ''); // Remove MD chars
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
}

/**
 * Setup chat input listeners
 */
function setupChatListeners() {
    const input = document.getElementById('chat-input');
    const button = document.getElementById('chat-send');
    const suggestions = document.querySelectorAll('.chat-suggest-btn');

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });
    }

    if (button) {
        button.addEventListener('click', handleUserInput);
    }

    // Voice Button Listener
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.addEventListener('click', startListening);
        // Init voice specifically here
        initVoice();
    }

    suggestions.forEach(s => {
        s.addEventListener('click', () => {
            const actionKey = s.getAttribute('data-msg-key');
            if (actionKey && AI_CONFIG.quickActions[actionKey]) {
                input.value = AI_CONFIG.quickActions[actionKey];
                handleUserInput();
            }
        });
    });

    // Legacy util buttons (Emoji/Attachment) are removed. 
    // Mic button has its own specific listener above.

    const clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearChat);
    }

    const exportBtn = document.getElementById('export-chat-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportChat);
    }
}

/**
 * Handle user input and send to AI
 */
async function handleUserInput() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    input.disabled = true;
    const button = document.getElementById('chat-send');
    if (button) button.disabled = true;

    const typingUI = showTyping();

    try {
        // Prepare context
        if (window.lastCalculation) {
            aiService.setContext(window.lastCalculation);
        }

        // Call AI
        await aiService.sendMessage(
            text,
            // On chunk (for streaming or early errors)
            (chunk, fullText) => {
                const existingMsg = typingUI.querySelector('.msg-text');
                if (existingMsg) {
                    existingMsg.innerHTML = formatAIResponse(fullText); // Optional formatting
                }
            },
            // On complete
            (fullResponse) => {
                typingUI.remove();
                addMessage(fullResponse, 'system');
                speakResponse(fullResponse); // Speak if enabled
            },
            // On error
            (error) => {
                typingUI.remove();
                handleChatError(error);
            }
        );

    } catch (error) {
        typingUI.remove();
        handleChatError(error);
    } finally {
        input.disabled = false;
        if (button) button.disabled = false;
        input.focus();
    }
}

function handleChatError(error) {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };
    console.error('Chat Error:', error);
    addMessage(`⚠️ ${t("msg_error_occurred")}: ${error.message}`, 'system');
}

/**
 * Show typing indicator
 */
function showTyping() {
    const container = document.getElementById('chat-messages');
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    container.appendChild(typing);
    scrollToBottom();
    return typing;
}

/**
 * Add message to chat
 */
function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const formattedText = type === 'system' ? formatChatResponse(text) : text;

    msgDiv.innerHTML = `
        <span class="icon">${type === 'system' ? '🌟' : '👤'}</span>
        <div class="msg-text">
            ${formattedText}
            ${type === 'system' ? `
            <div class="message-actions">
                <button class="action-btn" onclick="copyMessage(this)" title="Copier">📋</button>
            </div>` : ''}
        </div>
    `;

    container.appendChild(msgDiv);
    scrollToBottom();
}

/**
 * Basic formatting for chat responses with educational emphasis
 */
function formatChatResponse(text) {
    if (!text) return "";

    // 1. Format headers (###)
    let formatted = text.replace(/^### (.*$)/gm, '<h3 style="color:var(--premium-purple);margin:10px 0 5px 0;font-size:1.1rem;border-bottom:1px solid rgba(168,85,247,0.2);padding-bottom:4px;">$1</h3>');

    // 2. Format bold text (**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#60a5fa">$1</strong>');

    // 3. Format Numbered Lists (1. 2.)
    formatted = formatted.replace(/^\d+\.\s+(.*$)/gm, '<div style="margin-left:15px;margin-bottom:4px"><strong>$&</strong></div>');

    // 4. Format Bullet Lists (-)
    formatted = formatted.replace(/^-\s+(.*$)/gm, '<div style="margin-left:15px;margin-bottom:4px">• $1</div>');

    // 5. Format code (`)
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;color:#fca5a5">$1</code>');

    // 6. Format links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--premium-purple);text-decoration:underline">$1</a>');

    // 7. Add icon before legal references
    formatted = formatted.replace(
        /(Article\s+\d+|Code\s+\w+|JORT\s+n°\d+|LF\s+202\d)/gi,
        '📚 <strong>$1</strong>'
    );

    // 8. Format line breaks (preserving those already in div/h3 etc)
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

/**
 * Clear chat history
 */
function clearChat() {
    const t = (key) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.I18N_DATA && window.I18N_DATA[lang] && window.I18N_DATA[lang][key]) || key;
    };

    if (!confirm(t('msg_confirm_clear'))) return;

    const container = document.getElementById('chat-messages');
    if (container) {
        container.innerHTML = `
            <div class="message system">
                <span class="icon">🤖</span>
                <div class="msg-text" data-i18n="chat_welcome">${t('chat_welcome')}</div>
            </div>
        `;
    }
}

/**
 * Export chat history
 */
function exportChat() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const text = container.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Conversation_Assistant_Fiscal.txt";
    a.click();
}

/**
 * Copy message content
 */
function copyMessage(btn) {
    const parent = btn.closest('.msg-text');
    // Clone to remove the action div before copying text
    const clone = parent.cloneNode(true);
    const actions = clone.querySelector('.message-actions');
    if (actions) actions.remove();

    const msgText = clone.innerText.trim();
    navigator.clipboard.writeText(msgText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✓';
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
        }, 1500);
    });
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

/**
 * Setup floating bubble toggle
 */
function setupFloatingBubble() {
    const bubble = document.getElementById('ai-floating-bubble');
    const openBtn = document.getElementById('open-ai-chat');
    const container = document.getElementById('ai-chat-container');
    const closeBtn = document.getElementById('close-chat-btn');

    if (!container) return;

    const toggleChat = () => {
        const isVisible = container.classList.contains('active') || container.style.display === 'flex';

        if (isVisible) {
            container.style.display = 'none';
            container.classList.remove('active');
        } else {
            container.style.display = 'flex';
            container.classList.add('active');
            scrollToBottom();
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }
    };

    if (bubble) bubble.addEventListener('click', toggleChat);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            container.classList.remove('active');
        });
    }
}

// Initialized via main.js
// window.addEventListener('DOMContentLoaded', initAssistant);
