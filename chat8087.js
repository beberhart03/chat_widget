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
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }
        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }
        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }
        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            font-size: 20px;
            opacity: 0.6;
        }
        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }
        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }
        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }
        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }
        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }
        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
        }
        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }
        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }
        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }
        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }
        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }
        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }
        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 16px;
        }
        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
        }
        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
        }
        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }
        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-size: 16px;
        }
        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }
        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            font-weight: 500;
        }
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .n8n-chat-widget .quick-prompts {
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .n8n-chat-widget .quick-prompts p {
            margin: 0;
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.8;
        }
        .n8n-chat-widget .prompt-button {
            background: none;
            border: 1px solid var(--chat--color-primary);
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            color: var(--chat--color-primary);
            cursor: pointer;
            font-family: inherit;
        }
        .n8n-chat-widget .prompt-button:hover {
            background: var(--chat--color-primary);
            color: #fff;
        }
    `;

    // Inject styles
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default config
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Created by EvolveHI.ai', link: 'https://evolvehi.ai' }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        prompts: []
    };

    const config = window.ChatWidgetConfig
        ? {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            prompts: window.ChatWidgetConfig.prompts || []
        }
        : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // Widget setup
    let currentSessionId = '';
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">Send us a message</button>
            <p class="response-text">${config.branding.responseTimeText}</p>
            <div class="quick-prompts"></div>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    widgetContainer.appendChild(chatContainer);

    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.477..."/></svg>`;
    widgetContainer.appendChild(toggleButton);

    document.body.appendChild(widgetContainer);

    // Element references
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const promptContainer = chatContainer.querySelector('.quick-prompts');

    // Render prompt buttons
    if (promptContainer && config.prompts.length) {
        const promptTitle = document.createElement('p');
        promptTitle.textContent = 'Try asking:';
        promptContainer.appendChild(promptTitle);
        config.prompts.forEach(prompt => {
            const btn = document.createElement('button');
            btn.className = 'prompt-button';
            btn.textContent = prompt;
            btn.addEventListener('click', () => {
                startNewConversation().then(() => {
                    sendMessage(prompt);
                });
            });
            promptContainer.appendChild(btn);
        });
    }

    // Logic
    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{ action: "loadPreviousSession", sessionId: currentSessionId, route: config.webhook.route, metadata: { userId: "" } }];
        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const responseData = await res.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (e) {
            console.error('Chat load error:', e);
        }
    }

    async function sendMessage(message) {
        const data = { action: "sendMessage", sessionId: currentSessionId, route: config.webhook.route, chatInput: message, metadata: { userId: "" } };
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = message;
        messagesContainer.appendChild(userMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.innerHTML = json.message?.content || 'No response.';
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (e) {
            console.error('Send error:', e);
        }
    }

    // Events
    newChatBtn.addEventListener('click', startNewConversation);
    sendButton.addEventListener('click', () => {
        const msg = textarea.value.trim();
        if (msg) {
            sendMessage(msg);
            textarea.value = '';
        }
    });
    textarea.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const msg = textarea.value.trim();
            if (msg) {
                sendMessage(msg);
                textarea.value = '';
            }
        }
    });
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });
    chatContainer.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
