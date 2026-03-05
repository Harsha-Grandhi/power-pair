import { UserProfile } from '@/types';

/**
 * Saves the completed profile to Supabase.
 */
export async function saveProfileToSupabase(profile: UserProfile): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[PowerPair] saveProfileToSupabase called');
  console.log('[PowerPair] Supabase URL present:', !!url);
  console.log('[PowerPair] Supabase Key present:', !!key);

  if (!url || !key) {
    console.warn('[PowerPair] Supabase env vars missing - skipping save');
    return;
  }

  try {
    const { supabase } = await import('./supabase');

    const payload = {
      id:               profile.id,
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

    console.log('[PowerPair] Upserting profile with id:', payload.id);

    const { data, error } = await supabase.from('power_pair_profiles').upsert(
      payload,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[PowerPair] Supabase save error:', error.message, error.details, error.hint);
    } else {
      console.log('[PowerPair] Profile saved to Supabase OK', data);
    }
  } catch (e) {
    console.error('[PowerPair] Supabase unavailable:', e);
  }
}
