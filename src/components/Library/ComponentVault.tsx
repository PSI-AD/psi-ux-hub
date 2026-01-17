import React, { useState } from 'react';
import { ComponentCategory, UIComponent, PSIProject } from '../../types/index';
import { Package, Copy, CheckCircle2, Layout, Palette, Type as FontIcon, ShieldCheck, Search, Code2, Cpu, Terminal, X, ChevronRight } from 'lucide-react';

interface ComponentVaultProps {
  project: PSIProject;
  onCopyCode: (code: string) => void;
}

export const ComponentVault: React.FC<ComponentVaultProps> = ({ project, onCopyCode }) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingComponent, setInspectingComponent] = useState<UIComponent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const components = project.uiVault || [];
  const filtered = components.filter(c => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (code: string, id: string) => {
    onCopyCode(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TokenBadge = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[9px] font-mono text-psi-gold truncate max-w-[80px]">{value}</span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-obsidian animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col gap-8 border-b border-white/10 pb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                <Package className="text-psi-gold" size={40} /> Library Vault
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] mt-2">Approved Design Assets & Architectural Atoms</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-psi-gold transition-colors" />
                <input 
                  type="text"
                  placeholder="SEARCH VAULT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black tracking-widest text-white focus:border-psi-gold/50 outline-none w-64 transition-all"
                />
              </div>
              <div className="px-6 py-3 bg-psi-gold/10 border border-psi-gold/20 rounded-xl flex items-center gap-3">
                 <ShieldCheck size={18} className="text-psi-gold" />
                 <span className="text-[10px] font-black uppercase text-psi-gold tracking-widest">{components.length} ASSETS SECURED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {['ALL', ...Object.values(ComponentCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-psi-gold text-obsidian border-psi-gold shadow-lg' 
                    : 'bg-white/5 text-slate-500 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((component) => (
            <div key={component.id} className="group glass-card overflow-hidden flex flex-col hover:border-psi-gold/40 transition-all duration-500">
               {/* Preview Section */}
               <div className="h-48 bg-slate-950 flex items-center justify-center relative p-8 pattern-grid">
                  <div className="transform scale-90 group-hover:scale-100 transition-transform duration-700 pointer-events-none opacity-80 group-hover:opacity-100">
                     <span className="text-psi-gold/30 font-luxury text-3xl italic font-black uppercase tracking-widest">
                       {component.name.replace(/([A-Z])/g, ' $1').trim()}
                     </span>
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-slate-500 tracking-widest">
                       {component.category}
                     </span>
                  </div>
                  <button 
                    onClick={() => setInspectingComponent(component)}
                    className="absolute bottom-4 right-4 p-2 bg-obsidian border border-white/10 rounded-lg text-slate-500 hover:text-psi-gold hover:border-psi-gold/50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Code2 size={16} />
                  </button>
               </div>

               {/* Info Section */}
               <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <div>
                     <h3 className="text-white font-black text-sm uppercase tracking-wider mb-1">{component.name}</h3>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">v1.0.0 • SYNTHESIZED {new Date(component.timestamp).toLocaleDateString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                     <TokenBadge label="Primary" value={component.tokens.primaryColor} />
                     <TokenBadge label="Radius" value={component.tokens.radius} />
                     <TokenBadge label="Spacing" value={component.tokens.spacing} />
                     <TokenBadge label="Typeface" value={component.tokens.typography} />
                  </div>

                  <button 
                    onClick={() => handleCopy(component.code, component.id)}
                    className={`mt-auto w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                      copiedId === component.id ? 'bg-emerald-500 text-obsidian shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border border-white/10 text-slate-400 hover:bg-psi-gold hover:text-obsidian hover:border-psi-gold shadow-xl'
                    }`}
                  >
                    {copiedId === component.id ? <CheckCircle2 size={16} /> : <Terminal size={14} />}
                    {copiedId === component.id ? 'TOKEN COPIED' : 'GET REACT CODE'}
                  </button>
               </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20 text-center">
            <Package size={80} className="mb-6 text-slate-800" />
            <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-700">Vault Archive Offline</h3>
            <p className="text-[10px] uppercase font-bold text-slate-800 mt-2">Accept a redesign sprint to extract new design tokens</p>
          </div>
        )}
      </div>

      {/* Code Inspector Sidebar */}
      {inspectingComponent && (
        <div className="fixed inset-0 z-[120] flex justify-end">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setInspectingComponent(null)} />
           <div className="relative w-full max-w-2xl bg-[#050505] border-l border-white/10 flex flex-col h-full animate-in slide-in-from-right duration-500">
              <header className="p-8 border-b border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-psi-gold/10 rounded-xl flex items-center justify-center text-psi-gold">
                       <Cpu size={20} />
                    </div>
                    <div>
                       <h3 className="text-white font-black uppercase tracking-widest">{inspectingComponent.name}</h3>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">DEVELOPER HANDOFF SPECS</p>
                    </div>
                 </div>
                 <button onClick={() => setInspectingComponent(null)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-psi-gold">Implementation Snippet</h4>
                    <div className="relative group">
                       <pre className="p-6 bg-obsidian border border-white/5 rounded-2xl overflow-x-auto text-[11px] leading-relaxed font-mono text-emerald-400">
                          <code>{inspectingComponent.code}</code>
                       </pre>
                       <button 
                        onClick={() => handleCopy(inspectingComponent.code, 'inspector')}
                        className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-psi-gold hover:text-obsidian rounded-lg transition-all"
                       >
                          {copiedId === 'inspector' ? <CheckCircle2 size={14}/> : <Copy size={14}/>}
                       </button>
                    </div>
                 </section>

                 <section className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-psi-gold">Design Tokens</h4>
                       <div className="space-y-3">
                          {Object.entries(inspectingComponent.tokens).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                               <span className="text-[9px] font-bold text-slate-500 uppercase">{key}</span>
                               <span className="text-[9px] font-black text-white uppercase tracking-tighter">{val}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-psi-gold">Standards Compliance</h4>
                       <div className="space-y-3">
                          {[
                            { label: 'Responsive', status: 'AAA' },
                            { label: 'Accessibility', status: 'WCAG 2.1' },
                            { label: 'Framework', status: 'React 19' },
                            { label: 'Styling', status: 'Tailwind v4' }
                          ].map(std => (
                            <div key={std.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                               <span className="text-[9px] font-bold text-slate-500 uppercase">{std.label}</span>
                               <span className="text-[9px] font-black text-psi-gold uppercase tracking-tighter">{std.status}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </section>
              </div>

              <div className="p-8 border-t border-white/10 bg-black">
                 <button 
                  onClick={() => handleCopy(inspectingComponent.code, 'final')}
                  className="w-full py-5 bg-psi-gold text-obsidian rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    {copiedId === 'final' ? <CheckCircle2 size={18} /> : <Terminal size={18} />}
                    {copiedId === 'final' ? 'SYSTEM TOKEN COPIED' : 'COPY COMPONENT SOURCE'}
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .pattern-grid {
          background-image: radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};
