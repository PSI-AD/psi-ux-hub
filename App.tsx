import React from 'react';
import './index.css';

const App = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar - Zero Dependency */}
      <div className="w-64 bg-slate-900 text-white flex flex-col p-4">
        <div className="text-xl font-bold mb-8 text-emerald-400">PSI UX BOOT</div>
        <nav className="flex flex-col gap-2">
          <div className="p-2 bg-slate-800 rounded cursor-pointer hover:bg-emerald-600 transition">Home Page</div>
          <div className="p-2 bg-transparent rounded cursor-pointer hover:bg-slate-800 transition">Luxury Projects</div>
          <div className="p-2 bg-transparent rounded cursor-pointer hover:bg-slate-800 transition">Contact Us</div>
          <div className="p-2 bg-transparent rounded cursor-pointer hover:bg-slate-800 transition">About Us</div>
          <div className="p-2 bg-transparent rounded cursor-pointer hover:bg-slate-800 transition">Careers</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Internal Audit Console</h1>

        <div className="grid grid-cols-2 gap-8 max-w-4xl">
          {/* Box 1 */}
          <div className="bg-white p-6 border border-slate-300 rounded-lg shadow-sm">
            <label className="block font-bold mb-2 text-slate-600">Target URL</label>
            <input type="text" className="w-full border border-slate-300 p-2 rounded" placeholder="https://..." />
          </div>

          {/* Box 2 */}
          <div className="bg-white p-6 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center min-h-[150px] text-slate-400 font-bold hover:bg-slate-50 cursor-pointer">
            UPLOAD EVIDENCE
          </div>
        </div>

        <button className="mt-8 bg-emerald-600 text-white font-bold py-3 px-8 rounded w-fit hover:bg-emerald-700 transition">
          START DEEP AUDIT
        </button>
      </div>
    </div>
  );
};

export default App;
