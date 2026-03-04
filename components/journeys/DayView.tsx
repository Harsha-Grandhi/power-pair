'use client';

import React, { useState, useCallback } from 'react';
import { JourneyDay, getCheckboxLabelsForDay } from '@/lib/journeys';
import { DayProgress } from '@/lib/journeyProgress';

interface DayViewProps {
  day: JourneyDay;
  progress: DayProgress | null;
  isPartner2: boolean;
  partnerName: string;
  myName: string;
  onSoloSubmit: (response: string) => Promise<void>;
  onCheckboxChange: (checkboxes: boolean[]) => Promise<void>;
  onNotesChange: (notes: string) => void;
  onNotesBlur: (notes: string) => void;
  onMarkComplete: () => Promise<void>;
  isCompleting: boolean;
}

function TaskIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    solo_prompt: '✍️',
    conversation: '💬',
    shared_exercise: '🤝',
    fun_task: '🎉',
    experiment: '🔬',
    ritual: '✨',
  };
  return <span>{icons[type] ?? '📌'}</span>;
}

function taskTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    solo_prompt: 'Solo Prompt',
    conversation: 'Conversation',
    shared_exercise: 'Shared Exercise',
    fun_task: 'Fun Task',
    experiment: 'Experiment',
    ritual: 'Ritual',
  };
  return labels[type] ?? 'Task';
}

