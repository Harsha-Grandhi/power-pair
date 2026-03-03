import { UserProfile } from '@/types';

/**
 * Saves the completed profile to Supabase.
 * Import is dynamic so the app works fine even if env vars are missing
 * (e.g. during local dev before you add .env.local).
 * Never throws — failures are logged but never crash the app.
 */
export async function saveProfileToSupabase(profile: UserProfile): Promise<void> {
  // Skip silently if Supabase env vars aren't configured yet
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  try {
    const { supabase } = await import('./supabase');

    const { error } = await supabase.from('power_pair_profiles').upsert(
      {
        id:               profile.id,
        name:             profile.introContext.name ?? null,
        email:            profile.introContext.email ?? null,
        phone_number:     profile.introContext.phoneNumber ?? null,
        created_at:       profile.createdAt,
        completed_at:     profile.completedAt ?? null,

        // Context
        relationship_stage:  profile.introContext.relationshipStage ?? null,
        seriousness:         profile.introContext.seriousness ?? null,
        biggest_challenge:   profile.introContext.biggestChallenge ?? null,

        // Full JSONB blobs (for full data access)
        intro_context:       profile.introContext,
        assessment_answers:  profile.assessmentAnswers,
        dimension_scores:    profile.dimensionScores,
        love_style:          profile.loveStyle,

        // Archetype top-level columns (easy to query/filter in Supabase dashboard)
        archetype_id:        profile.archetypeResult.primary.id,
        archetype_name:      profile.archetypeResult.primary.name,
        archetype_emoji:     profile.archetypeResult.primary.emoji,
        confidence_score:    profile.archetypeResult.confidence,
        love_style_subtype:  profile.loveStyle.subtype,
        love_style_intensity: profile.loveStyle.intensity,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[PowerPair] Supabase save error:', error.message);
    } else {
      console.log('[PowerPair] Profile saved to Supabase ✓');
    }
  } catch (e) {
    // Network offline, env vars wrong, etc. — never crash the app.
    console.error('[PowerPair] Supabase unavailable:', e);
  }
}
