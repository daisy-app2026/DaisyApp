import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import spacesRoutes from './routes/spaces';
import entriesRoutes from './routes/entries';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Daisy backend running 🌼' 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/entries', entriesRoutes);

app.listen(PORT, () => {
  console.log(
    `Daisy backend running on port ${PORT} 🌼`
  );
});

export default app;
