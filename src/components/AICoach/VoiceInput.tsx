import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2 } from 'lucide-react';
import { processVoiceInput } from '../../services/geminiService';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setError(null);
      const text = await processVoiceInput();
      onTranscription(text);
      setIsRecording(false);
    } catch (err: any) {
      console.error("Voice capture failed:", err);
      setError(err === "Speech Recognition not supported." ? err : "Mic access failed.");
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={startRecording}
        disabled={isRecording || isProcessing}
        className={`relative p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center group ${isRecording
            ? 'bg-rose-500 text-white animate-pulse'
            : 'bg-surface border border-border hover:border-blue-500 text-slate-400 hover:text-blue-500'
          }`}
        title={isRecording ? "Listening..." : "Record Voice Note"}
      >
        {isRecording ? (
          <Square size={20} className="fill-current" />
        ) : isProcessing ? (
          <Loader2 size={20} className="animate-spin text-blue-500" />
        ) : (
          <Mic size={20} className="group-hover:scale-105 transition-transform" />
        )}
      </button>
      <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
        {isRecording ? 'Listening...' : 'Voice Note'}
      </span>
      {error && <span className="text-[9px] font-bold text-rose-500 uppercase">{error}</span>}
    </div>
  );
};