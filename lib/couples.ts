import { UserProfile } from '@/types';

function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
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

/**
 * Creates a new couple record in Supabase for Partner 1.
 * Generates a unique 6-char pairing code.
 * Returns the new coupleId string, or null on failure.
 */
export async function createCoupleRecord(
  partner1ProfileId: string,
  partner1Name: string | null
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_couples')
      .insert({
        partner_1_id: partner1ProfileId,
        partner_1_name: partner1Name ?? null,
        pairing_code: generatePairingCode(),
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('[PowerPair] createCoupleRecord error:', error?.message);
      return null;
    }

    const coupleId = data.id as string;

    await sb
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
 */
export async function linkPartner2ToCoupleRecord(
  coupleId: string,
  partner2ProfileId: string
): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;

  try {
    await Promise.all([
      sb
        .from('power_pair_couples')
        .update({ partner_2_id: partner2ProfileId, completed_at: new Date().toISOString() })
        .eq('id', coupleId),
      sb
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
 * Checks whether Partner 2 has completed their quiz.
 */
export async function checkCoupleComplete(coupleId: string): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { data, error } = await sb
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
 */
export async function fetchCoupleProfiles(coupleId: string): Promise<{
  partner1: UserProfile | null;
  partner2: UserProfile | null;
  partner1Name: string | null;
}> {
  const empty = { partner1: null, partner2: null, partner1Name: null };
  const sb = await getSupabase();
  if (!sb) return empty;

  try {
    const { data: couple, error: coupleError } = await sb
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

    const { data: profiles, error: profilesError } = await sb
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

/**
 * Fetches the pairing code for a couple.
 */
export async function fetchPairingCode(coupleId: string): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_couples')
      .select('pairing_code')
      .eq('id', coupleId)
      .single();

    if (error || !data) return null;
    return data.pairing_code ?? null;
  } catch {
    return null;
  }
}

/**
 * Links two independently-created accounts by pairing code.
 * The joiner becomes partner_2 on the code owner's couple record.
 * The joiner's orphan couple record is cleaned up.
 * Returns the new coupleId or null on failure.
 */
export async function linkByPairingCode(
  code: string,
  joinerProfileId: string,
  joinerCoupleId: string | null
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    // Find the couple with this pairing code
    const { data: couple, error: findError } = await sb
      .from('power_pair_couples')
      .select('id, partner_1_id, partner_2_id')
      .eq('pairing_code', code.toUpperCase().trim())
      .single();

    if (findError || !couple) {
      console.error('[PowerPair] linkByPairingCode: code not found');
      return null;
    }

    // Don't link to yourself
    if (couple.partner_1_id === joinerProfileId) {
      console.error('[PowerPair] linkByPairingCode: cannot link to own code');
      return null;
    }

    // Already has a partner
    if (couple.partner_2_id) {
      console.error('[PowerPair] linkByPairingCode: couple already complete');
      return null;
    }

    const targetCoupleId = couple.id as string;

    // Link joiner as partner_2
    await Promise.all([
      sb
        .from('power_pair_couples')
        .update({ partner_2_id: joinerProfileId, completed_at: new Date().toISOString() })
        .eq('id', targetCoupleId),
      sb
        .from('power_pair_profiles')
        .update({ couple_id: targetCoupleId, partner_role: 'partner_2' })
        .eq('id', joinerProfileId),
    ]);

    // Clean up joiner's orphan couple record (if different)
    if (joinerCoupleId && joinerCoupleId !== targetCoupleId) {
      await sb
        .from('power_pair_couples')
        .delete()
        .eq('id', joinerCoupleId)
        .is('partner_2_id', null);
    }

    console.log('[PowerPair] Linked by pairing code to couple:', targetCoupleId);
    return targetCoupleId;
  } catch (e) {
    console.error('[PowerPair] linkByPairingCode failed:', e);
    return null;
  }
}
