'use client';

import React from 'react';
import { Pill } from '@/lib/firstAidService';

const CATEGORY_EMOJI: Record<string, string> = {
  emotional: '💙',
  social: '👥',
  work: '💼',
  family: '👨‍👩‍👧',
  daily_stress: '😮‍💨',
  disappointment: '😔',
  personal_space: '🧘',
  big_moments: '🎯',
  physical: '💪',
};

interface PillCardProps {
  pill: Pill;
  onSelect: (pill: Pill) => void;
}

export default function PillCard({ pill, onSelect }: PillCardProps) {
  return (
    <button
      onClick={() => onSelect(pill)}
      className="w-full text-left bg-pp-card/60 rounded-xl p-4 border border-white/5 hover:border-pp-accent/30 transition-all space-y-2"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{CATEGORY_EMOJI[pill.category] || '💊'}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white font-medium leading-snug">{pill.situation}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-pp-text-muted capitalize">
              {pill.category.replace('_', ' ')}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-pp-accent/10 text-pp-accent capitalize">
              {pill.primary_need}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
