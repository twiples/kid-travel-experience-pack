import { generateJournal } from '../services/journalGenerator.js';
import { generatePDF } from '../services/pdfGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample configurations for 5 example journals (second-tier/less touristy destinations)
const SAMPLE_CONFIGS = [
  {
    id: 'osaka-sample',
    destination: 'osaka',
    childName: 'Emma',
    childAge: 8,
    interests: ['food', 'culture'],
    startDate: '2025-03-15',
    endDate: '2025-03-21',
    tripType: ['city', 'cultural'],
    landmarks: 'Osaka Castle, Dotonbori, Universal Studios Japan',
  },
  {
    id: 'lyon-sample',
    destination: 'lyon',
    childName: 'Lucas',
    childAge: 10,
    interests: ['art', 'food'],
    startDate: '2025-04-10',
    endDate: '2025-04-14',
    tripType: ['city', 'cultural'],
    landmarks: 'Basilica of Notre-Dame de Fourvière, Parc de la Tête d\'Or, Old Lyon',
  },
  {
    id: 'moorea-sample',
    destination: 'moorea',
    childName: 'Oliver',
    childAge: 11,
    interests: ['nature', 'animals'],
    startDate: '2025-06-01',
    endDate: '2025-06-06',
    tripType: ['beach', 'nature'],
    landmarks: 'Belvedere Lookout, Temae Beach, Stingray World',
  },
  {
    id: 'bangkok-sample',
    destination: 'bangkok',
    childName: 'Mia',
    childAge: 9,
    interests: ['food', 'culture'],
    startDate: '2025-05-01',
    endDate: '2025-05-05',
    tripType: ['city', 'cultural'],
    landmarks: 'Grand Palace, Wat Pho, Chatuchak Weekend Market',
  },
  {
    id: 'verona-sample',
    destination: 'verona',
    childName: 'Sophia',
    childAge: 9,
    interests: ['history', 'art'],
    startDate: '2025-07-20',
    endDate: '2025-07-27',
    tripType: ['city', 'cultural'],
    landmarks: 'Arena di Verona, Juliet\'s House, Piazza delle Erbe',
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
