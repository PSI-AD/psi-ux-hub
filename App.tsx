import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Upload, Zap, FileText, CheckCircle2, Loader2, Link } from 'lucide-react';

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
    padding: '20px',
  },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
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
    display: 'block',
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
  msgBox: {
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #10b981',
    borderRadius: '12px',
    color: '#10b981',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }
};

const App = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    if (!url && !file) {
      alert("Please provide at least a URL or a Screenshot file.");
      return;
    }

    setScanning(true);
    setStatusMsg("Scanning...");

    // Simulate processing delay
    setTimeout(() => {
      setScanning(false);
      setStatusMsg("Data Received. Ready for Step 2 Analysis.");
    }, 2000);
  };

  return (
    <div style={S.container}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.subtitle}>PSI UX Auditor</div>
          <h1 style={S.title}>Step 1: Input Data</h1>
        </div>

        {/* INPUT ZONE 1: URL */}
        <div style={S.inputGroup}>
          <label style={S.label}>
            <Link size={16} /> LIGHTHOUSE REPORT URL
          </label>
          <input
            type="text"
            style={S.input}
            placeholder="https://pagespeed.web.dev/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* INPUT ZONE 2: FILE UPLOAD */}
        <div style={S.inputGroup}>
          <label style={S.label}>
            <Upload size={16} /> LIGHTHOUSE SCREENSHOTS
          </label>
          <div
            style={{
              ...S.fileDrop,
              ...(file ? S.fileDropActive : {})
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />

            {file ? (
              <>
                <FileText size={32} color="#10b981" style={{ marginBottom: 12 }} />
                <span style={{ color: '#f8fafc', fontWeight: 500 }}>{file.name}</span>
                <span style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB • Ready to upload
                </span>
              </>
            ) : (
              <>
                <Upload size={32} color="#64748b" style={{ marginBottom: 12 }} />
                <span style={{ color: '#94a3b8' }}>Click to upload screenshots</span>
                <span style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Supports JPG, PNG, PDF
                </span>
              </>
            )}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleProcess}
          disabled={scanning}
          style={{
            ...S.button,
            opacity: scanning ? 0.7 : 1,
            cursor: scanning ? 'not-allowed' : 'pointer'
          }}
        >
          {scanning ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              PROCESSING...
            </>
          ) : (
            <>
              <Zap size={20} fill="white" />
              PROCESS REPORT
            </>
          )}
        </button>

        {/* STATUS MESSAGE */}
        {statusMsg && !scanning && (
          <div style={S.msgBox}>
            <CheckCircle2 size={20} />
            {statusMsg}
          </div>
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
