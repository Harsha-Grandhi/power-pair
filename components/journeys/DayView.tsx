'use client';

import React, { useState, useCallback } from 'react';
import { JourneyDay, DayTask, getCheckboxLabelsForDay } from '@/lib/journeys';
import { DayProgress } from '@/lib/journeyProgress';

interface DayViewProps {
  day: JourneyDay;
  progress: DayProgress | null;
  isPartner2: boolean;
  partnerName: string;
  myName: string;
  onSoloSubmit: (responses: string[]) => Promise<void>;
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

// Parse a stored solo response (may be JSON array or legacy plain string)
function parseSoloResponses(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
    return [String(raw)];
  } catch {
    return [String(raw)];
  }
}

// ─── Solo Prompt Task Component ─────────────────────────────────────────────

function SoloPromptTask({
  task,
  myResponses,
  partnerResponses,
  partnerName,
  soloTexts,
  onTextChange,
  onSubmitPrompt,
}: {
  task: DayTask;
  myResponses: string[];
  partnerResponses: string[];
  partnerName: string;
  soloTexts: string[];
  onTextChange: (idx: number, value: string) => void;
  onSubmitPrompt: (idx: number) => Promise<void>;
}) {
  const prompts = task.prompts ?? [];
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});

  const handleSubmit = async (pIdx: number) => {
    setSubmitting((s) => ({ ...s, [pIdx]: true }));
    await onSubmitPrompt(pIdx);
    setSubmitting((s) => ({ ...s, [pIdx]: false }));
  };

  // All prompts submitted by both
  const allMyDone = prompts.length > 0
    ? prompts.every((_, i) => !!myResponses[i]?.trim())
    : !!myResponses[0]?.trim();
  const allPartnerDone = prompts.length > 0
    ? prompts.every((_, i) => !!partnerResponses[i]?.trim())
    : !!partnerResponses[0]?.trim();
  const allBothDone = allMyDone && allPartnerDone;

  const renderPrompt = (prompt: string, pIdx: number) => {
    const myAnswer = myResponses[pIdx]?.trim();
    const partnerAnswer = partnerResponses[pIdx]?.trim();
    const bothThisPrompt = !!myAnswer && !!partnerAnswer;

    return (
      <div key={pIdx} className="space-y-2">
        {/* Prompt text */}
        <div className="rounded-xl bg-pp-secondary/10 border border-pp-secondary/15 px-3 py-2">
          <p className="text-sm text-white/80 leading-relaxed italic">{prompt}</p>
        </div>

        {/* My answer — textarea or submitted */}
        {myAnswer ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-emerald-400 text-xs">✓</span>
              <p className="text-xs text-emerald-400 font-medium">Your answer</p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{myAnswer}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={soloTexts[pIdx] ?? ''}
              onChange={(e) => onTextChange(pIdx, e.target.value)}
              placeholder="Write your private reflection here…"
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/12 px-3 py-2.5
                text-sm text-white placeholder:text-white/30 resize-none
                focus:outline-none focus:border-pp-accent/50 focus:bg-white/8
                transition-colors leading-relaxed"
            />
            <button
              onClick={() => handleSubmit(pIdx)}
              disabled={!soloTexts[pIdx]?.trim() || submitting[pIdx]}
              className="w-full py-2 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold
                text-sm hover:bg-pp-accent/90 transition-all active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting[pIdx] ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        )}

        {/* Partner answer — per prompt, shown once both submit this prompt */}
        {myAnswer && (
          <div className={`rounded-xl border p-3 ${bothThisPrompt ? 'border-white/8 bg-white/2' : 'border-white/6 bg-white/1'}`}>
            <p className="text-xs text-pp-text-muted font-medium mb-1">
              {partnerName ? `${partnerName}'s answer` : "Partner's answer"}
            </p>
            {bothThisPrompt ? (
              <p className="text-sm text-white/70 leading-relaxed">{partnerAnswer}</p>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-pp-secondary/40 border-t-transparent animate-spin flex-shrink-0" />
                <p className="text-xs text-pp-text-muted">Waiting for {partnerName || 'partner'}…</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <TaskIcon type="solo_prompt" />
          <span className="text-[10px] text-pp-text-muted uppercase tracking-widest">
            {taskTypeLabel('solo_prompt')}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-white mt-1">{task.title}</h4>
      </div>

      <div className="px-4 py-3 space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">{task.instructions}</p>

        {prompts.length > 0
          ? prompts.map((prompt, pIdx) => renderPrompt(prompt, pIdx))
          : renderPrompt('', 0)
        }

        {/* Combined insights — shown after all prompts submitted by both */}
        {allBothDone && (
          <div className="rounded-xl border border-pp-accent/20 bg-pp-accent/6 p-3 space-y-1.5">
            <p className="text-[10px] text-pp-accent uppercase tracking-widest font-medium">
              Combined Insights
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              You've both shared your reflections across all {prompts.length || 1} prompt{(prompts.length || 1) !== 1 ? 's' : ''}.
              As you read each other's answers, look for what resonates, what surprises you, and
              where your perspectives differ — these are the threads to explore in your conversation today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main DayView ────────────────────────────────────────────────────────────

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

  // Parse stored solo responses (JSON arrays)
  const myParsedResponses = parseSoloResponses(
    isPartner2 ? (progress?.partner2_solo_response ?? null) : (progress?.partner1_solo_response ?? null)
  );
  const partnerParsedResponses = parseSoloResponses(
    isPartner2 ? (progress?.partner1_solo_response ?? null) : (progress?.partner2_solo_response ?? null)
  );

  const soloTasks = day.tasks.filter((t) => t.type === 'solo_prompt');
  const hasSoloPrompt = soloTasks.length > 0;

  // Total number of prompts across all solo tasks (for state sizing)
  const allPrompts = soloTasks.flatMap((t) => t.prompts ?? (t.prompts === undefined ? [''] : []));
  const totalPrompts = Math.max(allPrompts.length, soloTasks.length > 0 ? 1 : 0);

  const mySubmitted = myParsedResponses.length > 0 && myParsedResponses.every((r) => r.trim());

  // Local state
  const [soloTexts, setSoloTexts] = useState<string[]>(() => Array(totalPrompts).fill(''));
  const [notes, setNotes] = useState(progress?.conversation_notes ?? '');

  // Build normalized checkboxes
  const normalizedMyCheckboxes = [...myCheckboxes];
  while (normalizedMyCheckboxes.length < totalCheckboxes) normalizedMyCheckboxes.push(false);

  const handleTextChange = useCallback((idx: number, value: string) => {
    setSoloTexts((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  // Per-prompt submit: merge this prompt's answer into the full responses array and save
  const handleSubmitPrompt = useCallback(async (globalIdx: number) => {
    const merged = Array(totalPrompts).fill('').map((_, i) =>
      i === globalIdx ? soloTexts[globalIdx]?.trim() ?? '' : (myParsedResponses[i] ?? '')
    );
    await onSoloSubmit(merged);
  }, [soloTexts, myParsedResponses, totalPrompts, onSoloSubmit]);

  const handleCheckbox = useCallback(async (idx: number) => {
    if (progress?.day_completed) return;
    const label = checkboxLabels[idx] ?? '';
    const partnerSubmitted = partnerParsedResponses.length > 0 && partnerParsedResponses.every((r) => r.trim());
    const bothSubmitted = mySubmitted && partnerSubmitted;
    if (label.includes('partner') && !bothSubmitted) return;
    if (idx === 0 && hasSoloPrompt && !mySubmitted) return;

    const updated = [...normalizedMyCheckboxes];
    updated[idx] = !updated[idx];
    await onCheckboxChange(updated);
  }, [normalizedMyCheckboxes, onCheckboxChange, checkboxLabels, hasSoloPrompt, mySubmitted, partnerParsedResponses, progress?.day_completed]);

  const myAllDone = normalizedMyCheckboxes.slice(0, totalCheckboxes).every(Boolean);
  const partnerAllDone = partnerCheckboxes.length >= totalCheckboxes &&
    partnerCheckboxes.slice(0, totalCheckboxes).every(Boolean);
  const bothDone = myAllDone && partnerAllDone;

  const partnerSubmitted = partnerParsedResponses.length > 0 && partnerParsedResponses.every((r) => r.trim());
  const bothSubmitted = mySubmitted && partnerSubmitted;

  if (progress?.day_completed) {
    return <CompletedDayView day={day} progress={progress} partnerName={partnerName} myName={myName} isPartner2={isPartner2} />;
  }

  // Track prompt offset per solo task (in case there are multiple solo tasks)
  let promptOffset = 0;

  return (
    <div className="space-y-4">
      {/* Tasks */}
      {day.tasks.map((task, taskIdx) => {
        if (task.type === 'solo_prompt') {
          const taskPromptCount = Math.max((task.prompts ?? []).length, 1);
          const taskSoloTexts = soloTexts.slice(promptOffset, promptOffset + taskPromptCount);
          const taskMyResponses = myParsedResponses.slice(promptOffset, promptOffset + taskPromptCount);
          const taskPartnerResponses = partnerParsedResponses.slice(promptOffset, promptOffset + taskPromptCount);
          promptOffset += taskPromptCount;

          const taskOffset = promptOffset - taskPromptCount;
          return (
            <SoloPromptTask
              key={taskIdx}
              task={task}
              myResponses={taskMyResponses}
              partnerResponses={taskPartnerResponses}
              partnerName={partnerName}
              soloTexts={taskSoloTexts}
              onTextChange={(localIdx, value) => handleTextChange(taskOffset + localIdx, value)}
              onSubmitPrompt={(localIdx) => handleSubmitPrompt(taskOffset + localIdx)}
            />
          );
        }

        return (
          <div
            key={taskIdx}
            className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 border-b border-white/6">
              <div className="flex items-center gap-2">
                <TaskIcon type={task.type} />
                <span className="text-[10px] text-pp-text-muted uppercase tracking-widest">
                  {taskTypeLabel(task.type)}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-1">{task.title}</h4>
            </div>
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
              (idx === 0 && hasSoloPrompt && !mySubmitted);

            return (
              <div key={idx} className="space-y-1">
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
  const myRaw = isPartner2 ? progress.partner2_solo_response : progress.partner1_solo_response;
  const partnerRaw = isPartner2 ? progress.partner1_solo_response : progress.partner2_solo_response;
  const myResponses = parseSoloResponses(myRaw);
  const partnerResponses = parseSoloResponses(partnerRaw);
  const hasSolo = day.tasks.some((t) => t.type === 'solo_prompt');
  const allPrompts = day.tasks.filter((t) => t.type === 'solo_prompt').flatMap((t) => t.prompts ?? []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 text-center space-y-1">
        <p className="text-2xl">✅</p>
        <p className="text-sm font-semibold text-emerald-300">Day {day.day} Complete</p>
        <p className="text-xs text-pp-text-muted">
          {progress.completed_at
            ? `Completed on ${new Date(progress.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
            : 'Great work together!'}
        </p>
      </div>

      {progress.daily_summary && (
        <div className="rounded-2xl border border-pp-accent/20 bg-pp-accent/6 p-4 space-y-2">
          <p className="text-[10px] text-pp-accent uppercase tracking-widest font-medium">Daily Learning</p>
          <p className="text-sm text-white/80 leading-relaxed">{progress.daily_summary}</p>
        </div>
      )}

      {hasSolo && myResponses.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-white/6">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Solo Reflections</p>
          </div>
          <div className="px-4 py-3 space-y-4">
            {allPrompts.map((prompt, pIdx) => (
              <div key={pIdx} className="space-y-2">
                <div className="rounded-xl bg-pp-secondary/10 border border-pp-secondary/15 px-3 py-2">
                  <p className="text-xs text-white/60 italic">{prompt}</p>
                </div>
                <div>
                  <p className="text-xs text-pp-text-muted mb-1">{myName || 'You'}</p>
                  <p className="text-sm text-white/70 leading-relaxed">{myResponses[pIdx] ?? '—'}</p>
                </div>
                {partnerResponses[pIdx] && (
                  <div className="border-t border-white/6 pt-2">
                    <p className="text-xs text-pp-text-muted mb-1">{partnerName || 'Partner'}</p>
                    <p className="text-sm text-white/70 leading-relaxed">{partnerResponses[pIdx]}</p>
                  </div>
                )}
              </div>
            ))}
            {/* Fallback for legacy single-response storage */}
            {allPrompts.length === 0 && myResponses[0] && (
              <div>
                <p className="text-xs text-pp-text-muted mb-1">{myName || 'You'}</p>
                <p className="text-sm text-white/70 leading-relaxed">{myResponses[0]}</p>
                {partnerResponses[0] && (
                  <div className="border-t border-white/6 pt-3 mt-3">
                    <p className="text-xs text-pp-text-muted mb-1">{partnerName || 'Partner'}</p>
                    <p className="text-sm text-white/70 leading-relaxed">{partnerResponses[0]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {progress.conversation_notes && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Notes</p>
          <p className="text-sm text-white/70 leading-relaxed">{progress.conversation_notes}</p>
        </div>
      )}
    </div>
  );
}
