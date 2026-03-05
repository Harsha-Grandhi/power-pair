'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AISummaryProps {
  emotion: string;
  summary: string;
  isLoading: boolean;
  onShare: () => void;
  onEdit: (edited: string) => void;
  onKeepPrivate: () => void;
}

export default function AISummary({
  emotion,
  summary,
  isLoading,
  onShare,
  onEdit,
  onKeepPrivate,
}: AISummaryProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(summary);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditText(summary);
  }, [summary]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editing]);

  const handleSave = () => {
    onEdit(editText);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="inline-flex items-center gap-1.5 bg-pp-card border border-white/10 rounded-full px-3 py-1 mb-6">
        <span className="text-sm text-pp-text-muted">Feeling</span>
        <span className="text-sm text-pp-accent font-medium">{emotion}</span>
      </div>

      <h2 className="font-display text-2xl text-white mb-6 text-center">
        Here&apos;s what we heard
      </h2>

      {/* Summary card */}
      <div className="w-full max-w-sm bg-pp-card border border-white/10 rounded-2xl p-5 mb-8">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-4/6" />
          </div>
        ) : editing ? (
          <div>
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={5}
              className="w-full bg-transparent border border-pp-accent/30 rounded-xl p-3 text-white
                text-sm resize-none focus:outline-none focus:border-pp-accent/60 transition-colors"
            />
            <button
              onClick={handleSave}
              className="mt-3 px-5 py-2 bg-pp-accent text-pp-bg-dark rounded-xl text-sm font-semibold
                hover:opacity-90 active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-white/90 text-sm leading-relaxed">{summary}</p>
        )}
      </div>

      {/* Action buttons */}
      {!isLoading && !editing && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-pp-accent text-pp-bg-dark font-semibold text-sm
              hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <span>{'\u{1F48C}'}</span>
            Share with Partner
          </button>

          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-transparent border border-pp-accent/40 text-pp-accent font-semibold text-sm
              hover:bg-pp-accent/5 active:scale-[0.98] transition-all duration-200"
          >
            <span>{'\u270F\uFE0F'}</span>
            Edit Message
          </button>

          <button
            onClick={onKeepPrivate}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-transparent text-pp-text-muted text-sm font-medium
              hover:text-white transition-colors"
          >
            <span>{'\u{1F512}'}</span>
            Keep Private
          </button>
        </div>
      )}
    </div>
  );
}
