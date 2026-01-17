
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Plus, RefreshCcw, Maximize } from 'lucide-react';

interface ZoomableContainerProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export const ZoomableContainer: React.FC<ZoomableContainerProps> = ({ 
  children, 
  className = '', 
  minScale = 0.5, 
  maxScale = 5 
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateScale = useCallback((delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, minScale), maxScale));
  }, [minScale, maxScale]);

  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      updateScale(delta);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 && position.x === 0 && position.y === 0) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') updateScale(0.2);
    if (e.key === '-' || e.key === '_') updateScale(-0.2);
    if (e.key === '0') reset();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden select-none bg-slate-950/50 group/zoom ${className} ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Interactive zoom and pan area"
    >
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
        }}
        className="w-full h-full origin-center flex items-center justify-center pointer-events-auto"
      >
        {children}
      </div>

      {/* Accessible Tooltip Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
        <div className="px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover/zoom:opacity-100 transition-opacity">
          Ctrl + Scroll to Zoom
        </div>
        <div className="px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover/zoom:opacity-100 transition-opacity delay-75">
          Drag to Pan
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10">
          <button 
            onClick={() => updateScale(-0.2)}
            className="p-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white border-r border-slate-800"
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <Minus size={16} />
          </button>
          
          <div className="px-3 flex items-center justify-center min-w-[54px] text-xs font-black text-psi-gold tracking-tighter">
            {Math.round(scale * 100)}%
          </div>

          <button 
            onClick={() => updateScale(0.2)}
            className="p-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white border-l border-slate-800"
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={reset}
            className="p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl text-slate-400 hover:text-psi-gold hover:bg-slate-800 transition-all shadow-2xl ring-1 ring-white/10"
            title="Reset View (0)"
            aria-label="Reset Zoom and Pan"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
