
import React, { useEffect } from 'react';
import { Copy, CheckCircle2, Terminal, Cpu, Braces, Code2, ChevronRight, FlaskConical } from 'lucide-react';

interface CodeArchitectureProps {
  code: string;
  onCopy: () => void;
  copied: boolean;
  onOpenSandbox: () => void;
}

export const CodeArchitecture: React.FC<CodeArchitectureProps> = ({ code, onCopy, copied, onOpenSandbox }) => {
  useEffect(() => {
    // @ts-ignore
    if (window.Prism) {
      // @ts-ignore
      window.Prism.highlightAll();
    }
  }, [code]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-background border-l border-border">
      {/* Code Header Bar */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-500 border border-blue-500/20">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-primary)]">Production Architecture</span>
              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-[9px] font-bold rounded border border-blue-500/20">TSX</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wide mt-0.5 flex items-center gap-1">
              Optimized for psinv.net <ChevronRight size={10} /> v4.0.0
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all bg-surface border border-border text-[var(--text-primary)] hover:bg-secondary active:scale-95"
          >
            <FlaskConical size={12} />
            Try in Sandbox
          </button>
          <button
            onClick={onCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95 border ${copied
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                : 'bg-primary text-white border-primary hover:bg-primary-hover'
              }`}
          >
            {copied ? <CheckCircle2 size={12} className="animate-bounce" /> : <Copy size={12} />}
            {copied ? 'Success' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-auto custom-scrollbar relative group/code bg-background">
        {/* Background Decorative Braces */}
        <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none transition-opacity duration-1000">
          <Code2 size={240} className="text-[var(--text-primary)]" />
        </div>

        <div className="relative">
          <pre className="p-6 text-[13px] font-mono leading-relaxed selection:bg-blue-500/20 text-[var(--text-primary)]">
            <code className="language-tsx line-numbers">{code}</code>
          </pre>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-border bg-surface flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wide">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-default">
            <Terminal size={12} className="text-emerald-500" />
            <span>Compiled Successfully</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-default border-l border-border pl-4">
            <Braces size={12} className="text-blue-500" />
            <span>Tailwind CSS v4.0 Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Deployable Module</span>
        </div>
      </div>
    </div>
  );
};
