import React, { useState } from 'react';
import './index.css';
import { Upload, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

// Simple Mock Data for Sidebar
const PROJECTS = [
  {
    id: 'psinv-net',
    name: 'Property Shop Investment',
    folders: [
      { id: 'home', name: 'Home Page' },
      { id: 'luxury', name: 'Luxury Projects' },
      { id: 'contact', name: 'Contact Us' }
    ]
  }
];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      alert("Deep Audit functionality disabled in Safe Mode.");
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="font-bold text-lg text-slate-800">PSI UX Hub</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {PROJECTS[0].name}
          </div>
          {PROJECTS[0].folders.map(f => (
            <button key={f.id} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
              {f.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Drop Your Evidence Here</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Box 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <LinkIcon size={20} className="text-blue-500" />
                Paste PageSpeed Link
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm"
                placeholder="https://pagespeed.web.dev/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>

            {/* Box 2 */}
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] relative text-center">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <>
                  <CheckCircle2 size={32} className="text-emerald-600 mb-2" />
                  <span className="font-bold text-emerald-800">{file.name}</span>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-slate-400 mb-2" />
                  <span className="font-bold text-slate-700">Drag & Drop Screenshots</span>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAudit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              {isAnalyzing ? "Analyzing..." : "Deep Audit Now"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
