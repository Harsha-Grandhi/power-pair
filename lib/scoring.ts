import {
  AssessmentAnswers,
  DimensionScore,
  LoveStyleResult,
  ArchetypeResult,
  LoveSubtype,
} from '@/types';
import { ARCHETYPES } from './archetypes';

// ─── Dimension Score Formula ───────────────────────────────────────────────────
// Formula: (rawScore / 9) * 100

export function computeDimensionScore(rawScore: number): number {
  return Math.round((rawScore / 9) * 100);
}

// ─── Love Style Intensity Formula ──────────────────────────────────────────────

export function computeLoveStyle(
  q10: LoveSubtype | undefined,
  q11: LoveSubtype | undefined,
  q12: LoveSubtype | undefined
): LoveStyleResult {
  const subtypeDistribution: Record<LoveSubtype, number> = {
    Physical: 0,
    Verbal: 0,
    Presence: 0,
    Action: 0,
  };

  if (q10) subtypeDistribution[q10]++;
  if (q11) subtypeDistribution[q11]++;
  if (q12) subtypeDistribution[q12]++;

  // Primary subtype = highest frequency (tie-break: first encountered)
  const primarySubtype = (
    Object.entries(subtypeDistribution) as [LoveSubtype, number][]
  ).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  const maxCount = subtypeDistribution[primarySubtype];

  // Step 2: Base Intensity
  const base = (maxCount / 3) * 100;

  // Step 3: Emotional Weight Boost — Q12 matches primary = +15, capped at 100
  const q12Boost = q12 === primarySubtype ? 15 : 0;
  const intensity = Math.min(100, Math.round(base + q12Boost));

  return {
    subtype: primarySubtype,
    intensity,
    subtypeDistribution,
  };
}

// ─── Archetype Matching Engine ─────────────────────────────────────────────────
// Weighted Euclidean distance
// weights = [1.2, 1.2, 1.3, 1.0, 1.1, 1.2]

const DIMENSION_WEIGHTS: [number, number, number, number, number, number] = [
  1.2, 1.2, 1.3, 1.0, 1.1, 1.2,
];

export function weightedEuclideanDistance(
  userVector: number[],
  prototype: number[],
  weights: number[]
): number {
  const sumOfSquares = userVector.reduce((acc, val, i) => {
    return acc + weights[i] * Math.pow(val - prototype[i], 2);
  }, 0);
  return Math.sqrt(sumOfSquares);
}

export function matchArchetype(userVector: number[]): ArchetypeResult {
  const ranked = ARCHETYPES.map((archetype) => ({
    archetype,
    distance: weightedEuclideanDistance(userVector, archetype.prototype, DIMENSION_WEIGHTS),
  })).sort((a, b) => a.distance - b.distance);

  const primary = ranked[0];
  const second = ranked[1];

  // Secondary archetype: if second-best is within 8% difference from best
  const diffThreshold = primary.distance * 0.08;
  const secondary =
    second.distance - primary.distance <= diffThreshold ? second.archetype : undefined;

  // Confidence: normalized vs. theoretical max weighted distance
  // Max distance if all dimensions are 100 apart: sqrt(sum(w_i * 100^2))
  const maxDistance = Math.sqrt(
    DIMENSION_WEIGHTS.reduce((sum, w) => sum + w * 10000, 0)
  );
  const confidence = Math.round(Math.max(0, (1 - primary.distance / maxDistance) * 100));

  return {
    primary: primary.archetype,
    secondary,
    confidence,
    distance: primary.distance,
  };
}

// ─── Master Score Computation ──────────────────────────────────────────────────

