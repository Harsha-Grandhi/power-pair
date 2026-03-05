import { IntroQuestion, LikertQuestion } from '@/types';

export const INTRO_QUESTIONS: IntroQuestion[] = [
  { id: 'q0', questionKey: 'ageRange', question: 'What age range best describes you?', subtitle: 'This helps us calibrate your experience.', options: ['18-21', '22-25', '26-30', '31-35', '36+'] },
  { id: 'q1', questionKey: 'gender', question: 'How do you identify?', subtitle: 'Your identity shapes how we frame your insights.', options: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'] },
  { id: 'q2', questionKey: 'relationshipStage', question: 'Which best describes your current relationship stage?', subtitle: 'Context shapes what meaningful looks like for you.', options: ['Dating (less than 6 months)', 'Dating (6+ months)', 'Engaged', 'Married', 'In a long-distance relationship', "It's complicated"] },
  { id: 'q3', questionKey: 'seriousness', question: 'How serious do you currently feel about this relationship?', subtitle: 'Be honest -- there is no wrong answer here.', options: ["It's casual for me", "I'm exploring and figuring it out", 'I see long-term potential', "I'm fully committed long-term", 'I see this as my life partner'] },
  { id: 'q4', questionKey: 'conflictFrequency', question: 'How often do you and your partner have disagreements or conflicts?', subtitle: 'Conflict is natural -- what matters is how you handle it.', options: ['Rarely', 'Sometimes', 'Often', 'Very often'] },
  { id: 'q5', questionKey: 'conflictResolution', question: 'When arguments happen, how do they usually end?', subtitle: 'Think about your most recent disagreement.', options: ['We resolve things calmly and feel better', 'We resolve but something still feels heavy', 'One of us withdraws or shuts down', 'They remain unresolved for a while'] },
  { id: 'q6', questionKey: 'biggestChallenge', question: 'What feels like the biggest relationship challenge right now?', subtitle: 'Select what resonates most deeply.', options: ['Communication gaps', 'Trust issues', 'Uncertainty about the future', 'Not enough time together', 'Emotional misunderstandings', 'Nothing major at the moment'] },
];

const ALL_QUESTIONS: LikertQuestion[] = [
  { id: 'es1', originalIndex: 1, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I easily share my feelings with my partner.', isReverse: false },
  { id: 'es2', originalIndex: 2, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'When something bothers me, I prefer talking about it openly.', isReverse: false },
  { id: 'es3', originalIndex: 3, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I enjoy deep emotional conversations.', isReverse: false },
  { id: 'es4', originalIndex: 4, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'My partner usually knows how I feel without guessing.', isReverse: false },
  { id: 'es5', originalIndex: 5, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'Expressing emotions strengthens relationships.', isReverse: false },
  { id: 'es6', originalIndex: 6, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I sometimes hold back my feelings even when something bothers me.', isReverse: true },
  { id: 'es7', originalIndex: 7, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I find it easy to be emotionally vulnerable.', isReverse: false },
  { id: 'es8', originalIndex: 8, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I take time before opening up emotionally.', isReverse: true },
  { id: 'es9', originalIndex: 9, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I naturally express affection through words and feelings.', isReverse: false },
  { id: 'cs1', originalIndex: 10, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'When an issue arises, I prefer addressing it immediately.', isReverse: false },
  { id: 'cs2', originalIndex: 11, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'Honest confrontation is healthier than avoiding problems.', isReverse: false },
  { id: 'cs3', originalIndex: 12, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I feel comfortable discussing difficult topics with my partner.', isReverse: false },
  { id: 'cs4', originalIndex: 13, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I avoid arguments to maintain peace.', isReverse: true },
  { id: 'cs5', originalIndex: 14, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'Healthy disagreements can strengthen relationships.', isReverse: false },
  { id: 'cs6', originalIndex: 15, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I prefer resolving issues right away rather than delaying them.', isReverse: false },
  { id: 'cs7', originalIndex: 16, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I often postpone difficult conversations.', isReverse: true },
  { id: 'cs8', originalIndex: 17, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I value clarity over temporary harmony.', isReverse: false },
  { id: 'cs9', originalIndex: 18, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I believe problems should be discussed openly.', isReverse: false },
  { id: 'as1', originalIndex: 19, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I enjoy planning romantic gestures for my partner.', isReverse: false },
  { id: 'as2', originalIndex: 20, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I like surprising my partner with thoughtful acts.', isReverse: false },
  { id: 'as3', originalIndex: 21, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Romantic moments are important in a relationship.', isReverse: false },
  { id: 'as4', originalIndex: 22, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I show love more through actions than romantic gestures.', isReverse: true },
  { id: 'as5', originalIndex: 23, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Celebrating relationship milestones matters to me.', isReverse: false },
  { id: 'as6', originalIndex: 24, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I enjoy creating special romantic memories.', isReverse: false },
  { id: 'as7', originalIndex: 25, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Doing practical things for my partner feels more meaningful than romantic gestures.', isReverse: true },
  { id: 'as8', originalIndex: 26, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I enjoy expressing love creatively.', isReverse: false },
  { id: 'as9', originalIndex: 27, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Romance is essential in a healthy relationship.', isReverse: false },
  { id: 'lr1', originalIndex: 28, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I prefer planning activities in advance.', isReverse: false },
  { id: 'lr2', originalIndex: 29, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I feel comfortable when life is organized.', isReverse: false },
  { id: 'lr3', originalIndex: 30, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I enjoy routines in my daily life.', isReverse: false },
  { id: 'lr4', originalIndex: 31, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I enjoy spontaneous plans more than scheduled ones.', isReverse: true },
  { id: 'lr5', originalIndex: 32, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Stability is important in my lifestyle.', isReverse: false },
  { id: 'lr6', originalIndex: 33, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Last-minute adventures excite me.', isReverse: true },
  { id: 'lr7', originalIndex: 34, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Sudden plan changes stress me.', isReverse: false },
  { id: 'lr8', originalIndex: 35, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I prefer knowing my schedule ahead of time.', isReverse: false },
  { id: 'lr9', originalIndex: 36, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I often make decisions spontaneously.', isReverse: true },
];

const JUMBLED_ORDER: number[] = [
  0, 9, 18, 27,
  4, 13, 22, 31,
  1, 10, 19, 28,
  7, 16, 25, 34,
  2, 11, 20, 29,
  5, 14, 23, 32,
  3, 12, 21, 30,
  8, 17, 26, 35,
  6, 15, 24, 33,
];

export const ASSESSMENT_QUESTIONS: LikertQuestion[] = JUMBLED_ORDER.map(
  (idx) => ALL_QUESTIONS[idx]
);

export const QUESTIONS_PER_PAGE = 6;
export const TOTAL_ASSESSMENT_PAGES = Math.ceil(ASSESSMENT_QUESTIONS.length / QUESTIONS_PER_PAGE);

export function getQuestionsForPage(page: number): LikertQuestion[] {
  const start = page * QUESTIONS_PER_PAGE;
  return ASSESSMENT_QUESTIONS.slice(start, start + QUESTIONS_PER_PAGE);
}

export const TOTAL_INTRO_STEPS = INTRO_QUESTIONS.length;
export const TOTAL_ASSESSMENT_STEPS = TOTAL_ASSESSMENT_PAGES;
export const TOTAL_REVEAL_STEPS = 8;
export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length;

export const LIKERT_OPTIONS = [
  { label: 'Strongly Agree', value: 3 },
  { label: 'Agree', value: 2 },
  { label: 'Slightly Agree', value: 1 },
  { label: 'Neutral', value: 0 },
  { label: 'Slightly Disagree', value: -1 },
  { label: 'Disagree', value: -2 },
  { label: 'Strongly Disagree', value: -3 },
];
