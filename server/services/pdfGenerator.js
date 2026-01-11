import PDFDocument from 'pdfkit';
import fs from 'fs';

const COLORS = {
  primary: '#4A90A4',
  secondary: '#F5A623',
  accent: '#7B68EE',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  background: '#FFF9F0',
};

const FONTS = {
  title: 'Helvetica-Bold',
  body: 'Helvetica',
  italic: 'Helvetica-Oblique',
};

export async function generatePDF(content, journalData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
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
  doc.rect(0, 0, doc.page.width, doc.page.height)
    .fill('#4A90A4');

  // Title
  doc.fillColor('white')
    .font(FONTS.title)
    .fontSize(42)
    .text(`${content.childName}'s`, 72, 200, { align: 'center' })
    .fontSize(56)
    .text('Travel Journal', 72, 260, { align: 'center' });

  // Destination
  doc.fontSize(28)
    .text(content.destination, 72, 360, { align: 'center' });

  if (content.country) {
    doc.fontSize(18)
      .text(content.country, 72, 400, { align: 'center' });
  }

  // Dates
  doc.fontSize(14)
    .text(`${formatDate(content.startDate)} - ${formatDate(content.endDate)}`, 72, 500, { align: 'center' });

  // Decorative elements
  doc.fontSize(48)
    .text('✈️', 72, 580, { align: 'center' });

  doc.addPage();
}

function generateWelcomePage(doc, content) {
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(28)
    .text('Welcome, Traveler!', { align: 'center' });

  doc.moveDown(2);

  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(12)
    .text(content.preTrip.welcomeLetter, {
      align: 'left',
      lineGap: 6,
    });

  doc.moveDown(2);

  // Pre-flight prompts
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(18)
    .text('Before You Go...');

  doc.moveDown();

  content.preTrip.preflightPrompts.forEach((prompt, i) => {
    doc.fillColor(COLORS.text)
      .font(FONTS.italic)
      .fontSize(11)
      .text(`${i + 1}. ${prompt}`);

    // Lines for writing
    doc.moveDown(0.5);
    for (let j = 0; j < 3; j++) {
      const y = doc.y;
      doc.strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(72, y)
        .lineTo(doc.page.width - 72, y)
        .stroke();
      doc.moveDown(0.8);
    }
    doc.moveDown(0.5);
  });

  doc.addPage();
}

function generateDestinationFactsPages(doc, content) {
  const facts = content.preTrip.destinationFacts;

  // Header
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(28)
    .text(`All About ${content.destination}`, { align: 'center' });

  doc.moveDown(2);

  // Quick facts box
  const boxTop = doc.y;
  doc.rect(72, boxTop, doc.page.width - 144, 120)
    .fill('#F0F7FA');

  doc.fillColor(COLORS.text)
    .font(FONTS.title)
    .fontSize(14);

  let y = boxTop + 15;
  const col1 = 90;
  const col2 = doc.page.width / 2 + 20;

  doc.text(`🗣️ Language: ${facts.language}`, col1, y);
  doc.text(`💰 Currency: ${facts.currency}`, col2, y);

  y += 25;
  doc.text(`👥 Population: ${facts.population}`, col1, y);

  y += 25;
  doc.font(FONTS.body).fontSize(12);
  doc.text('Useful Phrases:', col1, y);

  y += 20;
  content.preTrip.usefulPhrases.forEach(phrase => {
    doc.text(`"${phrase.phrase}" = ${phrase.meaning}`, col1 + 20, y);
    y += 18;
  });

  doc.y = boxTop + 140;

  // Fun Facts
  doc.moveDown();
  doc.fillColor(COLORS.secondary)
    .font(FONTS.title)
    .fontSize(18)
    .text('🤔 Did You Know?');

  doc.moveDown(0.5);

  facts.funFacts.forEach(fact => {
    doc.fillColor(COLORS.text)
      .font(FONTS.body)
      .fontSize(11)
      .text(`• ${fact}`, { indent: 10 });
    doc.moveDown(0.5);
  });

  doc.moveDown();

  // Cultural Highlights
  if (facts.culturalHighlights && facts.culturalHighlights.length > 0) {
    doc.fillColor(COLORS.accent)
      .font(FONTS.title)
      .fontSize(18)
      .text('🌍 Cultural Tips');

    doc.moveDown(0.5);

    facts.culturalHighlights.forEach(highlight => {
      doc.fillColor(COLORS.text)
        .font(FONTS.body)
        .fontSize(11)
        .text(`• ${highlight}`, { indent: 10 });
      doc.moveDown(0.5);
    });
  }

  // Landmarks
  if (content.preTrip.landmarks && content.preTrip.landmarks.length > 0) {
    doc.addPage();

    doc.fillColor(COLORS.primary)
      .font(FONTS.title)
      .fontSize(22)
      .text('🗺️ Famous Landmarks', { align: 'center' });

    doc.moveDown();

    content.preTrip.landmarks.forEach((landmark, i) => {
      doc.fillColor(COLORS.text)
        .font(FONTS.body)
        .fontSize(12)
        .text(`${i + 1}. ${landmark}`);

      // Small box for notes
      const boxY = doc.y + 5;
      doc.rect(90, boxY, doc.page.width - 180, 40)
        .stroke(COLORS.border);

      doc.fontSize(9)
        .fillColor(COLORS.textLight)
        .text('Notes:', 95, boxY + 5);

      doc.y = boxY + 50;
    });
  }

  doc.addPage();
}

