import Carousel from '@/components/Carousel'
import ProgressBarRow from '@/components/ProgressBarRow'
import { Link } from 'react-router-dom'

const MSS = ['WATER','FOOD','CLOTHING','SHELTER','COMMS & NAV','HEALTH','SUSTAINABILITY','SPECIAL CONSIDERATIONS']

export default function Scene1() {
  const items = MSS.map((m,i)=>({ id:String(i), label:`${m} — item ${i+1}` }))
  const rows = MSS.slice(0,4).map((m,i)=>({ id:String(i), label:m, percent:[25,50,75,40][i%4] }))

  return (
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Scene 1 — Wireframe Behavior</h2>
      <div className="wf-card">
        <div className="wf-muted mb-2">Carousel (arrows only when more than 3 items; keyboard + swipe)</div>
        <Carousel items={items} visibleCount={3} />
      </div>
      <div className="wf-card">
        <div className="wf-muted mb-2">Uniform baseline progress rows</div>
        <ProgressBarRow rows={rows} />
      </div>
      <div className="flex justify-end gap-3">
        <Link className="underline" to="/scene2">Next →</Link>
      </div>
    </section>
  )
}
