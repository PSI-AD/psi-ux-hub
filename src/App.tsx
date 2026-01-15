
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Workspace from './components/dashboard/Workspace';
import { Project } from './types';
import { User, Settings } from 'lucide-react';
import { DBService } from './services/db-service';

// Initialize with consistent mock data
// Initialize with Real PSI Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'psinv-net',
    name: 'Property Shop Investment',
    baseUrl: 'https://www.psinv.net',
    propertyType: 'Luxury',
    folders: [
      { id: 'home', name: 'Home Page', url: 'https://www.psinv.net', snapshots: [] },
      { id: 'contact-us', name: 'Contact Us', url: 'https://psinv.net/en/contact-us', snapshots: [] },
      { id: 'about-us', name: 'About Us', url: 'https://psinv.net/en/about-us', snapshots: [] },
      { id: 'careers', name: 'Careers', url: 'https://psinv.net/en/careers', snapshots: [] },
      { id: 'luxury-projects', name: 'Luxury Projects', url: 'https://psinv.net/en/project/luxury-project-uae/', snapshots: [] },
      { id: 'sales-services', name: 'Sales Services', url: 'https://psinv.net/en/services/sales/sales-services/', snapshots: [] },
      { id: 'property-management', name: 'Property Management', url: 'https://psinv.net/en/services/sales/property-management/', snapshots: [] },
      { id: 'off-plan-projects', name: 'Off-Plan Projects', url: 'https://psinv.net/en/projects-off-plan', snapshots: [] },
      { id: 'mortgage-solutions', name: 'Mortgage Solutions', url: 'https://psinv.net/en/services/sales/mortgage-solutions/', snapshots: [] },
      { id: 'listing-details', name: 'Listing Details (Sample)', url: 'https://psinv.net/en/projects/abu-dhabi/saadiyat-island', snapshots: [] }
    ]
  }
];

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('psinv-net');
  const [activeFolderId, setActiveFolderId] = useState<string>('home');

  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeFolder = activeProject?.folders.find(f => f.id === activeFolderId);

  const handleAddPage = async (projectId: string, pageName: string) => {
    try {
      // 1. Create in Firestore (best effort)
      const pageId = await DBService.createPage(projectId, pageName);

      // 2. Update Local State immediately
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            folders: [
              ...p.folders,
              { id: pageId, name: pageName, snapshots: [] }
            ]
          };
        }
        return p;
      }));

      // 3. Auto-select the new folder
      setActiveProjectId(projectId);
      setActiveFolderId(pageId);

    } catch (error) {
      console.error("Failed to add page:", error);
      // Fallback for demo/offline: Update local state even if DB fails
      const mockId = pageName.toLowerCase().replace(/\s+/g, '-');
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === projectId) {
          if (p.folders.find(f => f.id === mockId)) return p;
          return {
            ...p,
            folders: [...p.folders, { id: mockId, name: pageName, snapshots: [] }]
          };
        }
        return p;
      }));
      setActiveProjectId(projectId);
      setActiveFolderId(mockId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Global Header (Optional - mostly handled by Workspace/Sidebar top sections now, but keeping a slim top bar for mobile if needed or global branding) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 md:hidden">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Real Estate <span className="text-indigo-600">Hub</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={projects}
          activeProjectId={activeProjectId}
          activeFolderId={activeFolderId}
          onSelectProject={setActiveProjectId}
          onSelectFolder={(pId, fId) => {
            setActiveProjectId(pId);
            setActiveFolderId(fId);
          }}
          onAddPage={handleAddPage}
        />
        <Workspace
          activeProject={activeProject}
          activeFolder={activeFolder}
        />
      </div>
    </div>
  );
};

export default App;
