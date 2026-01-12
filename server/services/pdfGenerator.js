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

// ============================================
// TROPICAL DECORATIONS (Costa Rica inspired)
// ============================================

// Draw a toucan
function drawToucan(doc, x, y, size = 24, flip = false) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 24);
  if (flip) doc.scale(-1, 1);

  // Body
  doc.fillColor('#1a1a2e')
    .ellipse(6, 4, 7, 8).fill();

  // Head
  doc.circle(-4, -4, 5).fill();

  // Eye ring (cyan)
  doc.fillColor('#00afd8')
    .circle(-6, -5, 2.5).fill();

  // Eye
  doc.fillColor('#1a1a2e')
    .circle(-6, -5, 1.2).fill();
  doc.fillColor('#ffffff')
    .circle(-6.3, -5.3, 0.4).fill();

  // Beak (orange/red)
  doc.fillColor('#ff9f43');
  doc.moveTo(-9, -3)
    .bezierCurveTo(-14, -1, -14, 2, -11, 3)
    .lineTo(-7, 0)
    .closePath().fill();

  doc.fillColor('#ee5a24');
  doc.moveTo(-9, -3)
    .bezierCurveTo(-12, -4, -11, 0, -7, 0)
    .closePath().fill();

  // Tail (cyan accent)
  doc.fillColor('#00afd8');
  doc.moveTo(12, 6)
    .bezierCurveTo(14, 10, 13, 14, 11, 12)
    .bezierCurveTo(10, 10, 11, 8, 12, 6)
    .fill();

  doc.restore();
}

// Draw a monstera leaf
function drawMonsteraLeaf(doc, x, y, size = 30, rotation = 0) {
  doc.save();
  doc.translate(x, y);
  doc.rotate(rotation);
  doc.scale(size / 30);

  // Main leaf shape
  doc.fillColor('#2ecc71');
  doc.moveTo(0, -12)
    .bezierCurveTo(-10, -6, -12, 6, -8, 14)
    .bezierCurveTo(-4, 18, 4, 18, 8, 14)
    .bezierCurveTo(12, 6, 10, -6, 0, -12)
    .fill();

  // Holes in leaf (using white/background)
  doc.fillColor('#FFFFFF');
  doc.ellipse(-4, 0, 2, 3).fill();
  doc.ellipse(4, 0, 2, 3).fill();
  doc.ellipse(-2, 8, 1.5, 2.5).fill();
  doc.ellipse(2, 8, 1.5, 2.5).fill();

  // Center vein
  doc.strokeColor('#27ae60').lineWidth(1);
  doc.moveTo(0, -10).lineTo(0, 14).stroke();

  // Side veins
  doc.lineWidth(0.5);
  doc.moveTo(0, -4).lineTo(-5, 0).stroke();
  doc.moveTo(0, -4).lineTo(5, 0).stroke();
  doc.moveTo(0, 4).lineTo(-4, 8).stroke();
  doc.moveTo(0, 4).lineTo(4, 8).stroke();

  doc.restore();
}

// Draw a butterfly
function drawButterfly(doc, x, y, size = 16, color = '#00afd8') {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 16);

  // Left wings
  doc.fillColor(color);
  doc.moveTo(0, 0)
    .bezierCurveTo(-6, -6, -10, -4, -8, 0)
    .bezierCurveTo(-10, 4, -6, 6, 0, 0)
    .fill();

  // Right wings
  doc.moveTo(0, 0)
    .bezierCurveTo(6, -6, 10, -4, 8, 0)
    .bezierCurveTo(10, 4, 6, 6, 0, 0)
    .fill();

  // Wing details
  doc.fillColor('#008fb3');
  doc.circle(-5, -2, 1.2).fill();
  doc.circle(5, -2, 1.2).fill();

  // Body
  doc.fillColor('#2d3436');
  doc.ellipse(0, 1, 0.8, 4).fill();

  // Antennae
  doc.strokeColor('#2d3436').lineWidth(0.5);
  doc.moveTo(-0.5, -3).bezierCurveTo(-2, -6, -3, -7, -4, -7).stroke();
  doc.moveTo(0.5, -3).bezierCurveTo(2, -6, 3, -7, 4, -7).stroke();

  doc.restore();
}

// Draw a tropical flower (hibiscus-style)
function drawTropicalFlower(doc, x, y, size = 20, color = '#ff6b6b') {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  // Petals
  doc.fillColor(color);
  for (let i = 0; i < 5; i++) {
    doc.save();
    doc.rotate(i * 72);
    doc.ellipse(0, -6, 4, 6).fill();
    doc.restore();
  }

  // Center
  doc.fillColor('#f9ca24');
  doc.circle(0, 0, 3).fill();

  // Stamen dots
  doc.fillColor('#f39c12');
  doc.circle(-1, -1, 0.6).fill();
  doc.circle(1, 0, 0.6).fill();
  doc.circle(0, 1, 0.6).fill();

  doc.restore();
}

// Draw a palm frond
function drawPalmFrond(doc, x, y, size = 25, rotation = 0) {
  doc.save();
  doc.translate(x, y);
  doc.rotate(rotation);
  doc.scale(size / 25);

  doc.strokeColor('#27ae60').lineWidth(1);
  doc.fillColor('#2ecc71');

  // Central stem
  doc.moveTo(0, 10).lineTo(0, -12).stroke();

  // Frond leaves
  for (let i = -4; i <= 4; i++) {
    const yPos = i * 2.5;
    const length = 8 - Math.abs(i);
    // Left leaf
    doc.moveTo(0, yPos)
      .bezierCurveTo(-length * 0.5, yPos - 2, -length, yPos - 1, -length, yPos + 1)
      .bezierCurveTo(-length * 0.5, yPos + 1, 0, yPos, 0, yPos)
      .fill();
    // Right leaf
    doc.moveTo(0, yPos)
      .bezierCurveTo(length * 0.5, yPos - 2, length, yPos - 1, length, yPos + 1)
      .bezierCurveTo(length * 0.5, yPos + 1, 0, yPos, 0, yPos)
      .fill();
  }

  doc.restore();
}

