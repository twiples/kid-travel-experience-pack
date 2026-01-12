import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateJournal } from './services/journalGenerator.js';
import { generatePDF } from './services/pdfGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist folder in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve sample PDFs
const samplesPath = path.join(__dirname, '..', 'public', 'samples');
if (fs.existsSync(samplesPath)) {
  app.use('/samples', express.static(samplesPath));
}

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG files are allowed'));
    }
  }
});

// In-memory storage for journals (would use a database in production)
const journals = new Map();

// In-memory storage for memory uploads
const memoryUploads = new Map();

// Ensure output directory exists
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure memories upload directory exists
const memoriesUploadDir = path.join(__dirname, 'uploads', 'memories');
if (!fs.existsSync(memoriesUploadDir)) {
  fs.mkdirSync(memoriesUploadDir, { recursive: true });
}

// Memory photos upload config
const memoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const journalDir = path.join(memoriesUploadDir, req.params.journalId);
    if (!fs.existsSync(journalDir)) {
      fs.mkdirSync(journalDir, { recursive: true });
    }
    cb(null, journalDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `page_${Date.now()}${ext}`);
  }
});

const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per photo
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes

// Create journal
app.post('/api/journal/create', upload.single('familyPhoto'), async (req, res) => {
  try {
    const journalId = uuidv4();

    const journalData = {
      id: journalId,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      tripType: JSON.parse(req.body.tripType || '[]'),
      landmarks: req.body.landmarks || '',
      childName: req.body.childName,
      childAge: parseInt(req.body.childAge, 10),
      interests: JSON.parse(req.body.interests || '[]'),
      familyPhoto: req.file ? req.file.path : null,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
    };

    journals.set(journalId, journalData);

    // Start generation in background
    generateJournalAsync(journalId, journalData);

    res.json({ journalId, status: 'processing' });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ error: 'Failed to create journal' });
  }
});

// Check journal status
app.get('/api/journal/status/:journalId', (req, res) => {
  const journal = journals.get(req.params.journalId);

  if (!journal) {
    return res.status(404).json({ error: 'Journal not found' });
  }

  res.json({
    status: journal.status,
    progress: journal.progress,
    error: journal.error,
  });
});

// Get journal info
app.get('/api/journal/info/:journalId', (req, res) => {
  const journal = journals.get(req.params.journalId);

  if (!journal) {
    return res.status(404).json({ error: 'Journal not found' });
  }

  const startDate = new Date(journal.startDate);
  const endDate = new Date(journal.endDate);
  const tripDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  res.json({
    childName: journal.childName,
    destination: journal.destination,
    tripDays,
    pageCount: journal.pageCount || 25,
    fileSize: journal.fileSize || '~5 MB',
  });
});

// Download journal PDF
app.get('/api/journal/download/:journalId', (req, res) => {
  const journal = journals.get(req.params.journalId);

  if (!journal) {
    return res.status(404).json({ error: 'Journal not found' });
  }

  if (journal.status !== 'completed') {
    return res.status(400).json({ error: 'Journal not ready' });
  }

  const pdfPath = journal.pdfPath;

  if (!pdfPath || !fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'PDF not found' });
  }

  const filename = `${journal.childName.replace(/[^a-z0-9]/gi, '_')}_Travel_Journal.pdf`;

  res.download(pdfPath, filename);
});

// Async journal generation
async function generateJournalAsync(journalId, journalData) {
  try {
    const journal = journals.get(journalId);

    // Step 1: Generate content
    journal.progress = 0.2;
    journals.set(journalId, journal);

    const content = await generateJournal(journalData);

    // Step 2: Update progress
    journal.progress = 0.5;
    journals.set(journalId, journal);

    // Step 3: Generate PDF
    journal.progress = 0.8;
    journals.set(journalId, journal);

    const pdfPath = path.join(outputDir, `${journalId}.pdf`);
    await generatePDF(content, journalData, pdfPath);

    // Step 4: Complete
    journal.status = 'completed';
    journal.progress = 1;
    journal.pdfPath = pdfPath;
    journal.pageCount = content.pageCount || 25;

    // Get file size
    const stats = fs.statSync(pdfPath);
    journal.fileSize = `${(stats.size / (1024 * 1024)).toFixed(1)} MB`;

    journals.set(journalId, journal);

    // Clean up uploaded photo
    if (journalData.familyPhoto && fs.existsSync(journalData.familyPhoto)) {
      fs.unlinkSync(journalData.familyPhoto);
    }
  } catch (error) {
    console.error('Error generating journal:', error);
    const journal = journals.get(journalId);
    journal.status = 'error';
    journal.error = error.message;
    journals.set(journalId, journal);
  }
}

