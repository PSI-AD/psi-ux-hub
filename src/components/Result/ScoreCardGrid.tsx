import React from 'react';
import { ScoreCircle } from './ScoreCircle';
import { AuditResult } from '../../types/index';
import { Gauge, ShieldCheck, Zap, BarChart } from 'lucide-react';

interface ScoreCardGridProps {
  result: AuditResult;
}

export const ScoreCardGrid: React.FC<ScoreCardGridProps> = ({ result }) => {
  return (
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-3 group">
        <ScoreCircle score={result.performanceScore} label="PERF" />
      </div>
      <div className="flex items-center gap-3 group">
        <ScoreCircle score={result.accessibilityScore} label="ACC" />
      </div>
      <div className="flex items-center gap-3 group">
        <ScoreCircle score={result.bestPracticesScore} label="BEST" />
      </div>
      <div className="flex items-center gap-3 group">
        <ScoreCircle score={result.seoScore} label="SEO" />
      </div>
    </div>
  );
};