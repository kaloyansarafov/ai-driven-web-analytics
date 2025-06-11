# Accessibility Dashboard

A modern, user-friendly dashboard for analyzing web accessibility issues across multiple testing tools.

## Features

- **Multi-tool scanning**: Scan websites with WAVE, Pa11y, and Axe (coming soon)
- **Responsive design**: Works on desktop, tablet, and mobile devices
- **Dark mode support**: Automatically adapts to system preferences with manual toggle
- **Detailed reporting**: View comprehensive information about each accessibility issue
- **Filtering options**: Filter issues by type or source
- **Visual WAVE report**: Embedded visual report from WAVE
- **Accessible UI**: Built with accessibility in mind
- **Modern interface**: Clean, intuitive design for ease of use

## Getting Started

### Prerequisites

- Node.js 14.x or later
- NPM or Yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://your-repository-url/accessibility-dashboard.git
   cd accessibility-dashboard
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Visit `http://localhost:3000` in your browser

## Usage

1. Enter a URL to scan
2. (Optional) Enter your WAVE API key
3. Select the tools you want to use for scanning
4. Click "Run Scan" to begin the analysis
5. View results in the dashboard

## API Keys

- **WAVE API**: Get your API key from [WAVE API](https://wave.webaim.org/api/)
- **Other tools**: Additional API keys may be required for other scanning tools

## Keyboard Navigation

The dashboard is fully keyboard accessible:

- `Tab`: Navigate between elements
- `Enter` or `Space`: Activate buttons and toggle controls
- `Escape`: Close dialogs and tooltips

## Technical Details

- Built with Vue.js 3 and Nuxt.js 3
- Styling with Tailwind CSS
- Accessibility tested with multiple tools
- Dark mode implemented using Tailwind's dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
