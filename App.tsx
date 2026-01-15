import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, Phone, Briefcase, Building2, Key, Percent, Users, FileText, CheckCircle2, AlertOctagon, Upload, Play, X, Swords, ArrowRight, Code, Copy, Eye, Zap, Camera, Terminal, Globe, Search } from 'lucide-react';
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
  modeToggle: { display: 'flex', background: '#1e293b', borderRadius: '12px', padding: '4px', border: '1px solid #334155' },
  modeBtn: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', background: 'transparent', color: '#94a3b8', transition: 'all 0.2s' },
  modeBtnActive: { background: '#10b981', color: 'white', shadow: '0 2px 4px rgba(0,0,0,0.2)' },

  card: { background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', width: '100%', marginBottom: '32px' },
  splitView: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', fontSize: '16px', color: 'white', marginBottom: '16px', fontFamily: 'inherit' },

  dropZone: { width: '100%', background: '#0f172a', border: '2px dashed #334155', borderRadius: '16px', padding: '0', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', minHeight: '240px', position: 'relative' as const, overflow: 'hidden' },
  dropZoneContent: { padding: '32px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: '100%', zIndex: 10 },
  thumbnail: { position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' as const, opacity: 0.6, filter: 'blur(2px)' },
  thumbnailLabel: { background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 'bold', marginTop: 16 },

  button: { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '20px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },

  resultBox: { marginTop: '40px', background: '#0f172a', borderRadius: '16px', padding: '0', border: '1px solid #334155', overflow: 'hidden' },
  resultHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', background: '#1e293b', borderBottom: '1px solid #334155' },
  findingItem: { padding: '24px', borderBottom: '1px solid #334155' },
  findingTitle: { fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
  findingDesc: { fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.6 },

  actionRow: { display: 'flex', gap: '12px', marginTop: '16px' },
  techBtn: { background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  copyBtn: { background: '#3b82f6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },

  codeBlock: { background: '#1e1e1e', padding: '20px', borderRadius: '12px', marginTop: '16px', overflowX: 'auto' as const, border: '1px solid #333' },
  codePre: { fontFamily: 'monospace', fontSize: '13px', color: '#d4d4d4', margin: 0 }
};

// --- HELPER TO CONVERT FILE TO GEMINI PART ---
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
  technicalSolution: string;
  implementationPrompt: string;
  codeSnippet?: string;
};

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [mode, setMode] = useState<'standard' | 'competitor'>('competitor');
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);

  // URL Comparison Inputs
  const [psiUrl, setPsiUrl] = useState('');
  const [compUrl, setCompUrl] = useState('');

  // File Inputs & Previews
  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);

  const [file2, setFile2] = useState<File | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);

  // Results
  const [findings, setFindings] = useState<AuditFinding[]>([]);

  // Refs
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview1) URL.revokeObjectURL(preview1);
      if (preview2) URL.revokeObjectURL(preview2);
    };
  }, [preview1, preview2]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      if (slot === 1) { setFile1(f); setPreview1(url); }
      else { setFile2(f); setPreview2(url); }
    }
  };

  const handleAudit = async () => {
    // Check if we have files OR urls
    const hasFiles = file1 && file2;
    const hasUrls = psiUrl && compUrl;

    if (mode === 'competitor' && !hasFiles && !hasUrls) {
      alert("Please provide either two URLs OR two Screenshots to compare.");
      return;
    }

    setAnalyzing(true);
    setFindings([]);

    try {
      let prompt = "";
      const parts: any[] = [];

      if (mode === 'competitor') {
        if (hasUrls) {
          // URL-BASED DEEP SCAN
          prompt = `
                  Act as a Senior UX Strategist & Technical Lead.
                  Analyze these two URLs (or use your internal knowledge of these platforms):
                  1. PSI Target: ${psiUrl}
                  2. Competitor: ${compUrl} (e.g., Property Finder, Bayut, Dubizzle)

                  COMPARE AND CONTRAST specifically on:
                  1. Search Filter Depth (Ease of finding a home).
                  2. Mobile Responsiveness & Thumb-Zone Design.
                  3. Trust Signals (Certificates, Verified Badges).
                  4. Speed vs. Visual Quality.

                  For each gap where the Competitor wins:
                  1. 'title': The Issue.
                  2. 'description': Why the competitor is winning.
                  3. 'technicalSolution': "To beat [Competitor], change [Component] to..." (React/Tailwind specs).
                  4. 'implementationPrompt': A command: "Apply this update to [filename]..."

                  Return a strictly valid JSON array of objects.
                `;
        } else {
          // VISION-BASED SCAN
          prompt = `
                  Act as a Senior UX Strategist. 
                  COMPARE these two UI screenshots.
                  1. First Image: PSI (My Site)
                  2. Second Image: Competitor
                  
                  Analyze layout, CTA placement, and trust signals.
                  1. List what the competitor does better.
                  2. Provide the EXACT Tailwind/React code to implement that improvement on psinv.net.

                  Return a strictly valid JSON array of objects for the top 3 gaps.
                `;
          if (file1) parts.push(await fileToGenerativePart(file1));
          if (file2) parts.push(await fileToGenerativePart(file2));
        }
        parts.push(prompt);

      } else {
        // STANDARD SINGLE SCAN
        prompt = `
                Act as a Senior UX Strategist. 
                Analyze this design/audit screenshot.
                Identify critical UX friction points.
                If it's a PageSpeed score, read the numbers.

                Return a strictly valid JSON array of objects for top 3 issues.
            `;

        if (file1) parts.push(await fileToGenerativePart(file1));
        parts.push(prompt);
      }

      const result = await model.generateContent(parts);
      const text = result.response.text().replace(/```json|```/g, "").trim();

      try {
        const data = JSON.parse(text);
        setFindings(data);
      } catch (e) {
        console.error("JSON Parse Error", text);
        setFindings([{
          title: "Deep Analysis Output",
          description: text,
          technicalSolution: "See description",
          implementationPrompt: "Refactor this component based on the analysis."
        }]);
      }

    } catch (e: any) {
      alert(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateCode = async (finding: AuditFinding, index: number) => {
    setGeneratingCode(String(index));
    try {
      const prompt = `
            ${finding.implementationPrompt}
            
            Requirements:
            1. Create a complete, functional React functional component.
            2. Use Tailwind CSS for styling (Modern, Dark Mode compatible).
            3. Return ONLY the code.
          `;

      const result = await model.generateContent(prompt);
      const code = result.response.text().replace(/```tsx|```javascript|```/g, "").trim();

      const newFindings = [...findings];
      newFindings[index].codeSnippet = code;
      setFindings(newFindings);

    } catch (e: any) {
      alert("Code Gen Failed");
    } finally {
      setGeneratingCode(null);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert("Prompt Copied! Paste this to Anti-Gravity.");
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
            <div style={S.subtitle}>Implementation Engine v5.0</div>
            <h1 style={S.title}>{mode === 'competitor' ? 'Competitive Benchmarking' : 'Forensic Audit'}</h1>
          </div>
          {/* COMPARISON TOGGLE */}
          <div style={S.modeToggle}>
            <button
              onClick={() => setMode('standard')}
              style={{ ...S.modeBtn, ...(mode === 'standard' ? S.modeBtnActive : {}) }}
            >
              Standard Scan
            </button>
            <button
              onClick={() => setMode('competitor')}
              style={{ ...S.modeBtn, ...(mode === 'competitor' ? S.modeBtnActive : {}) }}
            >
              Competitor Mode
            </button>
          </div>
        </header>

        <div style={S.card}>
          {mode === 'competitor' ? (
            <div style={S.splitView}>
              {/* PSI */}
              <div>
                <div style={{ ...S.label, color: '#10b981' }}>PSI TARGET</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    value={psiUrl}
                    onChange={e => setPsiUrl(e.target.value)}
                    type="text"
                    style={S.input}
                    placeholder="https://www.psinv.net..."
                  />
                  <div style={S.label}>OR UPLOAD IMAGE</div>
                  <div style={S.dropZone} onClick={() => inputRef1.current?.click()}>
                    {preview1 && <img src={preview1} style={S.thumbnail} />}
                    <div style={S.dropZoneContent}>
                      <input type="file" ref={inputRef1} style={{ display: 'none' }} onChange={e => handleFileChange(e, 1)} />
                      {preview1 ? <CheckCircle2 size={40} color="#10b981" /> : <Globe size={40} color="#475569" />}
                      <div style={S.thumbnailLabel}>{file1?.name || "Drop PSI Screenshot"}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* COMPETITOR */}
              <div>
                <div style={{ ...S.label, color: '#f59e0b' }}>COMPETITOR TARGET</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    value={compUrl}
                    onChange={e => setCompUrl(e.target.value)}
                    type="text"
                    style={S.input}
                    placeholder="https://www.propertyfinder.ae..."
                  />
                  <div style={S.label}>OR UPLOAD IMAGE</div>
                  <div style={S.dropZone} onClick={() => inputRef2.current?.click()}>
                    {preview2 && <img src={preview2} style={S.thumbnail} />}
                    <div style={S.dropZoneContent}>
                      <input type="file" ref={inputRef2} style={{ display: 'none' }} onChange={e => handleFileChange(e, 2)} />
                      {preview2 ? <CheckCircle2 size={40} color="#10b981" /> : <Swords size={40} color="#475569" />}
                      <div style={S.thumbnailLabel}>{file2?.name || "Drop Competitor Screenshot"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 32 }}>
              <div style={S.label}>TARGET EVIDENCE (UI or Report)</div>
              <div style={S.dropZone} onClick={() => inputRef1.current?.click()}>
                {preview1 && <img src={preview1} style={S.thumbnail} />}
                <div style={S.dropZoneContent}>
                  <input type="file" ref={inputRef1} style={{ display: 'none' }} onChange={e => handleFileChange(e, 1)} />
                  {preview1 ? <CheckCircle2 size={40} color="#10b981" /> : <Camera size={40} color="#475569" />}
                  <div style={S.thumbnailLabel}>{file1?.name || "Drop Screenshot of UI or PageSpeed"}</div>
                </div>
              </div>
            </div>
          )}

          <button disabled={analyzing} onClick={handleAudit} style={{ ...S.button, opacity: analyzing ? 0.7 : 1 }}>
            {analyzing ? (
              'RUNNING DEEP INTELLIGENCE SCAN...'
            ) : (
              <>
                <Zap size={20} fill="white" />
                {mode === 'competitor' ? 'RUN DEEP INTELLIGENCE SCAN' : 'RUN FORENSIC SCAN'}
              </>
            )}
          </button>
        </div>

        {/* RESULTS */}
        {findings.length > 0 && (
          <div style={S.resultBox}>
            <div style={S.resultHeader}>
              <Eye size={20} />
              Competitive Strategy & Solutions
            </div>
            {findings.map((f, i) => (
              <div key={i} style={S.findingItem}>
                <div style={S.findingTitle}>
                  <AlertOctagon size={18} color="#f59e0b" />
                  {f.title}
                </div>
                <div style={S.findingDesc}>{f.description}</div>

                <div style={{ background: '#0f172a', padding: 16, borderRadius: 8, fontSize: 13, color: '#cbd5e1', marginBottom: 16 }}>
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: 4 }}>TECHNICAL WIN:</strong>
                  {f.technicalSolution}
                </div>

                <div style={S.actionRow}>
                  <button onClick={() => copyPrompt(f.implementationPrompt)} style={S.copyBtn}>
                    <Terminal size={14} /> Copy Copy Prompt
                  </button>
                  <button
                    onClick={() => generateCode(f, i)}
                    disabled={generatingCode === String(i)}
                    style={{ ...S.techBtn, opacity: generatingCode === String(i) ? 0.7 : 1 }}
                  >
                    <Code size={14} />
                    {generatingCode === String(i) ? 'Coding...' : 'Generate Component'}
                  </button>
                </div>

                {f.codeSnippet && (
                  <div style={S.codeBlock}>
                    <pre style={S.codePre}>{f.codeSnippet}</pre>
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
