import React from 'react';
import { HeuristicBreakdown, HeuristicRationale } from '../../types/index';
import { AlertTriangle, ArrowRight, ShieldCheck, Zap, Info, TrendingUp } from 'lucide-react';

interface ScorecardProps {
  current: HeuristicBreakdown;
  proposed: HeuristicBreakdown;
  rationale: HeuristicRationale[];
}

export const Scorecard: React.FC<ScorecardProps> = ({ current, proposed, rationale }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  const getStrokeColor = (score: number) => {
    if (score > 80) return '#D4AF37'; // Gold
    if (score > 60) return '#fbbf24'; // Amber
    return '#f43f5e'; // Red
  };

  const ScoreRing = ({ score, label, isProposed = false }: { score: number, label: string, isProposed?: boolean }) => {
    const offset = circumference - (score / 100) * circumference;
    const stroke = getStrokeColor(score);

    return (
      <div className="flex flex-col items-center gap-4 group">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
            <circle 
              cx="96" cy="96" r={radius} fill="none" stroke={stroke} strokeWidth="12" 
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="transition-all duration-1500 ease-out"
              style={{ filter: `drop-shadow(0 0 10px ${stroke}44)` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-5xl font-black tracking-tighter ${isProposed ? 'text-psi-gold' : 'text-white'}`}>{score}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ 100</span>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-all">
          {label}
        </div>
      </div>
    );
  };

  const categories = [
    { key: 'visualHierarchy', label: 'Visual Hierarchy', max: 25 },
    { key: 'trustAuthority', label: 'Trust & Authority', max: 20 },
    { key: 'conversionFriction', label: 'Conversion Friction', max: 20 },
    { key: 'accessibilityCompliance', label: 'Accessibility', max: 15 },
    { key: 'infoArchitecture', label: 'Info Arch', max: 10 },
    { key: 'mobileResponsiveness', label: 'Mobile UX', max: 10 },
  ];

  return (
    <div className="glass-card p-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-sm text-center lg:text-left">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-luxury">Heuristic Diagnostic</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Automated architectural audit utilizing world-class UX standards for elite real estate portfolios.
          </p>
          <div className="flex items-center gap-3 pt-4 justify-center lg:justify-start">
             <div className="flex items-center gap-2 px-3 py-1 bg-psi-gold/10 rounded-lg text-psi-gold border border-psi-gold/20 text-[9px] font-black uppercase">
               <TrendingUp size={12} /> +{proposed.total - current.total}% Improvement
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-20">
          <ScoreRing score={current.total} label="Current Experience" />
          <div className="hidden md:flex flex-col items-center gap-2 opacity-20">
             <ArrowRight size={32} className="text-psi-gold" />
          </div>
          <ScoreRing score={proposed.total} label="Proposed Vision" isProposed />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5 pt-16">
        {/* Severity Breakdown */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <ShieldCheck className="text-psi-gold" size={20} />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Attribute Integrity</h4>
           </div>
           <div className="space-y-6">
              {categories.map((cat) => {
                const curVal = (current as any)[cat.key];
                const propVal = (proposed as any)[cat.key];
                const isCritical = curVal < (cat.max * 0.6);

                return (
                  <div key={cat.key} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cat.label}</span>
                        {isCritical && (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-[7px] font-black uppercase">Critical Risk</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-600 text-[10px]">{curVal}</span>
                        <ArrowRight size={10} className="text-slate-700" />
                        <span className="text-psi-gold text-[10px] font-bold">{propVal}</span>
                        <span className="text-slate-800 text-[8px]">/ {cat.max}</span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
                       <div className="h-full bg-slate-700 opacity-40 transition-all duration-1000" style={{ width: `${(curVal/cat.max)*100}%` }} />
                       <div className="h-full bg-psi-gold transition-all duration-1000" style={{ width: `${((propVal - curVal)/cat.max)*100}%` }} />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Severity Breakdown / Rationales */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <AlertTriangle className="text-rose-500" size={20} />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Remediation Rationale</h4>
           </div>
           <div className="space-y-4">
              {rationale.map((item, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-obsidian flex items-center justify-center text-psi-gold border border-white/5 group-hover:border-psi-gold/30">
                       <Zap size={14} />
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-psi-gold">{item.category}</span>
                          <span className="text-[8px] font-black text-emerald-500">+{item.impactScore}% Impact</span>
                       </div>
                       <p className="text-[11px] text-slate-400 leading-relaxed italic">"{item.currentObservation}"</p>
                       <div className="flex items-center gap-2 pt-1">
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                          <p className="text-[10px] text-white font-bold">{item.proposedImprovement}</p>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
