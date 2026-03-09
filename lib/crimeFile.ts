async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const { supabase } = await import('./supabase');
  return supabase;
}

export type CrimeFileAnswers = Record<string, string>;

export interface CrimeFileRow {
  id: string;
  couple_id: string;
  user_id: string;
  answers: CrimeFileAnswers;
  updated_at: string;
}

export async function fetchCrimeFileAnswers(
  coupleId: string,
  userId: string
): Promise<CrimeFileAnswers> {
  const sb = await getSupabase();
  if (!sb) return {};

  try {
    const { data, error } = await sb
      .from('crime_file_answers')
      .select('answers')
      .eq('couple_id', coupleId)
      .eq('user_id', userId)
      .single();

    if (error || !data) return {};
    return (data.answers as CrimeFileAnswers) ?? {};
  } catch {
    return {};
  }
}

export async function fetchCrimeFileBoth(
  coupleId: string
): Promise<{ [userId: string]: CrimeFileAnswers }> {
  const sb = await getSupabase();
  if (!sb) return {};

  try {
    const { data, error } = await sb
      .from('crime_file_answers')
      .select('user_id, answers')
      .eq('couple_id', coupleId);

    if (error || !data) return {};

    const result: { [userId: string]: CrimeFileAnswers } = {};
    for (const row of data) {
      result[row.user_id] = (row.answers as CrimeFileAnswers) ?? {};
    }
    return result;
  } catch {
    return {};
  }
}

export async function saveCrimeFileAnswers(
  coupleId: string,
  userId: string,
  answers: CrimeFileAnswers
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from('crime_file_answers')
      .upsert(
        {
          couple_id: coupleId,
          user_id: userId,
          answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'couple_id,user_id' }
      );

    if (error) {
      console.error('[CrimeFile] save error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[CrimeFile] save failed:', e);
    return false;
  }
}
