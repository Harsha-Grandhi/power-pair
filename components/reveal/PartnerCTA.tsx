'use client';

import React, { useEffect, useState } from 'react';
import { Archetype } from '@/types';
import Button from '@/components/ui/Button';
import { shareOrCopy, getInviteMessage, canNativeShare } from '@/lib/share';

interface PartnerCTAProps {
  archetype: Archetype;
  onViewDashboard: () => void;
}

type ShareState = 'idle' | 'loading' | 'shared' | 'copied' | 'failed';

export default function PartnerCTA({ archetype, onViewDashboard }: PartnerCTAProps) {
  const [visible, setVisible] = useState(false);
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [nativeShare, setNativeShare] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    setNativeShare(canNativeShare());
    return () => clearTimeout(t);
  }, []);

  const message = getInviteMessage(archetype.name);

  const handleShare = async () => {
    if (shareState === 'loading') return;
    setShareState('loading');

    const result = await shareOrCopy(message);

    if (result === 'failed') {
      setShareState('failed');
      setTimeout(() => setShareState('idle'), 2500);
    } else {
      setShareState(result); // 'shared' or 'copied'
      setTimeout(() => setShareState('idle'), 2500);
    }
  };

  const shareButtonLabel = () => {
    switch (shareState) {
      case 'loading': return 'Opening…';
      case 'shared':  return '✓ Invite sent!';
      case 'copied':  return '✓ Copied to clipboard';
      case 'failed':  return '✗ Could not copy — try again';
      default:        return nativeShare ? '🔗 Share invite' : '📋 Copy invite message';
    }
  };

  const shareButtonClass = () => {
    if (shareState === 'shared' || shareState === 'copied')
      return 'border-emerald-400/50 text-emerald-400';
    if (shareState === 'failed')
      return 'border-red-400/40 text-red-400';
    return '';
  };

  return (
    <div
      className={`flex flex-col items-center gap-8 text-center transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-pp-accent/40" />
          <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
            Next Step
          </span>
          <div className="h-px w-8 bg-pp-accent/40" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white">
          Invite Your Partner
        </h2>
        <p className="text-sm text-pp-text-muted max-w-xs mx-auto leading-relaxed">
          Self-awareness is powerful. The real magic happens when both of you
          understand each other.
        </p>
      </div>

      {/* Partner illustration */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: archetype.color }}
        />
        <div className="relative flex items-center gap-1">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-card"
            style={{
              background: `radial-gradient(circle, ${archetype.gradientTo}22, ${archetype.gradientFrom}11)`,
              borderColor: `${archetype.color}50`,
            }}
          >
            <span className="text-3xl">{archetype.emoji}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-2">
            <div className="w-5 h-px bg-pp-accent/50" />
            <span className="text-pp-accent text-xs">+</span>
            <div className="w-5 h-px bg-pp-accent/50" />
          </div>
          <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed bg-white/4 border-white/20">
            <span className="text-3xl opacity-50">?</span>
          </div>
        </div>
      </div>

      {/* What unlocks */}
      <div className="w-full p-5 rounded-2xl bg-white/4 border border-white/10 text-left space-y-3">
        <p className="text-xs font-medium text-pp-text-muted uppercase tracking-widest">
          When your partner completes their quiz
        </p>
        {[
          { icon: '🔗', text: 'Your couple compatibility breakdown' },
          { icon: '💬', text: 'Shared emotional patterns + blindspots' },
          { icon: '📈', text: 'Couple Chemistry Report (unlocked)' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-white/80">{text}</span>
          </div>
        ))}
      </div>

      {/* Message preview */}
      <div className="w-full space-y-3">
        <div className="px-4 py-3 rounded-xl bg-pp-primary/60 border border-pp-secondary/30 text-left">
          <p className="text-sm text-white/70 leading-relaxed italic">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        {/* Share / Copy button */}
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleShare}
          isLoading={shareState === 'loading'}
          className={shareButtonClass()}
        >
          {shareState !== 'loading' && shareButtonLabel()}
        </Button>

        {/* WhatsApp quick share */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl
            bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-medium
            hover:bg-[#25D366]/15 transition-colors active:scale-[0.98]"
        >
          <span>📱</span>
          Share via WhatsApp
        </a>
      </div>

      {/* Dashboard CTA */}
      <div className="w-full flex flex-col gap-3">
        <Button variant="accent" size="lg" fullWidth onClick={onViewDashboard}>
          View My Full Profile
          <span className="ml-1">→</span>
        </Button>
        <p className="text-xs text-pp-text-muted">
          Your results are saved and accessible anytime
        </p>
      </div>
    </div>
  );
}
