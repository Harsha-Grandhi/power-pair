'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { fetchCoupleProfiles } from '@/lib/couples';

type LoadState = 'loading' | 'found' | 'not_found';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { setCoupleId, setIsInvited } = useApp();

  const coupleId = typeof params.coupleId === 'string' ? params.coupleId : '';
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [partnerName, setPartnerName] = useState<string | null>(null);

  useEffect(() => {
    if (!coupleId) {
      setLoadState('not_found');
      return;
    }

    fetchCoupleProfiles(coupleId).then(({ partner1Name, partner1 }) => {
      if (!partner1 && !partner1Name) {
        setLoadState('not_found');
      } else {
        setPartnerName(partner1Name ?? partner1?.introContext.name ?? null);
        setCoupleId(coupleId);
        setIsInvited(true);
        setLoadState('found');
      }
    });
  }, [coupleId, setCoupleId]);

  const handleStart = () => {
    router.push('/onboarding');
  };

  // Loading
  if (loadState === 'loading') {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-pp-bg-dark px-6">
        <div className="w-10 h-10 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </main>
    );
  }

  // Not found
  if (loadState === 'not_found') {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 text-center gap-6">
        <div className="text-4xl">🔍</div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl text-white">Invite link not found</h1>
          <p className="text-sm text-pp-text-muted max-w-xs">
            This invite link may be invalid or expired. Ask your partner to share a new one.
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-2xl bg-pp-primary border border-pp-secondary/40 text-white text-sm font-medium
            hover:bg-pp-primary/80 transition-colors"
        >
          Go to Power Pair →
        </button>
      </main>
    );
  }

  // Found
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark overflow-hidden px-6">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pp-secondary/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center gap-8 text-center">
        {/* Logo / icon */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-pp-primary border border-pp-secondary/40 flex items-center justify-center shadow-card">
            <span className="text-3xl">💑</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          {partnerName ? (
            <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">
              <span className="text-pp-accent">{partnerName}</span> has invited you
              <br />
              to discover your couple chemistry
            </h1>
          ) : (
            <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">
              Your partner has invited you to discover your couple chemistry
            </h1>
          )}
          <p className="text-sm text-pp-text-muted leading-relaxed">
            Take the 10-minute Power Pair quiz. When you're both done, you'll unlock your
            personalised Couple Chemistry Report.
          </p>
        </div>

        {/* What you'll discover */}
        <div className="w-full p-5 rounded-2xl bg-white/4 border border-white/10 text-left space-y-3">
          <p className="text-xs font-medium text-pp-text-muted uppercase tracking-widest">
            Together you'll unlock
          </p>
          {[
            { icon: '🔗', text: 'Compatibility score across 6 dimensions' },
            { icon: '💬', text: 'Love style match and blindspots' },
            { icon: '📈', text: 'Strengths and growth areas as a couple' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="text-sm text-white/80">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-8 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
            hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98] shadow-card"
        >
          Take the Quiz →
        </button>

        <p className="text-xs text-pp-text-muted">Takes about 10 minutes · Free</p>
      </div>
    </main>
  );
}
