import React, { useRef, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Trash2, RefreshCw, Layout, Eye, Zap, Code2 } from 'lucide-react';
import { SectionFix } from '../../types/index';
import { CodeInspector } from './CodeInspector';

interface VerticalGalleryProps {
  legacyImg: string;
  aiImg: string | null;
  sectionFixes?: SectionFix[];
  onClear: () => void;
  onRefineSection?: (newFix: SectionFix) => void;
}

export const VerticalGallery: React.FC<VerticalGalleryProps> = ({ 
  legacyImg, 
  aiImg, 
  sectionFixes, 
  onClear,
  onRefineSection
}) => {
  const [zoom, setZoom] = useState(1);
  const [showInspector, setShowInspector] = useState(true);
  const legacyRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (e.currentTarget === legacyRef.current && aiRef.current) {
      aiRef.current.scrollTop = scrollTop;
      aiRef.current.scrollLeft = scrollLeft;
    } else if (e.currentTarget === aiRef.current && legacyRef.current) {
      legacyRef.current.scrollTop = scrollTop;
      legacyRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2.5));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto py-10 px-6 animate-in fade-in duration-700 flex flex-col gap-10">
      
      {/* Synchronized Inspection Controls */}
      <div className="sticky top-4 z-50 flex items-center justify-between bg-slate-950/90 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-inner">
            <button onClick={() => adjustZoom(0.1)} className="p-2.5 hover:text-[#C5A059] hover:bg-slate-800 rounded-xl transition-all"><ZoomIn size={18}/></button>
            <div className="w-px h-6 bg-slate-800 self-center mx-1" />
            <button onClick={() => adjustZoom(-0.1)} className="p-2.5 hover:text-[#C5A059] hover:bg-slate-800 rounded-xl transition-all"><ZoomOut size={18}/></button>
          </div>
          <div className="px-5 py-2.5 bg-[#C5A059]/10 rounded-2xl border border-[#C5A059]/20 flex items-center gap-3 shadow-inner">
            <span className="text-[11px] font-black text-[#C5A059] uppercase tracking-widest">{Math.round(zoom * 100)}% Scale</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-[11px] font-black tracking-[0.5em] uppercase text-white mb-1">Architectural Inspection</h2>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Real-time coordinate sync active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
              showInspector ? 'bg-[#C5A059] text-slate-950 border-[#C5A059]' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Code2 size={16} /> Code Inspector
          </button>
          <button onClick={onClear} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl border border-rose-500/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg">
            <Trash2 size={16}/> Clear System
          </button>
        </div>
      </div>

      {/* Split Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className={`${showInspector ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-12 transition-all duration-700 ease-in-out`}>
          
          {/* LEGACY PLANE */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-lg">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-[0.2em] mb-0.5">Legacy Viewport</h3>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight italic">Original production architecture</p>
                </div>
              </div>
            </div>
            
            <div 
              ref={legacyRef}
              onScroll={handleScroll}
              className="h-[600px] overflow-auto rounded-[3rem] border-4 border-slate-800 bg-[#0a0a0b] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group custom-scrollbar"
            >
              <div 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: zoom > 1 ? `${100 * zoom}%` : '100%' }}
                className="transition-transform duration-300 ease-out p-12"
              >
                <img src={legacyImg} className="w-full h-auto rounded-3xl opacity-40 grayscale shadow-2xl" alt="Legacy" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center py-4">
             <div className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.5)] animate-pulse" />
          </div>

          {/* AI SYNTHESIS PLANE */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shadow-lg">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-[0.2em] mb-0.5">Obsidian Synthesis</h3>
                  <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tight italic">AI-Refined High-Fidelity Mockup</p>
                </div>
              </div>
            </div>

            <div 
              ref={aiRef}
              onScroll={handleScroll}
              className="h-[700px] overflow-auto rounded-[3rem] border-4 border-[#C5A059]/30 bg-[#050505] shadow-[0_0_100px_rgba(197,160,89,0.15)] relative group custom-scrollbar"
            >
              <div 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: zoom > 1 ? `${100 * zoom}%` : '100%' }}
                className="transition-transform duration-300 ease-out p-12 min-h-full"
              >
                {aiImg ? (
                  <img src={aiImg} className="w-full h-auto rounded-3xl shadow-[0_60px_150px_rgba(0,0,0,1)] border border-slate-800" alt="Synthesis" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-950/80 backdrop-blur-md">
                    <RefreshCw className="animate-spin text-[#C5A059] mb-6" size={56} />
                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Rendering Architectural Revision...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Side Inspector */}
        {showInspector && (
          <aside className="lg:col-span-4 sticky top-32 self-start h-[calc(100vh-200px)] animate-in slide-in-from-right-8 duration-500">
            {sectionFixes && sectionFixes.length > 0 ? (
              <CodeInspector 
                fix={sectionFixes[0]} 
                onRefine={onRefineSection}
              />
            ) : (
              <div className="h-full border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-6 opacity-30 bg-slate-950/40">
                <Code2 size={48} className="text-slate-700" />
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Awaiting Analysis</p>
                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed">Select a module or capture a viewport to extract structural code fixes.</p>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
      
      <div className="py-12 border-t border-slate-900 text-center">
        <span className="text-[9px] font-black uppercase tracking-[1.5em] text-slate-700 opacity-50">PSI Architectural Control HUD</span>
      </div>
    </div>
  );
};