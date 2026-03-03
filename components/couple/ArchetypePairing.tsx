'use client';

import React from 'react';
import { Archetype } from '@/types';

interface ArchetypePairingProps {
  p1Archetype: Archetype;
  p2Archetype: Archetype;
  p1Name?: string;
  p2Name?: string;
}

function ArchetypeCard({
  archetype,
  label,
}: {
  archetype: Archetype;
  label: string;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border"
      style={{
        background: `radial-gradient(circle at top, ${archetype.gradientTo}18, ${archetype.gradientFrom}08)`,
        borderColor: `${archetype.color}30`,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-card"
        style={{
          background: `radial-gradient(circle, ${archetype.gradientTo}22, ${archetype.gradientFrom}11)`,
          borderColor: `${archetype.color}50`,
        }}
      >
        <span className="text-3xl">{archetype.emoji}</span>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm leading-tight">{archetype.name}</p>
        <p className="text-xs mt-0.5" style={{ color: archetype.color }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ArchetypePairing({
  p1Archetype,
  p2Archetype,
  p1Name = 'You',
  p2Name = 'Partner',
}: ArchetypePairingProps) {
  return (
    <div className="flex items-center gap-3">
      <ArchetypeCard archetype={p1Archetype} label={p1Name} />

      <div className="flex flex-col items-center gap-1 px-1 shrink-0">
        <div className="h-6 w-px bg-pp-secondary/40" />
        <span className="text-pp-accent text-lg">+</span>
        <div className="h-6 w-px bg-pp-secondary/40" />
      </div>

      <ArchetypeCard archetype={p2Archetype} label={p2Name} />
    </div>
  );
}
