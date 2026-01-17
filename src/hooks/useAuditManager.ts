import { useState, useCallback, useEffect } from 'react';
import { AppStatus, AuditResult, PSIPage, AuditFolder, PSIProject, RedesignBlock, ChecklistItem, UIComponent, HeuristicRationale, WorkspaceFolder, IndustryGroup } from '../types/index';
import { runUXAudit, extractBrandColors, crawlSiteStructure, analyzeBrandIdentity, extractLibraryComponents } from '../services/geminiService';
import { PSI_PAGES } from '../constants/index';

const INITIAL_PAGES: PSIPage[] = PSI_PAGES.map((p, i) => ({ ...p, order: i }));

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'brand-dna', category: 'Intelligence', label: 'Brand DNA: Mission/Vision Synchronized', completed: false },
  { id: 'competitor-map', category: 'Intelligence', label: 'Market Map: Direct Competitors Identified', completed: false },
  { id: 'kpi-sync', category: 'Objectives', label: 'KPI Alignment: Success Metrics defined', completed: false },
  { id: 'logo-fidelity', category: 'Brand Sovereignty', label: 'Color Fidelity: Logo hex code verification', completed: true },
  { id: 'typo-alignment', category: 'Brand Sovereignty', label: 'Typography Alignment: Luxury/Corporate style check', completed: false },
  { id: 'perf-bench', category: 'Competitive Superiority', label: 'Performance Benchmarking: Speed/ACC remediation', completed: false },
  { id: 'report-final', category: 'Deliverable Readiness', label: 'Report Finalization: Strategic narrative alignment', completed: false },
];

const REAL_ESTATE_STANDARDS: IndustryGroup[] = [
  {
    name: "Architectural Core Pages",
    items: [
      { id: "listings-grid", label: "Interactive Property Listings Grid", type: "must-have", description: "High-performance grid with AJAX filtering.", status: "checked-ai" },
      { id: "property-details", label: "Dynamic Property Detail View", type: "must-have", description: "SEO-optimized pages for individual units.", status: "checked-ai" },
      { id: "developer-showcase", label: "Developer/Project Inventory Hub", type: "recommended", description: "Dedicated section for Emaar, Nakheel, etc.", status: "missing" },
      { id: "off-plan-hub", label: "Off-Plan Launch Portal", type: "must-have", description: "Focused UI for new developments and payment plans.", status: "checked-ai" }
    ]
  },
  {
    name: "Lead & Conversion Functions",
    items: [
      { id: "mortgage-calc", label: "Mortgage & ROI Calculator", type: "recommended", description: "Tooling to justify investment numbers.", status: "manual" },
      { id: "whatsapp-bridge", label: "Floating WhatsApp Lead Bridge", type: "must-have", description: "Instant agent connection for high-intent users.", status: "checked-ai" },
      { id: "floorplan-viewer", label: "Interactive Floorplan Viewer", type: "advanced", description: "2D/3D visualization of unit layouts.", status: "missing" },
      { id: "map-search", label: "Polygon Map-Based Search", type: "advanced", description: "Geographical discovery of properties.", status: "manual" }
    ]
  },
  {
    name: "Trust & Authority",
    items: [
      { id: "rera-license", label: "RERA / Government Verified Badges", type: "must-have", description: "Legal transparency signaling for Dubai/UAE.", status: "checked-ai" },
      { id: "agent-profiles", label: "Certified Agent Portfolio Pages", type: "recommended", description: "Individual pages for broker authority.", status: "missing" },
      { id: "area-guides", label: "Community & Lifestyle Area Guides", type: "recommended", description: "Content-driven trust and local expertise.", status: "checked-ai" }
    ]
  }
];

const DEFAULT_PROJECT: PSIProject = {
  id: 'psi-platinum',
  name: 'Property Shop Investment',
  baseUrl: 'https://psinv.net/',
  industry: 'Real Estate',
  country: 'United Arab Emirates',
  brand: {
    primaryColor: '#D4AF37',
    secondaryColor: '#020617',
    logo: 'https://psinv.net/wp-content/uploads/2021/04/PSI-Logo.png',
    mission: '',
    vision: '',
    styleAttributes: [],
  },
  competitors: [],
  inspirationUrls: [],
  businessObjectives: {
    targetAudience: '',
    primaryKPIs: ''
  },
  pages: INITIAL_PAGES,
  folders: [],
  checklist: DEFAULT_CHECKLIST,
  industryStandards: REAL_ESTATE_STANDARDS,
  componentLibrary: [],
  uiVault: []
};

