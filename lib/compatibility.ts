import {
  DimensionScore,
  DimensionId,
  DimensionComparison,
  CoupleCompatibility,
  UserProfile,
} from '@/types';
import { getArchetypeByCode, ARCHETYPES } from './archetypes';

function compareDimension(
  p1Score: DimensionScore,
  p2Score: DimensionScore
): DimensionComparison {
  const sameSide = p1Score.styleLetter === p2Score.styleLetter;
  const diffPct = Math.abs(p1Score.percentage - p2Score.percentage);

  let compatibility: 'aligned' | 'complementary' | 'challenging';
  let note: string;

  if (sameSide && diffPct < 20) {
    compatibility = 'aligned';
    note = 'You both lean ' + p1Score.dominantStyle + ' -- this creates natural understanding.';
  } else if (sameSide) {
    compatibility = 'aligned';
    note = 'You share the same style but at different intensities -- room for balance.';
  } else if (diffPct < 30) {
    compatibility = 'complementary';
    note = 'Your different styles complement each other and create balance.';
  } else {
    compatibility = 'challenging';
    note = 'This is a growth area -- understanding each other\'s style is key.';
  }

  return {
    dimension: p1Score.id,
    name: p1Score.name,
    icon: p1Score.icon,
    p1Style: p1Score.dominantStyle,
    p1Percentage: p1Score.percentage,
    p2Style: p2Score.dominantStyle,
    p2Percentage: p2Score.percentage,
    compatibility,
    note,
  };
}

function computeOverallScore(dimensions: DimensionComparison[]): number {
  let score = 50; // base
  for (const d of dimensions) {
    if (d.compatibility === 'aligned') score += 12.5;
    else if (d.compatibility === 'complementary') score += 8;
    else score += 2;
  }
  return Math.min(100, Math.round(score));
}

function getCompatDescription(p1Code: string, p2Code: string, score: number): string {
  const p1 = getArchetypeByCode(p1Code);
  const p2 = getArchetypeByCode(p2Code);
  if (!p1 || !p2) return 'A unique pairing with potential for growth.';

  if (score >= 85) return p1.name + ' and ' + p2.name + ' are a powerhouse match. Your natural alignment creates deep understanding, effortless communication, and a strong emotional foundation.';
  if (score >= 70) return p1.name + ' and ' + p2.name + ' complement each other beautifully. Where one leads, the other supports, creating a balanced and enriching partnership.';
  if (score >= 55) return p1.name + ' and ' + p2.name + ' bring different strengths to the table. With mutual understanding and patience, this pairing has real potential for growth.';
  return p1.name + ' and ' + p2.name + ' are a dynamic contrast. This pairing requires intentional effort but can lead to profound personal growth and a deeply rewarding relationship.';
}

function getCommunicationAdvice(dimensions: DimensionComparison[]): string[] {
  const advice: string[] = [];
  const es = dimensions.find(d => d.dimension === 'emotionalStyle');
  const cs = dimensions.find(d => d.dimension === 'conflictStyle');

  if (es && es.compatibility === 'challenging') {
    advice.push('One of you is more expressive while the other is reserved -- create safe moments for emotional check-ins.');
    advice.push('The expressive partner should allow space; the reserved partner should try sharing more gradually.');
  } else if (es && es.compatibility === 'complementary') {
    advice.push('Your emotional styles balance each other -- lean into this by alternating who initiates deeper conversations.');
  } else {
    advice.push('Your similar emotional styles make communication natural -- keep nurturing this strength.');
  }

  if (cs && cs.compatibility === 'challenging') {
    advice.push('When conflict arises, agree on a cool-down period before discussing -- this respects both styles.');
  } else {
    advice.push('You handle conflict in compatible ways -- maintain open dialogue about what feels fair.');
  }

  return advice;
}

