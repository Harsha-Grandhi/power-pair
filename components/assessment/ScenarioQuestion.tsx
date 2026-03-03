'use client';

import React from 'react';
import { ScoredQuestion, LoveSubtype } from '@/types';

interface ScenarioQuestionProps {
  question: ScoredQuestion;
  selectedScore?: number | LoveSubtype;
  onSelect: (score: number | LoveSubtype) => void;
  questionNumber: number;
  totalQuestions: number;
  isAdvancing?: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const loveStyleLabels: Record<LoveSubtype, string> = {
  Physical: '🤝 Touch',
  Verbal: '💬 Words',
  Presence: '⏳ Time',
  Action: '🛠 Action',
};

export default function ScenarioQuestion({
  question,
  selectedScore,
  onSelect,
  questionNumber,
  totalQuestions,
  isAdvancing = false,
}: ScenarioQuestionProps) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest text-pp-accent/80 uppercase">
          {question.dimension}
        </span>
        <span className="text-xs text-pp-text-muted">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <div className="space-y-1">
        <h2 className="font-display text-xl md:text-2xl text-white leading-snug">
          {question.question}
        </h2>
        {question.isLoveStyle && (
          <p className="text-xs text-pp-text-muted mt-1">
            Choose what resonates most — there&apos;s no right answer.
          </p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedScore === option.score;
          const isConfirmed = isSelected && isAdvancing;
          const isDimmed = isAdvancing && !isSelected;
          const loveTag = question.isLoveStyle
            ? loveStyleLabels[option.score as LoveSubtype]
            : null;

          return (
            <button
              key={idx}
              onClick={() => !isAdvancing && onSelect(option.score)}
              disabled={isAdvancing && !isSelected}
              className={[
                'w-full text-left px-4 py-4 rounded-2xl border',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60',
                'active:scale-[0.985] disabled:cursor-default',
                isSelected
                  ? 'bg-pp-accent/10 border-pp-accent/55 text-white'
                  : 'bg-white/4 border-white/8 text-pp-text-muted hover:border-pp-secondary/40 hover:text-white hover:bg-white/6',
                isDimmed ? 'opacity-25' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-start gap-3">
                {/* Letter badge */}
                <span
                  className={[
                    'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center',
                    'text-xs font-bold transition-all duration-200',
                    isSelected
                      ? 'bg-pp-accent text-pp-bg-dark'
                      : 'bg-white/8 text-pp-text-muted',
                  ].join(' ')}
                >
                  {isConfirmed ? '✓' : OPTION_LABELS[idx]}
                </span>

                <div className="flex-1 min-w-0">
                  <span className="text-sm md:text-base leading-snug block">
                    {option.label}
                  </span>
                  {loveTag && (
                    <span
                      className={[
                        'inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full',
                        isSelected
                          ? 'bg-pp-accent/20 text-pp-accent'
                          : 'bg-white/8 text-pp-text-muted',
                      ].join(' ')}
                    >
                      {loveTag}
                    </span>
                  )}
                </div>

                {/* Advancing spinner on the selected option */}
                {isConfirmed && (
                  <span className="ml-auto flex-shrink-0 self-center w-3.5 h-3.5 border-2 border-pp-accent border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
