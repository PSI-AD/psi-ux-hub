import React, { useState } from 'react';
import { Code2, Copy, Check, Info, Layout, Braces, Mic, Sparkles, RefreshCw, AlertTriangle, Lightbulb, ClipboardCheck } from 'lucide-react';
import { SectionFix } from '../../types/index';
import { processVoiceInput, refineCodeWithVoice } from '../../services/geminiService';

interface CodeInspectorProps {
  fix: SectionFix;
  onRefine?: (newFix: SectionFix) => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ fix, onRefine }) => {
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fix.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVoiceRefinement = async () => {
    try {
      setIsListening(true);
      const transcript = await processVoiceInput();
      setIsListening(false);
      
      setIsRefining(true);
      const refinedFix = await refineCodeWithVoice(fix.code, transcript);
      if (onRefine) onRefine(refinedFix);
      setIsRefining(false);
    } catch (err) {
      console.error("Refinement failed:", err);
      setIsListening(false);
      setIsRefining(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b] border border-[#C5A059]/30 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-right duration-500">
      {/* Inspector Header */}
      <div className="px-6 py-5 bg-[#0d1117] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
            <Braces size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em] mb-0.5">Refinement Engine</h4>
            <p className="text-xs font-bold text-white tracking-tight">{fix.sectionType}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Voice Refinement Trigger */}
          <button 
            onClick={handleVoiceRefinement}
            disabled={isRefining}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
              isListening 
                ? 'bg-rose-600 animate-pulse text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-[#C5A059] border border-slate-700'
            }`}
            title="Voice Refine Code"
          >
            {isRefining ? <RefreshCw className="animate-spin" size={18}/> : <Mic size={18} />}
            {isListening && <span className="text-[10px] font-black uppercase pr-1">Listening...</span>}
          </button>

          <button 
            onClick={handleCopy}
            className={`p-2.5 rounded-xl transition-all ${
              copied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
            title="Copy Code"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative">
        {/* Refining Overlay */}
        {isRefining && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 rounded-[2.5rem]">
            <div className="relative">
              <RefreshCw className="animate-spin text-[#C5A059]" size={40} />
              <Sparkles className="absolute -top-2 -right-2 text-[#C5A059] animate-bounce" size={16} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">AI Recalculating Logic...</p>
          </div>
        )}

        {/* Section 1: Scan Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Layout size={14} className="text-slate-500" />
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Current Logic</h5>
          </div>
          <div className="px-2">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
              Analyzing production code for {fix.sectionType || 'Unknown Section'}... Internal DOM structure identified.
            </p>
          </div>
        </div>

        {/* Section 2: Diagnostic Report */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ClipboardCheck size={14} className="text-[#C5A059]" />
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Diagnostic Report</h5>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Issue Card */}
            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl hover:bg-rose-500/10 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-rose-500" />
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Observed Issue</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {fix.issue}
              </p>
            </div>

            {/* Solution Card */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/10 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Architectural Solution</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                {fix.solution}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Code Block */}
        <div className="relative group pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <Code2 size={12} className="text-[#C5A059]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Remediated Source</span>
            </div>
            <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">v4.0.0 Stable</div>
          </div>
          <pre className="p-6 bg-[#050505] border border-slate-800 rounded-3xl overflow-x-auto text-[11px] leading-relaxed font-mono custom-scrollbar">
            <code className="text-emerald-400 whitespace-pre">
              {fix.code.split(/(\/\/.*$|export|const|return|className=)/m).map((part, i) => {
                if (part.startsWith('//')) return <span key={i} className="text-slate-600 italic">{part}</span>;
                if (['export', 'const', 'return'].includes(part)) return <span key={i} className="text-[#C5A059] font-bold">{part}</span>;
                if (part.startsWith('className=')) return <span key={i} className="text-sky-400">{part}</span>;
                return <span key={i} className="text-slate-300">{part}</span>;
              })}
            </code>
          </pre>
        </div>
      </div>

      <div className="p-5 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Neural Link Stable</span>
        </div>
        <button onClick={handleVoiceRefinement} className="text-[8px] font-bold text-[#C5A059] hover:underline uppercase tracking-widest">Trigger Refinement Mic</button>
      </div>
    </div>
  );
};