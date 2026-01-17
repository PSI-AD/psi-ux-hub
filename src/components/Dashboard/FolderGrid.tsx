import React, { useState } from 'react';
import { Folder, ArrowRight, Trash2, Clock, Download, Gauge, Loader2 } from 'lucide-react';
import { AuditFolder } from '../../types/index';
import { generateAuditZip } from '../../services/exportService';

interface FolderGridProps {
  folders: AuditFolder[];
  onOpenFolder: (folder: AuditFolder) => void;
  onDeleteFolder: (id: string) => void;
}

export const FolderGrid: React.FC<FolderGridProps> = ({ folders, onOpenFolder, onDeleteFolder }) => {
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  const handleExport = async (folder: AuditFolder) => {
    try {
      setExportingId(folder.id);
      // We need pageName, but AuditFolder doesn't have it directly. 
      // In this context, we'll use taskName or a placeholder since the prop only passes folders.
      // Usually taskName includes the context.
      await generateAuditZip(folder, folder.taskName || 'PSI-Audit', (status) => {
        setExportStatus(status);
      });
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setTimeout(() => {
        setExportingId(null);
        setExportStatus('');
      }, 1000);
    }
  };

  if (folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-48 opacity-20 text-center">
        <Folder size={64} className="mb-6 text-slate-700" />
        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">Vault Currently Empty</h3>
        <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest italic">Awaiting implementation commits</p>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto overflow-y-auto h-full custom-scrollbar pb-32">
      <div className="flex items-center justify-between border-b border-slate-800 pb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Implementation Vault</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Historical Optimization Records</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {folders.length} AUDITS SECURED
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {folders.map((folder) => (
          <div 
            key={folder.id}
            className="group bg-[#0a0a0b] border border-slate-800 rounded-[2rem] overflow-hidden hover:border-[#C5A059]/40 transition-all shadow-2xl flex flex-col"
          >
            {/* Split Comparison View */}
            <div className="h-44 flex border-b border-slate-800">
              <div className="w-1/2 relative bg-white">
                <img src={folder.thumbnail} className="w-full h-full object-cover" alt="Legacy" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600/90 text-white text-[8px] font-black uppercase rounded">Legacy</div>
              </div>
              <div className="w-1/2 relative bg-black">
                <img src={folder.redesignImg || folder.thumbnail} className="w-full h-full object-cover opacity-80" alt="Revision" />
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#C5A059]/90 text-slate-950 text-[8px] font-black uppercase rounded">Obsidian</div>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <h3 className="text-white font-black text-lg tracking-tight truncate group-hover:text-[#C5A059] transition-colors">
                    {folder.taskName}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 text-[9px] font-black uppercase mt-1 tracking-widest">
                    <Clock size={10} /> 
                    {new Date(folder.timestamp).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                  className="p-2 text-slate-800 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* PageSpeed Quick-Report */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'PERF', val: folder.reports.perf },
                  { label: 'ACC', val: folder.reports.acc },
                  { label: 'BEST', val: folder.reports.best },
                  { label: 'SEO', val: folder.reports.seo }
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                    <p className={`text-[10px] font-black ${stat.val > 89 ? 'text-emerald-400' : 'text-amber-400'}`}>{stat.val}</p>
                    <p className="text-[7px] text-slate-600 font-black uppercase tracking-tighter">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 mt-auto">
                <button 
                  onClick={() => onOpenFolder(folder)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-[#C5A059] text-slate-500 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Inspect Snapshot <ArrowRight size={14} />
                </button>
                <button 
                  onClick={() => handleExport(folder)}
                  disabled={exportingId === folder.id}
                  className={`p-4 bg-slate-900 border border-slate-800 transition-all rounded-xl flex items-center justify-center min-w-[64px] ${
                    exportingId === folder.id ? 'text-[#C5A059] border-[#C5A059]/50' : 'text-slate-600 hover:text-[#C5A059]'
                  }`}
                  title="Export ZIP Architecture"
                >
                  {exportingId === folder.id ? (
                    <div className="flex flex-col items-center gap-1">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-[6px] font-bold uppercase">{exportStatus}</span>
                    </div>
                  ) : (
                    <Download size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