function getConflictTips(dimensions: DimensionComparison[]): string[] {
  const tips: string[] = [];
  const cs = dimensions.find(d => d.dimension === 'conflictStyle');

  if (cs && cs.p1Style === 'Direct' && cs.p2Style === 'Direct') {
    tips.push('Both being direct can escalate quickly -- establish ground rules for heated moments.');
    tips.push('Take turns speaking without interruption.');
    tips.push('Celebrate when you resolve issues quickly -- it\'s your superpower.');
  } else if (cs && cs.p1Style === 'Avoidant' && cs.p2Style === 'Avoidant') {
    tips.push('Neither of you likes confrontation -- schedule regular relationship check-ins to prevent buildup.');
    tips.push('Write down concerns if speaking them feels hard.');
    tips.push('Acknowledge when something is bothering you, even if briefly.');
  } else {
    tips.push('The direct partner should approach gently; the avoidant partner should signal when they need space.');
    tips.push('Use "I feel" statements to keep things safe.');
    tips.push('Set a time limit for breaks during disagreements so issues get resolved.');
  }

  return tips;
}

function getDateIdeas(dimensions: DimensionComparison[]): string[] {
  const ideas: string[] = [];
  const as = dimensions.find(d => d.dimension === 'affectionStyle');
  const lr = dimensions.find(d => d.dimension === 'lifeRhythm');

  if (as && (as.p1Style === 'Romantic' || as.p2Style === 'Romantic')) {
    ideas.push('Candlelit dinner at a new restaurant');
    ideas.push('Sunset picnic with handwritten notes');
  }
  if (as && (as.p1Style === 'Practical' || as.p2Style === 'Practical')) {
    ideas.push('Cook a new recipe together at home');
    ideas.push('Tackle a home project as a team');
  }
  if (lr && (lr.p1Style === 'Spontaneous' || lr.p2Style === 'Spontaneous')) {
    ideas.push('Random road trip with no destination');
    ideas.push('Try a completely new activity neither has done');
  }
  if (lr && (lr.p1Style === 'Structured' || lr.p2Style === 'Structured')) {
    ideas.push('Plan a themed date night in advance');
    ideas.push('Book a couples workshop or class together');
  }

  ideas.push('Take the quiz results and discuss what surprised you');
  return ideas.slice(0, 5);
}

export function computeCoupleCompatibility(
  profile1: UserProfile,
  profile2: UserProfile
): CoupleCompatibility {
  const p1Code = profile1.archetypeResult.code;
  const p2Code = profile2.archetypeResult.code;

  const dimensionIds: DimensionId[] = ['emotionalStyle', 'conflictStyle', 'affectionStyle', 'lifeRhythm'];

  const dimensions = dimensionIds.map(dimId => {
    const p1 = profile1.dimensionScores.find(d => d.id === dimId)!;
    const p2 = profile2.dimensionScores.find(d => d.id === dimId)!;
    return compareDimension(p1, p2);
  });

  const overallScore = computeOverallScore(dimensions);
  const compatibilityDescription = getCompatDescription(p1Code, p2Code, overallScore);

  const p1Arch = getArchetypeByCode(p1Code);
  const p2Arch = getArchetypeByCode(p2Code);

  const strengthsTogether = [
    ...(p1Arch ? p1Arch.strengths.slice(0, 2) : []),
    ...(p2Arch ? p2Arch.strengths.slice(0, 2) : []),
  ];

  const growthTogether = [
    ...(p1Arch ? p1Arch.growthAreas.slice(0, 1) : []),
    ...(p2Arch ? p2Arch.growthAreas.slice(0, 1) : []),
    'Practice patience with each other\'s different styles',
  ];

  return {
    overallScore,
    p1Archetype: p1Code,
    p2Archetype: p2Code,
    compatibilityDescription,
    dimensions,
    communicationAdvice: getCommunicationAdvice(dimensions),
    conflictTips: getConflictTips(dimensions),
    recommendedDateIdeas: getDateIdeas(dimensions),
    strengthsTogether,
    growthTogether,
  };
}
