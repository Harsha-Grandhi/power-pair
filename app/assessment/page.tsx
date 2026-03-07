'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
  getQuestionsForPage,
  TOTAL_ASSESSMENT_PAGES,
  TOTAL_QUESTIONS,
  QUESTIONS_PER_PAGE,
  ASSESSMENT_QUESTIONS,
} from '@/lib/questions';
import { isAllNeutral } from '@/lib/scoring';
import { signInWithGoogle } from '@/lib/auth';
import LikertScale from '@/components/assessment/LikertScale';
import ProgressBar from '@/components/ui/ProgressBar';
import FadeTransition from '@/components/ui/FadeTransition';
import { AssessmentAnswers } from '@/types';

export default function AssessmentPage() {
  const router = useRouter();
  const { state, authUser, setAssessmentAnswer, setPhase, setAssessmentStep, computeAndSaveProfile } =
    useApp();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  const [showSignUpGate, setShowSignUpGate] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const page = state.currentAssessmentStep;
  const questions = getQuestionsForPage(page);
  const globalOffset = page * QUESTIONS_PER_PAGE;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset active question when page changes
  useEffect(() => {
    setActiveQuestionIndex(0);
    questionRefs.current = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleLikertChange = useCallback(
    (questionId: string, value: number) => {
      setAssessmentAnswer({ [questionId]: value } as Partial<AssessmentAnswers>);

      // Auto-advance to next unanswered question on this page
      const currentLocalIndex = questions.findIndex(q => q.id === questionId);
      // Look for the next unanswered question after the current one
      let nextIndex = -1;
      for (let i = currentLocalIndex + 1; i < questions.length; i++) {
        if (state.assessmentAnswers[questions[i].id] === undefined) {
          nextIndex = i;
          break;
        }
      }
      // If no unanswered after current, check before (wrap around)
      if (nextIndex === -1) {
        for (let i = 0; i < currentLocalIndex; i++) {
          if (state.assessmentAnswers[questions[i].id] === undefined) {
            nextIndex = i;
            break;
          }
        }
      }

      if (nextIndex !== -1) {
        setActiveQuestionIndex(nextIndex);
        setTimeout(() => {
          questionRefs.current[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 200);
      } else {
        // All questions on page answered — keep current active
        setActiveQuestionIndex(currentLocalIndex);
      }
    },
    [questions, setAssessmentAnswer, state.assessmentAnswers]
  );

  const isPageComplete = questions.every(q => state.assessmentAnswers[q.id] !== undefined);

  const handleNext = useCallback(async () => {
    if (!isPageComplete) return;

    const isLastPage = page + 1 >= TOTAL_ASSESSMENT_PAGES;

    if (isLastPage) {
      // Check if all answers are neutral
      if (isAllNeutral(state.assessmentAnswers)) {
        setShowRetakeWarning(true);
        return;
      }

      // If not logged in, show sign-up gate
      if (!authUser) {
        setShowSignUpGate(true);
        return;
      }

      // Already logged in — proceed directly
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1300));
      await computeAndSaveProfile();
      setPhase('reveal');
      router.push('/reveal');
    } else {
      setAssessmentStep(page + 1);
    }
  }, [isPageComplete, page, state.assessmentAnswers, authUser, setAssessmentStep, computeAndSaveProfile, setPhase, router]);

  const handleBack = () => {
    if (page === 0) {
      router.push('/onboarding');
    } else {
      setAssessmentStep(page - 1);
    }
  };

  const handleRetake = () => {
    setShowRetakeWarning(false);
    setAssessmentStep(0);
    // Clear all assessment answers
    const cleared: AssessmentAnswers = {};
    ASSESSMENT_QUESTIONS.forEach(q => { cleared[q.id] = undefined as unknown as number; });
    setAssessmentAnswer(cleared);
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    // Mark that we're waiting to reveal after auth
    sessionStorage.setItem('pp_pending_reveal', '1');
    try {
      await signInWithGoogle();
    } catch {
      setSigningIn(false);
      sessionStorage.removeItem('pp_pending_reveal');
    }
  };

  // When authUser becomes available while on sign-up gate, proceed
  useEffect(() => {
    if (showSignUpGate && authUser) {
      setShowSignUpGate(false);
      setIsSubmitting(true);
      (async () => {
        await new Promise((r) => setTimeout(r, 1300));
        await computeAndSaveProfile();
        setPhase('reveal');
        router.push('/reveal');
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, showSignUpGate]);

  if (!mounted) return null;

  // Sign-up gate
  if (showSignUpGate) {
    return (
      <main className="relative min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pp-secondary/15 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-sm w-full text-center space-y-6">
          <div className="text-5xl">🔒</div>
          <h2 className="font-display text-2xl text-white">Your results are ready!</h2>
          <p className="text-sm text-pp-text-muted leading-relaxed">
            Create an account to see your relationship archetype, save your results, and connect with your partner.
          </p>
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full py-3.5 rounded-xl bg-white text-gray-800 font-semibold text-sm
              hover:bg-white/90 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {signingIn ? 'Redirecting...' : 'Continue with Google'}
          </button>
          <p className="text-xs text-pp-text-muted/60">
            Your quiz answers are saved. Sign in to unlock your results.
          </p>
        </div>
      </main>
    );
  }

  // Retake warning modal
  if (showRetakeWarning) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 gap-8">
        <div className="max-w-sm text-center space-y-4">
          <div className="text-4xl">&#x1F914;</div>
          <h2 className="font-display text-2xl text-white">All Neutral Answers</h2>
          <p className="text-sm text-pp-text-muted leading-relaxed">
            It looks like all your answers were neutral. For accurate results, please retake the assessment and answer based on how you genuinely feel.
          </p>
          <button
            onClick={handleRetake}
            className="mt-4 w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </main>
    );
  }

  // Processing overlay
  if (isSubmitting) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 gap-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-pp-accent/25 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">&#x1F491;</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl text-white">Analyzing your personality...</h2>
          <p className="text-sm text-pp-text-muted">
            Mapping 4 dimensions and matching your archetype
          </p>
        </div>
      </main>
    );
  }

  const answeredOnPage = questions.filter(q => state.assessmentAnswers[q.id] !== undefined).length;
  const totalAnswered = Object.keys(state.assessmentAnswers).filter(k => state.assessmentAnswers[k] !== undefined).length;

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pp-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-pp-secondary/12 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-dvh max-w-lg mx-auto w-full px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-12 pb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-pp-text-muted hover:text-white transition-colors text-sm focus:outline-none"
          >
            &#x2190; Back
          </button>
          <span className="text-xs text-pp-text-muted border border-white/10 px-2.5 py-1 rounded-full">
            Page {page + 1} of {TOTAL_ASSESSMENT_PAGES}
          </span>
          <span className="text-xs text-pp-text-muted">
            {totalAnswered}/{TOTAL_QUESTIONS}
          </span>
        </header>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            current={totalAnswered}
            total={TOTAL_QUESTIONS}
            label="Assessment"
            showSteps
            color="#F6B17A"
          />
        </div>

        {/* Questions */}
        <div className="flex-1 space-y-6 pb-4">
          <FadeTransition transitionKey={page}>
            <div className="space-y-6">
              {questions.map((q, localIdx) => {
                const isActive = localIdx === activeQuestionIndex;
                const isAnswered = state.assessmentAnswers[q.id] !== undefined;
                const globalIdx = globalOffset + localIdx;

                return (
                  <div
                    key={q.id}
                    ref={(el) => { questionRefs.current[localIdx] = el; }}
                    onClick={() => setActiveQuestionIndex(localIdx)}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-pp-accent/40 bg-pp-card/80 shadow-lg shadow-pp-accent/5'
                        : isAnswered
                        ? 'border-white/10 bg-pp-card/40 opacity-60'
                        : 'border-white/5 bg-pp-card/20 opacity-40'
                    }`}
                  >
                    {/* Dimension tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-pp-text-muted bg-white/5 px-2 py-0.5 rounded-full">
                        {q.dimensionLabel}
                      </span>
                      <span className="text-[10px] text-pp-text-muted">
                        Q{globalIdx + 1}
                      </span>
                      {isAnswered && !isActive && (
                        <span className="text-[10px] text-pp-accent ml-auto">&#x2713;</span>
                      )}
                    </div>

                    {/* Question text */}
                    <p className={`text-sm sm:text-base mb-4 leading-relaxed ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {q.question}
                    </p>

                    {/* Likert scale */}
                    <LikertScale
                      questionId={q.id}
                      value={state.assessmentAnswers[q.id]}
                      onChange={handleLikertChange}
                      isActive={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </FadeTransition>
        </div>

        {/* Footer with Next button */}
        <div className="py-6 space-y-3">
          <button
            onClick={handleNext}
            disabled={!isPageComplete}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isPageComplete
                ? 'bg-pp-accent text-pp-bg-dark hover:bg-pp-accent/90 shadow-lg shadow-pp-accent/20'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {page + 1 >= TOTAL_ASSESSMENT_PAGES ? 'See My Results' : 'Next Page'}
          </button>
          <p className="text-center text-xs text-pp-text-muted/55">
            {answeredOnPage}/{questions.length} answered on this page
          </p>
        </div>
      </div>
    </main>
  );
}
