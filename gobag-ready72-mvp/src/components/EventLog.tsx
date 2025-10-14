import React from 'react'

export default function EventLog({lines}:{lines:string[]}){
  return (
    <div className="panel">
      <div className="kicker">Event Log</div>
      <div className="list">
        {lines.map((l,idx)=>(<div key={idx} className="small">{l}</div>))}
      </div>
    </div>
  )
}
