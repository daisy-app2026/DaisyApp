import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import spacesRoutes from './routes/spaces';
import entriesRoutes from './routes/entries';
import talkToPastRoutes from './routes/talkToPast';
import talkToCrushRoutes from './routes/talkToCrush';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(
    `Daisy backend running on port ${PORT} 🌼`
  );
});

export default app;
