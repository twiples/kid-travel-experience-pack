import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../../public/demo/verona');

// Demo data for Verona trip
const DEMO_DATA = {
  destination: 'Verona',
  childName: 'Sophia',
  childAge: 9,
  tripDays: 8,
  journalId: 'demo-verona-sophia-2025',
};

// AI-generated kid journal entries (simulating what a 9-year-old would write)
const JOURNAL_ENTRIES = [
  {
    day: 1,
    date: 'Monday, July 21',
    mood: 'Excited!',
    weather: 'Sunny',
    title: 'Arriving in Verona!',
    mainEntry: `Today we flew to Italy!!! The plane ride was SO long but I watched 2 movies. When we landed in Verona, everything looked so old and pretty. The buildings are all yellow and orange colors.

We walked around and saw the Arena. Its like a giant circle made of stone and Dad said its 2000 years old!!! Thats older than anything Ive ever seen. People used to watch gladiators fight here. Now they do concerts and operas.

For dinner we had pizza and it was the BEST pizza ever. The cheese was different than at home - more stretchy and yummy. Mom let me try her gelato - pistachio flavor. I want gelato every day!`,
    newWord: 'Ciao (chow) - means hello AND goodbye!',
    sketch: 'The Arena with arches'
  },
  {
    day: 2,
    date: 'Tuesday, July 22',
    mood: 'Happy',
    weather: 'Hot and sunny',
    title: 'Romeo and Juliet Day',
    mainEntry: `Today we went to Juliets house! Mom told me the story of Romeo and Juliet - its kind of sad but also romantic. There was a balcony where Juliet stood and SO many people were taking pictures.

Theres a statue of Juliet in the courtyard and everyone touches her for good luck. I touched her hand! The walls are covered in love letters and gum which is kind of gross but also cool.

We walked through the piazza and there were people painting and drawing. I watched an artist paint the Arena and he was really good. I tried drawing in my journal too but his was better.

I had strawberry AND chocolate gelato today. Two scoops!`,
    newWord: 'Amore (ah-MORE-ay) - means love',
    sketch: 'Juliets balcony with hearts'
  },
  {
    day: 3,
    date: 'Wednesday, July 23',
    mood: 'Curious',
    weather: 'A little cloudy',
    title: 'Castles and Bridges',
    mainEntry: `We went to Castelvecchio today - its a real castle! It has a bridge that goes over the river and you can walk on top of the castle walls. I pretended I was a princess looking out for dragons.

The castle has a museum inside with old swords and armor and paintings. The knights armor was smaller than I thought - people used to be shorter! There was a painting of a sad lady that followed you with her eyes. Creepy!

We crossed the Ponte Pietra bridge. Its super old and made of different colored stones because parts of it got broken in a war and they rebuilt it. The river is really pretty and green.

Pizza for lunch AGAIN. Im not complaining!`,
    newWord: 'Castello (cas-TEL-oh) - means castle',
    sketch: 'Castle bridge over river'
  },
  {
    day: 4,
    date: 'Thursday, July 24',
    mood: 'Adventurous',
    weather: 'Perfect!',
    title: 'Climbing the Tower',
    mainEntry: `TODAY WAS THE BEST DAY! We climbed the Torre dei Lamberti - its a super tall tower with 368 steps!!! My legs were SO tired but when we got to the top we could see the whole city. Everything looked tiny like toys.

I could see the Arena and all the red roofs and the mountains far away. Dad said we could see the Dolomites which are really tall mountains with snow on top even in summer.

After that we walked around Piazza delle Erbe. Theres a market there with fruits and souvenirs. Mom bought me a little Romeo and Juliet book. I also got a magnet for grandmas fridge.

Dinner was at a restaurant in a tiny street. I had pasta with tomato sauce and it was so good. Everything tastes better in Italy!`,
    newWord: 'Bellissimo (bell-EE-see-mo) - means very beautiful',
    sketch: 'View from tower top'
  },
  {
    day: 5,
    date: 'Friday, July 25',
    mood: 'Yummy',
    weather: 'Warm',
    title: 'Cooking Class!',
    mainEntry: `We took a cooking class today and I made REAL Italian pasta from scratch! The chef lady (she said to call her Nonna which means grandma) showed us how to mix flour and eggs and roll it out really thin.

My pasta was a little thick but Nonna said for first try it was bravissimo! We made it with butter and sage leaves. I didnt think Id like sage but it was actually yummy.

Then she taught us tiramisu for dessert. It has coffee in it but she made mine without coffee. Its like cake and cream and chocolate all together. I could eat it forever.

After cooking we walked along the river and saw people kayaking. I want to come back when Im older and try that!`,
    newWord: 'Delizioso (del-ee-tsee-OH-so) - means delicious',
    sketch: 'Me making pasta with rolling pin'
  },
  {
    day: 6,
    date: 'Saturday, July 26',
    mood: 'Amazed',
    weather: 'Hot!',
    title: 'Opera Night',
    mainEntry: `Tonight we went to the opera at the Arena!! We sat on the stone seats and they gave us little cushions because the stones are hard. When it got dark, everyone lit candles and it looked like magic.

The opera was called Aida and it was about an Egyptian princess. There were elephants and horses ON STAGE! Not real elephants but really big fake ones. The singing was SO loud - no microphones and you could still hear everything!

I got a little sleepy in the middle but the ending was exciting. Everyone clapped for like 10 minutes. My hands hurt from clapping!

Before the opera we had the earliest dinner ever at 6pm. Italians usually eat at 8 or 9! I had gnocchi which are like little potato pillows.`,
    newWord: 'Brava! (BRAH-vah) - what you shout when a lady singer is good',
    sketch: 'Arena at night with candles'
  },
  {
    day: 7,
    date: 'Sunday, July 27',
    mood: 'Peaceful',
    weather: 'Sunny',
    title: 'Lake Day Trip',
    mainEntry: `We drove to Lake Garda today - its the biggest lake in Italy! The water was SO blue and clear I could see fish swimming. We took a boat ride and the wind felt amazing.

We stopped at a little town called Sirmione that has a castle IN the water. Theres also old Roman ruins with a view of the lake. The Romans really liked this spot too I guess.

I put my feet in the lake and it was cold but nice. We had lunch at a restaurant right on the water. I could see the mountains behind the lake - it looked like a painting.

Ice cream count this trip: 12 gelatos! Today was lemon flavor - so refreshing when its hot.`,
    newWord: 'Lago (LAH-go) - means lake',
    sketch: 'Castle in the lake with mountains'
  },
  {
    day: 8,
    date: 'Monday, July 28',
    mood: 'Sad but grateful',
    weather: 'Beautiful',
    title: 'Last Day - Goodbye Verona',
    mainEntry: `I dont want to leave!! This was the best vacation ever. This morning we walked around one more time and I said bye to Juliet. I left a little note on the wall.

We had one last gelato (stracciatella - chocolate chip) and sat by the river. I drew a picture of the Arena to remember it forever. Dad said we can come back someday.

Things I will miss:
- Gelato every day
- The pretty buildings
- Pizza and pasta
- The Arena lit up at night
- Friendly Italian people who always say CIAO!

Things I learned:
- Some Italian words
- How to make pasta
- About Romeo and Juliet
- That buildings can be 2000 years old!

Grazie Verona! Arrivederci!`,
    newWord: 'Arrivederci (ah-ree-veh-DER-chee) - goodbye (see you again)',
    sketch: 'Heart with Verona inside'
  }
];

