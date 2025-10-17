import { Link } from 'react-router-dom'
import ProgressBarRow from '@/components/ProgressBarRow'

export default function Scene3() {
  const rows = [
    { id:'w', label:'WATER', percent:66 },
    { id:'f', label:'FOOD', percent:42 },
    { id:'h', label:'HEALTH', percent:10 },
    { id:'s', label:'SHELTER', percent:90 },
  ]
  return (
    <section>
      <h2>Scene 3 — Progress Baseline Lock</h2>
      <ProgressBarRow rows={rows} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/scene2">← Back</Link>
        <Link to="/scene4">Next →</Link>
      </div>
    </section>
  )
}
