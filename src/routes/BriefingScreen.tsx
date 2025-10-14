import React from 'react'
export default function BriefingScreen({seed,onNext,onBack}:{seed:number; onNext:()=>void; onBack:()=>void}){
  return (
    <div className="panel">
      <div className="kicker">HazAssist Briefing</div>
      <div className="title">Kick-Off Event</div>
      <div className="small">Seed: {seed}</div>
      <p className="small">A catastrophic event impacts local lifelines. Evacuation is ordered. Prepare your loadout before the first 4-hour cycle begins.</p>
      <div className="hstack" style={{marginTop:10}}>
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" onClick={onNext}>Proceed to Load-Out</button>
      </div>
    </div>
  )
}
