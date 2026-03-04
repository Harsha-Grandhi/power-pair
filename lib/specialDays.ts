export interface SpecialDay {
  id: string;
  couple_id: string;
  title: string;
  date: string; // YYYY-MM-DD
  created_at: string;
}

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const { supabase } = await import('./supabase');
  return supabase;
}

export async function fetchSpecialDays(coupleId: string): Promise<SpecialDay[]> {
  const sb = await getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from('power_pair_special_days')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: true });
    if (error) return [];
    return (data ?? []) as SpecialDay[];
  } catch {
    return [];
  }
}

export async function createSpecialDay(
  coupleId: string,
  title: string,
  date: string
): Promise<SpecialDay | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('power_pair_special_days')
      .insert({ couple_id: coupleId, title, date })
      .select()
      .single();
    if (error) return null;
    return data as SpecialDay;
  } catch {
    return null;
  }
}

export async function deleteSpecialDay(id: string): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('power_pair_special_days').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/** Returns days until the date. Negative = past. */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
