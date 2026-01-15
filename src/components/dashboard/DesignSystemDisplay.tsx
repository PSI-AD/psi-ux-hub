
import React, { useState } from 'react';
import { Palette, Code, CheckCircle, ScanEye, XCircle, AlertTriangle } from 'lucide-react';
import { DesignSystem } from '../../types';

interface DesignSystemDisplayProps {
  designSystem: DesignSystem;
}

// --- CONTRAST HELPERS ---
const getLuminance = (hex: string) => {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const [lr, lg, lb] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

const getContrastRatio = (hex1: string, hex2: string) => {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export default function DesignSystemDisplay({ designSystem }: DesignSystemDisplayProps) {
  const [copiedConfig, setCopiedConfig] = useState(false);

  const generateTailwindConfig = () => {
    const { colors, typography, spacing_system, primary_button } = designSystem;
    
    // Construct colors object
    const colorConfig: Record<string, string> = {};
    colors.forEach((c, i) => {
        const name = i === 0 ? 'primary' : i === 1 ? 'secondary' : `accent-${i}`;
        colorConfig[name] = c;
    });

    if (primary_button) {
        colorConfig['btn-primary'] = primary_button.bg_color;
        colorConfig['btn-text'] = primary_button.text_color;
    }

    const fontStack = typography.map(f => `'${f}'`).join(', ');

    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colorConfig, null, 6).replace(/\n/g, '\n      ').replace(/}$/, '      }')},
      fontFamily: {
        sans: [${fontStack}, 'sans-serif'],
      },
      spacing: {
        // Detected Spacing System: ${spacing_system}
      }
    },
  },
};`;
  };

  const handleCopy = () => {
    const config = generateTailwindConfig();
    navigator.clipboard.writeText(config);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const primaryBtn = designSystem.primary_button;
  const contrastRatio = primaryBtn ? getContrastRatio(primaryBtn.bg_color, primaryBtn.text_color) : 0;
  const passAA = contrastRatio >= 4.5;
  const passAAA = contrastRatio >= 7.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Design Tokens Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-pink-500" />
              Competitor Design Tokens
            </h3>
            <button onClick={handleCopy} className="text-xs flex items-center bg-slate-100 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors border border-slate-200">
              {copiedConfig ? <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-600" /> : <Code className="w-3.5 h-3.5 mr-1.5 text-slate-500" />}
              {copiedConfig ? 'Copied' : 'Copy as Tailwind Config'}
            </button>
          </div>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {designSystem.colors.map((color, idx) => (
                <div key={idx} className="group relative">
                   <div className="w-10 h-10 rounded-lg shadow-sm cursor-pointer border border-slate-100 transition-transform hover:scale-110" style={{ backgroundColor: color }} title={color}></div>
                   <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Typography</p>
               <div className="text-sm font-medium">{designSystem.typography.join(", ")}</div>
            </div>
             <div>
               <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Spacing</p>
               <div className="text-sm font-medium">{designSystem.spacing_system}</div>
            </div>
          </div>
        </div>

        {/* Contrast Analysis Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-900 flex items-center mb-6">
            <ScanEye className="w-5 h-5 mr-2 text-indigo-500" />
            Contrast Ratio Compliance
          </h3>

          {primaryBtn ? (
            <div className="flex-1 flex flex-col justify-center">
               <div className="flex items-center gap-6 mb-8">
                  <div className="flex flex-col items-center">
                     <div 
                       className="px-6 py-3 rounded-lg font-medium shadow-sm border border-slate-100 text-sm mb-2"
                       style={{ backgroundColor: primaryBtn.bg_color, color: primaryBtn.text_color }}
                     >
                       Primary Button
                     </div>
                     <p className="text-[10px] text-slate-400">Preview</p>
                  </div>

                  <div className="flex-1 text-center border-l border-slate-100 pl-6">
                    <span className="block text-4xl font-extrabold text-slate-900 mb-1">
                      {contrastRatio.toFixed(2)}:1
                    </span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Contrast Ratio</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${passAA ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${passAA ? 'text-green-800' : 'text-red-800'}`}>WCAG AA</span>
                      {passAA ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <p className={`text-xs ${passAA ? 'text-green-700' : 'text-red-700'}`}>
                      {passAA ? 'Passes standard text requirements.' : 'Fails. Hard to read for many users.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${passAAA ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${passAAA ? 'text-green-800' : 'text-orange-800'}`}>WCAG AAA</span>
                      {passAAA ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-orange-600" />}
                    </div>
                    <p className={`text-xs ${passAAA ? 'text-green-700' : 'text-orange-700'}`}>
                      {passAAA ? 'Excellent. Meets highest standards.' : 'Fails enhanced standard.'}
                    </p>
                  </div>
               </div>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
               <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
               <p>Primary button colors could not be extracted.</p>
             </div>
          )}
        </div>
      </div>
  );
}
