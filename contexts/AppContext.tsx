'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { AppState, AppPhase, IntroContext, AssessmentAnswers, UserProfile } from '@/types';
import { computeAllScores } from '@/lib/scoring';
import { saveProfile, loadProfile, saveAppState, loadAppState, clearAllStorage } from '@/lib/storage';
import { saveProfileToSupabase } from '@/lib/db';
import { createCoupleRecord, linkPartner2ToCoupleRecord } from '@/lib/couples';

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: AppState = {
  phase: 'landing',
  introContext: {},
  assessmentAnswers: {},
  currentIntroStep: 0,
  currentAssessmentStep: 0,
  currentRevealStep: 0,
  profile: null,
  coupleId: null,
};

// ─── Actions ───────────────────────────────────────────────────────────────────

type AppAction =
  | { type: 'SET_PHASE'; payload: AppPhase }
  | { type: 'SET_INTRO_ANSWER'; payload: Partial<IntroContext> }
  | { type: 'SET_ASSESSMENT_ANSWER'; payload: Partial<AssessmentAnswers> }
  | { type: 'SET_INTRO_STEP'; payload: number }
  | { type: 'SET_ASSESSMENT_STEP'; payload: number }
  | { type: 'SET_REVEAL_STEP'; payload: number }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_COUPLE_ID'; payload: string }
  | { type: 'RESTORE'; payload: Partial<AppState> }
  | { type: 'RESET' };

// ─── Reducer ───────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
    case 'SET_INTRO_ANSWER':
      return { ...state, introContext: { ...state.introContext, ...action.payload } };
    case 'SET_ASSESSMENT_ANSWER':
      return {
        ...state,
        assessmentAnswers: { ...state.assessmentAnswers, ...action.payload },
      };
    case 'SET_INTRO_STEP':
      return { ...state, currentIntroStep: action.payload };
    case 'SET_ASSESSMENT_STEP':
      return { ...state, currentAssessmentStep: action.payload };
    case 'SET_REVEAL_STEP':
      return { ...state, currentRevealStep: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_COUPLE_ID':
      return { ...state, coupleId: action.payload };
    case 'RESTORE':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ─── Context Type ──────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setPhase: (phase: AppPhase) => void;
  setIntroAnswer: (answer: Partial<IntroContext>) => void;
  setAssessmentAnswer: (answer: Partial<AssessmentAnswers>) => void;
  setIntroStep: (step: number) => void;
  setAssessmentStep: (step: number) => void;
  advanceIntroStep: () => void;
  advanceAssessmentStep: () => void;
  advanceRevealStep: () => void;
  computeAndSaveProfile: () => Promise<UserProfile>;
  setCoupleId: (id: string) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore persisted state on mount
  useEffect(() => {
    const savedProfile = loadProfile();
    const savedState = loadAppState();

    if (savedProfile) {
      dispatch({ type: 'SET_PROFILE', payload: savedProfile });
      // If assessment was completed, restore to dashboard
      if (savedState?.phase === 'dashboard' || savedState?.phase === 'reveal') {
        dispatch({ type: 'RESTORE', payload: { ...savedState, profile: savedProfile } });
      } else if (savedState?.coupleId) {
        dispatch({ type: 'SET_COUPLE_ID', payload: savedState.coupleId });
      }
    } else if (savedState) {
      dispatch({ type: 'RESTORE', payload: savedState });
    }
  }, []);

  // Persist state changes (only after user has started onboarding)
  useEffect(() => {
    if (state.phase !== 'landing') {
      saveAppState({
        phase: state.phase,
        introContext: state.introContext,
        assessmentAnswers: state.assessmentAnswers,
        currentIntroStep: state.currentIntroStep,
        currentAssessmentStep: state.currentAssessmentStep,
        currentRevealStep: state.currentRevealStep,
        coupleId: state.coupleId,
      });
    }
  }, [state]);

  const setPhase = useCallback((phase: AppPhase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  const setIntroAnswer = useCallback((answer: Partial<IntroContext>) => {
    dispatch({ type: 'SET_INTRO_ANSWER', payload: answer });
  }, []);

  const setAssessmentAnswer = useCallback((answer: Partial<AssessmentAnswers>) => {
    dispatch({ type: 'SET_ASSESSMENT_ANSWER', payload: answer });
  }, []);

  const setIntroStep = useCallback((step: number) => {
    dispatch({ type: 'SET_INTRO_STEP', payload: step });
  }, []);

  const setAssessmentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_ASSESSMENT_STEP', payload: step });
  }, []);

  const advanceIntroStep = useCallback(() => {
    dispatch({ type: 'SET_INTRO_STEP', payload: state.currentIntroStep + 1 });
  }, [state.currentIntroStep]);

  const advanceAssessmentStep = useCallback(() => {
    dispatch({ type: 'SET_ASSESSMENT_STEP', payload: state.currentAssessmentStep + 1 });
  }, [state.currentAssessmentStep]);

  const advanceRevealStep = useCallback(() => {
    dispatch({ type: 'SET_REVEAL_STEP', payload: state.currentRevealStep + 1 });
  }, [state.currentRevealStep]);

  const computeAndSaveProfile = useCallback(async (): Promise<UserProfile> => {
    const { dimensionScores, loveStyle, archetypeResult } = computeAllScores(
      state.assessmentAnswers
    );

    const profile: UserProfile = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      introContext: state.introContext,
      assessmentAnswers: state.assessmentAnswers,
      dimensionScores,
      loveStyle,
      archetypeResult,
    };

    dispatch({ type: 'SET_PROFILE', payload: profile });
    saveProfile(profile);                       // localStorage (instant, offline-first)
    await saveProfileToSupabase(profile);       // Supabase (await so couple linking runs after)

    if (state.coupleId) {
      // Partner 2 flow — link to existing couple
      await linkPartner2ToCoupleRecord(state.coupleId, profile.id);
    } else {
      // Partner 1 flow — create new couple record
      const newCoupleId = await createCoupleRecord(
        profile.id,
        profile.introContext.name ?? null
      );
      if (newCoupleId) {
        dispatch({ type: 'SET_COUPLE_ID', payload: newCoupleId });
        saveAppState({ coupleId: newCoupleId });
      }
    }

    return profile;
  }, [state.assessmentAnswers, state.introContext, state.coupleId]);

  const setCoupleId = useCallback((id: string) => {
    dispatch({ type: 'SET_COUPLE_ID', payload: id });
    saveAppState({ coupleId: id });
  }, []);

  const resetApp = useCallback(() => {
    clearAllStorage();
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      setPhase,
      setIntroAnswer,
      setAssessmentAnswer,
      setIntroStep,
      setAssessmentStep,
      advanceIntroStep,
      advanceAssessmentStep,
      advanceRevealStep,
      computeAndSaveProfile,
      setCoupleId,
      resetApp,
    }),
    [
      state,
      setPhase,
      setIntroAnswer,
      setAssessmentAnswer,
      setIntroStep,
      setAssessmentStep,
      advanceIntroStep,
      advanceAssessmentStep,
      advanceRevealStep,
      computeAndSaveProfile,
      setCoupleId,
      resetApp,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
