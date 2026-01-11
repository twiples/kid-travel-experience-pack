import PDFDocument from 'pdfkit';
import fs from 'fs';

// Enhanced color palette - more vibrant and kid-friendly
const COLORS = {
  primary: '#2E86AB',      // Deep sky blue
  primaryLight: '#A8DADC', // Light teal
  secondary: '#F77F00',    // Vibrant orange
  secondaryLight: '#FCBF49', // Golden yellow
  accent: '#7B2CBF',       // Purple
  accentLight: '#C77DFF',  // Light purple
  success: '#06D6A0',      // Mint green
  coral: '#EF476F',        // Coral pink
  text: '#1D3557',         // Dark blue-gray
  textLight: '#457B9D',    // Medium blue
  border: '#A8DADC',
  background: '#FFF9F0',   // Warm white
  white: '#FFFFFF',
  cream: '#FFFCF2',
};

const FONTS = {
  title: 'Helvetica-Bold',
  body: 'Helvetica',
  italic: 'Helvetica-Oblique',
};

// Half-letter size for 2-up printing (5.5" x 8.5")
const PAGE_WIDTH = 396;
const PAGE_HEIGHT = 612;
const MARGIN = 36;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// ============================================
// DESIGN HELPER FUNCTIONS
// ============================================

// Draw a decorative page border with corner flourishes
function drawPageBorder(doc, style = 'double') {
  const inset = 12;

  if (style === 'double') {
    // Outer border
    doc.strokeColor(COLORS.primaryLight).lineWidth(2)
      .rect(inset, inset, PAGE_WIDTH - inset * 2, PAGE_HEIGHT - inset * 2).stroke();
    // Inner border
    doc.strokeColor(COLORS.primary).lineWidth(1)
      .rect(inset + 4, inset + 4, PAGE_WIDTH - inset * 2 - 8, PAGE_HEIGHT - inset * 2 - 8).stroke();
  } else if (style === 'dashed') {
    doc.strokeColor(COLORS.primary).lineWidth(1.5)
      .dash(5, { space: 3 })
      .rect(inset, inset, PAGE_WIDTH - inset * 2, PAGE_HEIGHT - inset * 2).stroke()
      .undash();
  } else if (style === 'dotted') {
    doc.strokeColor(COLORS.secondary).lineWidth(2)
      .dash(1, { space: 4 })
      .rect(inset, inset, PAGE_WIDTH - inset * 2, PAGE_HEIGHT - inset * 2).stroke()
      .undash();
  }

  // Corner decorations
  drawCornerDecoration(doc, inset + 2, inset + 2, 'tl');
  drawCornerDecoration(doc, PAGE_WIDTH - inset - 2, inset + 2, 'tr');
  drawCornerDecoration(doc, inset + 2, PAGE_HEIGHT - inset - 2, 'bl');
  drawCornerDecoration(doc, PAGE_WIDTH - inset - 2, PAGE_HEIGHT - inset - 2, 'br');
}

// Draw corner decoration
function drawCornerDecoration(doc, x, y, corner) {
  const size = 8;
  doc.fillColor(COLORS.secondary);

  // Small star/diamond shape
  doc.save();
  doc.translate(x, y);

  if (corner === 'tr' || corner === 'bl') {
    doc.rotate(45);
  }

  // Draw a small diamond
  doc.moveTo(0, -size/2)
    .lineTo(size/2, 0)
    .lineTo(0, size/2)
    .lineTo(-size/2, 0)
    .closePath()
    .fill();

  doc.restore();
}

// Draw a banner/ribbon style header
function drawBanner(doc, text, y, options = {}) {
  const {
    color = COLORS.primary,
    textColor = COLORS.white,
    fontSize = 14,
    width = CONTENT_WIDTH - 20,
  } = options;

  const x = MARGIN + 10;
  const height = fontSize + 16;
  const ribbonTail = 12;

  // Main banner body
  doc.fillColor(color);
  doc.moveTo(x, y)
    .lineTo(x + width, y)
    .lineTo(x + width + ribbonTail, y + height/2)
    .lineTo(x + width, y + height)
    .lineTo(x, y + height)
    .lineTo(x - ribbonTail, y + height/2)
    .closePath()
    .fill();

  // Banner shadow/fold effect
  doc.fillColor(shadeColor(color, -30));
  doc.moveTo(x - ribbonTail, y + height/2)
    .lineTo(x, y + height)
    .lineTo(x, y + height + 4)
    .lineTo(x - ribbonTail - 2, y + height/2 + 2)
    .closePath()
    .fill();

  doc.moveTo(x + width + ribbonTail, y + height/2)
    .lineTo(x + width, y + height)
    .lineTo(x + width, y + height + 4)
    .lineTo(x + width + ribbonTail + 2, y + height/2 + 2)
    .closePath()
    .fill();

  // Text
  doc.fillColor(textColor).font(FONTS.title).fontSize(fontSize)
    .text(text, x, y + 8, { width: width, align: 'center' });

  return y + height + 8;
}

// Draw a section header with underline decoration
function drawSectionHeader(doc, text, y, options = {}) {
  const { color = COLORS.primary, fontSize = 12 } = options;

  doc.fillColor(color).font(FONTS.title).fontSize(fontSize)
    .text(text, MARGIN, y);

  const textWidth = doc.widthOfString(text);
  const underlineY = y + fontSize + 2;

  // Decorative underline with dots
  doc.strokeColor(color).lineWidth(2)
    .moveTo(MARGIN, underlineY)
    .lineTo(MARGIN + textWidth + 20, underlineY)
    .stroke();

  // End dot
  doc.fillColor(COLORS.secondary)
    .circle(MARGIN + textWidth + 25, underlineY, 3)
    .fill();

  return underlineY + 10;
}

// Draw a styled box with optional rounded corners
function drawStyledBox(doc, x, y, width, height, options = {}) {
  const {
    fillColor = COLORS.cream,
    strokeColor = COLORS.border,
    radius = 8,
    shadow = false,
    dashed = false,
  } = options;

  // Shadow effect
  if (shadow) {
    doc.fillColor('#E0E0E0')
      .roundedRect(x + 2, y + 2, width, height, radius)
      .fill();
  }

  // Main box
  doc.fillColor(fillColor)
    .roundedRect(x, y, width, height, radius)
    .fill();

  // Border
  if (dashed) {
    doc.strokeColor(strokeColor).lineWidth(1)
      .dash(4, { space: 2 })
      .roundedRect(x, y, width, height, radius)
      .stroke()
      .undash();
  } else {
    doc.strokeColor(strokeColor).lineWidth(1.5)
      .roundedRect(x, y, width, height, radius)
      .stroke();
  }
}

// Draw a checkbox with style
function drawCheckbox(doc, x, y, size = 10, options = {}) {
  const { color = COLORS.primary, style = 'square' } = options;

  if (style === 'circle') {
    doc.strokeColor(color).lineWidth(1.5)
      .circle(x + size/2, y + size/2, size/2)
      .stroke();
  } else {
    doc.strokeColor(color).lineWidth(1.5)
      .roundedRect(x, y, size, size, 2)
      .stroke();
  }
}

// Draw a dashed writing line
function drawWritingLine(doc, x, y, width, options = {}) {
  const { color = COLORS.border, style = 'dashed' } = options;

  doc.strokeColor(color).lineWidth(0.5);

  if (style === 'dashed') {
    doc.dash(8, { space: 3 })
      .moveTo(x, y).lineTo(x + width, y)
      .stroke()
      .undash();
  } else if (style === 'dotted') {
    doc.dash(1, { space: 3 })
      .moveTo(x, y).lineTo(x + width, y)
      .stroke()
      .undash();
  } else {
    doc.moveTo(x, y).lineTo(x + width, y).stroke();
  }
}