// Colors
const COLORS = {
  primary: '#1D3557',
  secondary: '#E63946',
  accent: '#457B9D',
  light: '#A8DADC',
  cream: '#F1FAEE',
  kid_handwriting: '#2C3E50',
  pencil: '#4A4A4A',
};

// Generate completed journal PDF with kid's entries
async function generateCompletedJournal() {
  console.log('Generating completed journal PDF...');

  const doc = new PDFDocument({ size: 'letter', margin: 50 });
  const outputPath = path.join(OUTPUT_DIR, 'completed-journal.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Cover page
  doc.rect(0, 0, 612, 792).fill('#FFF8E7');
  doc.fontSize(32).fillColor(COLORS.primary).text("Sophia's", 50, 120, { align: 'center' });
  doc.fontSize(48).text('Verona Adventure', 50, 160, { align: 'center' });
  doc.fontSize(24).fillColor(COLORS.secondary).text('July 2025', 50, 230, { align: 'center' });

  // Decorative elements
  doc.fontSize(60).text('🏛️', 250, 300, { align: 'center' });
  doc.fontSize(20).fillColor(COLORS.accent).text('Age 9 • 8 Days of Adventure', 50, 400, { align: 'center' });

  // Kid's addition on cover - "This journal belongs to me!"
  doc.fontSize(14).fillColor(COLORS.kid_handwriting)
     .text('This journal belongs to ME! - Sophia', 50, 500, { align: 'center', oblique: true });
  doc.fontSize(40).text('⭐', 280, 540);

  // Daily entries
  for (const entry of JOURNAL_ENTRIES) {
    doc.addPage();
    doc.rect(0, 0, 612, 792).fill('#FFFEF9');

    // Header
    doc.fontSize(10).fillColor(COLORS.accent).text(`Day ${entry.day}`, 50, 40);
    doc.fontSize(22).fillColor(COLORS.primary).text(entry.title, 50, 55);
    doc.fontSize(11).fillColor(COLORS.secondary).text(entry.date, 50, 82);

    // Mood and Weather boxes
    doc.roundedRect(400, 40, 80, 25, 5).fill(COLORS.light);
    doc.fontSize(10).fillColor(COLORS.primary).text(`Mood: ${entry.mood}`, 408, 48);

    doc.roundedRect(490, 40, 80, 25, 5).fill(COLORS.cream);
    doc.fontSize(10).fillColor(COLORS.primary).text(entry.weather, 498, 48);

    // Lined area for entry
    doc.moveTo(50, 110).lineTo(562, 110).stroke(COLORS.light);

    // Kid's handwritten entry (simulated with italic font)
    doc.fontSize(12).fillColor(COLORS.kid_handwriting);
    const lines = entry.mainEntry.split('\n\n');
    let yPos = 120;
    for (const para of lines) {
      doc.text(para, 55, yPos, {
        width: 500,
        align: 'left',
        lineGap: 4,
        oblique: true
      });
      yPos = doc.y + 15;
    }

    // Sketch area
    yPos = Math.max(yPos + 20, 520);
    doc.roundedRect(50, yPos, 250, 100, 10).stroke(COLORS.accent);
    doc.fontSize(9).fillColor(COLORS.accent).text('My Sketch:', 55, yPos + 5);
    doc.fontSize(11).fillColor(COLORS.pencil).text(`[${entry.sketch}]`, 60, yPos + 40, { oblique: true });
    // Add simple sketch indicator
    doc.fontSize(30).text('✏️', 180, yPos + 50);

    // New word learned
    doc.roundedRect(320, yPos, 230, 100, 10).fill('#FFF5E6');
    doc.fontSize(10).fillColor(COLORS.secondary).text('New Word I Learned:', 330, yPos + 10);
    doc.fontSize(11).fillColor(COLORS.kid_handwriting).text(entry.newWord, 330, yPos + 35, {
      width: 210,
      oblique: true
    });

    // Page number
    doc.fontSize(10).fillColor(COLORS.accent).text(`- ${entry.day + 4} -`, 280, 750);
  }

  // Final reflection page
  doc.addPage();
  doc.rect(0, 0, 612, 792).fill('#FFF8E7');

  doc.fontSize(28).fillColor(COLORS.primary).text('My Trip Reflections', 50, 50, { align: 'center' });

  doc.fontSize(14).fillColor(COLORS.secondary).text('My favorite memory:', 50, 120);
  doc.fontSize(12).fillColor(COLORS.kid_handwriting).text(
    'Watching the opera at the Arena with all the candles! It felt like being in a fairy tale. And making pasta with Nonna was so fun!',
    50, 145, { width: 500, oblique: true }
  );

  doc.fontSize(14).fillColor(COLORS.secondary).text('What surprised me most:', 50, 220);
  doc.fontSize(12).fillColor(COLORS.kid_handwriting).text(
    'That buildings can be 2000 years old and people still use them! Also that Romeo and Juliet is a real place people visit.',
    50, 245, { width: 500, oblique: true }
  );

  doc.fontSize(14).fillColor(COLORS.secondary).text('What I want to remember forever:', 50, 320);
  doc.fontSize(12).fillColor(COLORS.kid_handwriting).text(
    'The taste of real Italian gelato, the view from the tower, and how the Arena looked at night with all the candles lit up like stars.',
    50, 345, { width: 500, oblique: true }
  );

  doc.fontSize(14).fillColor(COLORS.secondary).text('I would rate this trip:', 50, 420);
  doc.fontSize(24).text('⭐⭐⭐⭐⭐', 50, 445);
  doc.fontSize(12).fillColor(COLORS.kid_handwriting).text('FIVE STARS! Best trip ever!!!', 200, 455, { oblique: true });

  doc.fontSize(14).fillColor(COLORS.secondary).text('My signature:', 50, 520);
  doc.fontSize(18).fillColor(COLORS.kid_handwriting).text('Sophia ❤️', 50, 550, { oblique: true });
  doc.fontSize(12).text('World Traveler, Age 9', 50, 580);

  // Gelato count
  doc.roundedRect(350, 480, 180, 100, 10).fill(COLORS.light);
  doc.fontSize(12).fillColor(COLORS.primary).text('Gelato Count:', 370, 500);
  doc.fontSize(48).text('🍦', 365, 520);
  doc.fontSize(24).fillColor(COLORS.secondary).text('x 14!', 420, 540);

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('  ✓ Completed journal generated');
      resolve(outputPath);
    });
  });
}

