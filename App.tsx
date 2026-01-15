import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Home, Phone, Briefcase, Building2, Key, Percent, Users, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

// STYLES (Inline for Robustness)
const S = {
  container: { display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#0f172a', color: '#f1f5f9' },
  sidebar: { width: '280px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' as const },
  brand: { padding: '24px', borderBottom: '1px solid #334155', fontSize: '18px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { flex: 1, padding: '16px', overflowY: 'auto' as const },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' },
  navItemActive: { background: '#0f172a', color: '#10b981' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const },
  header: { marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #334155' },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' },
  subtitle: { fontSize: '14px', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px' },
  card: { background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', maxWidth: '900px', margin: '0 auto', width: '100%' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '12px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', fontSize: '16px', color: 'white', marginBottom: '32px', fontFamily: 'inherit' },
  dropZone: { width: '100%', background: '#0f172a', border: '2px dashed #334155', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', marginBottom: '32px', cursor: 'pointer', transition: 'all 0.2s' },
  button: { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '20px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s' }
};

const PAGES = [
  { id: 'home', name: 'Home Page', icon: Home },
  { id: 'luxury', name: 'Luxury Projects', icon: Building2 },
  { id: 'off-plan', name: 'Off-Plan Projects', icon: Briefcase },
  { id: 'management', name: 'Property Management', icon: Key },
  { id: 'sales', name: 'Sales Services', icon: Percent },
  { id: 'mortgage', name: 'Mortgage Solutions', icon: Percent },
  { id: 'careers', name: 'Careers', icon: Users },
  { id: 'about', name: 'About Us', icon: Users },
  { id: 'contact', name: 'Contact Us', icon: Phone },
  { id: 'listing', name: 'Listing Details', icon: FileText },
];

const App = () => {
  const [active, setActive] = useState('home');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      alert("Deep Audit functionality disabled in this rebuild.");
      setAnalyzing(false);
    }, 1500);
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
          <div style={S.label}>Navigation</div>
          {PAGES.map(p => {
            const Icon = p.icon;
            const isActive = active === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setActive(p.id)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = isActive ? '#0f172a' : 'transparent'}
                style={{ ...S.navItem, ...(isActive ? S.navItemActive : {}) }}
              >
                <Icon size={18} />
                {p.name}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={S.main}>
        <header style={S.header}>
          <div style={S.subtitle}>Audit Console v3.0</div>
          <h1 style={S.title}>PSI Optimization Hub</h1>
        </header>

        <div style={S.card}>
          <h2 style={{ ...S.title, fontSize: '24px', marginBottom: '8px' }}>Start Forensic Audit</h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Enter target parameters to begin analysis.</p>

          <label style={S.label}>Target Resource URL</label>
          <input type="text" style={S.input} placeholder="https://pagespeed.web.dev/..." />

          <label style={S.label}>Evidence Artifacts</label>
          <div style={S.dropZone} onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'} onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}>
            <FileText size={48} color="#475569" style={{ marginBottom: 16 }} />
            <div style={{ color: '#94a3b8', fontWeight: 500 }}>Drag & Drop Report or Screenshot</div>
          </div>

          <button
            onClick={handleAudit}
            style={S.button}
            onMouseEnter={e => !analyzing && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {analyzing ? 'INITIALIZING AI ENGINE...' : 'RUN PROFESSIONAL UX AUDIT'}
          </button>
        </div>
      </main>
    </div>
  );
};

// MOUNT
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
