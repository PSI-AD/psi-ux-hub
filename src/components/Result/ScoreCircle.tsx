import React from 'react';

interface ScoreCircleProps {
  score: number;
  label: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label }) => {
  const color = score > 89 ? 'text-emerald-500' : score > 49 ? 'text-amber-500' : 'text-rose-500';
  const strokeColor = score > 89 ? '#10b981' : score > 49 ? '#f59e0b' : '#f43f5e';
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 64 64"
        >
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-border" />
          <circle
            cx="32" cy="32" r={radius} fill="transparent" stroke={strokeColor} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute text-sm font-bold tracking-tight ${color}`}>{score}</span>
      </div>
      <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wide">{label}</span>
    </div>
  );
};