// Generate holiday card PDF
async function generateHolidayCard() {
  console.log('Generating holiday card...');

  const doc = new PDFDocument({ size: [504, 360], margin: 20 }); // 7x5 inches
  const outputPath = path.join(OUTPUT_DIR, 'holiday-card.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Background
  doc.rect(0, 0, 504, 360).fill('#FDF6E3');

  // Border
  doc.roundedRect(10, 10, 484, 340, 15).stroke(COLORS.secondary);
  doc.roundedRect(15, 15, 474, 330, 12).stroke(COLORS.light);

  // Header
  doc.fontSize(28).fillColor(COLORS.secondary).text('Greetings from Verona!', 20, 30, { align: 'center' });

  // Decorative icons
  doc.fontSize(35).text('🏛️', 40, 70);
  doc.fontSize(35).text('🍕', 420, 70);

  // Main content box
  doc.roundedRect(40, 110, 424, 140, 10).fill('#FFFFFF');

  // Photo placeholder boxes (simulating journal pages)
  doc.roundedRect(50, 120, 95, 70, 5).fill(COLORS.cream).stroke(COLORS.accent);
  doc.fontSize(8).fillColor(COLORS.accent).text('Arena at night', 55, 165, { width: 85, align: 'center' });

  doc.roundedRect(155, 120, 95, 70, 5).fill(COLORS.cream).stroke(COLORS.accent);
  doc.fontSize(8).text("Juliet's Balcony", 160, 165, { width: 85, align: 'center' });

  doc.roundedRect(260, 120, 95, 70, 5).fill(COLORS.cream).stroke(COLORS.accent);
  doc.fontSize(8).text('Making Pasta!', 265, 165, { width: 85, align: 'center' });

  doc.roundedRect(365, 120, 95, 70, 5).fill(COLORS.cream).stroke(COLORS.accent);
  doc.fontSize(8).text('Lake Garda', 370, 165, { width: 85, align: 'center' });

  // Icons in boxes
  doc.fontSize(24).fillColor(COLORS.primary);
  doc.text('🏟️', 75, 130);
  doc.text('💕', 180, 130);
  doc.text('🍝', 285, 130);
  doc.text('⛵', 390, 130);

  // Message
  doc.fontSize(12).fillColor(COLORS.kid_handwriting);
  doc.text("I had the BEST time in Verona! I saw where Romeo and Juliet lived,", 50, 200, { align: 'center', width: 400, oblique: true });
  doc.text("watched an opera under the stars, and ate 14 gelatos! - Sophia, age 9", 50, 218, { align: 'center', width: 400, oblique: true });

  // Footer
  doc.fontSize(14).fillColor(COLORS.primary).text('Summer 2025', 20, 270, { align: 'center' });
  doc.fontSize(10).fillColor(COLORS.accent).text('Made with love from our travel journal', 20, 290, { align: 'center' });

  // Hearts
  doc.fontSize(20).fillColor(COLORS.secondary);
  doc.text('❤️', 60, 310);
  doc.text('🇮🇹', 230, 310);
  doc.text('❤️', 400, 310);

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('  ✓ Holiday card generated');
      resolve(outputPath);
    });
  });
}

