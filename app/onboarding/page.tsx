'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { INTRO_QUESTIONS, TOTAL_INTRO_STEPS } from '@/lib/questions';
import ContextQuestion from '@/components/onboarding/ContextQuestion';
import ProgressBar from '@/components/ui/ProgressBar';
import FadeTransition from '@/components/ui/FadeTransition';

// Step layout:
// 0         → Name input
// 1 – 7     → INTRO_QUESTIONS[0..6]  (auto-advance on tap)
// 8         → Phone number
// 9         → Email  →  assessment

const NAME_STEP  = 0;
const PHONE_STEP = 1 + TOTAL_INTRO_STEPS;      // 8
const EMAIL_STEP = 1 + TOTAL_INTRO_STEPS + 1;  // 9
const TOTAL_ONBOARDING_STEPS = 1 + TOTAL_INTRO_STEPS + 2; // 10

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(v: string): boolean {
  return v.replace(/\D/g, '').length >= 10;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { state, setIntroAnswer, setPhase, setIntroStep } = useApp();

  const [mounted, setMounted]       = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  // Text input local state
  const [nameValue,  setNameValue]  = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');

  const step = state.currentIntroStep;

  useEffect(() => { setMounted(true); }, []);

  // Sync local state when navigating between steps
  useEffect(() => {
    setIsAdvancing(false);
    if (step === NAME_STEP) {
      setNameValue(state.introContext.name ?? '');
    } else if (step >= 1 && step <= TOTAL_INTRO_STEPS) {
      const q = INTRO_QUESTIONS[step - 1];
      if (q) {
        const existing = state.introContext[q.questionKey];
        setSelectedValue(existing as string | undefined);
      }
    } else if (step === PHONE_STEP) {
      setPhoneValue(state.introContext.phoneNumber ?? '');
    } else if (step === EMAIL_STEP) {
      setEmailValue(state.introContext.email ?? '');
      setEmailError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleBack = () => {
    if (step === 0) router.push('/');
    else setIntroStep(step - 1);
  };

  /* ── Name step ── */
  const handleNameContinue = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) return;
    setIntroAnswer({ name: trimmed });
    setIntroStep(1);
  };
  const handleNameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameContinue();
  };

  /* ── Option questions (auto-advance) ── */
  const handleOptionSelect = useCallback(
    (value: string) => {
      if (isAdvancing) return;
      setIsAdvancing(true);
      setSelectedValue(value);

      const q = INTRO_QUESTIONS[step - 1];
      setIntroAnswer({ [q.questionKey]: value });

      setTimeout(() => {
        setIntroStep(step + 1); // next question or phone step
      }, 340);
    },
    [isAdvancing, step, setIntroAnswer, setIntroStep]
  );

  /* ── Phone step ── */
  const handlePhoneContinue = () => {
    if (!isValidPhone(phoneValue)) return;
    setIntroAnswer({ phoneNumber: phoneValue.trim() });
    setIntroStep(EMAIL_STEP);
  };
  const handlePhoneKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePhoneContinue();
  };

  /* ── Email step ── */
  const handleEmailContinue = () => {
    const trimmed = emailValue.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setIntroAnswer({ email: trimmed });
    setPhase('assessment');
    router.push('/assessment');
  };
  const handleEmailKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEmailContinue();
  };

  if (!mounted) return null;

  const isNameStep     = step === NAME_STEP;
  const isQuestionStep = step >= 1 && step <= TOTAL_INTRO_STEPS;
  const isPhoneStep    = step === PHONE_STEP;
  const isEmailStep    = step === EMAIL_STEP;
  const currentQ       = isQuestionStep ? INTRO_QUESTIONS[step - 1] : null;

  const stepLabel =
    isNameStep  ? `Step 1 of ${TOTAL_ONBOARDING_STEPS} · Welcome` :
    isPhoneStep ? `Step ${step + 1} of ${TOTAL_ONBOARDING_STEPS} · Contact` :
    isEmailStep ? `Step ${step + 1} of ${TOTAL_ONBOARDING_STEPS} · Contact` :
                  `Step ${step + 1} of ${TOTAL_ONBOARDING_STEPS} · About you`;

  const firstName = state.introContext.name?.split(' ')[0] ?? '';

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-pp-primary/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 rounded-full bg-pp-secondary/15 blur-3xl" />
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
          <span className="font-display text-base text-white/50">Power Pair</span>
          <div className="w-12" />
        </header>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            current={step + 1}
            total={TOTAL_ONBOARDING_STEPS}
            label={
              isQuestionStep ? 'About you' :
              (isPhoneStep || isEmailStep) ? 'Almost done' : 'Welcome'
            }
            showSteps
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <FadeTransition transitionKey={step}>

            {/* ── Step 0: Name ── */}
            {isNameStep && (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tracking-widest text-pp-accent uppercase">
                    {stepLabel}
                  </span>
                  <div className="h-px flex-1 bg-pp-secondary/20" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
                    What&apos;s your name?
                  </h2>
                  <p className="text-sm text-pp-text-muted leading-relaxed">
                    We&apos;ll personalise your results with your name.
                  </p>
                </div>

                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={handleNameKey}
                  placeholder="Your first name"
                  autoFocus
                  autoComplete="given-name"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/12 text-white
                    placeholder:text-pp-text-muted/45 text-base
                    focus:outline-none focus:border-pp-accent/60 focus:bg-white/7
                    transition-all duration-200"
                />

                <button
                  onClick={handleNameContinue}
                  disabled={nameValue.trim().length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
                    hover:bg-pp-accent/90 active:scale-[0.98] transition-all duration-200
                    disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
                    focus:outline-none"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── Steps 1–7: Intro questions (auto-advance) ── */}
            {isQuestionStep && currentQ && (
              <ContextQuestion
                key={currentQ.questionKey}
                question={currentQ}
                selectedValue={selectedValue}
                onSelect={handleOptionSelect}
                stepLabel={stepLabel}
                isAdvancing={isAdvancing}
                firstName={firstName}
              />
            )}

            {/* ── Step 8: Phone ── */}
            {isPhoneStep && (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tracking-widest text-pp-accent uppercase">
                    {stepLabel}
                  </span>
                  <div className="h-px flex-1 bg-pp-secondary/20" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
                    {firstName ? `One last thing, ${firstName}.` : 'Almost there.'}
                    <br />
                    <span className="text-pp-text-muted font-normal">What&apos;s your phone number?</span>
                  </h2>
                  <p className="text-sm text-pp-text-muted leading-relaxed">
                    We&apos;ll use this to sync your results with your partner.
                  </p>
                </div>

                <input
                  type="tel"
                  inputMode="tel"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  onKeyDown={handlePhoneKey}
                  placeholder="+1 (555) 000-0000"
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/12 text-white
                    placeholder:text-pp-text-muted/45 text-base
                    focus:outline-none focus:border-pp-accent/60 focus:bg-white/7
                    transition-all duration-200"
                />

                <button
                  onClick={handlePhoneContinue}
                  disabled={!isValidPhone(phoneValue)}
                  className="w-full py-4 px-6 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
                    hover:bg-pp-accent/90 active:scale-[0.98] transition-all duration-200
                    disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
                    focus:outline-none"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── Step 9: Email ── */}
            {isEmailStep && (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tracking-widest text-pp-accent uppercase">
                    {stepLabel}
                  </span>
                  <div className="h-px flex-1 bg-pp-secondary/20" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
                    {firstName ? `And your email, ${firstName}?` : 'What\'s your email?'}
                  </h2>
                  <p className="text-sm text-pp-text-muted leading-relaxed">
                    Your profile and results will be saved here.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <input
                    type="email"
                    inputMode="email"
                    value={emailValue}
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onKeyDown={handleEmailKey}
                    placeholder="you@example.com"
                    autoFocus
                    className={[
                      'w-full px-5 py-4 rounded-2xl bg-white/5 border text-white',
                      'placeholder:text-pp-text-muted/45 text-base',
                      'focus:outline-none focus:bg-white/7 transition-all duration-200',
                      emailError
                        ? 'border-red-400/60 focus:border-red-400/80'
                        : 'border-white/12 focus:border-pp-accent/60',
                    ].join(' ')}
                  />
                  {emailError && (
                    <p className="text-xs text-red-400 px-1 animate-fade-in">{emailError}</p>
                  )}
                </div>

                <button
                  onClick={handleEmailContinue}
                  disabled={emailValue.trim().length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
                    hover:bg-pp-accent/90 active:scale-[0.98] transition-all duration-200
                    disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
                    focus:outline-none"
                >
                  Start the Quiz →
                </button>
              </div>
            )}

          </FadeTransition>
        </div>

        {/* Footer hint for auto-advance steps only */}
        {isQuestionStep && (
          <div className="py-6 text-center">
            <p className="text-xs text-pp-text-muted/55">
              Tap any option — questions advance automatically
            </p>
          </div>
        )}

        {!isQuestionStep && <div className="h-6" />}
      </div>
    </main>
  );
}
