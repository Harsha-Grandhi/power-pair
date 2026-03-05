'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DateDuration, DURATION_LABELS, DURATION_ICONS, DateIdea } from '@/lib/dateIdeas';

// Segment colours cycling through design palette
const SEGMENT_COLORS = [
  '#F6B17A', // accent
  '#7077A1', // secondary
  '#4CAF9A', // sage green
  '#E05C5C', // passionate red
  '#5B8FD4', // blue
  '#9B72CF', // purple
  '#8DB5C8', // steel
  '#2D3250', // primary (darker)
];

interface SpinWheelProps {
  ideas: DateIdea[];
  duration: DateDuration;
  onBack: () => void;
  onConfirm: (idea: string) => void;
}

const SEGMENT_COUNT = 8; // always show 8 segments

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export default function SpinWheel({ ideas, duration, onBack, onConfirm }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<DateIdea | null>(null);
  const totalRotRef = useRef(0);

  // Pick 8 ideas (or fewer if not enough)
  const segments = ideas.slice(0, SEGMENT_COUNT);
  const segAngle = 360 / segments.length;

  const spin = useCallback(() => {
    if (spinning) return;
    setWinner(null);
    setSpinning(true);

    // 5–8 full rotations + random offset
    const extraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const newTotal = totalRotRef.current + extraRotations + randomOffset;
    totalRotRef.current = newTotal;
    setRotation(newTotal);

    setTimeout(() => {
      // Which segment is at the top (pointer at 0°)?
      // The pointer is at the top. After rotation, the angle at the top is (-newTotal % 360 + 360) % 360
      const normalised = ((-(newTotal % 360)) + 360) % 360;
      const idx = Math.floor(normalised / segAngle) % segments.length;
      setWinner(segments[idx]);
      setSpinning(false);
    }, 4200);
  }, [spinning, segments, segAngle]);

  const handleSpinAgain = () => {
    setWinner(null);
    // Reshuffle by re-spinning
    spin();
  };

  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 8;

  return (
    <div className="flex flex-col items-center gap-6 px-5 py-4">
      {/* Header */}
      <div className="text-center w-full space-y-1">
        <button
          onClick={onBack}
          className="text-xs text-pp-text-muted hover:text-white transition-colors flex items-center gap-1 mb-2"
        >
          ← Change time
        </button>
        <div className="flex items-center justify-center gap-2">
          <span className="text-base">{DURATION_ICONS[duration]}</span>
          <span className="text-sm font-medium text-pp-accent">{DURATION_LABELS[duration]} date</span>
        </div>
        <h2 className="font-display text-2xl text-white">
          {winner ? 'Your Date Idea!' : spinning ? 'Spinning…' : 'Spin to discover your date'}
        </h2>
      </div>

      {/* Wheel */}
      <div className="relative flex items-center justify-center">
        {/* Pointer triangle at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '20px solid #F6B17A',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
            }}
          />
        </div>

        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 40px rgba(246,177,122,0.15)` }}
        />

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          {/* Segments */}
          {segments.map((idea, i) => {
            const startAngle = i * segAngle;
            const endAngle = startAngle + segAngle;
            const midAngle = startAngle + segAngle / 2;
            const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
            const textPos = polarToCartesian(CX, CY, R * 0.65, midAngle);
            const rad = ((midAngle - 90) * Math.PI) / 180;

            // Show short title on wheel segment
            const short = idea.title.length > 22 ? idea.title.slice(0, 20) + '\u2026' : idea.title;

            return (
              <g key={i}>
                <path
                  d={segmentPath(CX, CY, R, startAngle, endAngle)}
                  fill={color}
                  fillOpacity={0.85}
                  stroke="#111218"
                  strokeWidth={2}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={9}
                  fontWeight="500"
                  transform={`rotate(${midAngle - 90}, ${textPos.x}, ${textPos.y})`}
                  style={{ pointerEvents: 'none' }}
                >
                  {short}
                </text>
              </g>
            );
          })}

          {/* Centre circle */}
          <circle cx={CX} cy={CY} r={22} fill="#111218" stroke="#F6B17A" strokeWidth={2} />
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fill="#F6B17A" fontSize={18}>
            💑
          </text>
        </svg>
      </div>

      {/* Spin button / result */}
      {!winner ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed
            enabled:hover:bg-pp-accent/90"
        >
          {spinning ? 'Spinning…' : '🎡 Spin!'}
        </button>
      ) : (
        <div className="w-full space-y-4">
          {/* Winner card */}
          <div className="p-5 rounded-2xl border border-pp-accent/30 bg-pp-accent/8 text-center space-y-2">
            <p className="text-xs text-pp-accent uppercase tracking-widest font-medium">Your Date Idea</p>
            <p className="text-white font-semibold text-lg leading-snug">{winner.title}</p>
            <p className="text-sm text-pp-text-muted leading-relaxed">{winner.description}</p>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs">{DURATION_ICONS[duration]}</span>
              <span className="text-xs text-pp-text-muted">{DURATION_LABELS[duration]}</span>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => onConfirm(winner.title + ': ' + winner.description)}
            className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
              hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98]"
          >
            ✓ Let's do this date!
          </button>
          <button
            onClick={handleSpinAgain}
            className="w-full py-3 rounded-2xl border border-white/15 text-pp-text-muted text-sm font-medium
              hover:border-white/30 hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            🔄 Spin Again
          </button>
        </div>
      )}
    </div>
  );
}
