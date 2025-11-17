import { Router } from 'express';
import prisma from '../db/prisma.js';
import { generateNightlySummary } from '../ai/summary.js';

const DEMO_USER_ID = 'demo-user-1';

const router = Router();

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

    const summary = await generateNightlySummary(memories);
    res.json({ summary, items: memories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;
