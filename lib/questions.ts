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
  // ── Emotional Style (Expressive vs Reserved) ──────────────────────────────
  { id: 'es1', originalIndex: 1, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: "After a tough day, I'd rather talk it out with my partner than process it alone.", isReverse: false },
  { id: 'es2', originalIndex: 2, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: "When I'm excited about something, my partner is the first person I tell.", isReverse: false },
  { id: 'es3', originalIndex: 3, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: 'I need some time alone before I can talk about something that upset me.', isReverse: true },
  { id: 'es4', originalIndex: 4, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: "I tend to share how I'm feeling throughout the day, not just at night.", isReverse: false },
  { id: 'es5', originalIndex: 5, dimension: 'emotionalStyle', dimensionLabel: 'Emotional Style', question: "I'd rather figure out my emotions on my own before bringing them up.", isReverse: true },

  // ── Conflict Style (Direct vs Avoidant) ───────────────────────────────────
  { id: 'cs1', originalIndex: 6, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: "If something my partner did bothered me, I'd bring it up that same day.", isReverse: false },
  { id: 'cs2', originalIndex: 7, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: "I'd rather have an uncomfortable conversation now than let resentment build.", isReverse: false },
  { id: 'cs3', originalIndex: 8, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: "I pick my battles \u2014 not every disagreement needs a full conversation.", isReverse: true },
  { id: 'cs4', originalIndex: 9, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: "When we disagree, I'd rather hash it out right then even if it gets heated.", isReverse: false },
  { id: 'cs5', originalIndex: 10, dimension: 'conflictStyle', dimensionLabel: 'Conflict Style', question: 'I believe some things resolve themselves if you give them space and time.', isReverse: true },

  // ── Affection Style (Romantic vs Practical) ───────────────────────────────
  { id: 'as1', originalIndex: 11, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: "I'd rather plan a surprise date night than help my partner with their to-do list.", isReverse: false },
  { id: 'as2', originalIndex: 12, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Handwritten notes and thoughtful gifts mean more to me than practical help.', isReverse: false },
  { id: 'as3', originalIndex: 13, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: "I show love by making my partner's life easier, not through grand gestures.", isReverse: true },
  { id: 'as4', originalIndex: 14, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: "I love setting the mood \u2014 candles, music, the whole vibe.", isReverse: false },
  { id: 'as5', originalIndex: 15, dimension: 'affectionStyle', dimensionLabel: 'Affection Style', question: 'Fixing something broken at home feels more loving to me than buying flowers.', isReverse: true },

  // ── Life Rhythm (Structured vs Spontaneous) ───────────────────────────────
  { id: 'lr1', originalIndex: 16, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: "I like knowing what we're doing this weekend by Wednesday.", isReverse: false },
  { id: 'lr2', originalIndex: 17, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'A spontaneous road trip sounds more fun than a planned vacation.', isReverse: true },
  { id: 'lr3', originalIndex: 18, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'I feel most relaxed when my week is mapped out.', isReverse: false },
  { id: 'lr4', originalIndex: 19, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: "I'd rather see where the night takes us than follow a dinner reservation.", isReverse: true },
  { id: 'lr5', originalIndex: 20, dimension: 'lifeRhythm', dimensionLabel: 'Life Rhythm', question: 'Routines make me feel grounded, not bored.', isReverse: false },
];

// Jumble: interleave dimensions so same dimension doesn't appear back-to-back
const JUMBLED_ORDER: number[] = [
  0, 5, 10, 15,   // es1, cs1, as1, lr1
  3, 8, 13, 18,   // es4, cs4, as3, lr4
  1, 6, 11, 16,   // es2, cs2, as2, lr2
  4, 9, 14, 19,   // es5, cs5, as4, lr5
  2, 7, 12, 17,   // es3, cs3, as5, lr3
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
export const TOTAL_REVEAL_STEPS = 7;
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
