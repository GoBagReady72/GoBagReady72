import React from 'react'
export default function PersonaCard({archetype}:{archetype:'EC'|'PR'}){
  return (
    <div className="card">
      <div className="kicker">Persona</div>
      <div className="title">{archetype==='EC' ? 'Everyday Civilian' : 'Prepper'}</div>
      <div className="small">Gender randomized on start • Ethnicity is cosmetic only</div>
      <div className="small" style={{marginTop:8}}>
        {archetype==='EC' ? (<>More cash • Weak kit • Learns fast</>) : (<>Strong kit • Less cash • Risk of overpacking</>)}
      </div>
    </div>
  )
}
