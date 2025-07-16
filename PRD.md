# WhatsApp Widget PRD

## 1. Overview
Embed a floating WhatsApp "Chat with us" widget on any website using a single `<script>` tag. The widget provides a popup with a welcome message, Start Chat button, and QR code functionality.

---

## 2. User Flow
1. User visits a website with the script embedded.
2. Floating “Chat with us” button appears (customizable position).
3. Clicking the button toggles a popup (slide animation):
    - Shows business name (header)
    - Welcome message
    - **Start Chat** button (opens WhatsApp with prefilled message)
    - **Scan QR** button (shows QR code for WhatsApp link inline)
4. Clicking Start Chat opens WhatsApp in a new tab.
5. Clicking Scan QR reveals QR code inline in the popup.
6. Clicking the main button again closes the popup.

---

## 3. Widget UI Breakdown
- **Floating Button**
  - WhatsApp icon + "Chat with us"
  - Fixed position (default: bottom-right, customizable)
  - On click: toggles popup visibility (with animation)
- **Popup Box (Slide-Up)**
  - Header: Business Name
  - Chat bubble-style welcome message
  - Buttons:
    - ✅ Start Chat
    - 📱 Scan QR
  - QR Code (only visible when Scan QR is clicked, inline)

---

## 4. Customization via Script Attributes
The script accepts the following `data-*` attributes:

| Attribute               | Type   | Description                                 |
|------------------------ |--------|---------------------------------------------|
| data-whatsapp-number    | String | WhatsApp number in international format     |
| data-business-name      | String | Custom name shown in header                 |
| data-default-message    | String | Prefilled WhatsApp message text             |
| data-theme-color        | String | Optional HEX color for buttons (default: #25D366) |
| data-position           | String | bottom-right, bottom-left, top-right, etc.  |
| data-welcome-message    | String | Custom message shown in popup               |

**Example installation:**
```html
<script src="https://cdn.example.com/wa-widget.js"
        data-whatsapp-number="+1234567890"
        data-business-name="My Business"
        data-default-message="Hi, I’d like to chat!"
        data-theme-color="#25D366"
        data-position="bottom-right"
        data-welcome-message="Hi there! How can we help you today?">
</script>
```

---

## 5. Functional Requirements
| ID   | Requirement                                                        |
|------|--------------------------------------------------------------------|
| FR1  | Widget loads on every page it’s embedded into                      |
| FR2  | Floating button always visible on scroll                           |
| FR3  | Clicking floating button toggles popup visibility with animation   |
| FR4  | Popup shows business name and welcome message                      |
| FR5  | Start Chat button opens WhatsApp link in new tab                   |
| FR6  | QR Code button toggles inline QR code rendering                    |
| FR7  | All text, colors, and number can be customized via data-* attributes |

---

## 6. Non-Functional Requirements
| ID    | Requirement                                                      |
|-------|------------------------------------------------------------------|
| NFR1  | Script size under 50KB gzipped                                  |
| NFR2  | Must not block page load (async/deferred execution)              |
| NFR3  | Scoped CSS to avoid leaking into or from the host website        |
| NFR4  | Cross-device responsive layout (adapts size/fonts)               |
| NFR5  | Supports latest versions of Chrome, Safari, Firefox, Edge, mobile|
| NFR6  | GDPR compliant – no tracking, cookies, or user data collection   |

---

## 7. QR Code Support
- Use a lightweight QR generation library (e.g., qrcodejs)
- Dynamically generate QR on demand (lazy load or on button click)
- QR Code renders inline inside popup (below the two buttons)

---

## 8. Animations
| Element      | Animation                                 |
|--------------|-------------------------------------------|
| Popup open   | Slide-up from bottom (CSS transition)     |
| Popup close  | Slide-down (reverse of above)             |
| QR code      | Fade-in (optional, fast transition)       |

---

## 9. Tech Stack
- **Language:** Vanilla JavaScript (ES6+)
- **Style:** Inline CSS or `<style>` tag injected by the script
- **QR Code:** External dependency (bundled/minified in script)
- **Deployment:** Single JS file (hosted on CDN)

---

## 10. Development Phases & Steps
1. **Floating Button**: Build floating button with configurable position and WhatsApp branding.
2. **Popup UI & Animation**: Create popup markup and slide-in/out behavior.
3. **Attribute Parsing**: Read and parse all `data-*` attributes from the script tag.
4. **WhatsApp Link**: Generate WhatsApp link with number and prefilled message.
5. **QR Code Integration**: Integrate lightweight QR code library and render inline in popup.
6. **Styling**: Apply scoped, mobile-responsive styles and support theme color customization.
7. **Bundling & Optimization**: Bundle/minify script for CDN deployment; ensure script size <50KB gzipped.
8. **Deployment Pipeline (Optional)**: Set up CDN deployment pipeline.