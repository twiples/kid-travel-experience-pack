# Kid Travel Experience Pack - Product Requirements Document

## Product Overview

**Kid Travel Experience Pack** transforms family trips into lasting memories through personalized, printable travel journals for kids ages 8-12. The complete journey includes a printed journal for the trip, followed by digital memory products created from the completed journal.

### Vision Statement
Create an end-to-end travel memory experience that engages kids before, during, and after their trip—turning handwritten journal entries into shareable digital keepsakes.

### Target Audience
- **Primary**: Parents planning family trips with children ages 8-12
- **Secondary**: Grandparents, teachers organizing field trips, travel-focused families

---

## User Journey

**The Complete Journey**

| Step | Action | Output |
|------|--------|--------|
| 1. **Create & Print** 🗺️ | Complete 5-step form wizard | Download personalized PDF |
| 2. **Travel & Fill** ✈️ | Complete journal during trip | Handwritten memories |
| 3. **Upload & Share** 📸 | Scan QR code, upload photos | Digital memory products |

---

## Core Features

### 1. Journal Creation (Pre-Trip)

#### 1.1 Form Wizard
A 5-step guided form to collect trip and child information:

| Step | Field | Description |
|------|-------|-------------|
| 1 | Destination | Select from curated destinations or enter custom location |
| 2 | Trip Dates | Start and end dates (calculates trip length) |
| 3 | Child Info | Name and age (8-12 years) |
| 4 | Interests | Select 2-3 interests to personalize prompts |
| 5 | Review | Confirm details before generation |

#### 1.2 Supported Destinations
Curated destinations with full knowledge bases:

| Destination | Country | Highlights |
|-------------|---------|------------|
| Osaka | Japan | Street food, Osaka Castle, Dotonbori |
| Lyon | France | Traboules, gastronomy, Lumière history |
| Moorea | French Polynesia | Coral reefs, stingrays, volcanic landscapes |
| Bangkok | Thailand | Temples, floating markets, street food |
| Verona | Italy | Romeo & Juliet, Roman arena, gelato |
| Tokyo | Japan | Temples, technology, sushi |
| Paris | France | Eiffel Tower, Louvre, cafés |
| London | UK | Royal history, Big Ben, museums |
| Orlando | USA | Theme parks, Disney, Universal |
| Hawaii | USA | Beaches, volcanoes, Hawaiian culture |

*Custom destinations are also supported with generic prompts.*

#### 1.3 Interest Categories
Journals are personalized based on child interests:
- Food & Cuisine
- Animals & Nature
- Art & Creativity
- History & Culture
- Science & Technology
- Sports & Activities
- Music & Performance
- Transportation

---

### 2. PDF Journal Generation

#### 2.1 Journal Structure
Each generated PDF includes:

| Section | Pages | Content |
|---------|-------|---------|
| Cover | 1 | Personalized with child's name and destination |
| Pre-Trip Prep | 4-6 | Maps, fun facts, cultural tips, useful phrases |
| Travel Activities | 6-8 | Word search, travel bingo, trivia, creative challenges |
| Daily Journal | 2 per day | Prompts, sketching space, mood trackers, reflections |
| Trip Reflections | 2-4 | Summary prompts, favorite memories, what I learned |
| Closing | 1 | QR code for post-trip upload |

**Total**: 20-40+ pages depending on trip length

#### 2.2 Personalization Features
- **Age-appropriate language**: Prompts adjusted for 8-12 reading levels
- **Interest-aligned prompts**: Questions tailored to selected interests
- **Destination-specific content**: Local facts, foods, landmarks, vocabulary
- **Daily variety**: No repeated prompts across trip days

#### 2.3 QR Code Integration
Each PDF includes a unique QR code:
- **Location**: Cover page (bottom right) and closing page (center)
- **Purpose**: Links to `/memories/{journalId}` for easy post-trip upload
- **Contains**: Encoded journal ID for automatic identification

#### 2.4 Print Optimization
- **Paper size**: US Letter (8.5" x 11")
- **Margins**: Generous margins for binding
- **Graphics**: Optimized for home printing (minimal ink usage options)
- **Layout**: Two-sided printing compatible

---

### 3. Post-Trip Memory Capture

#### 3.1 Photo Upload Flow

| Step | Action | Details |
|------|--------|---------|
| 1. Scan QR Code | Auto-fill journal ID | QR on PDF links directly to upload page |
| 2. Upload Photos | Drag & drop | Up to 50 photos of completed pages |
| 3. Tag Pages | Categorize by type | Cover, Daily Entry, Activity, Reflection |
| 4. Generate | AI processing | Creates all memory products |

#### 3.2 Upload Interface
- **Entry methods**: QR code scan or manual journal ID entry
- **Upload**: Drag-and-drop or click-to-select (up to 50 photos)
- **Preview**: Grid view with thumbnails
- **Tagging**: Categorize pages as Cover, Daily Entry, Activity, or Reflection
- **Processing**: Visual progress indicator during generation

#### 3.3 Memory Products Generated