// Generate school presentation slides
async function generateSchoolSlides() {
  console.log('Generating school presentation slides...');

  const doc = new PDFDocument({ size: [792, 612], margin: 40 }); // Landscape
  const outputPath = path.join(OUTPUT_DIR, 'school-slides.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const slides = [
    {
      title: 'My Trip to Verona, Italy',
      subtitle: 'By Sophia, Age 9',
      content: 'Summer 2025 • 8 Days of Adventure',
      icon: '🇮🇹'
    },
    {
      title: 'Where is Verona?',
      content: '• Verona is a city in northern Italy\n• It is in the Veneto region\n• About 2 hours from Venice\n• Population: 260,000 people\n• Famous for Romeo and Juliet!',
      icon: '🗺️'
    },
    {
      title: 'The Arena di Verona',
      content: '• Built by the Romans 2,000 years ago!\n• One of the best preserved ancient amphitheaters\n• Used to have gladiator fights\n• Now they have operas and concerts\n• I watched an opera there at night with candles!',
      icon: '🏛️'
    },
    {
      title: "Romeo and Juliet's Verona",
      content: "• Shakespeare set his famous play here\n• We visited Juliet's house and balcony\n• People leave love notes on the walls\n• There's a statue of Juliet for good luck\n• I touched her hand!",
      icon: '💕'
    },
    {
      title: 'Italian Food I Tried',
      content: '• Pizza - way better than at home!\n• Pasta - I learned to make it from scratch\n• Gelato - I had 14 gelatos in 8 days!\n• Tiramisu - chocolate and cream dessert\n• Gnocchi - little potato pillows',
      icon: '🍕'
    },
    {
      title: 'Cool Things I Did',
      content: '• Climbed 368 steps up Torre dei Lamberti\n• Watched opera at the ancient Arena\n• Took a cooking class with an Italian grandma\n• Visited a castle (Castelvecchio)\n• Took a boat on Lake Garda',
      icon: '⭐'
    },
    {
      title: 'Italian Words I Learned',
      content: '• Ciao (chow) = Hello/Goodbye\n• Grazie (GRAT-see-eh) = Thank you\n• Bellissimo = Very beautiful\n• Delizioso = Delicious\n• Arrivederci = Goodbye (see you again)',
      icon: '🗣️'
    },
    {
      title: 'What I Learned',
      content: '• Buildings can last 2,000 years!\n• Italians eat dinner really late (8-9pm)\n• Opera is actually pretty cool\n• Making pasta is fun but messy\n• Gelato is the best invention ever',
      icon: '💡'
    },
    {
      title: 'My Favorite Memory',
      content: 'Watching the opera at the Arena at night. Everyone lit candles and it looked like magic. There were elephants on stage (fake ones) and the singing was SO loud!',
      icon: '✨'
    },
    {
      title: 'Thank You!',
      subtitle: 'Questions?',
      content: 'I would rate this trip: ⭐⭐⭐⭐⭐\n\nI want to go back to Italy someday!',
      icon: '🙋'
    }
  ];

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) doc.addPage();

    const slide = slides[i];

    // Background
    doc.rect(0, 0, 792, 612).fill('#FFFFFF');

    // Header bar
    doc.rect(0, 0, 792, 80).fill(COLORS.primary);

    // Icon
    doc.fontSize(40).fillColor('#FFFFFF').text(slide.icon, 30, 18);

    // Title
    doc.fontSize(32).fillColor('#FFFFFF').text(slide.title, 90, 25, { width: 650 });

    if (slide.subtitle) {
      doc.fontSize(18).fillColor(COLORS.light).text(slide.subtitle, 90, 52);
    }

    // Content
    doc.fontSize(24).fillColor(COLORS.primary);
    doc.text(slide.content, 60, 130, { width: 670, lineGap: 12 });

    // Page number
    doc.fontSize(12).fillColor(COLORS.accent).text(`${i + 1} / ${slides.length}`, 700, 580);

    // Footer decoration
    doc.rect(0, 595, 792, 17).fill(COLORS.secondary);
  }

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('  ✓ School slides generated');
      resolve(outputPath);
    });
  });
}

