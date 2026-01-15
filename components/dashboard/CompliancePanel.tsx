
import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, Scale } from 'lucide-react';
import { ComplianceRisk } from '../../types';

interface CompliancePanelProps {
  risks?: ComplianceRisk[];
}

export default function CompliancePanel({ risks = [] }: CompliancePanelProps) {
  const highRisks = risks.filter(r => r.risk_level === 'High');
  const mediumRisks = risks.filter(r => r.risk_level === 'Medium');
  const lowRisks = risks.filter(r => r.risk_level === 'Low');

  if (risks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Compliance Violations Detected</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Our Fair Housing Scanner did not detect any high-risk discriminatory language regarding Race, Religion, or Familial Status.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">{highRisks.length}</div>
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">High Risk Violations</div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
           <div className="bg-orange-100 p-3 rounded-full text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700">{mediumRisks.length}</div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Warnings</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
           <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700">{lowRisks.length}</div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Suggestions</div>
          </div>
        </div>
      </div>

      {/* Risk List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
             <Scale className="text-indigo-600" size={20} />
             Fair Housing Scan Results
           </h3>
           <span className="text-xs text-slate-500 italic">Automated scan • Verify with legal counsel</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {risks.map((risk, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors group">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                     <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                        ${risk.risk_level === 'High' ? 'bg-red-100 text-red-700 border-red-200' : 
                          risk.risk_level === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}
                     `}>
                        {risk.risk_level}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Category: {risk.category}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{risk.reason}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                     <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 block">Flagged Phrase</span>
                     <p className="text-sm font-medium text-red-800 line-through decoration-red-400 decoration-2">"{risk.flagged_phrase}"</p>
                  </div>
                  <div className="bg-green-50/50 border border-green-100 rounded-lg p-3 relative">
                     <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1 block">Safe Alternative</span>
                     <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <p className="text-sm font-bold text-green-800">"{risk.safe_alternative}"</p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
