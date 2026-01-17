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
 * Basic formatting for chat responses
 */
function formatChatResponse(text) {
    if (!text) return "";
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
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
    const msgText = btn.closest('.msg-text').innerText.replace('📋', '').trim();
    navigator.clipboard.writeText(msgText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = originalText, 1500);
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
    const container = document.getElementById('ai-chat-container');
    const closeBtn = document.getElementById('close-chat-btn');

    if (!bubble || !container) return;

    bubble.addEventListener('click', () => {
        const isVisible = container.style.display !== 'none';
        container.style.display = isVisible ? 'none' : 'flex';

        if (!isVisible) {
            scrollToBottom();
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
}

window.addEventListener('DOMContentLoaded', initAssistant);
