import { Router } from 'express';
import type multer from 'multer';
import prisma from '../db/prisma.js';
import { parseMemoryFromText } from '../ai/parser.js';
import { transcribeAudio } from '../ai/transcription.js';

const DEMO_USER_ID = 'demo-user-1';

const buildMemoriesRouter = (upload: multer.Multer) => {
  const router = Router();

  router.post('/from-text', async (req, res) => {
    const { rawText } = req.body as { rawText?: string };
    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    try {
      const parsed = await parseMemoryFromText(rawText);
      const memory = await prisma.memory.create({
        data: {
          userId: DEMO_USER_ID,
          rawText,
          title: parsed.title,
          type: parsed.type,
          dueDatetime: parsed.dueDatetime ? new Date(parsed.dueDatetime) : null,
          reminderDatetime: parsed.reminderDatetime ? new Date(parsed.reminderDatetime) : null,
          includeInNightlySummary: parsed.includeInNightlySummary,
          status: 'open',
        },
      });

      res.json(memory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create memory' });
    }
  });

  router.post('/from-voice', upload.single('audio'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'audio file is required' });
    }

    try {
      const rawText = await transcribeAudio(req.file);
      const parsed = await parseMemoryFromText(rawText);
      const memory = await prisma.memory.create({
        data: {
          userId: DEMO_USER_ID,
          rawText,
          title: parsed.title,
          type: parsed.type,
          dueDatetime: parsed.dueDatetime ? new Date(parsed.dueDatetime) : null,
          reminderDatetime: parsed.reminderDatetime ? new Date(parsed.reminderDatetime) : null,
          includeInNightlySummary: parsed.includeInNightlySummary,
          status: 'open',
        },
      });

      res.json(memory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create memory from voice' });
    }
  });

  router.get('/tomorrow', async (_req, res) => {
    try {
      const now = new Date();
      const tomorrowStart = new Date(now);
      tomorrowStart.setDate(now.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const memories = await prisma.memory.findMany({
        where: {
          userId: DEMO_USER_ID,
          includeInNightlySummary: true,
          status: 'open',
          dueDatetime: {
            gte: tomorrowStart,
            lte: tomorrowEnd,
          },
        },
        orderBy: { dueDatetime: 'asc' },
      });

      res.json(memories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch memories' });
    }
  });

  return router;
};

export default buildMemoriesRouter;