// Draw decorative divider
function drawDivider(doc, y, options = {}) {
  const { style = 'dots', color = COLORS.secondary } = options;
  const centerX = PAGE_WIDTH / 2;

  if (style === 'dots') {
    doc.fillColor(color);
    for (let i = -2; i <= 2; i++) {
      const size = i === 0 ? 4 : 2;
      doc.circle(centerX + i * 12, y, size).fill();
    }
  } else if (style === 'stars') {
    doc.fillColor(color);
    drawStar(doc, centerX - 30, y, 5, 5, 2.5);
    drawStar(doc, centerX, y, 8, 5, 4);
    drawStar(doc, centerX + 30, y, 5, 5, 2.5);
  } else if (style === 'line') {
    doc.strokeColor(color).lineWidth(1)
      .moveTo(MARGIN + 50, y)
      .lineTo(PAGE_WIDTH - MARGIN - 50, y)
      .stroke();
    doc.fillColor(color)
      .circle(MARGIN + 45, y, 3).fill()
      .circle(PAGE_WIDTH - MARGIN - 45, y, 3).fill();
  }
}

// Draw a star shape
function drawStar(doc, cx, cy, outerR, points, innerR) {
  const step = Math.PI / points;
  doc.moveTo(cx, cy - outerR);

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    doc.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  doc.closePath().fill();
}

// Draw a simple airplane icon
function drawAirplane(doc, x, y, size = 20, color = COLORS.primary) {
  doc.fillColor(color);
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  // Simple airplane shape
  doc.moveTo(0, -8)
    .lineTo(3, -2)
    .lineTo(10, 0)
    .lineTo(3, 2)
    .lineTo(2, 8)
    .lineTo(0, 4)
    .lineTo(-2, 8)
    .lineTo(-3, 2)
    .lineTo(-10, 0)
    .lineTo(-3, -2)
    .closePath()
    .fill();

  doc.restore();
}

// Draw a simple suitcase icon
function drawSuitcase(doc, x, y, size = 16, color = COLORS.secondary) {
  doc.strokeColor(color).lineWidth(1.5);
  doc.fillColor(color);

  const w = size;
  const h = size * 0.75;

  // Main body
  doc.roundedRect(x - w/2, y - h/2 + 2, w, h, 2).stroke();

  // Handle
  doc.moveTo(x - w/4, y - h/2 + 2)
    .lineTo(x - w/4, y - h/2 - 2)
    .lineTo(x + w/4, y - h/2 - 2)
    .lineTo(x + w/4, y - h/2 + 2)
    .stroke();

  // Stripes
  doc.moveTo(x - w/2, y).lineTo(x + w/2, y).stroke();
}

// Draw a compass icon
function drawCompass(doc, x, y, size = 20, color = COLORS.accent) {
  doc.strokeColor(color).lineWidth(1.5);

  // Outer circle
  doc.circle(x, y, size/2).stroke();

  // Inner cross
  doc.moveTo(x, y - size/2 + 3).lineTo(x, y + size/2 - 3).stroke();
  doc.moveTo(x - size/2 + 3, y).lineTo(x + size/2 - 3, y).stroke();

  // N marker
  doc.fillColor(COLORS.coral)
    .moveTo(x, y - size/2 + 2)
    .lineTo(x - 3, y - 3)
    .lineTo(x + 3, y - 3)
    .closePath()
    .fill();
}

// Draw a stamp/badge
function drawBadge(doc, x, y, text, options = {}) {
  const { color = COLORS.coral, size = 40 } = options;

  // Outer circle with scalloped edge
  doc.fillColor(color);
  const points = 12;
  const outerR = size / 2;
  const innerR = size / 2 - 4;

  doc.save();
  doc.translate(x, y);

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) doc.moveTo(px, py);
    else doc.lineTo(px, py);
  }
  doc.closePath().fill();

  // Inner circle
  doc.fillColor(COLORS.white)
    .circle(0, 0, innerR - 4)
    .fill();

  // Text
  doc.fillColor(color).font(FONTS.title).fontSize(size / 5)
    .text(text, -size/2, -size/8, { width: size, align: 'center' });

  doc.restore();
}

// Utility: darken/lighten a color
function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

// ============================================
// MAIN PDF GENERATION
// ============================================

export async function generatePDF(content, journalData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [PAGE_WIDTH, PAGE_HEIGHT],
        margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        info: {
          Title: `${content.childName}'s Travel Journal - ${content.destination}`,
          Author: 'KidsTravel Journal Generator',
        },
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Generate each section
      generateCoverPage(doc, content);
      generateWelcomePage(doc, content);
      generateAboutMyTripPage(doc, content);
      generateDestinationFactsPages(doc, content);
      generateActivitiesSection(doc, content);
      generateRoadTripGamesSection(doc, content);
      generateDailyPages(doc, content);
      generateClosingPage(doc, content);

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

// ============================================
// PAGE GENERATORS
// ============================================

function generateCoverPage(doc, content) {
  // Gradient-like background with layered colors
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.primary);

  // Decorative wave pattern at bottom
  doc.fillColor(shadeColor(COLORS.primary, -20));
  doc.moveTo(0, PAGE_HEIGHT - 100)
    .bezierCurveTo(PAGE_WIDTH * 0.3, PAGE_HEIGHT - 150, PAGE_WIDTH * 0.7, PAGE_HEIGHT - 50, PAGE_WIDTH, PAGE_HEIGHT - 100)
    .lineTo(PAGE_WIDTH, PAGE_HEIGHT)
    .lineTo(0, PAGE_HEIGHT)
    .closePath()
    .fill();

  doc.fillColor(shadeColor(COLORS.primary, -35));
  doc.moveTo(0, PAGE_HEIGHT - 60)
    .bezierCurveTo(PAGE_WIDTH * 0.4, PAGE_HEIGHT - 100, PAGE_WIDTH * 0.6, PAGE_HEIGHT - 20, PAGE_WIDTH, PAGE_HEIGHT - 60)
    .lineTo(PAGE_WIDTH, PAGE_HEIGHT)
    .lineTo(0, PAGE_HEIGHT)
    .closePath()
    .fill();

  // Decorative elements - scattered shapes
  doc.fillColor('rgba(255,255,255,0.1)');
  drawStar(doc, 50, 80, 15, 5, 7);
  drawStar(doc, PAGE_WIDTH - 60, 120, 12, 5, 5);
  drawStar(doc, 80, PAGE_HEIGHT - 180, 10, 5, 4);
  drawStar(doc, PAGE_WIDTH - 40, PAGE_HEIGHT - 220, 18, 5, 8);

  // Airplane decorations
  doc.fillColor('rgba(255,255,255,0.15)');
  drawAirplane(doc, PAGE_WIDTH - 80, 70, 30, 'rgba(255,255,255,0.2)');
  drawAirplane(doc, 60, PAGE_HEIGHT - 150, 25, 'rgba(255,255,255,0.15)');

  // Main content frame
  const frameX = 30;
  const frameY = 120;
  const frameW = PAGE_WIDTH - 60;
  const frameH = 280;

  // Frame background
  doc.fillColor('rgba(255,255,255,0.95)')
    .roundedRect(frameX, frameY, frameW, frameH, 15)
    .fill();

  // Frame border
  doc.strokeColor(COLORS.secondaryLight).lineWidth(3)
    .roundedRect(frameX, frameY, frameW, frameH, 15)
    .stroke();

  // Inner decorative border
  doc.strokeColor(COLORS.secondary).lineWidth(1)
    .dash(5, { space: 3 })
    .roundedRect(frameX + 8, frameY + 8, frameW - 16, frameH - 16, 10)
    .stroke()
    .undash();

  // Title content
  doc.fillColor(COLORS.text)
    .font(FONTS.title)
    .fontSize(16)
    .text(`${content.childName}'s`, frameX, frameY + 35, { align: 'center', width: frameW });

  doc.fillColor(COLORS.primary)
    .fontSize(28)
    .text('Travel Journal', frameX, frameY + 60, { align: 'center', width: frameW });

  // Decorative line
  const lineY = frameY + 105;
  doc.strokeColor(COLORS.secondary).lineWidth(2)
    .moveTo(frameX + 60, lineY)
    .lineTo(frameX + frameW - 60, lineY)
    .stroke();
  drawStar(doc, frameX + 50, lineY, 6, 5, 3);
  drawStar(doc, frameX + frameW - 50, lineY, 6, 5, 3);
  doc.fillColor(COLORS.secondary);

  // Destination
  doc.fillColor(COLORS.secondary)
    .font(FONTS.title)
    .fontSize(22)
    .text(content.destination, frameX, frameY + 125, { align: 'center', width: frameW });

  if (content.country) {
    doc.fillColor(COLORS.textLight)
      .font(FONTS.body)
      .fontSize(12)
      .text(content.country, frameX, frameY + 155, { align: 'center', width: frameW });
  }

  // Compass decoration
  drawCompass(doc, PAGE_WIDTH / 2, frameY + 210, 35, COLORS.primary);

  // Dates in a nice badge
  doc.fillColor(COLORS.cream)
    .roundedRect(frameX + frameW/2 - 80, frameY + frameH - 50, 160, 30, 15)
    .fill();
  doc.strokeColor(COLORS.primary).lineWidth(1)
    .roundedRect(frameX + frameW/2 - 80, frameY + frameH - 50, 160, 30, 15)
    .stroke();

  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(9)
    .text(`${formatDate(content.startDate)} - ${formatDate(content.endDate)}`,
      frameX + frameW/2 - 80, frameY + frameH - 42, { align: 'center', width: 160 });

  // Bottom decorative text
  doc.fillColor(COLORS.white)
    .font(FONTS.italic)
    .fontSize(10)
    .text('Adventures await!', MARGIN, PAGE_HEIGHT - 40, { align: 'center', width: CONTENT_WIDTH });

  doc.addPage();
}

