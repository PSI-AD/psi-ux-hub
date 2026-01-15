import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Image as ImageIcon, Loader2, Activity, Globe, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface InputZoneProps {
  onAnalyze: (myPage: File | string | null, competitors: (File | string)[]) => void;
  isAnalyzing: boolean;
}

// Helper component to display Favicon with fallback
const UrlIcon = ({ url }: { url: string }) => {
  const [error, setError] = useState(false);
  
  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    return <Globe className="w-8 h-8 mb-2 text-indigo-300" />;
  }

  if (error) {
    return <Globe className="w-8 h-8 mb-2 text-indigo-300" />;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
      alt="Site Favicon"
      className="w-10 h-10 mb-2 rounded-md shadow-sm bg-white p-0.5 object-contain"
      onError={() => setError(true)}
    />
  );
};

export const InputZone: React.FC<InputZoneProps> = ({ onAnalyze, isAnalyzing }) => {
  const [myPage, setMyPage] = useState<File | string | null>(null);
  const [competitors, setCompetitors] = useState<(File | string)[]>([]);
  
  // URL Input States
  const [myPageUrlInput, setMyPageUrlInput] = useState("");
  const [compUrlInput, setCompUrlInput] = useState("");

  // Validation States
  const [myPageUrlError, setMyPageUrlError] = useState<string | null>(null);
  const [compUrlError, setCompUrlError] = useState<string | null>(null);

  const myPageInputRef = useRef<HTMLInputElement>(null);
  const compInputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (input: string): string | null => {
    if (!input) return "URL cannot be empty";
    
    // Check for spaces
    if (/\s/.test(input)) return "URL cannot contain spaces";

    // Check for protocol
    if (!/^https?:\/\//i.test(input)) {
        return "Missing protocol (start with http:// or https://)";
    }

    try {
      const url = new URL(input);
      // Extra check for domain structure
      if (url.hostname.indexOf('.') === -1 && url.hostname !== 'localhost') {
         return "Incomplete domain (missing TLD like .com)";
      }
      return null; // Valid
    } catch (e) {
      return "Invalid URL syntax";
    }
  };

  const handleMyPageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMyPage(e.target.files[0]);
      setMyPageUrlError(null);
    }
  };

  const handleMyPageUrlSubmit = () => {
    const trimmed = myPageUrlInput.trim();
    if (!trimmed) return;

    const errorMsg = validateUrl(trimmed);
    if (errorMsg) {
      setMyPageUrlError(errorMsg);
      return;
    }

    setMyPage(trimmed);
    setMyPageUrlInput("");
    setMyPageUrlError(null);
  };

  const handleCompetitorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCompetitors([...competitors, ...Array.from(e.target.files)]);
      setCompUrlError(null);
    }
    // Reset file input value so the same file can be selected again if needed
    if (compInputRef.current) {
        compInputRef.current.value = "";
    }
  };

  const handleCompetitorUrlSubmit = () => {
    const trimmed = compUrlInput.trim();
    if (!trimmed) return;

    const errorMsg = validateUrl(trimmed);
    if (errorMsg) {
      setCompUrlError(errorMsg);
      return;
    }

    setCompetitors([...competitors, trimmed]);
    setCompUrlInput("");
    setCompUrlError(null);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const renderPreview = (item: File | string, onDelete: () => void) => {
    const isFile = item instanceof File;
    return (
      <div className="relative group border border-slate-200 rounded-xl p-2 bg-white shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-2 relative flex items-center justify-center">
           {isFile ? (
             <img src={URL.createObjectURL(item)} alt="Preview" className="w-full h-full object-cover" />
           ) : (
             <div className="bg-indigo-50 w-full h-full flex flex-col items-center justify-center text-indigo-400 p-2 text-center">
               <UrlIcon url={item} />
               <span className="text-[10px] w-full truncate block px-1 font-medium text-indigo-900" title={item}>{item}</span>
             </div>
           )}
        </div>
        <p className="text-xs text-slate-600 truncate px-1 font-medium">
          {isFile ? item.name : item}
        </p>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 z-10"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* My Page Section */}
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">1</span>
              My Page
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Target</span>
          </div>
          
          {myPage ? (
            <div className="h-64">
              {renderPreview(myPage, () => setMyPage(null))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Dropzone */}
              <div 
                onClick={() => myPageInputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40 hover:border-indigo-400 hover:bg-slate-50"
              >
                <input 
                  type="file" 
                  ref={myPageInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleMyPageUpload} 
                />
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-slate-900 font-medium text-sm">Upload Screenshot</p>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-semibold">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* URL Input */}
              <div>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${
                        myPageUrlError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                      placeholder="Enter URL (e.g., https://mysite.com)"
                      value={myPageUrlInput}
                      onChange={(e) => {
                        setMyPageUrlInput(e.target.value);
                        if (myPageUrlError) setMyPageUrlError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleMyPageUrlSubmit()}
                    />
                  </div>
                  <button
                    onClick={handleMyPageUrlSubmit}
                    disabled={!myPageUrlInput.trim()}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Set
                  </button>
                </div>
                {myPageUrlError && (
                  <p className="mt-2 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {myPageUrlError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Competitors Section */}
        <div className="p-8 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">2</span>
              Competitors
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Benchmark</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* List Existing Competitors */}
            {competitors.map((item, idx) => (
              <div key={idx} className="h-32">
                {renderPreview(item, () => removeCompetitor(idx))}
              </div>
            ))}

            {/* Add New Block - Simplified */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-between h-32 bg-white hover:border-orange-400 transition-colors group relative">
              
              {/* Upload Area (Clickable) */}
              <div 
                onClick={() => compInputRef.current?.click()}
                className="w-full flex-grow flex flex-col items-center justify-center cursor-pointer -mt-1"
              >
                <input 
                  type="file" 
                  ref={compInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleCompetitorUpload} 
                />
                <Plus className="w-8 h-8 text-slate-300 group-hover:text-orange-500 transition-colors mb-2" />
                <p className="text-[10px] font-bold text-slate-400 group-hover:text-orange-600 uppercase tracking-wide">Upload Images</p>
              </div>

              {/* URL Input Area */}
              <div className="w-full pt-2 border-t border-slate-100 relative z-10">
                <div className="relative">
                   <LinkIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Paste URL + Enter" 
                      className={`w-full text-xs border rounded-md pl-6 pr-2 py-1.5 focus:outline-none transition-all ${
                        compUrlError 
                          ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-400' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-100'
                      }`}
                      value={compUrlInput}
                      onChange={(e) => {
                        setCompUrlInput(e.target.value);
                        if (compUrlError) setCompUrlError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleCompetitorUrlSubmit()}
                   />
                </div>
                {compUrlError && (
                  <p className="mt-1 text-[9px] text-red-600 truncate animate-in slide-in-from-top-1 text-center font-medium">
                    {compUrlError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {myPage ? '1 Target Set' : '0 Target Set'} • {competitors.length} Competitors
        </p>
        <button
          onClick={() => onAnalyze(myPage, competitors)}
          disabled={isAnalyzing || !myPage || competitors.length === 0}
          className={`
            flex items-center px-8 py-3 rounded-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all
            ${isAnalyzing || !myPage || competitors.length === 0 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:translate-y-[-1px] active:translate-y-[1px]'}
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing with Gemini...
            </>
          ) : (
            <>
              Generate Winning Report
              <Activity className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};