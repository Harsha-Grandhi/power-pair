'use client';

import React from 'react';

export interface RadarDataPoint {
  label: string;
  value: number; // 0–100
  color?: string;
  icon?: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  className?: string;
}

const AXIS_COLORS = [
  '#4CAF9A',
  '#5B8FD4',
  '#F6B17A',
  '#9B72CF',
  '#E05C5C',
  '#7077A1',
];

export default function RadarChart({ data, size = 280, className = '' }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const labelRadius = size * 0.48;
  const n = data.length;
  const levels = 4;

  // Get x,y for a value on a given axis index (0-indexed)
  function getPoint(axisIndex: number, value: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * axisIndex) / n - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  // Outer axis endpoint
  function getAxisEnd(axisIndex: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * axisIndex) / n - Math.PI / 2;
    return {
      x: cx + maxRadius * Math.cos(angle),
      y: cy + maxRadius * Math.sin(angle),
    };
  }

  // Label position
  function getLabelPos(axisIndex: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * axisIndex) / n - Math.PI / 2;
    return {
      x: cx + labelRadius * Math.cos(angle),
      y: cy + labelRadius * Math.sin(angle),
    };
  }

  // Background ring polygon at a given level fraction
  function ringPolygon(fraction: number): string {
    return Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = fraction * maxRadius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  }

  // Data polygon
  const dataPolygon = data
    .map((d, i) => {
      const pt = getPoint(i, d.value);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="Dimension radar chart"
      >
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F6B17A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7077A1" stopOpacity="0.08" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background rings */}
        {Array.from({ length: levels }, (_, lvl) => (
          <polygon
            key={lvl}
            points={ringPolygon((lvl + 1) / levels)}
            fill="none"
            stroke="rgba(112,119,161,0.18)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const end = getAxisEnd(i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(112,119,161,0.22)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon fill */}
        <polygon
          points={dataPolygon}
          fill="url(#radarFill)"
          stroke="none"
        />

        {/* Data polygon stroke */}
        <polygon
          points={dataPolygon}
          fill="none"
          stroke="#F6B17A"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#glow)"
          opacity="0.85"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const pt = getPoint(i, d.value);
          const color = AXIS_COLORS[i % AXIS_COLORS.length];
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={5} fill={color} opacity="0.9" />
              <circle cx={pt.x} cy={pt.y} r={3} fill="white" opacity="0.95" />
            </g>
          );
        })}

        {/* Axis labels */}
        {data.map((d, i) => {
          const lp = getLabelPos(i);
          const words = d.label.split(' ');
          // Shorten for display
          const shortLabel =
            words.length > 2 ? words.slice(0, 2).join(' ') : d.label;

          return (
            <text
              key={i}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9.5"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontWeight="500"
              fill="rgba(255,255,255,0.65)"
              letterSpacing="0.02em"
            >
              {d.icon && (
                <tspan dy="-7" x={lp.x} fontSize="11">
                  {d.icon}
                </tspan>
              )}
              <tspan x={lp.x} dy={d.icon ? '14' : '0'}>
                {shortLabel}
              </tspan>
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(246,177,122,0.5)" />
      </svg>
    </div>
  );
}