| Product | Format | Description |
|---------|--------|-------------|
| **Memory Video** | MP4 (720p/1080p) | 30-60 second animated video with Ken Burns effect, music, and text overlays |
| **Holiday Cards** | PNG/PDF | 3-4 template designs for sharing with family and friends |
| **School Slides** | PDF/PPTX | 8-12 slide presentation for show-and-tell |
| **Social Clips** | MP4 (9:16) | 15-30 second vertical videos for Instagram/TikTok |

---

### 4. Landing Page

#### 4.1 Page Structure

| Section | Purpose |
|---------|---------|
| Hero | Value proposition with CTA to create journal |
| Features | 4 keepsakes: Printed Journal, Memory Video, Holiday Cards, School Slides |
| How It Works | 4-step animated timeline: Create → Travel → Upload → Share |
| The Complete Package | Side-by-side comparison of printed journal contents and digital outputs |
| Sample Destinations | Preview of 5 curated destinations with downloadable sample PDFs |
| CTA Footer | Dual buttons for creating journal or uploading memories |

#### 4.2 Visual Design
- **Brand Colors**: Cerulean (#00afd8), Raven (#7b858e)
- **Animations**: Floating decorations, scroll-triggered reveals, animated timeline
- **Illustrations**: Destination-specific icons, tropical decorations, travel motifs

---

## Technical Architecture

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM
- **Styling**: CSS modules with CSS variables
- **State**: React hooks (useState, useEffect, useRef)

### Backend
- **Server**: Express.js
- **PDF Generation**: PDFKit
- **QR Codes**: qrcode npm package
- **File Handling**: Multer for uploads

### Data Storage
- **Destinations**: JSON knowledge base (`/src/data/destinations.json`)
- **Samples**: Pre-generated PDFs (`/public/samples/`)
- **Uploads**: Local file storage (production: cloud storage)

---

## API Endpoints

### Journal Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate-journal | Generate PDF from form data |
| GET | /api/journals/:id | Retrieve journal metadata |
| GET | /api/journals/:id/pdf | Download generated PDF |

### Memory Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/memories/:id/upload | Upload journal photos |
| GET | /api/memories/:id/status | Check processing status |
| POST | /api/memories/:id/generate | Trigger memory generation |
| GET | /api/memories/:id/products | Get generated products |
| GET | /api/memories/:id/download/:type | Download specific product |

### Samples

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /samples/:filename | Download sample PDF |

---

## File Structure

| Folder | File | Purpose |
|--------|------|---------|
| **src/components/** | BackpackIcon.jsx | Logo component |
| | TropicalDecorations.jsx | Decorative icons |
| **src/pages/** | LandingPage.jsx/.css | Marketing homepage |
| | CreateJournal.jsx/.css | Form wizard |
| | Processing.jsx/.css | Generation progress |
| | Download.jsx/.css | PDF download page |
| | Memories.jsx/.css | Photo upload & gallery |
| **src/data/** | destinations.json | Destination knowledge base |
| | samples.json | Sample PDF metadata |
| **server/** | index.js | Express server |
| **server/services/** | journalGenerator.js | Content generation |
| | pdfGenerator.js | PDF creation |
| **server/scripts/** | generateSamples.js | Sample PDF generator |
| **public/samples/** | *.pdf | Pre-generated sample PDFs |
| **docs/** | PRD.md | Product requirements |
| | POST_TRIP_FEATURE.md | Memory feature details |

---

## Sample PDFs

Pre-generated samples for landing page:

| Sample | Child | Age | Interests | Days |
|--------|-------|-----|-----------|------|
| Osaka | Emma | 8 | Food, Culture | 7 |
| Lyon | Lucas | 10 | Art, Food | 5 |
| Moorea | Oliver | 11 | Nature, Animals | 6 |
| Bangkok | Mia | 9 | Food, Culture | 5 |
| Verona | Sophia | 9 | History, Art | 8 |

---

## Privacy & Compliance

### Data Handling
- All uploads private by default
- Optional public sharing with unique links
- Auto-delete after 90 days (configurable)
- No facial recognition or AI content analysis

### COPPA Compliance
- Parental consent for children's content
- Minimal data collection
- No third-party tracking of children
- Clear data deletion process

---

## Future Roadmap

### Phase 2 Enhancements
- [ ] AI-powered text extraction from journal pages
- [ ] Automatic highlight detection
- [ ] More destination knowledge bases
- [ ] Multi-language support

### Phase 3 Features
- [ ] Photo book ordering integration
- [ ] Family sharing/collaboration
- [ ] Annual memory compilations
- [ ] Mobile app for on-trip journaling

### Phase 4 Expansion
- [ ] Classroom/group trip support
- [ ] Travel agency partnerships
- [ ] Custom branded journals
- [ ] Subscription model for frequent travelers

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Journal completion rate | 70%+ of downloaded journals get memories uploaded |
| Memory product downloads | 3+ products per completed journal |
| User satisfaction | 4.5+ star rating |
| Return usage | 40%+ of users create journals for subsequent trips |

---

## Development Commands

| Command | Description |
|---------|-------------|
| npm install | Install dependencies |
| npm run dev | Start frontend dev server |
| npm run server | Start backend server |
| node server/scripts/generateSamples.js | Generate sample PDFs |
| npm run build | Production build |

---

*Last Updated: January 2025*
