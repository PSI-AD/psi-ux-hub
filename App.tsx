export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px' }}>
        <h2>PSI Pages</h2>
        <ul><li>Home</li><li>Luxury Projects</li><li>Contact Us</li></ul>
      </div>
      <div style={{ flex: 1, padding: '40px' }}>
        <h1>PSI Optimization Hub</h1>
        <p>Paste PageSpeed URL below:</p>
        <input type="text" style={{ width: '100%', padding: '10px', marginBottom: '20px' }} />
        <button style={{ padding: '10px 20px', background: 'green', color: 'white' }}>Run Audit</button>
      </div>
    </div>
  );
}
