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

  const safeVal = (val: any) => String(val || '');

  const ScoreBadge = ({ label, score }: { label: string, score: number }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[7px] font-bold uppercase tracking-tighter text-slate-500">{safeVal(label)}</div>
      <div className={`text-xs font-bold ${score > 85 ? 'text-emerald-500' : score > 60 ? 'text-amber-500' : 'text-rose-500'}`}>
        {safeVal(score)}
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
          <div key={safeVal(block.id)} className="relative group px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">{safeVal(block.title)}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{safeVal(block.type)} section</span>
                    <div className="h-3 w-px bg-border" />
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
                  className={`p-3 rounded-xl transition-all ${showHeatmap ? 'bg-primary text-white' : 'bg-surface border border-border text-slate-400 hover:text-primary hover:border-primary/50'}`}
                  title="Toggle Predictive Heatmap"
                >
                  <Activity size={16} />
                </button>
                <button
                  onClick={() => setActiveAnnotationId(block.id)}
                  className={`p-3 border rounded-xl transition-all ${activeAnnotationId === block.id ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate-400 hover:text-primary hover:border-primary/50'}`}
                  title="Iterative Loop: Direct Refinement"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onOpenHandoff?.(block)}
                  className="px-6 py-3 bg-surface text-primary border border-primary/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <Code size={14} /> Dev-Handoff
                </button>
              </div>
            </div>

            <div className={`relative rounded-[2rem] overflow-hidden border border-border shadow-sm bg-surface transition-all duration-700 ${isRecentlyUpdated ? 'ring-2 ring-primary' : ''}`}>
              <img
                src={block.suggestedImage}
                className={`w-full h-auto transition-all duration-700 ${isRegenerating ? 'opacity-30 blur-xl grayscale' : 'hover:scale-[1.01]'}`}
                alt={safeVal(block.title)}
              />

              <HeatmapOverlay
                points={block.heatmapData || []}
                isVisible={showHeatmap}
                isPredictionMode={isPredictionMode}
                probabilityScore={clickProb}
              />

              {isRegenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md z-40">
                  <div className="w-20 h-20 border-2 border-border border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold uppercase tracking-[0.5em] text-primary animate-pulse">Architectural Synthesis...</p>
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
