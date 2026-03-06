'use client';

import React from 'react';
import { SituationCard } from '@/lib/firstAidService';

const SITUATION_EMOJI: Record<number, string> = {
  1: '😩',  // bad day at work
  2: '🤫',  // unusually quiet
  3: '🪫',  // emotionally drained
  4: '😰',  // feeling anxious
  5: '💔',  // feels unappreciated
  6: '🙉',  // not listening
  7: '👨‍👩‍👧',  // argument with family
  8: '😮‍💨',  // long exhausting day
  9: '🌊',  // overwhelmed by life
  10: '🤒', // fell sick
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Work Stress': '💼',
  'Emotional Overwhelm': '😶‍🌫️',
  'Daily Stress': '😮‍💨',
  'Relationship Tension': '💬',
  'Family Stress': '👨‍👩‍👧',
  'Personal Care': '🫂',
};

interface PillCardProps {
  situation: SituationCard;
  onSelect: (situation: SituationCard) => void;
}

export default function PillCard({ situation, onSelect }: PillCardProps) {
  return (
    <button
      onClick={() => onSelect(situation)}
      className="w-full text-left rounded-2xl border border-white/8 bg-white/3 p-4
        hover:border-white/20 hover:bg-white/5 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pp-accent/8 border border-pp-accent/20
          flex items-center justify-center flex-shrink-0 text-xl">
          {SITUATION_EMOJI[situation.situation_id] || CATEGORY_EMOJI[situation.category] || '💡'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{situation.situation}</p>
          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-pp-text-muted">
            {situation.category}
          </span>
        </div>
        <span className="text-pp-text-muted text-sm flex-shrink-0">→</span>
      </div>
    </button>
  );
}
