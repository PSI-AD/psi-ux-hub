import React from 'react';
import { PSIProject, BenchmarkScore } from '../../types/index';
import { ShieldCheck, BarChart3, Target, Sparkles, Layout, Eye, ArrowRight, Zap } from 'lucide-react';

interface ReportPreviewProps {
  project: PSIProject;
  benchmarks?: BenchmarkScore[];
}

const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const RadarChart = ({ scores }: { scores: BenchmarkScore[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const categories = scores.length;

  const getPoint = (score: number, index: number) => {
    const angle = (index * 2 * Math.PI) / categories - Math.PI / 2;
    const distance = (score / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  const clientPoints = scores.map((s, i) => getPoint(s.clientScore, i));
  const marketPoints = scores.map((s, i) => getPoint(s.competitorAvg, i));

  const formatPoints = (pts: { x: number; y: number }[]) => pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
          <polygon
            key={i}
            points={formatPoints(Array.from({ length: categories }).map((_, j) => getPoint(r * 100, j)))}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {/* Axis Lines */}
        {Array.from({ length: categories }).map((_, i) => {
          const p = getPoint(100, i);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.1)" />;
        })}
        {/* Market Polygon */}
        <polygon
          points={formatPoints(marketPoints)}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        {/* Client Polygon */}
        <polygon
          points={formatPoints(clientPoints)}
          fill="rgba(212, 175, 55, 0.15)"
          stroke="#D4AF37"
          strokeWidth="3"
        />
        {/* Labels */}
        {scores.map((s, i) => {
          const p = getPoint(115, i);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              fill="rgba(255,255,255,0.4)"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              className="uppercase tracking-widest"
            >
              {s.category}
            </text>
          );
        })}
      </svg>
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-psi-gold rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Client Experience</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-700 rounded-full border border-dashed border-white/50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Market Benchmark</span>
        </div>
      </div>
    </div>
  );
};

export const ReportPreview: React.FC<ReportPreviewProps> = ({ project, benchmarks }) => {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Default benchmarks if none provided
  const activeBenchmarks = benchmarks || [
    { category: 'Trust Signaling', clientScore: 65, competitorAvg: 85 },
    { category: 'Ease of Navigation', clientScore: 70, competitorAvg: 75 },
    { category: 'High-End Aesthetic', clientScore: 50, competitorAvg: 90 }
  ];

  return (
    <div id="luxury-report-container" className="bg-[#020617] text-white p-20 font-sans min-h-screen">
      {/* 1. TITLE PAGE */}
      <section className="h-[900px] flex flex-col items-center justify-center border-b border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 opacity-50" />
        <div className="w-48 h-48 rounded-[3rem] bg-psi-gold/10 flex items-center justify-center border border-psi-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-12">
          {project.brand.logo ? <img src={safeString(project.brand.logo)} className="w-24 h-24 object-contain" /> : <ShieldCheck className="text-psi-gold" size={64} />}
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-4 text-white">Luxury Transformation</h1>
        <p className="text-2xl font-luxury text-psi-gold italic mb-12">Architectural UX Synthesis & Market Optimization</p>
        <div className="h-px w-32 bg-psi-gold/30 mb-12" />
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white">{safeString(project.name)}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest">{safeString(project.baseUrl)}</p>
        </div>
        <p className="absolute bottom-20 text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">{date} • STRATEGIC MANDATE CONFIDENTIAL</p>
      </section>

      {/* 2. IDENTITY AUDIT */}
      <section className="py-32 space-y-20">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-psi-gold/10 flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Identity Audit</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Establishing the Brand Anchor</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="glass-card p-10 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-psi-gold">Aesthetic Profile</h4>
              <p className="text-lg text-slate-300 leading-relaxed font-luxury">"{project.brand.audit?.marketPositioning || 'A high-stakes market presence requiring elite-level visual refinement and structural clarity.'}"</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Primary Identity</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl shadow-xl" style={{ backgroundColor: project.brand.primaryColor }} />
                  <span className="text-xs font-mono font-bold text-white uppercase">{safeString(project.brand.primaryColor)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Secondary Identity</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl shadow-xl border border-white/10" style={{ backgroundColor: project.brand.secondaryColor }} />
                  <span className="text-xs font-mono font-bold text-white uppercase">{safeString(project.brand.secondaryColor)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Typography Architecture</h5>
              <p className="text-sm text-slate-400 leading-relaxed italic">"{project.brand.audit?.typographySuggestions || 'Recommended: Inter for functional UI, Playfair Display for luxury statements.'}"</p>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Market Insight</h5>
              <p className="text-sm text-slate-400 leading-relaxed italic">"{project.brand.audit?.industryInsights || 'Leveraging deep regional context to drive conversion in elite demographics.'}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MARKET BENCHMARKING */}
      <section className="py-32 space-y-20 border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-psi-gold/10 flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Market Benchmarking</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Competitive Landscape Performance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20 items-center">
          <RadarChart scores={activeBenchmarks} />
          <div className="space-y-10">
            <div className="space-y-4">
              <h4 className="text-lg font-black uppercase tracking-tighter">Competitive Analysis</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                By cross-referencing your digital touchpoints with market leaders ({project.competitors.length > 0 ? project.competitors.join(', ') : 'Industry Average'}), we identified significant gaps in <strong>High-End Aesthetic</strong> and <strong>Trust Signaling</strong>.
              </p>
            </div>
            <div className="space-y-6">
              {activeBenchmarks.map(b => (
                <div key={b.category} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{b.category}</span>
                    <span className={b.clientScore < b.competitorAvg ? 'text-rose-500' : 'text-emerald-500'}>
                      {b.clientScore < b.competitorAvg ? `-${b.competitorAvg - b.clientScore}% Under Market` : `+${b.clientScore - b.competitorAvg}% Leading`}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-psi-gold" style={{ width: `${b.clientScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISION JOURNEY */}
      <section className="py-32 space-y-20 border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-psi-gold/10 flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <Eye size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">The Vision Journey</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Current Experience vs. Proposed Luxury Vision</p>
          </div>
        </div>

        <div className="space-y-32">
          {project.pages.filter(p => p.history.length > 0).map((page, i) => {
            const latest = page.history[0];
            return (
              <div key={page.id} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black uppercase tracking-tighter">{i + 1}. {safeString(page.name)} Optimization</h4>
                  <div className="px-4 py-1.5 bg-psi-gold/10 border border-psi-gold/20 rounded-full text-[9px] font-black uppercase tracking-widest text-psi-gold">
                    Strategic Commitment Applied
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">Legacy Interface</p>
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900 aspect-video">
                      <img src={latest.thumbnail} className="w-full h-full object-cover grayscale opacity-40" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-psi-gold text-center">Proposed Revision</p>
                    <div className="rounded-[2.5rem] overflow-hidden border border-psi-gold/30 bg-slate-950 aspect-video shadow-[0_20px_60px_rgba(212,175,55,0.1)]">
                      <img src={latest.redesignImg} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {latest.uxIssues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} className="glass-card p-6 border-l-2 border-l-psi-gold">
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{issue}"</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. STRATEGIC IMPROVEMENTS */}
      <section className="py-32 space-y-20 border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-psi-gold/10 flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Strategic Commitments</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">High-Impact Remediation Vectors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Obsidian Aesthetics', desc: 'Transitioning to deep contrasts and glassmorphic textures to signify professional stability and luxury exclusivity.' },
            { title: 'Frictionless Architecture', desc: 'Removing structural noise to ensure the most critical business paths (Properties, Financing) are cleared for conversion.' },
            { title: 'Market Convergence', desc: 'Aligning UX density with top-tier UAE competitors to prevent user migration due to interface frustration.' },
            { title: 'Brand Cohesion', desc: 'Extracting and enforcing brand DNA across every module, ensuring a unified global presence.' }
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 flex gap-8 items-start hover:bg-white/5 transition-all">
              <div className="text-3xl font-black text-psi-gold/20 font-luxury">{i + 1}</div>
              <div className="space-y-2">
                <h5 className="text-sm font-black uppercase tracking-widest text-white">{item.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL PAGE */}
      <section className="py-40 text-center border-t border-white/10 space-y-12">
        <div className="w-20 h-20 rounded-3xl bg-psi-gold/10 border border-psi-gold/30 flex items-center justify-center text-psi-gold mx-auto">
          <Zap size={32} />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Ready for Implementation</h3>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">The proposed luxury vision is backed by market benchmarking and brand-faithful synthesis. All code fixes are ready for production deployment via the Agency Pro Vault.</p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-800 pt-20">Property Shop Investment Architectural Control Hub</p>
      </section>
    </div>
  );
};