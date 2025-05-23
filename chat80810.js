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
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
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
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
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
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
            font-family: inherit;
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
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
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
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .n8n-chat-widget .chat-message.bot a {
            color: var(--chat--color-primary); /* or any hex/code you'd like */
            text-decoration: underline;
            font-weight: 500;
            word-break: break-word;
        }

        .n8n-chat-widget .chat-message.bot a:hover {
            color: var(--chat--color-secondary);
            text-decoration: none;
        }

        .n8n-chat-widget .chat-message.bot a:visited {
            color: #6b3fd4; /* optional: secondary shade */
        }

        .n8n-chat-widget .typing-indicator {
            align-self: flex-start;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            height: 24px;
            width: auto;
        }
        
        .n8n-chat-widget .typing-indicator span {
            width: 6px;
            height: 6px;
            background: var(--chat--color-font);
            border-radius: 50%;
            animation: typingBounce 1.2s infinite ease-in-out both;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingBounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }
        
        @media screen and (max-width: 480px) {
          .n8n-chat-widget .chat-container {
              width: 100vw;
              height: 100vh;
              bottom: 0;
              right: 0;
              border-radius: 0;
          }
      
          .n8n-chat-widget .chat-toggle {
              bottom: 16px;
              right: 16px;
          }
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
          transition: background 0.2s, color 0.2s;
          font-family: inherit;
      }
      
      .n8n-chat-widget .prompt-button:hover {
          background: var(--chat--color-primary);
          color: #fff;
      }

    `;

    // Load Poppins font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink);


    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Created by EvolveHI.ai',
                link: 'EvolveHI.ai'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
{
    webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
    branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
    style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
    toggle: window.ChatWidgetConfig.toggle || {},
    prompts: window.ChatWidgetConfig.prompts || []
} : { ...defaultConfig, toggle: {}, prompts: [] };

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
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
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
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
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
    <div style="all: unset; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: #fff; border-radius: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 280px;">
        <img src="${config.toggle?.avatar || 'https://default-avatar.png'}" alt="Chat Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
        <span style="font-family: Poppins, sans-serif; font-size: 14px; color: var(--chat--color-font);">${config.toggle?.text || 'Chat with us!'}</span>
    </div>
`;

    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const promptContainer = chatContainer.querySelector('.quick-prompts');

    if (promptContainer && Array.isArray(config.prompts)) {
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


    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.innerHTML = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Add typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            console.log('Webhook response:', data);
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = data.message?.content || 'No response.';
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.removeChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            messagesContainer.removeChild(typingIndicator);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
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
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
