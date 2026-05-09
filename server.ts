import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
