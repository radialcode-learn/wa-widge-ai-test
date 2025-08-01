(function () {
  // Helper function to create elements
  function createElement(tag, attributes, ...children) {
    const element = document.createElement(tag);
    for (const key in attributes) {
      if (key.startsWith("data-")) {
        element.setAttribute(key, attributes[key]);
      } else {
        element[key] = attributes[key];
      }
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }

  // Parse script attributes
  const script = document.currentScript;
  const whatsappNumber = script.getAttribute("data-whatsapp-number");
  const businessName = script.getAttribute("data-business-name") || "Business";
  const defaultMessage = script.getAttribute("data-default-message") || "";
  const themeColor = script.getAttribute("data-theme-color") || "#25D366";
  const position = script.getAttribute("data-position") || "bottom-right";
  const welcomeMessage = script.getAttribute("data-welcome-message") || "Hi there! How can we help you today?";
  const logoUrl = script.getAttribute("data-logo-url") || null;

  // Create floating button
  const floatingButton = createElement(
    "div",
    {
      className: `wa-floating-button ${position}`,
      style: `background-color: ${themeColor};`,
      onclick: togglePopup,
    },
    "Chat with us"
  );

  // Create popup
  const popup = createElement(
    "div",
    {
      className: "wa-popup",
      style: "display: none;",
    },
    createElement("div", { className: "wa-popup-header" }, businessName),
    createElement("div", { className: "wa-popup-message" }, welcomeMessage),
    createElement(
      "button",
      {
        className: "wa-start-chat",
        style: `background-color: ${themeColor};`,
        onclick: startChat,
      },
      "Start Chat"
    ),
    createElement(
      "button",
      {
        className: "wa-scan-qr",
        onclick: toggleQRCode,
      },
      "Scan QR"
    ),
    createElement("div", { className: "wa-qr-code", style: "display: none;" })
  );

  // Append elements to body
  document.body.appendChild(floatingButton);
  document.body.appendChild(popup);

  // Toggle popup visibility
  function togglePopup() {
    popup.style.display = popup.style.display === "none" ? "block" : "none";
  }

  // Start chat function
  function startChat() {
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "");
    const url = defaultMessage
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`
      : `https://wa.me/${cleanNumber}`;
    window.open(url, "_blank");
  }

  // Toggle QR code visibility
  function toggleQRCode() {
    const qrCodeDiv = popup.querySelector(".wa-qr-code");
    if (qrCodeDiv.style.display === "none") {
      qrCodeDiv.style.display = "block";
      if (!qrCodeDiv.innerHTML) {
        generateQRCode(qrCodeDiv);
      }
    } else {
      qrCodeDiv.style.display = "none";
    }
  }

  // Generate QR code using QR Server API as fallback
  function generateQRCode(container) {
    console.log("Attempting to generate QR code...");

    // Show loading spinner
    showLoadingSpinner(container);

    // Try to load QRCode library first
    if (window.QRCode) {
      console.log("QRCode library already loaded");
      setTimeout(() => createQRCodeWithLibrary(container), 100); // Small delay to show spinner
      return;
    }

    // Try loading the library
    const qrCodeScript = document.createElement("script");
    qrCodeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

    // Set a timeout for library loading
    const timeout = setTimeout(() => {
      console.log("QR library loading timeout, using fallback");
      createQRCodeWithAPI(container);
    }, 3000); // Reduced timeout for better UX

    qrCodeScript.onload = () => {
      clearTimeout(timeout);
      console.log("QRCode library loaded successfully");
      createQRCodeWithLibrary(container);
    };

    qrCodeScript.onerror = () => {
      clearTimeout(timeout);
      console.log("Failed to load QR library, using API fallback");
      createQRCodeWithAPI(container);
    };

    document.head.appendChild(qrCodeScript);
  }

  function showLoadingSpinner(container) {
    container.innerHTML = `
      <div class="wa-qr-loading">
        <div class="wa-spinner"></div>
        <p>Generating QR code...</p>
      </div>
    `;
  }

  function createQRCodeWithLibrary(container) {
    try {
      if (!whatsappNumber) {
        container.innerHTML = '<p style="color: red; text-align: center;">Invalid WhatsApp number</p>';
        return;
      }

      const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "");
      const qrData = defaultMessage
        ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`
        : `https://wa.me/${cleanNumber}`;

      console.log("Generating QR with library for:", qrData);

      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      container.appendChild(canvas);

      QRCode.toCanvas(
        canvas,
        qrData,
        {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) {
            console.error("Library QR generation failed:", error);
            createQRCodeWithAPI(container);
          } else {
            console.log("QR code generated successfully with library");
            addQRInstructions(container);
          }
        }
      );
    } catch (error) {
      console.error("Library error:", error);
      createQRCodeWithAPI(container);
    }
  }

  function createQRCodeWithAPI(container) {
    try {
      if (!whatsappNumber) {
        container.innerHTML = '<p style="color: red; text-align: center;">Invalid WhatsApp number</p>';
        return;
      }

      const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "");
      const qrData = defaultMessage
        ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`
        : `https://wa.me/${cleanNumber}`;

      console.log("Generating QR with API for:", qrData);

      // Create QR code container with custom styling
      const qrContainer = document.createElement("div");
      qrContainer.className = "wa-qr-container";

      // Use QR Server API with custom styling
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData
      )}&format=png&margin=10`;

      const img = document.createElement("img");
      img.src = qrApiUrl;
      img.alt = "WhatsApp QR Code";
      img.className = "wa-qr-image";
      img.style.display = "none";

      img.onload = () => {
        console.log("QR code generated successfully with API");
        container.innerHTML = "";

        // Add the QR image to container
        qrContainer.appendChild(img);

        // Add logo overlay if provided
        if (logoUrl) {
          const logoOverlay = document.createElement("div");
          logoOverlay.className = "wa-qr-logo-overlay";
          const logo = document.createElement("img");
          logo.src = logoUrl;
          logo.alt = "Logo";
          logo.className = "wa-qr-logo";
          logoOverlay.appendChild(logo);
          qrContainer.appendChild(logoOverlay);
        }

        img.style.display = "block";
        container.appendChild(qrContainer);
        addQRInstructions(container);
      };

      img.onerror = () => {
        console.error("API QR generation failed");
        container.innerHTML = '<p style="color: red; text-align: center;">Unable to generate QR code</p>';
      };

      qrContainer.appendChild(img);
      container.appendChild(qrContainer);
    } catch (error) {
      console.error("API error:", error);
      container.innerHTML = '<p style="color: red; text-align: center;">Error generating QR code</p>';
    }
  }

  function addQRInstructions(container) {
    const instruction = document.createElement("p");
    instruction.textContent = "Scan with your phone to chat";
    instruction.style.cssText = "margin: 10px 0 0 0; font-size: 12px; color: #666; text-align: center;";
    container.appendChild(instruction);
  }

  // Add styles
  const style = document.createElement("style");
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
        .wa-qr-code canvas {
            max-width: 100%;
            height: auto;
        }
        .wa-qr-container {
            position: relative;
            display: inline-block;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            background: white;
            padding: 10px;
        }
        .wa-qr-image {
            max-width: 200px;
            height: auto;
            border-radius: 10px;
            display: block;
        }
        .wa-qr-logo-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 50%;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .wa-qr-logo {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }
        .wa-qr-loading {
            text-align: center;
            padding: 20px;
        }
        .wa-qr-loading p {
            margin: 10px 0 0 0;
            font-size: 14px;
            color: #666;
        }
        .wa-spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #25D366;
            border-radius: 50%;
            animation: wa-spin 1s linear infinite;
        }
        @keyframes wa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);
})();
