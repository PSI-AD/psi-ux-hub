
import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  filename?: string;
  onOpenSandbox?: () => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  filename = "PSI_Optimized_Section.tsx",
  onOpenSandbox
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-slate-800 bg-[#0d1117] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Code Header */}
      <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-2 text-slate-400">
            <FileCode size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSandbox && (
            <button 
              onClick={onOpenSandbox}
              className="px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95"
            >
              Sandbox
            </button>
          )}
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 ${
              copied 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy Source'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 font-mono text-[13px] leading-relaxed relative group">
        <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <Terminal size={100} className="text-slate-400" />
        </div>
        
        <pre className="text-blue-300">
          <code className="block whitespace-pre">
            {code.split(/(\/\/.*$|import.*from|const|export|return|className=)/m).map((part, i) => {
              if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
              if (['const', 'export', 'return', 'import', 'from'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
              if (part.startsWith('className=')) return <span key={i} className="text-amber-200">{part}</span>;
              return <span key={i}>{part}</span>;
            })}
          </code>
        </pre>
      </div>
      
      {/* Footer Info */}
      <div className="px-5 py-2 bg-slate-900/30 border-t border-slate-800/50 flex items-center justify-between">
        <span className="text-[9px] text-slate-600 font-bold uppercase">React 18 + Tailwind CSS 3.0 Compatible</span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Ready for Deployment</span>
        </div>
      </div>
    </div>
  );
};
