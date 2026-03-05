'use client';

import React from 'react';

interface ModeSelectProps {
  emotion: string;
  onSelect: (mode: 'reset' | 'vent') => void;
}

export default function ModeSelect({ emotion, onSelect }: ModeSelectProps) {
  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="inline-flex items-center gap-1.5 bg-pp-card border border-white/10 rounded-full px-3 py-1 mb-6">
        <span className="text-sm text-pp-text-muted">Feeling</span>
        <span className="text-sm text-pp-accent font-medium">{emotion}</span>
      </div>

      <h2 className="font-display text-2xl text-white mb-2 text-center">
        How would you like to process this moment?
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
        <button
          onClick={() => onSelect('reset')}
          className="flex items-start gap-4 p-5 bg-pp-card rounded-2xl border border-white/5
            hover:border-pp-accent/30 active:scale-[0.98] transition-all duration-200 text-left"
        >
          <span className="text-3xl mt-0.5">{'\u{1F9D8}'}</span>
          <div>
            <h3 className="text-white font-semibold text-lg">2-Minute Reset</h3>
            <p className="text-pp-text-muted text-sm mt-1">
              A guided breathing exercise to calm your mind
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect('vent')}
          className="flex items-start gap-4 p-5 bg-pp-card rounded-2xl border border-white/5
            hover:border-pp-accent/30 active:scale-[0.98] transition-all duration-200 text-left"
        >
          <span className="text-3xl mt-0.5">{'\u{1F4AD}'}</span>
          <div>
            <h3 className="text-white font-semibold text-lg">Vent It Out</h3>
            <p className="text-pp-text-muted text-sm mt-1">
              Express what you&apos;re feeling through words
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
