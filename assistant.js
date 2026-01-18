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

    suggestions.forEach(s => {
        s.addEventListener('click', () => {
            const msg = s.getAttribute('data-msg');
            input.value = msg;
            handleUserInput();
        });
    });

    const utilBtns = document.querySelectorAll('.input-util-btn');
    utilBtns.forEach((btn, index) => { // Added index for specific button handling
        btn.addEventListener('click', () => {
            // Visual feedback
            btn.style.filter = 'brightness(1.5)';
            setTimeout(() => btn.style.filter = '', 200);

            // Specific functionality for buttons
            if (index === 0) { // Emoji Button
                const input = document.getElementById('chat-input');
                input.value += " 😊";
                input.focus();
            } else if (index === 1) { // Attachment Button
                alert("📎 L'analyse de documents (PDF/Image) sera disponible dans la version Pro.");
            }
        });
    });

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
            // On chunk (for streaming effect)
            (chunk, fullText) => {
                // For n8n we might just get one chunk, but this keeps UI ready for streaming
            },
            // On complete
            (fullResponse) => {
                typingUI.remove();
                addMessage(fullResponse, 'system');
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
    console.error('Chat Error:', error);
    addMessage(`⚠️ Désolé, une erreur est survenue : ${error.message}`, 'system');
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
        <span class="icon">${type === 'system' ? '🤖' : '👤'}</span>
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
    if (!confirm('Effacer la conversation ?')) return;

    const container = document.getElementById('chat-messages');
    if (container) {
        container.innerHTML = `
            <div class="message system">
                <span class="icon">🤖</span>
                <div class="msg-text">Bonjour ! Je suis votre assistant fiscal. Comment puis-je vous aider ?</div>
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
