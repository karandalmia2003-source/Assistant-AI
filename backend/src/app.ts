import express from 'express';
import cors from 'cors';
import multer from 'multer';
import memoriesRouter from './routes/memories.js';
import summaryRouter from './routes/summary.js';

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pass upload middleware through router initialization
app.use('/api/memories', memoriesRouter(upload));
app.use('/api/summary', summaryRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
