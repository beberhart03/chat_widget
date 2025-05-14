// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Poppins', sans-serif;
        }

        .n8n-chat-widget .chat-message.bot a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            font-weight: 500;
            word-break: break-word;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            align-self: flex-start;
            width: fit-content;
        }

        .n8n-chat-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--chat--color-font);
            opacity: 0.4;
            animation: typingAnimation 1.2s infinite ease-in-out;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .n8n-chat-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.3;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const config = window.ChatWidgetConfig || {};
    let currentSessionId = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    widgetContainer.appendChild(chatContainer);

    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    chatContainer.appendChild(chatMessages);

    function enhanceLinks(container) {
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    async function sendMessage(message) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(config.webhook?.url || '', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId: currentSessionId,
                    route: config.webhook?.route || '',
                    chatInput: message,
                    metadata: { userId: "" }
                })
            });

            const data = await response.json();
            chatMessages.removeChild(typingIndicator);

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = data.message?.content || 'No response.';
            enhanceLinks(botMessageDiv);
            chatMessages.appendChild(botMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            chatMessages.removeChild(typingIndicator);
        }
    }

    // Example usage
    document.body.appendChild(widgetContainer);
    sendMessage("Hello! What water filters do you recommend?");
})();
