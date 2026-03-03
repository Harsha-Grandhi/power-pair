import { UserProfile, CoupleCompatibility, DimensionComparison } from '@/types';

/**
 * Computes couple compatibility from two UserProfile objects.
 * Dimension order matches the scoring engine: [PersonalEmotionalAwareness,
 * EmotionalRegulation, Empathy&Validation, LoveStyleIntensity, FutureAlignmentMindset,
 * ConsistencyOfEffort]
 */
export function computeCompatibility(
  p1: UserProfile,
  p2: UserProfile
): CoupleCompatibility {
  // ── Dimension comparison ──────────────────────────────────────────────────────
  const dimensions: DimensionComparison[] = p1.dimensionScores.map((d1) => {
    const d2 = p2.dimensionScores.find((d) => d.id === d1.id);
    const p1Score = Math.round(d1.score);
    const p2Score = d2 ? Math.round(d2.score) : 0;
    return {
      dimension: d1.id,
      name: d1.name,
      icon: d1.icon,
      p1Score,
      p2Score,
      similarity: 100 - Math.abs(p1Score - p2Score),
    };
  });

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.similarity, 0) / dimensions.length
  );

  // ── Love style match ──────────────────────────────────────────────────────────
  const loveStyleMatch = p1.loveStyle.subtype === p2.loveStyle.subtype;
  const loveStyleNote = loveStyleMatch
    ? `You both speak the same love language — ${p1.loveStyle.subtype}. This creates an instant, natural understanding of how to make each other feel valued.`
    : `You express love differently: ${p1.introContext.name ?? 'Partner 1'} through ${p1.loveStyle.subtype}, ${p2.introContext.name ?? 'Partner 2'} through ${p2.loveStyle.subtype}. Understanding this difference is a superpower.`;

  // ── Archetype pairing note ────────────────────────────────────────────────────
  const sameArchetype =
    p1.archetypeResult.primary.id === p2.archetypeResult.primary.id;
  const archetypePairingNote = sameArchetype
    ? `Two ${p1.archetypeResult.primary.name}s together — you mirror each other's strengths, which can create deep resonance. Watch for shared blindspots.`
    : `${p1.archetypeResult.primary.name} meets ${p2.archetypeResult.primary.name}. Your differences are complementary — each of you brings what the other naturally lacks.`;

  // ── Strengths together (union, max 4) ─────────────────────────────────────────
  const allStrengths = [
    ...p1.archetypeResult.primary.strengths,
    ...p2.archetypeResult.primary.strengths,
  ];
  const strengthsTogether = Array.from(new Set(allStrengths)).slice(0, 4);

  // ── Growth together (union, max 3) ────────────────────────────────────────────
  const allGrowth = [
    ...p1.archetypeResult.primary.growthEdge,
    ...p2.archetypeResult.primary.growthEdge,
  ];
  const growthTogether = Array.from(new Set(allGrowth)).slice(0, 3);

  return {
    overallScore,
    dimensions,
    loveStyleMatch,
    loveStyleNote,
    archetypePairingNote,
    strengthsTogether,
    growthTogether,
  };
}