function generateWelcomePage(doc, content) {
  drawPageBorder(doc, 'double');

  let y = MARGIN + 15;

  // Header with banner
  y = drawBanner(doc, 'Welcome, Traveler!', y, { color: COLORS.primary, fontSize: 16 });
  y += 15;

  // Welcome letter in styled box
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 130, {
    fillColor: COLORS.cream,
    strokeColor: COLORS.primaryLight,
    shadow: true
  });

  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(9)
    .text(content.preTrip.welcomeLetter, MARGIN + 12, y + 12, {
      width: CONTENT_WIDTH - 24,
      lineGap: 3,
    });

  y += 145;

  // Decorative divider
  drawDivider(doc, y, { style: 'stars', color: COLORS.secondary });
  y += 20;

  // Pre-flight prompts section
  y = drawSectionHeader(doc, 'Before You Go...', y, { color: COLORS.accent });
  y += 8;

  content.preTrip.preflightPrompts.forEach((prompt, i) => {
    // Number badge
    doc.fillColor(COLORS.secondary)
      .circle(MARGIN + 8, y + 5, 8)
      .fill();
    doc.fillColor(COLORS.white)
      .font(FONTS.title)
      .fontSize(8)
      .text(`${i + 1}`, MARGIN + 4, y + 2);

    // Prompt text
    doc.fillColor(COLORS.text)
      .font(FONTS.italic)
      .fontSize(8)
      .text(prompt, MARGIN + 22, y);
    y += 14;

    // Writing lines
    for (let j = 0; j < 2; j++) {
      drawWritingLine(doc, MARGIN + 22, y + 10, CONTENT_WIDTH - 22, { style: 'dashed' });
      y += 16;
    }
    y += 6;
  });

  // Small decorative airplane at bottom
  drawAirplane(doc, PAGE_WIDTH - MARGIN - 30, PAGE_HEIGHT - MARGIN - 20, 25, COLORS.primaryLight);

  doc.addPage();
}

function generateAboutMyTripPage(doc, content) {
  drawPageBorder(doc, 'dashed');

  let y = MARGIN + 15;

  // Header
  y = drawBanner(doc, 'About My Trip', y, { color: COLORS.secondary, fontSize: 14 });
  y += 12;

  // Trip details box
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 85, {
    fillColor: COLORS.cream,
    strokeColor: COLORS.secondaryLight,
    radius: 10,
  });

  // Suitcase icon
  drawSuitcase(doc, MARGIN + 20, y + 15, 20, COLORS.secondary);

  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text);
  doc.text('My name: ________________________________', MARGIN + 40, y + 12);
  doc.text(`I am going to: ${content.destination}`, MARGIN + 40, y + 30);
  doc.text('I am traveling with: _______________________', MARGIN + 12, y + 50);
  doc.text('How we are getting there: _________________', MARGIN + 12, y + 68);
  y += 100;

  // Drawing area with nice frame
  y = drawSectionHeader(doc, 'Draw Your Destination!', y, { color: COLORS.accent });

  doc.font(FONTS.italic).fontSize(7).fillColor(COLORS.textLight)
    .text('Draw a map, your route, or what you think your destination looks like:', MARGIN, y);
  y += 14;

  // Drawing frame with decorative corners
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 160, {
    fillColor: COLORS.white,
    strokeColor: COLORS.accent,
    dashed: true,
  });

  // Corner decorations for drawing box
  const corners = [
    [MARGIN + 5, y + 5],
    [MARGIN + CONTENT_WIDTH - 15, y + 5],
    [MARGIN + 5, y + 150],
    [MARGIN + CONTENT_WIDTH - 15, y + 150],
  ];
  corners.forEach(([cx, cy]) => {
    doc.fillColor(COLORS.accentLight).circle(cx + 5, cy + 5, 4).fill();
  });

  y += 175;

  // Packing checklist
  y = drawSectionHeader(doc, 'My Packing Checklist', y, { color: COLORS.coral });
  y += 5;

  const packingItems = [
    'Clothes', 'Toothbrush', 'Favorite toy/book', 'Camera',
    'Snacks', 'Journal (this one!)', 'Comfy shoes', 'Sunscreen'
  ];

  packingItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (CONTENT_WIDTH / 2);
    const itemY = y + row * 20;

    drawCheckbox(doc, x, itemY, 10, { color: COLORS.coral, style: 'circle' });
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(item, x + 14, itemY);
  });

  doc.addPage();
}