// Generate social clip thumbnail/poster
async function generateSocialClip() {
  console.log('Generating social clip poster...');

  const doc = new PDFDocument({ size: [405, 720], margin: 20 }); // 9:16 ratio
  const outputPath = path.join(OUTPUT_DIR, 'social-clip-poster.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Background gradient simulation
  doc.rect(0, 0, 405, 720).fill('#1D3557');
  doc.rect(0, 500, 405, 220).fill('#E63946');

  // Decorative circles
  doc.circle(50, 100, 80).fill('#457B9D').opacity(0.3);
  doc.circle(350, 200, 60).fill('#A8DADC').opacity(0.3);
  doc.opacity(1);

  // Top text
  doc.fontSize(16).fillColor('#A8DADC').text("SOPHIA'S ADVENTURE", 20, 50, { align: 'center' });

  // Main title
  doc.fontSize(48).fillColor('#FFFFFF').text('VERONA', 20, 180, { align: 'center' });
  doc.fontSize(24).fillColor('#F1FAEE').text('ITALY 2025', 20, 240, { align: 'center' });

  // Center icon
  doc.fontSize(100).text('🏛️', 130, 300);

  // Highlight moments
  doc.fontSize(14).fillColor('#FFFFFF');
  const moments = ['🎭 Opera under the stars', '🍝 Made pasta from scratch', '💕 Visited Juliets balcony', '🍦 14 gelatos in 8 days!'];
  let y = 450;
  for (const moment of moments) {
    doc.text(moment, 20, y, { align: 'center' });
    y += 25;
  }

  // Bottom section
  doc.fontSize(20).fillColor('#FFFFFF').text('8 Days of Magic', 20, 570, { align: 'center' });
  doc.fontSize(28).text('✨ Watch the journey ✨', 20, 610, { align: 'center' });

  // Play button
  doc.circle(202, 670, 25).fill('#FFFFFF');
  doc.fontSize(20).fillColor(COLORS.primary).text('▶', 192, 658);

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('  ✓ Social clip poster generated');
      resolve(outputPath);
    });
  });
}

