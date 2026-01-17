import React from 'react';
import { Sparkles, Heart, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  price: string;
  match: number;
  image: string;
  rating: string;
}

const SUGGESTED: Property[] = [
  { id: '1', name: 'Al Reem Sky Villas', price: 'AED 2,450,000', match: 98, image: 'https://psinv.net/wp-content/uploads/2021/04/off-plan-property-abu-dhabi.jpg', rating: 'AAA+' },
  { id: '2', name: 'Saadiyat Grove Residences', price: 'AED 3,800,000', match: 94, image: 'https://psinv.net/wp-content/uploads/2021/04/investment-guide.jpg', rating: 'AA' },
  { id: '3', name: 'Yas Golf Collection', price: 'AED 1,200,000', match: 89, image: 'https://psinv.net/wp-content/uploads/2021/04/property-management.jpg', rating: 'A+' },
  { id: '4', name: 'Reem Hills Sanctuary', price: 'AED 5,100,000', match: 87, image: 'https://psinv.net/wp-content/uploads/2021/04/mortgage-services.jpg', rating: 'AAA' }
];

export const AIMatchmaker: React.FC = () => {
  return (
    <section className="space-y-8 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-psi-gold/10 rounded-2xl flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI Matchmaker</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Behavior-Driven Recommendations</p>
          </div>
        </div>
        <button className="text-[10px] font-black uppercase text-psi-gold hover:underline tracking-widest flex items-center gap-2">
          View All Suggestions <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto custom-scrollbar pb-8 px-2 -mx-2">
        {SUGGESTED.map((prop) => (
          <div key={String(prop.id)} className="min-w-[320px] group relative bg-slate-950/40 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-psi-gold/40 transition-all duration-700 shadow-2xl">
            <div className="h-48 overflow-hidden relative">
              <img src={prop.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60" alt={prop.name} />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-psi-gold border border-psi-gold/20">
                   Rating: {String(prop.rating)}
                </span>
                <button className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-rose-500 transition-colors">
                  <Heart size={16} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-4 py-1.5 bg-psi-gold text-obsidian rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <ShieldCheck size={12} /> {String(prop.match)}% Portfolio Match
                </span>
              </div>
            </div>
            
            <div className="p-8 space-y-2">
              <h4 className="text-white font-black text-lg tracking-tight uppercase group-hover:text-psi-gold transition-colors">{String(prop.name)}</h4>
              <p className="text-psi-gold font-mono text-sm font-bold tracking-tight">{String(prop.price)}</p>
              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                   <Star size={10} className="fill-psi-gold text-psi-gold" /> Premium Selection
                </span>
                <ArrowRight size={16} className="text-slate-700 group-hover:text-psi-gold group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};