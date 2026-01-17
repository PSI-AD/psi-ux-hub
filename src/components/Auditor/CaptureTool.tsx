import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Upload, AlertCircle } from 'lucide-react';

export const CaptureTool = ({ onCapture }: { onCapture: (img: string) => void }) => {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const takeScreenshot = async () => {
    try {
      setError(null);
      setCapturing(true);
      
      // Attempt to use Display Media API
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' } as any,
      } as any);
      
      const video = document.createElement('video');
      video.srcObject = stream;
      
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const screenshot = canvas.toDataURL('image/png');
        onCapture(screenshot); 
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setCapturing(false);
      };
    } catch (err: any) {
      console.error("Capture failed:", err);
      setCapturing(false);
      
      // If it's a permission error or environmental restriction, prompt for file fallback
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setError("Screen capture restricted. Please upload screenshot manually.");
        // Automatically trigger file upload fallback after a short delay
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 1500);
      } else {
        setError("Failed to initialize capture engine.");
      }
    }
  };

  const handleFileFallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-bold uppercase animate-in fade-in slide-in-from-right-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        <button 
          onClick={takeScreenshot}
          disabled={capturing}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
            error ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-[#C5A059] text-slate-900'
          }`}
        >
          {capturing ? <RefreshCw className="animate-spin" size={16}/> : <Camera size={16} />}
          {capturing ? "Initialising..." : error ? "Try Again" : "Capture Viewport"}
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#C5A059] rounded-2xl transition-all shadow-lg group"
          title="Manual Upload Fallback"
        >
          <Upload size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileFallback} 
      />
    </div>
  );
};