import React from 'react'

export default function DebriefScreen({result,onRestart}:{result:any; onRestart:()=>void}){
  return (
    <div className="panel">
      <div className="kicker">Debrief</div>
      <div className="title">Outcome: {result?.outcome ?? '—'}</div>
      <pre className="small" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result?.finalBars, null, 2)}</pre>
      <div className="hstack" style={{marginTop:12}}>
        <button className="btn primary" onClick={onRestart}>Run Again</button>
      </div>
    </div>
  )
}
