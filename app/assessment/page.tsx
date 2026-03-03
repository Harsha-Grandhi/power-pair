'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { SCORED_QUESTIONS, TOTAL_ASSESSMENT_STEPS } from '@/lib/questions';
import ScenarioQuestion from '@/components/assessment/ScenarioQuestion';
import ProgressBar from '@/components/ui/ProgressBar';
import FadeTransition from '@/components/ui/FadeTransition';
import { LoveSubtype, AssessmentAnswers } from '@/types';

const SECTION_LABELS: Record<number, string> = {
  0: 'Emotional Awareness',
  3: 'Emotional Regulation',
  6: 'Empathy & Validation',
  9: 'Love Style',
  12: 'Future Alignment',
  15: 'Consistency of Effort',
};

function getSectionLabel(step: number): string {
  const keys = Object.keys(SECTION_LABELS).map(Number).sort((a, b) => a - b);
  let label = SECTION_LABELS[0];
  for (const k of keys) {
    if (step >= k) label = SECTION_LABELS[k];
  }
  return label;
}

export default function AssessmentPage() {
  const router = useRouter();
  const { state, setAssessmentAnswer, setPhase, setAssessmentStep, computeAndSaveProfile } =
    useApp();

  const [mounted, setMounted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | LoveSubtype | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent stale closure issues — store latest answers ref
  const answersRef = useRef(state.assessmentAnswers);
  useEffect(() => {
    answersRef.current = state.assessmentAnswers;
  }, [state.assessmentAnswers]);

  const step = state.currentAssessmentStep;
  const question = SCORED_QUESTIONS[step];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync selected value + reset advancing flag when step changes
  useEffect(() => {
    setIsAdvancing(false);
    if (question) {
      const key = question.id as keyof AssessmentAnswers;
      const existing = state.assessmentAnswers[key];
      setSelectedScore(existing as number | LoveSubtype | undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSelect = useCallback(
    (score: number | LoveSubtype) => {
      if (isAdvancing || !question) return;

      setIsAdvancing(true);
      setSelectedScore(score);

      // Save the answer immediately using the score value directly (no stale closure)
      setAssessmentAnswer({ [question.id]: score } as Partial<AssessmentAnswers>);

      const isLast = step + 1 >= TOTAL_ASSESSMENT_STEPS;

      setTimeout(async () => {
        if (isLast) {
          setIsSubmitting(true);
          // Processing animation delay
          await new Promise((r) => setTimeout(r, 1300));
          computeAndSaveProfile();
          setPhase('reveal');
          router.push('/reveal');
        } else {
          setAssessmentStep(step + 1);
          // isAdvancing is reset by the useEffect above when step changes
        }
      }, 380);
    },
    [
      isAdvancing,
      question,
      step,
      setAssessmentAnswer,
      setAssessmentStep,
      computeAndSaveProfile,
      setPhase,
      router,
    ]
  );

  const handleBack = () => {
    if (isAdvancing) return;
    if (step === 0) {
      router.push('/onboarding');
    } else {
      setAssessmentStep(step - 1);
    }
  };

  if (!mounted || !question) return null;

  // Processing overlay
  if (isSubmitting) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 gap-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-pp-accent/25 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">💑</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl text-white">Building your profile…</h2>
          <p className="text-sm text-pp-text-muted">
            Scoring 6 dimensions and matching your archetype
          </p>
        </div>
      </main>
    );
  }

  const sectionLabel = getSectionLabel(step);
  const remaining = TOTAL_ASSESSMENT_STEPS - step - 1;

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pp-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-pp-secondary/12 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-dvh max-w-lg mx-auto w-full px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-12 pb-6">
          <button
            onClick={handleBack}
            disabled={isAdvancing}
            className="flex items-center gap-1.5 text-pp-text-muted hover:text-white transition-colors text-sm focus:outline-none disabled:opacity-40"
          >
            ← Back
          </button>

          <span className="text-xs text-pp-text-muted border border-white/10 px-2.5 py-1 rounded-full">
            {sectionLabel}
          </span>

          <div className="w-12" />
        </header>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            current={step + 1}
            total={TOTAL_ASSESSMENT_STEPS}
            label="Assessment"
            showSteps
            color="#F6B17A"
          />
        </div>

        {/* Question — fades between steps */}
        <div className="flex-1">
          <FadeTransition transitionKey={step}>
            <ScenarioQuestion
              question={question}
              selectedScore={selectedScore}
              onSelect={handleSelect}
              questionNumber={step + 1}
              totalQuestions={TOTAL_ASSESSMENT_STEPS}
              isAdvancing={isAdvancing}
            />
          </FadeTransition>
        </div>

        {/* Footer */}
        <div className="py-6 flex items-center justify-center">
          <p className="text-xs text-pp-text-muted/55">
            {remaining > 0
              ? `${remaining} question${remaining === 1 ? '' : 's'} remaining · tap to select`
              : 'Last question · tap to see your results'}
          </p>
        </div>
      </div>
    </main>
  );
}