export const useAuditManager = () => {
  const [projects, setProjects] = useState<PSIProject[]>(() => {
    const saved = localStorage.getItem('psi_projects');
    const parsed = saved ? JSON.parse(saved) : [DEFAULT_PROJECT];
    return parsed.map((p: PSIProject) => ({
      ...p,
      brand: {
        ...p.brand,
        mission: p.brand.mission || '',
        vision: p.brand.vision || '',
        styleAttributes: p.brand.styleAttributes || []
      },
      competitors: p.competitors || [],
      inspirationUrls: p.inspirationUrls || [],
      checklist: p.checklist || DEFAULT_CHECKLIST,
      industryStandards: p.industryStandards || (p.industry === 'Real Estate' ? REAL_ESTATE_STANDARDS : []),
      uiVault: p.uiVault || [],
      businessObjectives: p.businessObjectives || { targetAudience: '', primaryKPIs: '' }
    }));
  });

  const [workspaceFolders, setWorkspaceFolders] = useState<WorkspaceFolder[]>(() => {
    const saved = localStorage.getItem('psi_workspace_folders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || DEFAULT_PROJECT.id);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('psi_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('psi_workspace_folders', JSON.stringify(workspaceFolders));
  }, [workspaceFolders]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const [activePageId, setActivePageId] = useState<string>(activeProject.pages[0]?.id || '');

  const activePage = activeProject.pages.find(p => p.id === activePageId) || activeProject.pages[0];

  const switchProject = (id: string) => {
    setActiveProjectId(id);
    const proj = projects.find(p => p.id === id);
    if (proj && proj.pages.length > 0) setActivePageId(proj.pages[0].id);
  };

  const switchPage = (page: PSIPage) => {
    setActivePageId(page.id);
    setAuditResult(null);
    setOriginalImageUrl(null);
    setStatus(AppStatus.IDLE);
  };

  const updateProjectSettings = useCallback((updates: Partial<PSIProject>) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates } : p));
  }, [activeProjectId]);

  const toggleChecklistItem = (itemId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          checklist: p.checklist?.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return p;
    }));
  };

  const handleLogoUpload = async (base64: string) => {
    const colors = await extractBrandColors(base64);
    updateProjectSettings({
      brand: { ...activeProject.brand, logo: base64, ...colors }
    });
  };

  const handleBrandAudit = async () => {
    if (!activeProject.brand.logo) return;
    setStatus(AppStatus.AUDITING);
    const audit = await analyzeBrandIdentity(activeProject.brand.logo, activeProject.industry, activeProject.country);
    updateProjectSettings({
      brand: { ...activeProject.brand, audit }
    });
    setStatus(AppStatus.IDLE);
  };

  const runSiteScan = async () => {
    setStatus(AppStatus.AUDITING);
    const suggested = await crawlSiteStructure(activeProject.baseUrl);
    const newPages: PSIPage[] = suggested.map((s, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: s.name,
      url: s.url,
      status: 'pending',
      order: activeProject.pages.length + i,
      history: []
    }));
    updateProjectSettings({ pages: [...activeProject.pages, ...newPages] });
    setStatus(AppStatus.IDLE);
  };

  const startAudit = async (screenshotBase64?: string, voicePrompt?: string) => {
    setStatus(AppStatus.AUDITING);
    if (screenshotBase64) setOriginalImageUrl(screenshotBase64);
    
    try {
      const result = await runUXAudit(
        activePage.url, 
        screenshotBase64 || originalImageUrl || undefined, 
        voicePrompt,
        { 
          brand: activeProject.brand, 
          competitors: activeProject.competitors, 
          industry: activeProject.industry, 
          country: activeProject.country,
          standards: activeProject.industryStandards 
        }
      );
      setAuditResult(result);
      setStatus(AppStatus.COMPLETED);
    } catch (error) {
      console.error("Audit Engine Error:", error);
      setStatus(AppStatus.ERROR);
    }
  };

  const acceptOptimization = async (
    taskName: string, 
    description: string, 
    beforeImg: string, 
    afterImg: string, 
    refinedCode: string,
    uxIssues: string[],
    voiceDirectives: string[] = [],
    reports: any,
    blocks: RedesignBlock[] = [],
    rationale: HeuristicRationale[] = []
  ) => {
    const timestamp = new Date().toISOString();
    const newFolder: AuditFolder = {
      id: Math.random().toString(36).substr(2, 9),
      pageId: activePageId,
      timestamp,
      taskName,
      description,
      thumbnail: beforeImg,
      redesignImg: afterImg,
      reports,
      currentHeuristics: auditResult?.currentHeuristics,
      proposedHeuristics: auditResult?.proposedHeuristics,
      rationale,
      refinedCode,
      uxIssues,
      voiceDirectives,
      blocks
    };

    let extracted: UIComponent[] = [];
    try {
      for (const block of blocks) {
        const components = await extractLibraryComponents(block.code, block.type);
        extracted = [...extracted, ...components];
      }
    } catch (err) {
      console.warn("Component extraction partially failed:", err);
    }

    updateProjectSettings({
      pages: activeProject.pages.map(p => 
        p.id === activePageId 
          ? { ...p, status: 'improved', history: [newFolder, ...p.history] } 
          : p
      ),
      uiVault: [...(activeProject.uiVault || []), ...extracted]
    });
  };

  const addProject = (name: string, url: string, industry: string, country: string) => {
    const newProj: PSIProject = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      baseUrl: url,
      industry,
      country,
      brand: { primaryColor: '#D4AF37', secondaryColor: '#020617', styleAttributes: [], mission: '', vision: '' },
      competitors: [],
      inspirationUrls: [],
      businessObjectives: { targetAudience: '', primaryKPIs: '' },
      pages: [],
      folders: [],
      checklist: DEFAULT_CHECKLIST,
      industryStandards: industry === 'Real Estate' ? REAL_ESTATE_STANDARDS : [],
      componentLibrary: [],
      uiVault: []
    };
    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
  };

  const createWorkspaceFolder = (name: string) => {
    const newFolder: WorkspaceFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setWorkspaceFolders(prev => [...prev, newFolder]);
  };

  const deleteWorkspaceFolder = (id: string) => {
    setWorkspaceFolders(prev => prev.filter(f => f.id !== id));
    setProjects(prev => prev.map(p => p.folderId === id ? { ...p, folderId: undefined } : p));
  };

  const moveProjectToFolder = (projectId: string, folderId?: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, folderId } : p));
  };

  return {
    projects,
    activeProject,
    activePage,
    switchProject,
    switchPage,
    status,
    auditResult,
    setAuditResult,
    startAudit,
    originalImageUrl,
    acceptOptimization,
    updateProjectSettings,
    toggleChecklistItem,
    handleLogoUpload,
    handleBrandAudit,
    runSiteScan,
    addProject,
    workspaceFolders,
    createWorkspaceFolder,
    deleteWorkspaceFolder,
    moveProjectToFolder
  };
};