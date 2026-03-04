export interface SharedNote {
  id: string;
  couple_id: string;
  author_id: string;
  author_name: string;
  content: string;
  photo_urls: string[];
  created_at: string;
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

export async function fetchNotesForCouple(coupleId: string): Promise<SharedNote[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('power_pair_notes')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PowerPair] fetchNotes error:', error.message);
      return [];
    }
    return (data ?? []) as SharedNote[];
  } catch (e) {
    console.error('[PowerPair] fetchNotes failed:', e);
    return [];
  }
}

export async function createNote(
  coupleId: string,
  authorId: string,
  authorName: string,
  content: string,
  photoPaths: string[] = []
): Promise<SharedNote | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_notes')
      .insert({
        couple_id: coupleId,
        author_id: authorId,
        author_name: authorName,
        content,
        photo_urls: photoPaths,
      })
      .select()
      .single();

    if (error) {
      console.error('[PowerPair] createNote error:', error.message);
      return null;
    }
    return data as SharedNote;
  } catch (e) {
    console.error('[PowerPair] createNote failed:', e);
    return null;
  }
}

export async function uploadNotePhoto(
  noteId: string,
  file: File
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const ext = file.name.split('.').pop();
    const path = `${noteId}/${Date.now()}.${ext}`;

    const { error } = await sb.storage
      .from('note-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('[PowerPair] uploadNotePhoto error:', error.message);
      return null;
    }
    return path;
  } catch (e) {
    console.error('[PowerPair] uploadNotePhoto failed:', e);
    return null;
  }
}

export async function getSignedNotePhotoUrls(paths: string[]): Promise<string[]> {
  const sb = await getSupabase();
  if (!sb || paths.length === 0) return [];

  const results = await Promise.all(
    paths.map(async (path) => {
      if (path.startsWith('http')) return path;
      const { data, error } = await sb.storage
        .from('note-photos')
        .createSignedUrl(path, 3600);
      if (error) return null;
      return data?.signedUrl ?? null;
    })
  );

  return results.filter(Boolean) as string[];
}