// Generate memory video poster (since we can't generate actual video)
async function generateVideoPreview() {
  console.log('Generating video preview poster...');

  const doc = new PDFDocument({ size: [854, 480], margin: 0 }); // 16:9 HD
  const outputPath = path.join(OUTPUT_DIR, 'memory-video-preview.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Background
  doc.rect(0, 0, 854, 480).fill('#1D3557');

  // Film strip decorations
  doc.rect(0, 0, 854, 40).fill('#000000');
  doc.rect(0, 440, 854, 40).fill('#000000');
  for (let x = 20; x < 854; x += 60) {
    doc.rect(x, 8, 25, 24).fill('#FFFFFF');
    doc.rect(x, 448, 25, 24).fill('#FFFFFF');
  }

  // Title
  doc.fontSize(36).fillColor('#FFFFFF').text("Sophia's Verona Adventure", 0, 80, { align: 'center', width: 854 });
  doc.fontSize(18).fillColor('#A8DADC').text('A Memory Video', 0, 125, { align: 'center', width: 854 });

  // Photo thumbnails simulation
  const thumbs = ['🏛️', '💕', '🍝', '🏰', '⛵'];
  let tx = 127;
  for (const thumb of thumbs) {
    doc.roundedRect(tx, 180, 100, 75, 5).fill('#F1FAEE');
    doc.fontSize(35).fillColor(COLORS.primary).text(thumb, tx + 30, 195);
    tx += 130;
  }

  // Play button
  doc.circle(427, 330, 50).fill('#E63946');
  doc.fontSize(40).fillColor('#FFFFFF').text('▶', 410, 305);

  // Duration
  doc.fontSize(14).fillColor('#FFFFFF').text('Duration: 1:24', 0, 400, { align: 'center', width: 854 });
  doc.fontSize(12).fillColor('#A8DADC').text('Music: Italian Summer • Ken Burns effect • Animated transitions', 0, 420, { align: 'center', width: 854 });

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('  ✓ Video preview generated');
      resolve(outputPath);
    });
  });
}

