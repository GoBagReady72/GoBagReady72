import { Link } from 'react-router-dom'

export default function Scene4() {
  return (
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Scene 4 — Transition Harness</h2>
      <div className="wf-card">
        <p className="wf-muted">Placeholder for decision transitions / state carry-over.</p>
      </div>
      <div className="flex justify-between">
        <Link className="underline" to="/scene3">← Back</Link>
        <Link className="underline" to="/scene5">Next →</Link>
      </div>
    </section>
  )
}
