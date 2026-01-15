import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, Phone, Briefcase, Building2, Key, Percent, Users, FileText, CheckCircle2, AlertOctagon, Upload, Play, X, Swords, ArrowRight, Code, Copy, Eye } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// GEMINI SETUP
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// STYLES
const S = {
  container: { display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#0f172a', color: '#f1f5f9' },
  sidebar: { width: '280px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' as const },
  brand: { padding: '24px', borderBottom: '1px solid #334155', fontSize: '18px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { flex: 1, padding: '16px', overflowY: 'auto' as const },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' },
  navItemActive: { background: '#0f172a', color: '#10b981' },
  sectionTitle: { fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#64748b', marginTop: '24px', marginBottom: '8px', paddingLeft: '16px' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const },
  header: { marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' },
  subtitle: { fontSize: '14px', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px' },
  card: { background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', width: '100%', marginBottom: '32px' },
  splitView: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', fontSize: '16px', color: 'white', marginBottom: '24px', fontFamily: 'inherit' },
  dropZone: { width: '100%', background: '#0f172a', border: '2px dashed #334155', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', minHeight: '180px', position: 'relative' as const },
  button: { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '20px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  resultBox: { marginTop: '40px', background: '#0f172a', borderRadius: '16px', padding: '0', border: '1px solid #334155', overflow: 'hidden' },
  resultHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', background: '#1e293b', borderBottom: '1px solid #334155' },
  findingItem: { padding: '24px', borderBottom: '1px solid #334155' },
  findingTitle: { fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
  findingDesc: { fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.6 },
  implementBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  codeBlock: { background: '#1e1e1e', padding: '20px', borderRadius: '12px', marginTop: '16px', overflowX: 'auto' as const, border: '1px solid #333' },
  codePre: { fontFamily: 'monospace', fontSize: '13px', color: '#d4d4d4', margin: 0 }
};

async function fileToGenerativePart(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve({
        inlineData: {
          data: base64String.split(',')[1],
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// TYPES
type AuditFinding = {
  title: string;
  description: string;
  fixStrategy: string;
  codeSnippet?: string; // We'll generate this on demand or initially
};

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [mode, setMode] = useState<'standard' | 'competitor'>('standard');
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingCode, setGeneratingCode] = useState<string | null>(null); // ID of finding being processed

  // Inputs
  const [url, setUrl] = useState('');
  const [compUrl, setCompUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [compFile, setCompFile] = useState<File | null>(null);

  // Results
  const [findings, setFindings] = useState<AuditFinding[]>([]);

  // Refs
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  const handleAudit = async () => {
    if ((!url && !file) || (mode === 'competitor' && !compUrl && !compFile)) {
      alert("Please provide all required inputs (URLs or Screenshots).");
      return;
    }

    setAnalyzing(true);
    setFindings([]);

    try {
      let prompt = "";
      const parts: any[] = [];

      if (mode === 'competitor') {
        prompt = `
                Act as a Senior UX Strategist. 
                Compare 'My Page' (psinv.net) against the 'Competitor Page'.
                Identify 3 areas where the competitor is winning (e.g., Better Mobile Grid, Trust Signals, Sticky Nav).
                For each finding, provide a 'fixStrategy' describing how to implement it in React/Tailwind.
                
                Return a strictly valid JSON array of objects: 
                [{ "title": "...", "description": "...", "fixStrategy": "..." }]
                Do not include markdown blocks like \`\`\`json. Just the raw JSON.
            `;

        if (file) parts.push(await fileToGenerativePart(file));
        if (compFile) parts.push(await fileToGenerativePart(compFile));

        if (url) prompt += `\nMy URL: ${url}`;
        if (compUrl) prompt += `\nCompetitor URL: ${compUrl}`;

        parts.push(prompt);

      } else {
        prompt = `
                Act as a Senior UX Strategist. 
                Analyze 'My Page' (psinv.net).
                Identify exactly 3 critical UX friction points.
                For each finding, provide a 'fixStrategy' describing the solution in React/Tailwind.

                Return a strictly valid JSON array of objects: 
                [{ "title": "...", "description": "...", "fixStrategy": "..." }]
                Do not include markdown blocks like \`\`\`json. Just the raw JSON.
            `;

        if (file) parts.push(await fileToGenerativePart(file));
        if (url) prompt += `\nTarget URL: ${url}`;
        parts.push(prompt);
      }

      const result = await model.generateContent(parts);
      const text = result.response.text().replace(/```json|```/g, "").trim();

      try {
        const data = JSON.parse(text);
        setFindings(data);
      } catch (e) {
        console.error("JSON Parse Error", text);
        // Fallback if JSON is messy
        setFindings([{
          title: "Analysis Completed (Raw Format)",
          description: text,
          fixStrategy: "Review raw output for details."
        }]);
      }

    } catch (e: any) {
      alert(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const implementFix = async (finding: AuditFinding, index: number) => {
    setGeneratingCode(String(index));
    try {
      const prompt = `
            Act as a Senior React Developer.
            Task: Implement the following fix for psinv.net.
            Fix: "${finding.title}" - ${finding.fixStrategy}
            
            Requirements:
            1. Create a complete, functional React functional component.
            2. Use Tailwind CSS for styling (assume standard config).
            3. Use 'lucide-react' for icons if needed.
            4. Make it look premium (Dark mode preferred).
            5. Return ONLY the code (no explanations).
          `;

      const result = await model.generateContent(prompt);
      const code = result.response.text().replace(/```tsx|```javascript|```/g, "").trim();

      // Update findings with code
      const newFindings = [...findings];
      newFindings[index].codeSnippet = code;
      setFindings(newFindings);

    } catch (e: any) {
      alert("Code Generation Failed: " + e.message);
    } finally {
      setGeneratingCode(null);
    }
  };

  return (
    <div style={S.container}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.brand}>
          <div style={{ width: 32, height: 32, background: '#10b981', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold' }}>P</div>
          PSI UX HUB
        </div>
        <nav style={S.nav}>
          <div style={S.sectionTitle}>Strategy Room</div>
          <div
            onClick={() => setMode('competitor')}
            style={{ ...S.navItem, ...(mode === 'competitor' ? S.navItemActive : {}) }}
          >
            <Swords size={18} />
            Competitor Intelligence
          </div>
          <div
            onClick={() => setMode('standard')}
            style={{ ...S.navItem, ...(mode === 'standard' ? S.navItemActive : {}) }}
          >
            <AlertOctagon size={18} />
            Forensic Audit
          </div>

          <div style={S.sectionTitle}>Pages</div>
          {['Home Page', 'Luxury Projects', 'Off-Plan', 'Management', 'Sales Services', 'Mortgage', 'Careers', 'Contact Us'].map(name => (
            <div key={name} style={S.navItem}><FileText size={18} />{name}</div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        <header style={S.header}>
          <div>
            <div style={S.subtitle}>Strategy Engine</div>
            <h1 style={S.title}>{mode === 'competitor' ? 'Competitor Benchmarking' : 'Forensic UX Audit'}</h1>
          </div>
          {mode === 'competitor' && <div style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: 20, fontSize: 13, fontWeight: 'bold' }}>VS Mode Active</div>}
        </header>

        <div style={S.card}>
          {mode === 'competitor' ? (
            <div style={S.splitView}>
              {/* MY SITE */}
              <div>
                <div style={{ ...S.label, color: '#10b981' }}>MY SITE (psinv.net)</div>
                <input value={url} onChange={e => setUrl(e.target.value)} type="text" style={S.input} placeholder="https://www.psinv.net..." />
                <div style={S.dropZone} onClick={() => fileRef1.current?.click()}>
                  <input type="file" ref={fileRef1} style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                  {file ? <CheckCircle2 color="#10b981" /> : <Upload color="#475569" />}
                  <div style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>{file?.name || "Upload Screenshot"}</div>
                </div>
              </div>
              {/* COMPETITOR */}
              <div>
                <div style={{ ...S.label, color: '#f59e0b' }}>COMPETITOR SITE</div>
                <input value={compUrl} onChange={e => setCompUrl(e.target.value)} type="text" style={S.input} placeholder="https://www.bayut.com..." />
                <div style={S.dropZone} onClick={() => fileRef2.current?.click()}>
                  <input type="file" ref={fileRef2} style={{ display: 'none' }} onChange={e => setCompFile(e.target.files?.[0] || null)} />
                  {compFile ? <CheckCircle2 color="#10b981" /> : <Upload color="#475569" />}
                  <div style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>{compFile?.name || "Upload Screenshot"}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 32 }}>
              <div style={S.label}>TARGET RESOURCE</div>
              <input value={url} onChange={e => setUrl(e.target.value)} type="text" style={S.input} placeholder="Paste PageSpeed or Site URL..." />
              <div style={S.dropZone} onClick={() => fileRef1.current?.click()}>
                <input type="file" ref={fileRef1} style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                {file ? <CheckCircle2 size={32} color="#10b981" /> : <Upload size={32} color="#475569" />}
                <div style={{ marginTop: 12, fontWeight: 500, color: '#94a3b8' }}>{file?.name || "Drag & Drop Report / Screenshot"}</div>
              </div>
            </div>
          )}

          <button disabled={analyzing} onClick={handleAudit} style={{ ...S.button, opacity: analyzing ? 0.7 : 1 }}>
            {analyzing ? (
              'ANALYZING...'
            ) : (
              <>
                <Play size={20} fill="white" />
                {mode === 'competitor' ? 'RUN COMPETITIVE SCAN' : 'RUN PROFESSIONAL AUDIT'}
              </>
            )}
          </button>
        </div>

        {/* RESULTS */}
        {findings.length > 0 && (
          <div style={S.resultBox}>
            <div style={S.resultHeader}>
              <Eye size={20} />
              Strategy & Implementation Plan
            </div>
            {findings.map((f, i) => (
              <div key={i} style={S.findingItem}>
                <div style={S.findingTitle}>
                  <AlertOctagon size={16} color="#f59e0b" />
                  {f.title}
                </div>
                <div style={S.findingDesc}>{f.description}</div>

                {!f.codeSnippet ? (
                  <button
                    onClick={() => implementFix(f, i)}
                    disabled={generatingCode === String(i)}
                    style={{ ...S.implementBtn, opacity: generatingCode === String(i) ? 0.7 : 1 }}
                  >
                    {generatingCode === String(i) ? 'GENERATING CODE...' : '⚡ IMPLEMENT SOLUTION'}
                  </button>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#10b981' }}>✔ IMPLEMENTATION READY</div>
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, cursor: 'pointer' }}>
                        <Copy size={12} /> Copy Code
                      </div>
                    </div>
                    <div style={S.codeBlock}>
                      <pre style={S.codePre}>{f.codeSnippet}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
