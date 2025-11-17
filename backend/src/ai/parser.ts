export type ParsedMemory = {
  title: string;
  type: 'reminder' | 'fact';
  dueDatetime: string | null;
  reminderDatetime: string | null;
  includeInNightlySummary: boolean;
};

// TODO: replace with real LLM call
export async function parseMemoryFromText(rawText: string): Promise<ParsedMemory> {
  const trimmed = rawText.trim();
  const dueDatetime = null;
  const reminderDatetime = null;

  return {
    title: trimmed || 'Untitled memory',
    type: 'reminder',
    dueDatetime,
    reminderDatetime,
    includeInNightlySummary: true,
  };
}
