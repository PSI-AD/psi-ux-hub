import React, { useRef } from 'react';

export const SyncScrollDiff: React.FC<{ original: string | null; suggested: string }> = ({ original, suggested }) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync horizontal and vertical scroll between top and bottom containers
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (e.currentTarget === topRef.current && bottomRef.current) {
      bottomRef.current.scrollTop = scrollTop;
      bottomRef.current.scrollLeft = scrollLeft;
    } else if (e.currentTarget === bottomRef.current && topRef.current) {
      topRef.current.scrollTop = scrollTop;
      topRef.current.scrollLeft = scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 bg-[#050505] rounded-[2.2rem] overflow-hidden p-6">
      {/* TOP: Legacy UI */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-full border border-rose-500/20 backdrop-blur-md">
               Legacy Viewport
             </span>
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Current architectural state</span>
          </div>
          <div className="text-[9px] font-mono text-slate-700">COORD_SYNC_ID: 0x882A</div>
        </div>
        <div 
          ref={topRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-auto custom-scrollbar bg-[#0a0a0b] rounded-2xl border border-slate-800/50 p-6"
        >
          {original ? (
            <img src={original} className="w-full opacity-30 grayscale rounded-lg" alt="Before" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-800/20 rounded-2xl opacity-20 py-20">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-slate-500">No Viewport Capture</span>
            </div>
          )}
        </div>
      </div>

      {/* TRANSFORM PLANE DIVIDER */}
      <div className="flex items-center gap-6 px-12 py-2">
        <div className="flex-1 h-px bg-slate-800/50" />
        <div className="flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.6em]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          Neural Transformation Plane
        </div>
        <div className="flex-1 h-px bg-slate-800/50" />
      </div>

      {/* BOTTOM: AI Redesign */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-black uppercase rounded-full border border-[#C5A059]/20 backdrop-blur-md">
              Obsidian Revision
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Proposed luxury optimization</span>
          </div>
          <div className="text-[9px] font-mono text-emerald-500/50">RENDER_STATUS: NOMINAL</div>
        </div>
        <div 
          ref={bottomRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-auto custom-scrollbar bg-[#0a0a0b] rounded-2xl border border-slate-800/50 p-6"
        >
          {suggested ? (
            <img src={suggested} className="w-full rounded-lg shadow-[0_0_60px_rgba(197,160,89,0.15)] border border-[#C5A059]/20" alt="After" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-800/20 rounded-2xl opacity-20 py-20">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-slate-500">Generating Redesign...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
