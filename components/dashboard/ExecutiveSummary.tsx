
import React from 'react';
import { Download, TrendingUp, AlertOctagon, Trophy } from 'lucide-react';
import { ExecutiveSummaryMetrics } from '../../types';

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryMetrics;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  if (!data) return null;

  return (
    <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl mb-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
           <h3 className="text-2xl font-bold tracking-tight">Strategic Audit</h3>
           <p className="text-slate-400 text-sm mt-1">AI-Powered Competitive Forensics</p>
        </div>
        <button className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition flex items-center border border-white/5">
          <Download className="w-3.5 h-3.5 mr-2" />
          Download PDF Report
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group">
          <div className="flex items-center text-xs text-blue-300 uppercase tracking-wider mb-3 font-bold">
             <Trophy className="w-4 h-4 mr-2" />
             Key Advantage
          </div>
          <div className="font-medium text-lg text-blue-50 group-hover:text-white transition-colors">
             {data.key_advantage || "Analyzing..."}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl hover:bg-red-500/20 transition-colors group">
          <div className="flex items-center text-xs text-red-300 uppercase tracking-wider mb-3 font-bold">
             <AlertOctagon className="w-4 h-4 mr-2" />
             Critical Fix Needed
          </div>
          <div className="font-medium text-lg text-red-50 group-hover:text-white transition-colors">
            {data.critical_fix || "Analyzing..."}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl hover:bg-emerald-500/20 transition-colors group">
          <div className="flex items-center text-xs text-emerald-300 uppercase tracking-wider mb-3 font-bold">
             <TrendingUp className="w-4 h-4 mr-2" />
             Est. ROI Uplift
          </div>
          <div className="font-bold text-3xl text-emerald-400 group-hover:text-emerald-300 transition-colors">
             {data.estimated_roi || "--"}
          </div>
        </div>
      </div>
    </section>
  );
}
