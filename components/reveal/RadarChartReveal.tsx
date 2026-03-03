'use client';

import React, { useEffect, useState } from 'react';
import { DimensionScore } from '@/types';
import RadarChart, { RadarDataPoint } from '@/components/charts/RadarChart';
import Button from '@/components/ui/Button';
import { getScoreLabel, getScoreColor } from '@/lib/scoring';

interface RadarChartRevealProps {
  dimensionScores: DimensionScore[];
  onContinue: () => void;
}

export default function RadarChartReveal({
  dimensionScores,
  onContinue,
}: RadarChartRevealProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const radarData: RadarDataPoint[] = dimensionScores.map((d) => ({
    label: d.name,
    value: d.score,
    icon: d.icon,
  }));

  return (
    <div
      className={`flex flex-col items-center gap-8 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-pp-accent/40" />
          <span className="text-xs font-medium tracking-[0.2em] text-pp-accent uppercase">
            Your Emotional Map
          </span>
          <div className="h-px w-8 bg-pp-accent/40" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white">
          6 Dimensions of Your Love
        </h2>
        <p className="text-sm text-pp-text-muted max-w-xs mx-auto">
          Each axis represents a core pillar of how you show up in relationship.
        </p>
      </div>

      {/* Radar Chart */}
      <div
        className={`transition-all duration-1000 ease-out delay-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <RadarChart data={radarData} size={280} />
      </div>

      {/* Score grid */}
      <div className="w-full grid grid-cols-2 gap-2.5">
        {dimensionScores.map((d, i) => (
          <div
            key={d.id}
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/4 border border-white/8"
            style={{
              animationDelay: `${i * 80}ms`,
            }}
          >
            <span className="text-xl flex-shrink-0">{d.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-pp-text-muted truncate leading-none mb-1">
                {d.name.split(' ').slice(0, 2).join(' ')}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-sm font-bold"
                  style={{ color: getScoreColor(d.score) }}
                >
                  {d.score}
                </span>
                <span className="text-xs text-pp-text-muted">/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="accent" size="lg" fullWidth onClick={onContinue}>
        See Your Strengths
        <span className="ml-1">→</span>
      </Button>
    </div>
  );
}
