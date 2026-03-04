'use client';

import React, { useState } from 'react';
import { DateDuration, DURATION_LABELS, DURATION_ICONS, DURATION_DESCRIPTIONS } from '@/lib/dateIdeas';

interface TimeSelectorProps {
  onSelect: (duration: DateDuration) => void;
}

const DURATIONS: DateDuration[] = ['30 min', '1 hr', '3 hrs'];

export default function TimeSelector({ onSelect }: TimeSelectorProps) {
  const [selected, setSelected] = useState<DateDuration | null>(null);

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px w-8 bg-pp-accent/40" />
          <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
            Date Night
          </span>
          <div className="h-px w-8 bg-pp-accent/40" />
        </div>
        <h2 className="font-display text-3xl text-white">How much time do you have?</h2>
        <p className="text-sm text-pp-text-muted">
          We'll suggest date ideas matched to your archetypes.
        </p>
      </div>

      {/* Duration cards */}
      <div className="flex flex-col gap-3">
        {DURATIONS.map((d) => {
          const active = selected === d;
          return (
            <button
              key={d}
              onClick={() => setSelected(d)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left active:scale-[0.98]
                focus:outline-none ${
                  active
                    ? 'border-pp-accent bg-pp-accent/10'
                    : 'border-white/10 bg-white/3 hover:border-white/25'
                }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center border text-2xl flex-shrink-0 transition-all ${
                  active
                    ? 'bg-pp-accent/20 border-pp-accent/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {DURATION_ICONS[d]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base transition-colors ${active ? 'text-pp-accent' : 'text-white'}`}>
                  {DURATION_LABELS[d]}
                </p>
                <p className="text-sm text-pp-text-muted mt-0.5 leading-snug">
                  {DURATION_DESCRIPTIONS[d]}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  active ? 'border-pp-accent bg-pp-accent' : 'border-white/20'
                }`}
              >
                {active && <div className="w-2 h-2 rounded-full bg-pp-bg-dark" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!selected}
        className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:hover:bg-pp-accent/90"
      >
        Spin the Wheel →
      </button>
    </div>
  );
}