function generateActivitiesSection(doc, content) {
  const activities = content.activities;

  // Section header
  doc.fillColor(COLORS.secondary)
    .font(FONTS.title)
    .fontSize(32)
    .text('✈️ In-Flight Fun!', { align: 'center' });

  doc.moveDown();
  doc.fillColor(COLORS.textLight)
    .font(FONTS.italic)
    .fontSize(12)
    .text('Activities to enjoy on your journey', { align: 'center' });

  doc.addPage();

  // Word Search
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(22)
    .text(`🔍 ${activities.wordSearch.title}`);

  doc.moveDown();
  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(11)
    .text('Find these words in the grid below:');

  doc.moveDown(0.5);
  doc.font(FONTS.title)
    .fontSize(10)
    .text(activities.wordSearch.words.join('  •  '), { align: 'center' });

  // Draw grid
  doc.moveDown();
  const gridSize = 12;
  const cellSize = 28;
  const gridStartX = (doc.page.width - (gridSize * cellSize)) / 2;
  const gridStartY = doc.y;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = gridStartX + (col * cellSize);
      const y = gridStartY + (row * cellSize);

      doc.rect(x, y, cellSize, cellSize)
        .stroke(COLORS.border);

      const letter = activities.wordSearch.grid[row]?.[col] || String.fromCharCode(65 + Math.floor(Math.random() * 26));
      doc.font(FONTS.body)
        .fontSize(14)
        .fillColor(COLORS.text)
        .text(letter, x + 8, y + 7);
    }
  }

  doc.y = gridStartY + (gridSize * cellSize) + 20;

  doc.addPage();

  // Travel Bingo
  doc.fillColor(COLORS.accent)
    .font(FONTS.title)
    .fontSize(22)
    .text('🎯 Travel Bingo');

  doc.moveDown();
  doc.fillColor(COLORS.text)
    .font(FONTS.body)
    .fontSize(11)
    .text('Check off each item as you experience it!');

  doc.moveDown();

  const bingoCellSize = 100;
  const bingoStartX = (doc.page.width - (4 * bingoCellSize)) / 2;
  const bingoStartY = doc.y;

  activities.travelBingo.forEach((item, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = bingoStartX + (col * bingoCellSize);
    const y = bingoStartY + (row * bingoCellSize);

    doc.rect(x, y, bingoCellSize, bingoCellSize)
      .stroke(COLORS.border);

    // Checkbox
    doc.rect(x + 5, y + 5, 12, 12)
      .stroke(COLORS.primary);

    // Text
    doc.font(FONTS.body)
      .fontSize(9)
      .fillColor(COLORS.text)
      .text(item, x + 5, y + 22, {
        width: bingoCellSize - 10,
        height: bingoCellSize - 30,
        align: 'center',
      });
  });

  doc.addPage();

  // Trivia
  doc.fillColor(COLORS.secondary)
    .font(FONTS.title)
    .fontSize(22)
    .text('❓ Travel Trivia');

  doc.moveDown();

  activities.trivia.forEach((item, i) => {
    doc.fillColor(COLORS.text)
      .font(FONTS.title)
      .fontSize(12)
      .text(`${i + 1}. ${item.q}`);

    doc.moveDown(0.5);

    // Answer line
    doc.text('Your answer: ___________________________', { indent: 20 });

    doc.moveDown(0.5);
    doc.fillColor(COLORS.textLight)
      .font(FONTS.italic)
      .fontSize(9)
      .text(`(Hint: Turn page upside down for answer)`, { indent: 20 });

    doc.moveDown();
  });

  // Answers upside down at bottom
  doc.save();
  doc.rotate(180, { origin: [doc.page.width / 2, doc.page.height - 50] });
  doc.fontSize(8)
    .fillColor(COLORS.textLight)
    .text(
      `Answers: ${activities.trivia.map((t, i) => `${i + 1}. ${t.a}`).join(' | ')}`,
      72,
      30,
      { width: doc.page.width - 144, align: 'center' }
    );
  doc.restore();

  doc.addPage();
}

