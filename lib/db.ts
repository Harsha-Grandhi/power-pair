import { UserProfile } from '@/types';

/**
 * Saves the completed profile to Supabase.
 */
export async function saveProfileToSupabase(profile: UserProfile, authUserId?: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[PowerPair] Supabase env vars missing - skipping save');
    return;
  }

  try {
    const { supabase } = await import('./supabase');

    const payload = {
      id:               profile.id,
      auth_user_id:     authUserId ?? null,
      name:             profile.introContext.name ?? null,
      email:            profile.introContext.email ?? null,
      phone_number:     profile.introContext.phoneNumber ?? null,
      created_at:       profile.createdAt,
      completed_at:     profile.completedAt ?? null,
      relationship_stage:  profile.introContext.relationshipStage ?? null,
      seriousness:         profile.introContext.seriousness ?? null,
      biggest_challenge:   profile.introContext.biggestChallenge ?? null,
      intro_context:       profile.introContext,
      assessment_answers:  profile.assessmentAnswers,
      dimension_scores:    profile.dimensionScores,
      full_profile:        profile,
      archetype_id:        profile.archetypeResult.primary.id,
      archetype_name:      profile.archetypeResult.primary.name,
      archetype_emoji:     profile.archetypeResult.primary.emoji,
      archetype_code:      profile.archetypeResult.code,
    };

    const { error } = await supabase.from('power_pair_profiles').upsert(
      payload,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[PowerPair] Supabase save error:', error.message, error.details, error.hint);
    } else {
      console.log('[PowerPair] Profile saved to Supabase OK');
    }
  } catch (e) {
    console.error('[PowerPair] Supabase unavailable:', e);
  }
}

/**
 * Fetches a user profile from Supabase by auth user ID.
 * Used to restore state for returning logged-in users.
 */
export async function fetchProfileByAuthId(authUserId: string): Promise<{
  profile: UserProfile | null;
  coupleId: string | null;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return { profile: null, coupleId: null };

  try {
    const { supabase } = await import('./supabase');

    const { data, error } = await supabase
      .from('power_pair_profiles')
      .select('full_profile, couple_id')
      .eq('auth_user_id', authUserId)
      .single();

    if (error || !data) {
      console.log('[PowerPair] No profile found for auth user:', authUserId);
      return { profile: null, coupleId: null };
    }

    return {
      profile: data.full_profile as UserProfile,
      coupleId: (data.couple_id as string) ?? null,
    };
  } catch (e) {
    console.error('[PowerPair] fetchProfileByAuthId failed:', e);
    return { profile: null, coupleId: null };
  }
}
