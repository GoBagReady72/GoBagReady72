import { Link, Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: '16px' }}>
      <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <Link to="/scene1">Scene 1</Link>
        <Link to="/scene2">Scene 2</Link>
        <Link to="/scene3">Scene 3</Link>
        <Link to="/scene4">Scene 4</Link>
        <Link to="/scene5">Scene 5</Link>
        <Link to="/debrief">Debrief</Link>
      </nav>
      <Suspense fallback={<div />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
