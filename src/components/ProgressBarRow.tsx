type Row = { id: string; label: string; percent: number }

export default function ProgressBarRow({ rows }: { rows: Row[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${rows.length}, 1fr)`, gap: 12 }}>
      {rows.map(r => (
        <div key={r.id} style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', alignItems: 'end' }}>
          <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{r.label}</div>
          <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>{r.percent}%</div>
          <div style={{ height: 14, border: '1px solid #ddd', borderRadius: 7, overflow: 'hidden', alignSelf: 'end' }}>
            <div style={{ width: `${r.percent}%`, height: '100%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
