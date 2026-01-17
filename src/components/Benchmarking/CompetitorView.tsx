import React from 'react';
import { PSIProject, BenchmarkScore } from '../../types/index';
import { Target, TrendingUp, ShieldCheck, Globe, Info, ArrowUpRight, BarChart3 } from 'lucide-react';

interface CompetitorViewProps {
  project: PSIProject;
  benchmarks?: BenchmarkScore[];
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({ project, benchmarks }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-[#020617] animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <BarChart3 className="text-psi-gold" size={32} /> Market Benchmark Analytics
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Competitive UX positioning for {project.name}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-psi-gold/10 rounded-xl border border-psi-gold/20 flex items-center gap-2">
                <Target size={14} className="text-psi-gold" />
                <span className="text-[10px] font-black uppercase text-psi-gold">{project.competitors.length} Benchmarks Active</span>
             </div>
          </div>
        </header>

        {/* Heuristic Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(benchmarks || [
            { category: 'Trust Signaling', clientScore: 68, competitorAvg: 85 },
            { category: 'Ease of Navigation', clientScore: 72, competitorAvg: 70 },
            { category: 'High-End Aesthetic', clientScore: 55, competitorAvg: 90 }
          ] as BenchmarkScore[]).map((score) => (
            <div key={score.category} className="glass-card p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp size={48} className="text-psi-gold" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{score.category}</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-white">Client Portfolio</span>
                  <span className="text-xl font-black text-psi-gold">{score.clientScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-obsidian rounded-full overflow-hidden">
                   <div className="h-full bg-psi-gold transition-all duration-1000" style={{ width: `${score.clientScore}%` }} />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-500">Market Avg</span>
                  <span className="text-sm font-black text-slate-400">{score.competitorAvg}%</span>
                </div>
                <div className="w-full h-1 bg-obsidian rounded-full overflow-hidden opacity-50">
                   <div className="h-full bg-slate-700 transition-all duration-1000" style={{ width: `${score.competitorAvg}%` }} />
                </div>
              </div>

              {score.clientScore < score.competitorAvg && (
                <div className="mt-6 flex items-start gap-2 text-rose-500 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                   <ArrowUpRight size={14} className="shrink-0" />
                   <p className="text-[9px] font-bold uppercase leading-relaxed tracking-wider">Visual gap detected. Remediation prioritized in current audit sprint.</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Competitor Stack */}
        <section className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold flex items-center gap-2">
               <Globe size={14} /> Competitive Domain Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {project.competitors.map(url => (
                 <div key={url} className="glass-card p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-obsidian rounded-xl border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-psi-gold transition-colors">
                          <Globe size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-wider">{url.replace('https://', '').replace('www.', '')}</p>
                          <span className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">Live Domain Link</span>
                       </div>
                    </div>
                    <button className="p-3 text-slate-600 hover:text-psi-gold">
                       <ArrowUpRight size={18} />
                    </button>
                 </div>
               ))}
            </div>
        </section>

        <section className="p-12 border border-dashed border-white/10 rounded-[3rem] text-center opacity-40">
           <ShieldCheck size={48} className="mx-auto mb-4 text-slate-800" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Enterprise Grade Benchmarking Secure</p>
        </section>
      </div>
    </div>
  );
};