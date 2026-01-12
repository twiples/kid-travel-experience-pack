# Kid Travel Experience Pack

A webapp that transforms family trips into lasting memories. Generate personalized, printable travel journals for kids ages 8-12, then turn completed journals into shareable digital keepsakes.

## The Complete Journey

```
CREATE & PRINT  ──▶  TRAVEL & FILL  ──▶  UPLOAD & SHARE
     🗺️                   ✈️                  📸
 Personalize          Complete the         Scan QR code
 your journal         journal on           and upload
 and print            your trip            photos
     │                                          │
     ▼                                          ▼
    📄                                         🎬
 Download                                   Memory
   PDF                                     Products
```

## Features

### Pre-Trip: Printed Journal
- **5-Step Form Wizard**: Easy trip setup with destination, child info, and interests
- **10 Curated Destinations**: Osaka, Lyon, Moorea, Bangkok, Verona, Tokyo, Paris, London, Orlando, Hawaii
- **Personalized Content**: Prompts tailored to child's age and interests
- **Print-Ready PDF**: Activities, daily pages, and reflection spaces

### Post-Trip: Digital Memories
- **QR Code Integration**: Each PDF includes a unique QR code for easy identification
- **Photo Upload**: Upload photos of completed journal pages
- **Memory Products**:
  - Animated summary video
  - Holiday cards for sharing
  - School presentation slides
  - Social media clips

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js
- **PDF Generation**: PDFKit
- **QR Codes**: qrcode

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start backend server (separate terminal)
npm run server
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3001`

### Generate Sample PDFs

```bash
node server/scripts/generateSamples.js
```

## Project Structure

```
kid-travel-experience-pack/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── LandingPage.jsx
│   │   ├── CreateJournal.jsx
│   │   ├── Processing.jsx
│   │   ├── Download.jsx
│   │   └── Memories.jsx
│   └── data/
│       ├── destinations.json
│       └── samples.json
├── server/
│   ├── index.js
│   ├── services/
│   │   ├── journalGenerator.js
│   │   └── pdfGenerator.js
│   └── scripts/
│       └── generateSamples.js
├── public/samples/     # Pre-generated sample PDFs
└── docs/
    ├── PRD.md          # Full product requirements
    └── POST_TRIP_FEATURE.md
```

## Documentation

- [Product Requirements Document](docs/PRD.md) - Full feature specifications
- [Post-Trip Feature](docs/POST_TRIP_FEATURE.md) - Memory capture details

## License

MIT