// Draw a hummingbird
function drawHummingbird(doc, x, y, size = 20, flip = false) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);
  if (flip) doc.scale(-1, 1);

  // Body
  doc.fillColor('#27ae60');
  doc.ellipse(2, 0, 6, 4).fill();

  // Head
  doc.fillColor('#2ecc71');
  doc.circle(-5, -1, 3).fill();

  // Beak
  doc.fillColor('#2d3436');
  doc.moveTo(-8, -1)
    .lineTo(-14, 0)
    .lineTo(-8, 1)
    .closePath().fill();

  // Eye
  doc.fillColor('#1a1a2e');
  doc.circle(-6, -2, 0.8).fill();

  // Wing
  doc.fillColor('#00afd8');
  doc.moveTo(2, -2)
    .bezierCurveTo(6, -8, 10, -6, 8, -2)
    .bezierCurveTo(6, 0, 2, 0, 2, -2)
    .fill();

  // Tail
  doc.fillColor('#1e8449');
  doc.moveTo(7, 0)
    .lineTo(12, 2)
    .lineTo(10, 4)
    .lineTo(7, 1)
    .closePath().fill();

  // Throat patch
  doc.fillColor('#e74c3c');
  doc.ellipse(-4, 1, 1.5, 1).fill();

  doc.restore();
}

// Draw a small tropical leaf (simpler version for accents)
function drawSmallLeaf(doc, x, y, size = 12, rotation = 0, color = '#27ae60') {
  doc.save();
  doc.translate(x, y);
  doc.rotate(rotation);
  doc.scale(size / 12);

  doc.fillColor(color);
  doc.moveTo(0, -6)
    .bezierCurveTo(-4, -3, -4, 3, 0, 6)
    .bezierCurveTo(4, 3, 4, -3, 0, -6)
    .fill();

  doc.strokeColor('#1e8449').lineWidth(0.3);
  doc.moveTo(0, -5).lineTo(0, 5).stroke();

  doc.restore();
}

// ============================================
// JAPAN THEME DECORATIONS
// ============================================

// Draw cherry blossom flower
function drawCherryBlossom(doc, x, y, size = 16) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 16);

  // Petals (5 heart-shaped petals)
  doc.fillColor('#ffb7c5');
  for (let i = 0; i < 5; i++) {
    doc.save();
    doc.rotate(i * 72);
    doc.moveTo(0, -6)
      .bezierCurveTo(-3, -8, -4, -4, 0, 0)
      .bezierCurveTo(4, -4, 3, -8, 0, -6)
      .fill();
    doc.restore();
  }

  // Center
  doc.fillColor('#ff69b4');
  doc.circle(0, 0, 2).fill();

  // Stamen dots
  doc.fillColor('#ffeb3b');
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * Math.PI / 180;
    doc.circle(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0.5).fill();
  }

  doc.restore();
}

// Draw torii gate
function drawToriiGate(doc, x, y, size = 24) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 24);

  // Use warm coral-orange instead of red for better contrast on blue
  doc.fillColor('#ff7f50');

  // Top beam (kasagi)
  doc.rect(-12, -10, 24, 3).fill();

  // Second beam (nuki)
  doc.rect(-10, -5, 20, 2).fill();

  // Pillars
  doc.rect(-9, -7, 2.5, 17).fill();
  doc.rect(6.5, -7, 2.5, 17).fill();

  // Top extensions
  doc.moveTo(-12, -10).lineTo(-13, -12).lineTo(-11, -10).fill();
  doc.moveTo(12, -10).lineTo(13, -12).lineTo(11, -10).fill();

  doc.restore();
}

// Draw Mt. Fuji
function drawMtFuji(doc, x, y, size = 30) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 30);

  // Mountain body
  doc.fillColor('#5d7d9a');
  doc.moveTo(0, -10)
    .lineTo(-15, 10)
    .lineTo(15, 10)
    .closePath().fill();

  // Snow cap
  doc.fillColor('#ffffff');
  doc.moveTo(0, -10)
    .lineTo(-6, -2)
    .bezierCurveTo(-4, -1, -2, -3, 0, -2)
    .bezierCurveTo(2, -3, 4, -1, 6, -2)
    .lineTo(0, -10)
    .fill();

  doc.restore();
}

// Draw koi fish
function drawKoiFish(doc, x, y, size = 20, color = '#ff6b35') {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  // Body
  doc.fillColor(color);
  doc.moveTo(-8, 0)
    .bezierCurveTo(-8, -5, 4, -5, 8, 0)
    .bezierCurveTo(4, 5, -8, 5, -8, 0)
    .fill();

  // Tail
  doc.moveTo(-8, 0)
    .lineTo(-12, -4)
    .bezierCurveTo(-10, 0, -10, 0, -12, 4)
    .closePath().fill();

  // Eye
  doc.fillColor('#ffffff');
  doc.circle(4, -1, 2).fill();
  doc.fillColor('#1a1a2e');
  doc.circle(4.5, -1, 1).fill();

  // Scales pattern
  doc.strokeColor('#e55a2b').lineWidth(0.3);
  doc.moveTo(-2, -2).bezierCurveTo(0, -1, 0, 1, -2, 2).stroke();
  doc.moveTo(2, -2).bezierCurveTo(4, -1, 4, 1, 2, 2).stroke();

  doc.restore();
}

// Draw Japanese lantern
function drawLantern(doc, x, y, size = 20) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  // Top
  doc.fillColor('#2d3436');
  doc.rect(-2, -10, 4, 2).fill();

  // Lantern body
  doc.fillColor('#ff5722');
  doc.ellipse(0, 0, 6, 8).fill();

  // Stripes
  doc.strokeColor('#d84315').lineWidth(0.5);
  doc.moveTo(-5, -2).lineTo(5, -2).stroke();
  doc.moveTo(-5, 2).lineTo(5, 2).stroke();

  // Bottom
  doc.fillColor('#2d3436');
  doc.rect(-3, 7, 6, 2).fill();

  // Tassel
  doc.strokeColor('#ffeb3b').lineWidth(1);
  doc.moveTo(0, 9).lineTo(0, 12).stroke();
  doc.moveTo(-1, 12).lineTo(1, 12).stroke();

  doc.restore();
}

// ============================================
// PARIS/FRANCE THEME DECORATIONS
// ============================================

// Draw Eiffel Tower
function drawEiffelTower(doc, x, y, size = 30) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 30);

  doc.fillColor('#5d5d5d');

  // Main tower shape
  doc.moveTo(0, -14)
    .lineTo(-2, -8)
    .lineTo(-4, -8)
    .lineTo(-6, 0)
    .lineTo(-3, 0)
    .lineTo(-5, 8)
    .lineTo(-8, 14)
    .lineTo(-3, 14)
    .lineTo(-2, 10)
    .lineTo(2, 10)
    .lineTo(3, 14)
    .lineTo(8, 14)
    .lineTo(5, 8)
    .lineTo(3, 0)
    .lineTo(6, 0)
    .lineTo(4, -8)
    .lineTo(2, -8)
    .closePath().fill();

  // Platforms
  doc.fillColor('#4a4a4a');
  doc.rect(-5, -8, 10, 1.5).fill();
  doc.rect(-6, 0, 12, 1.5).fill();

  // Top
  doc.fillColor('#5d5d5d');
  doc.rect(-0.5, -16, 1, 3).fill();

  doc.restore();
}

