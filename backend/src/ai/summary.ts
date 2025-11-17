import { Memory } from '@prisma/client';

// TODO: integrate with LLM for more natural summaries
export async function generateNightlySummary(memories: Memory[]): Promise<string> {
  if (memories.length === 0) {
    return 'You have no tasks scheduled for tomorrow. Enjoy your day!';
  }

  const items = memories
    .map((memory) => {
      const due = memory.dueDatetime ? new Date(memory.dueDatetime).toLocaleString() : 'No due date';
      return `• ${memory.title} (${due})`;
    })
    .join('\n');

  return `Here is what you have coming up tomorrow:\n${items}`;
}
