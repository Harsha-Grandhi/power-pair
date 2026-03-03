'use client';

import React, { useEffect, useState } from 'react';
import { Archetype, LoveStyleResult } from '@/types';
import Button from '@/components/ui/Button';
import { getLoveSubtypeLabel } from '@/lib/scoring';

interface StrengthsRevealProps {
  archetype: Archetype;
  loveStyle: LoveStyleResult;
  onContinue: () => void;
}

export default function StrengthsReveal({
  archetype,
  loveStyle,
  onContinue,
}: StrengthsRevealProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col gap-7 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-pp-accent/40" />
          <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
            Your Profile
          </span>
          <div className="h-px w-8 bg-pp-accent/40" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white">
          Strengths & Growth
        </h2>
      </div>

      {/* Love Style card */}
      <div
        className="p-5 rounded-2xl border"
        style={{
          background: `linear-gradient(135deg, ${archetype.gradientFrom}18, ${archetype.gradientTo}0a)`,
          borderColor: `${archetype.color}35`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💎</span>
          <div>
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Love Style</p>
            <p className="text-white font-semibold">{getLoveSubtypeLabel(loveStyle.subtype)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-pp-text-muted">Intensity</p>
            <p className="font-bold" style={{ color: archetype.color }}>
              {loveStyle.intensity}%
            </p>
          </div>
        </div>
        {/* Intensity bar */}
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${loveStyle.intensity}%`, backgroundColor: archetype.color }}
          />
        </div>
      </div>

      {/* Strengths */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
          Your Strengths
        </h3>
        <div className="flex flex-col gap-2">
          {archetype.strengths.map((strength, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-emerald-400 text-sm flex-shrink-0">✦</span>
              <span className="text-sm text-white/85">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Edges */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-pp-accent/20 text-pp-accent flex items-center justify-center text-xs">↑</span>
          Growth Edge
        </h3>
        <div className="flex flex-col gap-2">
          {archetype.growthEdge.map((edge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-pp-accent/8 border border-pp-accent/15"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-pp-accent text-sm flex-shrink-0">◆</span>
              <span className="text-sm text-white/85">{edge}</span>
            </div>
          ))}
        </div>
      </div>

      <Button variant="accent" size="lg" fullWidth onClick={onContinue} className="mt-1">
        Complete Your Journey
        <span className="ml-1">→</span>
      </Button>
    </div>
  );
}