// ============================================
// MEMORIES API ROUTES
// ============================================

// Upload journal photos for memory generation
app.post('/api/memories/:journalId/upload', memoryUpload.array('photos', 50), async (req, res) => {
  try {
    const { journalId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No photos uploaded' });
    }

    // Store uploaded files info
    const uploadData = {
      journalId,
      photos: files.map((file, index) => ({
        id: uuidv4(),
        path: file.path,
        filename: file.filename,
        pageType: req.body[`pageTypes[${index}]`] || 'daily',
        uploadedAt: new Date()
      })),
      status: 'uploaded',
      uploadedAt: new Date()
    };

    memoryUploads.set(journalId, uploadData);

    res.json({
      success: true,
      photoCount: files.length,
      journalId
    });
  } catch (error) {
    console.error('Error uploading memories:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get memory upload status
app.get('/api/memories/:journalId/status', (req, res) => {
  const { journalId } = req.params;
  const upload = memoryUploads.get(journalId);

  if (!upload) {
    return res.status(404).json({ error: 'No uploads found for this journal' });
  }

  res.json({
    status: upload.status,
    photoCount: upload.photos?.length || 0,
    products: upload.products || null
  });
});

// Generate memory products (prototype - simulated)
app.post('/api/memories/:journalId/generate', async (req, res) => {
  try {
    const { journalId } = req.params;
    const upload = memoryUploads.get(journalId);

    if (!upload) {
      return res.status(404).json({ error: 'No uploads found' });
    }

    // Update status to processing
    upload.status = 'processing';
    memoryUploads.set(journalId, upload);

    // Simulate processing time
    setTimeout(() => {
      upload.status = 'completed';
      upload.products = {
        video: {
          url: `/api/memories/${journalId}/download/video`,
          format: 'mp4',
          ready: true
        },
        cards: {
          templates: [
            { id: 1, url: `/api/memories/${journalId}/download/card/1` },
            { id: 2, url: `/api/memories/${journalId}/download/card/2` },
            { id: 3, url: `/api/memories/${journalId}/download/card/3` },
            { id: 4, url: `/api/memories/${journalId}/download/card/4` }
          ],
          ready: true
        },
        slides: {
          url: `/api/memories/${journalId}/download/slides`,
          format: 'pdf',
          ready: true
        },
        social: {
          clips: [
            { format: 'instagram', url: `/api/memories/${journalId}/download/social/instagram` },
            { format: 'tiktok', url: `/api/memories/${journalId}/download/social/tiktok` }
          ],
          ready: true
        }
      };
      memoryUploads.set(journalId, upload);
    }, 3000);

    res.json({
      success: true,
      status: 'processing',
      message: 'Memory generation started'
    });
  } catch (error) {
    console.error('Error generating memories:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Get generated products
app.get('/api/memories/:journalId/products', (req, res) => {
  const { journalId } = req.params;
  const upload = memoryUploads.get(journalId);

  if (!upload || !upload.products) {
    return res.status(404).json({ error: 'Products not ready' });
  }

  res.json({ products: upload.products });
});

// Download memory product (placeholder for prototype)
app.get('/api/memories/:journalId/download/:type', (req, res) => {
  const { journalId, type } = req.params;

  // For prototype, return a placeholder response
  res.json({
    message: `Download endpoint for ${type}`,
    note: 'In production, this would return the actual file',
    journalId,
    type
  });
});

// Serve React app for all other routes (must be after API routes)
if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
