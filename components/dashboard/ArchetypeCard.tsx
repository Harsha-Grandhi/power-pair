'use client';

import React from 'react';
import { ArchetypeResult } from '@/types';

interface ArchetypeCardProps {
  result: ArchetypeResult;
}

export default function ArchetypeCard({ result }: ArchetypeCardProps) {
  const { primary } = result;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 border"
      style={{
        background: `linear-gradient(135deg, ${primary.gradientFrom}22 0%, ${primary.gradientTo}10 60%, #1C1F2E 100%)`,
        borderColor: `${primary.color}30`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15 -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: primary.color }}
      />

      <div className="relative flex items-start gap-4">
        {/* Emoji */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border"
          style={{
            background: `radial-gradient(circle, ${primary.gradientTo}25, ${primary.gradientFrom}12)`,
            borderColor: `${primary.color}40`,
          }}
        >
          <span className="text-3xl">{primary.emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-0.5">
            Your Archetype
          </p>
          <h2 className="font-display text-2xl text-white font-bold leading-tight">
            {primary.name}
          </h2>

          {/* Code badge */}
          <p className="text-xs font-mono mt-1.5" style={{ color: primary.color }}>
            {primary.code}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="relative mt-4 text-sm text-white/65 leading-relaxed">
        {primary.description}
      </p>
    </div>
  );
}
