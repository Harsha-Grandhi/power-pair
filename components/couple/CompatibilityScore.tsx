'use client';

import React from 'react';

interface CompatibilityScoreProps {
  score: number;
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Strong Match';
  if (score >= 70) return 'Great Chemistry';
  return 'Growing Together';
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#4CAF9A';
  if (score >= 70) return '#F6B17A';
  return '#7077A1';
}

export default function CompatibilityScore({ score }: CompatibilityScoreProps) {
  const label = getScoreLabel(score);
  const color = getScoreColor(score);

  // SVG circle ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-white font-bold leading-none">
            {score}
          </span>
          <span className="text-xs text-pp-text-muted mt-0.5">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <span
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