// Draw croissant
function drawCroissant(doc, x, y, size = 18) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 18);

  doc.fillColor('#d4a056');
  doc.moveTo(-8, 0)
    .bezierCurveTo(-8, -4, -4, -5, 0, -3)
    .bezierCurveTo(4, -5, 8, -4, 8, 0)
    .bezierCurveTo(8, 3, 4, 4, 0, 2)
    .bezierCurveTo(-4, 4, -8, 3, -8, 0)
    .fill();

  // Shading lines
  doc.strokeColor('#c49346').lineWidth(0.5);
  doc.moveTo(-5, -1).bezierCurveTo(-3, -2, 3, -2, 5, -1).stroke();
  doc.moveTo(-4, 1).bezierCurveTo(-2, 0, 2, 0, 4, 1).stroke();

  doc.restore();
}

// Draw fleur-de-lis
function drawFleurDeLis(doc, x, y, size = 20, color = '#1a237e') {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  doc.fillColor(color);

  // Center petal
  doc.moveTo(0, -8)
    .bezierCurveTo(-2, -6, -2, -2, 0, 0)
    .bezierCurveTo(2, -2, 2, -6, 0, -8)
    .fill();

  // Left petal
  doc.moveTo(-3, -4)
    .bezierCurveTo(-7, -6, -8, -2, -6, 0)
    .bezierCurveTo(-4, 0, -2, -1, -1, 0)
    .bezierCurveTo(-2, -2, -3, -3, -3, -4)
    .fill();

  // Right petal
  doc.moveTo(3, -4)
    .bezierCurveTo(7, -6, 8, -2, 6, 0)
    .bezierCurveTo(4, 0, 2, -1, 1, 0)
    .bezierCurveTo(2, -2, 3, -3, 3, -4)
    .fill();

  // Base
  doc.rect(-3, 0, 6, 2).fill();
  doc.rect(-4, 2, 8, 2).fill();
  doc.rect(-2, 4, 4, 4).fill();

  doc.restore();
}

// Draw beret
function drawBeret(doc, x, y, size = 18) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 18);

  doc.fillColor('#1a1a2e');

  // Main beret shape
  doc.moveTo(-8, 2)
    .bezierCurveTo(-8, -4, -4, -6, 0, -6)
    .bezierCurveTo(4, -6, 8, -4, 8, 2)
    .lineTo(-8, 2)
    .fill();

  // Brim
  doc.fillColor('#2d3436');
  doc.ellipse(0, 2, 9, 2).fill();

  // Top bobble
  doc.fillColor('#1a1a2e');
  doc.circle(0, -6, 2).fill();

  doc.restore();
}

// ============================================
// LONDON/UK THEME DECORATIONS
// ============================================

// Draw Big Ben
function drawBigBen(doc, x, y, size = 30) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 30);

  doc.fillColor('#8b7355');

  // Main tower
  doc.rect(-5, -6, 10, 20).fill();

  // Clock face
  doc.fillColor('#f5f5dc');
  doc.circle(0, 0, 4).fill();
  doc.strokeColor('#8b7355').lineWidth(0.5);
  doc.circle(0, 0, 4).stroke();

  // Clock hands
  doc.strokeColor('#1a1a2e').lineWidth(0.8);
  doc.moveTo(0, 0).lineTo(0, -3).stroke();
  doc.moveTo(0, 0).lineTo(2, 0).stroke();

  // Spire
  doc.fillColor('#8b7355');
  doc.moveTo(-3, -6).lineTo(0, -14).lineTo(3, -6).fill();

  // Top
  doc.fillColor('#d4af37');
  doc.moveTo(-1, -14).lineTo(0, -16).lineTo(1, -14).fill();

  // Windows
  doc.fillColor('#87ceeb');
  doc.rect(-3, 6, 2, 3).fill();
  doc.rect(1, 6, 2, 3).fill();

  doc.restore();
}

// Draw double-decker bus
function drawDoubleDecker(doc, x, y, size = 28) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 28);

  // Main body
  doc.fillColor('#cc0000');
  doc.roundedRect(-12, -6, 24, 14, 2).fill();

  // Windows
  doc.fillColor('#87ceeb');
  doc.rect(-10, -4, 5, 4).fill();
  doc.rect(-3, -4, 5, 4).fill();
  doc.rect(4, -4, 5, 4).fill();
  doc.rect(-10, 2, 5, 4).fill();
  doc.rect(-3, 2, 5, 4).fill();
  doc.rect(4, 2, 5, 4).fill();

  // Wheels
  doc.fillColor('#1a1a2e');
  doc.circle(-7, 10, 3).fill();
  doc.circle(7, 10, 3).fill();

  // Wheel centers
  doc.fillColor('#888');
  doc.circle(-7, 10, 1.5).fill();
  doc.circle(7, 10, 1.5).fill();

  doc.restore();
}

// Draw crown
function drawCrown(doc, x, y, size = 20) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 20);

  // Base
  doc.fillColor('#d4af37');
  doc.rect(-8, 2, 16, 4).fill();

  // Crown peaks
  doc.moveTo(-8, 2)
    .lineTo(-8, -4)
    .lineTo(-5, 0)
    .lineTo(-2, -6)
    .lineTo(0, -2)
    .lineTo(2, -6)
    .lineTo(5, 0)
    .lineTo(8, -4)
    .lineTo(8, 2)
    .closePath().fill();

  // Jewels
  doc.fillColor('#e53935');
  doc.circle(-5, -2, 1.5).fill();
  doc.circle(5, -2, 1.5).fill();
  doc.fillColor('#1e88e5');
  doc.circle(0, -4, 1.5).fill();

  // Base jewels
  doc.fillColor('#e53935');
  doc.circle(-4, 4, 1).fill();
  doc.circle(0, 4, 1).fill();
  doc.circle(4, 4, 1).fill();

  doc.restore();
}