// Generate demo metadata
async function generateMetadata() {
  console.log('Generating demo metadata...');

  const metadata = {
    id: DEMO_DATA.journalId,
    destination: DEMO_DATA.destination,
    childName: DEMO_DATA.childName,
    childAge: DEMO_DATA.childAge,
    tripDays: DEMO_DATA.tripDays,
    tripDates: {
      start: '2025-07-21',
      end: '2025-07-28'
    },
    status: 'memories_generated',
    artifacts: {
      originalJournal: '/samples/verona-sample.pdf',
      completedJournal: '/demo/verona/completed-journal.pdf',
      memoryVideo: '/demo/verona/memory-video-preview.pdf',
      holidayCard: '/demo/verona/holiday-card.pdf',
      schoolSlides: '/demo/verona/school-slides.pdf',
      socialClip: '/demo/verona/social-clip-poster.pdf'
    },
    stats: {
      pagesCompleted: 12,
      wordsLearned: 8,
      gelatoCount: 14,
      rating: 5
    },
    highlights: [
      'Opera at the Arena under candlelight',
      'Making pasta with Nonna',
      'Climbing 368 steps up Torre dei Lamberti',
      'Visiting Juliets balcony',
      'Boat ride on Lake Garda'
    ],
    generatedAt: new Date().toISOString()
  };

  const outputPath = path.join(OUTPUT_DIR, 'demo-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log('  ✓ Metadata generated');

  return metadata;
}

// Main function
async function generateAllDemoArtifacts() {
  console.log('\n🎨 Generating Verona Demo Artifacts\n');
  console.log(`Child: ${DEMO_DATA.childName}, Age ${DEMO_DATA.childAge}`);
  console.log(`Destination: ${DEMO_DATA.destination}`);
  console.log(`Trip: ${DEMO_DATA.tripDays} days\n`);

  try {
    await generateCompletedJournal();
    await generateHolidayCard();
    await generateSchoolSlides();
    await generateSocialClip();
    await generateVideoPreview();
    await generateMetadata();

    console.log('\n✅ All demo artifacts generated successfully!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

    // List files
    const files = fs.readdirSync(OUTPUT_DIR);
    console.log('Generated files:');
    for (const file of files) {
      const stats = fs.statSync(path.join(OUTPUT_DIR, file));
      const size = (stats.size / 1024).toFixed(1);
      console.log(`  • ${file} (${size} KB)`);
    }

  } catch (error) {
    console.error('Error generating demo:', error);
  }
}

generateAllDemoArtifacts();
