import React, { useState } from 'react';
import './index.css';
import { Upload, Link as LinkIcon, CheckCircle2, LayoutDashboard, Building2, Phone, Users, Briefcase, Key, Percent, Home } from 'lucide-react';

// PSI Sidebar Data
const PROJECTS = [
  {
    id: 'psinv-net',
    name: 'Property Shop Investment',
    folders: [
      { id: 'home', name: 'Home Page', icon: Home },
      { id: 'luxury', name: 'Luxury Projects', icon: Building2 },
      { id: 'off-plan', name: 'Off-Plan Projects', icon: Briefcase },
      { id: 'sales', name: 'Sales Services', icon: Percent },
      { id: 'management', name: 'Property Management', icon: Key },
      { id: 'mortgage', name: 'Mortgage Solutions', icon: Percent },
      { id: 'about', name: 'About Us', icon: Users },
      { id: 'careers', name: 'Careers', icon: Users },
      { id: 'contact', name: 'Contact Us', icon: Phone }
    ]
  }
];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const handleAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      alert("Deep Audit functionality disabled in Safe Mode.");
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Professional Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">P</div>
            <h1 className="font-bold text-lg tracking-tight">PSI UX Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-11">Internal Audit Tool</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {PROJECTS[0].name}
          </div>
          {PROJECTS[0].folders.map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActivePage(f.id)}
                className={`w-full text-left px-3 py-3 text-sm font-medium rounded-lg flex items-center gap-3 transition-colors ${activePage === f.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {f.name}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AI</div>
            <div>
              <p className="text-sm font-medium text-white">Gemini Flash</p>
              <p className="text-xs text-emerald-400">● System Ready</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-slate-400" size={20} />
            <span>Audit Console</span>
            <span className="text-slate-300 mx-2">/</span>
            <span className="text-emerald-600">Property Shop Investment</span>
          </h2>
          <div className="text-sm text-slate-500">v2.0 Safe Mode</div>
        </header>

        {/* Audit Workspace */}
        <div className="flex-1 overflow-auto p-12 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Deep Forensic Audit</h2>
              <p className="text-slate-500 mb-10 text-lg">Select a target URL or upload evidence to begin analysis.</p>

              <div className="grid md:grid-cols-2 gap-10 mb-12">
                {/* URL Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Target Page URL
                  </label>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                    <div className="flex items-center gap-3 mb-3 text-slate-400">
                      <LinkIcon size={20} />
                      <span className="text-xs font-bold">PAGESPEED / LIVE SITE</span>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-lg font-medium"
                      placeholder="https://pagespeed.web.dev/..."
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Evidence Upload
                  </label>
                  <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative text-center group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files?.[0] || null)} />
                    {file ? (
                      <>
                        <CheckCircle2 size={32} className="text-emerald-600 mb-2" />
                        <span className="font-bold text-emerald-800">{file.name}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-600 group-hover:text-emerald-700">Drop Screenshots or JSON</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={handleAudit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1 flex items-center gap-2"
                >
                  {isAnalyzing ? "Analyzing..." : "Run Deep Audit"}
                  {!isAnalyzing && <span className="text-emerald-200">→</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
