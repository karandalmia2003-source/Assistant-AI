import cron from 'node-cron';
import prisma from '../db/prisma.js';
import { generateNightlySummary } from '../ai/summary.js';

const DEMO_USER_ID = 'demo-user-1';

async function fetchTomorrowMemories() {
  const now = new Date();
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(now.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  return prisma.memory.findMany({
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
}

export function scheduleNightlySummaryJob() {
  // Runs daily at 23:00 server time
  cron.schedule('0 23 * * *', async () => {
    try {
      const memories = await fetchTomorrowMemories();
      const summary = await generateNightlySummary(memories);
      console.log('--- Nightly Summary (Tomorrow) ---');
      console.log(summary);
      console.log('----------------------------------');
    } catch (error) {
      console.error('Failed to run nightly summary job', error);
    }
  });
}
