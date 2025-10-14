import React from 'react'
export default function StoreScreen({onNext,onBack}:{onNext:()=>void; onBack:()=>void}){
  return (
    <div className="panel">
      <div className="kicker">MSS Store</div>
      <div className="title">Build Your GoBag</div>
      <p className="small">Allocate starting funds to water, food, shelter, health, comms, and more. (Static mock for MVP scaffold.)</p>
      <div className="hstack" style={{marginTop:10}}>
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={onNext}>Start 72‑Hour Simulation</button>
      </div>
    </div>
  )
}
