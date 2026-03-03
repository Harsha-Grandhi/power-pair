import { UserProfile } from '@/types';

/**
 * Creates a new couple record in Supabase for Partner 1.
 * Updates the profile row with couple_id and partner_role='partner_1'.
 * Returns the new coupleId string, or null on failure.
 */
export async function createCoupleRecord(
  partner1ProfileId: string,
  partner1Name: string | null
): Promise<string | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const { supabase } = await import('./supabase');

    // Insert couple row
    const { data, error } = await supabase
      .from('power_pair_couples')
      .insert({
        partner_1_id: partner1ProfileId,
        partner_1_name: partner1Name ?? null,
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('[PowerPair] createCoupleRecord error:', error?.message);
      return null;
    }

    const coupleId = data.id as string;

    // Update profile with couple_id and role
    await supabase
      .from('power_pair_profiles')
      .update({ couple_id: coupleId, partner_role: 'partner_1' })
      .eq('id', partner1ProfileId);

    console.log('[PowerPair] Couple record created:', coupleId);
    return coupleId;
  } catch (e) {
    console.error('[PowerPair] createCoupleRecord failed:', e);
    return null;
  }
}

/**
 * Links Partner 2 to an existing couple record.
 * Updates the couple row with partner_2_id + completed_at.
 * Updates the profile row with couple_id and partner_role='partner_2'.
 */
export async function linkPartner2ToCoupleRecord(
  coupleId: string,
  partner2ProfileId: string
): Promise<void> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  try {
    const { supabase } = await import('./supabase');

    await Promise.all([
      supabase
        .from('power_pair_couples')
        .update({ partner_2_id: partner2ProfileId, completed_at: new Date().toISOString() })
        .eq('id', coupleId),

      supabase
        .from('power_pair_profiles')
        .update({ couple_id: coupleId, partner_role: 'partner_2' })
        .eq('id', partner2ProfileId),
    ]);

    console.log('[PowerPair] Partner 2 linked to couple:', coupleId);
  } catch (e) {
    console.error('[PowerPair] linkPartner2ToCoupleRecord failed:', e);
  }
}

/**
 * Checks whether Partner 2 has completed their quiz for a given coupleId.
 * Returns true if partner_2_id is set on the couple row.
 */
export async function checkCoupleComplete(coupleId: string): Promise<boolean> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return false;
  }

  try {
    const { supabase } = await import('./supabase');

    const { data, error } = await supabase
      .from('power_pair_couples')
      .select('partner_2_id')
      .eq('id', coupleId)
      .single();

    if (error || !data) return false;
    return Boolean(data.partner_2_id);
  } catch {
    return false;
  }
}

/**
 * Fetches both partner profiles for a given coupleId.
 * Returns { partner1, partner2, partner1Name } — either profile may be null.
 */
export async function fetchCoupleProfiles(coupleId: string): Promise<{
  partner1: UserProfile | null;
  partner2: UserProfile | null;
  partner1Name: string | null;
}> {
  const empty = { partner1: null, partner2: null, partner1Name: null };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return empty;
  }

  try {
    const { supabase } = await import('./supabase');

    const { data: couple, error: coupleError } = await supabase
      .from('power_pair_couples')
      .select('partner_1_id, partner_2_id, partner_1_name')
      .eq('id', coupleId)
      .single();

    if (coupleError || !couple) {
      console.error('[PowerPair] fetchCoupleProfiles couple error:', coupleError?.message);
      return empty;
    }

    const ids = [couple.partner_1_id, couple.partner_2_id].filter(Boolean) as string[];
    if (ids.length === 0) return { ...empty, partner1Name: couple.partner_1_name ?? null };

    const { data: profiles, error: profilesError } = await supabase
      .from('power_pair_profiles')
      .select('id, full_profile')
      .in('id', ids);

    if (profilesError) {
      console.error('[PowerPair] fetchCoupleProfiles profiles error:', profilesError.message);
      return { ...empty, partner1Name: couple.partner_1_name ?? null };
    }

    const byId = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_profile]));

    return {
      partner1: couple.partner_1_id ? (byId[couple.partner_1_id] as UserProfile | null) ?? null : null,
      partner2: couple.partner_2_id ? (byId[couple.partner_2_id] as UserProfile | null) ?? null : null,
      partner1Name: couple.partner_1_name ?? null,
    };
  } catch (e) {
    console.error('[PowerPair] fetchCoupleProfiles failed:', e);
    return empty;
  }
}
