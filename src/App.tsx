// src/App.tsx
import React from 'react';
import KOEPanel from './components/KOEPanel';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>GoBag: Ready72 — KOE Sandbox</h1>
        <p style={{ margin: '6px 0 0 0', opacity: 0.8 }}>
          Coastal region prototype with 3 Kick-Off Events (Early Evac, Shelter-in-Place, Late Evac).
        </p>
      </header>

      <KOEPanel />

      <footer style={{ marginTop: 24, fontSize: 12, opacity: 0.7 }}>
        MSS categories enforced; outcomes are deterministic per seed.
      </footer>
    </div>
  );
}
