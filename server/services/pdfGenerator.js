import PDFDocument from 'pdfkit';
import fs from 'fs';

const COLORS = {
  primary: '#4A90A4',
  secondary: '#F5A623',
  accent: '#7B68EE',
  text: '#333333',
  textLight: '#666666',
  border: '#CCCCCC',
  background: '#FFF9F0',
};

const FONTS = {
  title: 'Helvetica-Bold',
  body: 'Helvetica',
  italic: 'Helvetica-Oblique',
};

// Half-letter size for 2-up printing (5.5" x 8.5")
const PAGE_WIDTH = 396;  // 5.5 inches * 72
const PAGE_HEIGHT = 612; // 8.5 inches * 72
const MARGIN = 36;       // 0.5 inch margins
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

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
      generateDestinationFactsPages(doc, content);
      generateActivitiesSection(doc, content);
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

function generateCoverPage(doc, content) {
  // Background color
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.primary);

  // Title
  doc.fillColor('white')
    .font(FONTS.title)
    .fontSize(24)
    .text(`${content.childName}'s`, MARGIN, 150, { align: 'center', width: CONTENT_WIDTH })
    .fontSize(32)
    .text('Travel Journal', MARGIN, 185, { align: 'center', width: CONTENT_WIDTH });

  // Destination
  doc.fontSize(18)
    .text(content.destination, MARGIN, 260, { align: 'center', width: CONTENT_WIDTH });

  if (content.country) {
    doc.fontSize(12)
      .text(content.country, MARGIN, 285, { align: 'center', width: CONTENT_WIDTH });
  }

  // Dates
  doc.fontSize(10)
    .text(`${formatDate(content.startDate)} - ${formatDate(content.endDate)}`, MARGIN, 340, { align: 'center', width: CONTENT_WIDTH });

  // Decorative border
  doc.strokeColor('white')
    .lineWidth(2)
    .rect(20, 20, PAGE_WIDTH - 40, PAGE_HEIGHT - 40)
    .stroke();

  // Simple decorative elements (no emojis)
  doc.fontSize(14)
    .text('~ ~ ~', MARGIN, 400, { align: 'center', width: CONTENT_WIDTH });

  doc.addPage();
}

function generateWelcomePage(doc, content) {
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(18)
    .text('Welcome, Traveler!', { align: 'center' });

  doc.moveDown(1);

  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(9)
    .text(content.preTrip.welcomeLetter, {
      align: 'left',
      lineGap: 3,
    });

  doc.moveDown(1);

  // Pre-flight prompts
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(12)
    .text('Before You Go...');

  doc.moveDown(0.5);

  content.preTrip.preflightPrompts.forEach((prompt, i) => {
    doc.fillColor(COLORS.text)
      .font(FONTS.italic)
      .fontSize(8)
      .text(`${i + 1}. ${prompt}`);

    // Lines for writing
    doc.moveDown(0.3);
    for (let j = 0; j < 2; j++) {
      const y = doc.y;
      doc.strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(MARGIN, y)
        .lineTo(PAGE_WIDTH - MARGIN, y)
        .stroke();
      doc.moveDown(0.5);
    }
    doc.moveDown(0.3);
  });

  doc.addPage();
}

