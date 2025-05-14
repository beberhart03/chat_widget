// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: #854fff;
            --chat--color-secondary: #6b3fd4;
            --chat--color-background: #ffffff;
            --chat--color-font: #333333;
            font-family: 'Poppins', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 360px;
            height: 500px;
            border-radius: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            background: var(--chat--color-background);
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: var(--chat--color-background);
        }

        .n8n-chat-widget .chat-message {
            margin: 8px 0;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 80%;
            word-break: break-word;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
            color: white;
            align-self: flex-end;
        }

        .n8n-chat-widget .chat-message.bot {
            background: #f1f1f1;
            color: #333;
            align-self: flex-start;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            margin: 8px 0;
            background: #f3f3f3;
            border-radius: 12px;
            align-self: flex-start;
        }

        .n8n-chat-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #aaa;
            animation: typingAnimation 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingAnimation {
            0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
        }

        .n8n-chat-widget .chat-input {
            display: flex;
            border-top: 1px solid #eee;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: none;
            font-family: inherit;
            resize: none;
        }

        .n8n-chat-widget .chat-input button {
            background: var(--chat--color-primary);
            color: white;
            border: none;
            padding: 0 16px;
            cursor: pointer;
        }

        .n8n-chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: var(--chat--color-primary);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
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
    let currentSessionId = crypto.randomUUID();

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    widgetContainer.appendChild(chatContainer);

    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    chatContainer.appendChild(chatMessages);

    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <textarea placeholder="Type a message..."></textarea>
        <button>Send</button>
    `;
    chatContainer.appendChild(chatInput);

    const toggleButton = document.createElement('button');
    toggleButton.className = 'n8n-chat-toggle';
    toggleButton.innerHTML = '💬';
    document.body.appendChild(toggleButton);

    document.body.appendChild(widgetContainer);

    toggleButton.addEventListener('click', () => {
        chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    const textarea = chatInput.querySelector('textarea');
    const sendButton = chatInput.querySelector('button');

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
                headers: { 'Content-Type': 'application/json' },
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

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
})();
