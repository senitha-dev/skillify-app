import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

// Modular Imports
import { connectDB, lastDbError } from './server/config/db';
import { requestLogger } from './server/middleware/logger';
import apiRoutes from './server/routes';

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(requestLogger);

// MongoDB Connection
connectDB();

// --- API ROUTES ---

// Health Check
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  const info = {
    status: 'ok',
    database: states[dbState],
    db_error: lastDbError,
    mongodb_uri_set: !!(process.env.MONGODB_URI || 'mongodb+srv://senitha_db_user:nD0htN4MehvHymWd@cluster0.kinvutx.mongodb.net/skillify_db?retryWrites=true&w=majority'),
    vite_api_url_set: !!process.env.VITE_API_URL,
    available_keys: Object.keys(process.env).filter(key => 
      key.includes('MONGODB') || key.includes('API') || key.includes('URL') || key.includes('SECRET')
    ),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  if (dbState !== 1) {
    connectDB();
  }
  
  res.json(info);
});

// Use Modular API Routes
app.use('/api', apiRoutes);

// 404 Handler for API routes
app.all('/api/*', (req, res) => {
  console.warn(`[API 404] ${req.method} ${req.path}`);
  res.status(404).json({ message: `API route not found: ${req.path}` });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[Global Error]', err);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
  }
  next(err);
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      try {
        let template = await fs.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