export function computeAllScores(answers: AssessmentAnswers): {
  dimensionScores: DimensionScore[];
  loveStyle: LoveStyleResult;
  archetypeResult: ArchetypeResult;
} {
  // Dimension 1: Personal Emotional Awareness
  const d1Raw = (answers.q1 ?? 0) + (answers.q2 ?? 0) + (answers.q3 ?? 0);
  const d1Score = computeDimensionScore(d1Raw);

  // Dimension 2: Emotional Regulation
  const d2Raw = (answers.q4 ?? 0) + (answers.q5 ?? 0) + (answers.q6 ?? 0);
  const d2Score = computeDimensionScore(d2Raw);

  // Dimension 3: Empathy & Validation
  const d3Raw = (answers.q7 ?? 0) + (answers.q8 ?? 0) + (answers.q9 ?? 0);
  const d3Score = computeDimensionScore(d3Raw);

  // Dimension 4: Love Style (subtype + intensity)
  const loveStyle = computeLoveStyle(answers.q10, answers.q11, answers.q12);
  const d4Score = loveStyle.intensity;

  // Dimension 5: Future Alignment Mindset
  const d5Raw = (answers.q13 ?? 0) + (answers.q14 ?? 0) + (answers.q15 ?? 0);
  const d5Score = computeDimensionScore(d5Raw);

  // Dimension 6: Consistency of Effort
  const d6Raw = (answers.q16 ?? 0) + (answers.q17 ?? 0) + (answers.q18 ?? 0);
  const d6Score = computeDimensionScore(d6Raw);

  const dimensionScores: DimensionScore[] = [
    {
      id: 'emotionalAwareness',
      name: 'Personal Emotional Awareness',
      score: d1Score,
      rawScore: d1Raw,
      icon: '🔍',
      description:
        'How clearly you understand and identify your own emotions in real time. High awareness means you can name what you feel — and why.',
    },
    {
      id: 'emotionalRegulation',
      name: 'Emotional Regulation',
      score: d2Score,
      rawScore: d2Raw,
      icon: '🌊',
      description:
        'Your ability to manage emotional intensity during conflict and return to calm. This is the foundation of healthy disagreement.',
    },
    {
      id: 'empathyValidation',
      name: 'Empathy & Validation',
      score: d3Score,
      rawScore: d3Raw,
      icon: '🫶',
      description:
        "How naturally you attune to your partner's emotional world and make them feel seen, heard, and understood.",
    },
    {
      id: 'loveStyle',
      name: 'Love Style Intensity',
      score: d4Score,
      icon: '💎',
      description: `Your primary love style is ${loveStyle.subtype}. The intensity score reflects how strongly this style defines your emotional experience.`,
    },
    {
      id: 'futureAlignment',
      name: 'Future Alignment Mindset',
      score: d5Score,
      rawScore: d5Raw,
      icon: '🔭',
      description:
        'How intentionally you think about building a shared future. High scores signal long-term vision and collaborative planning instincts.',
    },
    {
      id: 'consistencyEffort',
      name: 'Consistency of Effort',
      score: d6Score,
      rawScore: d6Raw,
      icon: '⚡',
      description:
        'How reliably you invest in the relationship — not just when it feels exciting, but especially when it feels routine.',
    },
  ];

  const userVector = [d1Score, d2Score, d3Score, d4Score, d5Score, d6Score];
  const archetypeResult = matchArchetype(userVector);

  return { dimensionScores, loveStyle, archetypeResult };
}

// ─── Score Display Helpers ─────────────────────────────────────────────────────

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Developing';
  if (score >= 35) return 'Emerging';
  return 'Foundational';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#4CAF9A';
  if (score >= 65) return '#5B8FD4';
  if (score >= 50) return '#F6B17A';
  if (score >= 35) return '#E0A86A';
  return '#7077A1';
}

export function getLoveSubtypeLabel(subtype: LoveSubtype): string {
  const labels: Record<LoveSubtype, string> = {
    Physical: 'Physical Touch',
    Verbal: 'Words of Affirmation',
    Presence: 'Quality Time',
    Action: 'Acts of Service',
  };
  return labels[subtype];
}

export function getLoveSubtypeDescription(subtype: LoveSubtype): string {
  const descriptions: Record<LoveSubtype, string> = {
    Physical:
      'Physical connection is your primary love language. Touch, closeness, and physical presence are how you feel most loved and connected.',
    Verbal:
      'Words hold deep power for you. Loving affirmations, reassurance, and heartfelt expression make you feel truly valued.',
    Presence:
      'Undivided attention is your deepest need. Quality time — fully present, undistracted — is how love becomes real to you.',
    Action:
      "Thoughtful actions speak louder than words. When someone goes out of their way to make your life better, that's when you know you're loved.",
  };
  return descriptions[subtype];
}
