import React, { useState } from 'react';
import { AlertTriangle, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { CardDetail } from './CardDetail';

interface SolutionCardProps {
  category: string;
  problem: string;
  solution: string;
  severity: 'critical' | 'enhancement';
  code: string;
  onViewCode: (code: string, title: string) => void;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ category, problem, solution, severity, code, onViewCode }) => {
  const isCritical = severity === 'critical';
  const Icon = isCritical ? AlertTriangle : Zap;

  return (
    <div className="luxury-card-glow p-8 rounded-[2rem] transition-all duration-500 group flex flex-col h-full relative overflow-hidden bg-white/5 border border-white/10 hover:border-psi-gold/50">
      {/* Decorative corner accent */}
      <div className="absolute -top-1 -right-1 w-12 h-12 bg-psi-gold/5 blur-xl group-hover:bg-psi-gold/15 transition-all" />
      
      <div className="flex items-center justify-between mb-6">
        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-obsidian border border-psi-gold/20 text-psi-gold shadow-lg">
          {category}
        </span>
        <Icon size={20} className={isCritical ? 'text-psi-gold animate-pulse' : 'text-slate-600'} />
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2.5 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-psi-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'bg-slate-700'}`} />
            Diagnostic Analysis
          </h4>
          <p className="text-base text-white font-medium leading-relaxed font-sans group-hover:text-psi-gold/90 transition-colors">
            {problem}
          </p>
        </div>

        <div className="pt-6 border-t border-white/5">
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Remediation Path
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed font-light italic">
            {solution}
          </p>
        </div>
      </div>

      <button 
        onClick={() => onViewCode(code, problem)}
        className="mt-10 w-full py-4 bg-obsidian border border-psi-gold/20 group-hover:border-psi-gold hover:bg-psi-gold hover:text-obsidian rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-xl"
      >
        Access Implementation <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

interface SolutionCardsProps {
  problems: string[];
  solutions: string[];
  mainCode: string;
  previewImage?: string;
  pageName?: string;
}

export const SolutionCards: React.FC<SolutionCardsProps> = ({ problems, solutions, mainCode, previewImage, pageName }) => {
  const [detailData, setDetailData] = useState<{ code: string; title: string } | null>(null);

  const cardData = problems.map((prob, i) => ({
    category: i === 0 ? 'Visual Fidelity' : i === 1 ? 'Hierarchy' : 'Conversion',
    problem: prob,
    solution: solutions[i] || "Implement high-fidelity Obsidian-Gold patterns to elevate the luxury brand positioning.",
    severity: (i === 0 ? 'critical' : 'enhancement') as 'critical' | 'enhancement',
    code: mainCode
  }));

  return (
    <section className="px-12 pb-32 pt-16 bg-obsidian">
      <div className="flex items-center gap-6 mb-12 max-w-7xl mx-auto">
        <div className="w-14 h-14 rounded-[1.5rem] bg-psi-gold/10 flex items-center justify-center text-psi-gold border border-psi-gold/20 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
          <Sparkles size={28} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-luxury">Architecture Solutions</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] mt-1">High-fidelity expert remediation log</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {cardData.map((card, idx) => (
          <SolutionCard 
            key={idx}
            {...card}
            onViewCode={(code, title) => setDetailData({ code, title })}
          />
        ))}
      </div>

      {detailData && (
        <CardDetail 
          code={detailData.code} 
          title={detailData.title} 
          onClose={() => setDetailData(null)} 
          previewImage={previewImage}
          pageName={pageName}
        />
      )}
    </section>
  );
};