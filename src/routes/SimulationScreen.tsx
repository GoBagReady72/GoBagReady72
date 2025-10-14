import React, { useMemo, useState } from 'react'
import ResourceBars from '../components/ResourceBars'
import DecisionPanel, { ActionDef } from '../components/DecisionPanel'
import EventLog from '../components/EventLog'
import PersonaCard from '../components/PersonaCard'
import DistanceProgress from '../components/DistanceProgress'
import actionsData from '../data/actions.json'

type Bars = { water:number; food:number; health:number; morale:number }

function applyEffects(bars:Bars, effects:Record<string,number>):Bars{
  const next = {...bars}
  for(const [k,v] of Object.entries(effects)){
    if (k === 'distance') continue
    const key = k as keyof Bars
    const newVal = Math.max(0, Math.min(100, (next[key] as number) + v))
    ;(next[key] as number) = newVal
  }
  return next
}

export default function SimulationScreen({persona, seed, onDone, onBack}:{persona:'EC'|'PR'; seed:number; onDone:(r:any)=>void; onBack:()=>void}){
  const [cycle,setCycle] = useState(1)
  const [bars,setBars] = useState<Bars>({water:80, food:80, health:80, morale:80})
  const [distance, setDistance] = useState<number>(0)
  const targetDistance = 60
  const [log,setLog] = useState<string[]>(['Simulation begins. Evacuate within 72 hours.'])
  const actions = useMemo<ActionDef[]>(()=>actionsData as any, [])
  const totalCycles = 18

  function choose(id:string){
    const action = actions.find(a=>a.id===id)!
    const nextBars = applyEffects(bars, action.effects as any)
    const deltaDist = (action.effects as any).distance ?? 0
    const nextDistance = Math.max(0, distance + deltaDist)

    setBars(nextBars)
    setDistance(nextDistance)
    setLog(prev=>[`${cycle}: ${action.name} → ${JSON.stringify(action.effects)}`, ...prev].slice(0,100))
    const nextCycle = cycle+1
    const done = (nextCycle>totalCycles) || (nextBars.health<=0)

    if(done){
      let outcome =
        (nextBars.health>70 && nextBars.water>60 && nextBars.food>60 && nextBars.morale>60) ? 'Thrived'
        : (nextBars.health>30 ? 'Stable' : 'Survived')

      if (nextDistance < targetDistance) {
        outcome = "Failed: Didn’t evacuate in time"
      }

      onDone({ outcome, finalBars: nextBars, cycles: nextCycle-1, distance: nextDistance, targetDistance })
    }else{
      setCycle(nextCycle)
    }
  }

  return (
    <div className="grid cols-2">
      <div className="panel">
        <div className="kicker">Decision Cycle</div>
        <div className="title">Cycle {cycle} / {totalCycles}</div>
        <div className="small">Persona: {persona==='EC'?'Everyday Civilian':'Prepper'}</div>
        <div style={{marginTop:12}}>
          <ResourceBars bars={bars} />
          <DistanceProgress distance={distance} target={targetDistance} />
        </div>
        <div style={{marginTop:16}}>
          <DecisionPanel actions={actions} onChoose={choose} />
        </div>
        <div className="hstack" style={{marginTop:12}}>
          <button className="btn" onClick={onBack}>Back</button>
        </div>
      </div>
      <div className="vstack">
        <PersonaCard archetype={persona} />
        <EventLog lines={log} />
      </div>
    </div>
  )
}
