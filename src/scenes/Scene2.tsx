import { Link } from 'react-router-dom'
import Carousel from '@/components/Carousel'

export default function Scene2() {
  const items = Array.from({length:7}).map((_,i)=>({id:String(i), label:`Card ${i+1}`}))
  return (
    <section>
      <h2>Scene 2 — Multi-card Carousel</h2>
      <Carousel items={items} visibleCount={3} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/scene1">← Back</Link>
        <Link to="/scene3">Next →</Link>
      </div>
    </section>
  )
}
