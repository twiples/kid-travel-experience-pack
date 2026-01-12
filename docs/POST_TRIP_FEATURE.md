# Post-Trip Memory Capture Feature

## Overview

This feature closes the loop on the travel journal experience by allowing families to upload photos of their completed journals after the trip. The system then generates various memory products including animated videos, holiday cards, and presentation slides.

## User Journey

```
Pre-Trip                    During Trip                 Post-Trip
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│ Create      │            │ Print &     │            │ Upload      │
│ Journal     │───────────▶│ Complete    │───────────▶│ Journal     │
│ (PDF + QR)  │            │ Journal     │            │ Photos      │
└─────────────┘            └─────────────┘            └─────────────┘
                                                              │
                                                              ▼
                           ┌──────────────────────────────────────────┐
                           │         Memory Products                   │
                           ├──────────────────────────────────────────┤
                           │ • Animated Summary Video                  │
                           │ • Holiday Cards (digital & printable)    │
                           │ • School Presentation Slides             │
                           │ • Short Social Media Clips               │
                           └──────────────────────────────────────────┘
```

## Feature Components

### 1. QR Code in PDF Journals

Each generated PDF includes a unique QR code that:
- Links to the upload page with pre-filled journal ID
- Appears on the first page (inside cover) and last page
- Contains encoded journal metadata (ID, destination, child name)

**Technical Implementation:**
- Use `qrcode` npm package for QR generation
- Embed QR as image in PDFKit
- Store journal metadata in database/file for lookup

### 2. Journal Upload Page (`/memories/:journalId`)

**UI Components:**
- Journal identification (auto-filled from QR or manual entry)
- Multi-photo uploader (drag & drop + click)
- Photo preview grid with reordering
- Page type tagging (cover, daily entry, activity, reflection)
- Submit button with processing indicator

**Upload Flow:**
1. User scans QR code → lands on upload page with journal ID
2. User uploads photos of completed journal pages
3. System processes and organizes photos
4. User reviews and confirms
5. System generates memory products

### 3. Memory Products Generation

#### A. Animated Summary Video (30-60 seconds)
- Ken Burns effect on journal photos
- Gentle background music
- Text overlays with destination and child's name
- Transition effects between pages
- Export as MP4 (720p/1080p)

#### B. Holiday Cards
- 3-4 template designs
- Best photos auto-selected or user-chosen
- Customizable text/greetings
- Export as PNG/PDF (print-ready)
- Digital shareable version

#### C. School Presentation Slides
- 8-12 slide deck
- Title slide with trip summary
- Key pages from journal
- "What I Learned" slide
- Export as PDF/PowerPoint-compatible

#### D. Short Social Clips (15-30 seconds)
- Instagram/TikTok format (9:16)
- Quick montage of highlights
- Animated text overlays
- Export as MP4

### 4. Memory Gallery Page (`/memories/:journalId/gallery`)

- Preview all generated products
- Download buttons for each format
- Share links (if public sharing enabled)
- Regenerate options

## Database Schema

```javascript
// Journal tracking (extends existing)
{
  journalId: "uuid",
  qrCode: "encoded-string",
  destination: "Tokyo",
  childName: "Emma",
  childAge: 8,
  createdAt: "2024-01-15",
  tripDates: { start: "2024-02-01", end: "2024-02-07" },
  status: "created" | "downloaded" | "completed" | "memories_generated"
}

// Uploaded pages
{
  journalId: "uuid",
  pages: [
    {
      pageId: "uuid",
      imageUrl: "/uploads/...",
      pageType: "cover" | "daily" | "activity" | "reflection",
      pageNumber: 1,
      uploadedAt: "2024-02-10"
    }
  ]
}

// Generated memories
{
  journalId: "uuid",
  memories: {
    video: { url: "...", generatedAt: "..." },
    holidayCards: [{ templateId: 1, url: "..." }],
    slides: { url: "..." },
    socialClips: [{ format: "instagram", url: "..." }]
  }
}
```

## API Endpoints

```
POST   /api/memories/:journalId/upload     - Upload journal photos
GET    /api/memories/:journalId/status     - Check processing status
POST   /api/memories/:journalId/generate   - Trigger memory generation
GET    /api/memories/:journalId/products   - Get generated products
GET    /api/memories/:journalId/download/:type - Download specific product
```

## Technical Stack Additions

- `qrcode` - QR code generation for PDFs
- `sharp` - Image processing and optimization
- `fluent-ffmpeg` - Video generation (or cloud service)
- `pptxgenjs` - PowerPoint/slides generation
- Cloud storage for uploaded images and generated files

## Landing Page Updates

Add new section: "Complete Your Journey"
- Explains the post-trip process
- Shows sample memory products
- CTA to scan QR or enter journal ID

## Privacy Considerations

- All uploads are private by default
- Optional public sharing with unique links
- Auto-delete after 90 days (configurable)
- No facial recognition or AI analysis of content
- COPPA compliance for children's content

## Future Enhancements

- AI-powered text extraction from journal pages
- Automatic highlight detection
- Photo book ordering integration
- Family sharing/collaboration features
- Annual memory compilations
