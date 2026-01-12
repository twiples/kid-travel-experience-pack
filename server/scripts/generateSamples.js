import { generateJournal } from '../services/journalGenerator.js';
import { generatePDF } from '../services/pdfGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample configurations for 5 example journals
const SAMPLE_CONFIGS = [
  {
    id: 'tokyo-sample',
    destination: 'tokyo',
    childName: 'Emma',
    childAge: 8,
    interests: ['food', 'culture'],
    startDate: '2025-03-15',
    endDate: '2025-03-21',
    tripType: ['city', 'cultural'],
    landmarks: 'Tokyo Tower, Senso-ji Temple, Shibuya Crossing',
  },
  {
    id: 'paris-sample',
    destination: 'paris',
    childName: 'Lucas',
    childAge: 10,
    interests: ['art', 'architecture'],
    startDate: '2025-04-10',
    endDate: '2025-04-14',
    tripType: ['city', 'cultural'],
    landmarks: 'Eiffel Tower, Louvre Museum, Notre-Dame',
  },
  {
    id: 'hawaii-sample',
    destination: 'hawaii',
    childName: 'Sophia',
    childAge: 9,
    interests: ['nature', 'animals'],
    startDate: '2025-06-01',
    endDate: '2025-06-06',
    tripType: ['beach', 'nature'],
    landmarks: 'Waikiki Beach, Diamond Head, Pearl Harbor',
  },
  {
    id: 'london-sample',
    destination: 'london',
    childName: 'Oliver',
    childAge: 11,
    interests: ['history', 'transportation'],
    startDate: '2025-07-20',
    endDate: '2025-07-27',
    tripType: ['city', 'cultural'],
    landmarks: 'Big Ben, Tower of London, Buckingham Palace',
  },
  {
    id: 'orlando-sample',
    destination: 'orlando',
    childName: 'Mia',
    childAge: 8,
    interests: ['sports', 'animals'],
    startDate: '2025-05-01',
    endDate: '2025-05-04',
    tripType: ['theme-park'],
    landmarks: 'Magic Kingdom, Universal Studios, SeaWorld',
  },
];

async function generateSamples() {
  const outputDir = path.join(__dirname, '../../public/samples');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating sample PDFs...\n');

  for (const config of SAMPLE_CONFIGS) {
    try {
      console.log(`Generating ${config.id}...`);

      // Generate journal content
      const journalData = {
        destination: config.destination,
        startDate: config.startDate,
        endDate: config.endDate,
        tripType: config.tripType,
        landmarks: config.landmarks,
        childName: config.childName,
        childAge: config.childAge,
        interests: config.interests,
      };

      const content = await generateJournal(journalData);

      // Generate PDF
      const outputPath = path.join(outputDir, `${config.id}.pdf`);
      await generatePDF(content, journalData, outputPath);

      // Get file size
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`  ✓ Created ${config.id}.pdf (${fileSizeMB} MB, ${content.pageCount} pages)\n`);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${config.id}:`, error.message);
    }
  }

  console.log('Done! Sample PDFs saved to public/samples/');

  // Generate metadata JSON for frontend
  const metadata = SAMPLE_CONFIGS.map(config => ({
    id: config.id,
    destination: config.destination.charAt(0).toUpperCase() + config.destination.slice(1),
    childName: config.childName,
    childAge: config.childAge,
    interests: config.interests,
    tripDays: Math.ceil((new Date(config.endDate) - new Date(config.startDate)) / (1000 * 60 * 60 * 24)) + 1,
    fileName: `${config.id}.pdf`,
    downloadUrl: `/samples/${config.id}.pdf`,
  }));

  const metadataPath = path.join(__dirname, '../../src/data/samples.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('\nMetadata saved to src/data/samples.json');
}

generateSamples().catch(console.error);
