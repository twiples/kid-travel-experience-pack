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
    welcomeLetter: `Dear ${childName},\n\nGet ready for an amazing adventure to ${destData.name}! This journal is all yours - a special place to write down everything you see, learn, and experience.\n\nUse it to capture your thoughts, draw pictures, and remember all the wonderful moments from your trip. There are no wrong answers - just be curious and have fun!\n\nHappy travels!`,

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
      `What are you most excited to see in ${destData.name}?`,
      'What do you already know about this place?',
      'What questions do you want to find answers to?',
      'What foods are you curious to try?',
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
    'What is the first thing you notice when you look around?',
    'Describe the sounds you hear right now.',
    'What smells are in the air?',
    'How are people around you dressed differently than at home?',
  ];
}

function getDefaultReflectionPrompts() {
  return [
    'What was the most surprising thing you experienced today?',
    'What would you tell your friends about this place?',
    'How is this place different from home?',
    'What will you remember most about today?',
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
  return {
    name,
    country: '',
    language: 'Local language',
    currency: 'Local currency',
    greeting: 'Hello',
    thankyou: 'Thank you',
    goodbye: 'Goodbye',
    population: 'Check it out!',
    funFacts: [
      'Every place has its own unique story',
      'Traveling teaches us about different cultures',
      'The best adventures are ones where you try new things',
    ],
    landmarks: [],
    culturalHighlights: [
      'Observe how locals greet each other',
      'Notice what people eat for breakfast',
      'Look at how the buildings are designed',
    ],
    prompts: {
      observation: getDefaultObservationPrompts(),
      reflection: getDefaultReflectionPrompts(),
      interests: {},
    },
    activities: {},
  };
}

function calculatePageCount(tripDays) {
  // Pre-trip: 4-8 pages
  // Activities: 6-10 pages
  // Daily pages: 2 per day
  // Buffer: 4 pages
  return 8 + 8 + (tripDays * 2) + 4;
}
