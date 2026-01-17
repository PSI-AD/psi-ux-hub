import React from 'react';
import { HeatmapPoint } from '../../types/index';
import { MousePointer2, Percent } from 'lucide-react';

interface HeatmapOverlayProps {
  points: HeatmapPoint[];
  isVisible: boolean;
  isPredictionMode?: boolean;
  probabilityScore?: number;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ 
  points, 
  isVisible, 
  isPredictionMode,
  probabilityScore 
}) => {
  if (!isVisible || !points) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none transition-all duration-700">
      {/* Blurred Heatmap Layer */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen backdrop-blur-[2px]">
        <svg className="w-full h-full">
          <defs>
            <radialGradient id="heatGradient">
              <stop offset="0%" stopColor="rgba(255, 69, 0, 0.9)" />
              <stop offset="40%" stopColor="rgba(212, 175, 55, 0.4)" />
              <stop offset="100%" stopColor="rgba(0, 128, 255, 0)" />
            </radialGradient>
            <filter id="gaussianBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
          </defs>
          <g filter="url(#gaussianBlur)">
            {points.map((p, i) => (
              <circle
                key={i}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={p.intensity * 80}
                fill="url(#heatGradient)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Prediction UI (Floating Bubbles) */}
      {isPredictionMode && probabilityScore && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-50 duration-500">
          <div className="relative group">
            <div className="absolute inset-0 bg-psi-gold/40 rounded-full blur-xl animate-ping" />
            <div className="relative px-6 py-3 bg-obsidian border border-psi-gold rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.4)] flex flex-col items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-psi-gold flex items-center gap-1">
                <MousePointer2 size={10} /> Click Prob.
              </span>
              <div className="flex items-end gap-0.5">
                <span className="text-2xl font-black text-white leading-none">{probabilityScore}</span>
                <span className="text-[10px] font-black text-psi-gold mb-0.5">%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
