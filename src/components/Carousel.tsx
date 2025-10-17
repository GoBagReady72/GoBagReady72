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
    <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2 md:gap-3">
      {showArrows ? (
        <button onClick={prev} aria-label="Previous" disabled={start === 0} className="p-2 rounded border disabled:opacity-40">{'<'}</button>
      ) : <div />}
      <div ref={trackRef} className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${slice.length}, minmax(0,1fr))` }}>
        {slice.map(it => (
          <div key={it.id} className="wf-card min-h-20">{it.label}</div>
        ))}
      </div>
      {showArrows ? (
        <button onClick={next} aria-label="Next" disabled={end >= items.length} className="p-2 rounded border disabled:opacity-40">{'>'}</button>
      ) : <div />}
    </div>
  )
}