function generateDailyPages(doc, content) {
  // Section header
  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(32)
    .text('📝 Daily Journal', { align: 'center' });

  doc.moveDown();
  doc.fillColor(COLORS.textLight)
    .font(FONTS.italic)
    .fontSize(12)
    .text('Record your adventures each day', { align: 'center' });

  content.dailyPages.forEach((page, index) => {
    doc.addPage();

    // Day header
    doc.fillColor(COLORS.primary)
      .font(FONTS.title)
      .fontSize(24)
      .text(`Day ${page.dayNumber} - ${page.location}`);

    // Date and weather
    doc.moveDown(0.5);
    doc.fillColor(COLORS.text)
      .font(FONTS.body)
      .fontSize(11)
      .text('Date: _____________    Weather: ☀️ ⛅ 🌧️ ❄️ (circle one)');

    doc.moveDown();

    // Mood tracker
    doc.text("Today's mood: 😊 😃 😐 😢 😴 (circle one)");

    doc.moveDown(1.5);

    // Prompts
    page.prompts.forEach((prompt, i) => {
      doc.fillColor(COLORS.accent)
        .font(FONTS.italic)
        .fontSize(11)
        .text(`✏️ ${prompt}`);

      doc.moveDown(0.5);

      // Writing lines
      for (let j = 0; j < 4; j++) {
        const y = doc.y;
        doc.strokeColor(COLORS.border)
          .lineWidth(0.5)
          .moveTo(72, y)
          .lineTo(doc.page.width - 72, y)
          .stroke();
        doc.moveDown(0.7);
      }

      doc.moveDown(0.5);

      // Check if we need a new page
      if (doc.y > doc.page.height - 200 && i < page.prompts.length - 1) {
        doc.addPage();
        doc.fillColor(COLORS.textLight)
          .font(FONTS.italic)
          .fontSize(10)
          .text(`Day ${page.dayNumber} continued...`);
        doc.moveDown();
      }
    });

    // Sketch section (on second page of each day)
    doc.addPage();

    doc.fillColor(COLORS.primary)
      .font(FONTS.title)
      .fontSize(18)
      .text(`Day ${page.dayNumber} - Sketch & Reflect`);

    doc.moveDown();

    // Sketch box
    doc.fillColor(COLORS.accent)
      .font(FONTS.italic)
      .fontSize(11)
      .text(`🎨 ${page.sketchPrompt}`);

    doc.moveDown(0.5);

    const sketchBoxY = doc.y;
    doc.rect(72, sketchBoxY, doc.page.width - 144, 250)
      .stroke(COLORS.border);

    doc.y = sketchBoxY + 260;

    // New word section
    doc.fillColor(COLORS.secondary)
      .font(FONTS.title)
      .fontSize(12)
      .text('📚 ' + page.newWordSection.label);

    doc.moveDown(0.3);
    doc.strokeColor(COLORS.border)
      .lineWidth(0.5)
      .moveTo(72, doc.y)
      .lineTo(300, doc.y)
      .stroke();

    doc.moveDown(0.8);
    doc.fillColor(COLORS.text)
      .font(FONTS.body)
      .fontSize(11)
      .text('It means: _________________________________');

    doc.moveDown(1.5);

    // Favorite moment
    doc.fillColor(COLORS.primary)
      .font(FONTS.title)
      .fontSize(12)
      .text('⭐ My favorite moment today:');

    doc.moveDown(0.5);
    for (let j = 0; j < 3; j++) {
      const y = doc.y;
      doc.strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(72, y)
        .lineTo(doc.page.width - 72, y)
        .stroke();
      doc.moveDown(0.7);
    }
  });
}

function generateClosingPage(doc, content) {
  doc.addPage();

  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(28)
    .text('Trip Reflections', { align: 'center' });

  doc.moveDown(2);

  const closingPrompts = [
    'The best thing about this trip was...',
    'Something I learned about myself...',
    'I want to remember...',
    'Next time I travel, I want to...',
    'My advice for other kids visiting this place...',
  ];

  closingPrompts.forEach(prompt => {
    doc.fillColor(COLORS.accent)
      .font(FONTS.italic)
      .fontSize(11)
      .text(`✏️ ${prompt}`);

    doc.moveDown(0.5);

    for (let j = 0; j < 4; j++) {
      const y = doc.y;
      doc.strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(72, y)
        .lineTo(doc.page.width - 72, y)
        .stroke();
      doc.moveDown(0.7);
    }

    doc.moveDown();
  });

  // Final page
  doc.addPage();

  doc.fillColor(COLORS.primary)
    .font(FONTS.title)
    .fontSize(36)
    .text('The End!', 72, 250, { align: 'center' });

  doc.moveDown(2);

  doc.fontSize(18)
    .text(`${content.childName}'s Amazing Adventure`, { align: 'center' });

  doc.moveDown();

  doc.fillColor(COLORS.textLight)
    .font(FONTS.body)
    .fontSize(12)
    .text(`${content.destination} • ${content.tripDays} Days`, { align: 'center' });

  doc.moveDown(3);

  doc.fontSize(48)
    .text('🎒✈️🌍', { align: 'center' });

  doc.moveDown(3);

  doc.fillColor(COLORS.textLight)
    .fontSize(10)
    .text('Created with KidsTravel Journal Generator', { align: 'center' });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
