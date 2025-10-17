import { Link } from 'react-router-dom'
import Carousel from '@/components/Carousel'

export default function Scene2() {
  const items = Array.from({length:7}).map((_,i)=>({id:String(i), label:`Card ${i+1}`}))
  return (
    <section className="wf-container space-y-4">
      <h2 className="wf-h2">Scene 2 — Multi-card Carousel</h2>
      <div className="wf-card">
        <Carousel items={items} visibleCount={3} />
      </div>
      <div className="flex justify-between">
        <Link className="underline" to="/scene1">← Back</Link>
        <Link className="underline" to="/scene3">Next →</Link>
      </div>
    </section>
  )
}