function generateDestinationFactsPages(doc, content) {
  const facts = content.preTrip.destinationFacts;

  drawPageBorder(doc, 'dotted');

  let y = MARGIN + 15;

  // Header
  y = drawBanner(doc, `All About ${content.destination}`, y, { color: COLORS.primary, fontSize: 13 });
  y += 15;

  // Quick facts in styled cards
  const cardWidth = (CONTENT_WIDTH - 10) / 2;
  const cardHeight = 45;

  // Language card
  drawStyledBox(doc, MARGIN, y, cardWidth, cardHeight, {
    fillColor: COLORS.primaryLight,
    strokeColor: COLORS.primary,
    radius: 8,
  });
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(8)
    .text('LANGUAGE', MARGIN + 10, y + 8);
  doc.fillColor(COLORS.text).font(FONTS.body).fontSize(10)
    .text(facts.language, MARGIN + 10, y + 22);

  // Currency card
  drawStyledBox(doc, MARGIN + cardWidth + 10, y, cardWidth, cardHeight, {
    fillColor: COLORS.secondaryLight,
    strokeColor: COLORS.secondary,
    radius: 8,
  });
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(8)
    .text('CURRENCY', MARGIN + cardWidth + 20, y + 8);
  doc.fillColor(COLORS.text).font(FONTS.body).fontSize(10)
    .text(facts.currency, MARGIN + cardWidth + 20, y + 22);

  y += cardHeight + 10;

  // Population card (full width)
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 35, {
    fillColor: COLORS.accentLight,
    strokeColor: COLORS.accent,
    radius: 8,
  });
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(8)
    .text('POPULATION', MARGIN + 10, y + 8);
  doc.fillColor(COLORS.text).font(FONTS.body).fontSize(10)
    .text(facts.population, MARGIN + 10, y + 20);

  y += 50;

  // Useful phrases box
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 65, {
    fillColor: COLORS.cream,
    strokeColor: COLORS.primary,
    radius: 10,
  });

  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
    .text('Useful Phrases:', MARGIN + 10, y + 8);

  let phraseY = y + 22;
  content.preTrip.usefulPhrases.forEach(phrase => {
    doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(8)
      .text(`"${phrase.phrase}"`, MARGIN + 15, phraseY);
    doc.fillColor(COLORS.textLight).font(FONTS.body).fontSize(8)
      .text(` = ${phrase.meaning}`, MARGIN + 15 + doc.widthOfString(`"${phrase.phrase}"`) + 5, phraseY);
    phraseY += 14;
  });

  y += 80;

  // Fun Facts with star bullets
  y = drawSectionHeader(doc, 'Did You Know?', y, { color: COLORS.secondary });
  y += 5;

  facts.funFacts.slice(0, 4).forEach(fact => {
    drawStar(doc, MARGIN + 6, y + 4, 5, 5, 2);
    doc.fillColor(COLORS.secondary);
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
      .text(fact, MARGIN + 16, y, { width: CONTENT_WIDTH - 20 });
    y += doc.heightOfString(fact, { width: CONTENT_WIDTH - 20 }) + 6;
  });

  // Cultural Tips
  if (facts.culturalHighlights && facts.culturalHighlights.length > 0) {
    y += 10;
    y = drawSectionHeader(doc, 'Cultural Tips', y, { color: COLORS.accent });
    y += 5;

    facts.culturalHighlights.slice(0, 3).forEach(highlight => {
      doc.fillColor(COLORS.accent).circle(MARGIN + 5, y + 4, 3).fill();
      doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
        .text(highlight, MARGIN + 14, y, { width: CONTENT_WIDTH - 18 });
      y += doc.heightOfString(highlight, { width: CONTENT_WIDTH - 18 }) + 5;
    });
  }

  doc.addPage();

  // Landmarks page
  if (content.preTrip.landmarks && content.preTrip.landmarks.length > 0) {
    drawPageBorder(doc, 'double');

    y = MARGIN + 15;
    y = drawBanner(doc, 'Famous Landmarks', y, { color: COLORS.accent, fontSize: 14 });
    y += 15;

    content.preTrip.landmarks.slice(0, 5).forEach((landmark, i) => {
      // Landmark card
      drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 70, {
        fillColor: i % 2 === 0 ? COLORS.cream : COLORS.white,
        strokeColor: COLORS.accentLight,
        radius: 8,
      });

      // Number badge
      doc.fillColor(COLORS.accent)
        .circle(MARGIN + 18, y + 18, 12)
        .fill();
      doc.fillColor(COLORS.white).font(FONTS.title).fontSize(12)
        .text(`${i + 1}`, MARGIN + 13, y + 12);

      // Landmark name
      doc.fillColor(COLORS.text).font(FONTS.title).fontSize(10)
        .text(landmark, MARGIN + 38, y + 12);

      // Notes line
      doc.fillColor(COLORS.textLight).font(FONTS.italic).fontSize(7)
        .text('My notes:', MARGIN + 38, y + 30);
      drawWritingLine(doc, MARGIN + 38, y + 50, CONTENT_WIDTH - 50, { style: 'dotted' });
      drawWritingLine(doc, MARGIN + 38, y + 62, CONTENT_WIDTH - 50, { style: 'dotted' });

      y += 78;
    });

    doc.addPage();
  }
}

