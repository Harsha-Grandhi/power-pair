'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const TOTAL_SECONDS = 120;
const CYCLE_DURATION = 12; // seconds per full cycle
const INHALE_END = 4;
const HOLD_END = 6;

function getPhaseLabel(elapsed: number): string {
  const cyclePos = elapsed % CYCLE_DURATION;
  if (cyclePos < INHALE_END) return 'Breathe in...';
  if (cyclePos < HOLD_END) return 'Hold...';
  return 'Breathe out...';
}

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    if (remaining === 0 && !done) {
      cleanup();
      setDone(true);
      setTimeout(() => onComplete(), 2000);
    }
  }, [remaining, done, cleanup, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const phaseLabel = done ? 'Well done' : getPhaseLabel(elapsed);

  // Compute scale based on current cycle phase
  const cyclePos = elapsed % CYCLE_DURATION;
  let scale: number;
  if (cyclePos < INHALE_END) {
    // Inhale: scale from 0.6 to 1.0
    scale = 0.6 + (0.4 * cyclePos) / INHALE_END;
  } else if (cyclePos < HOLD_END) {
    // Hold: stay at 1.0
    scale = 1.0;
  } else {
    // Exhale: scale from 1.0 to 0.6
    const exhaleProgress = (cyclePos - HOLD_END) / (CYCLE_DURATION - HOLD_END);
    scale = 1.0 - 0.4 * exhaleProgress;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 min-h-[60vh] relative">
      {/* Skip button */}
      <button
        onClick={() => {
          cleanup();
          onComplete();
        }}
        className="absolute top-4 right-4 text-pp-text-muted text-sm hover:text-white transition-colors"
      >
        Skip
      </button>

      {/* Breathing circle */}
      <div
        className="w-52 h-52 rounded-full bg-gradient-to-br from-pp-accent/20 to-pp-accent/5
          border-2 border-pp-accent/40 flex items-center justify-center
          transition-transform duration-1000 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      >
        <span className={`text-xl font-display text-center px-4 ${done ? 'text-pp-accent' : 'text-white'}`}>
          {phaseLabel}
        </span>
      </div>

      {/* Timer */}
      <div className="mt-10 text-3xl font-display text-white tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      {!done && (
        <p className="text-pp-text-muted text-sm mt-3">
          Follow the circle. Let your body relax.
        </p>
      )}
    </div>
  );
}
