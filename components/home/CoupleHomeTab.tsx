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

  // Partner 2 hasn't completed yet
  if (fetchState === 'waiting') {
    return (
      <div className="px-5 py-6">
        <LockedReport archetypeName={archetypeName} />
      </div>
    );
  }

  if (!compatibility || !partner1 || !partner2) return null;

  const p1Name = partner1Name ?? partner1.introContext.name ?? 'Partner 1';
  const p2Name = partner2.introContext.name ?? 'Partner 2';

  return (
    <div className="px-5 pb-6 space-y-5">
      {/* Section header */}
      <div className="pt-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-pp-accent/40" />
          <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
            Couple Chemistry
          </span>
          <div className="h-px w-8 bg-pp-accent/40" />
        </div>
        <p className="text-sm text-pp-text-muted">{p1Name} &amp; {p2Name}</p>
      </div>

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
  );
}
