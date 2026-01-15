
import React, { useState } from 'react';
import { X, Code, Eye } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactCode: string;
  htmlContent: string;
  title: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, reactCode, htmlContent, title }) => {
  const [mode, setMode] = useState<"visual" | "code">("visual");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setMode("visual")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "visual" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <Eye size={16} /> Visual Preview
              </button>
              <button 
                onClick={() => setMode("code")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "code" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <Code size={16} /> React Code
              </button>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white relative">
          {mode === "visual" ? (
            // THE SANDBOX: Renders the HTML string safely
            <iframe 
              srcDoc={htmlContent}
              title="Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts" // Security: Only allow scripts, no forms/popups
            />
          ) : (
            <div className="h-full overflow-auto bg-[#0d1117] p-6 custom-scrollbar">
              <pre className="text-sm font-mono text-indigo-100 whitespace-pre-wrap leading-relaxed">
                <code>{reactCode}</code>
              </pre>
            </div>
          )}
        </div>
        
        {/* Footer Info */}
        <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-center text-slate-500 uppercase tracking-widest font-semibold">
           Real Estate Hub • Implementation Preview Agent
        </div>
      </div>
    </div>
  );
};
