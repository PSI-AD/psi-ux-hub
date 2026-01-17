
export enum AppStatus {
  IDLE = 'IDLE',
  AUDITING = 'AUDITING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum ComponentCategory {
  ATOM = 'ATOM',
  MOLECULE = 'MOLECULE',
  ORGANISM = 'ORGANISM'
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  color?: string;
}

export interface UIComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  code: string;
  previewImage?: string;
  tokens: {
    primaryColor: string;
    radius: string;
    spacing: string;
    typography: string;
  };
  timestamp: string;
}

export interface HeuristicBreakdown {
  visualHierarchy: number; // Max 25
  trustAuthority: number; // Max 20
  conversionFriction: number; // Max 20
  accessibilityCompliance: number; // Max 15
  infoArchitecture: number; // Max 10
  mobileResponsiveness: number; // Max 10
  total: number; // Max 100
}

export interface HeuristicRationale {
  category: string;
  currentObservation: string;
  proposedImprovement: string;
  impactScore: number;
}

export interface Hotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: 'friction' | 'improvement';
  description?: string;
}

export interface StandardItem {
  id: string;
  label: string;
  type: 'must-have' | 'recommended' | 'advanced';
  description: string;
  status: 'checked-ai' | 'missing' | 'manual';
}

export interface IndustryGroup {
  name: string;
  items: StandardItem[];
}

export interface AuditResult {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  currentHeuristics: HeuristicBreakdown;
  proposedHeuristics: HeuristicBreakdown;
  rationale: HeuristicRationale[];
  frictionPoints: string[];
  suggestedFixes: string[];
  hotspots: Hotspot[];
  codeFix: string;
  timestamp: string;
  suggestedImage?: string;
  blocks?: RedesignBlock[];
  benchmarks?: BenchmarkScore[];
  standardCompliance?: { id: string; found: boolean; evidence?: string }[];
}

export interface BenchmarkScore {
  category: 'Trust Signaling' | 'Ease of Navigation' | 'High-End Aesthetic';
  clientScore: number;
  competitorAvg: number;
}

export interface BrandDNA {
  colors: {
    primary: string;
    secondary: string;
    accents: string[];
  };
  typography: {
    heading: string; 
    body: string;
    tone: string; 
  };
  spacing: string;
  layoutRhythm: string; 
  extractedKeywords: string[];
  philosophy: string;
}

export interface BrandIdentity {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  dna?: BrandDNA;
  mission?: string;
  vision?: string;
  styleAttributes?: string[]; 
  guidelineUrl?: string;
  audit?: {
    colorAnalysis: string;
    typographySuggestions: string;
    marketPositioning: string;
    industryInsights: string;
  };
}

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  completed: boolean;
}

export interface PSIPage {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'improved' | 'auditing';
  order: number;
  history: AuditFolder[];
}

export interface PSIProject {
  id: string;
  name: string;
  baseUrl: string;
  industry: string;
  country: string;
  brand: BrandIdentity;
  competitors: string[];
  inspirationUrls: string[];
  businessObjectives: {
    targetAudience: string;
    primaryKPIs: string;
  };
  pages: PSIPage[];
  componentLibrary: DesignToken[];
  uiVault: UIComponent[];
  checklist: ChecklistItem[];
  folders: AuditFolder[];
  discoveryConfirmed?: boolean;
  folderId?: string;
  industryStandards?: IndustryGroup[];
}

export interface AuditFolder {
  id: string;
  pageId: string;
  timestamp: string;
  taskName: string;
  description: string;
  thumbnail: string;
  redesignImg: string;
  reports: {
    perf: number;
    acc: number;
    best: number;
    seo: number;
  };
  currentHeuristics?: HeuristicBreakdown;
  proposedHeuristics?: HeuristicBreakdown;
  rationale?: HeuristicRationale[];
  refinedCode: string;
  uxIssues: string[];
  voiceDirectives: string[];
  blocks?: RedesignBlock[];
  benchmarks?: BenchmarkScore[];
}

export interface RedesignBlock {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'footer' | 'content' | 'listings';
  title: string;
  originalImage?: string;
  suggestedImage: string;
  code: string;
  annotations: Annotation[];
  diagnosticScores: {
    hierarchy: number;
    readability: number;
    accessibility: number;
    conversion: number;
  };
  heuristicRationale?: HeuristicRationale[];
  heatmapData?: HeatmapPoint[];
  variantApproved?: boolean;
}

export interface Annotation {
  id: string;
  type: 'voice' | 'image' | 'text';
  content: string;
  timestamp: string;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number; 
}

export interface DesignToken {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'component';
  value: string;
  category: string;
}

// Added SectionFix interface to resolve missing exported member errors
export interface SectionFix {
  sectionType: string;
  issue: string;
  solution: string;
  code: string;
}