function generateActivitiesSection(doc, content) {
  const activities = content.activities;
  const dest = content.destination;
  const COL2_X = MARGIN + 170;

  // === PAGE 1: Word Search + Unscramble + Trivia ===
  drawPageBorder(doc, 'dashed');
  let y = MARGIN + 15;

  y = drawBanner(doc, 'IN-FLIGHT FUN!', y, { color: COLORS.secondary, fontSize: 14 });
  y += 10;

  // Word Search section
  y = drawSectionHeader(doc, 'Word Search', y, { color: COLORS.primary, fontSize: 10 });

  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text('Find: ' + activities.wordSearch.words.slice(0, 6).join(', '), MARGIN, y);
  y += 12;

  const gridSize = 9;
  const cellSize = 16;

  // Grid background
  doc.fillColor(COLORS.cream)
    .rect(MARGIN - 2, y - 2, gridSize * cellSize + 4, gridSize * cellSize + 4)
    .fill();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cx = MARGIN + (col * cellSize);
      const cy = y + (row * cellSize);
      doc.strokeColor(COLORS.primaryLight).lineWidth(0.5)
        .rect(cx, cy, cellSize, cellSize).stroke();
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text).text(letter, cx + 4, cy + 3);
    }
  }

  // Unscramble on right
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(10)
    .text('UNSCRAMBLE', COL2_X, MARGIN + 45);

  // Decorative underline
  doc.strokeColor(COLORS.accentLight).lineWidth(2)
    .moveTo(COL2_X, MARGIN + 58)
    .lineTo(COL2_X + 80, MARGIN + 58)
    .stroke();

  const scrambleWords = activities.wordSearch.words.slice(0, 6).map(w =>
    w.split('').sort(() => Math.random() - 0.5).join('')
  );

  let sY = MARGIN + 68;
  scrambleWords.forEach((word, i) => {
    doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(8)
      .text(`${i + 1}.`, COL2_X, sY);
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
      .text(word.toUpperCase(), COL2_X + 15, sY);
    drawWritingLine(doc, COL2_X + 55, sY + 8, 70, { style: 'dotted', color: COLORS.accentLight });
    sY += 22;
  });

  // Trivia section
  y += (gridSize * cellSize) + 15;
  y = drawSectionHeader(doc, 'Quick Trivia', y, { color: COLORS.secondary, fontSize: 10 });
  y += 5;

  activities.trivia.forEach((item, i) => {
    // Question badge
    doc.fillColor(COLORS.secondaryLight)
      .roundedRect(MARGIN, y, CONTENT_WIDTH, 35, 5)
      .fill();

    doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(8)
      .text(`Q${i + 1}:`, MARGIN + 8, y + 5);
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
      .text(item.q, MARGIN + 25, y + 5, { width: CONTENT_WIDTH - 35 });
    drawWritingLine(doc, MARGIN + 8, y + 28, CONTENT_WIDTH - 16, { style: 'dashed' });
    y += 42;
  });

  doc.fontSize(5).fillColor(COLORS.textLight)
    .text(`Answers: ${activities.trivia.map((t, i) => `${i + 1}.${t.a}`).join('  ')}`, MARGIN, y);

  doc.addPage();

  // === PAGE 2: Bingo + Scavenger Hunt ===
  drawPageBorder(doc, 'dotted');
  y = MARGIN + 15;

  // Travel Bingo
  y = drawSectionHeader(doc, 'Travel Bingo', y, { color: COLORS.accent, fontSize: 11 });
  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text('Check off each item you spot!', MARGIN, y);
  y += 14;

  const bingoW = 52;
  const bingoH = 42;
  const bingoItems = activities.travelBingo.slice(0, 12);

  bingoItems.forEach((item, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const bx = MARGIN + (col * bingoW);
    const by = y + (row * bingoH);

    // Card background
    const cardColor = (row + col) % 2 === 0 ? COLORS.cream : COLORS.white;
    doc.fillColor(cardColor)
      .roundedRect(bx + 1, by + 1, bingoW - 2, bingoH - 2, 4)
      .fill();
    doc.strokeColor(COLORS.accentLight).lineWidth(1)
      .roundedRect(bx + 1, by + 1, bingoW - 2, bingoH - 2, 4)
      .stroke();

    // Checkbox
    drawCheckbox(doc, bx + 4, by + 4, 8, { color: COLORS.accent, style: 'circle' });

    doc.font(FONTS.body).fontSize(6).fillColor(COLORS.text)
      .text(item, bx + 4, by + 16, { width: bingoW - 8 });
  });

  // Scavenger Hunt on right side
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(10)
    .text('SCAVENGER HUNT', COL2_X, MARGIN + 15);
  doc.strokeColor(COLORS.primaryLight).lineWidth(2)
    .moveTo(COL2_X, MARGIN + 28)
    .lineTo(COL2_X + 100, MARGIN + 28)
    .stroke();

  const huntItems = [
    'Something red', 'A uniform', 'The number 7',
    'Something soft', 'A cloud shape', 'Someone smiling',
    'Something shiny', 'A bird', 'The color blue',
    'A sign with letters'
  ];

  let hY = MARGIN + 40;
  huntItems.forEach((item) => {
    drawCheckbox(doc, COL2_X, hY, 8, { color: COLORS.primary });
    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text(item, COL2_X + 12, hY);
    hY += 16;
  });

  // Bottom section: Tally
  y += (4 * bingoH) + 15;
  y = drawSectionHeader(doc, 'Tally Count', y, { color: COLORS.secondary, fontSize: 10 });
  y += 5;

  const tallies = ['Airplanes', 'Red cars', 'Dogs', 'Waves'];
  tallies.forEach((item, i) => {
    const tx = MARGIN + (i % 2) * 160;
    const ty = y + Math.floor(i / 2) * 30;

    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text).text(item + ':', tx, ty);
    drawStyledBox(doc, tx, ty + 12, 80, 16, {
      fillColor: COLORS.white,
      strokeColor: COLORS.secondaryLight,
      radius: 4,
    });
  });

  doc.addPage();

  // === PAGE 3: Drawing + Would You Rather + Categories ===
  drawPageBorder(doc, 'double');
  y = MARGIN + 15;

  y = drawSectionHeader(doc, 'Draw It!', y, { color: COLORS.primary, fontSize: 11 });
  doc.font(FONTS.italic).fontSize(7).fillColor(COLORS.textLight)
    .text(`Draw what you imagine ${dest} looks like:`, MARGIN, y);
  y += 14;

  // Drawing box with decorative frame
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 140, {
    fillColor: COLORS.white,
    strokeColor: COLORS.primary,
    dashed: true,
    radius: 10,
  });

  // Corner stars
  drawStar(doc, MARGIN + 12, y + 12, 6, 5, 3);
  drawStar(doc, MARGIN + CONTENT_WIDTH - 12, y + 12, 6, 5, 3);
  drawStar(doc, MARGIN + 12, y + 128, 6, 5, 3);
  drawStar(doc, MARGIN + CONTENT_WIDTH - 12, y + 128, 6, 5, 3);
  doc.fillColor(COLORS.primaryLight);

  y += 155;

  // Would You Rather
  y = drawSectionHeader(doc, 'Would You Rather...', y, { color: COLORS.secondary, fontSize: 10 });
  y += 5;

  const wyr = [
    ['Fly like a bird', 'Swim like a dolphin'],
    ['Visit 100 years ago', 'Visit 100 years ahead'],
    ['Eat only sweets', 'Eat only pizza'],
  ];

  wyr.forEach((q, i) => {
    doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(7)
      .text(`${i + 1}.`, MARGIN, y);
    drawCheckbox(doc, MARGIN + 12, y, 7, { color: COLORS.secondary });
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(7)
      .text(q[0], MARGIN + 22, y);
    doc.fillColor(COLORS.textLight).font(FONTS.italic).fontSize(7)
      .text('OR', MARGIN + 110, y);
    drawCheckbox(doc, MARGIN + 130, y, 7, { color: COLORS.secondary });
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(7)
      .text(q[1], MARGIN + 140, y);
    y += 18;
  });

  y += 10;

  // Categories
  y = drawSectionHeader(doc, 'Categories Game', y, { color: COLORS.accent, fontSize: 10 });

  const catLetter = dest.charAt(0).toUpperCase();

  // Big letter badge
  drawBadge(doc, PAGE_WIDTH - MARGIN - 30, y - 15, catLetter, { color: COLORS.accent, size: 35 });

  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text(`Name one thing starting with "${catLetter}" for each:`, MARGIN, y);
  y += 14;

  const cats = ['Animal:', 'Food:', 'Place:', 'Name:', 'Color:', 'Thing:'];
  cats.forEach((cat, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = MARGIN + (col * 108);
    const cy = y + (row * 24);

    doc.font(FONTS.title).fontSize(7).fillColor(COLORS.accent).text(cat, cx, cy);
    drawWritingLine(doc, cx + 35, cy + 8, 65, { style: 'dashed', color: COLORS.accentLight });
  });

  doc.addPage();

  // === PAGE 4: Games Page ===
  drawPageBorder(doc, 'dashed');
  y = MARGIN + 15;

  y = drawBanner(doc, 'Game Time!', y, { color: COLORS.accent, fontSize: 14 });
  y += 10;

  // Tic-Tac-Toe
  y = drawSectionHeader(doc, 'Tic-Tac-Toe', y, { color: COLORS.primary, fontSize: 10 });
  y += 5;

  const tttSize = 72;
  const tttCell = tttSize / 3;

  [MARGIN + 20, MARGIN + 120].forEach(startX => {
    // Background
    doc.fillColor(COLORS.cream)
      .rect(startX - 2, y - 2, tttSize + 4, tttSize + 4)
      .fill();

    doc.strokeColor(COLORS.primary).lineWidth(2);
    for (let i = 1; i < 3; i++) {
      doc.moveTo(startX + (i * tttCell), y).lineTo(startX + (i * tttCell), y + tttSize).stroke()
        .moveTo(startX, y + (i * tttCell)).lineTo(startX + tttSize, y + (i * tttCell)).stroke();
    }
  });

  // Maze on right
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(10)
    .text('MINI MAZE', COL2_X + 10, MARGIN + 28);

  const mazeY = MARGIN + 45;
  const mazeW = 90;
  const mazeH = 72;

  // Maze background
  doc.fillColor(COLORS.secondaryLight)
    .roundedRect(COL2_X + 10, mazeY, mazeW, mazeH, 5)
    .fill();
  doc.strokeColor(COLORS.secondary).lineWidth(2)
    .roundedRect(COL2_X + 10, mazeY, mazeW, mazeH, 5)
    .stroke();

  // Maze walls
  doc.strokeColor(COLORS.secondary).lineWidth(2)
    .moveTo(COL2_X + 40, mazeY).lineTo(COL2_X + 40, mazeY + 25).stroke()
    .moveTo(COL2_X + 40, mazeY + 40).lineTo(COL2_X + 40, mazeY + mazeH).stroke()
    .moveTo(COL2_X + 70, mazeY + 20).lineTo(COL2_X + 70, mazeY + 55).stroke()
    .moveTo(COL2_X + 10, mazeY + 35).lineTo(COL2_X + 25, mazeY + 35).stroke()
    .moveTo(COL2_X + 55, mazeY + 50).lineTo(COL2_X + 100, mazeY + 50).stroke();

  // Start/End markers
  doc.fillColor(COLORS.success).circle(COL2_X + 20, mazeY + 10, 5).fill();
  doc.fillColor(COLORS.white).font(FONTS.title).fontSize(6)
    .text('S', COL2_X + 17, mazeY + 7);

  doc.fillColor(COLORS.coral).circle(COL2_X + 90, mazeY + mazeH - 12, 5).fill();
  doc.fillColor(COLORS.white).font(FONTS.title).fontSize(6)
    .text('E', COL2_X + 87, mazeY + mazeH - 15);

  y += tttSize + 20;

  // Story Starter
  y = drawSectionHeader(doc, 'Story Starter', y, { color: COLORS.secondary, fontSize: 10 });

  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 120, {
    fillColor: COLORS.cream,
    strokeColor: COLORS.secondaryLight,
    radius: 8,
  });

  doc.font(FONTS.italic).fontSize(8).fillColor(COLORS.text)
    .text(`"One day in ${dest}, something amazing happened..."`, MARGIN + 10, y + 10);

  let lineY = y + 30;
  for (let i = 0; i < 5; i++) {
    drawWritingLine(doc, MARGIN + 10, lineY, CONTENT_WIDTH - 20, { style: 'dashed' });
    lineY += 18;
  }

  y += 135;

  // Travel Math
  y = drawSectionHeader(doc, 'Travel Math', y, { color: COLORS.accent, fontSize: 10 });
  y += 5;

  const math = [
    '3 hrs x 500 mph = _____ miles',
    '25 + 17 + 8 = _____',
    '$20 - $7.50 = $_____',
    '6 rows x 30 seats = _____',
  ];

  math.forEach((prob, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);

    drawStyledBox(doc, MARGIN + col * 165, y + row * 28, 155, 24, {
      fillColor: COLORS.accentLight,
      strokeColor: COLORS.accent,
      radius: 5,
    });

    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text(prob, MARGIN + col * 165 + 8, y + row * 28 + 7);
  });

  doc.addPage();
}

