import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import {
  Sparkles, RefreshCw, Layout, Camera, Eye, EyeOff, Loader2, Gauge, AlertCircle, X, Globe, Target, ChevronRight, Activity, Moon, Sun
} from 'lucide-react';
import { useAuditManager } from './hooks/useAuditManager';
import { refineCodeWithVoice, refineBlockWithFeedback } from './services/geminiService';
import { Sidebar } from './components/Navigation/Sidebar';
import { ProjectSettings } from './components/Project/ProjectSettings';
import { RedesignBlocks } from './components/Auditor/RedesignBlocks';
import { CompetitorView } from './components/Benchmarking/CompetitorView';
import { ScoreCardGrid } from './components/Result/ScoreCardGrid';
import { CardDetail } from './components/Auditor/CardDetail';
import { Scorecard } from './components/Audit/Scorecard';
import { ComponentVault } from './components/Library/ComponentVault';
import { DevHandoff } from './components/Auditor/DevHandoff';
import { PresentationView } from './components/Report/PresentationView';
import { FirstMeetingDashboard } from './components/Project/FirstMeetingDashboard';
import { AppStatus, AuditFolder, RedesignBlock } from './types/index';
import { ThemeProvider, useTheme } from './context/ThemeContext';

/**
 * Global Safety Boundary: Catches React #31 Errors and UI Invariants.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PSI Hub Critical Failure:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-background flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 rounded-lg bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/30">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-medium tracking-tight mb-4 text-white">Project Data Collision</h2>
          <p className="text-white max-w-md mb-10 leading-relaxed">The Command Center encountered a structural data invariant (Error #31). Clearing the project cache will restore standard operating parameters.</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-10 py-4 bg-primary text-white rounded-lg font-medium tracking-wide shadow-sm hover:bg-primary-hover transition-all"
          >
            Reset Intelligence Core
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-white hover:text-white transition-colors"
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

function MainApp() {
  const {
    projects, activeProject, activePage, switchProject, switchPage, status, startAudit, auditResult, setAuditResult, acceptOptimization,
    updateProjectSettings, toggleChecklistItem, handleLogoUpload, handleBrandAudit, runSiteScan, addProject, workspaceFolders, createWorkspaceFolder, deleteWorkspaceFolder, moveProjectToFolder
  } = useAuditManager();

  const [view, setView] = useState<'discovery' | 'audit' | 'settings' | 'market' | 'presentation' | 'vault'>('discovery');
  const [selectedHistoryFolder, setSelectedHistoryFolder] = useState<AuditFolder | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{ code: string; title: string } | null>(null);
  const [handoffBlock, setHandoffBlock] = useState<RedesignBlock | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPredictionMode, setIsPredictionMode] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [babelAvailable, setBabelAvailable] = useState<boolean | null>(null);

  const [newProject, setNewProject] = useState({ name: '', url: '', industry: 'Real Estate', country: 'UAE' });
  const [regeneratingBlockId, setRegeneratingBlockId] = useState<string | null>(null);
  const [updatedBlockId, setUpdatedBlockId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const auditSteps = [
    { primary: "Vision Engine Active", secondary: "Segmenting viewport into Design Units..." },
    { primary: "Aesthetic Analysis", secondary: "Applying Heuristic unit scoring..." },
    { primary: "Strategic Scoring", secondary: "Calculating visual weight and luxury patterns..." }
  ];

  useEffect(() => {
    const checkBabel = () => {
      if ((window as any).Babel) setBabelAvailable(true);
      else setTimeout(checkBabel, 500);
    };
    checkBabel();
    const timeout = setTimeout(() => { if (!(window as any).Babel) setBabelAvailable(false); }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (activeProject?.brand?.dna && !activeProject.discoveryConfirmed && view !== 'discovery') {
      setView('discovery');
    }
  }, [activeProject?.brand?.dna, activeProject?.discoveryConfirmed, view]);

  useEffect(() => {
    let interval: any;
    if (status === AppStatus.AUDITING) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < auditSteps.length - 1 ? prev + 1 : prev));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const togglePresentationMode = () => {
    setShowCurtain(true);
    setTimeout(() => {
      setIsPreviewMode(prev => !prev);
      if (!isPreviewMode) setView('presentation');
      else setView('audit');
      setTimeout(() => setShowCurtain(false), 500);
    }, 400);
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' } as any });
      const video = document.createElement('video'); video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        setSelectedFile(canvas.toDataURL('image/jpeg'));
        stream.getTracks().forEach(t => t.stop());
      };
    } catch (err: any) { console.error("Capture failed", err); }
  };

  const handleAcceptAudit = () => {
    if (!auditResult) return;
    acceptOptimization(
      "Architectural Synthesis",
      "Heuristic-driven 100-point optimization.",
      selectedFile || "",
      auditResult.suggestedImage || "",
      auditResult.codeFix,
      auditResult.frictionPoints,
      [],
      { perf: auditResult.performanceScore, acc: auditResult.accessibilityScore, best: auditResult.bestPracticesScore, seo: auditResult.seoScore },
      auditResult.blocks || [],
      auditResult.rationale || []
    );
  };

  const handleRegenerateBlock = async (blockId: string, instruction?: string, mimic?: boolean) => {
    if (!auditResult || !activeProject) return;
    const block = auditResult.blocks?.find(b => b.id === blockId);
    if (!block) return;
    try {
      setRegeneratingBlockId(blockId);
      const refined = await refineCodeWithVoice(block.code, instruction || "Enhance layout efficiency.", mimic, activeProject.competitors);
      const updatedBlocks = auditResult.blocks?.map(b => b.id === blockId ? { ...b, code: refined.code } : b);
      setAuditResult({ ...auditResult, blocks: updatedBlocks });
      setUpdatedBlockId(blockId);
      setTimeout(() => setUpdatedBlockId(null), 3000);
    } catch (err) { console.error("Block regeneration failed", err); } finally { setRegeneratingBlockId(null); }
  };

  const handleDirectFeedback = async (blockId: string, feedback: { text: string; image?: string; voiceTranscript?: string }) => {
    if (!auditResult || !activeProject) return;
    const block = auditResult.blocks?.find(b => b.id === blockId);
    if (!block) return;
    try {
      setRegeneratingBlockId(blockId);
      const updatedBlock = await refineBlockWithFeedback(block, feedback, activeProject.brand);
      setAuditResult({ ...auditResult, blocks: auditResult.blocks?.map(b => b.id === blockId ? updatedBlock : b) });
      setUpdatedBlockId(blockId);
      setTimeout(() => setUpdatedBlockId(null), 3000);
    } catch (err) { console.error("Direct feedback refinement failed", err); } finally { setRegeneratingBlockId(null); }
  };

  const handleCreateProject = () => {
    if (newProject.name && newProject.url) {
      addProject(newProject.name, newProject.url, newProject.industry, newProject.country);
      setShowNewProjectModal(false);
      setNewProject({ name: '', url: '', industry: 'Real Estate', country: 'UAE' });
    }
  };

  const canRunAudit = activeProject?.brand?.logo && activeProject?.baseUrl;
  const currentBlocks = auditResult?.blocks || selectedHistoryFolder?.blocks || [];

  return (
    <div className={`flex h-screen bg-background text-[var(--text-primary)] font-sans overflow-hidden transition-colors duration-300 ${isPreviewMode ? 'p-0' : ''}`}>
      {!isPreviewMode && activeProject && activePage && (
        <Sidebar
          projects={projects}
          activeProject={activeProject}
          activePage={activePage}
          workspaceFolders={workspaceFolders}
          onProjectSelect={switchProject}
          onPageSelect={(p) => { switchPage(p); setView('audit'); setSelectedHistoryFolder(null); }}
          onAddProject={() => setShowNewProjectModal(true)}
          onViewSettings={() => setView('settings')}
          onViewMarket={() => setView('market')}
          onViewLibrary={() => setView('vault')}
          createWorkspaceFolder={createWorkspaceFolder}
          deleteWorkspaceFolder={deleteWorkspaceFolder}
          moveProjectToFolder={moveProjectToFolder}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {showCurtain && (
          <div className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <Loader2 className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
            </div>
          </div>
        )}

        {view !== 'presentation' && activeProject && activePage && (
          <header className={`h-16 border-b border-border bg-surface/50 backdrop-blur-xl z-30 shrink-0 px-6 flex items-center justify-between transition-transform duration-500 ${isPreviewMode ? 'translate-y-[-100%]' : ''}`}>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <h1 className="text-xs font-medium uppercase tracking-wide text-primary">
                  {safeString(activeProject.name)}
                </h1>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <span>{safeString(activePage.name)}</span>
                  <ChevronRight size={14} className="text-white" />
                  <span className="text-white">
                    {safeString(view === 'discovery' ? 'Discovery' : view === 'settings' ? 'Settings' : view === 'market' ? 'Market' : view === 'vault' ? 'Library' : 'Audit')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!isPreviewMode && (view === 'audit' || view === 'discovery') && auditResult && (
                <div className="flex items-center gap-4 px-4 py-1.5 bg-surface border border-border rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Score</span>
                    <span className="text-lg font-bold text-primary">{safeString(auditResult.proposedHeuristics?.total || 0)}</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <ScoreCardGrid result={auditResult} />
                </div>
              )}

              <div className="h-6 w-px bg-border mx-2" />

              <div className="flex items-center gap-2">
                <ThemeToggle />
                {view === 'audit' && !isPreviewMode && (
                  <>
                    <button
                      onClick={() => setIsPredictionMode(!isPredictionMode)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all ${isPredictionMode ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-white hover:text-white'}`}
                    >
                      <Activity size={14} /> Predict
                    </button>
                    <button onClick={handleCapture} className="px-4 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-white hover:text-white transition-all flex items-center gap-2">
                      <Camera size={14} /> Capture
                    </button>
                    <button
                      onClick={() => startAudit(selectedFile || undefined)}
                      disabled={status === AppStatus.AUDITING || !selectedFile || !canRunAudit}
                      className={`px-5 py-2 rounded-lg font-medium text-xs flex items-center gap-2 shadow-sm transition-all ${canRunAudit ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-slate-800 text-white cursor-not-allowed'}`}
                    >
                      {status === AppStatus.AUDITING ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />} Run Audit
                    </button>
                  </>
                )}
                <button
                  onClick={togglePresentationMode}
                  className={`p-2 rounded-lg border transition-all ${isPreviewMode ? 'bg-primary border-primary text-white' : 'bg-surface border-border text-white hover:text-white'}`}
                  title="Presentation Mode"
                >
                  {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
          {activeProject && (
            <>
              {view === 'discovery' ? (
                <FirstMeetingDashboard
                  project={activeProject}
                  onConfirm={() => {
                    updateProjectSettings({ discoveryConfirmed: true });
                    setView('audit');
                  }}
                />
              ) : view === 'settings' ? (
                <ProjectSettings
                  project={activeProject}
                  onUpdate={updateProjectSettings}
                  onLogoUpload={handleLogoUpload}
                  onRunScan={runSiteScan}
                  onRunBrandAudit={handleBrandAudit}
                  toggleChecklistItem={toggleChecklistItem}
                  isProcessing={status === AppStatus.AUDITING}
                />
              ) : view === 'market' ? (
                <CompetitorView
                  project={activeProject}
                  benchmarks={auditResult?.benchmarks}
                />
              ) : view === 'vault' ? (
                <ComponentVault
                  project={activeProject}
                  onCopyCode={(code) => navigator.clipboard.writeText(code)}
                />
              ) : view === 'presentation' ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <PresentationView project={activeProject} onClose={togglePresentationMode} />
                </div>
              ) : (
                <div className="relative p-8">
                  {status === AppStatus.AUDITING && (
                    <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-6rem)]">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 border-2 border-border border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gauge className="text-primary animate-pulse" size={32} />
                        </div>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">{safeString(auditSteps[loadingStep]?.primary || "Processing")}</p>
                      <p className="text-xs text-white mt-2">{safeString(auditSteps[loadingStep]?.secondary || "Please wait...")}</p>
                    </div>
                  )}

                  {auditResult && (
                    <div className="max-w-6xl mx-auto mb-12">
                      <Scorecard
                        current={auditResult.currentHeuristics}
                        proposed={auditResult.proposedHeuristics}
                        rationale={auditResult.rationale}
                      />
                    </div>
                  )}

                  {currentBlocks.length > 0 ? (
                    <RedesignBlocks
                      blocks={currentBlocks}
                      competitors={activeProject.competitors}
                      onRegenerate={handleRegenerateBlock}
                      onAnnotate={(id, anno) => {
                        if (auditResult) {
                          setAuditResult({
                            ...auditResult,
                            blocks: auditResult.blocks?.map(b => b.id === id ? { ...b, annotations: [...b.annotations, anno] } : b)
                          });
                        }
                      }}
                      onOpenCode={(code, title) => setDetailData({ code, title })}
                      onDirectFeedback={handleDirectFeedback}
                      onOpenHandoff={(b) => setHandoffBlock(b)}
                      regeneratingBlockId={regeneratingBlockId}
                      updatedBlockId={updatedBlockId}
                      isPredictionMode={isPredictionMode}
                    />
                  ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center opacity-40 text-center px-12 border-2 border-dashed border-border rounded-lg m-8">
                      <Layout size={48} className="mb-4 text-white" />
                      <h3 className="text-lg font-medium text-white">Ready to Audit</h3>
                      <p className="text-sm text-white mt-1">Capture or upload a layout to begin optimization</p>
                    </div>
                  )}

                  {auditResult && (
                    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom duration-500">
                      <button onClick={handleAcceptAudit} className="px-8 py-4 bg-primary text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                        <Sparkles size={18} /> Commit Optimization
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {detailData && activePage && (
          <CardDetail code={detailData.code} title={detailData.title} onClose={() => setDetailData(null)} pageName={activePage.name} />
        )}

        {handoffBlock && (
          <DevHandoff block={handoffBlock} onClose={() => setHandoffBlock(null)} />
        )}
      </main>

      {showNewProjectModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewProjectModal(false)} />
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowNewProjectModal(false)} className="absolute top-6 right-6 text-white hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-semibold mb-1 text-white">New Project</h2>
            <p className="text-white text-sm mb-8">Enter project details to initialize workspace</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"><Target size={12} /> Project Name</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="e.g., Emaar Beachfront" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"><Globe size={12} /> Root Domain</label>
                <input type="text" value={newProject.url} onChange={(e) => setNewProject({ ...newProject, url: e.target.value })} placeholder="https://..." className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white" />
              </div>
            </div>

            <button onClick={handleCreateProject} disabled={!newProject.name || !newProject.url} className="w-full mt-10 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-hover disabled:opacity-50 transition-all">Start Project <ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </ThemeProvider>
  );
}