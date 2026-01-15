
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { ArrowLeft, Download, Eye, Layout, Palette, Zap, FileText, ScanEye, AlertTriangle, CheckCircle, Grid3X3, Scale } from 'lucide-react';
import AnalysisOverlay from './dashboard/AnalysisOverlay';
import ExecutiveSummary from './dashboard/ExecutiveSummary';
import FeatureList from './dashboard/FeatureList';
import DesignSystemDisplay from './dashboard/DesignSystemDisplay';
import CompliancePanel from './dashboard/CompliancePanel';

interface ReportDisplayProps {
  report: AnalysisResult;
  onBack: () => void;
  userImage: File | string | null;
}

type TabType = 'overview' | 'visual' | 'ux-audit' | 'visual-eng' | 'strategy' | 'legal' | 'deck';

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onBack, userImage }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Helper to get image URL for display
  const [imageUrl] = useState<string | null>(() => {
    if (!userImage) return null;
    if (typeof userImage === 'string') return null; 
    return URL.createObjectURL(userImage);
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'visual', label: 'Visual Inspection', icon: ScanEye },
    { id: 'ux-audit', label: 'UX Audit', icon: FileText },
    { id: 'visual-eng', label: 'Visual Eng', icon: Palette },
    { id: 'strategy', label: 'Strategy & CRO', icon: Zap },
    { id: 'legal', label: 'Legal & Compliance', icon: Scale },
    { id: 'deck', label: 'Exec Deck', icon: Download },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Expert Analysis Report</h1>
        </div>
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === 'overview' && <OverviewTab report={report} />}
        {activeTab === 'visual' && <VisualInspectionTab report={report} imageUrl={imageUrl} />}
        {activeTab === 'ux-audit' && <UXAuditTab report={report} />}
        {activeTab === 'visual-eng' && <VisualEngTab report={report} imageUrl={imageUrl} />}
        {activeTab === 'strategy' && <StrategyTab report={report} />}
        {activeTab === 'legal' && <CompliancePanel risks={report.compliance_risks} />}
        {activeTab === 'deck' && <DeckTab report={report} />}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS FOR TABS --- */

