'use client';

import React, { useState } from 'react';
import { shareOrCopy, getInviteMessage, canNativeShare } from '@/lib/share';
import { useApp } from '@/contexts/AppContext';

interface LockedReportProps {
  archetypeName?: string;
}

type ShareState = 'idle' | 'loading' | 'shared' | 'copied' | 'failed';

export default function LockedReport({ archetypeName = 'Balanced Romantic' }: LockedReportProps) {
  const [open, setOpen] = useState(false);
  const [shareState, setShareState] = useState<ShareState>('idle');
  const { state } = useApp();
  const nativeShare = typeof window !== 'undefined' && canNativeShare();

  const coupleId = state.coupleId;
  const isInvited = state.isInvited;
  const inviteUrl =
    coupleId && typeof window !== 'undefined'
      ? `${window.location.origin}/invite/${coupleId}`
      : undefined;

  const message = getInviteMessage(archetypeName, inviteUrl);

  const handleShare = async () => {
    if (shareState === 'loading') return;
    setShareState('loading');
    const result = await shareOrCopy(message, inviteUrl);
    if (result === 'failed') {
      setShareState('failed');
      setTimeout(() => setShareState('idle'), 2500);
    } else {
      setShareState(result);
      setTimeout(() => setShareState('idle'), 2500);
    }
  };

  const copyLabel = () => {
    switch (shareState) {
      case 'loading': return 'Opening…';
      case 'shared':  return '✓ Invite sent!';
      case 'copied':  return '✓ Copied!';
      case 'failed':  return '✗ Try again';
      default:        return nativeShare ? '🔗 Share invite' : '📋 Copy invite message';
    }
  };

  return (
    <div className="rounded-3xl overflow-hidden border border-pp-secondary/25">
      {/* Blurred preview */}
      <div className="relative">
        <div className="px-5 pt-5 pb-10 space-y-4 select-none pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pp-secondary/20 flex items-center justify-center">
              <span className="text-lg">💑</span>
            </div>
            <div>
              <p className="text-xs text-pp-text-muted uppercase tracking-widest">Premium</p>
              <h3 className="text-white font-semibold">Couple Chemistry Report</h3>
            </div>
          </div>
          <div className="blur-sm space-y-2 opacity-50">
            <div className="h-3 bg-white/15 rounded-full w-full" />
            <div className="h-3 bg-white/15 rounded-full w-4/5" />
            <div className="h-3 bg-white/15 rounded-full w-2/3" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[80, 65, 72].map((n, i) => (
                <div key={i} className="rounded-xl p-3 bg-white/8 text-center">
                  <div className="text-lg font-bold text-white">{n}%</div>
                  <div className="h-2 bg-white/15 rounded w-3/4 mx-auto mt-1" />
                </div>
              ))}
            </div>
            <div className="h-20 bg-white/8 rounded-2xl mt-2" />
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-pp-bg-dark/96 via-pp-bg-dark/72 to-transparent px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-pp-primary/80 border border-pp-secondary/40 flex items-center justify-center mb-4 shadow-card">
            <span className="text-2xl">{isInvited ? '💑' : '🔒'}</span>
          </div>
          <h3 className="font-display text-xl text-white mb-2">Couple Chemistry Report</h3>
          <p className="text-sm text-pp-text-muted leading-relaxed max-w-xs">
            {isInvited
              ? 'Your couple results are ready. See how you and your partner match across all dimensions.'
              : 'Invite your partner to complete the quiz to unlock your shared compatibility breakdown and growth roadmap.'}
          </p>
          {isInvited && coupleId ? (
            <a
              href={`/couple/${coupleId}`}
              className="mt-5 px-6 py-3 rounded-2xl bg-pp-accent text-pp-bg-dark text-sm font-semibold
                hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60"
            >
              View Couple Results →
            </a>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-5 px-6 py-3 rounded-2xl bg-pp-accent text-pp-bg-dark text-sm font-semibold
                hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60"
            >
              {open ? 'Close ✕' : 'Invite Partner →'}
            </button>
          )}
        </div>
      </div>

      {/* Expandable share panel — only for Partner 1 */}
      {!isInvited && (
        <div
          className={`overflow-hidden transition-all duration-400 ease-out ${
            open ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 py-5 border-t border-pp-secondary/20 bg-pp-card space-y-4">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">
              Send this to your partner
            </p>

            {/* Message preview */}
            <div className="px-4 py-3 rounded-xl bg-pp-primary/60 border border-pp-secondary/25">
              <p className="text-sm text-white/70 leading-relaxed italic">
                &ldquo;{message}&rdquo;
              </p>
            </div>

            {/* Copy / Share */}
            <button
              onClick={handleShare}
              disabled={shareState === 'loading'}
              className={[
                'w-full py-3 px-5 rounded-2xl border text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                'focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
                shareState === 'copied' || shareState === 'shared'
                  ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/8'
                  : shareState === 'failed'
                  ? 'border-red-400/40 text-red-400 bg-red-400/8'
                  : 'border-pp-secondary/40 text-pp-secondary hover:border-pp-secondary/70 hover:text-white',
              ].join(' ')}
            >
              {copyLabel()}
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl
                bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-medium
                hover:bg-[#25D366]/15 transition-colors active:scale-[0.98]"
            >
              <span>📱</span>
              Share via WhatsApp
            </a>

            {coupleId && (
              <a
                href={`/couple/${coupleId}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl
                  border border-pp-secondary/30 text-pp-secondary text-sm font-medium
                  hover:border-pp-secondary/60 hover:text-white transition-colors active:scale-[0.98]"
              >
                💑 View Couple Results →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
