'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { TOTAL_REVEAL_STEPS } from '@/lib/questions';
import { getArchetypeByCode } from '@/lib/archetypes';
import { getScoreLabel, getScoreColor } from '@/lib/scoring';
import FadeTransition from '@/components/ui/FadeTransition';
import { fetchPairingCode } from '@/lib/couples';

export default function RevealPage() {
  const router = useRouter();
  const { state, advanceRevealStep, setPhase } = useApp();
  const [mounted, setMounted] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const step = state.currentRevealStep;
  const profile = state.profile;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !profile) router.replace('/');
  }, [mounted, profile, router]);

  useEffect(() => {
    if (mounted && state.coupleId) {
      setInviteUrl(window.location.origin + '/invite/' + state.coupleId);
      fetchPairingCode(state.coupleId).then(code => setPairingCode(code));
    }
  }, [mounted, state.coupleId]);

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

  const { archetypeResult, dimensionScores } = profile;
  const archetype = archetypeResult.primary;

  const renderStep = () => {
    switch (step) {
      // Screen 1: Archetype Reveal
      case 0:
        return (
          <div className="text-center space-y-6 pt-8">
            <p className="text-sm text-pp-text-muted uppercase tracking-widest">Your Relationship Archetype</p>
            <div className="text-6xl">{archetype.emoji}</div>
            <h1 className="font-display text-3xl sm:text-4xl text-white">{archetype.name}</h1>
            <p className="text-xs text-pp-accent font-mono tracking-wider">{archetypeResult.code}</p>
            <p className="text-base text-white/80 leading-relaxed max-w-sm mx-auto">{archetype.description}</p>
            <button onClick={handleContinue} className="mt-8 w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              See Your Traits &#x2192;
            </button>
          </div>
        );

      // Screen 2: Trait Breakdown
      case 1:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">Your Trait Breakdown</h2>
            <div className="space-y-4">
              {dimensionScores.map((dim) => (
                <div key={dim.id} className="bg-pp-card/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">{dim.name}</span>
                    <span className="text-sm font-semibold" style={{ color: getScoreColor(dim.percentage) }}>
                      {dim.percentage}% {dim.dominantStyle}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: dim.percentage + '%',
                        backgroundColor: getScoreColor(dim.percentage),
                      }}
                    />
                  </div>
                  <p className="text-xs text-pp-text-muted mt-1">{getScoreLabel(dim.percentage)}</p>
                </div>
              ))}
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              What Makes You Unique &#x2192;
            </button>
          </div>
        );

      // Screen 3: What Makes You Unique
      case 2:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">What Makes You Unique</h2>
            <div className="bg-pp-card/60 rounded-xl p-6 border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed italic">
                &quot;{archetype.whatMakesYouUnique}&quot;
              </p>
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              Your Strengths &#x2192;
            </button>
          </div>
        );

      // Screen 4: Relationship Strengths
      case 3:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">Relationship Strengths</h2>
            <div className="space-y-3">
              {archetype.strengths.map((s, i) => (
                <div key={i} className="bg-pp-card/60 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                  <span className="text-pp-accent text-lg shrink-0">&#x2764;&#xFE0F;</span>
                  <p className="text-sm text-white/80">{s}</p>
                </div>
              ))}
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              Growth Areas &#x2192;
            </button>
          </div>
        );

      // Screen 5: Growth Areas
      case 4:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">Growth Areas</h2>
            <p className="text-sm text-pp-text-muted text-center">Every strength has a shadow. Awareness is the first step.</p>
            <div className="space-y-3">
              {archetype.growthAreas.map((g, i) => (
                <div key={i} className="bg-pp-card/60 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                  <span className="text-yellow-400 text-lg shrink-0">&#x26A0;&#xFE0F;</span>
                  <p className="text-sm text-white/80">{g}</p>
                </div>
              ))}
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              What You Need &#x2192;
            </button>
          </div>
        );

      // Screen 6: What You Need in a Partner
      case 5:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">What You Need in a Partner</h2>
            <p className="text-sm text-pp-text-muted text-center">You thrive with partners who:</p>
            <div className="space-y-3">
              {archetype.whatYouNeedInPartner.map((n, i) => (
                <div key={i} className="bg-pp-card/60 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                  <span className="text-pp-accent shrink-0">&#x2022;</span>
                  <p className="text-sm text-white/80">{n}</p>
                </div>
              ))}
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              Compatibility &#x2192;
            </button>
          </div>
        );

      // Screen 7: Compatibility Preview
      case 6: {
        const compatArchetypes = archetype.compatibleWith
          .map(code => getArchetypeByCode(code))
          .filter(Boolean);
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">Most Compatible With</h2>
            <div className="space-y-3">
              {compatArchetypes.map((ca) => ca && (
                <div key={ca.code} className="bg-pp-card/60 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                  <span className="text-2xl">{ca.emoji}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{ca.name}</p>
                    <p className="text-xs text-pp-text-muted">{ca.code}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleContinue} className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors">
              Share & Continue &#x2192;
            </button>
          </div>
        );
      }

      // Screen 8: Share Result / Partner CTA
      case 7:
        return (
          <div className="space-y-6 pt-4">
            <h2 className="font-display text-2xl text-white text-center">Share Your Result</h2>
            {/* Share card */}
            <div
              className="rounded-2xl p-6 text-center space-y-4 border border-white/10"
              style={{
                background: 'linear-gradient(135deg, ' + archetype.gradientFrom + '22, ' + archetype.gradientTo + '22)',
              }}
            >
              <p className="text-xs text-pp-text-muted uppercase tracking-wider">My Relationship Archetype</p>
              <div className="text-4xl">{archetype.emoji}</div>
              <h3 className="font-display text-xl text-white">{archetype.name}</h3>
              <div className="space-y-1">
                {dimensionScores.map(d => (
                  <p key={d.id} className="text-xs text-white/70">
                    {d.dominantStyle} &ndash; {d.percentage}%
                  </p>
                ))}
              </div>
            </div>

            {/* Pairing code + invite link */}
            {!state.isInvited && pairingCode && (
              <div className="rounded-2xl border border-pp-accent/30 bg-pp-accent/5 p-5 space-y-4">
                <p className="text-xs text-pp-text-muted uppercase tracking-widest text-center">Your Pairing Code</p>
                <div className="flex items-center justify-center gap-1">
                  {pairingCode.split('').map((ch, i) => (
                    <span key={i} className="w-10 h-12 rounded-lg bg-pp-card border border-white/15 flex items-center justify-center font-mono text-xl font-bold text-pp-accent">
                      {ch}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-pp-text-muted text-center leading-relaxed">
                  Share this code with your partner. If they already took the quiz, they can enter it to link your results.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = pairingCode;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-pp-accent/40 text-pp-accent text-sm font-medium hover:bg-pp-accent/10 transition-colors"
                  >
                    {codeCopied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={() => {
                      const text = 'Take the Power Pair relationship quiz and enter my code: ' + pairingCode + '\n' + (inviteUrl || window.location.origin);
                      if (navigator.share) {
                        navigator.share({ title: 'Power Pair', text });
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-pp-accent/40 text-pp-accent text-sm font-medium hover:bg-pp-accent/10 transition-colors"
                  >
                    Share Link
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  const text = 'My Relationship Archetype: ' + archetype.emoji + ' ' + archetype.name + ' (' + archetypeResult.code + ')\n\n' +
                    dimensionScores.map(d => d.dominantStyle + ' - ' + d.percentage + '%').join('\n') +
                    '\n\nTake the relationship quiz!';
                  if (navigator.share) {
                    navigator.share({ title: 'My Relationship Archetype', text });
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="w-full py-3.5 rounded-xl border border-pp-accent/40 text-pp-accent font-semibold text-sm hover:bg-pp-accent/10 transition-colors"
              >
                Share Result
              </button>
              <button
                onClick={handleViewDashboard}
                className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm hover:bg-pp-accent/90 transition-colors"
              >
                {state.isInvited ? 'See Compatibility With Your Partner' : 'Go to the App'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="relative min-h-dvh flex flex-col bg-pp-bg-dark overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: archetype.color }}
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
