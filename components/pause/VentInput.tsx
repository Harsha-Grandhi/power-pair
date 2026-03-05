'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface VentInputProps {
  emotion: string;
  onSubmit: (text: string) => void;
}

type Tab = 'write' | 'voice';

const MAX_VOICE_SECONDS = 90;

export default function VentInput({ emotion, onSubmit }: VentInputProps) {
  const [tab, setTab] = useState<Tab>('write');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(MAX_VOICE_SECONDS);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = (window as unknown as Record<string, unknown>).SpeechRecognition
        || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
      if (!SR) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition
      || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new (SR as new () => SpeechRecognitionInstance)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < Object.keys(event.results).length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recognition.onerror = () => {
      stopRecording();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setVoiceTimer(MAX_VOICE_SECONDS);

    timerRef.current = setInterval(() => {
      setVoiceTimer((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const voiceMinutes = Math.floor(voiceTimer / 60);
  const voiceSeconds = voiceTimer % 60;

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="inline-flex items-center gap-1.5 bg-pp-card border border-white/10 rounded-full px-3 py-1 mb-6">
        <span className="text-sm text-pp-text-muted">Feeling</span>
        <span className="text-sm text-pp-accent font-medium">{emotion}</span>
      </div>

      <h2 className="font-display text-2xl text-white mb-6 text-center">
        Let it out
      </h2>

      {/* Tabs */}
      <div className="flex bg-pp-card rounded-xl p-1 mb-6 w-full max-w-sm">
        <button
          onClick={() => setTab('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${tab === 'write' ? 'bg-pp-accent text-pp-bg-dark' : 'text-pp-text-muted hover:text-white'}`}
        >
          Write
        </button>
        <button
          onClick={() => setTab('voice')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${tab === 'voice' ? 'bg-pp-accent text-pp-bg-dark' : 'text-pp-text-muted hover:text-white'}`}
        >
          Voice
        </button>
      </div>

      <div className="w-full max-w-sm">
        {tab === 'write' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write what you're feeling..."
            rows={6}
            className="w-full bg-pp-card border border-white/10 rounded-xl p-4 text-white
              placeholder:text-pp-text-muted text-sm resize-none focus:outline-none
              focus:border-pp-accent/40 transition-colors min-h-[120px]"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            {!speechSupported ? (
              <p className="text-pp-text-muted text-sm text-center py-8">
                Voice input not supported in this browser
              </p>
            ) : (
              <>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isRecording
                        ? 'bg-red-500/20 border-2 border-red-400 animate-pulse'
                        : 'bg-pp-card border-2 border-pp-accent/40 hover:border-pp-accent/70'
                    }`}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isRecording ? '#f87171' : '#F6B17A'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>

                <p className="text-pp-text-muted text-sm">
                  {isRecording ? 'Tap to stop' : 'Tap to speak'}
                </p>

                {isRecording && (
                  <span className="text-pp-accent text-sm tabular-nums">
                    {voiceMinutes}:{voiceSeconds.toString().padStart(2, '0')}
                  </span>
                )}

                {text && (
                  <div className="w-full bg-pp-card border border-white/10 rounded-xl p-3 mt-2">
                    <p className="text-white text-sm">{text}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => onSubmit(text)}
        disabled={!text.trim()}
        className={`
          mt-8 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
          ${
            text.trim()
              ? 'bg-pp-accent text-pp-bg-dark hover:opacity-90 active:scale-95'
              : 'bg-pp-card text-pp-text-muted cursor-not-allowed'
          }
        `}
      >
        Process my feelings
      </button>
    </div>
  );
}
