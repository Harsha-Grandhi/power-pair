'use client';

import React, { useEffect, useState } from 'react';
import { ArchetypeResult } from '@/types';
import Button from '@/components/ui/Button';

interface ArchetypeRevealProps {
  result: ArchetypeResult;
  onContinue: () => void;
}

export default function ArchetypeReveal({ result, onContinue }: ArchetypeRevealProps) {
  const { primary, secondary, confidence } = result;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col items-center text-center gap-8 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Label */}
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-pp-accent/40" />
        <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
          Your Archetype
        </span>
        <div className="h-px w-8 bg-pp-accent/40" />
      </div>

      {/* Emoji + glow ring */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 scale-110"
          style={{ backgroundColor: primary.color }}
        />
        <div
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-2"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${primary.gradientTo}22, ${primary.gradientFrom}11)`,
            borderColor: `${primary.color}50`,
          }}
        >
          <span className="text-5xl md:text-6xl">{primary.emoji}</span>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
          {primary.name}
        </h1>
        {/* Confidence bar */}
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className="text-xs text-pp-text-muted">Match confidence</span>
          <div className="relative h-1 w-24 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${confidence}%`, backgroundColor: primary.color }}
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: primary.color }}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-base md:text-lg text-pp-text-muted leading-relaxed max-w-md">
        {primary.description}
      </p>

      {/* Secondary archetype pill */}
      {secondary && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-sm">{secondary.emoji}</span>
          <span className="text-xs text-pp-text-muted">
            Secondary influence:{' '}
            <span className="text-white font-medium">{secondary.name}</span>
          </span>
        </div>
      )}

      {/* CTA */}
      <Button variant="accent" size="lg" fullWidth onClick={onContinue} className="mt-2">
        See Your Emotional Map
        <span className="ml-1">→</span>
      </Button>
    </div>
  );
}