// Draw tea cup
function drawTeaCup(doc, x, y, size = 18) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 18);

  // Saucer
  doc.fillColor('#f5f5dc');
  doc.ellipse(0, 6, 8, 2).fill();

  // Cup body
  doc.fillColor('#ffffff');
  doc.moveTo(-5, -2)
    .bezierCurveTo(-5, 4, -4, 6, 0, 6)
    .bezierCurveTo(4, 6, 5, 4, 5, -2)
    .lineTo(-5, -2)
    .fill();

  // Cup rim
  doc.strokeColor('#d4af37').lineWidth(1);
  doc.moveTo(-5, -2).lineTo(5, -2).stroke();

  // Handle
  doc.strokeColor('#ffffff').lineWidth(2);
  doc.moveTo(5, 0)
    .bezierCurveTo(8, 0, 8, 4, 5, 4)
    .stroke();

  // Steam
  doc.strokeColor('#cccccc').lineWidth(0.5);
  doc.moveTo(-2, -4).bezierCurveTo(-2, -6, -1, -6, -1, -8).stroke();
  doc.moveTo(1, -4).bezierCurveTo(1, -6, 2, -6, 2, -8).stroke();

  doc.restore();
}

// ============================================
// BEACH/COASTAL THEME DECORATIONS
// ============================================

// Draw palm tree (different from frond)
function drawPalmTree(doc, x, y, size = 30) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 30);

  // Trunk
  doc.fillColor('#8b6914');
  doc.moveTo(-2, 0).lineTo(-3, 14).lineTo(3, 14).lineTo(2, 0).fill();

  // Trunk texture
  doc.strokeColor('#725a12').lineWidth(0.5);
  for (let i = 2; i < 14; i += 2) {
    doc.moveTo(-2.5 + i*0.05, i).lineTo(2.5 - i*0.05, i).stroke();
  }

  // Fronds
  doc.fillColor('#27ae60');
  // Center
  doc.moveTo(0, -2).bezierCurveTo(0, -12, 1, -14, 0, -14)
    .bezierCurveTo(-1, -14, 0, -12, 0, -2).fill();
  // Left fronds
  doc.moveTo(0, -2).bezierCurveTo(-8, -6, -12, -4, -12, -2)
    .bezierCurveTo(-10, -2, -6, -2, 0, -2).fill();
  doc.moveTo(0, -2).bezierCurveTo(-6, -10, -10, -10, -10, -8)
    .bezierCurveTo(-8, -8, -4, -6, 0, -2).fill();
  // Right fronds
  doc.moveTo(0, -2).bezierCurveTo(8, -6, 12, -4, 12, -2)
    .bezierCurveTo(10, -2, 6, -2, 0, -2).fill();
  doc.moveTo(0, -2).bezierCurveTo(6, -10, 10, -10, 10, -8)
    .bezierCurveTo(8, -8, 4, -6, 0, -2).fill();

  // Coconuts
  doc.fillColor('#8b6914');
  doc.circle(-1, 1, 2).fill();
  doc.circle(2, 0, 2).fill();

  doc.restore();
}

// Draw seashell
function drawSeashell(doc, x, y, size = 16) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 16);

  doc.fillColor('#ffd5b5');

  // Shell shape
  doc.moveTo(-6, 4)
    .bezierCurveTo(-6, -4, 0, -6, 0, -6)
    .bezierCurveTo(0, -6, 6, -4, 6, 4)
    .bezierCurveTo(4, 6, -4, 6, -6, 4)
    .fill();

  // Ridges
  doc.strokeColor('#e6b896').lineWidth(0.5);
  doc.moveTo(0, -5).lineTo(-4, 4).stroke();
  doc.moveTo(0, -5).lineTo(0, 5).stroke();
  doc.moveTo(0, -5).lineTo(4, 4).stroke();

  doc.restore();
}

// Draw starfish
function drawStarfish(doc, x, y, size = 18) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 18);

  doc.fillColor('#ff7043');

  // 5-pointed star with rounded arms
  for (let i = 0; i < 5; i++) {
    doc.save();
    doc.rotate(i * 72);
    doc.moveTo(0, 0)
      .bezierCurveTo(-2, -3, -1, -7, 0, -8)
      .bezierCurveTo(1, -7, 2, -3, 0, 0)
      .fill();
    doc.restore();
  }

  // Texture dots
  doc.fillColor('#e64a19');
  doc.circle(0, -4, 0.8).fill();
  doc.circle(2.5, -2, 0.6).fill();
  doc.circle(-2.5, -2, 0.6).fill();

  doc.restore();
}

// Draw wave
function drawWave(doc, x, y, size = 25) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 25);

  doc.fillColor('#4fc3f7');
  doc.moveTo(-12, 0)
    .bezierCurveTo(-8, -6, -4, -6, 0, 0)
    .bezierCurveTo(4, 6, 8, 6, 12, 0)
    .lineTo(12, 4)
    .bezierCurveTo(8, 10, 4, 10, 0, 4)
    .bezierCurveTo(-4, -2, -8, -2, -12, 4)
    .closePath().fill();

  // Foam
  doc.fillColor('#ffffff');
  doc.circle(-6, -2, 1.5).fill();
  doc.circle(-3, -4, 1).fill();
  doc.circle(6, 2, 1.5).fill();

  doc.restore();
}

// Draw sun
function drawSun(doc, x, y, size = 22) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 22);

  doc.fillColor('#ffd54f');

  // Center
  doc.circle(0, 0, 6).fill();

  // Rays
  for (let i = 0; i < 8; i++) {
    doc.save();
    doc.rotate(i * 45);
    doc.moveTo(-1, -7).lineTo(0, -11).lineTo(1, -7).fill();
    doc.restore();
  }

  // Face (optional cute details)
  doc.fillColor('#ff8f00');
  doc.circle(-2, -1, 1).fill();
  doc.circle(2, -1, 1).fill();
  doc.moveTo(-2, 2).bezierCurveTo(-1, 3, 1, 3, 2, 2).stroke();

  doc.restore();
}

// ============================================
// SAFARI/AFRICA THEME DECORATIONS
// ============================================

// Draw elephant
function drawElephant(doc, x, y, size = 24) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 24);

  doc.fillColor('#808080');

  // Body
  doc.ellipse(2, 2, 8, 6).fill();

  // Head
  doc.circle(-6, -2, 5).fill();

  // Ear
  doc.fillColor('#696969');
  doc.ellipse(-9, -2, 3, 4).fill();

  // Trunk
  doc.fillColor('#808080');
  doc.moveTo(-8, 2)
    .bezierCurveTo(-10, 4, -10, 8, -8, 10)
    .bezierCurveTo(-6, 10, -6, 8, -6, 6)
    .bezierCurveTo(-6, 4, -6, 2, -6, 2)
    .fill();

  // Eye
  doc.fillColor('#1a1a2e');
  doc.circle(-5, -3, 1).fill();

  // Legs
  doc.fillColor('#808080');
  doc.rect(-2, 6, 3, 5).fill();
  doc.rect(5, 6, 3, 5).fill();

  // Tusk
  doc.fillColor('#f5f5dc');
  doc.moveTo(-6, 0).bezierCurveTo(-7, 3, -5, 4, -4, 2).fill();

  doc.restore();
}

