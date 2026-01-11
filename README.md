# Kid Travel Experience Pack

A webapp that generates personalized, printable travel journals for kids ages 8-12. Transform family trips into lasting memories with destination-specific prompts, activities, and reflection spaces.

## Features

- **5-Step Form Wizard**: Easy trip setup with destination, child info, interests, and optional family photo
- **5 Pre-Built Destinations**: Tokyo/Kyoto, Paris, London, Orlando/Disney, Hawaii
- **Personalized Content**: Journal prompts tailored to child's interests and age
- **Print-Ready PDF**: Optimized for home printing with activities, daily pages, and reflection spaces
- **In-Flight Activities**: Word searches, travel bingo, trivia, and creative challenges

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js
- **PDF Generation**: PDFKit

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (frontend)
npm run dev

# Start backend server (in another terminal)
npm run server
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
kid-travel-experience-pack/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── CreateJournal.jsx
│   │   ├── Processing.jsx
│   │   └── Download.jsx
│   ├── data/
│   │   └── destinations.json  # Destination knowledge base
│   └── styles/
│       └── index.css     # Global styles
├── server/
│   ├── index.js          # Express server
│   └── services/
│       ├── journalGenerator.js  # Content generation
│       └── pdfGenerator.js      # PDF creation
└── public/
```

## Journal Structure

Each generated journal includes:

1. **Pre-Trip Section** (4-8 pages)
   - Personalized welcome letter
   - Destination facts and cultural tips
   - Useful phrases
   - Pre-trip reflection prompts

2. **In-Flight Activities** (6-10 pages)
   - Word search puzzle
   - Travel bingo
   - Trivia questions
   - Creative challenges

3. **Daily Journal Pages** (2 pages per day)
   - Location-specific prompts
   - Interest-aligned questions
   - Sketching space
   - Mood and weather trackers
   - New word section

4. **Trip Reflections** (2-4 pages)
   - Summary prompts
   - Favorite memories

## License

MIT
