import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import spacesRoutes from './routes/spaces';
import entriesRoutes from './routes/entries';
import talkToPastRoutes from './routes/talkToPast';
import talkToCrushRoutes from './routes/talkToCrush';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// Disable compression for 
// React Native compatibility!
app.use((req, res, next) => {
  req.headers['accept-encoding'] = 
    'identity'
  next()
})

app.use((req, res, next) => {
  res.setHeader(
    'Content-Type',
    'application/json; charset=utf-8'
  )
  res.setHeader(
    'Transfer-Encoding',
    'identity'
  )
  next()
})

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: [
    'GET', 'POST',
    'PUT', 'DELETE',
    'OPTIONS'
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-secret'
  ],
  credentials: false
}));
app.use(express.json());

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  validate: {
    xForwardedForHeader: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI endpoints strict limit
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  validate: {
    xForwardedForHeader: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limits
app.use(globalLimiter);
app.use('/api/talk-to-past', aiLimiter);
app.use('/api/talk-to-crush', aiLimiter);

// Request logger middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] 
    ${req.method} ${req.url}`
  )
  next()
})

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Daisy Backend API is online! 🌼',
    status: 'ok'
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/talk-to-past', talkToPastRoutes);
app.use('/api/talk-to-crush', talkToCrushRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(
    `Daisy backend running on port ${PORT} 🌼`
  );
});

export default app;