function generateRoadTripGamesSection(doc, content) {
  const COL2_X = MARGIN + 170;

  // === PAGE 1: License Plate Game ===
  drawPageBorder(doc, 'double');
  let y = MARGIN + 15;

  y = drawBanner(doc, 'License Plate Game', y, { color: COLORS.secondary, fontSize: 13 });
  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.textLight)
    .text('Check off license plates from different states as you spot them!', MARGIN, y + 5, { align: 'center', width: CONTENT_WIDTH });
  y += 25;

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const cellW = 60;
  const cellH = 24;
  const cols = 5;

  states.forEach((state, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = MARGIN + (col * cellW) + 3;
    const cy = y + (row * cellH);

    // Alternating colors
    const bgColor = (row + col) % 2 === 0 ? COLORS.cream : COLORS.white;
    doc.fillColor(bgColor)
      .roundedRect(cx, cy, cellW - 4, cellH - 2, 3)
      .fill();
    doc.strokeColor(COLORS.primaryLight).lineWidth(0.5)
      .roundedRect(cx, cy, cellW - 4, cellH - 2, 3)
      .stroke();

    drawCheckbox(doc, cx + 3, cy + 6, 10, { color: COLORS.primary });
    doc.font(FONTS.title).fontSize(9).fillColor(COLORS.text)
      .text(state, cx + 17, cy + 7);
  });

  y += Math.ceil(states.length / cols) * cellH + 15;

  // Bonus section
  y = drawSectionHeader(doc, 'Bonus Finds', y, { color: COLORS.accent, fontSize: 10 });
  y += 5;

  const bonusItems = ['Canada plate', 'Mexico plate', 'Vanity plate', 'Vintage plate'];
  bonusItems.forEach((item, i) => {
    const x = MARGIN + (i % 2) * 160;
    const row = Math.floor(i / 2);
    const itemY = y + row * 22;

    drawCheckbox(doc, x, itemY, 10, { color: COLORS.accent, style: 'circle' });
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(item, x + 14, itemY);
  });

  y += 55;

  // Total badge
  drawStyledBox(doc, MARGIN + CONTENT_WIDTH/2 - 80, y, 160, 30, {
    fillColor: COLORS.primaryLight,
    strokeColor: COLORS.primary,
    radius: 15,
  });
  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
    .text('Total states spotted: _______ / 50', MARGIN + CONTENT_WIDTH/2 - 70, y + 9);

  doc.addPage();

  // === PAGE 2: Alphabet Game + Traffic Signs ===
  drawPageBorder(doc, 'dashed');
  y = MARGIN + 15;

  y = drawBanner(doc, 'Alphabet Game', y, { color: COLORS.primary, fontSize: 13 });
  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.textLight)
    .text('Find each letter on signs, billboards, or license plates!', MARGIN, y + 5, { align: 'center', width: CONTENT_WIDTH });
  y += 22;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letterCellW = 35;
  const letterCellH = 32;
  const letterCols = 9;

  letters.forEach((letter, i) => {
    const col = i % letterCols;
    const row = Math.floor(i / letterCols);
    const lx = MARGIN + (col * letterCellW);
    const ly = y + (row * letterCellH);

    // Letter box with nice styling
    const bgColor = row % 2 === 0
      ? (col % 2 === 0 ? COLORS.primaryLight : COLORS.white)
      : (col % 2 === 0 ? COLORS.white : COLORS.primaryLight);

    doc.fillColor(bgColor)
      .roundedRect(lx, ly, letterCellW - 2, letterCellH - 2, 4)
      .fill();
    doc.strokeColor(COLORS.primary).lineWidth(0.5)
      .roundedRect(lx, ly, letterCellW - 2, letterCellH - 2, 4)
      .stroke();

    doc.font(FONTS.title).fontSize(14).fillColor(COLORS.primary)
      .text(letter, lx + 11, ly + 3);

    drawCheckbox(doc, lx + 10, ly + 20, 8, { color: COLORS.secondary });
  });

  y += Math.ceil(letters.length / letterCols) * letterCellH + 20;

  // Traffic Sign Spotter
  y = drawSectionHeader(doc, 'Traffic Sign Spotter', y, { color: COLORS.secondary, fontSize: 11 });
  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.textLight)
    .text('Check off signs as you see them!', MARGIN, y);
  y += 14;

  const signs = [
    'STOP sign', 'Yield sign', 'Speed limit', 'One way',
    'No parking', 'School zone', 'Railroad', 'Exit sign',
    'Rest area', 'Gas station', 'Food sign', 'Hospital'
  ];

  const signCols = 3;

  signs.forEach((sign, i) => {
    const col = i % signCols;
    const row = Math.floor(i / signCols);
    const sx = MARGIN + (col * 108);
    const sy = y + (row * 22);

    drawCheckbox(doc, sx, sy, 8, { color: COLORS.secondary });
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(sign, sx + 12, sy);
  });

  doc.addPage();

  // === PAGE 3: Travel Estimation ===
  drawPageBorder(doc, 'dotted');
  y = MARGIN + 15;

  y = drawBanner(doc, 'Travel Estimation Game', y, { color: COLORS.accent, fontSize: 12 });
  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.textLight)
    .text('Guess how many of each thing you\'ll see, then count the real number!', MARGIN, y + 5, { align: 'center', width: CONTENT_WIDTH });
  y += 25;

  const estimateItems = [
    'Dogs', 'Cats', 'Cows', 'Horses',
    'Red cars', 'Blue cars', 'Motorcycles', 'Trucks',
    'Airplanes', 'Birds', 'Bridges', 'Tunnels',
    'Fast food signs', 'Gas stations', 'Police cars', 'School buses'
  ];

  // Table header
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 18, {
    fillColor: COLORS.accent,
    strokeColor: COLORS.accent,
    radius: 4,
  });

  doc.fillColor(COLORS.white).font(FONTS.title).fontSize(8)
    .text('ITEM', MARGIN + 10, y + 4)
    .text('MY GUESS', MARGIN + 135, y + 4)
    .text('ACTUAL', MARGIN + 220, y + 4);
  y += 22;

  estimateItems.forEach((item, i) => {
    const rowColor = i % 2 === 0 ? COLORS.cream : COLORS.white;
    doc.fillColor(rowColor)
      .rect(MARGIN, y, CONTENT_WIDTH, 20)
      .fill();

    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(item, MARGIN + 10, y + 5);

    // Input boxes
    doc.strokeColor(COLORS.accentLight).lineWidth(1)
      .roundedRect(MARGIN + 130, y + 2, 55, 16, 3).stroke()
      .roundedRect(MARGIN + 215, y + 2, 55, 16, 3).stroke();

    y += 20;
  });

  y += 15;

  // Rating section
  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 35, {
    fillColor: COLORS.secondaryLight,
    strokeColor: COLORS.secondary,
    radius: 8,
  });
  doc.font(FONTS.title).fontSize(9).fillColor(COLORS.text)
    .text('How close were your guesses? Circle one:', MARGIN + 10, y + 8);
  doc.font(FONTS.body).fontSize(10)
    .text('VERY CLOSE    /    PRETTY CLOSE    /    WAY OFF', MARGIN + 10, y + 22);

  doc.addPage();

  // === PAGE 4: Dots & Boxes Game ===
  drawPageBorder(doc, 'double');
  y = MARGIN + 15;

  y = drawBanner(doc, 'Dots & Boxes', y, { color: COLORS.primary, fontSize: 14 });
  doc.font(FONTS.body).fontSize(7).fillColor(COLORS.textLight)
    .text('Take turns drawing lines between dots. Complete a box and write your initial inside!', MARGIN, y + 5, { align: 'center', width: CONTENT_WIDTH });
  y += 25;

  // Game 1 - larger grid
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(10)
    .text('GAME 1', MARGIN, y);
  y += 15;

  // Draw dots grid (7x7)
  const dotGridSize = 7;
  const dotSpacing = 36;
  const gridStartX = MARGIN + (CONTENT_WIDTH - (dotGridSize - 1) * dotSpacing) / 2;

  // Background for grid
  doc.fillColor(COLORS.cream)
    .roundedRect(gridStartX - 15, y - 10, (dotGridSize - 1) * dotSpacing + 30, (dotGridSize - 1) * dotSpacing + 20, 8)
    .fill();

  for (let row = 0; row < dotGridSize; row++) {
    for (let col = 0; col < dotGridSize; col++) {
      const dx = gridStartX + (col * dotSpacing);
      const dy = y + (row * dotSpacing);
      doc.fillColor(COLORS.primary).circle(dx, dy, 4).fill();
    }
  }

  y += (dotGridSize - 1) * dotSpacing + 25;

  // Score boxes
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(10)
    .text('SCORE', MARGIN, y);
  y += 14;

  drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH / 2 - 10, 35, {
    fillColor: COLORS.primaryLight,
    strokeColor: COLORS.primary,
    radius: 6,
  });
  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
    .text('Player 1: ____________', MARGIN + 10, y + 6)
    .text('Boxes: _____', MARGIN + 10, y + 20);

  drawStyledBox(doc, MARGIN + CONTENT_WIDTH / 2 + 5, y, CONTENT_WIDTH / 2 - 10, 35, {
    fillColor: COLORS.secondaryLight,
    strokeColor: COLORS.secondary,
    radius: 6,
  });
  doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text)
    .text('Player 2: ____________', MARGIN + CONTENT_WIDTH / 2 + 15, y + 6)
    .text('Boxes: _____', MARGIN + CONTENT_WIDTH / 2 + 15, y + 20);

  y += 50;

  // Game 2 - smaller
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(10)
    .text('GAME 2 (Quick Round)', MARGIN, y);
  y += 15;

  const smallGridSize = 5;
  const smallSpacing = 28;
  const smallStartX = MARGIN + 50;

  doc.fillColor(COLORS.accentLight)
    .roundedRect(smallStartX - 10, y - 8, (smallGridSize - 1) * smallSpacing + 20, (smallGridSize - 1) * smallSpacing + 16, 6)
    .fill();

  for (let row = 0; row < smallGridSize; row++) {
    for (let col = 0; col < smallGridSize; col++) {
      const dx = smallStartX + (col * smallSpacing);
      const dy = y + (row * smallSpacing);
      doc.fillColor(COLORS.accent).circle(dx, dy, 3).fill();
    }
  }

  // Score on right
  doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
    .text('P1: _______', COL2_X + 20, y + 20)
    .text('P2: _______', COL2_X + 20, y + 45);

  doc.addPage();
}

