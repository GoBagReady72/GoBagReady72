import React from 'react'

export type ActionDef = { id:string; name:string; desc:string; effects: Record<string, number> }

export default function DecisionPanel({actions,onChoose}:{actions:ActionDef[]; onChoose:(id:string)=>void}){
  return (
    <div className="grid cols-3">
      {actions.map(a=>(
        <div key={a.id} className="card">
          <div className="kicker">{a.id}</div>
          <div className="title">{a.name}</div>
          <div className="small">{a.desc}</div>
          <div className="small" style={{marginTop:8}}>
            {Object.entries(a.effects).map(([k,v])=>(
              <div key={k}>{k}: {v>0?'+':''}{v}</div>
            ))}
          </div>
          <div style={{marginTop:10}}>
            <button className="btn primary" onClick={()=>onChoose(a.id)}>Choose</button>
          </div>
        </div>
      ))}
    </div>
  )
}
