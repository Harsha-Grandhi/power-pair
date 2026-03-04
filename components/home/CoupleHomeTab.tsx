'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, CoupleCompatibility } from '@/types';
import { fetchCoupleProfiles } from '@/lib/couples';
import { computeCompatibility } from '@/lib/compatibility';
import CompatibilityScore from '@/components/couple/CompatibilityScore';
import DimensionComparison from '@/components/couple/DimensionComparison';
import ArchetypePairing from '@/components/couple/ArchetypePairing';
import LockedReport from '@/components/dashboard/LockedReport';

interface CoupleHomeTabProps {
  coupleId: string;
  currentProfile: UserProfile;
  archetypeName: string;
}

type FetchState = 'loading' | 'waiting' | 'ready';

export default function CoupleHomeTab({ coupleId, currentProfile, archetypeName }: CoupleHomeTabProps) {
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [partner1, setPartner1] = useState<UserProfile | null>(null);
  const [partner2, setPartner2] = useState<UserProfile | null>(null);
  const [partner1Name, setPartner1Name] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<CoupleCompatibility | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchCoupleProfiles(coupleId).then(({ partner1: p1, partner2: p2, partner1Name: name }) => {
      setPartner1(p1);
      setPartner2(p2);
      setPartner1Name(name);

      if (p1 && p2) {
        setCompatibility(computeCompatibility(p1, p2));
        setFetchState('ready');
      } else {
        setFetchState('waiting');
      }
    });
  }, [coupleId]);

  if (fetchState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Waiting: partner hasn't completed yet ────────────────────────────────────
  if (fetchState === 'waiting') {
    return (
      <div className="px-5 py-6">
        {/* Static banner — no results yet */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🔒</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">
                Couple Chemistry
              </span>
            </div>
            <p className="text-sm text-white/80 font-medium leading-tight">Waiting for your partner…</p>
            <p className="text-xs text-pp-text-muted mt-0.5">Results unlock once they complete the quiz</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-pp-accent/40 animate-pulse flex-shrink-0" />
        </div>

        <div className="mt-4">
          <LockedReport archetypeName={archetypeName} />
        </div>
      </div>
    );
  }

  if (!compatibility || !partner1 || !partner2) return null;

  const p1Name = partner1Name ?? partner1.introContext.name ?? 'Partner 1';
  const p2Name = partner2.introContext.name ?? 'Partner 2';
  const score = compatibility.overallScore;

  // Score colour
  const scoreColor = score >= 80 ? '#34d399' : score >= 60 ? '#F6B17A' : '#7077A1';

  return (
    <div className="px-5 pb-6 space-y-3">
      {/* ── Clickable banner ───────────────────────────────────────────── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left rounded-2xl border border-pp-accent/30 bg-gradient-to-r
          from-pp-accent/8 to-pp-secondary/8 p-4 flex items-center gap-4
          hover:border-pp-accent/50 transition-all duration-200 active:scale-[0.99]"
      >
        {/* Archetype avatars */}
        <div className="flex items-center -space-x-2 flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg z-10"
            style={{ borderColor: `${partner1.archetypeResult.primary.color}60`, background: `${partner1.archetypeResult.primary.gradientFrom}20` }}
          >
            {partner1.archetypeResult.primary.emoji}
          </div>
          <div
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg"
            style={{ borderColor: `${partner2.archetypeResult.primary.color}60`, background: `${partner2.archetypeResult.primary.gradientFrom}20` }}
          >
            {partner2.archetypeResult.primary.emoji}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">
              Couple Chemistry
            </span>
          </div>
          <p className="text-sm text-white/85 font-medium leading-tight truncate">
            {p1Name} &amp; {p2Name}
          </p>
        </div>

        {/* Score badge + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-base font-bold font-display"
            style={{ color: scoreColor }}
          >
            {score}%
          </span>
          <svg
            className="w-4 h-4 text-pp-text-muted transition-transform duration-300"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── Expanded results ───────────────────────────────────────────── */}
      {expanded && (
        <div className="space-y-4 pt-1">
          {/* Score ring */}
          <div className="flex justify-center">
            <CompatibilityScore score={compatibility.overallScore} />
          </div>

          {/* Archetype pairing */}
          <section className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Archetypes</p>
            <ArchetypePairing
              p1Archetype={partner1.archetypeResult.primary}
              p2Archetype={partner2.archetypeResult.primary}
              p1Name={p1Name}
              p2Name={p2Name}
            />
            <div className="px-3 py-3 rounded-xl bg-pp-primary/50 border border-pp-secondary/20">
              <p className="text-sm text-white/65 leading-relaxed italic">
                {compatibility.archetypePairingNote}
              </p>
            </div>
          </section>

          {/* Dimension comparison */}
          <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-4">
              6 Dimension Comparison
            </p>
            <DimensionComparison
              dimensions={compatibility.dimensions}
              p1Name={p1Name}
              p2Name={p2Name}
            />
          </section>

          {/* Love style match */}
          <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">💗</span>
              <p className="text-xs text-pp-text-muted uppercase tracking-widest">Love Style Match</p>
              {compatibility.loveStyleMatch && (
                <span className="ml-auto text-xs text-emerald-400 font-medium">✓ Match</span>
              )}
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{compatibility.loveStyleNote}</p>
          </section>

          {/* Strengths together */}
          <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-3">
              Strengths Together
            </p>
            <ul className="space-y-2">
              {compatibility.strengthsTogether.map((s) => (
                <li key={s} className="flex items-start gap-2.5">
                  <span className="text-pp-accent mt-0.5 text-xs">✦</span>
                  <span className="text-sm text-white/80">{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Growth together */}
          <section className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-3">
              Growth Together
            </p>
            <ul className="space-y-2">
              {compatibility.growthTogether.map((g) => (
                <li key={g} className="flex items-start gap-2.5">
                  <span className="text-pp-secondary mt-0.5 text-xs">→</span>
                  <span className="text-sm text-white/80">{g}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
