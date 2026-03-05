'use client';

import React from 'react';

interface LikertScaleProps {
  questionId: string;
  value: number | undefined;
  onChange: (questionId: string, value: number) => void;
  isActive: boolean;
}

const SCALE_OPTIONS = [
  { value: 3, color: '#4CAF9A' },
  { value: 2, color: '#6BBF8A' },
  { value: 1, color: '#8DD07A' },
  { value: 0, color: '#B0B0B0' },
  { value: -1, color: '#E0A86A' },
  { value: -2, color: '#E8845A' },
  { value: -3, color: '#E05C5C' },
];

const SIZES = [28, 24, 20, 16, 20, 24, 28];

export default function LikertScale({ questionId, value, onChange, isActive }: LikertScaleProps) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      <span className="text-[10px] sm:text-xs text-pp-accent/80 w-12 text-right shrink-0">Agree</span>
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
        {SCALE_OPTIONS.map((opt, i) => {
          const isSelected = value === opt.value;
          const size = SIZES[i];
          return (
            <button
              key={opt.value}
              onClick={(e) => { e.stopPropagation(); onChange(questionId, opt.value); }}
              disabled={!isActive}
              className={`rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0 ${
                isSelected
                  ? 'scale-110 shadow-lg'
                  : isActive
                  ? 'hover:scale-105 opacity-70 hover:opacity-100'
                  : 'opacity-40'
              }`}
              style={{
                width: size,
                height: size,
                borderColor: isSelected ? opt.color : isActive ? opt.color + '60' : opt.color + '30',
                backgroundColor: isSelected ? opt.color : 'transparent',
              }}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
      <span className="text-[10px] sm:text-xs text-pp-secondary/80 w-12 shrink-0">Disagree</span>
    </div>
  );
}
