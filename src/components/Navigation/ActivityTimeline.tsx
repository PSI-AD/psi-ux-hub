import React from 'react';
import { History, CheckCircle2, Clock, GitCommit } from 'lucide-react';
/* Use AuditFolder instead of AuditHistoryItem */
import { AuditFolder } from '../../types/index';

interface ActivityTimelineProps {
  /* Prop type updated to AuditFolder[] */
  history: AuditFolder[];
  pageName: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ history, pageName }) => {
  return (
    <div className="flex flex-col h-full bg-[#050505] border-l border-slate-800/50 w-96 overflow-hidden shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0a0a0b]">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <History size={16} className="text-[#C5A059]" /> Activity Log
        </h3>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{pageName}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8 relative">
        <div className="absolute left-[31px] top-8 bottom-8 w-px timeline-line" />

        {history.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Clock size={40} className="mx-auto mb-4" />
            <p className="text-[10px] uppercase font-black tracking-[0.2em]">No tasks implemented</p>
          </div>
        ) : (
          history.map((task, index) => (
            <div key={task.id} className="relative pl-10 group">
              {/* Pulse gold only on the latest (first) item to signify the active/latest implementation */}
              <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-[#C5A059] z-10 transition-transform group-hover:scale-125 ${index === 0 ? 'history-node-active' : ''}`} />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-tighter">
                    {new Date(task.timestamp).toLocaleDateString()} • {new Date(task.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-bold uppercase">Implemented</span>
                  </div>
                </div>

                <div className={`glass-card p-4 hover:bg-slate-900/40 transition-all border ${index === 0 ? 'border-[#C5A059]/30 bg-slate-900/20 shadow-[0_0_20px_rgba(197,160,89,0.05)]' : 'border-slate-800 group-hover:border-[#C5A059]/30'}`}>
                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                    {task.taskName || "UI Optimization"}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {task.description || "Refined layout density and obsidian color grading for improved readability."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 h-16 rounded-lg overflow-hidden border border-slate-800 bg-black/20">
                    <div className="relative bg-slate-950 flex items-center justify-center text-[7px] text-slate-600 uppercase font-black border-r border-slate-800">
                       {task.thumbnail ? <img src={task.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Legacy" /> : "Legacy"}
                    </div>
                    <div className="relative bg-slate-900 flex items-center justify-center text-[7px] text-[#C5A059] uppercase font-black">
                       {task.redesignImg ? <img src={task.redesignImg} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Obsidian" /> : "Obsidian"}
                       {!task.redesignImg && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-[#0a0a0b] border-t border-slate-800">
        <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-800 flex items-center justify-center gap-2">
          <GitCommit size={14} /> Export Implementation Log
        </button>
      </div>
    </div>
  );
};