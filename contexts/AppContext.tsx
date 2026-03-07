'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AppState, AppPhase, IntroContext, AssessmentAnswers, UserProfile } from '@/types';
import { computeAllScores } from '@/lib/scoring';
import { saveProfile, loadProfile, saveAppState, loadAppState, clearAllStorage } from '@/lib/storage';
import { saveProfileToSupabase, fetchProfileByAuthId } from '@/lib/db';
import { createCoupleRecord, linkPartner2ToCoupleRecord } from '@/lib/couples';
import { getSession, getUser } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

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
  isInvited: false,
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
  | { type: 'SET_IS_INVITED'; payload: boolean }
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
        assessmentAnswers: { ...state.assessmentAnswers, ...action.payload } as AssessmentAnswers,
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
    case 'SET_IS_INVITED':
      return { ...state, isInvited: action.payload };
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
  authUser: User | null;
  authLoading: boolean;
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
  setIsInvited: (value: boolean) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check auth session and restore profile on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // 1. Check for existing Supabase session
        const session = await getSession();

        if (session?.user && !cancelled) {
          setAuthUser(session.user);

          // Try to restore profile from Supabase
          const { profile: remoteProfile, coupleId } = await fetchProfileByAuthId(session.user.id);

          if (remoteProfile && !cancelled) {
            dispatch({ type: 'SET_PROFILE', payload: remoteProfile });
            dispatch({
              type: 'RESTORE',
              payload: {
                phase: 'dashboard',
                profile: remoteProfile,
                coupleId: coupleId ?? undefined,
              },
            });
            saveProfile(remoteProfile);
            if (coupleId) saveAppState({ coupleId });
            setAuthLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('[PowerPair] Auth session check failed, falling back to localStorage:', e);
      }

      // 2. Fall back to localStorage
      const savedProfile = loadProfile();
      const savedState = loadAppState();

      if (savedProfile && !cancelled) {
        dispatch({ type: 'SET_PROFILE', payload: savedProfile });
        if (savedState?.phase === 'dashboard' || savedState?.phase === 'reveal') {
          dispatch({ type: 'RESTORE', payload: { ...savedState, profile: savedProfile } });
        } else if (savedState?.coupleId) {
          dispatch({ type: 'SET_COUPLE_ID', payload: savedState.coupleId });
        }
      } else if (savedState && !cancelled) {
        dispatch({ type: 'RESTORE', payload: savedState });
      }

      if (!cancelled) setAuthLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Listen for auth changes (e.g. after OAuth callback)
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const { supabase } = require('@/lib/supabase');
      const { data } = supabase.auth.onAuthStateChange(
        async (_event: string, session: { user: User } | null) => {
          if (session?.user) {
            setAuthUser(session.user);

            // If user just signed in and has no profile yet, try fetching
            if (!state.profile) {
              const { profile, coupleId } = await fetchProfileByAuthId(session.user.id);
              if (profile) {
                dispatch({ type: 'SET_PROFILE', payload: profile });
                dispatch({
                  type: 'RESTORE',
                  payload: { phase: 'dashboard', profile, coupleId: coupleId ?? undefined },
                });
                saveProfile(profile);
              }
            }
          } else {
            setAuthUser(null);
          }
        }
      );
      subscription = data.subscription;
    } catch (e) {
      console.warn('[PowerPair] Auth listener setup failed:', e);
    }

    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        isInvited: state.isInvited,
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
    const { dimensionScores, archetypeResult } = computeAllScores(
      state.assessmentAnswers
    );

    // Use auth user ID if available, otherwise generate random
    const profileId = authUser?.id
      ?? (typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString());

    const profile: UserProfile = {
      id: profileId,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      introContext: state.introContext,
      assessmentAnswers: state.assessmentAnswers,
      dimensionScores,
      archetypeResult,
    };

    dispatch({ type: 'SET_PROFILE', payload: profile });
    saveProfile(profile);
    await saveProfileToSupabase(profile, authUser?.id);

    if (state.coupleId) {
      await linkPartner2ToCoupleRecord(state.coupleId, profile.id);
    } else {
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
  }, [state.assessmentAnswers, state.introContext, state.coupleId, authUser]);

  const setCoupleId = useCallback((id: string) => {
    dispatch({ type: 'SET_COUPLE_ID', payload: id });
    saveAppState({ coupleId: id });
  }, []);

  const setIsInvited = useCallback((value: boolean) => {
    dispatch({ type: 'SET_IS_INVITED', payload: value });
    saveAppState({ isInvited: value });
  }, []);

  const resetApp = useCallback(() => {
    clearAllStorage();
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      authUser,
      authLoading,
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
      setIsInvited,
      resetApp,
    }),
    [
      state,
      authUser,
      authLoading,
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
      setIsInvited,
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
