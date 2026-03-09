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

// ── Types ────────────────────────────────────────────────────────────────────

export interface WheelIdea {
  id: string;
  couple_id: string;
  added_by_user_id: string;
  source_type: 'catalog' | 'community' | 'custom';
  source_id: string | null;
  custom_title: string | null;
  custom_description: string | null;
  duration: string;
  added_at: string;
}

export interface CommunityIdea {
  id: string;
  author_couple_id: string;
  author_user_id: string;
  author_name: string | null;
  title: string;
  description: string;
  duration: string;
  category: string;
  created_at: string;
}

// ── Couple Wheel CRUD ────────────────────────────────────────────────────────

export async function fetchWheelIdeas(coupleId: string): Promise<WheelIdea[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('couple_wheel_ideas')
      .select('*')
      .eq('couple_id', coupleId)
      .order('added_at', { ascending: false });

    if (error || !data) return [];
    return data as WheelIdea[];
  } catch {
    return [];
  }
}

export async function addWheelIdea(
  coupleId: string,
  userId: string,
  idea: {
    source_type: 'catalog' | 'community' | 'custom';
    source_id?: string;
    custom_title?: string;
    custom_description?: string;
    duration: string;
  }
): Promise<WheelIdea | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('couple_wheel_ideas')
      .insert({
        couple_id: coupleId,
        added_by_user_id: userId,
        source_type: idea.source_type,
        source_id: idea.source_id ?? null,
        custom_title: idea.custom_title ?? null,
        custom_description: idea.custom_description ?? null,
        duration: idea.duration,
      })
      .select()
      .single();

    if (error) {
      console.error('[WheelIdeas] add error:', error.message);
      return null;
    }
    return data as WheelIdea;
  } catch (e) {
    console.error('[WheelIdeas] add failed:', e);
    return null;
  }
}

export async function removeWheelIdea(
  ideaId: string,
  userId: string
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from('couple_wheel_ideas')
      .delete()
      .eq('id', ideaId)
      .eq('added_by_user_id', userId);

    if (error) {
      console.error('[WheelIdeas] remove error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Community Ideas CRUD ─────────────────────────────────────────────────────

export async function fetchCommunityIdeas(): Promise<CommunityIdea[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('community_date_ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CommunityIdea[];
  } catch {
    return [];
  }
}

export async function submitCommunityIdea(
  coupleId: string,
  userId: string,
  authorName: string | null,
  title: string,
  description: string,
  duration: string
): Promise<CommunityIdea | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('community_date_ideas')
      .insert({
        author_couple_id: coupleId,
        author_user_id: userId,
        author_name: authorName,
        title,
        description,
        duration,
        category: 'Community',
      })
      .select()
      .single();

    if (error) {
      console.error('[WheelIdeas] community submit error:', error.message);
      return null;
    }
    return data as CommunityIdea;
  } catch (e) {
    console.error('[WheelIdeas] community submit failed:', e);
    return null;
  }
}
