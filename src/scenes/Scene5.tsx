import { Link } from 'react-router-dom'

export default function Scene5() {
  return (
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Scene 5 — Pre-Debrief Check</h2>
      <div className="wf-card">
        <ul className="list-disc pl-6">
          <li>All carousels keyboard/swipe work</li>
          <li>Arrows render only when &gt; 3 items</li>
          <li>Progress rows baseline aligned</li>
        </ul>
      </div>
      <div className="flex justify-between">
        <Link className="underline" to="/scene4">← Back</Link>
        <Link className="underline" to="/debrief">Next →</Link>
      </div>
    </section>
  )
}
