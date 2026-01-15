
import React, { useState } from "react";
import { 
  Plus, 
  Globe, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Settings,
  Check,
  X
} from "lucide-react";
import { clsx } from "clsx";
import { Project, Folder } from "../../types";

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  activeFolderId: string;
  onSelectProject: (id: string) => void;
  onSelectFolder: (projectId: string, folderId: string) => void;
  onAddPage: (projectId: string, pageName: string) => void;
}

export default function Sidebar({ 
  projects, 
  activeProjectId, 
  activeFolderId, 
  onSelectProject, 
  onSelectFolder,
  onAddPage
}: SidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<string[]>(projects.map(p => p.id));
  const [addingToProject, setAddingToProject] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const handleStartAdd = (projectId: string) => {
    setAddingToProject(projectId);
    setNewPageName("");
  }

  const handleCancelAdd = () => {
    setAddingToProject(null);
    setNewPageName("");
  }

  const handleSubmitAdd = (projectId: string) => {
    if (newPageName.trim()) {
      onAddPage(projectId, newPageName.trim());
    }
    handleCancelAdd();
  }

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50/50 h-[calc(100vh-64px)] flex flex-col font-sans hidden md:flex">
      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section: Websites */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Websites</h3>
            <button className="text-slate-400 hover:text-indigo-600 transition">
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {projects.map(project => (
              <div key={project.id}>
                <button 
                  onClick={() => {
                    onSelectProject(project.id);
                    toggleProject(project.id);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition group"
                >
                  {expandedProjects.includes(project.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Globe size={14} className={clsx("group-hover:text-indigo-500", activeProjectId === project.id ? "text-indigo-600" : "text-slate-400")} />
                  {project.name}
                </button>

                {/* Nested Pages */}
                {expandedProjects.includes(project.id) && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-slate-200 pl-2">
                    {project.folders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => onSelectFolder(project.id, folder.id)}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all text-left",
                          activeFolderId === folder.id 
                            ? "bg-white text-indigo-600 shadow-sm border border-slate-100 font-semibold" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                        )}
                      >
                        <FileText size={13} />
                        {folder.name}
                      </button>
                    ))}
                    
                    {addingToProject === project.id ? (
                       <div className="px-2 py-1 flex items-center gap-1 animate-in slide-in-from-left-2 duration-200">
                         <input 
                           autoFocus
                           type="text" 
                           value={newPageName}
                           onChange={(e) => setNewPageName(e.target.value)}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') handleSubmitAdd(project.id);
                             if (e.key === 'Escape') handleCancelAdd();
                           }}
                           placeholder="Page name..."
                           className="w-full text-xs px-2 py-1 rounded border border-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none min-w-0 bg-white"
                         />
                         <button onClick={() => handleSubmitAdd(project.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={12} /></button>
                         <button onClick={handleCancelAdd} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={12} /></button>
                       </div>
                    ) : (
                      <button 
                        onClick={() => handleStartAdd(project.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-indigo-600 transition mt-2"
                      >
                        <Plus size={12} /> Add Page
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-md transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-black" />
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900">Lead Architect</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
          <Settings size={16} className="ml-auto text-slate-400" />
        </button>
      </div>
    </aside>
  );
}
