"use client"; // Vercel/Next.jsでスイッチ類を動かすために必須の宣言

import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Constants & Types ---
const MOCK_NAMES = [
  'NEON_DRAGON', 'VOID_RUNNER', 'CYBER_KITSUNE', 'SOUL_BREAKER', 
  'ZERO_PHANTOM', 'GHOST_IN_SHELL', 'STAR_CHILD', 'ECHO_ALPHA'
];

export default function App() {
  const [identity, setIdentity] = useState('TORUS_OPERATOR');
  const [logs, setLogs] = useState<any[]>([]);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [isOnline, setIsOnline] = useState(false); 
  const [isDirectStable, setIsDirectStable] = useState(false);
  const [displayStats, setDisplayStats] = useState({ torusCash: 0, userCash: 0 });

  const statsRef = useRef({ torusCash: 0, userCash: 0 });
  const pollingTimerRef = useRef<any>(null);
  const burstTimerRef = useRef<any>(null);

  // 通信定義（ngrokなし、Genesis Core直結）
  const baseUrl = 'https://torus-genesis-core.vercel.app'; 
  const roomId = 'TORUS-SYNC-01';

  const addLog = useCallback((type: string, name: string) => {
    const newLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      name,
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // --- 🛰️ 通信コアロジック ---
  const performHttpSync = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/egress?roomId=${roomId}&operator=${identity}&t=${Date.now()}`);
      setIsOnline(response.ok);
    } catch (e) {
      setIsOnline(false);
    }
  }, [identity]);

  const dispatchToCore = useCallback(async (targetName: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/ingress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INGRESS',
          roomId,
          payload: { name: targetName, id: `TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}` },
          sender: 'TORUS_MOBILE_NODE',
          timestamp: Date.now()
        }),
      });
      if (response.ok) {
        setIsDirectStable(true);
        setIsOnline(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // --- 🕹️ ハンドラー ---
  const handleSinglePulse = () => {
    dispatchToCore(identity);
    addLog('OUTBOUND', `TX:PULSE_SENT`);
    if ("vibrate" in navigator) navigator.vibrate(20);
  };

  useEffect(() => {
    addLog('SYSTEM', 'DIRECT_PROTOCOL_READY:V12.0.55');
    pollingTimerRef.current = setInterval(performHttpSync, 3000);
    return () => clearInterval(pollingTimerRef.current);
  }, [performHttpSync, addLog]);

  // --- 💎 UI描画（指示通りカウンターとスイッチを維持） ---
  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* ヘッダー・ステータス */}
      <div style={{ border: '1px solid #1e293b', padding: '15px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>SATELLITE UI</div>
          <div style={{ fontWeight: 'bold' }}>TORUS BURST V12.0.55</div>
        </div>
        <div style={{ color: isOnline ? '#10b981' : '#ef4444', fontSize: '10px', fontWeight: 'bold' }}>
          ● {isDirectStable ? 'STABLE (DIRECT)' : isOnline ? 'STABLE (HTTP)' : 'OFFLINE'}
        </div>
      </div>

      {/* カウンターセクション */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#3b82f6' }}>OPERATOR ❤️</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{displayStats.torusCash}</div>
        </div>
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#10b981' }}>DUMMY USERS ❤️</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{displayStats.userCash}</div>
        </div>
      </div>

      {/* スイッチ（ボタン）類 */}
      <button onClick={() => setIsBurstActive(!isBurstActive)} style={{ width: '100%', padding: '30px', borderRadius: '20px', backgroundColor: isBurstActive ? '#1e293b' : 'white', color: isBurstActive ? '#64748b' : 'black', fontWeight: 'black', fontSize: '20px', marginBottom: '10px', border: 'none', cursor: 'pointer' }}>
        {isBurstActive ? '🔄 BURSTING...' : '⚡ BURST'}
      </button>

      <button onClick={handleSinglePulse} style={{ width: '100%', padding: '20px', borderRadius: '15px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', marginBottom: '10px' }}>
        💠 S I N G L E &nbsp; P U L S E
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => setIsBurstActive(false)} style={{ padding: '15px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>STOP BURST</button>
        <button onClick={() => setLogs([])} style={{ padding: '15px', borderRadius: '10px', background: '#020617', border: '1px solid #1e293b', color: '#64748b', fontWeight: 'bold', fontSize: '10px' }}>RESET ALL</button>
      </div>

      {/* テレメトリフィード */}
      <div style={{ marginTop: '20px', background: 'black', border: '1px solid #1e293b', borderRadius: '15px', height: '200px', overflowY: 'auto', padding: '10px', fontSize: '9px' }}>
        <div style={{ color: '#475569', marginBottom: '5px' }}>TELEMETRY FEED</div>
        {logs.map(log => (
          <div key={log.id} style={{ color: log.type === 'SYSTEM' ? '#3b82f6' : '#10b981', marginBottom: '2px' }}>
            {new Date(log.timestamp).toLocaleTimeString()}: {log.name}
          </div>
        ))}
      </div>
    </div>
  );
}