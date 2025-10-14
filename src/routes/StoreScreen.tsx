import React, { useEffect, useMemo, useState } from 'react'
import storeItems from '../data/storeItems.json'
import ResourceBars from '../components/ResourceBars'

type Bars = { water:number; food:number; health:number; morale:number }
type Item = { id:string; name:string; category:string; cost:number; weight:number; effects: Partial<Bars> }

const BASE_BARS: Bars = { water: 60, food: 60, health: 60, morale: 60 }

export default function StoreScreen({
  onBack,
  onComplete,
  persona = 'EC'
}:{ onBack:()=>void; onComplete:(payload:{ selected:string[]; startingBars:Bars; carryPenalty:number; weight:number; capacity:number; budget:number; spent:number; })=>void; persona?:'EC'|'PR' }){

  const startingBudget = persona==='EC' ? 300 : 150
  const capacity = persona==='EC' ? 25 : 30 // lbs

  const items = useMemo<Item[]>(()=> (storeItems as any) as Item[], [])
  const [selected, setSelected] = useState<string[]>([])
  const [spent, setSpent] = useState(0)
  const [weight, setWeight] = useState(0)
  const [bars, setBars] = useState<Bars>(BASE_BARS)

  function clamp(v:number){ return Math.max(0, Math.min(100, v)) }

  useEffect(()=>{
    const sel = new Set(selected)
    let s = 0, w = 0
    let e: Bars = { ...BASE_BARS }
    for(const it of items){
      if(sel.has(it.id)){
        s += it.cost
        w += it.weight
        e = {
          water: clamp(e.water + (it.effects.water ?? 0)),
          food: clamp(e.food + (it.effects.food ?? 0)),
          health: clamp(e.health + (it.effects.health ?? 0)),
          morale: clamp(e.morale + (it.effects.morale ?? 0)),
        }
      }
    }
    setSpent(s); setWeight(parseFloat(w.toFixed(2))); setBars(e)
  }, [selected, items])

  const budget = startingBudget - spent
  const overBudget = budget < 0
  const carryPenalty = Math.max(0, Math.min(3, weight > capacity ? (1 + Math.floor((weight - capacity)/5)) : 0))

  function toggle(id:string){
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  function complete(){
    if(overBudget) return
    onComplete({ selected, startingBars: bars, carryPenalty, weight, capacity, budget: startingBudget, spent })
  }

  return (
    <div className="panel">
      <div className="kicker">MSS Store</div>
      <div className="title">Build Your GoBag</div>
      <div className="small">Persona: {persona==='EC' ? 'Everyday Civilian (more cash)' : 'Prepper (less cash, stronger kit later)'}</div>

      <div className="grid cols-2" style={{marginTop:12}}>
        <div className="vstack">
          <div className="card">
            <div className="kicker">Budget & Carry</div>
            <div className="small">Budget: ${budget.toFixed(2)} (spent ${spent.toFixed(2)} of ${startingBudget})</div>
            <div className="small">Weight: {weight.toFixed(2)} lb / Capacity: {capacity} lb</div>
            {carryPenalty>0 && <div className="small">Carry penalty: -{carryPenalty} mi per move (over capacity)</div>}
          </div>
          <div className="card">
            <div className="kicker">Projected Start</div>
            <ResourceBars bars={bars} />
          </div>
          <div className="hstack" style={{marginTop:10}}>
            <button className="btn" onClick={onBack}>Back</button>
            <button className="btn primary" onClick={complete} disabled={overBudget}>Start Evacuation</button>
          </div>
          {overBudget && <div className="small" style={{color:'#C0392B'}}>Over budget — remove items to proceed.</div>}
        </div>
        <div className="vstack">
          <div className="kicker">Inventory</div>
          <div className="grid cols-2">
            {items.map(it=>{
              const picked = selected.includes(it.id)
              const disabled = (!picked && (startingBudget - spent - it.cost) < 0)
              return (
                <div key={it.id} className="card">
                  <div className="small" style={{textTransform:'uppercase', letterSpacing:'.12em'}}>{it.category}</div>
                  <div className="title">{it.name}</div>
                  <div className="small">Cost: ${it.cost} • {it.weight} lb</div>
                  <div className="small" style={{marginTop:6}}>
                    Effects:&nbsp;
                    {Object.entries(it.effects).map(([k,v])=>(<span key={k} style={{marginRight:8}}>{k} {v>0?'+':''}{v}</span>))}
                  </div>
                  <div style={{marginTop:8}}>
                    <button className={`btn ${picked?'primary':''}`} onClick={()=>toggle(it.id)} disabled={disabled && !picked}>
                      {picked ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
