'use client';

import React, { useState } from 'react';

interface EmotionSelectProps {
  onSelect: (emotion: string) => void;
}

const EMOTIONS = [
  { label: 'Angry', emoji: '\u{1F620}' },
  { label: 'Hurt', emoji: '\u{1F494}' },
  { label: 'Sad', emoji: '\u{1F622}' },
  { label: 'Disappointed', emoji: '\u{1F61E}' },
  { label: 'Frustrated', emoji: '\u{1F624}' },
  { label: 'Ignored', emoji: '\u{1FAE5}' },
  { label: 'Jealous', emoji: '\u{1F49A}' },
  { label: 'Lonely', emoji: '\u{1F97A}' },
  { label: 'Confused', emoji: '\u{1F635}\u200D\u{1F4AB}' },
  { label: 'Overwhelmed', emoji: '\u{1F92F}' },
];

export default function EmotionSelect({ onSelect }: EmotionSelectProps) {
  const [tapped, setTapped] = useState<string | null>(null);

  const handleTap = (emotion: string) => {
    setTapped(emotion);
    setTimeout(() => onSelect(emotion), 340);
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <h2 className="font-display text-2xl text-white mb-2 text-center">
        What are you feeling right now?
      </h2>
      <p className="text-pp-text-muted text-sm mb-8 text-center">
        Take a moment to identify your emotion
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {EMOTIONS.map(({ label, emoji }) => {
          const isSelected = tapped === label;
          const isDimmed = tapped !== null && !isSelected;

          return (
            <button
              key={label}
              onClick={() => !tapped && handleTap(label)}
              disabled={tapped !== null}
              className={`
                flex flex-col items-center justify-center gap-1 p-4
                bg-pp-card rounded-2xl border border-white/5
                transition-all duration-300
                ${isSelected ? 'scale-105 border-pp-accent/60 ring-1 ring-pp-accent/30' : ''}
                ${isDimmed ? 'opacity-40' : ''}
                ${!tapped ? 'hover:border-pp-accent/30 active:scale-95' : ''}
              `}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-sm text-white/90">{label}</span>
              {isSelected && (
                <span className="text-pp-accent text-xs mt-0.5">{'\u2713'}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
