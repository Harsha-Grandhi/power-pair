'use client';

import React from 'react';
import { LoveStyleResult, LoveSubtype } from '@/types';
import { getLoveSubtypeLabel, getLoveSubtypeDescription } from '@/lib/scoring';

const SUBTYPE_ICONS: Record<LoveSubtype, string> = {
  Physical: '🤝',
  Verbal: '💬',
  Presence: '⏳',
  Action: '🛠',
};

const SUBTYPE_COLORS: Record<LoveSubtype, string> = {
  Physical: '#E05C5C',
  Verbal: '#5B8FD4',
  Presence: '#4CAF9A',
  Action: '#F6B17A',
};

interface LoveStyleBreakdownProps {
  loveStyle: LoveStyleResult;
}

export default function LoveStyleBreakdown({ loveStyle }: LoveStyleBreakdownProps) {
  const { subtype, intensity, subtypeDistribution } = loveStyle;
  const totalResponses = Object.values(subtypeDistribution).reduce((a, b) => a + b, 0);
  const primaryColor = SUBTYPE_COLORS[subtype];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{SUBTYPE_ICONS[subtype]}</span>
          <div>
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">
              Love Style
            </p>
            <h3 className="text-white font-semibold">{getLoveSubtypeLabel(subtype)}</h3>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-pp-text-muted">Intensity</p>
            <p className="font-bold text-lg" style={{ color: primaryColor }}>
              {intensity}%
            </p>
          </div>
        </div>

        {/* Intensity bar */}
        <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${intensity}%`, backgroundColor: primaryColor }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-4 border-b border-white/6">
        <p className="text-sm text-white/65 leading-relaxed">
          {getLoveSubtypeDescription(subtype)}
        </p>
      </div>

      {/* All subtypes distribution */}
      <div className="px-5 py-4">
        <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-3">
          Style Distribution
        </p>
        <div className="space-y-2.5">
          {(Object.entries(subtypeDistribution) as [LoveSubtype, number][]).map(
            ([st, count]) => {
              const pct = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
              const color = SUBTYPE_COLORS[st];
              const isPrimary = st === subtype;
              return (
                <div key={st} className="flex items-center gap-3">
                  <span className="text-sm flex-shrink-0">{SUBTYPE_ICONS[st]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span
                        className={`text-xs ${
                          isPrimary ? 'text-white font-medium' : 'text-pp-text-muted'
                        }`}
                      >
                        {getLoveSubtypeLabel(st)}
                      </span>
                      <span className="text-xs text-pp-text-muted">{count}/3</span>
                    </div>
                    <div className="h-1 w-full bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color, opacity: isPrimary ? 1 : 0.45 }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
