import { IntroQuestion, ScoredQuestion } from '@/types';

// ─── Intro Context Questions (Q0–Q6, NOT scored) ───────────────────────────────

export const INTRO_QUESTIONS: IntroQuestion[] = [
  {
    id: 'q0',
    questionKey: 'ageRange',
    question: 'What age range best describes you?',
    subtitle: 'This helps us calibrate your experience.',
    options: ['18–21', '22–25', '26–30', '31–35', '36+'],
  },
  {
    id: 'q1',
    questionKey: 'gender',
    question: 'How do you identify?',
    subtitle: 'Your identity shapes how we frame your insights.',
    options: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'],
  },
  {
    id: 'q2',
    questionKey: 'relationshipStage',
    question: 'Which best describes your current relationship stage?',
    subtitle: 'Context shapes what meaningful looks like for you.',
    options: [
      'Dating (less than 6 months)',
      'Dating (6+ months)',
      'Engaged',
      'Married',
      'In a long-distance relationship',
      "It's complicated",
    ],
  },
  {
    id: 'q3',
    questionKey: 'seriousness',
    question: 'How serious do you currently feel about this relationship?',
    subtitle: 'Be honest — there is no wrong answer here.',
    options: [
      "It's casual for me",
      "I'm exploring and figuring it out",
      'I see long-term potential',
      "I'm fully committed long-term",
      'I see this as my life partner',
    ],
  },
  {
    id: 'q4',
    questionKey: 'conflictFrequency',
    question: 'How often do you and your partner have disagreements or conflicts?',
    subtitle: 'Conflict is natural — what matters is how you handle it.',
    options: ['Rarely', 'Sometimes', 'Often', 'Very often'],
  },
  {
    id: 'q5',
    questionKey: 'conflictResolution',
    question: 'When arguments happen, how do they usually end?',
    subtitle: 'Think about your most recent disagreement.',
    options: [
      'We resolve things calmly and feel better',
      'We resolve but something still feels heavy',
      'One of us withdraws or shuts down',
      'They remain unresolved for a while',
    ],
  },
  {
    id: 'q6',
    questionKey: 'biggestChallenge',
    question: 'What feels like the biggest relationship challenge right now?',
    subtitle: 'Select what resonates most deeply.',
    options: [
      'Communication gaps',
      'Trust issues',
      'Uncertainty about the future',
      'Not enough time together',
      'Emotional misunderstandings',
      'Nothing major at the moment',
    ],
  },
];

// ─── Core Scenario Questions (Q1–Q18, scored) ──────────────────────────────────

