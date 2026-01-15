import React, { useState } from 'react';
import { Folder, Plus, Layout, Building, ChevronRight, Zap, Loader2, Eye, Search } from 'lucide-react';
import { Project, AnalysisResult } from '../../types';
import { runRealEstateAnalysis } from '../../services/gemini';
import { runPageSpeedAudit } from '../../services/pagespeed';
import { DBService } from '../../services/db-service';
import { PreviewModal } from './PreviewModal';

// Mock Data Structure (Initial State)
const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    name: 'Skyline Towers', 
    propertyType: 'Luxury', 
    folders: [
      { id: 'f1', name: 'Homepage', snapshots: [] },
      { id: 'f2', name: 'Penthouse Unit', snapshots: [] }
    ] 
  }
];

export const ProjectHub: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('p1');
  const [activeFolderId, setActiveFolderId] = useState<string>('f1');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Inputs
  const [inputUrl, setInputUrl] = useState('');
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [competitorFile, setCompetitorFile] = useState<File | null>(null);

  // Modal State
  const [previewData, setPreviewData] = useState<{ html: string; code: string; title: string } | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeFolder = activeProject?.folders.find(f => f.id === activeFolderId);

  const handleRunAnalysis = async (type: 'visual' | 'performance') => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      let result: AnalysisResult;

      // 1. Run AI / PageSpeed Analysis
      if (type === 'performance') {
        if (!inputUrl) throw new Error("URL required for performance audit.");
        const psiData = await runPageSpeedAudit(inputUrl);
        // Send the optimized raw_json to Gemini
        result = await runRealEstateAnalysis('performance', { lighthouseJson: psiData.raw_json });
        result.lighthouse_score = psiData.score;
        result.lighthouse_metrics = psiData.metrics;
      } else {
        if (!inputFile && !inputUrl) throw new Error("Image or URL required for visual audit.");
        result = await runRealEstateAnalysis('visual', { 
            myPage: inputFile || inputUrl,
            competitor: competitorFile
        });
      }

      setAnalysisResult(result);

      // 2. Persist to Database (Background Process)
      if (activeProject && activeFolder) {
        try {
          // Ensure Project/Page exist in DB
          const pId = await DBService.createProject(activeProject.name);
          const fId = await DBService.createPage(pId, activeFolder.name);

          // Upload Files (if any)
          let myAssetUrl = inputUrl;
          if (inputFile) {
            myAssetUrl = await DBService.uploadCleanFile(inputFile, pId, fId, 'my-page');
          }
          let compAssetUrl = '';
          if (competitorFile) {
            compAssetUrl = await DBService.uploadCleanFile(competitorFile, pId, fId, 'competitor');
          }

          // Create Task Record
          await DBService.createTask(pId, fId, {
            title: type === 'performance' ? `Performance Audit: ${new URL(inputUrl).hostname}` : 'Visual Strategy Audit',
            type: type === 'performance' ? 'lighthouse_speed' : 'competitor_audit',
            status: 'done',
            assets: {
              myScreenshotUrl: myAssetUrl,
              competitorScreenshotUrl: compAssetUrl,
              lighthouseJson: type === 'performance' ? result.lighthouse_metrics : undefined
            },
            aiResult: result
          });
          console.log("Analysis saved to history successfully.");
        } catch (dbError) {
          console.error("Failed to save to history:", dbError);
          // Don't block UI if DB save fails
        }
      }

    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      <PreviewModal 
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        htmlContent={previewData?.html || ''}
        reactCode={previewData?.code || ''}
        title={previewData?.title || ''}
      />

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-100">
           <div className="flex items-center justify-between mb-2">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects</h2>
             <button className="text-slate-400 hover:text-indigo-600"><Plus size={14} /></button>
           </div>
           {projects.map(p => (
             <div 
               key={p.id}
               onClick={() => setActiveProjectId(p.id)}
               className={`flex items-center p-2 rounded-lg cursor-pointer text-sm font-medium mb-1 transition-colors ${activeProjectId === p.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <Building size={16} className="mr-2" />
               {p.name}
             </div>
           ))}
        </div>

        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Folders</h2>
            <button className="text-slate-400 hover:text-indigo-600"><Plus size={14} /></button>
          </div>
          {activeProject?.folders.map(f => (
             <div 
               key={f.id}
               onClick={() => setActiveFolderId(f.id)}
               className={`flex items-center p-2 rounded-lg cursor-pointer text-sm font-medium mb-1 transition-colors ${activeFolderId === f.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <Folder size={16} className="mr-2 text-slate-400" />
               {f.name}
             </div>
           ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8">
          <div className="flex items-center text-sm text-slate-500 mb-2">
            {activeProject?.name} <ChevronRight size={14} className="mx-1" /> {activeFolder?.name}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace</h1>
        </header>

        {/* Input Agent */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Visual Strategist Input */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Layout size={20} /></div>
                   <div>
                     <h3 className="font-bold text-slate-900">Visual Strategist</h3>
                     <p className="text-xs text-slate-500">Upload screenshot or URL for UX audit</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <input 
                     type="text" 
                     placeholder="Your Page URL..." 
                     className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                     value={inputUrl}
                     onChange={e => setInputUrl(e.target.value)}
                   />
                   <div className="relative">
                      <input 
                        type="file" 
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={e => setInputFile(e.target.files?.[0] || null)}
                      />
                   </div>
                   <div className="pt-2 border-t border-slate-100">
                     <p className="text-xs font-semibold text-slate-400 mb-2">COMPETITOR (OPTIONAL)</p>
                     <input 
                        type="file" 
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        onChange={e => setCompetitorFile(e.target.files?.[0] || null)}
                      />
                   </div>
                   <button 
                     onClick={() => handleRunAnalysis('visual')}
                     disabled={isAnalyzing}
                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Run Visual Audit"}
                   </button>
                </div>
             </div>

             {/* Performance Engineer Input */}
             <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-8">
                <div className="flex items-center gap-2 mb-4">
                   <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Zap size={20} /></div>
                   <div>
                     <h3 className="font-bold text-slate-900">Performance Engineer</h3>
                     <p className="text-xs text-slate-500">Lighthouse audit via PageSpeed API</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2">Analyzing URL:</p>
                      <div className="font-mono text-sm text-slate-900 truncate">{inputUrl || "No URL set (Use Visual Input)"}</div>
                   </div>
                   <button 
                     onClick={() => handleRunAnalysis('performance')}
                     disabled={isAnalyzing || !inputUrl}
                     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Run Lighthouse Audit"}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Results Area */}
        {analysisResult && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* Score Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {analysisResult.analysis_type === 'lighthouse' ? (
                      <><Zap className="text-emerald-500" /> Performance Engineering Report</>
                  ) : (
                      <><Layout className="text-indigo-500" /> Visual Strategy Report</>
                  )}
                </h2>
                {analysisResult.lighthouse_score !== undefined && (
                  <div className={`px-4 py-2 rounded-lg font-bold text-xl flex items-center gap-2 ${analysisResult.lighthouse_score >= 90 ? 'bg-emerald-100 text-emerald-700' : analysisResult.lighthouse_score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    <span>PSI Score: {Math.round(analysisResult.lighthouse_score)}</span>
                  </div>
                )}
             </div>

             {/* Findings Grid */}
             <div className="grid grid-cols-1 gap-6">
                {analysisResult.findings?.map((finding, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                     <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                           <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                             Issue #{idx + 1}
                           </span>
                           <h3 className="font-bold text-lg text-slate-900">{finding.issue_title}</h3>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{finding.visual_explanation}</p>
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 inline-block">
                                <p className="text-xs text-indigo-800 font-semibold">
                                    <span className="text-indigo-400 uppercase text-[10px] block mb-1">Impact</span>
                                    {finding.real_estate_impact}
                                </p>
                            </div>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-6 flex flex-col items-center justify-center md:w-64 border-t md:border-t-0 md:border-l border-slate-200 gap-3">
                        <button 
                          onClick={() => setPreviewData({
                            html: finding.preview_html,
                            code: finding.solution_code_react,
                            title: finding.issue_title
                          })}
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg"
                        >
                          <Eye size={18} /> View Artifact
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                            Generates Standalone HTML & React Code
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {!analysisResult && !isAnalyzing && (
          <div className="text-center py-20 opacity-50">
             <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
               <Search className="text-slate-400" />
             </div>
             <p className="text-slate-500">Select an agent above to begin analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};