function generateDailyPages(doc, content) {
  const LINE_HEIGHT = 18;
  const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN - 10;

  content.dailyPages.forEach((page) => {
    // === PAGE 1: Prompts & Writing ===
    doc.addPage();

    // Decorative header bar
    doc.fillColor(COLORS.primary)
      .rect(0, 0, PAGE_WIDTH, 50)
      .fill();

    // Wave decoration at bottom of header
    doc.fillColor(COLORS.primaryLight);
    doc.moveTo(0, 50)
      .bezierCurveTo(PAGE_WIDTH * 0.3, 45, PAGE_WIDTH * 0.7, 55, PAGE_WIDTH, 50)
      .lineTo(PAGE_WIDTH, 55)
      .bezierCurveTo(PAGE_WIDTH * 0.7, 60, PAGE_WIDTH * 0.3, 50, 0, 55)
      .closePath()
      .fill();

    // Day number badge
    doc.fillColor(COLORS.secondary)
      .circle(55, 25, 20)
      .fill();
    doc.fillColor(COLORS.white).font(FONTS.title).fontSize(16)
      .text(page.dayNumber, 45, 17, { width: 20, align: 'center' });

    // Header text
    doc.fillColor(COLORS.white).font(FONTS.title).fontSize(14)
      .text(`Day ${page.dayNumber}`, 85, 12);
    doc.fillColor(COLORS.cream).font(FONTS.body).fontSize(10)
      .text(page.location, 85, 30);

    let y = 70;

    // Date and weather row
    drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 40, {
      fillColor: COLORS.cream,
      strokeColor: COLORS.primaryLight,
      radius: 8,
    });

    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
      .text('Date: _______________', MARGIN + 10, y + 8);
    doc.text('Weather:', MARGIN + 10, y + 24);

    // Weather icons as checkboxes
    const weathers = ['Sunny', 'Cloudy', 'Rainy', 'Cold'];
    weathers.forEach((w, i) => {
      drawCheckbox(doc, MARGIN + 60 + i * 55, y + 23, 8, { color: COLORS.secondary });
      doc.text(w, MARGIN + 72 + i * 55, y + 24);
    });

    // Mood
    doc.text('Mood:', MARGIN + CONTENT_WIDTH - 120, y + 8);
    const moods = ['Great', 'Good', 'Okay', 'Tired'];
    moods.forEach((m, i) => {
      drawCheckbox(doc, MARGIN + CONTENT_WIDTH - 70 + (i % 2) * 40, y + (Math.floor(i / 2) * 16) + 6, 7, { color: COLORS.coral, style: 'circle' });
      doc.fontSize(7).text(m, MARGIN + CONTENT_WIDTH - 58 + (i % 2) * 40, y + (Math.floor(i / 2) * 16) + 7);
    });

    y += 55;

    // Prompts with nice styling
    const prompts = page.prompts.slice(0, 3);
    const availableHeight = PAGE_BOTTOM - y - 20;
    const promptHeight = availableHeight / prompts.length;

    prompts.forEach((prompt, idx) => {
      // Prompt number
      doc.fillColor(COLORS.accent)
        .circle(MARGIN + 8, y + 8, 8)
        .fill();
      doc.fillColor(COLORS.white).font(FONTS.title).fontSize(8)
        .text(`${idx + 1}`, MARGIN + 5, y + 5);

      // Prompt text
      doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
        .text(prompt, MARGIN + 22, y + 3, { width: CONTENT_WIDTH - 25 });

      const promptTextHeight = doc.heightOfString(prompt, { width: CONTENT_WIDTH - 25 });
      let lineY = y + promptTextHeight + 12;

      // Writing lines
      const linesAvailable = Math.floor((promptHeight - promptTextHeight - 20) / LINE_HEIGHT);
      for (let j = 0; j < Math.min(linesAvailable, 5); j++) {
        drawWritingLine(doc, MARGIN + 22, lineY, CONTENT_WIDTH - 25, { style: 'dashed' });
        lineY += LINE_HEIGHT;
      }

      y += promptHeight;
    });

    // === PAGE 2: Sketch, Vocabulary, Highlights ===
    doc.addPage();
    drawPageBorder(doc, 'dashed');

    y = MARGIN + 15;

    y = drawBanner(doc, `Day ${page.dayNumber} - Sketch & Reflect`, y, { color: COLORS.accent, fontSize: 12 });
    y += 10;

    // Sketch section
    doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
      .text(`Draw: ${page.sketchPrompt}`, MARGIN, y);
    y += 14;

    const sketchHeight = 180;
    drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, sketchHeight, {
      fillColor: COLORS.white,
      strokeColor: COLORS.accent,
      dashed: true,
      radius: 10,
    });

    // Corner decorations
    drawStar(doc, MARGIN + 12, y + 12, 6, 5, 3);
    drawStar(doc, MARGIN + CONTENT_WIDTH - 12, y + 12, 6, 5, 3);
    doc.fillColor(COLORS.accentLight);

    y += sketchHeight + 15;

    // Two-column layout
    const col1X = MARGIN;
    const col2X = MARGIN + CONTENT_WIDTH / 2 + 8;
    const colWidth = CONTENT_WIDTH / 2 - 12;

    // Left: New word
    drawStyledBox(doc, col1X, y, colWidth, 85, {
      fillColor: COLORS.secondaryLight,
      strokeColor: COLORS.secondary,
      radius: 8,
    });

    doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
      .text('NEW WORD', col1X + 10, y + 8);

    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text('Word:', col1X + 10, y + 25);
    drawWritingLine(doc, col1X + 40, y + 32, colWidth - 50, { style: 'dotted' });
    doc.text('Means:', col1X + 10, y + 45);
    drawWritingLine(doc, col1X + 45, y + 52, colWidth - 55, { style: 'dotted' });
    doc.text('Use it:', col1X + 10, y + 65);
    drawWritingLine(doc, col1X + 40, y + 72, colWidth - 50, { style: 'dotted' });

    // Right: Today was...
    drawStyledBox(doc, col2X, y, colWidth, 85, {
      fillColor: COLORS.primaryLight,
      strokeColor: COLORS.primary,
      radius: 8,
    });

    doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
      .text('TODAY WAS...', col2X + 10, y + 8);

    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text('Best part:', col2X + 10, y + 25);
    drawWritingLine(doc, col2X + 10, y + 40, colWidth - 20, { style: 'dotted' });
    drawWritingLine(doc, col2X + 10, y + 55, colWidth - 20, { style: 'dotted' });
    doc.text('Surprising:', col2X + 10, y + 68);
    drawWritingLine(doc, col2X + 10, y + 78, colWidth - 20, { style: 'dotted' });

    y += 100;

    // What I want to remember
    y = drawSectionHeader(doc, 'What I Want to Remember', y, { color: COLORS.coral });
    y += 5;

    while (y + LINE_HEIGHT < PAGE_BOTTOM - 10) {
      drawWritingLine(doc, MARGIN, y, CONTENT_WIDTH, { style: 'dashed' });
      y += LINE_HEIGHT;
    }
  });
}

