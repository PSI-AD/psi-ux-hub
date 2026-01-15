import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, Phone, Briefcase, Building2, Key, Percent, Users, FileText, CheckCircle2, AlertOctagon, Upload, Play, X, Swords, ArrowRight, Code, Copy, Eye, Zap, Camera, Terminal, Globe, Search, AlertTriangle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// GEMINI SETUP
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// STYLES - "No-Fail" Clean UI
const S = {
  container: { display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#0f172a', color: '#f1f5f9' },
  sidebar: { width: '280px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' as const },
  brand: { padding: '24px', borderBottom: '1px solid #334155', fontSize: '18px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { flex: 1, padding: '16px', overflowY: 'auto' as const },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const },
  header: { marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #334155' },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' },
  subtitle: { fontSize: '14px', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px' },

  card: { background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', width: '100%', maxWidth: '800px', margin: '0 auto', marginBottom: '32px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', fontSize: '16px', color: 'white', marginBottom: '16px', fontFamily: 'inherit' },

  button: { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '20px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },

  resultBox: { marginTop: '40px', background: '#0f172a', borderRadius: '16px', padding: '0', border: '1px solid #334155', overflow: 'hidden', maxWidth: '800px', margin: '40px auto' },
  resultHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', background: '#1e293b', borderBottom: '1px solid #334155' },
  findingItem: { padding: '24px', borderBottom: '1px solid #334155' },
  findingTitle: { fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
  findingDesc: { fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.6 },

  codeBlock: { background: '#1e1e1e', padding: '20px', borderRadius: '12px', marginTop: '16px', overflowX: 'auto' as const, border: '1px solid #333' },
  codePre: { fontFamily: 'monospace', fontSize: '13px', color: '#d4d4d4', margin: 0 },

  copyBtn: { background: '#3b82f6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
};

// TYPES
type AuditResult = {
  score: string;
  improvements: Array<{
    title: string;
    description: string;
  }>;
  codeTitle: string;
  code: string;
};

const App = () => {
  const [url, setUrl] = useState('psinv.net');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    setAnalyzing(true);
    setResult(null);

    const prompt = `
      As a Senior UX Auditor, analyze the URL: ${url}. 
      Based on your internal knowledge of this site and real estate best practices (do not attempt to fetch the live URL if blocked):
      
      1. Give a Performance Score (0-100).
      2. List 5 Specific UX improvements to beat competitors like Bayut.
      3. Write the Tailwind CSS code for a better 'Lead Generation' form component.

      Return the response in this strictly valid JSON format:
      {
        "score": "85",
        "improvements": [
           { "title": "...", "description": "..." },
           { "title": "...", "description": "..." },
           { "title": "...", "description": "..." },
           { "title": "...", "description": "..." },
           { "title": "...", "description": "..." }
        ],
        "codeTitle": "Optimized Lead Gen Form",
        "code": "..."
      }
      Do not include markdown structure like \`\`\`json. Just the raw JSON.
    `;

    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text().replace(/```json|```/g, "").trim();
      const data = JSON.parse(text);
      setResult(data);
    } catch (e: any) {
      // Fallback for demo if generic error
      console.error("Audit Error", e);
      setResult({
        score: "N/A",
        improvements: [{ title: "Audit Error", description: "Could not generate analysis. Please try again." }],
        codeTitle: "",
        code: ""
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const copyCode = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      alert("Code Copied!");
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
          <div style={S.sectionTitle}>Pages</div>
          {['Home Page', 'Luxury Projects', 'Off-Plan', 'Management', 'Sales Services', 'Mortgage', 'Careers'].map(name => (
            <div key={name} style={S.navItem}><FileText size={18} />{name}</div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        <header style={S.header}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={S.subtitle}>Guaranteed Delivery Engine</div>
            <h1 style={S.title}>Zero-Fail UX Audit</h1>
          </div>
        </header>

        <div style={S.card}>
          <div style={S.label}>TARGET URL</div>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            type="text"
            style={S.input}
            placeholder="psinv.net"
          />

          <button disabled={analyzing} onClick={handleAudit} style={{ ...S.button, opacity: analyzing ? 0.7 : 1 }}>
            {analyzing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Loader2 className="animate-spin" size={20} />
                AI IS ANALYZING {url.toUpperCase()} ARCHITECTURE...
              </div>
            ) : (
              <>
                <Zap size={20} fill="white" />
                RUN GUARANTEED AUDIT
              </>
            )}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div style={S.resultBox}>
            <div style={S.resultHeader}>
              <Eye size={20} />
              Audit Results
              <span style={{ marginLeft: 'auto', background: '#10b981', color: '#064e3b', fontSize: 13, padding: '4px 12px', borderRadius: 20 }}>
                SCORE: {result.score}/100
              </span>
            </div>

            {result.improvements.map((imp, i) => (
              <div key={i} style={S.findingItem}>
                <div style={S.findingTitle}>
                  <AlertOctagon size={18} color="#f59e0b" />
                  {imp.title}
                </div>
                <div style={S.findingDesc}>{imp.description}</div>
              </div>
            ))}

            {result.code && (
              <div style={{ padding: '24px', background: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>{result.codeTitle || "Recommended Component"}</div>
                  <button onClick={copyCode} style={S.copyBtn}><Copy size={13} /> Copy Code</button>
                </div>
                <div style={S.codeBlock}>
                  <pre style={S.codePre}>{result.code}</pre>
                </div>
              </div>
            )}
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