// Draw giraffe
function drawGiraffe(doc, x, y, size = 28) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 28);

  doc.fillColor('#f4a460');

  // Body
  doc.ellipse(2, 6, 7, 5).fill();

  // Neck
  doc.moveTo(-4, 4).lineTo(-6, -10).lineTo(-2, -10).lineTo(0, 4).fill();

  // Head
  doc.ellipse(-4, -12, 3, 2.5).fill();

  // Spots
  doc.fillColor('#8b4513');
  doc.circle(-3, -4, 1.5).fill();
  doc.circle(-5, -8, 1.2).fill();
  doc.circle(0, 4, 2).fill();
  doc.circle(4, 8, 1.5).fill();
  doc.circle(-2, 8, 1.2).fill();

  // Horns
  doc.fillColor('#8b4513');
  doc.rect(-5, -15, 1, 3).fill();
  doc.rect(-3, -15, 1, 3).fill();
  doc.fillColor('#f4a460');
  doc.circle(-4.5, -15, 1).fill();
  doc.circle(-2.5, -15, 1).fill();

  // Eye
  doc.fillColor('#1a1a2e');
  doc.circle(-3, -12, 0.8).fill();

  // Legs
  doc.fillColor('#f4a460');
  doc.rect(-2, 10, 2, 5).fill();
  doc.rect(4, 10, 2, 5).fill();

  doc.restore();
}

// Draw acacia tree
function drawAcaciaTree(doc, x, y, size = 30) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 30);

  // Trunk
  doc.fillColor('#8b6914');
  doc.moveTo(-1, 0).lineTo(-2, 14).lineTo(2, 14).lineTo(1, 0).fill();

  // Canopy (flat umbrella shape)
  doc.fillColor('#228b22');
  doc.ellipse(0, -4, 14, 5).fill();

  // Canopy top
  doc.fillColor('#2e7d32');
  doc.ellipse(0, -6, 12, 3).fill();

  doc.restore();
}

// Draw lion face
function drawLionFace(doc, x, y, size = 24) {
  doc.save();
  doc.translate(x, y);
  doc.scale(size / 24);

  // Mane
  doc.fillColor('#d4860b');
  doc.circle(0, 0, 10).fill();

  // Face
  doc.fillColor('#f4a460');
  doc.circle(0, 0, 6).fill();

  // Ears
  doc.fillColor('#d4860b');
  doc.circle(-6, -6, 2.5).fill();
  doc.circle(6, -6, 2.5).fill();

  // Eyes
  doc.fillColor('#1a1a2e');
  doc.circle(-2, -2, 1.2).fill();
  doc.circle(2, -2, 1.2).fill();

  // Nose
  doc.fillColor('#8b4513');
  doc.moveTo(0, 1).lineTo(-1.5, 3).lineTo(1.5, 3).closePath().fill();

  // Mouth
  doc.strokeColor('#8b4513').lineWidth(0.5);
  doc.moveTo(0, 3).lineTo(0, 4).stroke();
  doc.moveTo(-2, 4).bezierCurveTo(-1, 5, 1, 5, 2, 4).stroke();

  doc.restore();
}

// ============================================
// THEME DETECTION AND APPLICATION
// ============================================

// Determine theme based on destination
function getDestinationTheme(destination, country) {
  const dest = (destination || '').toLowerCase();
  const ctry = (country || '').toLowerCase();

  // Japan
  if (ctry.includes('japan') || dest.includes('tokyo') || dest.includes('kyoto') ||
      dest.includes('osaka') || dest.includes('japan')) {
    return 'japan';
  }

  // France/Paris
  if (ctry.includes('france') || dest.includes('paris') || dest.includes('france') ||
      dest.includes('nice') || dest.includes('lyon')) {
    return 'paris';
  }

  // UK/London
  if (ctry.includes('uk') || ctry.includes('united kingdom') || ctry.includes('england') ||
      dest.includes('london') || dest.includes('england') || dest.includes('scotland')) {
    return 'london';
  }

  // Tropical destinations
  if (dest.includes('costa rica') || dest.includes('hawaii') || dest.includes('caribbean') ||
      dest.includes('puerto rico') || dest.includes('jamaica') || dest.includes('bahamas') ||
      dest.includes('fiji') || dest.includes('tahiti') || dest.includes('bali') ||
      ctry.includes('costa rica') || ctry.includes('thailand') || ctry.includes('indonesia')) {
    return 'tropical';
  }

  // Beach destinations
  if (dest.includes('beach') || dest.includes('cancun') || dest.includes('miami') ||
      dest.includes('maldives') || dest.includes('cabo') || dest.includes('florida') ||
      dest.includes('california') || dest.includes('san diego') || dest.includes('santa monica')) {
    return 'beach';
  }

  // Safari/Africa
  if (ctry.includes('kenya') || ctry.includes('tanzania') || ctry.includes('south africa') ||
      ctry.includes('botswana') || ctry.includes('namibia') || dest.includes('safari') ||
      dest.includes('serengeti') || dest.includes('kruger') || dest.includes('africa')) {
    return 'safari';
  }

  // Default travel theme
  return 'travel';
}

