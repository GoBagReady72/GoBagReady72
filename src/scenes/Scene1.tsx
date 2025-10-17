import Carousel from '@/components/Carousel'
import ProgressBarRow from '@/components/ProgressBarRow'
import { Link } from 'react-router-dom'

const MSS = ['WATER','FOOD','CLOTHING','SHELTER','COMMS & NAV','HEALTH','SUSTAINABILITY','SPECIAL CONSIDERATIONS']

export default function Scene1() {
  const items = MSS.map((m,i)=>({ id:String(i), label:`${m} — item ${i+1}` }))
  const rows = MSS.slice(0,4).map((m,i)=>({ id:String(i), label:m, percent:[25,50,75,40][i%4] }))

  return (
    <section>
      <h2>Scene 1 — Wireframe Behavior</h2>
      <p>Carousel shows arrows only when more than 3 items; keyboard and swipe enabled.</p>
      <Carousel items={items} visibleCount={3} />
      <div style={{ height: 16 }} />
      <p>Uniform baseline progress row:</p>
      <ProgressBarRow rows={rows} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Link to="/scene2">Next →</Link>
      </div>
    </section>
  )
}
