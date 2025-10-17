import { useEffect, useMemo, useRef, useState } from 'react'

type Item = { id: string; label: string }
type Props = { items: Item[]; visibleCount?: number; onChangeIndex?: (startIndex: number) => void }

export default function Carousel({ items, visibleCount = 3, onChangeIndex }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(0)

  const showArrows = items.length > visibleCount
  const end = useMemo(() => Math.min(start + visibleCount, items.length), [start, items.length, visibleCount])

  useEffect(() => onChangeIndex?.(start), [start, onChangeIndex])

  const prev = () => setStart(s => Math.max(0, s - visibleCount))
  const next = () => setStart(s => Math.min(Math.max(0, items.length - visibleCount), s + visibleCount))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length, visibleCount])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let x0 = 0
    const down = (e: TouchEvent) => (x0 = e.touches[0].clientX)
    const move = (e: TouchEvent) => {
      if (!x0) return
      const dx = e.touches[0].clientX - x0
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev()
        x0 = 0
      }
    }
    el.addEventListener('touchstart', down, { passive: true })
    el.addEventListener('touchmove', move, { passive: true })
    return () => {
      el.removeEventListener('touchstart', down)
      el.removeEventListener('touchmove', move)
    }
  }, [next, prev])

  const slice = items.slice(start, end)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showArrows ? '40px 1fr 40px' : '1fr', gap: 8, alignItems: 'center' }}>
      {showArrows && <button onClick={prev} aria-label="Previous" disabled={start === 0}>&lt;</button>}
      <div ref={trackRef} style={{ display: 'grid', gridTemplateColumns: `repeat(${slice.length}, minmax(0,1fr))`, gap: 8 }}>
        {slice.map(it => (
          <div key={it.id} style={{ border: '1px solid #ddd', padding: 8, minHeight: 72 }}>{it.label}</div>
        ))}
      </div>
      {showArrows && <button onClick={next} aria-label="Next" disabled={end >= items.length}>&gt;</button>}
    </div>
  )
}
