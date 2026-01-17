
import React, { useState } from 'react';
import { ChevronDown, Zap, ShieldCheck, Sparkles, Layout, MousePointer2, Smartphone } from 'lucide-react';

interface FixAccordionProps {
  fixes: string[];
}

const ICONS = [Zap, ShieldCheck, Sparkles, Layout, MousePointer2, Smartphone];

export const FixAccordion: React.FC<FixAccordionProps> = ({ fixes }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="space-y-3 w-full">
      {fixes.map((fix, idx) => {
        const isOpen = openIndex === idx;
        const IconComponent = ICONS[idx % ICONS.length];
        
        return (
          <div 
            key={idx} 
            className={`group transition-all duration-300 border rounded-2xl overflow-hidden ${
              isOpen 
                ? 'bg-slate-900/80 border-psi-gold/40 shadow-[0_0_20px_rgba(197,160,89,0.1)] ring-1 ring-psi-gold/20' 
                : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isOpen 
                    ? 'bg-psi-gold text-slate-900 scale-110 shadow-lg' 
                    : 'bg-slate-800 text-slate-400 group-hover:text-psi-gold'
                }`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isOpen ? 'text-psi-gold' : 'text-slate-500'}`}>
                    Architecture Fix #{idx + 1}
                  </p>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {fix.split(':')[0] || `Optimization Layer ${idx + 1}`}
                  </h4>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-psi-gold' : 'text-slate-600'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="px-5 pb-6 ml-14 border-l border-psi-gold/10">
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {fix.includes(':') ? fix.split(':').slice(1).join(':').trim() : fix}
                </p>
                <div className="mt-4 flex items-center gap-3">
                   <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Verified Logic</div>
                   <div className="px-2 py-0.5 bg-psi-blue/20 border border-psi-gold/20 rounded text-[9px] font-bold text-psi-gold uppercase tracking-tighter">PSI Brand Guide</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
