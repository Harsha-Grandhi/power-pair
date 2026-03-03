// ─── Core Domain Types for Power Pair ────────────────────────────────────────

export type LoveSubtype = 'Physical' | 'Verbal' | 'Presence' | 'Action';

export type AgeRange = '18–21' | '22–25' | '26–30' | '31–35' | '36+';

export type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Prefer not to say';

export type RelationshipStage =
  | 'Dating (less than 6 months)'
  | 'Dating (6+ months)'
  | 'Engaged'
  | 'Married'
  | 'In a long-distance relationship'
  | "It's complicated";

export type SeriousnessLevel =
  | "It's casual for me"
  | "I'm exploring and figuring it out"
  | 'I see long-term potential'
  | "I'm fully committed long-term"
  | 'I see this as my life partner';

export type ConflictFrequency = 'Rarely' | 'Sometimes' | 'Often' | 'Very often';

export type ConflictResolution =
  | 'We resolve things calmly and feel better'
  | 'We resolve but something still feels heavy'
  | 'One of us withdraws or shuts down'
  | 'They remain unresolved for a while';

export type RelationshipChallenge =
  | 'Communication gaps'
  | 'Trust issues'
  | 'Uncertainty about the future'
  | 'Not enough time together'
  | 'Emotional misunderstandings'
  | 'Nothing major at the moment';

// ─── Onboarding Context ────────────────────────────────────────────────────────

export interface IntroContext {
  name?: string;
  phoneNumber?: string;
  email?: string;
  ageRange?: AgeRange;
  gender?: Gender;
  relationshipStage?: RelationshipStage;
  seriousness?: SeriousnessLevel;
  conflictFrequency?: ConflictFrequency;
  conflictResolution?: ConflictResolution;
  biggestChallenge?: RelationshipChallenge;
}

// ─── Assessment Answers ────────────────────────────────────────────────────────

export interface AssessmentAnswers {
  // Dimension 1: Personal Emotional Awareness
  q1?: number;
  q2?: number;
  q3?: number;
  // Dimension 2: Emotional Regulation
  q4?: number;
  q5?: number;
  q6?: number;
  // Dimension 3: Empathy & Validation
  q7?: number;
  q8?: number;
  q9?: number;
  // Dimension 4: Love Style (subtype tags, not numeric scores)
  q10?: LoveSubtype;
  q11?: LoveSubtype;
  q12?: LoveSubtype;
  // Dimension 5: Future Alignment Mindset
  q13?: number;
  q14?: number;
  q15?: number;
  // Dimension 6: Consistency of Effort
  q16?: number;
  q17?: number;
  q18?: number;
}

// ─── Scoring Types ─────────────────────────────────────────────────────────────

export interface DimensionScore {
  id: string;
  name: string;
  score: number; // 0–100
  rawScore?: number;
  icon: string;
  description: string;
}

export interface LoveStyleResult {
  subtype: LoveSubtype;
  intensity: number; // 0–100
  subtypeDistribution: Record<LoveSubtype, number>;
}

export interface ArchetypeResult {
  primary: Archetype;
  secondary?: Archetype;
  confidence: number; // 0–100
  distance: number;
}

// ─── Archetype Definition ──────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  prototype: [number, number, number, number, number, number];
  description: string;
  strengths: string[];
  growthEdge: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

// ─── User Profile ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  createdAt: string;
  completedAt?: string;
  introContext: IntroContext;
  assessmentAnswers: AssessmentAnswers;
  dimensionScores: DimensionScore[];
  loveStyle: LoveStyleResult;
  archetypeResult: ArchetypeResult;
}

// ─── Couple Compatibility Types ────────────────────────────────────────────────

export interface DimensionComparison {
  dimension: string;
  name: string;
  icon: string;
  p1Score: number;
  p2Score: number;
  similarity: number;
}

export interface CoupleCompatibility {
  overallScore: number;
  dimensions: DimensionComparison[];
  loveStyleMatch: boolean;
  loveStyleNote: string;
  archetypePairingNote: string;
  strengthsTogether: string[];
  growthTogether: string[];
}

// ─── App Navigation ────────────────────────────────────────────────────────────

export type AppPhase =
  | 'landing'
  | 'onboarding'
  | 'assessment'
  | 'processing'
  | 'reveal'
  | 'dashboard';

export interface AppState {
  phase: AppPhase;
  introContext: IntroContext;
  assessmentAnswers: AssessmentAnswers;
  currentIntroStep: number;
  currentAssessmentStep: number;
  currentRevealStep: number;
  profile: UserProfile | null;
  coupleId: string | null;
}

// ─── Question Types ────────────────────────────────────────────────────────────

export interface IntroQuestion {
  id: string;
  questionKey: keyof IntroContext;
  question: string;
  subtitle?: string;
  options: string[];
}

export interface ScoredQuestionOption {
  label: string;
  score: number | LoveSubtype;
}

export interface ScoredQuestion {
  id: string;
  questionIndex: number;
  dimension: string;
  dimensionId: string;
  question: string;
  isLoveStyle?: boolean;
  options: ScoredQuestionOption[];
}
