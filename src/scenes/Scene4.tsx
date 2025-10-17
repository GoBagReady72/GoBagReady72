import { Link } from 'react-router-dom'

export default function Scene4() {
  return (
    <section>
      <h2>Scene 4 — Transition Harness</h2>
      <p>Use this scene to validate decision transitions / state carry-over later.</p>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/scene3">← Back</Link>
        <Link to="/scene5">Next →</Link>
      </div>
    </section>
  )
}
