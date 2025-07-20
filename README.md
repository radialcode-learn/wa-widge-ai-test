# WhatsApp Widget

A production-ready, customizable WhatsApp chat widget with QR code generation, licensing system, and security features.

## Features

- 🚀 **Easy Integration** - Single script tag implementation
- 💬 **WhatsApp Integration** - Direct chat and QR code generation
- 🎨 **Customizable** - Colors, positioning, branding, and messages
- 🔒 **Secure** - Domain validation, licensing, and anti-tampering
- 📱 **Responsive** - Works on all devices and screen sizes
- ⚡ **Lightweight** - Minified and optimized for performance

## Quick Start

### Installation

```bash
yarn install
```

### Development

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Serve built files
yarn serve
```

### Usage

```html
<script src="./build/wa-widget.min.js" 
    data-license-key="YOUR-LICENSE-KEY"
    data-whatsapp-number="+1234567890" 
    data-business-name="Your Business" 
    data-default-message="Hello! I'd like to chat!" 
    data-theme-color="#25D366"
    data-position="bottom-right" 
    data-welcome-message="Hi there! How can we help?"
    data-logo-url="https://your-domain.com/logo.png">
</script>
```

## Configuration Options

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-license-key` | String | **Required** - Your license key | - |
| `data-whatsapp-number` | String | **Required** - WhatsApp number in international format | - |
| `data-business-name` | String | Business name shown in popup header | "Business" |
| `data-default-message` | String | Pre-filled message when starting chat | "" |
| `data-theme-color` | String | Custom color for buttons (hex format) | "#25D366" |
| `data-position` | String | Widget position: bottom-right, bottom-left, top-right, top-left | "bottom-right" |
| `data-welcome-message` | String | Welcome message in popup | "Hi there! How can we help you today?" |
| `data-logo-url` | String | URL to logo for QR code branding | null |

## Build Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build production version (minified + obfuscated)
- `yarn build:dev` - Build development version (unminified)
- `yarn clean` - Clean build directories
- `yarn lint` - Run ESLint
- `yarn test` - Run tests

## Build Output

The build process creates:

- `build/wa-widget.js` - Development version
- `build/wa-widget.min.js` - Production version (minified + obfuscated)
- `build/demo.html` - Demo page
- `build/index.html` - Test page

## Security Features

- ✅ Domain validation
- ✅ License key verification
- ✅ Code obfuscation
- ✅ Anti-tampering measures
- ✅ Usage tracking
- ✅ Right-click protection

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers

## License

MIT License - see LICENSE file for details.

## Support

For support and licensing inquiries, contact: support@yourcompany.com