function generateClosingPage(doc, content) {
  const LINE_HEIGHT = 18;
  const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN - 10;

  // === Reflections Page ===
  doc.addPage();
  drawPageBorder(doc, 'double');

  let y = MARGIN + 15;

  y = drawBanner(doc, 'Trip Reflections', y, { color: COLORS.primary, fontSize: 14 });
  y += 15;

  const closingPrompts = [
    'The BEST thing about this trip was...',
    'Something that SURPRISED me...',
    'A new thing I LEARNED...',
    'I want to REMEMBER...',
    'Next time I travel, I want to...',
  ];

  closingPrompts.forEach((prompt, idx) => {
    drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 75, {
      fillColor: idx % 2 === 0 ? COLORS.cream : COLORS.white,
      strokeColor: idx % 2 === 0 ? COLORS.primaryLight : COLORS.secondaryLight,
      radius: 8,
    });

    // Prompt number star
    drawStar(doc, MARGIN + 15, y + 15, 10, 5, 5);
    doc.fillColor(COLORS.secondary);
    doc.fillColor(COLORS.white).font(FONTS.title).fontSize(8)
      .text(`${idx + 1}`, MARGIN + 12, y + 11);

    doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
      .text(prompt, MARGIN + 30, y + 10);

    // Writing lines
    for (let j = 0; j < 3; j++) {
      drawWritingLine(doc, MARGIN + 15, y + 32 + j * 15, CONTENT_WIDTH - 30, { style: 'dashed' });
    }

    y += 83;
  });

  // === Final Summary Page ===
  doc.addPage();

  // Celebratory background
  doc.fillColor(COLORS.primary)
    .rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)
    .fill();

  // Decorative elements
  doc.fillColor('rgba(255,255,255,0.1)');
  for (let i = 0; i < 15; i++) {
    const sx = Math.random() * PAGE_WIDTH;
    const sy = Math.random() * PAGE_HEIGHT;
    const size = 5 + Math.random() * 15;
    drawStar(doc, sx, sy, size, 5, size/2);
  }

  // Main content card
  const cardX = 25;
  const cardY = 60;
  const cardW = PAGE_WIDTH - 50;
  const cardH = PAGE_HEIGHT - 100;

  doc.fillColor(COLORS.white)
    .roundedRect(cardX, cardY, cardW, cardH, 15)
    .fill();

  // Decorative ribbon at top
  doc.fillColor(COLORS.secondary)
    .rect(cardX, cardY, cardW, 45)
    .fill();
  doc.fillColor(COLORS.secondaryLight)
    .moveTo(cardX, cardY + 45)
    .lineTo(cardX + cardW/2, cardY + 55)
    .lineTo(cardX + cardW, cardY + 45)
    .closePath()
    .fill();

  // Badge
  drawBadge(doc, cardX + cardW/2, cardY + 25, 'DONE!', { color: COLORS.coral, size: 50 });

  y = cardY + 75;

  // Title
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(20)
    .text('Trip Complete!', cardX, y, { align: 'center', width: cardW });
  y += 28;

  doc.fillColor(COLORS.secondary).fontSize(14)
    .text(`${content.childName}'s Adventure`, cardX, y, { align: 'center', width: cardW });
  y += 20;

  doc.fillColor(COLORS.textLight).font(FONTS.body).fontSize(12)
    .text(`to ${content.destination}`, cardX, y, { align: 'center', width: cardW });
  y += 20;

  doc.fontSize(10)
    .text(`${content.tripDays} Days of Exploration`, cardX, y, { align: 'center', width: cardW });
  y += 30;

  // Divider
  drawDivider(doc, y, { style: 'stars', color: COLORS.secondary });
  y += 20;

  // Rating section
  drawStyledBox(doc, cardX + 20, y, cardW - 40, 45, {
    fillColor: COLORS.cream,
    strokeColor: COLORS.secondaryLight,
    radius: 8,
  });

  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('RATE YOUR TRIP', cardX + 30, y + 8);

  doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
    .text('Overall:', cardX + 30, y + 25);

  // Stars for rating
  for (let i = 0; i < 5; i++) {
    drawStar(doc, cardX + 80 + i * 20, y + 28, 8, 5, 4);
    doc.fillColor(COLORS.secondaryLight);
  }

  doc.fillColor(COLORS.text).text('Visit again?', cardX + cardW/2 + 20, y + 25);
  drawCheckbox(doc, cardX + cardW/2 + 75, y + 24, 8, { color: COLORS.success });
  doc.text('Yes', cardX + cardW/2 + 88, y + 25);
  drawCheckbox(doc, cardX + cardW/2 + 115, y + 24, 8, { color: COLORS.coral });
  doc.text('No', cardX + cardW/2 + 128, y + 25);

  y += 60;

  // Top memories
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(10)
    .text('MY TOP 3 MEMORIES', cardX + 30, y);
  y += 16;

  for (let i = 1; i <= 3; i++) {
    doc.fillColor(COLORS.accent).circle(cardX + 38, y + 5, 8).fill();
    doc.fillColor(COLORS.white).font(FONTS.title).fontSize(8)
      .text(`${i}`, cardX + 35, y + 2);
    drawWritingLine(doc, cardX + 52, y + 10, cardW - 85, { style: 'dashed' });
    y += 22;
  }

  y += 10;

  // Two column section
  const col1 = cardX + 20;
  const col2 = cardX + cardW/2 + 10;
  const colW = cardW/2 - 35;

  // Foods
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('FOODS I TRIED', col1, y);
  doc.text('SOUVENIRS', col2, y);
  y += 14;

  for (let i = 0; i < 3; i++) {
    doc.fillColor(COLORS.secondary).circle(col1 + 5, y + 4, 2).fill();
    drawWritingLine(doc, col1 + 12, y + 8, colW - 15, { style: 'dotted' });
    doc.fillColor(COLORS.accent).circle(col2 + 5, y + 4, 2).fill();
    drawWritingLine(doc, col2 + 12, y + 8, colW - 15, { style: 'dotted' });
    y += 16;
  }

  y += 15;

  // Note to future self
  doc.fillColor(COLORS.coral).font(FONTS.title).fontSize(9)
    .text('NOTE TO MY FUTURE SELF:', cardX + 30, y);
  y += 14;

  for (let i = 0; i < 3; i++) {
    drawWritingLine(doc, cardX + 30, y, cardW - 60, { style: 'dashed' });
    y += LINE_HEIGHT;
  }

  // Footer
  doc.fillColor(COLORS.white).fontSize(6)
    .text('Created with KidsTravel Journal Generator', MARGIN, PAGE_HEIGHT - 30, { align: 'center', width: CONTENT_WIDTH })
    .text('Print: 2 pages per sheet, double-sided', MARGIN, PAGE_HEIGHT - 20, { align: 'center', width: CONTENT_WIDTH });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
