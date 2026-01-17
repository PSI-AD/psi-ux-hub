import React from 'react';
import { DesignToken } from '../../types/index';
import { Package, Copy, CheckCircle2, Layout, Palette, Type as FontIcon, ShieldCheck } from 'lucide-react';

interface ComponentLibraryProps {
  tokens: DesignToken[];
  onCopyToken: (token: DesignToken) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ tokens, onCopyToken }) => {
  const categories = ['color', 'typography', 'component'];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-obsidian animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-16">
        <header className="flex items-center justify-between border-b border-white/10 pb-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <Package className="text-psi-gold" size={36} /> Global Component Vault
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] mt-2">Approved Design Tokens & Architectural Modules</p>
          </div>
          <div className="px-6 py-3 bg-psi-gold/10 border border-psi-gold/20 rounded-2xl flex items-center gap-3">
             <ShieldCheck size={20} className="text-psi-gold" />
             <span className="text-[10px] font-black uppercase text-psi-gold tracking-widest">{tokens.length} Assets Secured</span>
          </div>
        </header>

        {categories.map(cat => {
          const catTokens = tokens.filter(t => t.type === cat);
          if (catTokens.length === 0) return null;

          return (
            <section key={cat} className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-psi-gold flex items-center gap-3">
                {cat === 'color' ? <Palette size={16} /> : cat === 'typography' ? <FontIcon size={16} /> : <Layout size={16} />}
                {cat} Standards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catTokens.map(token => (
                  <div key={token.id} className="glass-card p-6 group hover:border-psi-gold/40 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       {cat === 'color' && (
                         <div className="w-10 h-10 rounded-lg shadow-lg border border-white/10" style={{ backgroundColor: token.value }} />
                       )}
                       <div>
                         <p className="text-white font-black text-[11px] uppercase tracking-wider">{token.name}</p>
                         <p className="text-[10px] text-slate-500 font-mono mt-1">{token.value}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => onCopyToken(token)}
                      className="p-3 text-slate-600 hover:text-psi-gold transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {tokens.length === 0 && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20">
            <Package size={64} className="mb-6" />
            <p className="text-sm font-black uppercase tracking-[0.4em]">Vault Synchronizing...</p>
          </div>
        )}
      </div>
    </div>
  );
};
