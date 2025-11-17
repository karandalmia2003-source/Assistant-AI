import { Express } from 'express';

// TODO: integrate Whisper API
export async function transcribeAudio(file: Express.Multer.File): Promise<string> {
  console.log('Received audio file for transcription:', file.originalname);
  return 'Remind me tomorrow at 9 PM to submit my Econ assignment.';
}
