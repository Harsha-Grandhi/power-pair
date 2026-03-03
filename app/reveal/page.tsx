'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { TOTAL_REVEAL_STEPS } from '@/lib/questions';
import ArchetypeReveal from '@/components/reveal/ArchetypeReveal';
import RadarChartReveal from '@/components/reveal/RadarChartReveal';
import StrengthsReveal from '@/components/reveal/StrengthsReveal';
import PartnerCTA from '@/components/reveal/PartnerCTA';
import FadeTransition from '@/components/ui/FadeTransition';

export default function RevealPage() {
  const router = useRouter();
  const { state, advanceRevealStep, setPhase } = useApp();
  const [mounted, setMounted] = useState(false);

  const step = state.currentRevealStep;
  const profile = state.profile;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard — must have profile
  useEffect(() => {
    if (mounted && !profile) {
      router.replace('/');
    }
  }, [mounted, profile, router]);

  const handleContinue = () => {
    if (step + 1 >= TOTAL_REVEAL_STEPS) {
      setPhase('dashboard');
      router.push('/dashboard');
    } else {
      advanceRevealStep();
    }
  };

  const handleViewDashboard = () => {
    setPhase('dashboard');
    router.push('/dashboard');
  };

  if (!mounted || !profile) return null;

  const { archetypeResult, dimensionScores, loveStyle } = profile;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ArchetypeReveal result={archetypeResult} onContinue={handleContinue} />
        );
      case 1:
        return (
          <RadarChartReveal
            dimensionScores={dimensionScores}
            onContinue={handleContinue}
          />
        );
      case 2:
        return (
          <StrengthsReveal
            archetype={archetypeResult.primary}
            loveStyle={loveStyle}
            onContinue={handleContinue}
          />
        );
      case 3:
        return (
          <PartnerCTA
            archetype={archetypeResult.primary}
            onViewDashboard={handleViewDashboard}
            coupleId={state.coupleId}
            isInvited={state.isInvited}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: archetypeResult.primary.color }}
        />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pp-secondary/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full px-6">
        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 pt-10 pb-8">
          {Array.from({ length: TOTAL_REVEAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-6 h-1.5 bg-pp-accent'
                  : i < step
                  ? 'w-1.5 h-1.5 bg-pp-accent/40'
                  : 'w-1.5 h-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="pb-12">
          <FadeTransition transitionKey={step}>{renderStep()}</FadeTransition>
        </div>
      </div>
    </main>
  );
}
