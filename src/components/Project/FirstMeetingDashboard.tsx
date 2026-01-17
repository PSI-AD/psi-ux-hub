import React from 'react';
import { PSIProject, BrandDNA } from '../../types/index';
import { Zap, ShieldCheck, Palette, Type as FontIcon, Layout, ChevronRight, Activity, Target } from 'lucide-react';

interface FirstMeetingDashboardProps {
  project: PSIProject;
  onConfirm: () => void;
}

export const FirstMeetingDashboard: React.FC<FirstMeetingDashboardProps> = ({ project, onConfirm }) => {
  const dna = project.brand.dna;

  if (!dna) return (
    <div className="flex flex-col items-center justify-center h-full opacity-20">
      <Zap size={64} className="mb-6" />
      <h3 className="text-xl font-black uppercase tracking-[0.4em]">Extracting DNA...</h3>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-obsidian animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-[2rem] bg-psi-gold/10 border border-psi-gold/30 flex items-center justify-center text-psi-gold shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-4">
            {project.brand.logo ? <img src={project.brand.logo} className="w-16 h-16 object-contain" /> : <ShieldCheck size={40} />}
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter luxury-text-gradient">Strategic Discovery</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.6em]">Brand DNA Analysis • Confidentially Prepared for PSI</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Identity Matrix */}
          <section className="glass-card p-10 space-y-8 border-l-4 border-psi-gold">
            <div className="flex items-center gap-4">
              <Activity className="text-psi-gold" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tighter">Identity Matrix</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">Primary Palette</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg shadow-xl" style={{ backgroundColor: dna.colors.primary }} />
                    <span className="text-[10px] font-mono text-psi-gold uppercase">{dna.colors.primary}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg shadow-xl" style={{ backgroundColor: dna.colors.secondary }} />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{dna.colors.secondary}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">Typography Classification</p>
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                  <FontIcon size={24} className="text-psi-gold" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{dna.typography.heading}</h4>
                    <p className="text-[10px] text-slate-500 italic">Tone: {dna.typography.tone}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Architectural Pillars */}
          <section className="glass-card p-10 space-y-8 border-l-4 border-psi-gold">
            <div className="flex items-center gap-4">
              <Layout className="text-psi-gold" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tighter">Architectural Pillars</h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">Layout Rhythm</p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-sm text-slate-300 font-medium">
                  {dna.layoutRhythm}
                </div>
              </div>
              
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">Agency Philosophy</p>
                <p className="text-xs text-slate-400 leading-relaxed italic">"{dna.philosophy}"</p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center gap-8 pt-8">
          <div className="flex gap-4">
            {dna.extractedKeywords.map(kw => (
              <span key={kw} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                {kw}
              </span>
            ))}
          </div>

          <button 
            onClick={onConfirm}
            className="px-16 py-5 bg-psi-gold text-obsidian rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
          >
            Confirm Brand Anchor <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};