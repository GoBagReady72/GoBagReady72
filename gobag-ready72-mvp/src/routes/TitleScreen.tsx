import React, { useState } from 'react'

export default function TitleScreen({onNext}:{onNext:(p:'EC'|'PR')=>void}){
  const [p,setP] = useState<'EC'|'PR'>('EC')
  return (
    <div className="panel">
      <div className="kicker">GoBag: Ready72 — Survival Simulator</div>
      <div className="title">Start</div>
      <div className="small">Powered by HazMSS360</div>
      <div className="vstack" style={{marginTop:14}}>
        <label className="small">Choose archetype</label>
        <div className="hstack">
          <button className={`btn ${p==='EC'?'primary':''}`} onClick={()=>setP('EC')}>Everyday Civilian</button>
          <button className={`btn ${p==='PR'?'primary':''}`} onClick={()=>setP('PR')}>Prepper</button>
        </div>
        <div className="hstack" style={{marginTop:12}}>
          <button className="btn primary" onClick={()=>onNext(p)}>Begin Simulation</button>
        </div>
      </div>
    </div>
  )
}
