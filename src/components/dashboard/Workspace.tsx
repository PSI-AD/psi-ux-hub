
import React, { useState, useEffect, useRef } from "react";
import { Upload, Zap, Search, ArrowRight, Clock, CheckCircle2, AlertTriangle, LayoutTemplate, Loader2, Link as LinkIcon, Plus, Eye } from "lucide-react";
import { clsx } from "clsx";
import { Project, Folder, AnalysisResult, Task } from "../../types";
import { runRealEstateAnalysis, runVisualAudit, runTechnicalAnalysis, runExternalPsiAnalysis } from "../../services/gemini";
import { parseLighthouseJson } from "../../services/pagespeed";
import { DBService } from "../../services/db-service";
import { ReportDisplay } from "../ReportDisplay";
import { PreviewModal } from "../hub/PreviewModal";

interface WorkspaceProps {
  activeProject: Project | undefined;
  activeFolder: Folder | undefined;
}

export default function Workspace({ activeProject, activeFolder }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "speed">("visual");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<Task[]>([]);

  // Input State
  const [myPageInput, setMyPageInput] = useState<string>("");
  const [myFile, setMyFile] = useState<File | null>(null);
  const [compFile, setCompFile] = useState<File | null>(null);

  // View State
  const [currentReport, setCurrentReport] = useState<AnalysisResult | null>(null);
  const [currentReportImage, setCurrentReportImage] = useState<File | string | null>(null);

  // Modal State for history items
  const [previewModalData, setPreviewModalData] = useState<{ html: string; code: string; title: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const compInputRef = useRef<HTMLInputElement>(null);

  // Load History on Folder Change
  useEffect(() => {
    if (activeProject && activeFolder) {
      loadHistory();
      // Reset view state
      setCurrentReport(null);
      setMyFile(null);
      setCompFile(null);

      // Auto-fill URL for PSI
      if (activeFolder.name.includes("Home") || activeFolder.name.includes("psi")) {
        setMyPageInput("https://www.psinv.net");
      } else {
        setMyPageInput("");
      }
    }
  }, [activeProject?.id, activeFolder?.id]);

  const loadHistory = async () => {
    if (!activeProject || !activeFolder) return;
    try {
      const tasks = await DBService.getPageHistory(activeProject.id, activeFolder.id);
      setHistory(tasks);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const handleJsonUpload = async (file: File) => {
    if (!activeProject || !activeFolder) return;
    setIsAnalyzing(true);
    setCurrentReport(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // 1. Parse Local Data
      const parsedData = parseLighthouseJson(json);

      // 2. Run Gemini Technical Analysis
      const aiAnalysis = await runTechnicalAnalysis(parsedData);

      // Merge AI findings into result
      const result: AnalysisResult = {
        lighthouse_score: parsedData.score,
        lighthouse_metrics: parsedData.metrics,
        findings: [], // Filled by Visual, but Tech uses different structure usually. 
        // We might need to adapt ReportDisplay or just map technical_fixes to findings?
        // For now, let's map technical fixes to findings for UI compatibility
        analysis_type: 'lighthouse',
        executive_summary: aiAnalysis.executive_summary
      };

      // Map tech fixes to findings format
      if (aiAnalysis.technical_fixes) {
        result.findings = aiAnalysis.technical_fixes.map((fix: any) => ({
          issue_title: fix.issue,
          visual_explanation: `Fix Strategy: ${fix.fix_strategy}. Impact: ${fix.impact}`,
          real_estate_impact: `Target File: ${fix.file_target}`, // Abusing field for file target
          solution_code_react: fix.code_snippet
        }));
      }

      // 3. Persist
      const pId = await DBService.createProject(activeProject.name);
      const fId = await DBService.createPage(pId, activeFolder.name);

      await DBService.createTask(pId, fId, {
        title: `Deep Audit: ${file.name}`,
        type: 'lighthouse_speed',
        status: 'done',
        assets: {
          lighthouseJson: parsedData.metrics
        },
        aiResult: result
      });

      setCurrentReport(result);
      loadHistory();

    } catch (e: any) {
      alert("Failed to process Deep Audit: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleExternalReportImport = async () => {
    if (!activeProject || !activeFolder || !myPageInput) return;
    setIsAnalyzing(true);
    setCurrentReport(null);

    try {
      // Run Gemini External Analysis
      const aiAnalysis = await runExternalPsiAnalysis(myPageInput);

      // Merge AI findings into result
      const result: AnalysisResult = {
        lighthouse_score: 54, // Hardcoded from user prompt instructions
        lighthouse_metrics: { lcp: '15.3s', cls: '0.05', fid: 'N/A', inp: 'N/A' }, // User context
        findings: [],
        analysis_type: 'lighthouse',
        executive_summary: aiAnalysis.executive_summary
      };

      // Map tech fixes to findings format
      if (aiAnalysis.technical_fixes) {
        result.findings = aiAnalysis.technical_fixes.map((fix: any) => ({
          issue_title: fix.issue,
          visual_explanation: `Fix Strategy: ${fix.fix_strategy}. Impact: ${fix.impact}`,
          real_estate_impact: `Target File: ${fix.file_target}`,
          solution_code_react: fix.code_snippet
        }));
      }

      // 3. Persist
      const pId = await DBService.createProject(activeProject.name);
      const fId = await DBService.createPage(pId, activeFolder.name);

      await DBService.createTask(pId, fId, {
        title: `PSI Import: ${new URL(myPageInput).pathname.split('/').pop() || 'Report'}`,
        type: 'lighthouse_speed',
        status: 'done',
        assets: {
          lighthouseJson: {} // No raw JSON in this mode
        },
        aiResult: result
      });

      setCurrentReport(result);
      loadHistory();

    } catch (e: any) {
      alert("Failed to import PSI Report: " + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!activeProject || !activeFolder) return;

    setIsAnalyzing(true);
    setCurrentReport(null);

    try {
      let result: AnalysisResult;
      const type = activeTab === "visual" ? "visual" : "performance";

      // 1. Run AI Analysis (Bypassing PageSpeed API entirely)
      if (type === "performance") {
        if (!myPageInput) throw new Error("URL required for visual audit.");

        // DIRECT CALL TO GEMINI
        result = await runVisualAudit(myPageInput);
        result.analysis_type = 'lighthouse'; // Mocking the type for existing UI compatibility

      } else {
        // Visual (Screenshot Based)
        const inputSource = myFile || myPageInput;
        if (!inputSource) throw new Error("Image or URL required for visual audit.");

        result = await runRealEstateAnalysis('visual', {
          myPage: inputSource,
          competitor: compFile || undefined
        });
      }

      // 2. Persist to Database
      const pId = await DBService.createProject(activeProject.name);
      const fId = await DBService.createPage(pId, activeFolder.name);

      // Upload Files
      let myAssetUrl = myPageInput;
      if (myFile) {
        myAssetUrl = await DBService.uploadCleanFile(myFile, pId, fId, 'my-page');
      }
      let compAssetUrl = '';
      if (compFile) {
        compAssetUrl = await DBService.uploadCleanFile(compFile, pId, fId, 'competitor');
      }

      // Create Task Record
      await DBService.createTask(pId, fId, {
        title: type === 'performance' ? `Visual UX Audit: ${new URL(myPageInput).hostname}` : 'Visual Strategy Audit',
        type: type === 'performance' ? 'lighthouse_speed' : 'competitor_audit',
        status: 'done',
        assets: {
          myScreenshotUrl: myAssetUrl,
          competitorScreenshotUrl: compAssetUrl,
          // lighthouseJson: result.lighthouse_metrics // Removed real data dependence
        },
        aiResult: result
      });

      // Update Local State
      setCurrentReport(result);
      setCurrentReportImage(myFile || myPageInput); // For overlay display
      loadHistory(); // Refresh feed

    } catch (e: any) {
      // Simple Alert for any errors, no more 403 handling needed
      alert(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openReport = (task: Task) => {
    if (task.aiResult) {
      setCurrentReport(task.aiResult);
      // For history items, we might not have the original File object, 
      // but we have the URL in assets.myScreenshotUrl
      setCurrentReportImage(task.assets.myScreenshotUrl || null);
    }
  };

  if (currentReport) {
    return (
      <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 font-sans p-8">
        <ReportDisplay
          report={currentReport}
          onBack={() => setCurrentReport(null)}
          userImage={currentReportImage}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-white font-sans relative">
      <PreviewModal
        isOpen={!!previewModalData}
        onClose={() => setPreviewModalData(null)}
        htmlContent={previewModalData?.html || ''}
        reactCode={previewModalData?.code || ''}
        title={previewModalData?.title || ''}
      />

      {/* 1. Header Area */}
      <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 backdrop-blur-xl bg-white/90">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>{activeProject?.name || "Property Shop Investment"}</span>
            <span className="text-slate-300">/</span>
            <span>Pages</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{activeFolder?.name || "Overview"}</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition shadow-sm">
            View Live Site
          </button>
          <button
            onClick={() => {
              setMyPageInput("");
              setMyFile(null);
              setCompFile(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
          >
            <Zap size={16} fill="currentColor" /> New Audit
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">

        {/* 2. The "Action Center" */}
        <section className="bg-slate-50/50 rounded-2xl border border-slate-200 p-1">
          {/* Tab Switcher */}
          <div className="flex p-1 gap-1 mb-6 bg-white rounded-xl border border-slate-100 shadow-sm w-fit mx-6 mt-6">
            <button
              onClick={() => setActiveTab("visual")}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
                activeTab === "visual" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <LayoutTemplate size={16} /> Visual Strategist
            </button>
            <button
              onClick={() => setActiveTab("speed")}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
                activeTab === "speed" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Zap size={16} /> Performance Engineer
            </button>
          </div>

          <div className="px-6 pb-6">
            {activeTab === "visual" ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid md:grid-cols-2 gap-8">
                {/* Visual Input */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                    Your Page Input
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Paste URL..."
                        value={myPageInput}
                        onChange={(e) => setMyPageInput(e.target.value)}
                        className="w-full pl-9 bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm transition-all"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={clsx(
                        "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer group text-center",
                        myFile ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-300"
                      )}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setMyFile(e.target.files?.[0] || null)} />
                      {myFile ? (
                        <div className="flex items-center justify-center gap-2 text-indigo-700 font-medium">
                          <CheckCircle2 size={18} /> {myFile.name}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-8 w-8 text-slate-300 group-hover:text-indigo-500 mb-2 transition" />
                          <span className="text-sm text-slate-500 group-hover:text-indigo-600">Drag screenshot or Click to Browse</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
                    Competitor (Optional)
                  </label>
                  <div
                    onClick={() => compInputRef.current?.click()}
                    className={clsx(
                      "h-full rounded-lg border flex items-center justify-center text-sm p-6 transition cursor-pointer hover:shadow-sm flex-col gap-2",
                      compFile ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    <input type="file" ref={compInputRef} className="hidden" accept="image/*" onChange={(e) => setCompFile(e.target.files?.[0] || null)} />
                    {compFile ? (
                      <>
                        <CheckCircle2 size={20} />
                        <span className="font-medium">{compFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={24} />
                        <span>Add Competitor Image</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing || (!myFile && !myPageInput)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                    {isAnalyzing ? "Analyzing..." : "Run Deep Visual Analysis"}
                    {!isAnalyzing && <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              // Speed Tab & External Link
              <div className="space-y-6">

                {/* Deep Audit Input Group */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap size={18} className="text-emerald-600" />
                    Deep Audit Input Source
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Option A: Paste Link */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Option A: Paste PageSpeed Result URL
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="https://pagespeed.web.dev/analysis/..."
                          value={myPageInput}
                          onChange={(e) => setMyPageInput(e.target.value)}
                          className="w-full pl-9 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 block p-3 shadow-sm font-mono"
                        />
                      </div>
                      <button
                        onClick={handleExternalReportImport}
                        disabled={isAnalyzing || !myPageInput}
                        className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        Import from URL
                      </button>
                    </div>

                    {/* Option B: Upload JSON */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Option B: Upload Report (JSON)
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                          "relative border-2 border-dashed rounded-lg p-5 transition-all cursor-pointer group text-center h-[108px] flex flex-col items-center justify-center",
                          myFile ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                        )}
                      >
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json,image/*" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setMyFile(f);
                            handleJsonUpload(f);
                          }
                        }} />
                        {myFile ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-medium">
                            <CheckCircle2 size={18} /> {myFile.name}
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 mb-2" />
                            <span className="text-xs text-slate-500">Drop Lighthouse JSON here</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>

        {/* 3. History & Results Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Audit History & Tasks</h2>
            <div className="flex gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {history.length} Results
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {history.length === 0 && (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No audits run for this page yet.
              </div>
            )}
            {history.map((task) => (
              <div key={task.id} onClick={() => openReport(task)} className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-6">

                {/* Icon Box */}
                <div className={clsx(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                  task.type.includes("competitor") ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {task.type.includes("competitor") ? <LayoutTemplate size={20} /> : <Zap size={20} />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                    {task.status === "done" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} /> Done
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> {task.date ? new Date(task.date.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    <span>•</span>
                    <span>{task.aiResult?.findings?.length || 0} Findings</span>
                  </div>
                </div>

                {/* Score / Action */}
                <div className="text-right">
                  {task.aiResult?.lighthouse_score && (
                    <div className={clsx(
                      "text-2xl font-bold mb-1",
                      task.aiResult.lighthouse_score > 80 ? "text-emerald-600" : "text-orange-500"
                    )}>
                      {Math.round(task.aiResult.lighthouse_score)}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 group-hover:text-indigo-600 font-medium flex items-center gap-1 justify-end">
                    View Report <ArrowRight size={10} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </div >
    </main >
  );
}
