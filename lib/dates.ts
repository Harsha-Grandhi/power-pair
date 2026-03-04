export interface DateRecord {
  id: string;
  couple_id: string;
  date_idea: string;
  duration: string;
  status: 'planned' | 'completed';
  notes: string | null;
  photo_urls: string[];
  created_at: string;
  completed_at: string | null;
}

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

export async function createDate(
  coupleId: string,
  dateIdea: string,
  duration: string
): Promise<DateRecord | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_dates')
      .insert({ couple_id: coupleId, date_idea: dateIdea, duration })
      .select()
      .single();

    if (error) {
      console.error('[PowerPair] createDate error:', error.message);
      return null;
    }
    return data as DateRecord;
  } catch (e) {
    console.error('[PowerPair] createDate failed:', e);
    return null;
  }
}

export async function fetchDatesForCouple(coupleId: string): Promise<DateRecord[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('power_pair_dates')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PowerPair] fetchDates error:', error.message);
      return [];
    }
    return (data ?? []) as DateRecord[];
  } catch (e) {
    console.error('[PowerPair] fetchDates failed:', e);
    return [];
  }
}

export async function fetchDateById(dateId: string): Promise<DateRecord | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_dates')
      .select('*')
      .eq('id', dateId)
      .single();

    if (error) return null;
    return data as DateRecord;
  } catch {
    return null;
  }
}

export async function updateDate(
  dateId: string,
  updates: Partial<Pick<DateRecord, 'notes' | 'photo_urls' | 'status' | 'completed_at'>>
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from('power_pair_dates')
      .update(updates)
      .eq('id', dateId);

    if (error) {
      console.error('[PowerPair] updateDate error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function uploadDatePhoto(
  dateId: string,
  file: File
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const ext = file.name.split('.').pop();
    const path = `${dateId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await sb.storage
      .from('date-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('[PowerPair] uploadDatePhoto error:', uploadError.message);
      return null;
    }

    // Return the storage path — signed URLs are generated separately for display
    return path;
  } catch (e) {
    console.error('[PowerPair] uploadDatePhoto failed:', e);
    return null;
  }
}

/**
 * Converts storage paths into signed URLs valid for 1 hour.
 * Handles legacy entries that are already full URLs (passes them through unchanged).
 */
export async function getSignedPhotoUrls(paths: string[]): Promise<string[]> {
  const sb = await getSupabase();
  if (!sb || paths.length === 0) return [];

  const results = await Promise.all(
    paths.map(async (path) => {
      if (path.startsWith('http')) return path; // legacy public URL — pass through
      const { data, error } = await sb.storage
        .from('date-photos')
        .createSignedUrl(path, 3600);
      if (error) {
        console.error('[PowerPair] createSignedUrl error:', error.message);
        return null;
      }
      return data?.signedUrl ?? null;
    })
  );

  return results.filter(Boolean) as string[];
}
