/**
 * Extra couple-level metadata stored on the power_pair_couples row:
 * - relationship_start (date string YYYY-MM-DD)
 */

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const { supabase } = await import('./supabase');
  return supabase;
}

export async function fetchRelationshipStart(coupleId: string): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('power_pair_couples')
      .select('relationship_start')
      .eq('id', coupleId)
      .single();
    if (error || !data) return null;
    return (data as { relationship_start: string | null }).relationship_start ?? null;
  } catch {
    return null;
  }
}

export async function setRelationshipStart(coupleId: string, date: string): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb
      .from('power_pair_couples')
      .update({ relationship_start: date })
      .eq('id', coupleId);
    return !error;
  } catch {
    return false;
  }
}
