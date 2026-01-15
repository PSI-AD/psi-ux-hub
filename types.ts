
import { Timestamp } from 'firebase/firestore';

// --- Project Hierarchy ---
export interface Project {
  id: string;
  name: string;
  propertyType: 'Residential' | 'Commercial' | 'Luxury';
  folders: Folder[];
}

export interface Folder {
  id: string;
  name: string; // e.g., "Homepage", "Unit Detail", "Search"
  snapshots: AnalysisSnapshot[];
}

export interface AnalysisSnapshot {
  id: string;
  timestamp: number;
  type: 'visual' | 'performance';
  input_preview: string; // URL or Image Blob URL
  findings: RealEstateFinding[];
}

// --- Analysis Data ---

export type AnalysisType = 'competitor' | 'standalone' | 'lighthouse';
export type FolderCategory = 'homepage' | 'unit_detail' | 'search_results';

export interface RealEstateFinding {
  issue_title: string;
  visual_explanation: string;
  real_estate_impact: string; // e.g., "High. Reduces lead gen by 15%."
  solution_code_react: string;
  preview_html: string; // Standalone HTML string for iframe rendering
}

export interface RealEstateAnalysisResult {
  // Deprecated in favor of AnalysisResult, but kept for compatibility during migration if needed
  analysis_type: AnalysisType;
  folder_category: FolderCategory;
  findings: RealEstateFinding[];
  lighthouse_score?: number;
  lighthouse_metrics?: {
    lcp: string;
    cls: string;
    fid: string;
  };
}

export type Box2D = [number, number, number, number];

// --- Extended Dashboard Types ---

export interface ExecutiveSummaryMetrics {
  key_advantage: string;
  critical_fix: string;
  estimated_roi: string;
}

export interface FeatureGap {
  name: string;
  status: 'Present' | 'Missing';
  description: string;
}

export interface DesignSystem {
  colors: string[];
  typography: string[];
  spacing_system: string;
  primary_button?: {
    bg_color: string;
    text_color: string;
  };
}

export interface HeatmapZone {
  box_2d: Box2D;
  label: string;
  score: number;
}

export interface AccessibilityIssue {
  box_2d: Box2D;
  issue: string;
  severity: string;
}

export interface NielsenHeuristic {
  name: string;
  score: number;
  finding: string;
  box_2d?: Box2D;
}

// --- NEW: Fair Housing & Legal ---
export interface ComplianceRisk {
  risk_level: 'High' | 'Medium' | 'Low';
  flagged_phrase: string;
  reason: string;
  safe_alternative: string;
  category: 'Race' | 'Religion' | 'Familial Status' | 'Handicap' | 'Steering' | 'Other';
}

export interface AnalysisResult {
  executive_summary: ExecutiveSummaryMetrics;
  comparison: {
    features: FeatureGap[];
  };
  design_system: DesignSystem;
  visual_analysis: {
    cognitive_load_score: number;
    noise_reduction_tips: string[];
    heatmap_zones: HeatmapZone[];
  };
  accessibility: {
    score: number;
    risks: AccessibilityIssue[];
  };
  nielsen_audit: NielsenHeuristic[];
  cro_triggers: {
    trigger: string;
    status: string;
    suggestion: string;
  }[];
  ab_tests: {
    hypothesis: string;
    variant_suggestion: string;
    metric: string;
  }[];
  executive_deck_markdown: string;
  
  // New Compliance Section
  compliance_risks?: ComplianceRisk[];

  // Unified fields
  analysis_type?: AnalysisType;
  findings?: RealEstateFinding[];
  lighthouse_score?: number;
  lighthouse_metrics?: {
    lcp: string;
    cls: string;
    fid: string;
  };
}

// --- Task & DB Types ---
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskType = 'competitor_audit' | 'lighthouse_speed' | 'ux_review';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  type: TaskType;
  date: Timestamp;
  projectId: string;
  pageId: string;
  
  assets: {
    myScreenshotUrl?: string;
    competitorScreenshotUrl?: string;
    lighthouseJson?: any;
  };
  
  aiResult?: AnalysisResult;
}
