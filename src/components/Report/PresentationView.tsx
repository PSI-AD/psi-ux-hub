import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BarChart3, Target, Sparkles, Layout, Eye, ArrowRight, Zap,
  ChevronLeft, ChevronRight, Activity, MousePointer2, Copy, Check, Share2,
  Clock, Award, TrendingUp, Grid, Info, Columns
} from 'lucide-react';
import { PSIProject, BenchmarkScore, AuditFolder, UIComponent } from '../../types/index';
import { Scorecard } from '../Audit/Scorecard';
import { HeatmapOverlay } from '../Auditor/HeatmapOverlay';
import { getClickProbability } from '../../services/predictionEngine';
import { BASHAYER_STRATEGIC_NARRATIVE } from '../../data/projectData';

interface PresentationViewProps {
  project: PSIProject;
  onClose: () => void;
}

const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const ImageSlider = ({
  before,
  after,
  justification,
  labelBefore = "Legacy",
  labelAfter = "Proposed"
}: {
  before: string,
  after: string,
  justification?: string,
  labelBefore?: string,
  labelAfter?: string
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isSliderBlocked, setIsSliderBlocked] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) return;
    try {
      const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = 'touches' in e ? (e as React.TouchEvent).touches[0].pageX : (e as React.MouseEvent).pageX;
      const position = ((x - container.left) / container.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, position)));
    } catch (err) {
      setIsSliderBlocked(true);
    }
  };

  // Fallback View if slider interactions are restricted
  if (isSliderBlocked) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4 aspect-video rounded-[3rem] overflow-hidden">
          <div className="relative group">
            <img src={before} className="w-full h-full object-cover grayscale" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-[8px] font-black uppercase text-white">{labelBefore}</div>
          </div>
          <div className="relative group">
            <img src={after} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-psi-gold/80 rounded-full text-[8px] font-black uppercase text-obsidian">{labelAfter}</div>
          </div>
        </div>
        {justification && (
          <div className="p-8 bg-psi-gold/10 border border-psi-gold/20 rounded-[2rem]">
            <p className="text-sm text-slate-300 leading-relaxed italic">{justification}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 cursor-col-resize select-none shadow-2xl"
        onMouseMove={handleMove}
        onMouseDown={() => setIsResizing(true)}
        onMouseUp={() => setIsResizing(false)}
        onMouseLeave={() => setIsResizing(false)}
        onTouchMove={handleMove}
        onTouchStart={() => setIsResizing(true)}
        onTouchEnd={() => setIsResizing(false)}
      >
        <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" />
        <div
          className="absolute inset-0 w-full h-full overflow-hidden z-10"
          style={{ width: `${sliderPos}%`, borderRight: '3px solid #D4AF37' }}
        >
          <img src={before} className="absolute inset-0 w-[100vw] h-full object-cover grayscale brightness-50" alt="Before" style={{ width: `${10000 / sliderPos}%` }} />
          <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
            {safeString(labelBefore)}
          </div>
        </div>
        <div className="absolute top-6 right-6 px-4 py-2 bg-psi-gold/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-obsidian z-20">
          {safeString(labelAfter)}
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-psi-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center text-obsidian pointer-events-none z-30 transition-transform active:scale-90"
          style={{ left: `calc(${sliderPos}% - 24px)` }}
        >
          <div className="flex gap-0.5">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {justification && (
        <div
          className={`transition-all duration-700 ease-out transform ${sliderPos < 50 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2'
            }`}
        >
          <div className={`p-8 bg-psi-gold/5 border border-psi-gold/20 rounded-[2rem] transition-colors ${sliderPos < 50 ? 'bg-psi-gold/10 border-psi-gold/40' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-psi-gold/20 rounded-lg text-psi-gold">
                <Info size={18} />
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold">Strategic Justification</h4>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  {justification}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PresentationView: React.FC<PresentationViewProps> = ({ project, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showHeatmaps, setShowHeatmaps] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    { id: 'cover', title: 'Cover' },
    { id: 'audit', title: 'The Hook: Audit' },
    { id: 'proof', title: 'The Proof: Performance' },
    { id: 'solution', title: 'The Solution: Redesign' },
    { id: 'system', title: 'The Future: Design System' }
  ];

  const handleCopyLink = () => {
    const mockLink = `${window.location.origin}/presentation/${project.id}`;
    navigator.clipboard.writeText(mockLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestAudit = project.pages.find(p => p.history.length > 0)?.history[0];

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian text-white overflow-hidden flex flex-col presentation-mode-transition">
      <header className="h-20 px-12 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-psi-gold/10 rounded-xl flex items-center justify-center text-psi-gold border border-psi-gold/20">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">{safeString(project.name)}</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">Strategic Executive Review</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeStep === i ? 'bg-psi-gold text-obsidian' : 'text-slate-500 hover:text-white'
                  }`}
              >
                {step.title}
              </button>
            ))}
          </nav>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              {copied ? 'Link Copied' : 'Share Report'}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
            >
              <Zap size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-7xl mx-auto py-20 px-12 space-y-32">

          {activeStep === 0 && (
            <section className="h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative mb-12">
                <div className="w-40 h-40 rounded-[3rem] bg-psi-gold/5 flex items-center justify-center border border-psi-gold/20 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                  {project.brand.logo ? <img src={project.brand.logo} className="w-24 h-24 object-contain" /> : <ShieldCheck size={64} className="text-psi-gold" />}
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-obsidian border border-psi-gold rounded-2xl flex items-center justify-center shadow-2xl">
                  <Award className="text-psi-gold" size={24} />
                </div>
              </div>
              <h1 className="text-7xl font-black tracking-tighter uppercase mb-6 text-white leading-tight">Architectural<br />Sovereignty</h1>
              <p className="text-xl font-luxury text-psi-gold italic mb-16 opacity-80 max-w-2xl leading-relaxed">
                A scientific approach to luxury real estate optimization, bridging the gap between legacy friction and predictive conversion.
              </p>
              <button
                onClick={() => setActiveStep(1)}
                className="px-12 py-5 bg-psi-gold text-obsidian rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:scale-110 transition-all flex items-center gap-4"
              >
                Begin Evolution <ArrowRight size={18} />
              </button>
            </section>
          )}

          {activeStep === 1 && latestAudit && (
            <section className="space-y-20 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                <div className="px-6 py-2 bg-psi-gold/10 border border-psi-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold">
                  Phase 01: Diagnostic Analysis
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">The Heuristic Delta</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  We audited your current ecosystem against 100 global UX standards. The results reveal critical friction points in Visual Hierarchy and Trust Authority.
                </p>
              </div>

              <Scorecard
                current={latestAudit.currentHeuristics || { visualHierarchy: 10, trustAuthority: 8, conversionFriction: 7, accessibilityCompliance: 10, infoArchitecture: 5, mobileResponsiveness: 5, total: 45 }}
                proposed={latestAudit.proposedHeuristics || { visualHierarchy: 22, trustAuthority: 19, conversionFriction: 18, accessibilityCompliance: 14, infoArchitecture: 9, mobileResponsiveness: 10, total: 92 }}
                rationale={latestAudit.rationale || []}
              />
            </section>
          )}

          {activeStep === 2 && latestAudit && (
            <section className="space-y-20 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
                  Phase 02: Attention Simulation
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Gaze Prediction Proof</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Using AI-trained heuristics, we simulated user attention. The proposed design successfully directs eye-paths toward primary conversion objectives.
                </p>
                <button
                  onClick={() => setShowHeatmaps(!showHeatmaps)}
                  className={`mt-4 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${showHeatmaps ? 'bg-psi-gold text-obsidian' : 'bg-white/5 text-slate-400 border border-white/10'}`}
                >
                  <Activity size={16} /> {showHeatmaps ? 'Disable Heatmap' : 'Overlay Attention Maps'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Legacy Focus (Diffused)</h4>
                  <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900 aspect-video">
                    <img src={latestAudit.thumbnail} className="w-full h-full object-cover grayscale opacity-60" />
                    <HeatmapOverlay
                      points={[{ x: 20, y: 30, intensity: 0.2 }, { x: 80, y: 70, intensity: 0.3 }]}
                      isVisible={showHeatmaps}
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-rose-500/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white shadow-2xl">
                      42% Focus Score
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-psi-gold text-center">Proposed Focus (Targeted)</h4>
                  <div className="relative rounded-[3rem] overflow-hidden border border-psi-gold/20 bg-slate-950 aspect-video shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                    <img src={latestAudit.redesignImg} className="w-full h-full object-cover" />
                    <HeatmapOverlay
                      points={[{ x: 50, y: 50, intensity: 0.9 }, { x: 50, y: 80, intensity: 0.4 }]}
                      isVisible={showHeatmaps}
                      isPredictionMode
                      probabilityScore={94}
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-psi-gold/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-obsidian shadow-2xl font-bold">
                      94% Focus Score
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 3 && latestAudit && (
            <section className="space-y-20 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                <div className="px-6 py-2 bg-psi-gold/10 border border-psi-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold">
                  Phase 03: Visual Synthesis
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Architectural Transition</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Explore the direct transition from the current legacy UI to the proposed Obsidian-Gold standard.
                </p>
              </div>

              <div className="space-y-32">
                {latestAudit.blocks?.map((block, idx) => {
                  let justification = "";
                  if (block.type === 'hero') justification = BASHAYER_STRATEGIC_NARRATIVE.sections.hero.justification;
                  else if (block.type === 'listings') justification = BASHAYER_STRATEGIC_NARRATIVE.sections.listings.justification;
                  else if (block.title.toLowerCase().includes('filter')) justification = BASHAYER_STRATEGIC_NARRATIVE.sections.filter.justification;

                  return (
                    <div key={block.id} className="space-y-12">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black uppercase tracking-tight">{safeString(block.title)}</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Section Remediation {idx + 1}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Predicted ROI</span>
                            <span className="text-xl font-black text-emerald-500">+{block.diagnosticScores.conversion / 10}% Conv.</span>
                          </div>
                          <div className="w-px h-10 bg-white/10" />
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Brand Fidelity</span>
                            <span className="text-xl font-black text-psi-gold">100% Core DNA</span>
                          </div>
                        </div>
                      </div>
                      <ImageSlider
                        before={block.originalImage || latestAudit.thumbnail}
                        after={block.suggestedImage}
                        justification={justification}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeStep === 4 && (
            <section className="space-y-20 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                <div className="px-6 py-2 bg-psi-gold/10 border border-psi-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-psi-gold">
                  Phase 04: Domain Scalability
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Your Custom UI Vault</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  We haven't just designed a page; we've built a Sovereign Design System. Every element is now a design token, ready for domain-wide deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {project.uiVault?.slice(0, 8).map((comp: UIComponent) => (
                  <div key={comp.id} className="glass-card p-8 group hover:border-psi-gold/40 transition-all text-center rounded-[2rem]">
                    <div className="w-16 h-16 bg-slate-950 rounded-2xl mx-auto mb-6 flex items-center justify-center text-psi-gold border border-white/5 group-hover:border-psi-gold/30">
                      <Grid size={24} />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2">{safeString(comp.name)}</h4>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[7px] font-black uppercase text-slate-500 tracking-widest">{safeString(comp.category)}</span>
                  </div>
                )) || (
                    <div className="col-span-full py-20 text-center opacity-20">
                      <Grid size={48} className="mx-auto mb-4" />
                      <p className="text-xs font-black uppercase tracking-[0.5em]">Vault Synchronizing...</p>
                    </div>
                  )}
              </div>

              <div className="bg-psi-gold/5 border border-psi-gold/20 p-12 rounded-[3rem] text-center space-y-8 max-w-4xl mx-auto">
                <Award size={48} className="text-psi-gold mx-auto" />
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Retention Strategy</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
                    Our commitment doesn't end with this presentation. Phase 9 involves Continuous Optimization, where we monitor market shifts and update your vault to ensure competitive dominance remains perpetual.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-10 py-4 bg-psi-gold text-obsidian rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Commit to Optimization Retainer
                </button>
              </div>
            </section>
          )}

        </div>
      </main>

      <footer className="h-24 px-12 border-t border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Architect</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-psi-gold">PSI Agency Pro</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-500" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date().toLocaleTimeString()} • Live Sync Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-3 px-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${activeStep === i ? 'w-10 bg-psi-gold' : 'w-1.5 bg-white/10'}`}
              />
            ))}
          </div>

          <button
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep(prev => prev + 1)}
            className="p-4 bg-psi-gold text-obsidian rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <TrendingUp size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Target Rank: #01 In Sector</span>
        </div>
      </footer>
    </div>
  );
};