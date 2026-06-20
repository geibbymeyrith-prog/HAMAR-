import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running securely' });
  });

  // KBMS: Read raw HAMARE_PROJECT_KNOWLEDGE_BASE.md from disk
  app.get('/api/kb/raw', (req, res) => {
    try {
      const kbPath = path.join(process.cwd(), 'HAMARE_PROJECT_KNOWLEDGE_BASE.md');
      if (fs.existsSync(kbPath)) {
        const content = fs.readFileSync(kbPath, 'utf-8');
        res.json({ content, exists: true });
      } else {
        res.json({ content: '', exists: false, error: 'File not found on workspace disk' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to read knowledge base file' });
    }
  });

  // KBMS: Write updated HAMARE_PROJECT_KNOWLEDGE_BASE.md to disk
  app.post('/api/kb/save', (req, res) => {
    try {
      const { content } = req.body;
      if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content must be a string' });
      }
      const kbPath = path.join(process.cwd(), 'HAMARE_PROJECT_KNOWLEDGE_BASE.md');
      fs.writeFileSync(kbPath, content, 'utf-8');
      res.json({ success: true, message: 'HAMARE_PROJECT_KNOWLEDGE_BASE.md updated successfully on disk' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to write knowledge base file' });
    }
  });

  // Example secure endpoint for Gemini API (if needed in the future)
  // This illustrates how to keep the key on the server
  app.post('/api/ai/generate', async (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }
    
    // Here you would call GoogleGenAI using the 'key'
    // For now, we just acknowledge the security setup
    res.json({ 
      message: 'Secure AI endpoint ready. The API Key is not exposed to the client.' 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('API Keys are now protected on the server side.');
  });
}

startServer().catch(console.error);