// Draw themed decorations for cover page
// Cover frame is at y=120 to y=400, so keep decorations in top zone (y<100) or bottom zone (y>420)
function drawThemedCoverDecorations(doc, theme) {
  const TOP_ZONE = 95;      // Max Y for top decorations
  const BOTTOM_ZONE = 430;  // Min Y for bottom decorations (PAGE_HEIGHT - 182)

  switch (theme) {
    case 'japan':
      // Top zone decorations
      drawCherryBlossom(doc, 40, 50, 20);
      drawCherryBlossom(doc, PAGE_WIDTH - 50, 70, 16);
      drawCherryBlossom(doc, 60, 85, 12);
      drawToriiGate(doc, PAGE_WIDTH - 60, 45, 26);
      // Bottom zone decorations
      drawMtFuji(doc, 50, BOTTOM_ZONE + 20, 35);
      drawKoiFish(doc, PAGE_WIDTH - 60, BOTTOM_ZONE + 40, 22);
      drawLantern(doc, 35, BOTTOM_ZONE + 60, 18);
      drawCherryBlossom(doc, PAGE_WIDTH - 40, BOTTOM_ZONE + 80, 14);
      break;

    case 'paris':
      // Top zone decorations
      drawEiffelTower(doc, PAGE_WIDTH - 55, 50, 35);
      drawFleurDeLis(doc, 40, 55, 18);
      drawFleurDeLis(doc, 65, 80, 14);
      // Bottom zone decorations
      drawCroissant(doc, 50, BOTTOM_ZONE + 30, 20);
      drawBeret(doc, PAGE_WIDTH - 50, BOTTOM_ZONE + 45, 20);
      drawFleurDeLis(doc, 35, BOTTOM_ZONE + 70, 16);
      drawCroissant(doc, PAGE_WIDTH - 65, BOTTOM_ZONE + 85, 16);
      break;

    case 'london':
      // Top zone decorations
      drawBigBen(doc, PAGE_WIDTH - 55, 55, 35);
      drawCrown(doc, 50, 50, 22);
      // Bottom zone decorations
      drawDoubleDecker(doc, 55, BOTTOM_ZONE + 30, 30);
      drawTeaCup(doc, PAGE_WIDTH - 50, BOTTOM_ZONE + 45, 20);
      drawCrown(doc, 35, BOTTOM_ZONE + 70, 16);
      drawTeaCup(doc, PAGE_WIDTH - 70, BOTTOM_ZONE + 85, 16);
      break;

    case 'tropical':
      // Top zone decorations
      drawMonsteraLeaf(doc, 30, 60, 35, -20);
      drawMonsteraLeaf(doc, PAGE_WIDTH - 25, 80, 30, 25);
      drawToucan(doc, PAGE_WIDTH - 70, 45, 28);
      drawButterfly(doc, 70, 90, 18);
      // Bottom zone decorations
      drawHummingbird(doc, 50, BOTTOM_ZONE + 35, 22);
      drawTropicalFlower(doc, PAGE_WIDTH - 50, BOTTOM_ZONE + 50, 18);
      drawSmallLeaf(doc, 25, BOTTOM_ZONE + 75, 14, -30);
      drawSmallLeaf(doc, PAGE_WIDTH - 30, BOTTOM_ZONE + 90, 12, 20);
      drawButterfly(doc, PAGE_WIDTH - 90, BOTTOM_ZONE + 60, 14);
      break;

    case 'beach':
      // Top zone decorations
      drawPalmTree(doc, 45, 70, 35);
      drawPalmTree(doc, PAGE_WIDTH - 40, 80, 30);
      drawSun(doc, PAGE_WIDTH - 60, 40, 25);
      // Bottom zone decorations
      drawWave(doc, 50, BOTTOM_ZONE + 35, 28);
      drawSeashell(doc, PAGE_WIDTH - 55, BOTTOM_ZONE + 50, 18);
      drawStarfish(doc, 40, BOTTOM_ZONE + 70, 20);
      drawSeashell(doc, PAGE_WIDTH - 70, BOTTOM_ZONE + 85, 14);
      break;

    case 'safari':
      // Top zone decorations
      drawAcaciaTree(doc, 45, 65, 35);
      drawAcaciaTree(doc, PAGE_WIDTH - 40, 75, 28);
      drawSun(doc, PAGE_WIDTH - 55, 35, 22);
      // Bottom zone decorations
      drawElephant(doc, 55, BOTTOM_ZONE + 35, 28);
      drawGiraffe(doc, PAGE_WIDTH - 55, BOTTOM_ZONE + 50, 32);
      drawLionFace(doc, 40, BOTTOM_ZONE + 75, 22);
      break;

    default: // travel theme
      // Top zone decorations
      drawAirplane(doc, PAGE_WIDTH - 80, 50, 30, 'rgba(255,255,255,0.3)');
      drawSuitcase(doc, 50, 60, 20, 'rgba(255,255,255,0.3)');
      drawCompass(doc, PAGE_WIDTH - 55, 80, 25, 'rgba(255,255,255,0.3)');
      // Bottom zone decorations
      drawAirplane(doc, 60, BOTTOM_ZONE + 40, 25, 'rgba(255,255,255,0.25)');
      drawSuitcase(doc, PAGE_WIDTH - 60, BOTTOM_ZONE + 60, 18, 'rgba(255,255,255,0.25)');
      break;
  }
}

// Draw themed decorations for daily page header
function drawThemedHeaderAccents(doc, theme) {
  switch (theme) {
    case 'japan':
      drawCherryBlossom(doc, PAGE_WIDTH - 45, 22, 14);
      drawCherryBlossom(doc, PAGE_WIDTH - 25, 38, 10);
      break;
    case 'paris':
      drawFleurDeLis(doc, PAGE_WIDTH - 35, 25, 14, '#ffffff');
      break;
    case 'london':
      drawCrown(doc, PAGE_WIDTH - 35, 25, 16);
      break;
    case 'tropical':
      drawSmallLeaf(doc, PAGE_WIDTH - 45, 20, 14, 30, '#2ecc71');
      drawButterfly(doc, PAGE_WIDTH - 25, 35, 12);
      break;
    case 'beach':
      drawSun(doc, PAGE_WIDTH - 35, 25, 16);
      break;
    case 'safari':
      drawLionFace(doc, PAGE_WIDTH - 35, 26, 16);
      break;
    default:
      drawCompass(doc, PAGE_WIDTH - 35, 25, 16, '#ffffff');
      break;
  }
}

// Draw themed decorations for sketch area corners
function drawThemedSketchCorners(doc, theme, margin, y, contentWidth, sketchHeight) {
  switch (theme) {
    case 'japan':
      drawCherryBlossom(doc, margin + 15, y + 15, 12);
      drawCherryBlossom(doc, margin + contentWidth - 15, y + 15, 12);
      drawKoiFish(doc, margin + contentWidth - 30, y + sketchHeight - 20, 14);
      drawCherryBlossom(doc, margin + 25, y + sketchHeight - 18, 10);
      break;
    case 'paris':
      drawFleurDeLis(doc, margin + 15, y + 15, 12);
      drawFleurDeLis(doc, margin + contentWidth - 15, y + 15, 12);
      drawCroissant(doc, margin + contentWidth - 28, y + sketchHeight - 18, 14);
      drawFleurDeLis(doc, margin + 20, y + sketchHeight - 18, 10);
      break;
    case 'london':
      drawCrown(doc, margin + 15, y + 15, 12);
      drawCrown(doc, margin + contentWidth - 15, y + 15, 12);
      drawTeaCup(doc, margin + contentWidth - 25, y + sketchHeight - 18, 14);
      drawCrown(doc, margin + 20, y + sketchHeight - 18, 10);
      break;
    case 'tropical':
      drawSmallLeaf(doc, margin + 12, y + 12, 10, -30);
      drawSmallLeaf(doc, margin + contentWidth - 12, y + 12, 10, 30);
      drawButterfly(doc, margin + contentWidth - 25, y + sketchHeight - 20, 12);
      drawTropicalFlower(doc, margin + 20, y + sketchHeight - 18, 12);
      break;
    case 'beach':
      drawSeashell(doc, margin + 15, y + 15, 12);
      drawSeashell(doc, margin + contentWidth - 15, y + 15, 12);
      drawStarfish(doc, margin + contentWidth - 25, y + sketchHeight - 20, 14);
      drawWave(doc, margin + 30, y + sketchHeight - 15, 18);
      break;
    case 'safari':
      drawSmallLeaf(doc, margin + 12, y + 12, 10, -30, '#228b22');
      drawSmallLeaf(doc, margin + contentWidth - 12, y + 12, 10, 30, '#228b22');
      drawLionFace(doc, margin + contentWidth - 25, y + sketchHeight - 22, 14);
      drawElephant(doc, margin + 25, y + sketchHeight - 20, 16);
      break;
    default:
      drawStar(doc, margin + 12, y + 12, 6, 5, 3);
      drawStar(doc, margin + contentWidth - 12, y + 12, 6, 5, 3);
      drawAirplane(doc, margin + contentWidth - 25, y + sketchHeight - 20, 16, COLORS.accent);
      drawSuitcase(doc, margin + 22, y + sketchHeight - 18, 12, COLORS.secondary);
      break;
  }
}

