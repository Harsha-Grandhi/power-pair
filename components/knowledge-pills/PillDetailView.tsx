'use client';

import React from 'react';
import { ResolvedPill } from '@/lib/firstAidService';

const TONE_EMOJI: Record<string, string> = {
  warm: '🌤️',
  calm: '🍃',
  playful: '✨',
  direct: '🎯',
};

interface PillDetailViewProps {
  pill: ResolvedPill;
  onBack: () => void;
}

export default function PillDetailView({ pill, onBack }: PillDetailViewProps) {
  const mod = pill.personalityModifier;

  return (
    <div className="space-y-5 pb-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm text-pp-text-muted hover:text-white transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Title */}
      <div>
        <p className="text-xs text-pp-accent uppercase tracking-widest mb-1 capitalize">
          {pill.category.replace('_', ' ')}
        </p>
        <h2 className="font-display text-xl text-white leading-snug">{pill.situation}</h2>
      </div>

      {/* Why this matters */}
      <div className="bg-pp-card/60 rounded-xl p-4 border border-white/5">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">Why this moment matters</p>
        <p className="text-sm text-white/80 leading-relaxed">{pill.why_this_moment_matters}</p>
      </div>

      {/* Feelings & Needs */}
      <div className="flex gap-3">
        <div className="flex-1 bg-pp-card/60 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">They may feel</p>
          <div className="flex flex-wrap gap-1.5">
            {pill.feelings.map(f => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/70 capitalize">{f}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-pp-card/60 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">They need</p>
          <div className="flex flex-wrap gap-1.5">
            {pill.needs.map(n => (
              <span key={n} className="text-xs px-2.5 py-1 rounded-full bg-pp-accent/10 text-pp-accent capitalize">{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Personality tone badge */}
      {mod && (
        <div className="flex items-center gap-2 bg-pp-accent/8 rounded-xl px-4 py-3 border border-pp-accent/20">
          <span className="text-lg">{TONE_EMOJI[mod.tone] || '💬'}</span>
          <div>
            <p className="text-xs text-pp-accent font-medium capitalize">
              {mod.tone} tone recommended
            </p>
            <p className="text-[11px] text-pp-text-muted mt-0.5">
              Based on your partner&apos;s personality
            </p>
          </div>
        </div>
      )}

      {/* What to say */}
      <div className="bg-pp-card/60 rounded-xl p-4 border border-white/5">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">💬 What to say</p>
        {mod && (
          <p className="text-[11px] text-pp-accent/70 mb-2 italic">Tip: {mod.what_to_say_style}</p>
        )}
        <div className="space-y-2">
          {pill.what_to_say.map((s, i) => (
            <p key={i} className="text-sm text-white/80 leading-relaxed italic">&ldquo;{s}&rdquo;</p>
          ))}
        </div>
      </div>

      {/* What to do */}
      <div className="bg-pp-card/60 rounded-xl p-4 border border-white/5">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">✅ What to do</p>
        {mod && (
          <p className="text-[11px] text-pp-accent/70 mb-2 italic">Tip: {mod.what_to_do_style}</p>
        )}
        <ul className="space-y-1.5">
          {pill.what_to_do.map((d, i) => (
            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
              <span className="text-pp-accent shrink-0 mt-0.5">•</span>
              <span className="capitalize">{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Small gesture */}
      <div className="bg-pp-card/60 rounded-xl p-4 border border-white/5">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">🎁 Small gesture</p>
        <p className="text-sm text-white/80 leading-relaxed">{pill.small_gesture}</p>
      </div>

      {/* What NOT to do */}
      <div className="bg-pp-card/60 rounded-xl p-4 border border-red-500/10">
        <p className="text-xs text-red-400/80 uppercase tracking-wider mb-2">🚫 What not to do</p>
        <ul className="space-y-1.5">
          {pill.what_not_to_do.map((d, i) => (
            <li key={i} className="text-sm text-white/60 flex items-start gap-2">
              <span className="text-red-400/60 shrink-0 mt-0.5">•</span>
              <span className="capitalize">{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reminder */}
      <div className="bg-pp-accent/5 rounded-xl p-4 border border-pp-accent/15 text-center">
        <p className="text-sm text-white/80 italic leading-relaxed">💛 {pill.reminder}</p>
      </div>
    </div>
  );
}