function generateDestinationFactsPages(doc, content) {
  const facts = content.preTrip.destinationFacts;

  // Header
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(16)
    .text(`All About ${content.destination}`, { align: 'center' });

  doc.moveDown(1);

  // Quick facts box
  const boxTop = doc.y;
  doc.rect(MARGIN, boxTop, CONTENT_WIDTH, 85)
    .fill('#F0F7FA');

  doc.fillColor(COLORS.text)
    .font(FONTS.title)
    .fontSize(9);

  let y = boxTop + 10;

  doc.text(`Language: ${facts.language}`, MARGIN + 10, y);
  doc.text(`Currency: ${facts.currency}`, PAGE_WIDTH / 2, y);

  y += 15;
  doc.text(`Population: ${facts.population}`, MARGIN + 10, y);

  y += 18;
  doc.font(FONTS.body).fontSize(8);
  doc.text('Useful Phrases:', MARGIN + 10, y);

  y += 12;
  content.preTrip.usefulPhrases.forEach(phrase => {
    doc.text(`"${phrase.phrase}" = ${phrase.meaning}`, MARGIN + 20, y);
    y += 11;
  });

  doc.y = boxTop + 95;

  // Fun Facts
  doc.fillColor(COLORS.secondary)
    .font(FONTS.title)
    .fontSize(11)
    .text('Did You Know?');

  doc.moveDown(0.3);

  facts.funFacts.slice(0, 4).forEach(fact => {
    doc.fillColor(COLORS.text)
      .font(FONTS.body)
      .fontSize(8)
      .text(`* ${fact}`, { indent: 5 });
    doc.moveDown(0.3);
  });

  // Cultural Highlights
  if (facts.culturalHighlights && facts.culturalHighlights.length > 0) {
    doc.moveDown(0.5);
    doc.fillColor(COLORS.accent)
      .font(FONTS.title)
      .fontSize(11)
      .text('Cultural Tips');

    doc.moveDown(0.3);

    facts.culturalHighlights.slice(0, 3).forEach(highlight => {
      doc.fillColor(COLORS.text)
        .font(FONTS.body)
        .fontSize(8)
        .text(`* ${highlight}`, { indent: 5 });
      doc.moveDown(0.3);
    });
  }

  doc.addPage();

  // Landmarks page
  if (content.preTrip.landmarks && content.preTrip.landmarks.length > 0) {
    doc.fillColor(COLORS.primary)
      .font(FONTS.title)
      .fontSize(14)
      .text('Famous Landmarks', { align: 'center' });

    doc.moveDown(0.8);

    content.preTrip.landmarks.slice(0, 5).forEach((landmark, i) => {
      doc.fillColor(COLORS.text)
        .font(FONTS.body)
        .fontSize(9)
        .text(`${i + 1}. ${landmark}`);

      // Small box for notes
      const boxY = doc.y + 3;
      doc.rect(MARGIN + 10, boxY, CONTENT_WIDTH - 20, 28)
        .stroke(COLORS.border);

      doc.fontSize(7)
        .fillColor(COLORS.textLight)
        .text('Notes:', MARGIN + 15, boxY + 3);

      doc.y = boxY + 35;
    });

    doc.addPage();
  }
}