// Draw themed decorations for reflections page
// Use MARGIN-relative positioning to avoid content overlap
function drawThemedReflectionsDecorations(doc, theme) {
  const cornerOffset = 20;  // Distance from page edge for corner decorations

  switch (theme) {
    case 'japan':
      drawCherryBlossom(doc, cornerOffset, cornerOffset + 10, 16);
      drawCherryBlossom(doc, PAGE_WIDTH - cornerOffset, cornerOffset + 15, 14);
      drawKoiFish(doc, PAGE_WIDTH - cornerOffset - 25, PAGE_HEIGHT - cornerOffset - 20, 16);
      drawCherryBlossom(doc, cornerOffset + 20, PAGE_HEIGHT - cornerOffset - 15, 12);
      break;
    case 'paris':
      drawFleurDeLis(doc, cornerOffset + 5, cornerOffset + 10, 16);
      drawFleurDeLis(doc, PAGE_WIDTH - cornerOffset - 5, cornerOffset + 10, 14);
      drawCroissant(doc, PAGE_WIDTH - cornerOffset - 25, PAGE_HEIGHT - cornerOffset - 18, 16);
      drawBeret(doc, cornerOffset + 20, PAGE_HEIGHT - cornerOffset - 18, 14);
      break;
    case 'london':
      drawCrown(doc, cornerOffset + 5, cornerOffset + 10, 16);
      drawCrown(doc, PAGE_WIDTH - cornerOffset - 10, cornerOffset + 10, 14);
      drawTeaCup(doc, PAGE_WIDTH - cornerOffset - 20, PAGE_HEIGHT - cornerOffset - 20, 16);
      drawDoubleDecker(doc, cornerOffset + 25, PAGE_HEIGHT - cornerOffset - 22, 20);
      break;
    case 'tropical':
      drawMonsteraLeaf(doc, cornerOffset - 5, cornerOffset + 5, 20, -15);
      drawMonsteraLeaf(doc, PAGE_WIDTH - cornerOffset + 5, cornerOffset + 10, 18, 20);
      drawToucan(doc, PAGE_WIDTH - cornerOffset - 30, PAGE_HEIGHT - cornerOffset - 20, 18, true);
      drawHummingbird(doc, cornerOffset + 20, PAGE_HEIGHT - cornerOffset - 15, 16);
      break;
    case 'beach':
      drawPalmTree(doc, cornerOffset + 5, cornerOffset + 20, 22);
      drawPalmTree(doc, PAGE_WIDTH - cornerOffset, cornerOffset + 25, 20);
      drawStarfish(doc, PAGE_WIDTH - cornerOffset - 20, PAGE_HEIGHT - cornerOffset - 18, 16);
      drawSeashell(doc, cornerOffset + 20, PAGE_HEIGHT - cornerOffset - 15, 14);
      break;
    case 'safari':
      drawAcaciaTree(doc, cornerOffset + 5, cornerOffset + 20, 22);
      drawAcaciaTree(doc, PAGE_WIDTH - cornerOffset, cornerOffset + 22, 20);
      drawElephant(doc, PAGE_WIDTH - cornerOffset - 30, PAGE_HEIGHT - cornerOffset - 22, 18);
      drawGiraffe(doc, cornerOffset + 25, PAGE_HEIGHT - cornerOffset - 25, 20);
      break;
    default:
      drawAirplane(doc, cornerOffset + 15, cornerOffset + 15, 20, COLORS.primaryLight);
      drawSuitcase(doc, PAGE_WIDTH - cornerOffset - 15, cornerOffset + 15, 16, COLORS.secondaryLight);
      drawCompass(doc, PAGE_WIDTH - cornerOffset - 20, PAGE_HEIGHT - cornerOffset - 20, 18, COLORS.accent);
      drawSuitcase(doc, cornerOffset + 20, PAGE_HEIGHT - cornerOffset - 18, 14, COLORS.secondary);
      break;
  }
}

