import React, { useState } from 'react';
import { RedesignBlock, Annotation } from '../../types/index';
import { RefreshCw, Sparkles, Code, Maximize2, Info, Target, Edit, Wand2, Activity, ShieldCheck, Zap } from 'lucide-react';
import { FeedbackPanel } from '../AICoach/FeedbackPanel';
import { HeatmapOverlay } from './HeatmapOverlay';
import { getClickProbability } from '../../services/predictionEngine';

interface RedesignBlocksProps {
  blocks: RedesignBlock[];
  onRegenerate: (blockId: string, instruction?: string, mimic?: boolean) => void;
  onAnnotate: (blockId: string, annotation: Annotation) => void;
  onOpenCode: (code: string, title: string) => void;
  onDirectFeedback: (blockId: string, feedback: { text: string; image?: string; voiceTranscript?: string }) => Promise<void>;
  onOpenHandoff?: (block: RedesignBlock) => void;
  regeneratingBlockId: string | null;
  competitors?: string[];
  updatedBlockId?: string | null;
  isPredictionMode?: boolean;
}

export const RedesignBlocks: React.FC<RedesignBlocksProps> = ({ 
  blocks, 
  onRegenerate, 
  onOpenCode, 
  onDirectFeedback,
  onOpenHandoff,
  regeneratingBlockId,
  updatedBlockId,
  isPredictionMode = false
}) => {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const [localHeatmapToggleId, setLocalHeatmapToggleId] = useState<string | null>(null);

  const ScoreBadge = ({ label, score }: { label: string, score: number }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[7px] font-black uppercase tracking-tighter text-slate-500">{label}</div>
      <div className={`text-xs font-black ${score > 85 ? 'text-emerald-400' : score > 60 ? 'text-psi-gold' : 'text-rose-400'}`}>
        {score}
      </div>
    </div>
  );

  return (
    <div className="space-y-32 py-20 animate-in fade-in duration-700">
      {blocks.map((block) => {
        const isRegenerating = regeneratingBlockId === block.id;
        const isRecentlyUpdated = updatedBlockId === block.id;
        const showHeatmap = isPredictionMode || localHeatmapToggleId === block.id;
        const clickProb = getClickProbability(block.type, block.diagnosticScores.conversion);

        return (
          <div key={block.id} className="relative group px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-psi-gold/10 border border-psi-gold/20 flex items-center justify-center text-psi-gold shadow-lg">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{block.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{block.type} section</span>
                      <div className="h-3 w-px bg-white/10" />
                      <div className="flex gap-4">
                        <ScoreBadge label="Hierarchy" score={block.diagnosticScores.hierarchy} />
                        <ScoreBadge label="Readability" score={block.diagnosticScores.readability} />
                        <ScoreBadge label="Conversion" score={block.diagnosticScores.conversion} />
                      </div>
                    </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setLocalHeatmapToggleId(localHeatmapToggleId === block.id ? null : block.id)}
                  className={`p-3 rounded-xl transition-all ${showHeatmap ? 'bg-psi-gold text-obsidian' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-psi-gold'}`}
                  title="Toggle Predictive Heatmap"
                >
                  <Activity size={16} />
                </button>
                <button 
                  onClick={() => setActiveAnnotationId(block.id)}
                  className={`p-3 border rounded-xl transition-all ${activeAnnotationId === block.id ? 'bg-psi-gold text-obsidian border-psi-gold' : 'bg-white/5 border-white/10 text-slate-400 hover:text-psi-gold'}`}
                  title="Iterative Loop: Direct Refinement"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onOpenHandoff?.(block)}
                  className="px-6 py-3 bg-psi-gold/10 text-psi-gold border border-psi-gold/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-psi-gold/20 transition-all flex items-center gap-2"
                >
                  <Code size={14} /> Dev-Handoff
                </button>
              </div>
            </div>

            <div className={`relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(212,175,55,0.05)] bg-slate-950 transition-all duration-700 ${isRecentlyUpdated ? 'ring-2 ring-psi-gold' : ''}`}>
                <img 
                  src={block.suggestedImage} 
                  className={`w-full h-auto transition-all duration-700 ${isRegenerating ? 'opacity-30 blur-xl grayscale' : 'hover:scale-[1.01]'}`} 
                  alt={block.title} 
                />
                
                <HeatmapOverlay 
                  points={block.heatmapData || []} 
                  isVisible={showHeatmap} 
                  isPredictionMode={isPredictionMode}
                  probabilityScore={clickProb}
                />

                {isRegenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-40">
                    <div className="w-20 h-20 border-2 border-white/10 border-t-psi-gold rounded-full animate-spin mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.5em] text-psi-gold animate-pulse">Architectural Synthesis...</p>
                  </div>
                )}
            </div>

            {activeAnnotationId === block.id && (
              <div className="mt-8 animate-in slide-in-from-top duration-300">
                <FeedbackPanel 
                  block={block}
                  onClose={() => setActiveAnnotationId(null)}
                  onSubmit={(data) => {
                    onDirectFeedback(block.id, data);
                    setActiveAnnotationId(null);
                  }}
                  isRegenerating={isRegenerating}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
