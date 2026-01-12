import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load destinations data
const destinationsPath = path.join(__dirname, '../../src/data/destinations.json');
const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));

export async function generateJournal(journalData) {
  const {
    destination,
    startDate,
    endDate,
    tripType,
    landmarks,
    childName,
    childAge,
    interests,
  } = journalData;

  // Calculate trip days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Get destination data
  const destData = destinations[destination.toLowerCase()] || createGenericDestination(destination);

  // Generate journal content
  const content = {
    childName,
    childAge,
    destination: destData.name || destination,
    country: destData.country || '',
    tripDays,
    startDate,
    endDate,
    interests,
    tripType,
    landmarks: landmarks.split(',').map(l => l.trim()).filter(Boolean),

    // Pre-trip section
    preTrip: generatePreTripSection(destData, childName, interests),

    // Activities section
    activities: generateActivitiesSection(destData),

    // Daily journal pages
    dailyPages: generateDailyPages(destData, tripDays, interests, childName),

    pageCount: calculatePageCount(tripDays),
  };

  return content;
}

function generatePreTripSection(destData, childName, interests) {
  return {
    welcomeLetter: `Dear ${childName},\n\nYou are about to become an explorer! This journal is your secret place to capture everything you discover in ${destData.name}.\n\nYears from now, you'll read these pages and remember exactly how you felt, what made you laugh, and all the amazing things you learned. Your words and drawings are more precious than any souvenir you could buy.\n\nThere are no wrong answers here - just YOUR thoughts, YOUR feelings, and YOUR adventure. Be curious. Ask questions. Try new things. And most importantly, have fun!\n\nYour adventure awaits!`,

    destinationFacts: {
      language: destData.language,
      currency: destData.currency,
      population: destData.population,
      funFacts: destData.funFacts || [],
      culturalHighlights: destData.culturalHighlights || [],
    },

    usefulPhrases: [
      { phrase: destData.greeting, meaning: 'Hello' },
      { phrase: destData.thankyou, meaning: 'Thank you' },
      { phrase: destData.goodbye, meaning: 'Goodbye' },
    ],

    landmarks: destData.landmarks || [],

    packingChecklist: [
      'This journal and pencils',
      'Comfortable walking shoes',
      'Weather-appropriate clothes',
      'Camera or phone for photos',
      'Reusable water bottle',
      'Snacks for the plane',
    ],

    preflightPrompts: [
      `What do you imagine ${destData.name} will look, sound, and smell like?`,
      'What is one thing you hope to learn or discover on this trip?',
      'What is something you\'ve never done before that you want to try?',
      'Write a wish or hope you have for this adventure:',
    ],
  };
}

function generateActivitiesSection(destData) {
  const activities = destData.activities || {};

  return {
    wordSearch: {
      title: `${destData.name} Word Search`,
      words: activities.wordSearch || ['TRAVEL', 'ADVENTURE', 'EXPLORE', 'DISCOVER', 'JOURNEY', 'VACATION', 'FUN', 'MEMORIES'],
      grid: generateWordSearchGrid(activities.wordSearch || ['TRAVEL', 'ADVENTURE', 'EXPLORE', 'DISCOVER']),
    },

    trivia: activities.trivia || [
      { q: 'What country is your destination in?', a: destData.country },
      { q: 'What language do people speak there?', a: destData.language },
      { q: 'What currency do they use?', a: destData.currency },
    ],

    travelBingo: generateTravelBingo(destData),

    creativeChallenges: [
      `Design your own ${destData.emoji} postcard`,
      'Draw a map of your favorite day',
      `Create a comic strip about your adventure`,
      'Design a souvenir you wish existed',
    ],
  };
}

function generateDailyPages(destData, tripDays, interests, childName) {
  const pages = [];
  const prompts = destData.prompts || {};
  const observationPrompts = prompts.observation || getDefaultObservationPrompts();
  const reflectionPrompts = prompts.reflection || getDefaultReflectionPrompts();
  const interestPrompts = prompts.interests || {};

  for (let day = 1; day <= tripDays; day++) {
    const dayPrompts = [];

    // Add 1-2 observation prompts
    dayPrompts.push(observationPrompts[(day - 1) % observationPrompts.length]);
    if (day % 2 === 0 && observationPrompts.length > 1) {
      dayPrompts.push(observationPrompts[(day) % observationPrompts.length]);
    }

    // Add interest-based prompts (1 per interest, rotating)
    interests.forEach((interest, idx) => {
      const interestPromptsArr = interestPrompts[interest] || [];
      if (interestPromptsArr.length > 0) {
        const promptIdx = (day - 1 + idx) % interestPromptsArr.length;
        if (day % (idx + 2) === 1) { // Spread interest prompts across days
          dayPrompts.push(interestPromptsArr[promptIdx]);
        }
      }
    });

    // Add reflection prompt every other day
    if (day % 2 === 0) {
      dayPrompts.push(reflectionPrompts[(day - 1) % reflectionPrompts.length]);
    }

    pages.push({
      dayNumber: day,
      location: destData.name,
      prompts: dayPrompts.slice(0, 4), // Max 4 prompts per day
      sketchPrompt: getSketchPrompt(day, destData),
      moodTracker: true,
      newWordSection: {
        label: 'New word I learned today:',
        language: destData.language,
      },
    });
  }

  return pages;
}

