import React, { useState } from 'react';
import { RedesignBlock } from '../../types/index';
import { Code2, Copy, CheckCircle2, Download, Terminal, ChevronRight, Cpu } from 'lucide-react';

interface DevHandoffProps {
  block: RedesignBlock;
  onClose: () => void;
}

export const DevHandoff: React.FC<DevHandoffProps> = ({ block, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#050505] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        <header className="p-8 border-b border-white/10 flex items-center justify-between bg-[#0a0a0b]">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-psi-gold/10 rounded-2xl flex items-center justify-center text-psi-gold border border-psi-gold/20">
                 <Code2 size={24} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{block.title} <span className="text-psi-gold/50 ml-2">v1.0.0</span></h3>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Production-Ready Architecture • Optimized for psinv.net</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={handleCopy}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${copied ? 'bg-emerald-500 text-obsidian' : 'bg-psi-gold text-obsidian shadow-lg hover:scale-105'}`}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard' : 'Copy React Component'}
              </button>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <ChevronRight size={32} />
              </button>
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 p-8 border-r border-white/5 space-y-8 overflow-y-auto custom-scrollbar">
             <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-psi-gold flex items-center gap-2">
                   <Cpu size={14} /> Module Metadata
                </h4>
                <div className="space-y-2">
                   {[
                     { label: 'Type', val: block.type },
                     { label: 'Framework', val: 'React 19 + Tailwind v4' },
                     { label: 'Theme', val: 'Luxury Obsidian' },
                     { label: 'Audit Compliance', val: 'WCAG 2.1 AAA' }
                   ].map(meta => (
                     <div key={meta.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{meta.label}</span>
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">{meta.val}</span>
                     </div>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-psi-gold flex items-center gap-2">
                   <Terminal size={14} /> Optimization Rationale
                </h4>
                <div className="p-5 bg-psi-gold/5 border border-psi-gold/20 rounded-2xl italic text-[11px] text-slate-300 leading-relaxed">
                   "This module implements high-contrast obsidian textures and calibrated spacing to eliminate conversion friction identified in the primary audit."
                </div>
             </section>
          </div>

          <div className="flex-1 bg-black p-8 overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-slate-500">component_implementation.tsx</span>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500" />
                   <div className="w-2 h-2 rounded-full bg-amber-500" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
             </div>
             <pre className="flex-1 bg-[#0a0a0b] p-8 rounded-3xl overflow-auto custom-scrollbar border border-white/5 font-mono text-xs leading-relaxed text-emerald-400">
                <code>{block.code}</code>
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
