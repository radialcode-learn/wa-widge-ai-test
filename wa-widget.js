(function () {
    // Helper function to create elements
    function createElement(tag, attributes, ...children) {
        const element = document.createElement(tag);
        for (const key in attributes) {
            if (key.startsWith('data-')) {
                element.setAttribute(key, attributes[key]);
            } else {
                element[key] = attributes[key];
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    }

    // Parse script attributes
    const script = document.currentScript;
    const whatsappNumber = script.getAttribute('data-whatsapp-number');
    const businessName = script.getAttribute('data-business-name') || 'Business';
    const defaultMessage = script.getAttribute('data-default-message') || '';
    const themeColor = script.getAttribute('data-theme-color') || '#25D366';
    const position = script.getAttribute('data-position') || 'bottom-right';
    const welcomeMessage = script.getAttribute('data-welcome-message') || 'Hi there! How can we help you today?';

    // Create floating button
    const floatingButton = createElement('div', {
        className: `wa-floating-button ${position}`,
        style: `background-color: ${themeColor};`,
        onclick: togglePopup
    }, 'Chat with us');

    // Create popup
    const popup = createElement('div', {
        className: 'wa-popup',
        style: 'display: none;'
    },
        createElement('div', { className: 'wa-popup-header' }, businessName),
        createElement('div', { className: 'wa-popup-message' }, welcomeMessage),
        createElement('button', {
            className: 'wa-start-chat',
            style: `background-color: ${themeColor};`,
            onclick: startChat
        }, 'Start Chat'),
        createElement('button', {
            className: 'wa-scan-qr',
            onclick: toggleQRCode
        }, 'Scan QR'),
        createElement('div', { className: 'wa-qr-code', style: 'display: none;' })
    );

    // Append elements to body
    document.body.appendChild(floatingButton);
    document.body.appendChild(popup);

    // Toggle popup visibility
    function togglePopup() {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    // Start chat function
    function startChat() {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
    }

    // Toggle QR code visibility
    function toggleQRCode() {
        const qrCodeDiv = popup.querySelector('.wa-qr-code');
        if (qrCodeDiv.style.display === 'none') {
            qrCodeDiv.style.display = 'block';
            if (!qrCodeDiv.innerHTML) {
                generateQRCode(qrCodeDiv);
            }
        } else {
            qrCodeDiv.style.display = 'none';
        }
    }

    // Generate QR code
    function generateQRCode(container) {
        const qrCodeScript = document.createElement('script');
        qrCodeScript.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
        qrCodeScript.onload = () => {
            QRCode.toCanvas(container, `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`);
        };
        document.body.appendChild(qrCodeScript);
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .wa-floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            color: white;
            border-radius: 50px;
            cursor: pointer;
            z-index: 1000;
        }
        .wa-popup {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        .wa-popup-header {
            font-weight: bold;
            padding: 10px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        .wa-popup-message {
            padding: 10px;
        }
        .wa-start-chat, .wa-scan-qr {
            display: block;
            width: calc(100% - 20px);
            margin: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .wa-qr-code {
            text-align: center;
            padding: 10px;
        }
    `;
    document.head.appendChild(style);
})();
