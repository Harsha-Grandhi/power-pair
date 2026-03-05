import {
  AssessmentAnswers,
  DimensionScore,
  DimensionId,
  StyleLetter,
  ArchetypeResult,
} from '@/types';
import { ASSESSMENT_QUESTIONS } from './questions';
import { getArchetypeByCode, ARCHETYPES } from './archetypes';

interface DimensionConfig {
  id: DimensionId;
  name: string;
  styleA: { name: string; letter: StyleLetter };
  styleB: { name: string; letter: StyleLetter };
  icon: string;
  description: string;
}

const DIMENSION_CONFIGS: DimensionConfig[] = [
  {
    id: 'emotionalStyle', name: 'Emotional Style',
    styleA: { name: 'Expressive', letter: 'E' },
    styleB: { name: 'Reserved', letter: 'R' },
    icon: '\u{1F4AC}',
    description: 'How you express emotions in your relationship.',
  },
  {
    id: 'conflictStyle', name: 'Conflict Style',
    styleA: { name: 'Direct', letter: 'D' },
    styleB: { name: 'Avoidant', letter: 'A' },
    icon: '\u{26A1}',
    description: 'How you handle disagreements and difficult conversations.',
  },
  {
    id: 'affectionStyle', name: 'Affection Style',
    styleA: { name: 'Romantic', letter: 'R' },
    styleB: { name: 'Practical', letter: 'P' },
    icon: '\u{1F49D}',
    description: 'How you express love and affection to your partner.',
  },
  {
    id: 'lifeRhythm', name: 'Life Rhythm',
    styleA: { name: 'Structured', letter: 'S' },
    styleB: { name: 'Spontaneous', letter: 'P' },
    icon: '\u{1F3B5}',
    description: 'Your lifestyle and planning preferences as a couple.',
  },
];

function computeDimensionRawScore(
  answers: AssessmentAnswers,
  dimensionId: DimensionId
): number {
  const dimensionQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => q.dimension === dimensionId
  );
  let total = 0;
  for (const q of dimensionQuestions) {
    const rawAnswer = answers[q.id];
    if (rawAnswer === undefined) continue;
    total += q.isReverse ? rawAnswer * -1 : rawAnswer;
  }
  return total;
}

export function isAllNeutral(answers: AssessmentAnswers): boolean {
  const dimensionIds: DimensionId[] = [
    'emotionalStyle', 'conflictStyle', 'affectionStyle', 'lifeRhythm',
  ];
  return dimensionIds.every(
    (dim) => computeDimensionRawScore(answers, dim) === 0
  );
}

export function computeAllScores(answers: AssessmentAnswers): {
  dimensionScores: DimensionScore[];
  archetypeResult: ArchetypeResult;
} {
  const dimensionScores: DimensionScore[] = DIMENSION_CONFIGS.map((config) => {
    const rawScore = computeDimensionRawScore(answers, config.id);
    const percentage = Math.round((Math.abs(rawScore) / 27) * 100);
    const isStyleA = rawScore >= 0;
    const style = isStyleA ? config.styleA : config.styleB;

    return {
      id: config.id,
      name: config.name,
      rawScore,
      percentage,
      dominantStyle: style.name,
      styleLetter: style.letter,
      styleLabel: percentage + '% ' + style.name,
      icon: config.icon,
      description: config.description,
    };
  });

  const code = dimensionScores.map((d) => d.styleLetter).join('');
  const archetype = getArchetypeByCode(code) || ARCHETYPES[0];

  const archetypeResult: ArchetypeResult = {
    primary: archetype,
    code,
    dimensionScores,
  };

  return { dimensionScores, archetypeResult };
}

export function getScoreLabel(percentage: number): string {
  if (percentage >= 80) return 'Very Strong';
  if (percentage >= 60) return 'Strong';
  if (percentage >= 40) return 'Moderate';
  if (percentage >= 20) return 'Mild';
  return 'Balanced';
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#4CAF9A';
  if (percentage >= 60) return '#5B8FD4';
  if (percentage >= 40) return '#F6B17A';
  if (percentage >= 20) return '#E0A86A';
  return '#7077A1';
}
