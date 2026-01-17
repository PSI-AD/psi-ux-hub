
import React, { useState, useEffect, useCallback } from 'react';
import { LivePreview } from './LivePreview';
import { Terminal, Braces, Play, RefreshCcw, Save, Layout, ChevronRight, Copy, CheckCircle2 } from 'lucide-react';

interface SandboxProps {
  initialCode: string;
}

export const Sandbox: React.FC<SandboxProps> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [debouncedCode, setDebouncedCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  // Debounce code updates to avoid excessive re-renders of the live preview
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 800);
    return () => clearTimeout(timer);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset code to original audit results?")) {
      setCode(initialCode);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] animate-fade-in overflow-hidden">
      {/* Sandbox Header */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-psi-gold/10 rounded-lg text-psi-gold border border-psi-gold/20">
              <Layout size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Interactive Sandbox</span>
          </div>
          <div className="h-4 w-px bg-slate-800 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Real-time sync</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-white transition-colors"
            title="Reset to Original"
          >
            <RefreshCcw size={14} />
          </button>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
              copied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className="w-1/2 flex flex-col border-r border-slate-800 bg-[#0d1117]">
          <div className="px-4 py-2 bg-slate-900/30 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Braces size={12} className="text-psi-gold" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Source_Engine.tsx</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden group">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-6 bg-transparent text-slate-300 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-psi-gold/20"
              spellCheck={false}
              placeholder="// Enter component code here..."
            />
          </div>
        </div>

        {/* Preview Side */}
        <div className="w-1/2 flex flex-col bg-slate-950">
           <LivePreview code={debouncedCode} />
        </div>
      </div>

      {/* Sandbox Footer */}
      <div className="px-6 py-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Terminal size={10} className="text-emerald-500" /> V8 Runtime Active</span>
          <span className="flex items-center gap-1 border-l border-slate-800 pl-4">Hot-Reload: 800ms throttle</span>
        </div>
        <div className="psi-gold opacity-50 flex items-center gap-1">
          Property Shop Investment <ChevronRight size={8} /> Internal
        </div>
      </div>
    </div>
  );
};
