'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import ArchetypeCard from '@/components/dashboard/ArchetypeCard';
import DimensionCard from '@/components/dashboard/DimensionCard';
import LoveStyleBreakdown from '@/components/dashboard/LoveStyleBreakdown';
import LockedReport from '@/components/dashboard/LockedReport';
import RadarChart, { RadarDataPoint } from '@/components/charts/RadarChart';

export default function DashboardPage() {
  const router = useRouter();
  const { state, resetApp } = useApp();
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !state.profile) {
      router.replace('/');
    }
  }, [mounted, state.profile, router]);

  if (!mounted || !state.profile) return null;

  const { archetypeResult, dimensionScores, loveStyle, introContext, createdAt } =
    state.profile;
  const { primary } = archetypeResult;

  const radarData: RadarDataPoint[] = dimensionScores.map((d) => ({
    label: d.name,
    value: d.score,
    icon: d.icon,
  }));

  const completedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleReset = () => {
    resetApp();
    router.replace('/');
  };

  return (
    <main className="relative min-h-dvh bg-pp-bg-dark overflow-x-hidden">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: primary.color }}
        />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-pp-secondary/10 blur-3xl" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pp-accent/15 border border-pp-accent/30 flex items-center justify-center">
              <span className="text-xs">💑</span>
            </div>
            <span className="font-display text-base text-white font-semibold">
              Power Pair
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-full border font-medium"
              style={{ color: primary.color, borderColor: `${primary.color}40` }}
            >
              {primary.emoji} {primary.name}
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="relative z-10 max-w-lg mx-auto px-6 pb-20">
        {/* Profile header */}
        <section className="pt-8 pb-6 space-y-1 animate-fade-in">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">
            Your Profile · {completedDate}
          </p>
          <h1 className="font-display text-3xl text-white">
            Relationship Intelligence Report
          </h1>
          {introContext.relationshipStage && (
            <p className="text-sm text-pp-text-muted">
              {introContext.relationshipStage}
              {introContext.gender ? ` · ${introContext.gender}` : ''}
            </p>
          )}
        </section>

        {/* ── Section 1: Archetype card ── */}
        <section className="mb-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <ArchetypeCard result={archetypeResult} />
        </section>

        {/* ── Section 2: Radar chart ── */}
        <section
          className="mb-5 rounded-3xl border border-white/8 bg-white/3 p-5 animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Emotional Map</h2>
              <p className="text-xs text-pp-text-muted mt-0.5">
                6-dimension profile overview
              </p>
            </div>
            <span className="text-xs text-pp-text-muted border border-white/10 px-2 py-1 rounded-full">
              0 – 100
            </span>
          </div>
          <div className="flex justify-center">
            <RadarChart data={radarData} size={260} />
          </div>
        </section>

        {/* ── Section 3: Dimension cards ── */}
        <section className="mb-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">6 Dimensions</h2>
            <span className="text-xs text-pp-text-muted">Tap to expand</span>
          </div>
          <div className="space-y-2">
            {dimensionScores.map((dim, i) => (
              <DimensionCard key={dim.id} dimension={dim} index={i} />
            ))}
          </div>
        </section>

        {/* ── Section 4: Love style ── */}
        <section className="mb-5 animate-slide-up" style={{ animationDelay: '240ms' }}>
          <h2 className="text-sm font-semibold text-white mb-3">Love Style</h2>
          <LoveStyleBreakdown loveStyle={loveStyle} />
        </section>

        {/* ── Section 5: Strengths & Growth ── */}
        <section
          className="mb-5 rounded-3xl border border-white/8 bg-white/3 p-5 animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">
            Strengths &amp; Growth Edge
          </h2>

          <div className="space-y-2 mb-4">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-2">
              Strengths
            </p>
            {primary.strengths.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15"
              >
                <span className="text-emerald-400 text-xs flex-shrink-0">✦</span>
                <span className="text-sm text-white/85">{s}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-2">
              Growth Edge
            </p>
            {primary.growthEdge.map((g) => (
              <div
                key={g}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-pp-accent/8 border border-pp-accent/15"
              >
                <span className="text-pp-accent text-xs flex-shrink-0">◆</span>
                <span className="text-sm text-white/85">{g}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Context snapshot ── */}
        {(introContext.biggestChallenge || introContext.conflictFrequency) && (
          <section
            className="mb-5 rounded-3xl border border-white/8 bg-white/3 p-5 animate-slide-up"
            style={{ animationDelay: '360ms' }}
          >
            <h2 className="text-sm font-semibold text-white mb-4">
              Your Relationship Context
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {introContext.seriousness && (
                <ContextPill label="Commitment" value={introContext.seriousness} />
              )}
              {introContext.conflictFrequency && (
                <ContextPill
                  label="Conflict frequency"
                  value={introContext.conflictFrequency}
                />
              )}
              {introContext.conflictResolution && (
                <ContextPill
                  label="After conflict"
                  value={introContext.conflictResolution}
                  span
                />
              )}
              {introContext.biggestChallenge && (
                <ContextPill
                  label="Biggest challenge"
                  value={introContext.biggestChallenge}
                  span
                />
              )}
            </div>
          </section>
        )}

        {/* ── Section 7: Locked report ── */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '420ms' }}>
          <LockedReport archetypeName={primary.name} />
        </section>

        {/* Reset / Retake */}
        <section className="mb-4 text-center">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-pp-text-muted hover:text-white/60 transition-colors underline underline-offset-2"
            >
              Retake assessment
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/4 border border-white/10">
              <p className="text-sm text-white/80">
                This will clear all your saved results. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="text-xs text-red-400 border border-red-400/30 px-4 py-2 rounded-xl hover:bg-red-400/10 transition-colors"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs text-pp-text-muted border border-white/15 px-4 py-2 rounded-xl hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// Small helper component
function ContextPill({
  label,
  value,
  span = false,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div
      className={`rounded-xl bg-white/4 border border-white/8 p-3 ${
        span ? 'col-span-2' : ''
      }`}
    >
      <p className="text-xs text-pp-text-muted mb-1">{label}</p>
      <p className="text-sm text-white/85 leading-snug">{value}</p>
    </div>
  );
}
