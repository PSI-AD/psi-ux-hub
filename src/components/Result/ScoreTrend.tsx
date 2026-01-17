
import React from 'react';
/* Use AuditFolder instead of AuditHistoryItem */
import { AuditFolder } from '../../types/index';

interface ScoreTrendProps {
  /* Prop type updated to AuditFolder[] */
  history: AuditFolder[];
  width?: number;
  height?: number;
}

export const ScoreTrend: React.FC<ScoreTrendProps> = ({ 
  history, 
  width = 160, 
  height = 32 
}) => {
  if (history.length < 2) return null;

  // history is [newest, ..., oldest], we want chronological for the chart
  const data = [...history].reverse();
  /* Access reports.perf instead of performanceScore */
  const scores = data.map(h => h.reports.perf);
  
  // Chart bounds
  const min = 0;
  const max = 100;
  const padding = 4;
  
  const getX = (index: number) => (index / (data.length - 1)) * (width - padding * 2) + padding;
  /* Access reports.perf instead of performanceScore */
  const getY = (score: number) => height - ((score - min) / (max - min)) * (height - padding * 2) - padding;

  const points = data.map((item, i) => `${getX(i)},${getY(item.reports.perf)}`).join(' ');
  const areaPoints = `${getX(0)},${height} ` + points + ` ${getX(data.length - 1)},${height}`;

  return (
    <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Score Velocity</div>
      <div className="relative group">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area Fill */}
          <path
            d={`M ${areaPoints}`}
            fill="url(#trendGradient)"
            stroke="none"
            className="transition-all duration-500"
          />
          
          {/* Line */}
          <polyline
            fill="none"
            stroke="#C5A059"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="transition-all duration-500"
          />
          
          {/* Data Points */}
          {data.map((item, i) => (
            <circle 
              key={i} 
              cx={getX(i)} 
              /* Access reports.perf instead of performanceScore */
              cy={getY(item.reports.perf)} 
              r="2" 
              fill="#C5A059" 
              className="drop-shadow-[0_0_3px_rgba(197,160,89,0.8)] transition-all duration-300 hover:r-3"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
