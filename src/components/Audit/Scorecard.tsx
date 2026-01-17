import React from 'react';
import { HeuristicBreakdown, HeuristicRationale } from '../../types/index';
import { AlertTriangle, ArrowRight, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

interface ScorecardProps {
  current: HeuristicBreakdown;
  proposed: HeuristicBreakdown;
  rationale: HeuristicRationale[];
}

export const Scorecard: React.FC<ScorecardProps> = ({ current, proposed, rationale }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const getStrokeColor = (score: number) => {
    if (score > 80) return 'var(--color-primary)'; // Primary
    if (score > 60) return '#fbbf24'; // Amber
    return '#f43f5e'; // Red
  };

  const ScoreRing = ({ score, label, isProposed = false }: { score: number, label: string, isProposed?: boolean }) => {
    const offset = circumference - (score / 100) * circumference;
    const stroke = score > 80 ? '#3B82F6' : (score > 60 ? '#fbbf24' : '#f43f5e'); // Hardcoded for SVG stroke

    return (
      <div className="flex flex-col items-center gap-4 group">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="12" />
            <circle
              cx="96" cy="96" r={radius} fill="none" stroke={stroke} strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="transition-all duration-1500 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-5xl font-black tracking-tighter ${isProposed ? 'text-primary' : 'text-[var(--text-primary)]'}`}>{score}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ 100</span>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-all">
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

  const safeString = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch (e) {
        return '';
      }
    }
    return String(val);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-12 space-y-16 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-sm text-center lg:text-left">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-luxury">Heuristic Diagnostic</h3>
          <p className="text-white text-sm leading-relaxed font-medium">
            Automated architectural audit utilizing world-class UX standards for elite real estate portfolios.
          </p>
          <div className="flex items-center gap-3 pt-4 justify-center lg:justify-start">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary border border-primary/20 text-[9px] font-black uppercase">
              <TrendingUp size={12} /> +{safeString((proposed.total || 0) - (current.total || 0))}% Improvement
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-20">
          <ScoreRing score={current.total || 0} label="Current Experience" />
          <div className="hidden md:flex flex-col items-center gap-2 opacity-20">
            <ArrowRight size={32} className="text-primary" />
          </div>
          <ScoreRing score={proposed.total || 0} label="Proposed Vision" isProposed />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-border pt-16">
        {/* Severity Breakdown */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" size={20} />
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Attribute Integrity</h4>
          </div>
          <div className="space-y-6">
            {categories.map((cat) => {
              const curVal = (current as any)[cat.key] || 0;
              const propVal = (proposed as any)[cat.key] || 0;
              const isCritical = curVal < (cat.max * 0.6);

              return (
                <div key={safeString(cat.key)} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{safeString(cat.label)}</span>
                      {isCritical && (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[7px] font-black uppercase">Critical Risk</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white text-[10px]">{safeString(curVal)}</span>
                      <ArrowRight size={10} className="text-white" />
                      <span className="text-primary text-[10px] font-bold">{safeString(propVal)}</span>
                      <span className="text-white text-[8px]">/ {safeString(cat.max)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-surface border border-border rounded-lg overflow-hidden flex">
                    <div className="h-full bg-white opacity-40 transition-all duration-1000" style={{ width: `${(curVal / cat.max) * 100}%` }} />
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${((propVal - curVal) / cat.max) * 100}%` }} />
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
              <div key={i} className="p-5 bg-background border border-border rounded-lg group hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary border border-border group-hover:border-primary/30">
                    <Zap size={14} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{safeString(item.category)}</span>
                      <span className="text-[8px] font-black text-emerald-500">+{safeString(item.impactScore)}% Impact</span>
                    </div>
                    <p className="text-[11px] text-white leading-relaxed italic">"{safeString(item.currentObservation)}"</p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      <p className="text-[10px] text-white font-bold">{safeString(item.proposedImprovement)}</p>
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