function generateActivitiesSection(doc, content) {
  const activities = content.activities;
  const dest = content.destination;
  const COL2_X = MARGIN + 170; // Right column start

  // === PAGE 1: Word Search + Unscramble + Trivia ===
  let y = MARGIN;

  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(11)
    .text('IN-FLIGHT FUN!', MARGIN, y, { align: 'center', width: CONTENT_WIDTH });
  y += 20;

  // LEFT: Word Search
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
    .text('WORD SEARCH', MARGIN, y);
  y += 12;

  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text('Find: ' + activities.wordSearch.words.slice(0, 6).join(', '), MARGIN, y);
  y += 12;

  const gridSize = 9;
  const cellSize = 16;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cx = MARGIN + (col * cellSize);
      const cy = y + (row * cellSize);
      doc.rect(cx, cy, cellSize, cellSize).stroke(COLORS.border);
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      doc.font(FONTS.body).fontSize(9).fillColor(COLORS.text).text(letter, cx + 4, cy + 3);
    }
  }

  // RIGHT: Unscramble
  const rightY = MARGIN + 20;
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('UNSCRAMBLE', COL2_X, rightY);

  const scrambleWords = activities.wordSearch.words.slice(0, 6).map(w =>
    w.split('').sort(() => Math.random() - 0.5).join('')
  );

  let sY = rightY + 14;
  scrambleWords.forEach((word, i) => {
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(`${i + 1}. ${word}`, COL2_X, sY);
    doc.text('__________', COL2_X + 70, sY);
    sY += 22;
  });

  // BOTTOM: Trivia
  y += (gridSize * cellSize) + 15;
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('TRIVIA', MARGIN, y);
  y += 14;

  activities.trivia.forEach((item, i) => {
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(`${i + 1}. ${item.q}`, MARGIN, y);
    y += 12;
    doc.text('Answer: _______________________________', MARGIN + 10, y);
    y += 18;
  });

  doc.fontSize(5).fillColor(COLORS.textLight)
    .text(`Answers: ${activities.trivia.map((t, i) => `${i + 1}.${t.a}`).join('  ')}`, MARGIN, y);

  doc.addPage();

  // === PAGE 2: Bingo + Scavenger Hunt ===
  y = MARGIN;

  // LEFT: Travel Bingo (3x4 grid)
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('TRAVEL BINGO', MARGIN, y);
  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text('Check off each item!', MARGIN, y + 11);
  y += 24;

  const bingoW = 52;
  const bingoH = 42;
  const bingoItems = activities.travelBingo.slice(0, 12);

  bingoItems.forEach((item, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const bx = MARGIN + (col * bingoW);
    const by = y + (row * bingoH);

    doc.rect(bx, by, bingoW, bingoH).stroke(COLORS.border);
    doc.rect(bx + 3, by + 3, 8, 8).stroke(COLORS.primary);
    doc.font(FONTS.body).fontSize(6).fillColor(COLORS.text)
      .text(item, bx + 3, by + 14, { width: bingoW - 6 });
  });

  // RIGHT: Scavenger Hunt
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
    .text('SCAVENGER HUNT', COL2_X, MARGIN);
  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text('Find and check off:', COL2_X, MARGIN + 11);

  const huntItems = [
    'Something red', 'A uniform', 'The number 7',
    'Something soft', 'A cloud shape', 'Someone smiling',
    'Something shiny', 'A bird', 'The color blue',
    'A sign with letters'
  ];

  let hY = MARGIN + 26;
  huntItems.forEach((item) => {
    doc.rect(COL2_X, hY, 8, 8).stroke(COLORS.border);
    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text(item, COL2_X + 12, hY);
    hY += 16;
  });

  // BOTTOM: Tally + Fill-in-Blank
  y += (4 * bingoH) + 12;

  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('TALLY COUNT', MARGIN, y);
  y += 14;

  const tallies = ['Airplanes', 'Red cars', 'Dogs', 'Waves'];
  tallies.forEach((item, i) => {
    const tx = MARGIN + (i % 2) * 160;
    const ty = y + Math.floor(i / 2) * 28;
    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text).text(item + ':', tx, ty);
    doc.rect(tx, ty + 10, 70, 14).stroke(COLORS.border);
  });

  y += 65;
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('FILL IN THE BLANK', MARGIN, y);
  y += 14;

  const blanks = [
    `${dest} is famous for ________________________________.`,
    `I hope to see ________________________________.`,
    `One word to describe this trip: ________________.`,
  ];

  blanks.forEach(b => {
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text).text(b, MARGIN, y);
    y += 20;
  });

  doc.addPage();

  // === PAGE 3: Drawing + Would You Rather + Categories ===
  y = MARGIN;

  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
    .text('DRAW IT!', MARGIN, y);
  doc.font(FONTS.italic).fontSize(7).fillColor(COLORS.textLight)
    .text(`Draw what you imagine ${dest} looks like:`, MARGIN, y + 12);
  y += 26;

  doc.rect(MARGIN, y, CONTENT_WIDTH, 160).stroke(COLORS.border);
  y += 170;

  // Would You Rather
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('WOULD YOU RATHER...', MARGIN, y);
  y += 14;

  const wyr = [
    ['Fly like a bird', 'Swim like a dolphin'],
    ['Visit 100 years ago', 'Visit 100 years ahead'],
    ['Eat only sweets forever', 'Eat only pizza forever'],
  ];

  wyr.forEach((q, i) => {
    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text(`${i + 1}. [  ] ${q[0]}   OR   [  ] ${q[1]}`, MARGIN, y);
    y += 18;
  });

  y += 8;

  // Categories
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('CATEGORIES GAME', MARGIN, y);

  const catLetter = dest.charAt(0).toUpperCase();
  doc.font(FONTS.title).fontSize(16).fillColor(COLORS.primary)
    .text(catLetter, MARGIN + CONTENT_WIDTH - 30, y - 4);

  doc.font(FONTS.body).fontSize(6).fillColor(COLORS.textLight)
    .text(`Name one thing starting with "${catLetter}" for each:`, MARGIN, y + 12);
  y += 26;

  const cats = [
    ['Animal:', 'Food:', 'Place:'],
    ['Name:', 'Color:', 'Thing:']
  ];

  cats.forEach((row, ri) => {
    row.forEach((cat, ci) => {
      const cx = MARGIN + (ci * 108);
      doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
        .text(cat, cx, y + (ri * 22));
      doc.strokeColor(COLORS.border).moveTo(cx + 35, y + (ri * 22) + 8)
        .lineTo(cx + 100, y + (ri * 22) + 8).stroke();
    });
  });

  doc.addPage();

  // === PAGE 4: Games Page ===
  y = MARGIN;

  // Tic-Tac-Toe (2 grids side by side)
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('TIC-TAC-TOE', MARGIN, y);
  y += 14;

  const tttSize = 72;
  const tttCell = tttSize / 3;

  [MARGIN, MARGIN + 100].forEach(startX => {
    for (let i = 1; i < 3; i++) {
      doc.strokeColor(COLORS.border)
        .moveTo(startX + (i * tttCell), y).lineTo(startX + (i * tttCell), y + tttSize).stroke()
        .moveTo(startX, y + (i * tttCell)).lineTo(startX + tttSize, y + (i * tttCell)).stroke();
    }
  });

  // Maze on right
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
    .text('MINI MAZE', COL2_X + 20, MARGIN);

  const mazeY = MARGIN + 14;
  const mazeW = 90;
  const mazeH = 72;
  doc.rect(COL2_X + 20, mazeY, mazeW, mazeH).stroke(COLORS.text);

  // Simple maze walls
  doc.strokeColor(COLORS.text)
    .moveTo(COL2_X + 50, mazeY).lineTo(COL2_X + 50, mazeY + 25).stroke()
    .moveTo(COL2_X + 50, mazeY + 40).lineTo(COL2_X + 50, mazeY + mazeH).stroke()
    .moveTo(COL2_X + 80, mazeY + 20).lineTo(COL2_X + 80, mazeY + 55).stroke()
    .moveTo(COL2_X + 20, mazeY + 35).lineTo(COL2_X + 35, mazeY + 35).stroke()
    .moveTo(COL2_X + 65, mazeY + 50).lineTo(COL2_X + 110, mazeY + 50).stroke();

  doc.font(FONTS.body).fontSize(5).fillColor(COLORS.text)
    .text('S', COL2_X + 23, mazeY + 3)
    .text('E', COL2_X + 100, mazeY + mazeH - 12);

  y += tttSize + 20;

  // Story Starter
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('STORY STARTER', MARGIN, y);
  y += 12;

  doc.font(FONTS.italic).fontSize(8).fillColor(COLORS.text)
    .text(`"One day in ${dest}, something amazing happened..."`, MARGIN, y);
  y += 16;

  for (let i = 0; i < 8; i++) {
    doc.strokeColor(COLORS.border).moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_WIDTH, y).stroke();
    y += 18;
  }

  y += 10;

  // Math Fun
  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('TRAVEL MATH', MARGIN, y);
  y += 14;

  const math = [
    ['3 hours x 500 mph = _______ miles', '25 + 17 + 8 = _______'],
    ['$20 - $7.50 = $_______', '6 rows x 30 seats = _______'],
  ];

  math.forEach((row, ri) => {
    row.forEach((prob, ci) => {
      doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
        .text(prob, MARGIN + (ci * 165), y + (ri * 20));
    });
  });

  doc.addPage();
}

