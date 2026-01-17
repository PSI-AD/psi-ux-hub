import React, { useEffect, useState } from 'react';
import { X, Copy, Terminal, Braces, Check, Download, ExternalLink, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { generateFixVisualization } from '../../services/geminiService';

interface CardDetailProps {
  code: string;
  title: string;
  onClose: () => void;
  previewImage?: string;
  pageName?: string;
}

export const CardDetail: React.FC<CardDetailProps> = ({ code, title, onClose, previewImage: initialPreview, pageName }) => {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Trigger Prism highlighting
    // @ts-ignore
    if (window.Prism) {
      // @ts-ignore
      window.Prism.highlightAll();
    }
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePreview = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const img = await generateFixVisualization(code, pageName || 'Luxury Site');
      if (img) setPreview(img);
    } catch (err) {
      console.error("Preview generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Slide-over Content */}
      <div className="relative w-full max-w-3xl bg-[#050505] border-l border-slate-800 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col h-full animate-in slide-in-from-right duration-500 ease-out">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#050505] z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#C5A059]/10 rounded-xl border border-[#C5A059]/20 text-[#C5A059]">
              <Braces size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase">Status: Production Ready</span>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">React + Tailwind v4</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-900 rounded-full text-slate-500 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            
            {/* Visual Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ImageIcon size={14} className="text-psi-gold" />
                  Visual Representation
                </h4>
                <button 
                  onClick={handleGeneratePreview}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-psi-gold hover:text-white transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {preview ? 'Regenerate Preview' : 'Generate Preview'}
                </button>
              </div>

              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" alt="Fix Visualization" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest italic opacity-70">
                        AI-Generated Architectural Intent
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-700">
                    {isGenerating ? (
                      <>
                        <RefreshCw size={32} className="animate-spin text-psi-gold/40" />
                        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Synthesizing Imagery...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="opacity-20" />
                        <button 
                          onClick={handleGeneratePreview}
                          className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-psi-gold hover:border-psi-gold/50 transition-all"
                        >
                          Unlock Visualization
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Architecture</p>
                <p className="text-xs text-white font-bold">Standard UI Hook</p>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Accessibility</p>
                <p className="text-xs text-white font-bold">WCAG 2.1 Compliant</p>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
              <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-[#C5A059]" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Component_Fix.tsx</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                    copied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              <div className="p-6 overflow-x-auto">
                <pre className="text-[12px] font-mono leading-relaxed selection:bg-[#C5A059]/20">
                  <code className="language-tsx line-numbers">
                    {code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-800 bg-[#0a0a0b]">
           <div className="flex gap-4">
             <button className="flex-1 py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2">
               <Download size={14} /> Download Module
             </button>
             <button className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
               <ExternalLink size={14} /> Open in Sandbox
             </button>
           </div>
           <p className="text-center text-[8px] font-bold text-slate-700 uppercase mt-6 tracking-[0.2em]">Property Shop Investment Architectural Control</p>
        </div>
      </div>
    </div>
  );
};