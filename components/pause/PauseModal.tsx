'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EmotionSelect from './EmotionSelect';
import ModeSelect from './ModeSelect';
import BreathingExercise from './BreathingExercise';
import PostResetCheck from './PostResetCheck';
import VentInput from './VentInput';
import AISummary from './AISummary';
import { saveReflection, shareWithPartner } from '@/lib/reflections';

interface PauseModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  coupleId: string | null;
}

type Step = 'emotion' | 'mode' | 'breathing' | 'post-reset' | 'vent' | 'processing' | 'summary';

function getPrevStep(current: Step, selectedMode: 'reset' | 'vent' | null): Step | null {
  switch (current) {
    case 'emotion':
      return null;
    case 'mode':
      return 'emotion';
    case 'breathing':
      return 'mode';
    case 'post-reset':
      return 'breathing';
    case 'vent':
      return 'mode';
    case 'summary':
      return selectedMode === 'reset' ? 'post-reset' : 'vent';
    default:
      return null;
  }
}

export default function PauseModal({ open, onClose, userId, coupleId }: PauseModalProps) {
  const [step, setStep] = useState<Step>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedMode, setSelectedMode] = useState<'reset' | 'vent' | null>(null);
  const [rawText, setRawText] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [postResetFeeling, setPostResetFeeling] = useState('');

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep('emotion');
      setSelectedEmotion('');
      setSelectedMode(null);
      setRawText('');
      setAiSummary('');
      setIsProcessing(false);
      setPostResetFeeling('');
    }
  }, [open]);

  const summarize = useCallback(async (emotion: string, text: string) => {
    setStep('processing');
    setIsProcessing(true);
    try {
      const res = await fetch('/api/summarize-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion, rawText: text }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
    } catch {
      setAiSummary(
        `You felt ${emotion.toLowerCase()} and needed a moment to process your emotions.`
      );
    }
    setIsProcessing(false);
    setStep('summary');
  }, []);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setStep('mode');
  };

  const handleModeSelect = (mode: 'reset' | 'vent') => {
    setSelectedMode(mode);
    setStep(mode === 'reset' ? 'breathing' : 'vent');
  };

  const handleBreathingComplete = () => {
    setStep('post-reset');
  };

  const handlePostResetSubmit = (feeling: string, reflection: string) => {
    setPostResetFeeling(feeling);
    const text = reflection || `After a breathing exercise, I felt ${feeling.toLowerCase()}.`;
    setRawText(text);
    summarize(selectedEmotion, text);
  };

  const handleVentSubmit = (text: string) => {
    setRawText(text);
    summarize(selectedEmotion, text);
  };

  const handleShare = async () => {
    const mode = selectedMode ?? 'vent';
    const reflectionId = await saveReflection({
      user_id: userId,
      couple_id: coupleId ?? '',
      emotion: selectedEmotion,
      mode,
      raw_text: rawText,
      ai_summary: aiSummary,
      shared_with_partner: true,
      ...(mode === 'reset' && postResetFeeling ? { post_reset_feeling: postResetFeeling } : {}),
    });
    if (reflectionId && coupleId) {
      await shareWithPartner(reflectionId, coupleId, userId, aiSummary, selectedEmotion);
    }
    onClose();
  };

  const handleEdit = (edited: string) => {
    setAiSummary(edited);
  };

  const handleKeepPrivate = async () => {
    const mode = selectedMode ?? 'vent';
    await saveReflection({
      user_id: userId,
      couple_id: coupleId ?? '',
      emotion: selectedEmotion,
      mode,
      raw_text: rawText,
      ai_summary: aiSummary,
      shared_with_partner: false,
      ...(mode === 'reset' && postResetFeeling ? { post_reset_feeling: postResetFeeling } : {}),
    });
    onClose();
  };

  const handleBack = () => {
    const prev = getPrevStep(step, selectedMode);
    if (prev) setStep(prev);
  };

  if (!open) return null;

  const showBack = step !== 'emotion' && step !== 'processing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full h-full bg-pp-bg-dark overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-pp-bg-dark/95 backdrop-blur-sm">
          {showBack ? (
            <button
              onClick={handleBack}
              className="text-pp-text-muted hover:text-white transition-colors p-1"
              aria-label="Go back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : (
            <div className="w-8" />
          )}

          <button
            onClick={onClose}
            className="text-pp-text-muted hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        <div className="pb-8">
          {step === 'emotion' && (
            <EmotionSelect onSelect={handleEmotionSelect} />
          )}

          {step === 'mode' && (
            <ModeSelect emotion={selectedEmotion} onSelect={handleModeSelect} />
          )}

          {step === 'breathing' && (
            <BreathingExercise onComplete={handleBreathingComplete} />
          )}

          {step === 'post-reset' && (
            <PostResetCheck onSubmit={handlePostResetSubmit} />
          )}

          {step === 'vent' && (
            <VentInput emotion={selectedEmotion} onSubmit={handleVentSubmit} />
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <div className="w-12 h-12 border-2 border-pp-accent/30 border-t-pp-accent rounded-full animate-spin" />
              <p className="text-pp-text-muted text-sm">Processing your feelings...</p>
            </div>
          )}

          {step === 'summary' && (
            <AISummary
              emotion={selectedEmotion}
              summary={aiSummary}
              isLoading={isProcessing}
              onShare={handleShare}
              onEdit={handleEdit}
              onKeepPrivate={handleKeepPrivate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
