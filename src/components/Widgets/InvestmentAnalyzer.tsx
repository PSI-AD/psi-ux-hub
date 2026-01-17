import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, PieChart, ArrowRight, DollarSign } from 'lucide-react';

interface InvestmentAnalyzerProps {
  propertyPrice?: number;
}

export const InvestmentAnalyzer: React.FC<InvestmentAnalyzerProps> = ({ propertyPrice = 1200000 }) => {
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(8500);

  const stats = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const downPaymentAmount = propertyPrice * (downPaymentPct / 100);
    
    // Formulas as per Platinum Standard
    const capRate = (annualRent / propertyPrice) * 100;
    const cashOnCash = (annualRent / downPaymentAmount) * 100;

    return {
      capRate: capRate.toFixed(2),
      cashOnCash: cashOnCash.toFixed(2),
      downPayment: downPaymentAmount.toLocaleString()
    };
  }, [propertyPrice, downPaymentPct, monthlyRent]);

  return (
    <div className="glass-card p-8 rounded-[2.5rem] border border-psi-gold/20 bg-slate-950/40 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-psi-gold/10 rounded-2xl flex items-center justify-center text-psi-gold">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tighter text-white">Investment Analyzer</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Yield & Performance Projection</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Down Payment</span>
            <span className="text-psi-gold">{String(downPaymentPct)}%</span>
          </div>
          <input 
            type="range" 
            min="20" 
            max="100" 
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-psi-gold h-1 bg-white/5 rounded-full cursor-pointer appearance-none"
          />
          <p className="text-[9px] text-slate-600 font-mono">AED {String(stats.downPayment)}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Expected Monthly Rent</span>
            <span className="text-psi-gold">AED {monthlyRent.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="3000" 
            max="25000" 
            step="500"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full accent-psi-gold h-1 bg-white/5 rounded-full cursor-pointer appearance-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <PieChart size={10} /> Cap Rate
          </span>
          <p className="text-2xl font-black text-psi-gold">{String(stats.capRate)}%</p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <TrendingUp size={10} /> CoC Return
          </span>
          <p className="text-2xl font-black text-psi-gold">{String(stats.cashOnCash)}%</p>
        </div>
      </div>

      <button className="w-full py-4 bg-psi-gold text-obsidian rounded-xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
        Request Financial Audit <ArrowRight size={14} />
      </button>
    </div>
  );
};