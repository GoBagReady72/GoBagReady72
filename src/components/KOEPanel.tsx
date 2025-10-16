import { useKOE } from '../koe/useKOE';

export default function KOEPanel() {
  const { run, state, region } = useKOE();

  return (
    <div style={{ padding: 16 }}>
      <h2>KOE Simulator — {region.name}</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => run('early-evac')}>Run Early Evac</button>
        <button onClick={() => run('shelter-in-place')}>Run Shelter-in-Place</button>
        <button onClick={() => run('late-evac')}>Run Late Evac</button>
      </div>
      {state && (
        <div>
          <p><strong>Outcome:</strong> {state.outcome}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background:'#111', color:'#eee', padding:12, borderRadius:8 }}>
{state.log.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}
