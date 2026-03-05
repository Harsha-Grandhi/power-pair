// Core Domain Types for Power Pair

export type AgeRange = '18-21' | '22-25' | '26-30' | '31-35' | '36+';
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

export type DimensionId = 'emotionalStyle' | 'conflictStyle' | 'affectionStyle' | 'lifeRhythm';
export type StyleLetter = 'E' | 'R' | 'D' | 'A' | 'P' | 'S';
export type AssessmentAnswers = Record<string, number>;

export interface DimensionScore {
  id: DimensionId;
  name: string;
  rawScore: number;
  percentage: number;
  dominantStyle: string;
  styleLetter: StyleLetter;
  styleLabel: string;
  icon: string;
  description: string;
}

export interface ArchetypeResult {
  primary: Archetype;
  code: string;
  dimensionScores: DimensionScore[];
}

export interface Archetype {
  id: string;
  code: string;
  name: string;
  emoji: string;
  description: string;
  whatMakesYouUnique: string;
  strengths: string[];
  growthAreas: string[];
  whatYouNeedInPartner: string[];
  compatibleWith: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface UserProfile {
  id: string;
  createdAt: string;
  completedAt?: string;
  introContext: IntroContext;
  assessmentAnswers: AssessmentAnswers;
  dimensionScores: DimensionScore[];
  archetypeResult: ArchetypeResult;
}

export interface DimensionComparison {
  dimension: DimensionId;
  name: string;
  icon: string;
  p1Style: string;
  p1Percentage: number;
  p2Style: string;
  p2Percentage: number;
  compatibility: 'aligned' | 'complementary' | 'challenging';
  note: string;
}

export interface CoupleCompatibility {
  overallScore: number;
  p1Archetype: string;
  p2Archetype: string;
  compatibilityDescription: string;
  dimensions: DimensionComparison[];
  communicationAdvice: string[];
  conflictTips: string[];
  recommendedDateIdeas: string[];
  strengthsTogether: string[];
  growthTogether: string[];
}

export type AppPhase = 'landing' | 'onboarding' | 'assessment' | 'processing' | 'reveal' | 'dashboard';

export interface AppState {
  phase: AppPhase;
  introContext: IntroContext;
  assessmentAnswers: AssessmentAnswers;
  currentIntroStep: number;
  currentAssessmentStep: number;
  currentRevealStep: number;
  profile: UserProfile | null;
  coupleId: string | null;
  isInvited: boolean;
}

export interface IntroQuestion {
  id: string;
  questionKey: keyof IntroContext;
  question: string;
  subtitle?: string;
  options: string[];
}

export interface LikertQuestion {
  id: string;
  originalIndex: number;
  dimension: DimensionId;
  dimensionLabel: string;
  question: string;
  isReverse: boolean;
}
