'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchCoupleProfiles } from '@/lib/couples';
import { computeCompatibility } from '@/lib/compatibility';
import { CoupleCompatibility, UserProfile } from '@/types';
import CompatibilityScore from '@/components/couple/CompatibilityScore';
import DimensionComparison from '@/components/couple/DimensionComparison';
import ArchetypePairing from '@/components/couple/ArchetypePairing';

type LoadState = 'loading' | 'waiting' | 'ready' | 'error';

export default function CouplePage() {
  const params = useParams();
  const router = useRouter();

  const coupleId = typeof params.coupleId === 'string' ? params.coupleId : '';
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [partner1, setPartner1] = useState<UserProfile | null>(null);
  const [partner2, setPartner2] = useState<UserProfile | null>(null);
  const [partner1Name, setPartner1Name] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<CoupleCompatibility | null>(null);
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    if (!coupleId) {
      setLoadState('error');
      return;
    }
    setInviteUrl(`${window.location.origin}/invite/${coupleId}`);

    fetchCoupleProfiles(coupleId).then(({ partner1: p1, partner2: p2, partner1Name: name }) => {
      if (!p1 && !name) {
        setLoadState('error');
        return;
      }

      setPartner1(p1);
      setPartner2(p2);
      setPartner1Name(name);

      if (p1 && p2) {
        setCompatibility(computeCompatibility(p1, p2));
        setLoadState('ready');
      } else {
        setLoadState('waiting');
      }
    });
  }, [coupleId]);

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-pp-bg-dark">
        <div className="w-10 h-10 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </main>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (loadState === 'error') {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 text-center gap-6">
        <div className="text-4xl">💔</div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl text-white">Couple not found</h1>
          <p className="text-sm text-pp-text-muted">This link may be invalid or expired.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-2xl bg-pp-primary border border-pp-secondary/40 text-white text-sm font-medium hover:bg-pp-primary/80 transition-colors"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  // ── Waiting for Partner 2 ─────────────────────────────────────────────────────
  if (loadState === 'waiting') {
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(inviteUrl);
      } catch {
        // fallback — silent
      }
    };

    return (
      <main className="relative min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark overflow-hidden px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pp-accent/8 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-sm w-full flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-pp-card border border-pp-secondary/30 flex items-center justify-center">
              <span className="text-2xl">{partner1?.archetypeResult.primary.emoji ?? '?'}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-1">
              <div className="w-4 h-px bg-pp-accent/50" />
              <span className="text-pp-accent text-xs">+</span>
              <div className="w-4 h-px bg-pp-accent/50" />
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 bg-white/4 flex items-center justify-center">
              <span className="text-2xl opacity-40">?</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl text-white">Waiting for your partner…</h1>
            <p className="text-sm text-pp-text-muted leading-relaxed">
              Your results are ready. Share the link below so{' '}
              {partner2 === null
                ? 'your partner'
                : 'they'}{' '}
              can complete the quiz and unlock your Couple Chemistry Report.
            </p>
          </div>

          {/* Invite link */}
          <div className="w-full space-y-3">
            <div className="px-4 py-3 rounded-xl bg-pp-primary/60 border border-pp-secondary/30 text-left break-all">
              <p className="text-xs text-pp-text-muted mb-1 uppercase tracking-widest">Your invite link</p>
              <p className="text-sm text-white/80 font-mono">{inviteUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-2xl border border-pp-secondary/40 text-pp-secondary text-sm font-medium
                hover:border-pp-secondary/70 hover:text-white transition-colors active:scale-[0.98]"
            >
              📋 Copy invite link
            </button>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-pp-text-muted hover:text-white transition-colors"
          >
            ← Back to my profile
          </button>
        </div>
      </main>
    );
  }

  // ── Ready — full compatibility view ──────────────────────────────────────────
  if (!compatibility || !partner1 || !partner2) return null;

  const p1Name = partner1Name ?? partner1.introContext.name ?? 'Partner 1';
  const p2Name = partner2.introContext.name ?? 'Partner 2';

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pp-secondary/12 blur-3xl" />
      </div>

      {/* Sticky back header */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center
              justify-center text-pp-text-muted hover:text-white transition-colors"
          >
            ←
          </button>
          <span className="text-lg">💑</span>
          <span className="font-display text-base text-white font-semibold">Couple Chemistry</span>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto w-full px-6 pb-16">
        {/* Header */}
        <div className="pt-8 pb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-pp-accent/40" />
            <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
              Couple Chemistry
            </span>
            <div className="h-px w-8 bg-pp-accent/40" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white">
            Your Couple Chemistry
          </h1>
          <p className="text-sm text-pp-text-muted">
            {p1Name} &amp; {p2Name}
          </p>
        </div>

        {/* Compatibility score ring */}
        <div className="flex justify-center mb-10">
          <CompatibilityScore score={compatibility.overallScore} />
        </div>

        {/* Archetype pairing */}
        <section className="mb-8">
          <h2 className="text-xs font-medium tracking-widest text-pp-text-muted uppercase mb-4">
            Your Archetypes
          </h2>
          <ArchetypePairing
            p1Archetype={partner1.archetypeResult.primary}
            p2Archetype={partner2.archetypeResult.primary}
            p1Name={p1Name}
            p2Name={p2Name}
          />

          {/* Archetype pairing note */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-pp-primary/50 border border-pp-secondary/25">
            <p className="text-sm text-white/70 leading-relaxed italic">
              {compatibility.archetypePairingNote}
            </p>
          </div>
        </section>

        {/* Dimension comparison */}
        <section className="mb-8 p-5 rounded-2xl bg-pp-card border border-pp-secondary/20">
          <h2 className="text-xs font-medium tracking-widest text-pp-text-muted uppercase mb-5">
            6 Dimension Comparison
          </h2>
          <DimensionComparison
            dimensions={compatibility.dimensions}
            p1Name={p1Name}
            p2Name={p2Name}
          />
        </section>

        {/* Love style match */}
        <section className="mb-8 p-5 rounded-2xl bg-pp-card border border-pp-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💗</span>
            <h2 className="text-xs font-medium tracking-widest text-pp-text-muted uppercase">
              Love Style Match
            </h2>
            {compatibility.loveStyleMatch && (
              <span className="ml-auto text-xs text-emerald-400 font-medium">✓ Match</span>
            )}
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{compatibility.loveStyleNote}</p>
        </section>

        {/* Strengths together */}
        <section className="mb-8 p-5 rounded-2xl bg-pp-card border border-pp-secondary/20">
          <h2 className="text-xs font-medium tracking-widest text-pp-text-muted uppercase mb-4">
            Strengths Together
          </h2>
          <ul className="space-y-2">
            {compatibility.strengthsTogether.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="text-pp-accent mt-0.5">✦</span>
                <span className="text-sm text-white/80">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Growth together */}
        <section className="mb-10 p-5 rounded-2xl bg-pp-card border border-pp-secondary/20">
          <h2 className="text-xs font-medium tracking-widest text-pp-text-muted uppercase mb-4">
            Growth Together
          </h2>
          <ul className="space-y-2">
            {compatibility.growthTogether.map((g) => (
              <li key={g} className="flex items-start gap-2.5">
                <span className="text-pp-secondary mt-0.5">→</span>
                <span className="text-sm text-white/80">{g}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* View my profile CTA */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
            hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98] shadow-card"
        >
          View My Profile →
        </button>
      </div>
    </main>
  );
}
