import React, { useState, useEffect } from 'react';

export default function App() {
  const [status, setStatus] = useState('OFFLINE');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://improvident-tracklessly-kimberely.ngrok-free.dev/status')
        .then(res => res.json())
        .then(data => {
          setStatus(data.status);
          setCount(data.burst_count || 0);
        })
        .catch(() => setStatus('OFFLINE'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendRequest = (path: string) => {
    fetch(`https://improvident-tracklessly-kimberely.ngrok-free.dev/${path}`, { 
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' } 
    });
  };

  return (
    <div style={{ backgroundColor: '#05070a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'absolute', top: '20px', width: '90%', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span>SATELLITE UI V12.0.55</span>
        <span style={{ color: status === 'ONLINE' ? '#4ade80' : '#f87171' }}>● {status}</span>
      </div>
      <h1 style={{ fontSize: '5rem', marginBottom: '20px' }}>💖 {count}</h1>
      
      {/* メインボタン */}
      <button onClick={() => sendRequest('burst')} style={{ width: '260px', height: '260px', borderRadius: '50%', border: 'none', background: 'white', color: 'black', fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px' }}>
        ⚡ BURST
      </button>

      {/* 【復活】SINGLE PULSE ボタン */}
      <button onClick={() => sendRequest('pulse')} style={{ width: '80%', maxWidth: '300px', height: '50px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '5px', fontSize: '1rem', letterSpacing: '3px', cursor: 'pointer' }}>
        SINGLE PULSE
      </button>
    </div>
  );
}