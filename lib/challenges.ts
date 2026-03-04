export type ChallengeStatus = 'active' | 'won' | 'lost';

export interface Challenge {
  id: string;
  couple_id: string;
  challenger_id: string;
  challenger_name: string;
  challenge_text: string;
  win_prize: string;
  lose_punishment: string;
  status: ChallengeStatus;
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

export async function fetchChallengesForCouple(coupleId: string): Promise<Challenge[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('power_pair_challenges')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PowerPair] fetchChallenges error:', error.message);
      return [];
    }
    return (data ?? []) as Challenge[];
  } catch (e) {
    console.error('[PowerPair] fetchChallenges failed:', e);
    return [];
  }
}

export async function createChallenge(
  coupleId: string,
  challengerId: string,
  challengerName: string,
  challengeText: string,
  winPrize: string,
  losePunishment: string
): Promise<Challenge | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_challenges')
      .insert({
        couple_id: coupleId,
        challenger_id: challengerId,
        challenger_name: challengerName,
        challenge_text: challengeText,
        win_prize: winPrize,
        lose_punishment: losePunishment,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('[PowerPair] createChallenge error:', error.message);
      return null;
    }
    return data as Challenge;
  } catch (e) {
    console.error('[PowerPair] createChallenge failed:', e);
    return null;
  }
}

export async function updateChallengeStatus(
  challengeId: string,
  status: ChallengeStatus
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from('power_pair_challenges')
      .update({ status })
      .eq('id', challengeId);

    if (error) {
      console.error('[PowerPair] updateChallengeStatus error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
