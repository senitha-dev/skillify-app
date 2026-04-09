import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Question, CareerPath, AssessmentResult, LearningResource } from './src/models.ts';
import dns from 'dns';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  const isApi = req.path.startsWith('/api');
  if (isApi) {
    console.log(`[API Request] ${req.method} ${req.path}`);
  }
  
  // Intercept HTML responses for API routes
  const originalSend = res.send;
  res.send = function(body) {
    if (isApi && typeof body === 'string' && body.includes('<!doctype html>')) {
      console.error(`[CRITICAL] API route ${req.path} attempted to send HTML!`);
      return res.status(500).json({ 
        message: 'Internal Server Error: API route returned HTML instead of JSON',
        path: req.path
      });
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

let lastDbError: string | null = null;

const connectDB = async () => {
  if (!MONGODB_URI) {
    lastDbError = 'MONGODB_URI is missing. Please add it in the Secrets panel (Settings -> Secrets).';
    console.error('❌ CRITICAL ERROR:', lastDbError);
    return;
  }

  if (MONGODB_URI.trim() !== MONGODB_URI) {
    console.warn('⚠️ WARNING: MONGODB_URI has leading or trailing spaces!');
  }

  try {
    const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Attempting to connect to MongoDB with URI: ${maskedUri}`);
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      lastDbError = null;
      return;
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Successfully connected to MongoDB Atlas');
    lastDbError = null;
  } catch (err: any) {
    lastDbError = err.message;
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('querySrv ENOTFOUND')) {
      console.error('👉 Hint: This usually means the MongoDB URI is incorrect or DNS is blocked.');
    }
  }
};

connectDB();

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// Health Check
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  const info = {
    status: 'ok',
    database: states[dbState],
    db_error: lastDbError,
    mongodb_uri_set: !!process.env.MONGODB_URI,
    vite_api_url_set: !!process.env.VITE_API_URL,
    available_keys: Object.keys(process.env).filter(key => 
      key.includes('MONGODB') || key.includes('API') || key.includes('URL') || key.includes('SECRET')
    ),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  if (dbState !== 1 && process.env.MONGODB_URI) {
    connectDB();
  }
  
  res.json(info);
});

// Debug DB Connection
app.get('/api/debug/db', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: states[state],
    uri_info: MONGODB_URI ? `mongodb+srv://***@${MONGODB_URI.split('@')[1] || 'hidden'}` : 'Not Set',
    is_placeholder: MONGODB_URI?.includes('PASSWORD') || false
  });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
  console.log('Registration request received:', req.body.email);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login attempt:', req.body.email);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found', email);
      return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Login failed: Invalid password', email);
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Login successful:', email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Profile
app.get('/api/stats', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const history = await AssessmentResult.find({ userId }).sort({ completedAt: -1 });
    
    if (history.length === 0) {
      return res.json({
        overall: 0,
        programming: 0,
        data: 0,
        infra: 0,
        history: []
      });
    }

    const latest = history[0];
    const scores = latest.scores as Map<string, number>;
    
    // Simple category mapping for stats
    const categories = {
      programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'React', 'Angular', 'Vue', 'Node.js'],
      data: ['Data Analyst', 'ML', 'AI', 'SQL', 'Databases', 'Data Visualization'],
      infra: ['Cloud Platforms', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'System Admin']
    };

    const getAvg = (skillList: string[]) => {
      let sum = 0;
      let count = 0;
      for (const [skill, score] of Object.entries(Object.fromEntries(scores))) {
        if (skillList.some(s => skill.includes(s))) {
          sum += (score / 4) * 100;
          count++;
        }
      }
      return count > 0 ? Math.round(sum / count) : 0;
    };

    res.json({
      overall: Math.round(latest.overallProgress),
      programming: getAvg(categories.programming),
      data: getAvg(categories.data),
      infra: getAvg(categories.infra),
      history: history.map(h => ({
        name: new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short' }),
        progress: Math.round(h.overallProgress)
      })).reverse()
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Questions
app.get('/api/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Career Paths
app.get('/api/career-paths', authenticateToken, async (req, res) => {
  try {
    const paths = await CareerPath.find();
    res.json(paths);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Assessments
app.post('/api/assessments/submit', authenticateToken, async (req: any, res) => {
  try {
    const { scores } = req.body;
    const userId = req.user.id;

    // Update user skills
    const user = await User.findById(userId);
    if (user) {
      user.skills = new Map(Object.entries(scores));
      await user.save();
    }

    // Save result
    const result = new AssessmentResult({
      userId,
      scores,
      overallProgress: Object.values(scores as Record<string, number>).reduce((a, b) => a + b, 0) / (Object.keys(scores as Record<string, number>).length * 4) * 100
    });
    await result.save();

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/assessments/history', authenticateToken, async (req: any, res) => {
  try {
    const history = await AssessmentResult.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Learning Resources
app.get('/api/resources', authenticateToken, async (req, res) => {
  try {
    const resources = await LearningResource.find();
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Data (for testing)
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing
    await Question.deleteMany({});
    await CareerPath.deleteMany({});
    await LearningResource.deleteMany({});

    // Seed Questions
    await Question.insertMany([
      {
        text: 'How proficient are you with Cloud Platforms (AWS/Azure/GCP)?',
        category: 'Cloud Platforms',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Docker & Kubernetes?',
        category: 'Docker & Kubernetes',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with CI/CD Pipelines?',
        category: 'CI/CD Pipelines',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Linux / System Admin?',
        category: 'Linux / System Admin',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      }
    ]);

    // Seed Career Paths
    await CareerPath.insertMany([
      {
        title: 'Software Engineer',
        description: 'Design and develop software applications and systems.',
        salaryRange: 'LKR 80K-220K/mo',
        growthRate: '+22%',
        requiredSkills: [
          { name: 'JavaScript / TypeScript', level: 3 },
          { name: 'React / Angular / Vue', level: 3 },
          { name: 'Node.js / Backend Dev', level: 3 }
        ]
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Protect systems and networks from cyber threats.',
        salaryRange: 'LKR 75K-180K/mo',
        growthRate: '+18%',
        requiredSkills: [
          { name: 'Linux / System Admin', level: 3 },
          { name: 'Cloud Platforms', level: 2 },
          { name: 'Problem Solving', level: 4 }
        ]
      }
    ]);

    // Seed Resources
    await LearningResource.insertMany([
      {
        title: 'The Complete JavaScript Course',
        provider: 'Udemy',
        type: 'course',
        url: '#',
        category: 'JavaScript',
        level: 'Intermediate',
        isPaid: true,
        duration: '69 hrs',
        rating: 4.7
      },
      {
        title: 'TypeScript Full Course',
        provider: 'freeCodeCamp',
        type: 'video',
        url: '#',
        category: 'TypeScript',
        level: 'Intermediate',
        isPaid: false,
        duration: '4 hrs',
        rating: 4.8
      }
    ]);

    res.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 404 Handler for API routes (must be after all API routes)
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
