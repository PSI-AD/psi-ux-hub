import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Smartphone, Monitor, RefreshCw } from 'lucide-react';

interface LivePreviewProps {
  code: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!code) return;

    const renderComponent = async () => {
      setError(null);
      try {
        if (!(window as any).Babel) {
          throw new Error("Babel Transpiler is currently unavailable. Check your connection or CSP settings.");
        }

        // 1. Preprocess the code to handle exports and imports
        let processedCode = code
          .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '') 
          .replace(/export\s+default\s+/, 'const App = ') 
          .replace(/export\s+/, ''); 

        if (!processedCode.includes('const App =')) {
          const componentMatch = processedCode.match(/function\s+(\w+)\s*\(/) || processedCode.match(/const\s+(\w+)\s*=\s*\(/);
          if (componentMatch) {
            processedCode += `\nconst App = ${componentMatch[1]};`;
          }
        }

        // 2. Transpile with Babel
        const transpiled = (window as any).Babel.transform(processedCode, {
          presets: ['react'],
          filename: 'preview.tsx'
        }).code;

        // 3. Construct the isolated rendering script
        const finalScript = `
          (function() {
            try {
              const { React, ReactDOM, LucideReact } = window.parent;
              const { createRoot } = ReactDOM;
              Object.assign(window, LucideReact, { React });
              
              ${transpiled}

              const rootElement = document.getElementById('preview-root');
              if (window.previewRoot) {
                window.previewRoot.unmount();
              }
              window.previewRoot = createRoot(rootElement);
              window.previewRoot.render(React.createElement(App));
            } catch (err) {
              window.parent.postMessage({ type: 'preview-error', message: err.message }, '*');
            }
          })();
        `;

        const srcDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; background: #0d1117; color: white; font-family: sans-serif; overflow-x: hidden; }
                #preview-root { min-height: 100vh; display: flex; flex-direction: column; }
              </style>
            </head>
            <body>
              <div id="preview-root"></div>
              <script>${finalScript}</script>
            </body>
          </html>
        `;

        const iframe = document.createElement('iframe');
        iframe.className = "w-full h-full border-none";
        iframe.srcdoc = srcDoc;
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(iframe);
        }

      } catch (err: any) {
        setError(err.message);
      }
    };

    renderComponent();
  }, [code]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'preview-error') {
        setError(event.data.message);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800">
            <button 
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewport === 'desktop' ? 'bg-psi-gold text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Monitor size={14} />
            </button>
            <button 
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewport === 'mobile' ? 'bg-psi-gold text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Smartphone size={14} />
            </button>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
            {error ? 'Compilation Error' : 'Live Runtime'}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950/50 p-6 flex justify-center items-start pattern-grid">
        <div 
          className={`bg-slate-900 shadow-2xl transition-all duration-700 border border-slate-800 rounded-xl overflow-hidden h-full min-h-[500px] ring-1 ring-white/5 ${viewport === 'mobile' ? 'w-[375px]' : 'w-full max-w-5xl'}`}
          ref={containerRef}
        >
          {!code && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
              <RefreshCw className="animate-spin mb-4" size={32} />
              <p className="text-sm font-medium tracking-tight">Synthesizing Interactive Layer...</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border-t border-rose-500/20 text-rose-400 text-xs font-mono">
          <div className="flex items-center gap-2 mb-1 font-bold">
            <AlertCircle size={14} />
            Runtime Exception Detected:
          </div>
          <pre className="whitespace-pre-wrap p-2 bg-black/40 rounded border border-rose-500/10 mt-2">{error}</pre>
        </div>
      )}
    </div>
  );
};