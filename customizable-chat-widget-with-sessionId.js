
(function (window) {
    function createChatWidget(config) {
        const {
            url,
            primaryColor = "#0056FF",
            fontFamily = "Poppins, sans-serif",
            title = "Chat",
            firstMessage = "Hello, how can I help you?",
            initPayload = "",
            zIndex = 1000
        } = config;

        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem('chatSessionId', sessionId);
        }

        const style = document.createElement('style');
        style.textContent = `
            .chat-widget-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: ${zIndex};
                font-family: ${fontFamily};
            }
            .chat-toggle {
                width: 60px;
                height: 60px;
                background: ${primaryColor};
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .chat-box {
                display: none;
                flex-direction: column;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                margin-top: 10px;
            }
            .chat-box.open {
                display: flex;
            }
            .chat-header {
                background: ${primaryColor};
                color: white;
                padding: 16px;
                font-weight: bold;
            }
            .chat-messages {
                flex: 1;
                padding: 12px;
                overflow-y: auto;
                background: #f9f9f9;
            }
            .chat-message {
                margin: 8px 0;
                padding: 10px 14px;
                border-radius: 12px;
                max-width: 80%;
                font-size: 14px;
            }
            .chat-message.user {
                background: ${primaryColor};
                color: white;
                align-self: flex-end;
            }
            .chat-message.bot {
                background: #e4e6eb;
                color: #111;
                align-self: flex-start;
            }
            .chat-input {
                display: flex;
                border-top: 1px solid #ccc;
            }
            .chat-input input {
                flex: 1;
                padding: 12px;
                border: none;
                font-family: inherit;
                font-size: 14px;
            }
            .chat-input button {
                background: ${primaryColor};
                color: white;
                border: none;
                padding: 0 16px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement("div");
        container.className = "chat-widget-container";
        container.innerHTML = `
            <button class="chat-toggle">💬</button>
            <div class="chat-box">
                <div class="chat-header">${title}</div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message...">
                    <button>➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const toggle = container.querySelector(".chat-toggle");
        const chatBox = container.querySelector(".chat-box");
        const input = container.querySelector("input");
        const sendButton = container.querySelector("button");
        const messages = container.querySelector(".chat-messages");

        function appendMessage(text, sender) {
            const msg = document.createElement("div");
            msg.className = `chat-message ${sender}`;
            msg.textContent = text;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight;
        }

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            appendMessage(text, "user");
            input.value = "";

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: text })
            })
            .then(res => res.json())
            .then(data => {
                const response = Array.isArray(data) ? data[0].text : data.text;
                appendMessage(response, "bot");
            })
            .catch(() => appendMessage("Something went wrong.", "bot"));
        }

        toggle.addEventListener("click", () => {
            chatBox.classList.toggle("open");
        });

        sendButton.addEventListener("click", sendMessage);
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") sendMessage();
        });

        if (firstMessage) {
            appendMessage(firstMessage, "bot");
        }

        if (initPayload) {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: initPayload })
            })
            .then(res => res.json())
            .then(data => {
                const response = Array.isArray(data) ? data[0].text : data.text;
                appendMessage(response, "bot");
            })
            .catch(() => appendMessage("Failed to load intro.", "bot"));
        }
    }

    window.ChatWidget = {
        init: createChatWidget
    };
})(window);