function generateDailyPages(doc, content) {
  const LINE_HEIGHT = 18; // Space between writing lines
  const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN - 10;

  content.dailyPages.forEach((page) => {
    // === PAGE 1: Prompts & Writing ===
    doc.addPage();
    let y = MARGIN;

    // Header with day info
    doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(14)
      .text(`Day ${page.dayNumber} - ${page.location}`, MARGIN, y);
    y += 18;

    // Date and weather on same line
    doc.fillColor(COLORS.text).font(FONTS.body).fontSize(8)
      .text('Date: ______________', MARGIN, y);
    doc.text('Weather:  [sunny]  [cloudy]  [rainy]  [cold]', MARGIN + 120, y);
    y += 14;

    // Mood
    doc.text('Mood:  [great]  [good]  [okay]  [tired]  [sad]', MARGIN, y);
    y += 20;

    // Calculate available space for prompts
    const availableHeight = PAGE_BOTTOM - y;
    const prompts = page.prompts.slice(0, 3);
    const linesPerPrompt = Math.floor((availableHeight - (prompts.length * 20)) / (prompts.length * LINE_HEIGHT));

    prompts.forEach((prompt, idx) => {
      doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
        .text(`>> ${prompt}`, MARGIN, y);
      y += 14;

      // Writing lines - fill available space
      const lines = Math.max(4, Math.min(linesPerPrompt, 7));
      for (let j = 0; j < lines; j++) {
        doc.strokeColor(COLORS.border).lineWidth(0.5)
          .moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
        y += LINE_HEIGHT;
      }
      y += 8;
    });

    // Fill remaining space with extra lines if any
    while (y + LINE_HEIGHT < PAGE_BOTTOM - 20) {
      doc.strokeColor(COLORS.border).lineWidth(0.5)
        .moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
      y += LINE_HEIGHT;
    }

    // === PAGE 2: Sketch, Vocabulary, Highlights ===
    doc.addPage();
    y = MARGIN;

    // Sketch section
    doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(11)
      .text(`Day ${page.dayNumber} - Sketch & Reflect`, MARGIN, y);
    y += 16;

    doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
      .text(`Draw: ${page.sketchPrompt}`, MARGIN, y);
    y += 14;

    const sketchHeight = 200;
    doc.rect(MARGIN, y, CONTENT_WIDTH, sketchHeight).stroke(COLORS.border);
    y += sketchHeight + 12;

    // Two-column layout for vocabulary and highlights
    const col1X = MARGIN;
    const col2X = MARGIN + CONTENT_WIDTH / 2 + 10;
    const colWidth = CONTENT_WIDTH / 2 - 15;

    // LEFT: New word
    doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
      .text('NEW WORD', col1X, y);

    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text('Word: _____________________', col1X, y + 14);
    doc.text('Means: ____________________', col1X, y + 32);
    doc.text('Use it: ____________________', col1X, y + 50);
    doc.text('_____________________________', col1X, y + 68);

    // RIGHT: Best & Worst
    doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(9)
      .text('TODAY WAS...', col2X, y);

    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text('Best part:', col2X, y + 14);
    doc.text('_____________________________', col2X, y + 26);
    doc.text('_____________________________', col2X, y + 42);

    doc.text('Surprising:', col2X, y + 60);
    doc.text('_____________________________', col2X, y + 72);

    y += 95;

    // Bottom section: What I want to remember
    doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
      .text('WHAT I WANT TO REMEMBER', MARGIN, y);
    y += 14;

    // Fill rest of page with lines
    while (y + LINE_HEIGHT < PAGE_BOTTOM) {
      doc.strokeColor(COLORS.border).lineWidth(0.5)
        .moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
      y += LINE_HEIGHT;
    }
  });
}

