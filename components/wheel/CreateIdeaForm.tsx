'use client';

import React, { useState } from 'react';
import { DateDuration } from '@/lib/dateIdeas';

interface CreateIdeaFormProps {
  onSubmit: (idea: {
    title: string;
    description: string;
    duration: DateDuration;
    shareWithCommunity: boolean;
  }) => void;
  onBack: () => void;
  submitting: boolean;
}

const DURATIONS: DateDuration[] = ['30 min', '1 hr', '3 hrs'];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CreateIdeaForm({ onSubmit, onBack, submitting }: CreateIdeaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<DateDuration | null>(null);
  const [shareWithCommunity, setShareWithCommunity] = useState(false);

  const wordCount = countWords(description);
  const isValid = title.trim().length > 0 && wordCount >= 20 && duration !== null;

  const handleSubmit = () => {
    if (!isValid || !duration || submitting) return;
    onSubmit({ title: title.trim(), description: description.trim(), duration, shareWithCommunity });
  };

  return (
    <div className="px-5 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-pp-text-muted hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="font-display text-xl text-white font-semibold">Create a Date Idea</h2>
          <p className="text-xs text-pp-text-muted">Add your own idea to the wheel</p>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs text-pp-text-muted uppercase tracking-widest">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Midnight Pancakes"
          maxLength={60}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
            placeholder:text-white/20 focus:outline-none focus:border-pp-accent/40 transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs text-pp-text-muted uppercase tracking-widest">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your date idea in at least 20 words..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
            placeholder:text-white/20 focus:outline-none focus:border-pp-accent/40 transition-colors resize-none"
        />
        <div className="flex items-center justify-between">
          <span className={`text-[11px] ${wordCount >= 20 ? 'text-emerald-400' : 'text-pp-text-muted'}`}>
            {wordCount}/20 words {wordCount >= 20 ? '✓' : 'minimum'}
          </span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs text-pp-text-muted uppercase tracking-widest">Duration</label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                duration === d
                  ? 'bg-pp-accent text-pp-bg-dark'
                  : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Share toggle */}
      <button
        onClick={() => setShareWithCommunity(!shareWithCommunity)}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/3
          hover:border-white/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🌍</span>
          <div className="text-left">
            <p className="text-sm text-white font-medium">Share with community</p>
            <p className="text-[11px] text-pp-text-muted">Let other couples discover this idea</p>
          </div>
        </div>
        <div className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${
          shareWithCommunity ? 'bg-pp-accent' : 'bg-white/15'
        }`}>
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            shareWithCommunity ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </div>
      </button>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:hover:bg-pp-accent/90"
      >
        {submitting ? 'Adding...' : 'Add to My Wheel'}
      </button>
    </div>
  );
}
