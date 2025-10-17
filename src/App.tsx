import { Link, Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export default function App() {
  return (
    <div className="wf-container py-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Link className="underline" to="/scene1">Scene 1</Link>
        <Link className="underline" to="/scene2">Scene 2</Link>
        <Link className="underline" to="/scene3">Scene 3</Link>
        <Link className="underline" to="/scene4">Scene 4</Link>
        <Link className="underline" to="/scene5">Scene 5</Link>
        <Link className="underline" to="/debrief">Debrief</Link>
      </div>
      <Suspense fallback={<div className="wf-muted">Loading…</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
