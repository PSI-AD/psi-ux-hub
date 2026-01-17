import React from 'react';
import { InvestmentAnalyzer } from '../Widgets/InvestmentAnalyzer';
import { AIMatchmaker } from '../Widgets/AIMatchmaker';
import { MapPin, Bed, Bath, Move, ShieldCheck, Share2, Printer, Heart, ChevronLeft, Calendar, Info } from 'lucide-react';

interface PropertyDetailRedesignProps {
  property?: {
    title: string;
    location: string;
    price: string;
    beds: number;
    baths: number;
    area: string;
    description: string;
  };
}

export const PropertyDetailRedesign: React.FC<PropertyDetailRedesignProps> = ({ 
  property = {
    title: "Al Reem Executive Penthouse",
    location: "Al Reem Island, Abu Dhabi",
    price: "AED 3,250,000",
    beds: 4,
    baths: 5,
    area: "3,850 sq.ft",
    description: "Experience the pinnacle of urban luxury in this expansive 4-bedroom penthouse. Featuring panoramic views of the Arabian Gulf and obsidian-dark interior finishes, this property represents the gold standard of real estate investment in the UAE."
  }
}) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-12 custom-scrollbar overflow-y-auto animate-in fade-in duration-1000">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-psi-gold tracking-widest transition-all">
          <ChevronLeft size={16} /> Back to Search
        </button>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Share2 size={18}/></button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Heart size={18}/></button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Printer size={18}/></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visuals & Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Gallery Simulation */}
          <div className="aspect-[21/9] rounded-[3.5rem] bg-slate-900 overflow-hidden relative group border border-white/10">
            <img src="https://psinv.net/wp-content/uploads/2021/04/property-management.jpg" className="w-full h-full object-cover opacity-80" alt="Property Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 space-y-2">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">{String(property.title)}</h1>
              <p className="flex items-center gap-2 text-psi-gold text-xs font-bold uppercase tracking-widest">
                <MapPin size={14} /> {String(property.location)}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Bed, label: 'Bedrooms', val: property.beds },
              { icon: Bath, label: 'Bathrooms', val: property.baths },
              { icon: Move, label: 'Area Size', val: property.area },
              { icon: ShieldCheck, label: 'Status', val: 'Verified' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border-white/5 text-center space-y-2 group hover:border-psi-gold/30 transition-all">
                <stat.icon className="mx-auto text-psi-gold" size={20} />
                <p className="text-lg font-black text-white">{String(stat.val)}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{String(stat.label)}</p>
              </div>
            ))}
          </div>

          {/* Description & Narrative */}
          <div className="space-y-6 bg-white/5 p-10 rounded-[3rem] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-psi-gold rounded-full" />
              <h3 className="text-xl font-black uppercase tracking-widest text-psi-gold">Architectural Overview</h3>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed font-light font-luxury italic">
              {String(property.description)}
            </p>
            
            <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/10 mt-10">
               <div className="flex items-start gap-4">
                  <Calendar size={20} className="text-psi-gold shrink-0 mt-1" />
                  <div>
                    <h5 className="text-[10px] font-black uppercase text-white tracking-widest">Completion Status</h5>
                    <p className="text-sm text-slate-500">Ready for Handover (Q4 2025)</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <Info size={20} className="text-psi-gold shrink-0 mt-1" />
                  <div>
                    <h5 className="text-[10px] font-black uppercase text-white tracking-widest">Viewing Protocol</h5>
                    <p className="text-sm text-slate-500">24-hour advance notice required for VIP tours.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Map / Features placeholder */}
          <div className="h-64 rounded-[3rem] bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center gap-4 group">
             <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-700 group-hover:text-psi-gold transition-colors">
               <MapPin size={32} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">Interactive Location Engine Offline</span>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar with Investment Tools */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-12 space-y-8">
            <InvestmentAnalyzer propertyPrice={3250000} />
            
            <div className="p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 space-y-4 shadow-xl">
               <div className="flex items-center gap-3 text-emerald-400">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Market Integrity Report</span>
               </div>
               <p className="text-xs text-emerald-500/80 leading-relaxed font-medium">
                  This property is currently yielding <strong>+12.4%</strong> above the Al Reem Island average. Our AI suggests a 98th percentile capital appreciation profile over the next 36 months.
               </p>
               <button className="text-[9px] font-black uppercase text-emerald-400 hover:underline tracking-widest">Download Full Proforma (PDF)</button>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Agent On-Call</h4>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Agent+PS&background=D4AF37&color=020617" alt="Agent" />
                 </div>
                 <div>
                    <p className="text-sm font-black text-white uppercase">Sovereign Advisor</p>
                    <p className="text-[10px] text-psi-gold font-bold">Luxury Specialist</p>
                 </div>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-psi-gold hover:text-obsidian rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Secure Private Viewing</button>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Hub: AI Recommendations */}
      <div className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-20">
        <AIMatchmaker />
      </div>

      <footer className="max-w-7xl mx-auto py-24 border-t border-white/5 text-center opacity-40">
        <div className="flex justify-center gap-8 mb-8 opacity-50">
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Listing #PS-77421</span>
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Verified by DLD</span>
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Escrow Protected</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[1em] text-slate-600">Property Shop Investment • Executive Redesign Sprint</span>
      </footer>
    </div>
  );
};