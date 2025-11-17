import http from 'http';
import app from './app.js';
import { scheduleNightlySummaryJob } from './jobs/nightlySummaryJob.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`MemoryOS backend listening on port ${PORT}`);
  scheduleNightlySummaryJob();
});
