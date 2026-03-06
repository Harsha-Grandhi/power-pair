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
      className="w-full text-left bg-pp-card/60 rounded-xl p-4 border border-white/5 hover:border-pp-accent/30 transition-all space-y-2"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{SITUATION_EMOJI[situation.situation_id] || CATEGORY_EMOJI[situation.category] || '💡'}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white font-medium leading-snug">{situation.situation}</p>
          <span className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-pp-text-muted">
            {situation.category}
          </span>
        </div>
        <svg className="w-4 h-4 text-pp-text-muted shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
