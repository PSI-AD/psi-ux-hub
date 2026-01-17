import React, { useRef, useState, useMemo } from 'react';
import {
  Camera, Search, Globe, Upload, ShieldCheck, Target, Sparkles, RefreshCw,
  Eye, X, ListTodo, Zap, Palette, Layout,
  Plus, Trash2, BarChart3, Users, FileText, Briefcase, UserCheck, CheckCircle2, ShieldAlert, BookmarkCheck
} from 'lucide-react';
import { PSIProject } from '../../types/index';
import { generateReport } from '../../services/reportService';
import { ReportPreview } from '../Report/ReportPreview';
import { extractBrandDNA } from '../../services/geminiService';
import { checkProjectReadiness } from '../../services/projectService';

interface ProjectSettingsProps {
  project: PSIProject;
  onUpdate: (updates: Partial<PSIProject>) => void;
  onLogoUpload: (base64: string) => void;
  onRunScan: () => void;
  onRunBrandAudit: () => void;
  toggleChecklistItem?: (itemId: string) => void;
  isProcessing: boolean;
}

type SettingsTab = 'brand' | 'market' | 'analytics' | 'standards' | 'architecture' | 'status';

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

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  project,
  onUpdate,
  onLogoUpload,
  onRunScan,
  onRunBrandAudit,
  toggleChecklistItem,
  isProcessing
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const guidelinesInputRef = useRef<HTMLInputElement>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExtractingDNA, setIsExtractingDNA] = useState(false);
  const [isScanningCompetitors, setIsScanningCompetitors] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('brand');

  const readiness = useMemo(() => checkProjectReadiness(project), [project]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onLogoUpload(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtractDNA = async () => {
    if (!project.brand?.logo) return;
    setIsExtractingDNA(true);
    try {
      const dna = await extractBrandDNA(project.brand.logo, project.baseUrl);
      onUpdate({ brand: { ...project.brand, dna } });
    } catch (err) {
      console.error("DNA Extraction failed", err);
    } finally {
      setIsExtractingDNA(false);
    }
  };

  const handleScanCompetitors = async () => {
    setIsScanningCompetitors(true);
    setTimeout(() => setIsScanningCompetitors(false), 3000);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await generateReport('luxury-report-container', safeString(project.name || 'PSI-Project'));
    } catch (err) {
      console.error("Report export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const updateList = (field: 'competitors' | 'inspirationUrls', index: number, value: string) => {
    const newList = [...(project[field] || [])];
    newList[index] = value;
    onUpdate({ [field]: newList });
  };

  const addToList = (field: 'competitors' | 'inspirationUrls') => {
    onUpdate({ [field]: [...(project[field] || []), ''] });
  };

  const removeFromList = (field: 'competitors' | 'inspirationUrls', index: number) => {
    const newList = [...(project[field] || [])];
    newList.splice(index, 1);
    onUpdate({ [field]: newList });
  };

  const progress = useMemo(() => {
    if (!project.checklist || project.checklist.length === 0) return 0;
    const completed = project.checklist.filter(item => item.completed).length;
    return Math.round((completed / project.checklist.length) * 100);
  }, [project.checklist]);

  const TabButton = ({ id, icon: Icon, label }: { id: SettingsTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 pb-4 text-[10px] font-bold uppercase tracking-wide border-b-2 transition-all ${activeTab === id ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-[var(--text-primary)]'
        }`}
    >
      <Icon size={14} />
      {safeString(label)}
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-background animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-12 pb-32">

        {/* Header Unit */}
        <header className="flex flex-col gap-8 border-b border-border pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className="w-24 h-24 rounded-2xl bg-surface flex items-center justify-center border border-border shadow-sm overflow-hidden cursor-pointer group hover:border-primary transition-all"
                onClick={() => logoInputRef.current?.click()}
              >
                {project.brand?.logo ? (
                  <img src={safeString(project.brand.logo)} className="w-full h-full object-contain" alt="Logo" />
                ) : (
                  <ShieldCheck className="text-primary" size={40} />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
              <div>
                <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight uppercase">{safeString(project.name || "UNNAMED PROJECT")}</h2>
                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-[0.4em] mt-1">Sovereign Command Center</p>
              </div>
            </div>

            <div className="flex gap-4">
              {!readiness.isReady && (
                <div className="flex flex-col items-end justify-center mr-4">
                  <p className="text-[9px] font-medium text-rose-500 uppercase tracking-widest mb-1">Intelligence Gap Detected</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{safeString((readiness.missing || []).length)} Prerequisites Pending</p>
                </div>
              )}
              <button
                onClick={handleExtractDNA}
                disabled={isExtractingDNA || !project.brand?.logo}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:scale-105 transition-all disabled:opacity-50 ${project.brand?.dna ? 'bg-surface text-primary border border-primary/30' : 'bg-primary text-white'}`}
              >
                {isExtractingDNA ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
                {project.brand?.dna ? 'DNA Synchronized' : 'Sync Brand DNA'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 border-b border-border">
            <TabButton id="brand" icon={Palette} label="Brand DNA" />
            <TabButton id="market" icon={Target} label="Market Intel" />
            <TabButton id="analytics" icon={BarChart3} label="Persona & KPIs" />
            <TabButton id="standards" icon={BookmarkCheck} label="Industry Standards" />
            <TabButton id="architecture" icon={Layout} label="Architecture" />
            <TabButton id="status" icon={ListTodo} label="Status" />
          </div>
        </header>

        <main className="min-h-[500px]">
          {/* TAB: BRAND DNA */}
          {activeTab === 'brand' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> Project Mission Statement
                    </label>
                    <textarea
                      value={safeString(project.brand?.mission || "")}
                      onChange={(e) => onUpdate({ brand: { ...project.brand, mission: e.target.value } })}
                      className="w-full bg-surface border border-border rounded-xl p-6 text-sm text-[var(--text-primary)] min-h-[140px] focus:border-primary outline-none transition-all placeholder:text-slate-400"
                      placeholder="Define the soul of the project..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                      <Eye size={14} className="text-primary" /> Architectural Vision
                    </label>
                    <textarea
                      value={safeString(project.brand?.vision || "")}
                      onChange={(e) => onUpdate({ brand: { ...project.brand, vision: e.target.value } })}
                      className="w-full bg-surface border border-border rounded-xl p-6 text-sm text-[var(--text-primary)] min-h-[140px] focus:border-primary outline-none transition-all placeholder:text-slate-400"
                      placeholder="Where is the development going?"
                    />
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-surface border border-border p-10 space-y-8 rounded-3xl">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <ShieldCheck size={16} /> Asset Sovereignty
                    </h4>
                    <div
                      className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={() => guidelinesInputRef.current?.click()}
                    >
                      <Upload size={48} className="mx-auto text-slate-400 mb-6 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Brand Identity Kit (PDF)</p>
                      <input type="file" ref={guidelinesInputRef} className="hidden" accept=".pdf" />
                    </div>

                    {project.brand?.dna ? (
                      <div className="space-y-6 pt-4">
                        <div className="h-px bg-border" />
                        <h5 className="text-[9px] font-bold uppercase text-[var(--text-secondary)] tracking-widest">Extracted Design Tokens</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-background rounded-lg border border-border">
                            <p className="text-[7px] font-bold text-slate-400 uppercase mb-1">Theme</p>
                            <p className="text-[10px] text-primary font-bold italic truncate">{safeString(project.brand.dna?.typography?.tone || "Standard Luxury")}</p>
                          </div>
                          <div className="p-4 bg-background rounded-lg border border-border">
                            <p className="text-[7px] font-bold text-slate-400 uppercase mb-1">Primary Color</p>
                            <p className="text-[10px] text-[var(--text-primary)] font-bold truncate">{safeString(project.brand.dna?.colors?.primary || "#FFFFFF")}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[9px] text-slate-500 uppercase italic text-center">Sync Logo DNA to extract high-fidelity tokens.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MARKET INTEL */}
          {activeTab === 'market' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center bg-primary/5 border border-primary/20 p-8 rounded-2xl">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Adversary Intelligence Mapping</h4>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase font-bold">Grouped competitor URLs for batch benchmarking.</p>
                  </div>
                </div>
                <button
                  onClick={handleScanCompetitors}
                  disabled={isScanningCompetitors || (project.competitors || []).length < 1}
                  className="px-8 py-3 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-primary-hover transition-all disabled:opacity-50"
                >
                  {isScanningCompetitors ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                  Batch Scan All Competitors
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">Direct Competitors (URLs)</h4>
                    <button onClick={() => addToList('competitors')} className="p-2 bg-primary text-white rounded-lg hover:scale-105 shadow-sm"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-4">
                    {(project.competitors || []).map((url, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          type="text"
                          value={safeString(url || "")}
                          onChange={(e) => updateList('competitors', idx, e.target.value)}
                          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-xs text-[var(--text-primary)] focus:border-primary outline-none transition-all"
                          placeholder="https://competitor-domain.com"
                        />
                        <button onClick={() => removeFromList('competitors', idx)} className="p-3 text-rose-500/50 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    ))}
                    {(project.competitors || []).length === 0 && (
                      <p className="text-[9px] text-slate-500 uppercase italic py-4 text-center border border-dashed border-border rounded-lg">No competitors mapped.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)]">Reference Aspiration URLs</h4>
                    <button onClick={() => addToList('inspirationUrls')} className="p-2 bg-surface text-primary border border-primary/20 rounded-lg hover:scale-105"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-4">
                    {(project.inspirationUrls || []).map((url, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          type="text"
                          value={safeString(url || "")}
                          onChange={(e) => updateList('inspirationUrls', idx, e.target.value)}
                          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-xs text-[var(--text-primary)] focus:border-primary outline-none transition-all"
                          placeholder="https://luxury-inspiration.com"
                        />
                        <button onClick={() => removeFromList('inspirationUrls', idx)} className="p-3 text-rose-500/50 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    ))}
                    {(project.inspirationUrls || []).length === 0 && (
                      <p className="text-[9px] text-slate-500 uppercase italic py-4 text-center border border-dashed border-border rounded-lg">No inspiration references added.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS & KPIs */}
          {activeTab === 'analytics' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-surface border border-border p-12 space-y-10 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                      <UserCheck size={28} />
                    </div>
                    <h4 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">Persona Builder</h4>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Target Demographic Profiles</p>
                    <textarea
                      value={safeString(project.businessObjectives?.targetAudience || "")}
                      onChange={(e) => onUpdate({ businessObjectives: { ...project.businessObjectives, targetAudience: e.target.value } })}
                      className="w-full bg-background border border-border rounded-2xl p-8 text-sm text-[var(--text-primary)] min-h-[220px] outline-none focus:border-primary transition-all"
                      placeholder="• HNWIs in Abu Dhabi/Dubai
• International off-plan investors
• First-time luxury buyers..."
                    />
                  </div>
                </div>
                <div className="bg-surface border border-border p-12 space-y-10 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <BarChart3 size={28} />
                    </div>
                    <h4 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">Strategic KPIs</h4>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Business Success Thresholds</p>
                    <textarea
                      value={safeString(project.businessObjectives?.primaryKPIs || "")}
                      onChange={(e) => onUpdate({ businessObjectives: { ...project.businessObjectives, primaryKPIs: e.target.value } })}
                      className="w-full bg-background border border-border rounded-2xl p-8 text-sm text-[var(--text-primary)] min-h-[220px] outline-none focus:border-primary transition-all"
                      placeholder="Identify the numerical targets for this audit..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INDUSTRY STANDARDS */}
          {activeTab === 'standards' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Niche Intelligence: {safeString(project.industry || "General")}</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em] mt-2">Cross-referencing domain against Platinum Sector Benchmarks</p>
                </div>
                <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest">AI Verification Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(project.industryStandards || []).map((group, gIdx) => (
                  <div key={gIdx} className="space-y-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-3">{safeString(group.name || "Untitled Group")}</h4>
                    <div className="space-y-4">
                      {(group.items || []).map((item) => (
                        <div key={safeString(item.id)} className="bg-surface border border-border p-5 rounded-xl group/item hover:border-primary/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-tighter border ${item.type === 'must-have' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                              item.type === 'recommended' ? 'bg-primary/10 text-primary border-primary/20' :
                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              }`}>
                              {safeString(item.type || "unknown")}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.status === 'checked-ai' ? (
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                  <CheckCircle2 size={12} />
                                  <span className="text-[8px] font-bold uppercase tracking-widest">Detected</span>
                                </div>
                              ) : item.status === 'missing' ? (
                                <div className="flex items-center gap-1.5 text-rose-500">
                                  <ShieldAlert size={12} />
                                  <span className="text-[8px] font-bold uppercase tracking-widest">Missing</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <RefreshCw size={12} />
                                  <span className="text-[8px] font-bold uppercase tracking-widest">Verify</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <h5 className="text-[11px] font-bold text-[var(--text-primary)] mb-1">{safeString(item.label || "Untitled Component")}</h5>
                          <p className="text-[9px] text-[var(--text-secondary)] leading-tight group-hover/item:text-[var(--text-primary)] transition-colors">{safeString(item.description || "No description provided.")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <section className="bg-surface border border-dashed border-border p-10 rounded-3xl flex items-center justify-between">
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center text-primary border border-border shadow-lg">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight">Compliance ROI Narrative</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Filling niche gaps adds approximately <strong>+18%</strong> to predicted conversion rate.</p>
                  </div>
                </div>
                <button className="px-8 py-3 bg-white/5 border border-border text-[var(--text-primary)] rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Refine Niche Standard</button>
              </section>
            </div>
          )}

          {/* TAB: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2"><Globe size={14} /> Domain Root</label>
                  <input
                    type="text"
                    value={safeString(project.baseUrl || "")}
                    disabled
                    className="w-full bg-surface border border-border rounded-xl p-5 text-slate-500 font-mono text-sm cursor-not-allowed"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2"><Briefcase size={14} /> Industry Sector</label>
                  <input
                    type="text"
                    value={safeString(project.industry || "")}
                    onChange={(e) => onUpdate({ industry: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl p-5 text-[var(--text-primary)] focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <section className="bg-surface border border-border p-12 text-center space-y-8 rounded-3xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Executive Transformation Summary</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">Compile current intelligence into a high-fidelity client presentation.</p>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setShowReportPreview(true)} className="px-10 py-4 bg-background border border-border text-[var(--text-primary)] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all">Preview Mode</button>
                  <button onClick={handleExportReport} className="px-10 py-4 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-primary-hover transition-all">Generate Package</button>
                </div>
              </section>
            </div>
          )}

          {/* TAB: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between border-b border-border pb-10">
                <div>
                  <h4 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Project Integrity Status</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em] mt-2">Prerequisites for Phase 1 Architectural Analysis</p>
                </div>
                <div className="text-right">
                  <span className={`text-5xl font-black font-mono tracking-tighter ${readiness.isReady ? 'text-emerald-500' : 'text-primary'}`}>
                    {readiness.isReady ? '100' : safeString(progress)}%
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Audit Stability Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(project.checklist || []).map((item) => (
                  <div
                    key={safeString(item.id || Math.random().toString())}
                    onClick={() => toggleChecklistItem?.(item.id)}
                    className={`p-8 rounded-[2rem] border cursor-pointer transition-all flex flex-col gap-6 group ${item.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-surface border-border hover:border-primary/40'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold uppercase text-slate-500 tracking-[0.3em]">{safeString(item.category || "General")}</span>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'border-border'
                        }`}>
                        {item.completed && <Zap size={16} className="fill-current" />}
                      </div>
                    </div>
                    <p className={`text-sm font-bold leading-tight ${item.completed ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>{safeString(item.label || "Untitled Task")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showReportPreview && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-12 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-7xl h-full overflow-y-auto custom-scrollbar bg-background rounded-[2rem] border border-border relative shadow-2xl">
            <ReportPreview project={project} />
            <button onClick={() => setShowReportPreview(false)} className="fixed top-16 right-16 p-4 bg-surface hover:bg-secondary text-[var(--text-primary)] rounded-full transition-all border border-border z-[1001]"><X size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
};