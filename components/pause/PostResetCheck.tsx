'use client';

import React, { useState } from 'react';

interface PostResetCheckProps {
  onSubmit: (feeling: string, reflection: string) => void;
}

const FEELINGS = [
  { label: 'Much calmer', emoji: '\u{1F60C}' },
  { label: 'A little better', emoji: '\u{1F642}' },
  { label: 'Still upset', emoji: '\u{1F614}' },
];

export default function PostResetCheck({ onSubmit }: PostResetCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <h2 className="font-display text-2xl text-white mb-8 text-center">
        How do you feel now?
      </h2>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {FEELINGS.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => setSelected(label)}
            className={`
              flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200
              ${
                selected === label
                  ? 'bg-pp-accent/10 border-pp-accent/50 ring-1 ring-pp-accent/20'
                  : 'bg-pp-card border-white/5 hover:border-pp-accent/30'
              }
            `}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-white">{label}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm mt-6">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Want to add a quick reflection? (optional)"
          rows={3}
          className="w-full bg-pp-card border border-white/10 rounded-xl p-3 text-white
            placeholder:text-pp-text-muted text-sm resize-none focus:outline-none
            focus:border-pp-accent/40 transition-colors"
        />
      </div>

      <button
        onClick={() => selected && onSubmit(selected, reflection)}
        disabled={!selected}
        className={`
          mt-6 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
          ${
            selected
              ? 'bg-pp-accent text-pp-bg-dark hover:opacity-90 active:scale-95'
              : 'bg-pp-card text-pp-text-muted cursor-not-allowed'
          }
        `}
      >
        Continue
      </button>
    </div>
  );
}
