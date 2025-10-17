import { Link } from 'react-router-dom'

export default function Scene5() {
  return (
    <section>
      <h2>Scene 5 — Pre-Debrief Check</h2>
      <ul style={{ marginLeft: 18 }}>
        <li>All carousels keyboard/swipe work</li>
        <li>Arrows render only when &gt; 3 items</li>
        <li>Progress rows baseline aligned</li>
      </ul>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/scene4">← Back</Link>
        <Link to="/debrief">Next →</Link>
      </div>
    </section>
  )
}
