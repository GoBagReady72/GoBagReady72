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
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Scene 3 — Progress Baseline Lock</h2>
      <div className="wf-card">
        <ProgressBarRow rows={rows} />
      </div>
      <div className="flex justify-between">
        <Link className="underline" to="/scene2">← Back</Link>
        <Link className="underline" to="/scene4">Next →</Link>
      </div>
    </section>
  )
}
