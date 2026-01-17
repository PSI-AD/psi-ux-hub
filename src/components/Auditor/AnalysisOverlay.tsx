
import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { Hotspot } from '../../types/index';

interface AnalysisOverlayProps {
  hotspots: Hotspot[];
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ hotspots }) => {
  const [activeSpot, setActiveSpot] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
      {hotspots.map((spot, idx) => {
        const isFriction = spot.type === 'friction';
        const isActive = activeSpot === idx;

        return (
          <div
            key={idx}
            className={`absolute pointer-events-auto cursor-help group transition-all duration-500 border-2 ${
              isFriction 
                ? 'border-rose-500 bg-rose-500/5 hover:bg-rose-500/20' 
                : 'border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/20'
            } ${isActive ? 'ring-4 ring-white/20 scale-[1.02] z-40' : 'z-30'}`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
            }}
            onMouseEnter={() => setActiveSpot(idx)}
            onMouseLeave={() => setActiveSpot(null)}
          >
            {/* Pulsing Corner Indicator */}
            <div className={`absolute -top-2 -left-2 w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${
              isFriction ? 'bg-rose-600' : 'bg-emerald-600'
            }`}>
               {isFriction ? <AlertCircle size={10} className="text-white" /> : <CheckCircle2 size={10} className="text-white" />}
               <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${
                 isFriction ? 'bg-rose-400' : 'bg-emerald-400'
               }`} />
            </div>

            {/* Red/Green Zone Identification Label */}
            <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-opacity ${
              isFriction ? 'bg-rose-600' : 'bg-emerald-600'
            }`}>
              {isFriction ? 'Red Zone' : 'Optimized'}
            </div>

            {/* Floating Detail Tooltip */}
            {(isActive) && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isFriction ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {spot.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-white leading-relaxed font-medium">
                  {spot.description}
                </p>
                
                {/* AI Logic Trace */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <Info size={12} className="text-blue-400" />
                  <span className="text-[9px] text-slate-500 font-bold uppercase italic">
                    Detected via Gemini Vision
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Scanning Line Animation (Visual Flavour) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-scan pointer-events-none" />
    </div>
  );
};