function getSketchPrompt(day, destData) {
  const sketchPrompts = [
    'Draw something amazing you saw today',
    'Sketch your favorite meal',
    'Draw the view from where you are',
    `Draw yourself exploring ${destData.name}`,
    'Illustrate your favorite moment',
    'Draw something that surprised you',
    'Sketch a building or landmark',
    'Draw something you want to remember',
  ];
  return sketchPrompts[(day - 1) % sketchPrompts.length];
}

function getDefaultObservationPrompts() {
  return [
    // Mindfulness & sensory awareness
    'Close your eyes for 10 seconds. What sounds do you hear? What does this place sound like?',
    'What colors do you see around you that you don\'t see at home?',
    'Find something beautiful that most people might walk past without noticing. Draw or describe it.',

    // Curiosity & wonder
    'What is something here that makes you think "Wow!" or "How does that work?"',
    'If you were an explorer discovering this place for the first time, what would you write in your explorer\'s log?',
    'What question would you ask someone who has lived here their whole life?',

    // Perspective-taking & empathy
    'Imagine you live here. What would your morning routine be like?',
    'Watch the people around you for a minute. What do you think makes them happy?',
    'What is something people here do differently that you think is actually a really good idea?',

    // Growth mindset & courage
    'What is something new you tried today, even if it felt a little scary at first?',
    'What did you learn today that surprised you?',
    'If you came back here in 10 years, what do you think would be different?',
  ];
}

function getDefaultReflectionPrompts() {
  return [
    // Gratitude & appreciation
    'Write down 3 things from today that made you smile or feel happy.',
    'Who helped make today special? What would you want to say to thank them?',
    'What is something you saw today that you want to remember forever?',

    // Emotional intelligence & self-awareness
    'How did you feel at different moments today? Draw faces to show your emotions.',
    'What was the bravest thing you did today?',
    'Was there a moment today when you felt proud of yourself? What happened?',

    // Connection & empathy
    'Did you meet anyone interesting today? What did you learn from them?',
    'What is one way you helped someone in your family today?',
    'If you could send a postcard to your future self about today, what would it say?',

    // Growth & learning
    'What is something you couldn\'t do before this trip that you can do now?',
    'What mistake did you make today, and what did it teach you?',
    'If a younger kid was going to visit this place, what advice would you give them?',

    // Creativity & imagination
    'If today was a chapter in a book about your life, what would you title it?',
    'Design a souvenir that doesn\'t exist yet - something that would help you remember this day.',
    'What would you change about today if you could do it all over again?',
  ];
}

function generateWordSearchGrid(words) {
  const size = 12;
  const grid = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  );

  // Place words (simplified - just marks where words should go)
  // In a real implementation, you'd properly place words in the grid

  return grid;
}

function generateTravelBingo(destData) {
  const items = [
    'See a local animal',
    'Try new food',
    'Learn a new word',
    'Take a silly photo',
    'Make someone smile',
    'Find something blue',
    'See a street performer',
    'Walk 10,000 steps',
    'FREE SPACE',
    'Buy a souvenir',
    'See something ancient',
    'Eat dessert',
    'Ride public transport',
    'See a sunset',
    'Draw a picture',
    'Find a cool door',
  ];

  // Add destination-specific items
  if (destData.landmarks) {
    destData.landmarks.slice(0, 3).forEach(landmark => {
      items.push(`Visit ${landmark}`);
    });
  }

  return items.slice(0, 16); // 4x4 bingo
}

function createGenericDestination(name) {
  // Create thoughtful, inspiring default content for any destination
  return {
    name,
    country: '',
    language: 'Local language',
    currency: 'Local currency',
    greeting: 'Hello',
    thankyou: 'Thank you',
    goodbye: 'Goodbye',
    population: 'Discover it yourself!',
    funFacts: [
      `${name} has its own unique story waiting for you to discover`,
      'Every new place teaches us something about ourselves and the world',
      'The best explorers are curious and ask lots of questions',
      'Local people love sharing what makes their home special',
    ],
    landmarks: [],
    culturalHighlights: [
      'Watch how people greet each other - is it different from home?',
      'Try to learn one new word in the local language each day',
      'Notice the foods people eat - what looks delicious to try?',
      'Look at the buildings and art - what stories do they tell?',
    ],
    prompts: {
      observation: getDefaultObservationPrompts(),
      reflection: getDefaultReflectionPrompts(),
      interests: {},
    },
    activities: {
      wordSearch: ['EXPLORE', 'DISCOVER', 'ADVENTURE', 'WONDER', 'JOURNEY', 'MEMORY', 'FRIENDS', 'LEARN'],
      trivia: [
        { q: `What is one thing that makes ${name} special?`, a: 'Your discovery!' },
        { q: 'What language do you hear people speaking?', a: 'Listen and find out!' },
        { q: 'What is something new you want to try here?', a: 'Your choice!' },
      ],
    },
  };
}

function calculatePageCount(tripDays) {
  // Pre-trip: 4-8 pages
  // Activities: 6-10 pages
  // Daily pages: 2 per day
  // Buffer: 4 pages
  return 8 + 8 + (tripDays * 2) + 4;
}
