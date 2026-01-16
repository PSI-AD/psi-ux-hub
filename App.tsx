import React, { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState("Ready for Step 1");

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>PSI UX Auditor</h1>
        <p style={{ color: '#888' }}>Step 1: Lighthouse Data Collection</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Lighthouse Report URL</label>
          <input type="text" placeholder="Paste URL here..." style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: 'white' }} />
        </div>

        <div style={{ marginBottom: '30px', border: '2px dashed #444', padding: '40px', textAlign: 'center' }}>
          <p>Drag & Drop Lighthouse Screenshots</p>
          <input type="file" accept="image/*" />
        </div>

        <button
          onClick={() => setStatus("Data Received. Ready for Step 2 Analysis.")}
          style={{ width: '100%', padding: '15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          PROCESS REPORT
        </button>

        {status !== "Ready for Step 1" && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#28a745', borderRadius: '4px' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
