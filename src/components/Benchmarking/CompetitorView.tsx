import React from 'react';
import { PSIProject, BenchmarkScore } from '../../types/index';
import { Target, TrendingUp, ShieldCheck, Globe, Info, ArrowUpRight, BarChart3 } from 'lucide-react';

interface CompetitorViewProps {
  project: PSIProject;
  benchmarks?: BenchmarkScore[];
}

export const CompetitorView = ({ project, benchmarks }: CompetitorViewProps) => {
  const safeVal = (val: any) => String(val || '');
  const competitors = project.competitors || [];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-background animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-border pb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase flex items-center gap-4">
              <BarChart3 className="text-primary" size={32} /> Market Benchmark Analytics
            </h2>
            <p className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Competitive UX positioning for {safeVal(project.name)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-surface rounded-lg border border-border flex items-center gap-2">
              <Target size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase text-primary">{safeVal(competitors.length)} Benchmarks Active</span>
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
            <div key={safeVal(score.category)} className="bg-surface border border-border p-8 space-y-6 relative overflow-hidden group hover:border-primary/50 transition-all rounded-lg">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={48} className="text-primary" />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">{safeVal(score.category)}</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-white">Client Portfolio</span>
                  <span className="text-xl font-bold text-primary">{safeVal(score.clientScore)}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-lg overflow-hidden border border-border">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${score.clientScore}%` }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-bold uppercase text-white">Market Avg</span>
                  <span className="text-sm font-bold text-white">{safeVal(score.competitorAvg)}%</span>
                </div>
                <div className="w-full h-1 bg-background rounded-lg overflow-hidden opacity-50 border border-border">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${score.competitorAvg}%` }} />
                </div>
              </div>

              {score.clientScore < score.competitorAvg && (
                <div className="mt-6 flex items-start gap-2 text-rose-500 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                  <ArrowUpRight size={14} className="shrink-0" />
                  <p className="text-[9px] font-bold uppercase leading-relaxed tracking-wider">Visual gap detected. Remediation prioritized.</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Competitor Stack */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-2">
            <Globe size={14} /> Competitive Domain Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(competitors).map(url => (
              <div key={safeVal(url)} className="bg-surface border border-border p-6 flex items-center justify-between group hover:border-primary/50 transition-all rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-background rounded-lg border border-border flex items-center justify-center text-white group-hover:text-primary transition-colors">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">{safeVal(url).replace('https://', '').replace('www.', '')}</p>
                    <span className="text-[8px] text-white font-mono uppercase tracking-tighter">Live Domain Link</span>
                  </div>
                </div>
                <button className="p-3 text-white hover:text-primary">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="p-12 border border-dashed border-border rounded-lg text-center opacity-40">
          <ShieldCheck size={48} className="mx-auto mb-4 text-white" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Enterprise Grade Benchmarking Secure</p>
        </section>
      </div>
    </div>
  );
};