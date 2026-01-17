import React, { useState, useMemo } from 'react';
import {
  Menu, Globe, CheckCircle2, Settings, Plus, FolderOpen, ChevronDown, ChevronUp, Layers, Layout, Briefcase, PlusCircle, Target, BarChart3, Package, ShieldAlert, FolderPlus, Folder, MoreVertical, Trash2, ArrowRight
} from 'lucide-react';
import { PSIProject, PSIPage, WorkspaceFolder } from '../../types/index';
import { checkProjectReadiness } from '../../services/projectService';

interface SidebarProps {
  projects: PSIProject[];
  activeProject: PSIProject;
  activePage: PSIPage;
  workspaceFolders: WorkspaceFolder[];
  onProjectSelect: (id: string) => void;
  onPageSelect: (page: PSIPage) => void;
  onAddProject: () => void;
  onViewSettings: () => void;
  onViewMarket: () => void;
  onViewLibrary: () => void;
  createWorkspaceFolder: (name: string) => void;
  deleteWorkspaceFolder: (id: string) => void;
  moveProjectToFolder: (projectId: string, folderId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects, activeProject, activePage, workspaceFolders, onProjectSelect, onPageSelect, onAddProject, onViewSettings, onViewMarket, onViewLibrary, createWorkspaceFolder, deleteWorkspaceFolder, moveProjectToFolder
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set([activeProject.id]));
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(workspaceFolders.map(f => f.id)));
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    const next = new Set(expandedProjects);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedProjects(next);
  };

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedFolders(next);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createWorkspaceFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const groupedProjects = useMemo(() => {
    const uncategorized: PSIProject[] = [];
    const inFolders: Record<string, PSIProject[]> = {};

    projects.forEach(p => {
      if (p.folderId && workspaceFolders.some(f => f.id === p.folderId)) {
        if (!inFolders[p.folderId]) inFolders[p.folderId] = [];
        inFolders[p.folderId].push(p);
      } else {
        uncategorized.push(p);
      }
    });

    return { uncategorized, inFolders };
  }, [projects, workspaceFolders]);

  const ProjectItem = ({ project }: { project: PSIProject }) => {
    const readiness = checkProjectReadiness(project);
    const isExpanded = expandedProjects.has(project.id);
    const isActive = activeProject.id === project.id;

    return (
      <div className="space-y-1">
        <div
          onClick={() => { onProjectSelect(project.id); toggleProject(project.id); }}
          className={`group/project flex items-center justify-between p-2 cursor-pointer rounded-lg transition-all relative ${isActive ? 'bg-surface border border-border' : 'hover:bg-surface border border-transparent'
            }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-6 h-6 rounded flex items-center justify-center border border-border relative shrink-0 ${isActive ? 'bg-primary/10' : 'bg-surface'}`}>
              {project.brand.logo ? <img src={project.brand.logo} className="w-4 h-4 object-contain" /> : <Globe size={12} className="text-slate-500" />}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={`text-[11px] font-medium tracking-wide truncate ${isActive ? 'text-primary' : 'text-[var(--text-primary)]'}`}>{String(project.name || 'UNNAMED')}</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuProjectId(activeMenuProjectId === project.id ? null : project.id);
                }}
                className="p-1 text-slate-400 hover:text-[var(--text-primary)] opacity-0 group-hover/project:opacity-100 transition-opacity"
              >
                <MoreVertical size={12} />
              </button>
              {isExpanded ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
            </div>
          )}

          {/* Project Management Menu */}
          {activeMenuProjectId === project.id && (
            <div
              className="absolute left-full ml-2 top-0 w-48 bg-background border border-border rounded-lg shadow-xl z-[60] p-1 animate-in fade-in slide-in-from-left-2 duration-200"
              onMouseLeave={() => setActiveMenuProjectId(null)}
            >
              <p className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-border mb-1">Group to</p>
              <button
                onClick={(e) => { e.stopPropagation(); moveProjectToFolder(project.id, undefined); setActiveMenuProjectId(null); }}
                className="w-full flex items-center gap-2 p-1.5 rounded text-[11px] text-slate-500 hover:bg-surface hover:text-[var(--text-primary)] transition-all"
              >
                <Layers size={12} /> Uncategorized
              </button>
              {workspaceFolders.map(f => (
                <button
                  key={f.id}
                  onClick={(e) => { e.stopPropagation(); moveProjectToFolder(project.id, f.id); setActiveMenuProjectId(null); }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded text-[11px] transition-all ${project.folderId === f.id ? 'text-primary bg-primary/5' : 'text-slate-500 hover:bg-surface hover:text-[var(--text-primary)]'}`}
                >
                  <Folder size={12} /> {String(f.name || 'Untitled')}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isCollapsed && isExpanded && (
          <div className="ml-5 space-y-0.5 mt-1 animate-in slide-in-from-top-1 duration-200 border-l border-border pl-2">
            {!readiness.isReady && (
              <div className="px-2 py-1.5 bg-red-500/5 border border-red-500/10 rounded mb-1">
                <p className="text-[9px] font-medium text-red-500 flex items-center gap-1.5">
                  <ShieldAlert size={10} /> Setup Required
                </p>
              </div>
            )}
            <button
              onClick={onViewMarket}
              className="w-full flex items-center gap-2.5 p-1.5 rounded text-left transition-all text-slate-500 hover:text-primary hover:bg-primary/5 group"
            >
              <BarChart3 size={12} className="text-slate-400 group-hover:text-primary" />
              <span className="text-[11px] font-medium">Market Analysis</span>
            </button>
            <button
              onClick={onViewLibrary}
              className="w-full flex items-center gap-2.5 p-1.5 rounded text-left transition-all text-slate-500 hover:text-primary hover:bg-primary/5 group"
            >
              <Package size={12} className="text-slate-400 group-hover:text-primary" />
              <span className="text-[11px] font-medium">Component Vault</span>
            </button>
            {project.pages.map(page => (
              <button
                key={page.id}
                onClick={() => onPageSelect(page)}
                className={`w-full flex items-center gap-2.5 p-1.5 rounded text-left transition-all ${activePage.id === page.id ? 'text-primary bg-primary/10 font-medium' : 'text-slate-500 hover:text-[var(--text-primary)] hover:bg-surface'
                  }`}
              >
                <CheckCircle2 size={12} className={page.status === 'improved' ? 'text-emerald-500' : 'text-slate-400'} />
                <span className="text-[11px] truncate">{String(page.name || 'Untitled Page')}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`relative h-screen bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col z-50 shrink-0 ${isCollapsed ? 'w-16' : 'w-72'
        }`}
    >
      <div className="flex flex-col border-b border-border p-4">
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center gap-2 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
              <Target size={14} />
            </div>
            <h1 className="text-[var(--text-primary)] font-bold text-sm tracking-tight">Agency Hub</h1>
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 text-slate-400 hover:text-[var(--text-primary)] bg-surface rounded-md transition-colors">
            <Menu size={16} />
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col gap-2">
            <button
              onClick={onAddProject}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg text-xs font-medium shadow-sm hover:bg-primary-hover transition-all"
            >
              <PlusCircle size={14} /> New Project
            </button>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-secondary transition-all"
            >
              <FolderPlus size={14} /> New Group
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* Create Folder UI */}
        {isCreatingFolder && !isCollapsed && (
          <div className="p-3 bg-surface border border-border rounded-lg animate-in zoom-in-95 duration-200">
            <form onSubmit={handleCreateFolder} className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <FolderPlus size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">New Group</span>
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Group name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-xs text-[var(--text-primary)] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsCreatingFolder(false)} className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-[var(--text-primary)]">Cancel</button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-white rounded text-[10px] font-bold uppercase tracking-wider">Create</button>
              </div>
            </form>
          </div>
        )}

        {/* Workspace Folders */}
        {workspaceFolders.map(folder => {
          const folderProjects = groupedProjects.inFolders[folder.id] || [];
          const isExpanded = expandedFolders.has(folder.id);

          return (
            <div key={folder.id} className="space-y-1">
              <div
                className="group flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-lg hover:bg-surface"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>
                  <Folder size={14} className={folderProjects.length > 0 ? 'text-primary' : 'text-slate-400'} />
                  {!isCollapsed && (
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate group-hover:text-[var(--text-primary)] transition-colors">{String(folder.name || 'Untitled')}</span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteWorkspaceFolder(folder.id); }}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {!isCollapsed && isExpanded && (
                <div className="ml-2 pl-2 animate-in slide-in-from-left-1 duration-200">
                  {folderProjects.length > 0 ? (
                    folderProjects.map(project => (
                      <ProjectItem key={project.id} project={project} />
                    ))
                  ) : (
                    <p className="py-2 text-[10px] text-slate-400 font-medium text-center italic">Empty Group</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized Projects */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 py-1 flex items-center gap-2 opacity-40 mb-2">
              <Layers size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Uncategorized</span>
            </div>
          )}
          {groupedProjects.uncategorized.map(project => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-1">
        <button
          onClick={onViewSettings}
          className={`w-full flex items-center p-2 rounded-lg text-slate-500 hover:text-[var(--text-primary)] hover:bg-surface transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="text-[11px] font-medium uppercase tracking-wide">Settings</span>}
        </button>
      </div>
    </aside>
  );
};