// src/components/KOEPanel.tsx
import { useState } from 'react';
import { useKOE } from '../koe/useKOE';

export default function KOEPanel() {
  const { run, state, region } = useKOE();
  const [seed, setSeed] = useState<number>(42);

  function runKOE(id: 'early-evac' | 'shelter-in-place' | 'late-evac') {
    try {
      run(id, seed);
    } catch (e) {
      console.error(e);
      alert('KOE run failed. Check console for details.');
    }
  }

  return (
    <div style={{ padding: 16, border: '1px solid #222', borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>KOE Simulator — {region.name}</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 14 }}>
          Seed:&nbsp;
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value || 0))}
            style={{ width: 100, padding: '4px 6px' }}
          />
        </label>
        <button onClick={() => runKOE('early-evac')}>Run Early Evac</button>
        <button onClick={() => runKOE('shelter-in-place')}>Run Shelter-in-Place</button>
        <button onClick={() => runKOE('late-evac')}>Run Late Evac</button>
      </div>

      {/* HUD */}
      {state && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 8,
            marginBottom: 12,
            fontSize: 13,
          }}
        >
          <Stat label="Outcome" value={state.outcome?.toUpperCase() || '—'} />
          <Stat label="Hydration" value={String(state.hydration)} />
          <Stat label="Calories" value={String(state.calories)} />
          <Stat label="Morale" value={String(state.morale)} />
          <Stat label="Road" value={String(state.roadAccess)} />
          <Stat label="Cell" value={String(state.cellService)} />
        </div>
      )}

      {/* Log */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Event Log</div>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#0f0f0f',
            color: '#eaeaea',
            padding: 12,
            borderRadius: 8,
            minHeight: 160,
            border: '1px solid #333',
            margin: 0,
          }}
        >
{state?.log?.length ? state.log.join('\n') : 'Click a Run button to simulate a Kick-Off Event.'}
        </pre>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 8, border: '1px solid #333', borderRadius: 6 }}>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
