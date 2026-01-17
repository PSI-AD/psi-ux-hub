import React from 'react';
import { Columns, Layers, Link2, Link2Off, Eye, Sparkles } from 'lucide-react';

interface ComparisonToolsProps {
  comparisonMode: 'split' | 'overlay';
  setComparisonMode: (mode: 'split' | 'overlay') => void;
  isMirrorScroll: boolean;
  setIsMirrorScroll: (mirror: boolean) => void;
  isFlashActive: boolean;
  setIsFlashActive: (active: boolean) => void;
}

export const ComparisonTools: React.FC<ComparisonToolsProps> = ({
  comparisonMode,
  setComparisonMode,
  isMirrorScroll,
  setIsMirrorScroll,
  isFlashActive,
  setIsFlashActive
}) => {
  const isSplit = comparisonMode === 'split';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 p-1.5 bg-[#0a0a0b]/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 duration-500">
      {/* Side-by-Side Toggle */}
      <button 
        onClick={() => setComparisonMode('split')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSplit && !isFlashActive ? 'bg-[#C5A059] text-slate-950 shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
      >
        <Columns size={14} /> Side-By-Side
      </button>

      <div className="w-px h-6 bg-slate-800 mx-1" />

      {/* Flash Toggle (Hold to Preview Overlay) */}
      <button 
        onMouseDown={() => {
          setComparisonMode('overlay');
          setIsFlashActive(true);
        }}
        onMouseUp={() => {
          setIsFlashActive(false);
        }}
        onMouseLeave={() => {
          setIsFlashActive(false);
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFlashActive ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-95' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
      >
        <Layers size={14} /> Flash Overlay
      </button>

      <div className="w-px h-6 bg-slate-800 mx-1" />

      {/* Mirror Scroll Toggle */}
      <button 
        onClick={() => setIsMirrorScroll(!isMirrorScroll)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isMirrorScroll ? 'text-[#C5A059] bg-[#C5A059]/5 border border-[#C5A059]/20' : 'text-slate-600 hover:text-slate-400'}`}
      >
        {isMirrorScroll ? <Link2 size={14} /> : <Link2Off size={14} />}
        Mirror Scroll
      </button>

      {/* Status Badges (Visual only) */}
      {!isSplit && (
        <div className="ml-2 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Overlay Active</span>
        </div>
      )}
    </div>
  );
};