const OverviewTab: React.FC<{ report: AnalysisResult }> = ({ report }) => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
    <ExecutiveSummary data={report.executive_summary || { key_advantage: "", critical_fix: "", estimated_roi: "" }} />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
         <FeatureList features={report.comparison.features} designSystem={report.design_system} />
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-indigo-500" />
          Cognitive Load Analysis
        </h3>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
             <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
             <div 
               className={`absolute inset-0 border-8 rounded-full border-t-transparent border-r-transparent transform -rotate-45 ${
                  report.visual_analysis.cognitive_load_score > 7 ? 'border-red-500' : 
                  report.visual_analysis.cognitive_load_score > 4 ? 'border-orange-400' : 'border-green-500'
               }`}
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0% 50%)' }}
             ></div>
             <div className="text-center">
               <span className="text-4xl font-bold text-slate-900">{report.visual_analysis.cognitive_load_score}</span>
               <span className="text-xs text-slate-400 block uppercase">/ 10</span>
             </div>
          </div>
          <div className="flex-1 ml-6">
            <p className="text-sm font-medium text-slate-600 mb-2">Noise Reduction Tips:</p>
            <ul className="space-y-2">
              {report.visual_analysis.noise_reduction_tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-500 flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 mr-2 shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VisualInspectionTab: React.FC<{ report: AnalysisResult, imageUrl: string | null }> = ({ report, imageUrl }) => {
  const [overlayType, setOverlayType] = useState<'none' | 'heatmap' | 'accessibility' | 'nielsen' | 'grid'>('heatmap');

  if (!imageUrl) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <ScanEye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Visual Inspection Unavailable</h3>
        <p className="text-slate-500 mt-2">
          Visual overlays require a direct image upload. Using a URL prevents us from mapping coordinates accurately.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Forensic Visual Analysis</h3>
          <p className="text-sm text-slate-500">Toggle layers to reveal AI-detected insights.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setOverlayType('none')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${overlayType === 'none' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Original
          </button>
          <button
            onClick={() => setOverlayType('heatmap')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${overlayType === 'heatmap' ? 'bg-white shadow text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Eye className="w-3 h-3 mr-1.5" />
            Attention
          </button>
          <button
            onClick={() => setOverlayType('nielsen')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${overlayType === 'nielsen' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <CheckCircle className="w-3 h-3 mr-1.5" />
            Nielsen
          </button>
          <button
            onClick={() => setOverlayType('accessibility')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${overlayType === 'accessibility' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <AlertTriangle className="w-3 h-3 mr-1.5" />
            WCAG
          </button>
           <button
            onClick={() => setOverlayType('grid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${overlayType === 'grid' ? 'bg-white shadow text-cyan-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Grid3X3 className="w-3 h-3 mr-1.5" />
            Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalysisOverlay 
            imageSrc={imageUrl} 
            activeLayer={overlayType}
            heatmapZones={report.visual_analysis.heatmap_zones}
            accessibilityRisks={report.accessibility.risks}
            nielsenViolations={report.nielsen_audit}
            spacingSystem={report.design_system.spacing_system}
          />
        </div>
        
        {/* Sidebar Legend */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit max-h-[600px] overflow-y-auto">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            {overlayType === 'none' ? 'Select a Layer' : 
             overlayType === 'heatmap' ? 'Attention Analysis' : 
             overlayType === 'accessibility' ? 'Accessibility Findings' : 
             overlayType === 'grid' ? 'Layout Grid System' : 'Heuristic Violations'}
          </h4>

          {overlayType === 'heatmap' && (
            <div className="space-y-3">
              {report.visual_analysis.heatmap_zones.map((zone, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{idx + 1}</span>
                  <div>
                    <span className="block text-sm font-medium text-slate-800">{zone.label}</span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-red-500" style={{ width: `${zone.score * 10}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400">Intensity: {zone.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {overlayType === 'accessibility' && (
             <div className="space-y-3">
              {report.accessibility.risks.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No high-severity risks detected.</p>
              ) : report.accessibility.risks.map((risk, idx) => (
                <div key={idx} className="flex items-start p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-slate-800">{risk.issue}</span>
                    <span className="text-[10px] text-orange-700 font-bold uppercase">{risk.severity} Risk</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {overlayType === 'nielsen' && (
            <div className="space-y-3">
              {report.nielsen_audit.filter(v => v.box_2d).length === 0 ? (
                 <p className="text-sm text-slate-500 italic">No specific visual violations mapped.</p>
              ) : report.nielsen_audit.filter(v => v.box_2d).map((v, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs font-bold mr-3 mt-0.5">H{idx + 1}</span>
                  <div>
                    <span className="block text-sm font-medium text-slate-800">{v.name}</span>
                    <p className="text-xs text-slate-500 mt-1">{v.finding}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {overlayType === 'grid' && (
            <div className="space-y-3">
               <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                  <Grid3X3 className="w-6 h-6 text-cyan-600" />
                  <div>
                    <span className="block text-sm font-bold text-slate-900">{report.design_system.spacing_system}</span>
                    <span className="text-xs text-slate-500">Detected Base Unit</span>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                  This grid overlay helps you verify if elements align to the competitor's detected spacing system.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VisualEngTab: React.FC<{ report: AnalysisResult, imageUrl: string | null }> = ({ report, imageUrl }) => {
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'grid' | 'nielsen'>('none');

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      
      <DesignSystemDisplay designSystem={report.design_system} />

       {/* Visual Validation Section */}
       <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center">
               <ScanEye className="w-5 h-5 mr-2 text-indigo-600" />
               Engineering Verification Overlay
            </h3>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveOverlay(activeOverlay === 'grid' ? 'none' : 'grid')}
                  className={`text-xs flex items-center px-3 py-1.5 rounded-md transition-all ${activeOverlay === 'grid' ? 'bg-white shadow text-cyan-700 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
                  Layout Grid
                </button>
                <button 
                  onClick={() => setActiveOverlay(activeOverlay === 'nielsen' ? 'none' : 'nielsen')}
                  className={`text-xs flex items-center px-3 py-1.5 rounded-md transition-all ${activeOverlay === 'nielsen' ? 'bg-white shadow text-red-700 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  Violations
                </button>
             </div>
          </div>
          
          <div className="mb-4">
             <p className="text-sm text-slate-600">
               {activeOverlay === 'grid' && <span>Verifying alignment against <strong>{report.design_system.spacing_system}</strong> system.</span>}
               {activeOverlay === 'nielsen' && <span>Visualizing detected usability violations on the interface.</span>}
               {activeOverlay === 'none' && <span>Select an overlay to verify implementation details against the screenshot.</span>}
             </p>
          </div>

          {activeOverlay !== 'none' && (
             <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {imageUrl ? (
                   <AnalysisOverlay 
                      imageSrc={imageUrl}
                      activeLayer={activeOverlay}
                      spacingSystem={report.design_system.spacing_system}
                      nielsenViolations={report.nielsen_audit}
                   />
                ) : (
                   <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500">
                      Image source unavailable for overlay.
                   </div>
                )}
             </div>
          )}
      </div>
    </div>
  );
};

const UXAuditTab: React.FC<{ report: AnalysisResult }> = ({ report }) => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">Nielsen Heuristics Scorecard</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              10-Point Inspection
            </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.nielsen_audit.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900 text-sm leading-snug pr-3">{item.name}</h4>
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${item.score >= 8 ? 'bg-green-100 text-green-700' : item.score >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}
                `}>
                  {item.score}
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-4 flex-grow leading-relaxed">{item.finding}</p>
              <div className="mt-auto">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      item.score >= 8 ? 'bg-green-500' : item.score >= 5 ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${item.score * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-900">Accessibility Audit</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            report.accessibility.score >= 90 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            WCAG 2.1
          </span>
        </div>
        <ul className="space-y-3">
          {report.accessibility.risks.map((risk, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-700">
              <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 shrink-0 mt-0.5" />
              {risk.issue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const StrategyTab: React.FC<{ report: AnalysisResult }> = ({ report }) => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
    {/* CRO Section */}
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-indigo-500" />
          CRO Psychological Triggers
        </h3>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
          {report.cro_triggers.length} Analyzed
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.cro_triggers.map((item, idx) => (
          <div 
            key={idx} 
            className={`
              relative p-5 rounded-xl border transition-all hover:shadow-md
              ${item.status === 'Missing' 
                ? 'border-red-200 bg-gradient-to-br from-white to-red-50/50' 
                : 'border-green-200 bg-gradient-to-br from-white to-green-50/50'}
            `}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 {item.status === 'Missing' ? (
                   <div className="bg-red-100 p-1.5 rounded-lg text-red-600">
                     <AlertTriangle className="w-4 h-4" />
                   </div>
                 ) : (
                   <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                     <CheckCircle className="w-4 h-4" />
                   </div>
                 )}
                 <span className="font-bold text-slate-900">{item.trigger}</span>
              </div>
              <span className={`
                text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md
                ${item.status === 'Missing' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
              `}>
                {item.status}
              </span>
            </div>
            
            <div className="pl-9">
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* AB Testing Section */}
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
        Recommended A/B Experiments
      </h3>
      <div className="space-y-6">
        {report.ab_tests.map((test, idx) => (
          <div key={idx} className="relative pl-6 border-l-2 border-slate-200 hover:border-indigo-500 transition-colors">
            <h4 className="font-semibold text-indigo-600 text-xs mb-1 uppercase tracking-wider">Hypothesis {idx + 1}</h4>
            <p className="text-slate-900 font-medium text-base mb-2">"{test.hypothesis}"</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-sm text-slate-600 mb-1">
                <span className="font-bold text-slate-900">Test Variant:</span> {test.variant_suggestion}
                </div>
                <div className="text-xs text-slate-500">
                <span className="font-semibold">Metric:</span> {test.metric}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DeckTab: React.FC<{ report: AnalysisResult }> = ({ report }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 bg-slate-50 overflow-auto max-h-[600px]">
    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">{report.executive_deck_markdown}</pre>
  </div>
);
