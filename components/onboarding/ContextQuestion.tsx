'use client';

import React from 'react';
import { IntroQuestion } from '@/types';

interface ContextQuestionProps {
  question: IntroQuestion;
  selectedValue?: string;
  onSelect: (value: string) => void;
  stepLabel: string;
  isAdvancing?: boolean;
  firstName?: string;
}

export default function ContextQuestion({
  question,
  selectedValue,
  onSelect,
  stepLabel,
  isAdvancing = false,
  firstName,
}: ContextQuestionProps) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Step badge */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium tracking-widest text-pp-accent uppercase">
          {stepLabel}
        </span>
        <div className="h-px flex-1 bg-pp-secondary/20" />
      </div>

      {/* Question */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-pp-text-muted leading-relaxed">{question.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = selectedValue === option;
          const isConfirmed = isSelected && isAdvancing;

          return (
            <button
              key={option}
              onClick={() => !isAdvancing && onSelect(option)}
              disabled={isAdvancing && !isSelected}
              className={[
                'w-full text-left px-5 py-4 rounded-2xl border',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60',
                'active:scale-[0.985]',
                'disabled:cursor-default',
                isSelected
                  ? 'bg-pp-accent/12 border-pp-accent/60 text-white'
                  : 'bg-white/4 border-white/8 text-pp-text-muted hover:border-pp-secondary/40 hover:text-white hover:bg-white/6',
                isAdvancing && !isSelected ? 'opacity-30' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-center gap-3">
                {/* Indicator */}
                <span
                  className={[
                    'flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    'transition-all duration-200',
                    isSelected ? 'border-pp-accent bg-pp-accent' : 'border-pp-secondary/50',
                  ].join(' ')}
                >
                  {isConfirmed ? (
                    <span className="text-[8px] text-pp-bg-dark font-bold leading-none">✓</span>
                  ) : isSelected ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-pp-bg-dark" />
                  ) : null}
                </span>

                <span className="text-sm md:text-base leading-snug">{option}</span>

                {/* Advancing spinner on selected */}
                {isConfirmed && (
                  <span className="ml-auto flex-shrink-0 w-3.5 h-3.5 border-2 border-pp-accent border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
