import { Link } from 'react-router-dom'

export default function Debrief() {
  return (
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Debrief — Wireframe Acceptance</h2>
      <div className="wf-card">
        <p className="wf-muted">Confirm behavior-only criteria. Visual polish will be addressed later.</p>
      </div>
      <div>
        <Link className="underline" to="/scene1">Restart</Link>
      </div>
    </section>
  )
}
