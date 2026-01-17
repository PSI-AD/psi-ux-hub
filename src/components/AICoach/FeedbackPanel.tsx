import React, { useState } from 'react';
import { Send, Sparkles, X, MessageSquare, Wand2 } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { ImageUpload } from './ImageUpload';
import { RedesignBlock, Annotation } from '../../types/index';

interface FeedbackPanelProps {
  block: RedesignBlock;
  onClose: () => void;
  onSubmit: (data: { text: string; image?: string; voiceTranscript?: string }) => void;
  isRegenerating: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ block, onClose, onSubmit, isRegenerating }) => {
  const [text, setText] = useState("");
  const [refImage, setRefImage] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!text && !refImage && !voiceTranscript) return;
    onSubmit({ text, image: refImage || undefined, voiceTranscript: voiceTranscript || undefined });
    setText("");
    setRefImage(null);
    setVoiceTranscript(null);
  };

  return (
    <div className="bg-[#0a0a0b] border border-white/10 p-8 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-psi-gold/10 border border-psi-gold/20 flex items-center justify-center text-psi-gold">
            <MessageSquare size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold">Section Directives</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Applying intelligence to {block.title}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-600 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-8">
        {/* Multi-Modal Sidebar */}
        <div className="flex flex-col gap-6 pt-1 border-r border-white/5 pr-8">
          <VoiceInput 
            onTranscription={(val) => setVoiceTranscript(val)} 
            isProcessing={isRegenerating} 
          />
          <ImageUpload 
            onUpload={(val) => setRefImage(val)} 
            preview={refImage} 
            onClear={() => setRefImage(null)} 
          />
        </div>

        {/* Text Area & Submit */}
        <div className="flex-1 space-y-4">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter design refinements (e.g. 'Add more white space between listings', 'Darken the background overlay')..."
              className="w-full bg-obsidian border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-psi-gold/50 outline-none transition-all min-h-[140px] placeholder:text-slate-700 selection:bg-psi-gold/20"
              disabled={isRegenerating}
            />
            
            {voiceTranscript && (
              <div className="absolute bottom-4 left-6 right-6 flex items-start gap-3 p-3 bg-psi-gold/5 border border-psi-gold/20 rounded-xl animate-in fade-in duration-300">
                <Sparkles size={12} className="text-psi-gold shrink-0 mt-1" />
                <p className="text-[11px] text-psi-gold/80 italic leading-relaxed">"{voiceTranscript}"</p>
                <button onClick={() => setVoiceTranscript(null)} className="ml-auto text-psi-gold/40 hover:text-psi-gold"><X size={10}/></button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
             <button 
              onClick={handleSubmit}
              disabled={isRegenerating || (!text && !refImage && !voiceTranscript)}
              className="px-10 py-4 bg-psi-gold text-obsidian rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
              {isRegenerating ? (
                <>
                  <Wand2 size={16} className="animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  Regenerate Section <Send size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};