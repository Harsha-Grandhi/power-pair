// Reflection persistence helpers (Pause Button feature)

export interface Reflection {
  id: string;
  userId: string;
  coupleId: string | null;
  emotion: string;
  rawText: string;
  aiSummary: string;
  shared: boolean;
  createdAt: string;
}

export async function saveReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Promise<Reflection> {
  const record: Reflection = {
    ...reflection,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // Persist to localStorage for now
  const existing = JSON.parse(localStorage.getItem('pp_reflections') || '[]') as Reflection[];
  existing.push(record);
  localStorage.setItem('pp_reflections', JSON.stringify(existing));

  return record;
}

export async function shareWithPartner(reflectionId: string, coupleId: string): Promise<void> {
  // Future: push to Supabase shared table
  const existing = JSON.parse(localStorage.getItem('pp_reflections') || '[]') as Reflection[];
  const idx = existing.findIndex((r) => r.id === reflectionId);
  if (idx !== -1) {
    existing[idx].shared = true;
    localStorage.setItem('pp_reflections', JSON.stringify(existing));
  }
}
