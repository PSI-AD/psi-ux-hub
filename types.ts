
export enum AppStatus {
  IDLE = 'IDLE',
  AUDITING = 'AUDITING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Hotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: 'friction' | 'improvement';
  description: string;
}

export interface AuditHistoryItem {
  id: string;
  pageId: string;
  timestamp: string;
  performanceScore: number;
  fixesCount: number;
}

export interface PSIPage {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'improved' | 'auditing';
  description: string;
  history: AuditHistoryItem[];
}

export interface AuditResult {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  frictionPoints: string[];
  suggestedFixes: string[];
  hotspots: Hotspot[];
  codeFix: string;
  timestamp: string;
}
