'use client';

import React from 'react';
import { DimensionComparison as DimensionComparisonType } from '@/types';

interface DimensionComparisonProps {
  dimensions: DimensionComparisonType[];
  p1Name?: string;
  p2Name?: string;
}

export default function DimensionComparison({
  dimensions,
  p1Name = 'You',
  p2Name = 'Partner',
}: DimensionComparisonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-pp-text-muted mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#F6B17A]" />
          <span>{p1Name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#7077A1]" />
          <span>{p2Name}</span>
        </div>
      </div>

      {dimensions.map((dim) => (
        <div key={dim.dimension} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{dim.icon}</span>
              <span className="text-sm text-white/80 font-medium">{dim.name}</span>
            </div>
            <span className={`text-xs ${
              dim.compatibility === 'aligned' ? 'text-emerald-400' :
              dim.compatibility === 'complementary' ? 'text-pp-accent' : 'text-red-400'
            }`}>{dim.compatibility}</span>
          </div>

          {/* P1 bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-pp-text-muted w-8 text-right">{dim.p1Percentage}%</span>
            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F6B17A] transition-all duration-700 ease-out"
                style={{ width: `${dim.p1Percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-white/50 w-16 text-right">{dim.p1Style}</span>
          </div>

          {/* P2 bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-pp-text-muted w-8 text-right">{dim.p2Percentage}%</span>
            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7077A1] transition-all duration-700 ease-out"
                style={{ width: `${dim.p2Percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-white/50 w-16 text-right">{dim.p2Style}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
