import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Upload, Zap, FileText, CheckCircle2, Loader2, Link, Eye, AlertOctagon, Copy, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// GEMINI SETUP
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// HELPER: Convert File to Base64 for Gemini
const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const S = {
  container: {
    minHeight: '100vh',
    background: '#0f172a',
    color: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '800px', // Wider for report
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: 600,
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  fileDrop: {
    width: '100%',
    background: '#0f172a',
    border: '2px dashed #334155',
    borderRadius: '12px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  fileDropActive: {
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.05)',
  },
  button: {
    width: '100%',
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '18px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  secondaryBtn: {
    marginTop: '20px',
    background: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '30px auto 0',
  },
  // REPORT STYLES
  scoreCard: {
    background: '#0f172a',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #334155',
    marginBottom: '32px',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#10b981',
  },
  findingItem: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  findingTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  findingDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  codeBlock: {
    background: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '16px',
    overflowX: 'auto' as const,
    border: '1px solid #334155',
  },
  codePre: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#e2e8f0',
    margin: 0,
  },
};

type AuditResult = {
  score: string;
  improvements: Array<{ title: string; description: string }>;
  codeTitle: string;
  code: string;
};

const App = () => {
  const [url, setUrl] = useState('psinv.net');
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<AuditResult | null>(null);
  const [view, setView] = useState<'input' | 'report'>('input');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!url && !file) {
      alert("Please provide at least a URL or a Screenshot file.");
      return;
    }

    setScanning(true);
    setReport(null);

    const prompt = `
      You are a specialized UX Auditor for Real Estate APIs.
      Analyze the provided URL (${url}) and/or the attached screenshot.
      
      Output a strict JSON object with:
      1. "score": A performance score from 0-100 (string).
      2. "improvements": An array of 3 critical UX fixes {title, description}.
      3. "codeTitle": Title for a React component fix.
      4. "code": The React/Tailwind code for that component.
      
      Do NOT write markdown. Just pure JSON.
    `;

    try {
      let parts: any[] = [prompt];
      if (file) {
        const imagePart = await fileToGenerativePart(file);
        parts.push(imagePart);
      }

      const response = await model.generateContent(parts);
      const text = response.response.text().replace(/```json|```/g, "").trim();

      try {
        const data = JSON.parse(text);
        setReport(data);
        setView('report');
      } catch (e) {
        console.error("JSON Parsing Failed", text);
        alert("AI generated invalid JSON. Please try again.");
      }

    } catch (err) {
      console.error("Gemini Error", err);
      alert("Analysis failed. Check console.");
    } finally {
      setScanning(false);
    }
  };

  const copyCode = () => {
    if (report?.code) {
      navigator.clipboard.writeText(report.code);
      alert("Code Copied!");
    }
  };

  const reset = () => {
    setReport(null);
    setView('input');
    setFile(null);
  };

  return (
    <div style={S.container}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.subtitle}>PSI UX Auditor</div>
          <h1 style={S.title}>
            {view === 'input' ? 'Step 1: Input Data' : 'Step 2: Analysis Report'}
          </h1>
        </div>

        {view === 'input' ? (
          <>
            <div style={S.inputGroup}>
              <label style={S.label}><Link size={16} /> LIGHTHOUSE REPORT URL</label>
              <input
                type="text"
                style={S.input}
                placeholder="https://pagespeed.web.dev/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div style={S.inputGroup}>
              <label style={S.label}><Upload size={16} /> LIGHTHOUSE SCREENSHOTS</label>
              <div
                style={{ ...S.fileDrop, ...(file ? S.fileDropActive : {}) }}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                {file ? (
                  <>
                    <FileText size={32} color="#10b981" style={{ marginBottom: 12 }} />
                    <span style={{ color: '#f8fafc', fontWeight: 500 }}>{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="#64748b" style={{ marginBottom: 12 }} />
                    <span style={{ color: '#94a3b8' }}>Click to upload screenshots</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={scanning}
              style={{ ...S.button, opacity: scanning ? 0.7 : 1, cursor: scanning ? 'not-allowed' : 'pointer' }}
            >
              {scanning ? (
                <><Loader2 className="animate-spin" size={20} /> ANALYZING...</>
              ) : (
                <><Zap size={20} fill="white" /> PROCESS REPORT</>
              )}
            </button>
          </>
        ) : (
          /* REPORT VIEW */
          report && (
            <div>
              <div style={S.scoreCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Eye size={24} color="#10b981" />
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>UX PERFORMANCE SCORE</span>
                </div>
                <div style={S.scoreValue}>{report.score}/100</div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={S.label}>CRITICAL IMPROVEMENTS</div>
                {report.improvements.map((imp, i) => (
                  <div key={i} style={S.findingItem}>
                    <div style={S.findingTitle}>
                      <AlertOctagon size={16} color="#f59e0b" />
                      {imp.title}
                    </div>
                    <div style={S.findingDesc}>{imp.description}</div>
                  </div>
                ))}
              </div>

              {report.code && (
                <div>
                  <div style={{ ...S.label, justifyContent: 'space-between' }}>
                    <span>RECOMMENDED FIX: {report.codeTitle}</span>
                    <button
                      onClick={copyCode}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}
                    >
                      <Copy size={14} /> COPY
                    </button>
                  </div>
                  <div style={S.codeBlock}>
                    <pre style={S.codePre}>{report.code}</pre>
                  </div>
                </div>
              )}

              <button onClick={reset} style={S.secondaryBtn}>
                <RefreshCw size={16} /> START NEW AUDIT
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
