'use client';

import React, { useState } from 'react';
import { DimensionScore } from '@/types';
import { getScoreLabel, getScoreColor } from '@/lib/scoring';

interface DimensionCardProps {
  dimension: DimensionScore;
  index: number;
}

export default function DimensionCard({ dimension, index }: DimensionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = getScoreColor(dimension.percentage);
  const scoreLabel = getScoreLabel(dimension.percentage);

  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 p-4 text-left focus:outline-none"
      >
        {/* Icon */}
        <span className="text-2xl flex-shrink-0">{dimension.icon}</span>

        {/* Name + bar */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">{dimension.name}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${dimension.percentage}%`, backgroundColor: scoreColor }}
              />
            </div>
          </div>
        </div>

        {/* Score + label */}
        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold" style={{ color: scoreColor }}>
            {dimension.percentage}
          </span>
          <span className="text-xs text-pp-text-muted block -mt-0.5">{scoreLabel}</span>
        </div>

        {/* Expand chevron */}
        <span
          className={`text-pp-text-muted transition-transform duration-200 flex-shrink-0 ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {/* Expanded description */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          <p className="text-sm text-white/60 leading-relaxed mt-3">
            {dimension.description}
          </p>
        </div>
      </div>
    </div>
  );
}
