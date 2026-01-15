
import React, { useState } from 'react';
import { Code, Loader2, X, Copy, Check } from 'lucide-react';
import { FeatureGap, DesignSystem } from '../../types';
import { generateFeatureCode } from '../../services/gemini';

interface FeatureListProps {
  features: FeatureGap[];
  designSystem?: DesignSystem;
}

export default function FeatureList({ features, designSystem }: FeatureListProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeFeatureName, setActiveFeatureName] = useState("");

  const missingFeatures = features.filter(f => f.status !== 'Present');

  const handleGenerate = async (feature: FeatureGap, index: number) => {
    setLoadingIndex(index);
    try {
      const code = await generateFeatureCode(feature.name, feature.description, designSystem);
      setGeneratedCode(code);
      setActiveFeatureName(feature.name);
      setModalOpen(true);
    } catch (err) {
      alert("Failed to generate code. Try again.");
    } finally {
      setLoadingIndex(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied to clipboard!");
  };

  if (missingFeatures.length === 0) return (
     <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">Feature Parity Achieved</h3>
        <p className="text-slate-500">No major feature gaps detected against competitors.</p>
     </div>
  );

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Code className="text-indigo-600 w-6 h-6" /> 
             Implementation Roadmap
           </h3>
           <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              {missingFeatures.length} Actionable Items
           </span>
        </div>
        
        <div className="grid gap-4">
          {missingFeatures.map((feature, i) => (
            <div 
              key={i} 
              className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg text-slate-900">{feature.name}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Missing
                    </span>
                </div>
                <p className="text-slate-500 text-sm max-w-2xl">{feature.description}</p>
              </div>
              
              <button 
                onClick={() => handleGenerate(feature, i)}
                disabled={loadingIndex !== null}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all flex items-center gap-2 min-w-[180px] justify-center shadow-lg shadow-slate-200"
              >
                {loadingIndex === i ? (
                  <><Loader2 className="animate-spin" size={16} /> Architecting...</>
                ) : (
                  <><Code size={16} /> Generate Solution</>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- CODE MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-950">
              <h3 className="text-white font-mono font-bold flex items-center gap-2 text-sm">
                <Code className="text-indigo-400 w-4 h-4" /> 
                {activeFeatureName}.tsx
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md flex items-center gap-2 transition-colors border border-transparent"
                >
                  <Copy size={14} /> Copy Code
                </button>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-6 bg-[#0d1117] custom-scrollbar">
              <pre className="text-xs sm:text-sm font-mono text-indigo-100 leading-relaxed whitespace-pre-wrap font-ligatures-none">
                <code>{generatedCode}</code>
              </pre>
            </div>
            
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 text-right">
                Generated by Gemini 1.5 Pro • Tailored to your Design System
            </div>
          </div>
        </div>
      )}
    </>
  );
}
