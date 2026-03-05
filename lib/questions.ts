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
  // Emotional Style (5 questions: 3 forward, 2 reverse)
  { id: 'es1', originalIndex: 1, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I easily share my feelings with my partner.', isReverse: false },
  { id: 'es2', originalIndex: 2, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'When something bothers me, I prefer talking about it openly.', isReverse: false },
  { id: 'es3', originalIndex: 3, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I enjoy deep emotional conversations.', isReverse: false },
  { id: 'es4', originalIndex: 4, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'My partner usually knows how I feel without guessing.', isReverse: false },
  { id: 'es6', originalIndex: 5, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I sometimes hold back my feelings even when something bothers me.', isReverse: true },

  // Conflict Style (5 questions: 3 forward, 2 reverse)
  { id: 'cs1', originalIndex: 6, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'When an issue arises, I prefer addressing it immediately.', isReverse: false },
  { id: 'cs2', originalIndex: 7, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'Honest confrontation is healthier than avoiding problems.', isReverse: false },
  { id: 'cs3', originalIndex: 8, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I feel comfortable discussing difficult topics with my partner.', isReverse: false },
  { id: 'cs4', originalIndex: 9, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I avoid arguments to maintain peace.', isReverse: true },
  { id: 'cs8', originalIndex: 10, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I value clarity over temporary harmony.', isReverse: false },

  // Affection Style (5 questions: 3 forward, 2 reverse)
  { id: 'as1', originalIndex: 11, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I enjoy planning romantic gestures for my partner.', isReverse: false },
  { id: 'as2', originalIndex: 12, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I like surprising my partner with thoughtful acts.', isReverse: false },
  { id: 'as3', originalIndex: 13, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Romantic moments are important in a relationship.', isReverse: false },
  { id: 'as4', originalIndex: 14, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'I show love more through actions than romantic gestures.', isReverse: true },
  { id: 'as5', originalIndex: 15, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Celebrating relationship milestones matters to me.', isReverse: false },

  // Life Rhythm (5 questions: 3 forward, 2 reverse)
  { id: 'lr1', originalIndex: 16, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I prefer planning activities in advance.', isReverse: false },
  { id: 'lr2', originalIndex: 17, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I feel comfortable when life is organized.', isReverse: false },
  { id: 'lr4', originalIndex: 18, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I enjoy spontaneous plans more than scheduled ones.', isReverse: true },
  { id: 'lr5', originalIndex: 19, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Stability is important in my lifestyle.', isReverse: false },
  { id: 'lr7', originalIndex: 20, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Sudden plan changes stress me.', isReverse: false },
];

// Jumble: interleave dimensions so same dimension doesn't appear back-to-back
const JUMBLED_ORDER: number[] = [
  0, 5, 10, 15,   // es1, cs1, as1, lr1
  3, 8, 13, 18,   // es4, cs4, as3, lr4
  1, 6, 11, 16,   // es2, cs2, as2, lr2
  4, 9, 14, 19,   // es6, cs8, as4, lr5
  2, 7, 12, 17,   // es3, cs3, as5, lr7
];

export const ASSESSMENT_QUESTIONS: LikertQuestion[] = JUMBLED_ORDER.map(
  (idx) => ALL_QUESTIONS[idx]
);

export const QUESTIONS_PER_PAGE = 5;
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
