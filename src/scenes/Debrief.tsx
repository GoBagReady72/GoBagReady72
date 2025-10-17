import { Link } from 'react-router-dom'

export default function Debrief() {
  return (
    <section>
      <h2>Debrief — Wireframe Acceptance</h2>
      <p>Confirm behavior-only criteria. Visual polish will be addressed later.</p>
      <div style={{ marginTop: 16 }}>
        <Link to="/scene1">Restart</Link>
      </div>
    </section>
  )
}
