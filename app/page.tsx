'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { state, setPhase } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if user already has a profile
  useEffect(() => {
    if (mounted && state.profile) {
      router.replace('/dashboard');
    }
  }, [mounted, state.profile, router]);

  const handleStart = () => {
    setPhase('onboarding');
    router.push('/onboarding');
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden bg-pp-bg-dark">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right gradient orb */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pp-primary/40 blur-3xl" />
        {/* Bottom-left gradient orb */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-pp-secondary/20 blur-3xl" />
        {/* Center accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-pp-accent/6 blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh max-w-lg mx-auto w-full px-6">
        {/* Top nav */}
        <header className="flex items-center justify-between pt-12 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pp-accent/15 border border-pp-accent/30 flex items-center justify-center">
              <span className="text-sm">💑</span>
            </div>
            <span className="font-display text-lg text-white font-semibold tracking-tight">
              Power Pair
            </span>
          </div>
          <span className="text-xs text-pp-text-muted border border-white/10 px-2.5 py-1 rounded-full">
            v1.0
          </span>
        </header>

        {/* Hero section */}
        <section className="flex-1 flex flex-col justify-center py-12 gap-8">
          {/* Badge */}
          <div
            className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full border border-pp-accent/30 bg-pp-accent/8 animate-fade-in"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pp-accent animate-pulse-soft" />
            <span className="text-xs font-medium text-pp-accent tracking-wide">
              Relationship Intelligence Platform
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h1 className="font-display text-5xl md:text-6xl text-white leading-[1.08] tracking-tight">
              Understand
              <br />
              <span className="text-gradient-primary">how you love.</span>
            </h1>
            <p className="text-base md:text-lg text-pp-text-muted leading-relaxed max-w-sm">
              A psychologically structured assessment that reveals your personality type
              across 4 relationship dimensions — in under 10 minutes.
            </p>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-6 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            {[
              { value: '20', label: 'Questions' },
              { value: '4', label: 'Dimensions' },
              { value: '16', label: 'Archetypes' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white font-display">{value}</p>
                <p className="text-xs text-pp-text-muted mt-0.5">{label}</p>
              </div>
            ))}
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xs text-pp-text-muted leading-snug max-w-[120px]">
                Built on psychometric research
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              onClick={handleStart}
              className="w-full py-4 px-6 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
                hover:bg-pp-accent/90 active:scale-[0.98] transition-all duration-200 shadow-glow-accent
                focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60"
            >
              Begin Quiz →
            </button>
            <p className="text-center text-xs text-pp-text-muted">
              Free · 8–10 minutes · Results saved privately
            </p>
          </div>
        </section>

        {/* Archetype preview strip */}
        <section
          className="pb-10 animate-fade-in"
          style={{ animationDelay: '450ms' }}
        >
          <p className="text-xs text-pp-text-muted mb-3 text-center uppercase tracking-widest">
            16 personality types
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { emoji: '❤️', name: 'Passionate Heart', color: '#E05C5C' },
              { emoji: '🌹', name: 'Romantic Adventurer', color: '#E8845A' },
              { emoji: '📋', name: 'Devoted Planner', color: '#5B8FD4' },
              { emoji: '🎉', name: 'Playful Partner', color: '#E88FCF' },
              { emoji: '✨', name: 'Emotional Idealist', color: '#9B72CF' },
              { emoji: '🌙', name: 'Dreamy Romantic', color: '#8B6FC0' },
              { emoji: '🤲', name: 'Gentle Supporter', color: '#4CAF9A' },
              { emoji: '☀️', name: 'Cheerful Companion', color: '#F6B17A' },
              { emoji: '🌿', name: 'Emotional Sage', color: '#4CAF9A' },
              { emoji: '🎯', name: 'Quiet Strategist', color: '#5B8FD4' },
              { emoji: '⚓', name: 'Loyal Anchor', color: '#7B8FA6' },
              { emoji: '🧭', name: 'Independent Explorer', color: '#E8845A' },
              { emoji: '🕯️', name: 'Quiet Romantic', color: '#C47A5A' },
              { emoji: '💭', name: 'Thoughtful Dreamer', color: '#8B6FC0' },
              { emoji: '🛡️', name: 'Steady Supporter', color: '#4A8B7F' },
              { emoji: '🍃', name: 'Easygoing Observer', color: '#7077A1' },
            ].map(({ emoji, name, color }) => (
              <div
                key={name}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8"
              >
                <span className="text-xl">{emoji}</span>
                <span
                  className="text-[10px] font-medium whitespace-nowrap"
                  style={{ color }}
                >
                  {name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
