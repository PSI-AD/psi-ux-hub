import React, { useRef } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
  preview?: string | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, preview, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpload(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {preview ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shadow-sm group">
          <img src={preview} className="w-full h-full object-cover" alt="Reference" />
          <button
            onClick={onClear}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-xl bg-surface border border-border hover:border-blue-500 text-slate-400 hover:text-blue-500 transition-all group"
          title="Upload Reference Image"
        >
          <Upload size={20} className="group-hover:scale-105 transition-transform" />
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFile}
      />
      <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
        Reference
      </span>
    </div>
  );
};