function generateClosingPage(doc, content) {
  const LINE_HEIGHT = 18;
  const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN - 10;

  doc.addPage();
  let y = MARGIN;

  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(14)
    .text('TRIP REFLECTIONS', MARGIN, y, { align: 'center', width: CONTENT_WIDTH });
  y += 24;

  const closingPrompts = [
    'The BEST thing about this trip was...',
    'Something that SURPRISED me...',
    'A new thing I LEARNED...',
    'I want to REMEMBER...',
    'Next time I travel, I want to...',
  ];

  // Calculate lines per prompt to fill the page
  const promptSpace = PAGE_BOTTOM - y - 20;
  const linesPerPrompt = Math.floor(promptSpace / (closingPrompts.length * (LINE_HEIGHT + 4))) - 1;

  closingPrompts.forEach(prompt => {
    doc.fillColor(COLORS.accent).font(FONTS.italic).fontSize(8)
      .text(`>> ${prompt}`, MARGIN, y);
    y += 12;

    for (let j = 0; j < Math.max(3, linesPerPrompt); j++) {
      doc.strokeColor(COLORS.border).lineWidth(0.5)
        .moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
      y += LINE_HEIGHT;
    }
    y += 6;
  });

  // Final page
  doc.addPage();
  y = MARGIN;

  // Trip summary box
  doc.rect(MARGIN, y, CONTENT_WIDTH, 100).fill('#F0F7FA');

  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(20)
    .text('Trip Complete!', MARGIN, y + 15, { align: 'center', width: CONTENT_WIDTH });

  doc.fontSize(12)
    .text(`${content.childName}'s Adventure to ${content.destination}`, MARGIN, y + 45, { align: 'center', width: CONTENT_WIDTH });

  doc.fillColor(COLORS.textLight).font(FONTS.body).fontSize(10)
    .text(`${content.tripDays} Days of Exploration`, MARGIN, y + 65, { align: 'center', width: CONTENT_WIDTH });

  y += 115;

  // Rate your trip section
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(10)
    .text('RATE YOUR TRIP', MARGIN, y);
  y += 14;

  doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
    .text('Overall:     [1]  [2]  [3]  [4]  [5]  stars', MARGIN, y);
  y += 16;
  doc.text('Would visit again?     [Yes]  [Maybe]  [No]', MARGIN, y);
  y += 24;

  // Favorite memories
  doc.fillColor(COLORS.primary).font(FONTS.title).fontSize(10)
    .text('MY TOP 3 MEMORIES', MARGIN, y);
  y += 14;

  for (let i = 1; i <= 3; i++) {
    doc.font(FONTS.body).fontSize(8).fillColor(COLORS.text)
      .text(`${i}. ________________________________________`, MARGIN, y);
    y += 20;
  }

  y += 10;

  // People I met / Food I tried
  const col1X = MARGIN;
  const col2X = MARGIN + CONTENT_WIDTH / 2 + 5;

  doc.fillColor(COLORS.accent).font(FONTS.title).fontSize(9)
    .text('FOODS I TRIED', col1X, y);
  doc.text('SOUVENIRS', col2X, y);
  y += 12;

  for (let i = 0; i < 4; i++) {
    doc.font(FONTS.body).fontSize(7).fillColor(COLORS.text)
      .text(`- ________________`, col1X, y + (i * 14));
    doc.text(`- ________________`, col2X, y + (i * 14));
  }

  y += 70;

  // Message to future self
  doc.fillColor(COLORS.secondary).font(FONTS.title).fontSize(9)
    .text('NOTE TO MY FUTURE SELF:', MARGIN, y);
  y += 14;

  while (y + LINE_HEIGHT < PAGE_BOTTOM - 30) {
    doc.strokeColor(COLORS.border).lineWidth(0.5)
      .moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
    y += LINE_HEIGHT;
  }

  // Footer
  doc.fillColor(COLORS.textLight).fontSize(6)
    .text('Created with KidsTravel Journal Generator', MARGIN, PAGE_BOTTOM - 10, { align: 'center', width: CONTENT_WIDTH })
    .text('Print: 2 pages per sheet, double-sided = 4 pages per paper', MARGIN, PAGE_BOTTOM, { align: 'center', width: CONTENT_WIDTH });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
