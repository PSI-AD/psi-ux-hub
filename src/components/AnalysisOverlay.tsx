import React from 'react';
import { Box2D, HeatmapZone, AccessibilityIssue, NielsenHeuristic } from '../types';
import { Eye, AlertTriangle, Grid3X3 } from 'lucide-react';

interface AnalysisOverlayProps {
  imageSrc: string | null;
  heatmapZones?: HeatmapZone[];
  accessibilityRisks?: AccessibilityIssue[];
  nielsenViolations?: NielsenHeuristic[];
  activeLayer: 'none' | 'heatmap' | 'accessibility' | 'nielsen' | 'grid';
  spacingSystem?: string;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({
  imageSrc,
  heatmapZones = [],
  accessibilityRisks = [],
  nielsenViolations = [],
  activeLayer,
  spacingSystem = '8pt'
}) => {
  if (!imageSrc) return null;

  // Helper to convert normalized 1000x1000 coordinates to CSS percentages
  const getStyle = (box: Box2D) => {
    const [ymin, xmin, ymax, xmax] = box;
    return {
      top: `${(ymin / 1000) * 100}%`,
      left: `${(xmin / 1000) * 100}%`,
      height: `${((ymax - ymin) / 1000) * 100}%`,
      width: `${((xmax - xmin) / 1000) * 100}%`,
    };
  };

  // Parse grid size (e.g., "8pt" -> 8)
  const gridSize = parseInt(spacingSystem.match(/\d+/)?.[0] || '8', 10);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group/container">
      <img 
        src={imageSrc} 
        alt="Analyzed Page" 
        className="w-full h-auto block object-contain max-h-[600px] mx-auto relative z-0"
      />

      {/* Grid Overlay */}
      {activeLayer === 'grid' && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)`,
            backgroundSize: `${gridSize * 3}px ${gridSize * 3}px` // Scale up slightly for visibility on screenshots
          }}
        >
            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-90 backdrop-blur-sm">
                Overlay: {spacingSystem} Grid
            </div>
        </div>
      )}

      {/* Heatmap Layer */}
      {activeLayer === 'heatmap' && heatmapZones.map((zone, idx) => (
        <div
          key={`heat-${idx}`}
          className="absolute border-2 border-red-500 bg-red-500/20 flex items-center justify-center group cursor-help transition-all duration-300 hover:bg-red-500/40 z-20"
          style={getStyle(zone.box_2d)}
        >
          <div className="absolute -top-3 left-0 bg-red-600 text-white text-[10px] px-1.5 rounded shadow-sm font-bold">
            {idx + 1}
          </div>
          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30 pointer-events-none">
            {zone.label} (Score: {zone.score})
          </div>
        </div>
      ))}

      {/* Accessibility Layer */}
      {activeLayer === 'accessibility' && accessibilityRisks.map((risk, idx) => (
        <div
          key={`a11y-${idx}`}
          className="absolute border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center group cursor-help z-20"
          style={getStyle(risk.box_2d)}
        >
          <div className="absolute -top-3 right-0 bg-orange-500 text-white p-0.5 rounded-full shadow-sm">
            <AlertTriangle className="w-3 h-3" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30 pointer-events-none">
            {risk.issue}
          </div>
        </div>
      ))}

      {/* Nielsen Layer */}
      {activeLayer === 'nielsen' && nielsenViolations.filter(v => v.box_2d).map((v, idx) => (
        v.box_2d && (
          <div
            key={`nielsen-${idx}`}
            className="absolute border-2 border-indigo-500 bg-indigo-500/10 flex items-center justify-center group cursor-help z-20"
            style={getStyle(v.box_2d)}
          >
            <div className="absolute -bottom-3 left-0 bg-indigo-600 text-white text-[10px] px-1.5 rounded shadow-sm font-bold">
              H{idx + 1}
            </div>
            <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded w-48 z-30 pointer-events-none text-center">
              <span className="font-bold block mb-0.5">{v.name}</span>
              {v.finding}
            </div>
          </div>
        )
      ))}
      
      {activeLayer !== 'none' && (
        <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none z-40 border border-white/10">
          Showing: {activeLayer === 'heatmap' ? 'Attention Heatmap' : activeLayer === 'accessibility' ? 'WCAG Risks' : activeLayer === 'grid' ? 'Layout Grid' : 'Nielsen Violations'}
        </div>
      )}
    </div>
  );
};