// Draw themed decorations for final page
// Final page card: x=25 to x=371, y=60 to y=572
// Keep decorations at edges to avoid overlapping card content
function drawThemedFinalPageDecorations(doc, theme) {
  const topY = 25;           // Top decoration zone
  const bottomY = PAGE_HEIGHT - 35;  // Bottom decoration zone

  switch (theme) {
    case 'japan':
      drawCherryBlossom(doc, 15, topY, 16);
      drawCherryBlossom(doc, PAGE_WIDTH - 20, topY + 5, 14);
      drawToriiGate(doc, PAGE_WIDTH - 20, topY + 25, 20);
      drawCherryBlossom(doc, 20, bottomY - 10, 14);
      drawCherryBlossom(doc, PAGE_WIDTH - 25, bottomY - 5, 12);
      break;
    case 'paris':
      drawFleurDeLis(doc, 15, topY, 16);
      drawFleurDeLis(doc, PAGE_WIDTH - 20, topY + 5, 14);
      drawFleurDeLis(doc, 20, bottomY - 10, 14);
      drawCroissant(doc, PAGE_WIDTH - 25, bottomY - 8, 14);
      break;
    case 'london':
      drawCrown(doc, 15, topY, 16);
      drawCrown(doc, PAGE_WIDTH - 20, topY + 5, 14);
      drawCrown(doc, 20, bottomY - 10, 14);
      drawTeaCup(doc, PAGE_WIDTH - 25, bottomY - 8, 14);
      break;
    case 'tropical':
      drawSmallLeaf(doc, 10, topY, 14, -20);
      drawSmallLeaf(doc, PAGE_WIDTH - 15, topY + 5, 12, 25);
      drawButterfly(doc, 18, topY + 20, 12);
      drawSmallLeaf(doc, 15, bottomY - 12, 12, -30);
      drawButterfly(doc, PAGE_WIDTH - 22, bottomY - 10, 10);
      break;
    case 'beach':
      drawSun(doc, PAGE_WIDTH - 25, topY + 5, 18);
      drawSeashell(doc, 15, topY + 5, 14);
      drawStarfish(doc, 18, bottomY - 10, 14);
      drawSeashell(doc, PAGE_WIDTH - 22, bottomY - 8, 12);
      break;
    case 'safari':
      drawSun(doc, PAGE_WIDTH - 25, topY + 5, 16);
      drawSmallLeaf(doc, 12, topY + 5, 12, -20, '#228b22');
      drawLionFace(doc, 18, bottomY - 12, 14);
      drawSmallLeaf(doc, PAGE_WIDTH - 18, bottomY - 10, 10, 20, '#228b22');
      break;
    default:
      drawStar(doc, 15, topY + 5, 8, 5, 3);
      drawStar(doc, PAGE_WIDTH - 20, topY + 8, 6, 5, 3);
      drawStar(doc, 18, bottomY - 8, 6, 5, 3);
      drawStar(doc, PAGE_WIDTH - 22, bottomY - 6, 8, 5, 3);
      break;
  }
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

      // Determine destination theme for decorations
      const theme = getDestinationTheme(content.destination, content.country);

      // Generate each section
      generateCoverPage(doc, content, theme);
      generateWelcomePage(doc, content);
      generateAboutMyTripPage(doc, content);
      generateDestinationFactsPages(doc, content);
      generateActivitiesSection(doc, content);
      generateRoadTripGamesSection(doc, content);
      generateDailyPages(doc, content, theme);
      generateClosingPage(doc, content, theme);

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

function generateCoverPage(doc, content, theme) {
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

  // Destination-themed decorations
  drawThemedCoverDecorations(doc, theme);

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

  const preflightPrompts = content.preTrip?.preflightPrompts || [
    'What are you most excited to see?',
    'What do you want to learn about?',
    'What food do you want to try?'
  ];

  preflightPrompts.forEach((prompt, i) => {
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
  doc.text(`Explorer: ${content.childName}`, MARGIN + 40, y + 12);
  doc.text(`Destination: ${content.destination}`, MARGIN + 40, y + 30);
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
  const facts = content.preTrip?.destinationFacts || {
    language: 'English',
    currency: 'Local currency',
    population: 'N/A',
    funFacts: [
      'This is an amazing destination!',
      'There are lots of interesting things to see and do here.',
      'Many families visit this place every year.',
    ],
    culturalHighlights: [
      'Be respectful of local customs',
      'Try the local food!',
    ],
  };

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

  // Skip useful phrases for English-speaking destinations
  const isEnglish = (facts.language || '').toLowerCase().includes('english');

  if (!isEnglish) {
    // Useful phrases box
    drawStyledBox(doc, MARGIN, y, CONTENT_WIDTH, 65, {
      fillColor: COLORS.cream,
      strokeColor: COLORS.primary,
      radius: 10,
    });

    doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
      .text('Useful Phrases:', MARGIN + 10, y + 8);

    let phraseY = y + 22;
    const usefulPhrases = content.preTrip?.usefulPhrases || [
      { phrase: 'Hello', meaning: 'Greeting', pronunciation: 'heh-LOH' },
      { phrase: 'Thank you', meaning: 'Gratitude', pronunciation: 'THANK yoo' },
    ];
    usefulPhrases.forEach(phrase => {
      doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(8)
        .text(`"${phrase.phrase}"`, MARGIN + 15, phraseY);
      doc.fillColor(COLORS.textLight).font(FONTS.body).fontSize(8)
        .text(` = ${phrase.meaning}`, MARGIN + 15 + doc.widthOfString(`"${phrase.phrase}"`) + 5, phraseY);
      phraseY += 14;
    });

    y += 80;
  }

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
  const defaultActivities = {
    wordSearch: { words: ['TRAVEL', 'ADVENTURE', 'EXPLORE', 'FUN', 'DISCOVER', 'JOURNEY'] },
    unscramble: { words: [{ scrambled: 'RTIP', answer: 'TRIP' }, { scrambled: 'AMP', answer: 'MAP' }] },
    trivia: [
      { question: 'What is the capital of this place?', options: ['A', 'B', 'C', 'D'] },
    ],
    maze: { theme: 'Travel' },
    connectDots: { items: [{ a: 'Airplane', b: 'Sky' }, { a: 'Suitcase', b: 'Clothes' }] },
    codeBreaker: { code: { A: 1, B: 2, C: 3 }, message: 'HELLO' },
    spottedList: ['Bird', 'Cloud', 'Tree', 'Car', 'Airplane'],
    wouldYouRather: [{ option1: 'fly', option2: 'swim' }],
    quickDraw: ['a tree', 'a house', 'the sun'],
    packingList: ['Clothes', 'Toothbrush', 'Camera'],
    games: ['I Spy', '20 Questions'],
    travelBingo: ['Red car', 'Bird', 'Cloud', 'River', 'Bridge', 'Cow', 'Stop sign', 'Gas station', 'Mountain', 'Restaurant', 'Hotel', 'Flag'],
  };
  const activities = { ...defaultActivities, ...content.activities };
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

  // Maze on right - positioned relative to y (same as tic-tac-toe)
  const mazeLabelY = y - 15;  // Same vertical position as section header
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(10)
    .text('MINI MAZE', COL2_X + 10, mazeLabelY);

  const mazeY = y;  // Use same y as tic-tac-toe
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

  // Note: Don't add page here - daily pages will add their own
}

function generateDailyPages(doc, content, theme) {
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

    // Themed header accents
    drawThemedHeaderAccents(doc, theme);

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

    // Corner decorations - themed accents
    drawThemedSketchCorners(doc, theme, MARGIN, y, CONTENT_WIDTH, sketchHeight);

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

function generateClosingPage(doc, content, theme) {
  const LINE_HEIGHT = 18;
  const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN - 10;

  // === Reflections Page ===
  doc.addPage();
  drawPageBorder(doc, 'double');

  // Themed corner decorations
  drawThemedReflectionsDecorations(doc, theme);

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

  // Themed decorations for final page
  drawThemedFinalPageDecorations(doc, theme);

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