export default function DayView({
  day,
  progress,
  isPartner2,
  partnerName,
  myName,
  onSoloSubmit,
  onCheckboxChange,
  onNotesChange,
  onNotesBlur,
  onMarkComplete,
  isCompleting,
}: DayViewProps) {
  const checkboxLabels = getCheckboxLabelsForDay(day);
  const totalCheckboxes = checkboxLabels.length;

  const myCheckboxes: boolean[] = isPartner2
    ? (progress?.partner2_checkboxes ?? [])
    : (progress?.partner1_checkboxes ?? []);

  const partnerCheckboxes: boolean[] = isPartner2
    ? (progress?.partner1_checkboxes ?? [])
    : (progress?.partner2_checkboxes ?? []);

  const mySoloResponse: string | null = isPartner2
    ? (progress?.partner2_solo_response ?? null)
    : (progress?.partner1_solo_response ?? null);

  const partnerSoloResponse: string | null = isPartner2
    ? (progress?.partner1_solo_response ?? null)
    : (progress?.partner2_solo_response ?? null);

  const bothSubmitted = !!mySoloResponse && !!partnerSoloResponse;
  const hasSoloPrompt = day.tasks.some((t) => t.type === 'solo_prompt');

  // Local state for text inputs
  const [soloText, setSoloText] = useState('');
  const [isSubmittingSolo, setIsSubmittingSolo] = useState(false);
  const [notes, setNotes] = useState(progress?.conversation_notes ?? '');

  // Build normalized checkboxes array
  const normalizedMyCheckboxes = [...myCheckboxes];
  while (normalizedMyCheckboxes.length < totalCheckboxes) {
    normalizedMyCheckboxes.push(false);
  }

  // Solo prompt checkbox index is always 0 (first checkbox for any day with solo_prompt)
  // "Read partner" is checkbox index 1 if solo_prompt exists
  // Other tasks start at index 2 (or 0 if no solo_prompt)

  let checkboxIndex = 0;

  const handleCheckbox = useCallback(async (idx: number) => {
    if (progress?.day_completed) return;

    // Prevent checking "read partner" before both submitted
    const label = checkboxLabels[idx] ?? '';
    if (label.includes('partner') && !bothSubmitted) return;

    // Prevent checking "wrote my reflection" checkbox directly — auto-managed
    if (idx === 0 && hasSoloPrompt && !mySoloResponse) return;

    const updated = [...normalizedMyCheckboxes];
    updated[idx] = !updated[idx];
    await onCheckboxChange(updated);
  }, [normalizedMyCheckboxes, onCheckboxChange, bothSubmitted, checkboxLabels, hasSoloPrompt, mySoloResponse, progress?.day_completed]);

  const handleSoloSubmit = useCallback(async () => {
    if (!soloText.trim() || isSubmittingSolo) return;
    setIsSubmittingSolo(true);
    await onSoloSubmit(soloText.trim());
    setIsSubmittingSolo(false);
  }, [soloText, isSubmittingSolo, onSoloSubmit]);

  // Check if all my checkboxes are done
  const myAllDone = normalizedMyCheckboxes.slice(0, totalCheckboxes).every(Boolean);
  const partnerAllDone = partnerCheckboxes.length >= totalCheckboxes &&
    partnerCheckboxes.slice(0, totalCheckboxes).every(Boolean);
  const bothDone = myAllDone && partnerAllDone;

  if (progress?.day_completed) {
    return <CompletedDayView day={day} progress={progress} partnerName={partnerName} myName={myName} isPartner2={isPartner2} />;
  }

  return (
    <div className="space-y-4">
      {/* Tasks */}
      {day.tasks.map((task, taskIdx) => {
        const isSolo = task.type === 'solo_prompt';

        return (
          <div
            key={taskIdx}
            className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
          >
            {/* Task header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/6">
              <div className="flex items-center gap-2">
                <TaskIcon type={task.type} />
                <span className="text-[10px] text-pp-text-muted uppercase tracking-widest">
                  {taskTypeLabel(task.type)}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-1">{task.title}</h4>
            </div>

            {/* Task body */}
            <div className="px-4 py-3 space-y-3">
              <p className="text-sm text-white/70 leading-relaxed">{task.instructions}</p>

              {task.prompts && task.prompts.length > 0 && (
                <div className="space-y-2">
                  {task.prompts.map((prompt, pIdx) => (
                    <div
                      key={pIdx}
                      className="rounded-xl bg-pp-secondary/10 border border-pp-secondary/15 px-3 py-2"
                    >
                      <p className="text-sm text-white/80 leading-relaxed italic">{prompt}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Solo prompt UI */}
              {isSolo && (
                <div className="space-y-3 pt-1">
                  {mySoloResponse ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-emerald-400 text-xs">✓</span>
                        <span className="text-xs text-emerald-400 font-medium">Your reflection submitted</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{mySoloResponse}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={soloText}
                        onChange={(e) => setSoloText(e.target.value)}
                        placeholder="Write your private reflection here…"
                        rows={4}
                        className="w-full rounded-xl bg-white/5 border border-white/12 px-3 py-2.5
                          text-sm text-white placeholder:text-white/30 resize-none
                          focus:outline-none focus:border-pp-accent/50 focus:bg-white/8
                          transition-colors leading-relaxed"
                      />
                      <button
                        onClick={handleSoloSubmit}
                        disabled={!soloText.trim() || isSubmittingSolo}
                        className="w-full py-2.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold
                          text-sm hover:bg-pp-accent/90 transition-all active:scale-[0.98]
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmittingSolo ? 'Submitting…' : 'Submit My Reflection'}
                      </button>
                    </div>
                  )}

                  {/* Partner response section */}
                  <div className="rounded-xl border border-white/8 bg-white/2 p-3">
                    <p className="text-xs text-pp-text-muted mb-2 font-medium">
                      {partnerName ? `${partnerName}'s reflection` : "Partner's reflection"}
                    </p>
                    {bothSubmitted ? (
                      <p className="text-sm text-white/70 leading-relaxed">{partnerSoloResponse}</p>
                    ) : mySoloResponse ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-pp-secondary/40 border-t-transparent animate-spin" />
                        <p className="text-sm text-pp-text-muted">Waiting for {partnerName || 'partner'} to share…</p>
                      </div>
                    ) : (
                      <p className="text-sm text-pp-text-muted">Submit your reflection first, then you can see {partnerName ? partnerName + "'s" : "your partner's"} response.</p>
                    )}
                  </div>

                  {/* Summary — shown after both submit */}
                  {bothSubmitted && (
                    <div className="rounded-xl border border-pp-accent/20 bg-pp-accent/6 p-3">
                      <p className="text-[10px] text-pp-accent uppercase tracking-widest mb-1.5 font-medium">
                        Reflection Summary
                      </p>
                      <p className="text-sm text-white/75 leading-relaxed">
                        Both of you have shared your reflections. As you read each other's responses, notice what resonates and what differs — these insights are the starting point for your conversation today.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Conversation Notes */}
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-white/6">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span className="text-[10px] text-pp-text-muted uppercase tracking-widest">Conversation Notes</span>
          </div>
          <h4 className="text-sm font-semibold text-white mt-1">Notes from Today</h4>
          <p className="text-xs text-pp-text-muted mt-0.5">Optional — jot down anything meaningful from your conversation.</p>
        </div>
        <div className="px-4 py-3">
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              onNotesChange(e.target.value);
            }}
            onBlur={() => onNotesBlur(notes)}
            placeholder="Add notes from your conversation…"
            rows={3}
            className="w-full rounded-xl bg-white/5 border border-white/12 px-3 py-2.5
              text-sm text-white placeholder:text-white/30 resize-none
              focus:outline-none focus:border-pp-accent/50 focus:bg-white/8
              transition-colors leading-relaxed"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-white/6">
          <h4 className="text-sm font-semibold text-white">Today's Checklist</h4>
          <p className="text-xs text-pp-text-muted mt-0.5">
            Both partners must check all boxes to complete this day.
          </p>
        </div>
        <div className="px-4 py-3 space-y-2">
          {checkboxLabels.map((label, idx) => {
            const myChecked = normalizedMyCheckboxes[idx] ?? false;
            const partnerChecked = partnerCheckboxes[idx] ?? false;
            const isReadPartner = label.includes('partner');
            const isDisabled = progress?.day_completed ||
              (isReadPartner && !bothSubmitted) ||
              (idx === 0 && hasSoloPrompt && !mySoloResponse);

            return (
              <div key={idx} className="space-y-1">
                {/* My checkbox */}
                <button
                  onClick={() => handleCheckbox(idx)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all
                    ${myChecked
                      ? 'bg-emerald-500/10 border-emerald-500/25'
                      : isDisabled
                        ? 'bg-white/2 border-white/5 opacity-50 cursor-not-allowed'
                        : 'bg-white/3 border-white/10 hover:border-white/20 active:scale-[0.98]'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${myChecked ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}
                  >
                    {myChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-sm text-left leading-snug ${myChecked ? 'text-emerald-300' : 'text-white/70'}`}>
                    {label}
                    {isReadPartner && !bothSubmitted && (
                      <span className="text-pp-text-muted text-xs ml-1">(waiting for partner)</span>
                    )}
                  </span>
                  <span className="ml-auto text-[10px] text-pp-text-muted flex-shrink-0">You</span>
                </button>

                {/* Partner's checkbox status */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-2 border
                  ${partnerChecked ? 'bg-pp-accent/6 border-pp-accent/15' : 'bg-white/2 border-white/6'}`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                    ${partnerChecked ? 'bg-pp-accent border-pp-accent' : 'border-white/20'}`}
                  >
                    {partnerChecked && <span className="text-pp-bg-dark text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-sm leading-snug ${partnerChecked ? 'text-pp-accent/80' : 'text-white/30'}`}>
                    {label}
                  </span>
                  <span className="ml-auto text-[10px] text-pp-text-muted flex-shrink-0">
                    {partnerName || 'Partner'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Day Button */}
      {bothDone && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 space-y-3">
          <div className="text-center space-y-1">
            <p className="text-lg">🎉</p>
            <p className="text-sm font-semibold text-emerald-300">Both of you have checked all boxes!</p>
            <p className="text-xs text-pp-text-muted">Mark this day as complete to unlock the next one.</p>
          </div>
          <button
            onClick={onMarkComplete}
            disabled={isCompleting}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm
              hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isCompleting ? 'Completing…' : '✓ Complete Day & Continue'}
          </button>
        </div>
      )}

      {!bothDone && (
        <div className="text-center py-2">
          <p className="text-xs text-pp-text-muted">
            {myAllDone
              ? `Waiting for ${partnerName || 'your partner'} to finish their checklist.`
              : 'Complete your checklist above to finish this day.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Completed Day View ────────────────────────────────────────────────────────

function CompletedDayView({
  day,
  progress,
  partnerName,
  myName,
  isPartner2,
}: {
  day: JourneyDay;
  progress: DayProgress;
  partnerName: string;
  myName: string;
  isPartner2: boolean;
}) {
  const mySoloResponse = isPartner2 ? progress.partner2_solo_response : progress.partner1_solo_response;
  const partnerSoloResponse = isPartner2 ? progress.partner1_solo_response : progress.partner2_solo_response;
  const hasSolo = day.tasks.some((t) => t.type === 'solo_prompt');

  return (
    <div className="space-y-4">
      {/* Completion banner */}
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 text-center space-y-1">
        <p className="text-2xl">✅</p>
        <p className="text-sm font-semibold text-emerald-300">Day {day.day} Complete</p>
        <p className="text-xs text-pp-text-muted">
          {progress.completed_at
            ? `Completed on ${new Date(progress.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
            : 'Great work together!'}
        </p>
      </div>

      {/* Daily summary */}
      {progress.daily_summary && (
        <div className="rounded-2xl border border-pp-accent/20 bg-pp-accent/6 p-4 space-y-2">
          <p className="text-[10px] text-pp-accent uppercase tracking-widest font-medium">Daily Learning</p>
          <p className="text-sm text-white/80 leading-relaxed">{progress.daily_summary}</p>
        </div>
      )}

      {/* Solo responses (read-only) */}
      {hasSolo && mySoloResponse && (
        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-white/6">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Solo Reflections</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div>
              <p className="text-xs text-pp-text-muted mb-1">{myName || 'You'}</p>
              <p className="text-sm text-white/70 leading-relaxed">{mySoloResponse}</p>
            </div>
            {partnerSoloResponse && (
              <div className="border-t border-white/6 pt-3">
                <p className="text-xs text-pp-text-muted mb-1">{partnerName || 'Partner'}</p>
                <p className="text-sm text-white/70 leading-relaxed">{partnerSoloResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversation notes (read-only) */}
      {progress.conversation_notes && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Notes</p>
          <p className="text-sm text-white/70 leading-relaxed">{progress.conversation_notes}</p>
        </div>
      )}
    </div>
  );
}
