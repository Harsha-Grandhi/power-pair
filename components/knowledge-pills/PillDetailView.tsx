'use client';

import React from 'react';
import { Bucket } from '@/lib/firstAidService';

const WHAT_TO_SAY_LABELS: Record<string, string> = {
  open_with: 'Open with',
  while_talking: 'While talking',
  show_presence: 'Show presence',
  wind_down: 'Wind down',
  if_they_deflect: 'If they deflect',
  when_opening_up: 'When they open up',
  if_they_say_nothing: 'If they say nothing',
  if_they_say_fine: 'If they say fine',
  if_they_want_to_talk: 'If they want to talk',
  show_support: 'Show support',
  if_they_seem_low: 'If they seem low',
  if_they_open_up: 'If they open up',
  if_they_share: 'If they share',
  to_validate: 'To validate',
  to_create_safety: 'Create safety',
  to_acknowledge: 'To acknowledge',
  when_they_want_to_talk: 'When they want to talk',
  keep_it_simple: 'Keep it simple',
};

interface PillDetailViewProps {
  situationText: string;
  bucket: Bucket;
  onBack: () => void;
}

export default function PillDetailView({ situationText, bucket, onBack }: PillDetailViewProps) {
  const sayEntries = Object.entries(bucket.what_to_say);

  return (
    <div className="space-y-5 pb-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-pp-text-muted hover:text-white transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Header */}
      <div>
        <p className="text-xs text-pp-accent uppercase tracking-widest mb-1">{bucket.bucket_name}</p>
        <h2 className="font-display text-xl text-white leading-snug">{situationText}</h2>
      </div>

      {/* Why this moment matters */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">Why this moment matters</p>
        <p className="text-sm text-white/80 leading-relaxed">{bucket.why_this_moment_matters}</p>
      </div>

      {/* Understanding their feelings */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">Understanding their feelings</p>
        <p className="text-sm text-white/80 leading-relaxed">{bucket.understanding_feelings}</p>
      </div>

      {/* What they need */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">What they need</p>
        <p className="text-sm text-white/80 leading-relaxed">{bucket.what_they_need}</p>
      </div>

      {/* What to say */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-3">💬 What to say</p>
        <div className="space-y-3">
          {sayEntries.map(([key, value]) => (
            <div key={key}>
              <p className="text-[11px] text-pp-accent font-medium uppercase tracking-wider mb-1">
                {WHAT_TO_SAY_LABELS[key] || key.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-white/80 leading-relaxed italic">&ldquo;{value}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to do */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">✅ What to do</p>
        <ul className="space-y-2">
          {bucket.what_to_do.map((d, i) => (
            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
              <span className="text-pp-accent shrink-0 mt-0.5">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Small gesture */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-2">🎁 Small gesture</p>
        <p className="text-sm text-white/80 leading-relaxed">{bucket.small_gesture}</p>
      </div>

      {/* What NOT to do */}
      <div className="rounded-2xl border border-red-400/15 bg-red-400/3 p-4">
        <p className="text-xs text-red-400/80 uppercase tracking-wider mb-2">🚫 What not to do</p>
        <ul className="space-y-2">
          {bucket.what_not_to_do.map((d, i) => (
            <li key={i} className="text-sm text-white/60 flex items-start gap-2">
              <span className="text-red-400/60 shrink-0 mt-0.5">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing affirmation */}
      <div className="rounded-2xl border border-pp-accent/15 bg-pp-accent/5 p-4 text-center">
        <p className="text-sm text-white/80 italic leading-relaxed">💛 {bucket.closing_affirmation}</p>
      </div>
    </div>
  );
}
