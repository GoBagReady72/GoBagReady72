type Row = { id: string; label: string; percent: number }

export default function ProgressBarRow({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${rows.length}, 1fr)` }}>
      {rows.map(r => (
        <div key={r.id} className="grid grid-rows-[auto_auto_1fr] items-end">
          <div className="text-center text-sm font-semibold">{r.label}</div>
          <div className="text-center text-sm text-neutral-500">{r.percent}%</div>
          <div className="h-3.5 border rounded-full overflow-hidden self-end">
            <div className="h-full" style={{ width: `${r.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