export const SCORED_QUESTIONS: ScoredQuestion[] = [
  // ── Dimension 1: Personal Emotional Awareness ──
  {
    id: 'q1',
    questionIndex: 1,
    dimension: 'Personal Emotional Awareness',
    dimensionId: 'emotionalAwareness',
    question:
      'Your partner cancels a dinner plan at the last minute because of work. What happens internally for you?',
    options: [
      {
        label: 'I immediately notice I feel disappointed or hurt, and I calmly express it.',
        score: 3,
      },
      {
        label: 'I say "It\'s okay," but later I reflect and realize I was upset.',
        score: 2,
      },
      {
        label: "I feel irritated, but I'm not fully sure why it bothered me so much.",
        score: 1,
      },
      {
        label: "I react sharply or go cold without thinking about what I'm actually feeling.",
        score: 0,
      },
    ],
  },
  {
    id: 'q2',
    questionIndex: 2,
    dimension: 'Personal Emotional Awareness',
    dimensionId: 'emotionalAwareness',
    question:
      'During a disagreement, your partner asks, "What are you actually feeling right now?" How do you respond?',
    options: [
      {
        label: "I can clearly explain whether I'm hurt, overwhelmed, insecure, or frustrated.",
        score: 3,
      },
      { label: 'I need a little time, but I can eventually explain it.', score: 2 },
      { label: 'I struggle to explain it and often say, "I don\'t know."', score: 1 },
      {
        label: "I get more frustrated because I genuinely don't understand my own feelings.",
        score: 0,
      },
    ],
  },
  {
    id: 'q3',
    questionIndex: 3,
    dimension: 'Personal Emotional Awareness',
    dimensionId: 'emotionalAwareness',
    question: "You've been feeling slightly distant for a few days. What do you typically do?",
    options: [
      { label: 'I reflect internally and identify what triggered the shift.', score: 3 },
      { label: "I sense something feels off but don't fully explore it.", score: 2 },
      { label: 'I assume it must be something my partner did.', score: 1 },
      {
        label: 'I act differently without ever understanding why the distance started.',
        score: 0,
      },
    ],
  },

  // ── Dimension 2: Emotional Regulation ──
  {
    id: 'q4',
    questionIndex: 4,
    dimension: 'Emotional Regulation',
    dimensionId: 'emotionalRegulation',
    question: 'In the middle of a heated argument, how do you typically behave?',
    options: [
      { label: 'I consciously lower my tone and slow the conversation.', score: 3 },
      { label: 'I may step away briefly but return when calmer.', score: 2 },
      { label: 'I raise my voice or speak impulsively.', score: 1 },
      { label: 'I shut down emotionally or completely withdraw.', score: 0 },
    ],
  },
  {
    id: 'q5',
    questionIndex: 5,
    dimension: 'Emotional Regulation',
    dimensionId: 'emotionalRegulation',
    question: 'After a conflict, how long does the emotional intensity usually stay with you?',
    options: [
      { label: 'It fades within minutes once resolved.', score: 3 },
      { label: 'It lingers for a couple of hours.', score: 2 },
      { label: 'It affects my mood for the rest of the day.', score: 1 },
      { label: 'I hold onto it for days or bring it up again later.', score: 0 },
    ],
  },
  {
    id: 'q6',
    questionIndex: 6,
    dimension: 'Emotional Regulation',
    dimensionId: 'emotionalRegulation',
    question:
      'Your partner says something triggering during a gathering with friends. What do you do?',
    options: [
      { label: 'I stay composed and bring it up privately later.', score: 3 },
      { label: 'I feel upset but try to manage it calmly in the moment.', score: 2 },
      { label: 'I react immediately and express my frustration there.', score: 1 },
      {
        label: 'I go silent and emotionally withdraw for the rest of the event.',
        score: 0,
      },
    ],
  },

  // ── Dimension 3: Empathy & Validation ──
  {
    id: 'q7',
    questionIndex: 7,
    dimension: 'Empathy & Validation',
    dimensionId: 'empathyValidation',
    question: 'Your partner comes home clearly stressed after work. What do you do?',
    options: [
      {
        label: "I sit with them, let them express fully, and validate what they're feeling.",
        score: 3,
      },
      { label: 'I listen and offer suggestions to fix the problem.', score: 2 },
      { label: 'I try to distract them with something lighter.', score: 1 },
      {
        label: 'I avoid emotional discussions because they feel uncomfortable.',
        score: 0,
      },
    ],
  },
  {
    id: 'q8',
    questionIndex: 8,
    dimension: 'Empathy & Validation',
    dimensionId: 'empathyValidation',
    question:
      'Your partner is upset about something that feels minor to you. How do you respond?',
    options: [
      {
        label: "I validate their feelings even if I personally don't think it's a big issue.",
        score: 3,
      },
      { label: "I explain logically why it might not be that serious.", score: 2 },
      { label: 'I feel impatient internally.', score: 1 },
      { label: "I think they're overreacting.", score: 0 },
    ],
  },
  {
    id: 'q9',
    questionIndex: 9,
    dimension: 'Empathy & Validation',
    dimensionId: 'empathyValidation',
    question:
      'When your partner shares a vulnerability or insecurity with you, you usually…',
    options: [
      { label: 'Lean in, ask questions, and make sure they feel heard.', score: 3 },
      { label: 'Reassure them quickly that everything will be okay.', score: 2 },
      { label: 'Feel slightly awkward but try to respond.', score: 1 },
      {
        label: 'Change the topic because emotional depth feels intense.',
        score: 0,
      },
    ],
  },

  // ── Dimension 4: Love Style (subtype mapping, not 0–3 scores) ──
  {
    id: 'q10',
    questionIndex: 10,
    dimension: 'Love Style',
    dimensionId: 'loveStyle',
    isLoveStyle: true,
    question:
      'If your partner wanted to surprise you in a meaningful way, what would impact you the most?',
    options: [
      {
        label: 'A warm physical gesture like a long hug or intimate affection.',
        score: 'Physical',
      },
      {
        label: 'A heartfelt message expressing how much I mean to them.',
        score: 'Verbal',
      },
      { label: 'Planning uninterrupted quality time just for us.', score: 'Presence' },
      {
        label: 'Doing something thoughtful to make my life easier.',
        score: 'Action',
      },
    ],
  },
  {
    id: 'q11',
    questionIndex: 11,
    dimension: 'Love Style',
    dimensionId: 'loveStyle',
    isLoveStyle: true,
    question: 'When you deeply miss your partner, what do you crave most?',
    options: [
      { label: 'Physical closeness.', score: 'Physical' },
      { label: 'Hearing loving words or reassurance.', score: 'Verbal' },
      { label: 'Undistracted time together.', score: 'Presence' },
      { label: 'Visible effort that shows I matter.', score: 'Action' },
    ],
  },
  {
    id: 'q12',
    questionIndex: 12,
    dimension: 'Love Style',
    dimensionId: 'loveStyle',
    isLoveStyle: true,
    question: 'When you start feeling unloved in a relationship, it is usually because…',
    options: [
      { label: 'Physical closeness has reduced noticeably.', score: 'Physical' },
      { label: 'Verbal affection and reassurance has decreased.', score: 'Verbal' },
      { label: 'Quality time feels distracted or limited.', score: 'Presence' },
      {
        label: 'Effort and thoughtful actions feel inconsistent.',
        score: 'Action',
      },
    ],
  },

  // ── Dimension 5: Future Alignment Mindset ──
  {
    id: 'q13',
    questionIndex: 13,
    dimension: 'Future Alignment Mindset',
    dimensionId: 'futureAlignment',
    question: "Your partner receives a job offer in another city. What's your first instinct?",
    options: [
      { label: 'Think about how this impacts both of you long-term.', score: 3 },
      { label: 'Discuss pros and cons thoughtfully.', score: 2 },
      { label: 'Think primarily about how it affects your own routine.', score: 1 },
      { label: 'Avoid thinking too far ahead.', score: 0 },
    ],
  },
  {
    id: 'q14',
    questionIndex: 14,
    dimension: 'Future Alignment Mindset',
    dimensionId: 'futureAlignment',
    question: 'When conversations about money come up, you tend to…',
    options: [
      { label: 'Naturally discuss future goals and shared planning.', score: 3 },
      { label: 'Plan sometimes, but not always deeply.', score: 2 },
      {
        label: 'Feel slightly uncomfortable discussing long-term finances.',
        score: 1,
      },
      { label: 'Prefer to live day-by-day without structured planning.', score: 0 },
    ],
  },
  {
    id: 'q15',
    questionIndex: 15,
    dimension: 'Future Alignment Mindset',
    dimensionId: 'futureAlignment',
    question: 'When you imagine your life five years from now, you…',
    options: [
      { label: 'Clearly picture your partner in that future.', score: 3 },
      { label: "Hope they're there but don't plan actively.", score: 2 },
      { label: 'Rarely think that far ahead.', score: 1 },
      { label: 'Focus entirely on the present.', score: 0 },
    ],
  },

  // ── Dimension 6: Consistency of Effort ──
  {
    id: 'q16',
    questionIndex: 16,
    dimension: 'Consistency of Effort',
    dimensionId: 'consistencyEffort',
    question: 'If you promise something small (like calling every night), you…',
    options: [
      { label: 'Almost always follow through consistently.', score: 3 },
      { label: 'Usually follow through but may occasionally forget.', score: 2 },
      { label: 'Often forget unless reminded.', score: 1 },
      { label: "Don't see small commitments as important.", score: 0 },
    ],
  },
  {
    id: 'q17',
    questionIndex: 17,
    dimension: 'Consistency of Effort',
    dimensionId: 'consistencyEffort',
    question:
      'After the honeymoon phase naturally fades, what typically happens with your effort?',
    options: [
      { label: 'I intentionally maintain or even increase effort.', score: 3 },
      { label: 'I remain consistent but slightly less expressive.', score: 2 },
      { label: 'I gradually reduce effort without realizing.', score: 1 },
      { label: 'I lose motivation easily once novelty fades.', score: 0 },
    ],
  },
  {
    id: 'q18',
    questionIndex: 18,
    dimension: 'Consistency of Effort',
    dimensionId: 'consistencyEffort',
    question: 'When the relationship feels routine or predictable, you usually…',
    options: [
      { label: 'Introduce new energy, conversations, or experiences.', score: 3 },
      { label: 'Wait for something to naturally change.', score: 2 },
      { label: "Feel bored but don't take action.", score: 1 },
      { label: 'Emotionally pull away or disengage.', score: 0 },
    ],
  },
];

export const TOTAL_INTRO_STEPS = INTRO_QUESTIONS.length;
export const TOTAL_ASSESSMENT_STEPS = SCORED_QUESTIONS.length;
export const TOTAL_REVEAL_STEPS = 4;
