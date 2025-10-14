import React from 'react'

type Bars = { water:number; food:number; health:number; morale:number }

export default function ResourceBars({bars}:{bars:Bars}){
  const clamp = (n:number)=>Math.max(0,Math.min(100,n))
  return (
    <div className="grid cols-2">
      <Bar label="Water" cls="water" value={clamp(bars.water)} />
      <Bar label="Food" cls="food" value={clamp(bars.food)} />
      <Bar label="Health" cls="health" value={clamp(bars.health)} />
      <Bar label="Morale" cls="morale" value={clamp(bars.morale)} />
    </div>
  )
}

function Bar({label, cls, value}:{label:string; cls:string; value:number}){
  return (
    <div className="vstack">
      <div className="hstack" style={{justifyContent:'space-between'}}>
        <span className="small">{label}</span>
        <span className="small">{value}%</span>
      </div>
      <div className={`meter ${cls}`}>
        <span style={{width: value+'%'}} />
      </div>
    </div>
  )
}
