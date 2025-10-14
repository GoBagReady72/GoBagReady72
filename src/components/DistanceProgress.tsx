import React from 'react'

export default function DistanceProgress({
  distance,
  target
}: { distance: number; target: number }) {
  const pct = Math.max(0, Math.min(100, (distance / target) * 100))
  return (
    <div className="vstack" style={{marginTop:12}}>
      <div className="hstack" style={{justifyContent:'space-between'}}>
        <span className="small">Distance to Safety</span>
        <span className="small">{distance.toFixed(1)} / {target} mi</span>
      </div>
      <div className="meter morale">
        <span style={{width: pct + '%'}} />
      </div>
    </div>
  )
}
