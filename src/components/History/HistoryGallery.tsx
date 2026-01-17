
import React from 'react';
import { VerticalGallery } from '../Auditor/VerticalGallery';
import { Calendar, Code2, ArrowLeft, ArrowRight, History, Package, Zap } from 'lucide-react';
/* Use AuditFolder instead of AuditHistoryItem */
import { AuditFolder } from '../../types/index';

interface HistoryGalleryProps {
  /* Prop type updated to AuditFolder[] */
  auditFolders: AuditFolder[];
  pageName: string;
  onBack: () => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({ auditFolders, pageName, onBack }) => {
  return (
    <div className="fixed inset-0 bg-[#020617] z-[100] overflow-y-auto p-10 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-16 border-b border-slate-800 pb-10 max-w-7xl mx-auto">
        <div>
          <button 
            onClick={onBack} 
            className="text-[#C5A059] flex items-center gap-3 text-[10px] font-black uppercase mb-4 hover:translate-x-[-4px] transition-transform group"
          >
            <ArrowLeft size={16} className="group-hover:scale-110 transition-transform" /> 
            Back to Engineering Workspace
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0054A6] border border-[#C5A059]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,84,166,0.3)]">
              <History className="text-[#C5A059]" size={24} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Evolution Gallery</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">{pageName} Architectural Lifecycle</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="bg-slate-900/50 px-8 py-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sprints</span>
            <span className="text-2xl font-black text-white font-mono">{auditFolders.length}</span>
          </div>
          <div className="bg-[#C5A059]/10 px-8 py-5 rounded-3xl border border-[#C5A059]/20 backdrop-blur-md flex flex-col items-center">
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">Status</span>
            <span className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <Zap size={16} className="text-[#C5A059]" /> Optimized
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-40 max-w-7xl mx-auto pb-40">
        {auditFolders.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center space-y-6 opacity-30">
            <Package size={64} className="text-slate-700" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">History Archives Empty</p>
          </div>
        ) : (
          auditFolders.map((folder, index) => (
            <section key={folder.id} className="relative">
              <div className="sticky top-0 z-40 flex items-center justify-between bg-[#020617]/95 py-6 border-b border-slate-800/50 backdrop-blur-md mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-[#C5A059] text-slate-950 flex items-center justify-center font-black text-xl shadow-[0_0_30px_rgba(197,160,89,0.3)] border-4 border-[#020617]">
                    {auditFolders.length - index}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{folder.taskName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> {new Date(folder.timestamp).toLocaleDateString()} • {new Date(folder.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {/* Corrected: use voiceDirectives */}
                        {folder.voiceDirectives.length} Synthesis Directives Applied
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    {/* Corrected: use reports.perf */}
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{folder.reports.perf}% Score</span>
                  </div>
                </div>
              </div>

              {/* High-Fidelity Comparison Stack */}
              <VerticalGallery 
                /* Corrected property names: thumbnail and redesignImg */
                legacyImg={folder.thumbnail} 
                aiImg={folder.redesignImg}
                sectionFixes={[{
                  /* Corrected: Use taskName as type and voiceDirectives */
                  sectionType: folder.taskName,
                  issue: folder.description,
                  solution: "Visual synthesis based on architectural feedback.",
                  code: folder.refinedCode
                }]}
                onClear={() => {}} // No clearing in history view
              />
              
              <div className="mt-12 p-10 bg-slate-900/40 rounded-[3rem] border border-slate-800 max-w-[1200px] mx-auto glass-card relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-2 h-full bg-[#C5A059]/20" />
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                       <Code2 size={20} className="text-[#C5A059]" /> Final Synthesis Implementation
                    </h4>
                    <button 
                      onClick={() => navigator.clipboard.writeText(folder.refinedCode)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Copy Source
                    </button>
                 </div>
                 <pre className="p-8 bg-black/50 rounded-3xl overflow-x-auto border border-slate-800 custom-scrollbar">
                   <code className="text-emerald-400 text-xs font-mono leading-relaxed whitespace-pre">
                    {folder.refinedCode}
                   </code>
                 </pre>

                 {/* Corrected: use voiceDirectives */}
                 {folder.voiceDirectives.length > 0 && (
                   <div className="mt-8 pt-8 border-t border-slate-800/50">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Voice Refinement Log</h5>
                      <div className="flex flex-wrap gap-2">
                         {folder.voiceDirectives.map((instr, i) => (
                           <div key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-800 text-[10px] text-slate-400 italic">
                             "{instr}"
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              {index < auditFolders.length - 1 && (
                <div className="mt-40 mb-20 flex justify-center">
                   <div className="w-1 h-32 bg-gradient-to-b from-slate-800 via-[#C5A059]/20 to-transparent rounded-full" />
                </div>
              )}
            </section>
          ))
        )}
      </div>

      <footer className="py-20 text-center border-t border-slate-800/50 opacity-20">
         <p className="text-[9px] font-black uppercase tracking-[1.5em] text-slate-500">Property Shop Investment • Engineering Archives</p>
      </footer>
    </div>
  );
};
