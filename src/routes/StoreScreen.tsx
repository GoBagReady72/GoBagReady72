import React, { useEffect, useMemo, useState } from 'react'
import storeItems from '../data/storeItems.json'
import ResourceBars from '../components/ResourceBars'

type Bars = { water:number; food:number; health:number; morale:number }
type Item = { id:string; name:string; category:string; cost:number; weight:number; effects: Partial<Bars> }

const BASE_BARS: Bars = { water: 60, food: 60, health: 60, morale: 60 }

type CartEntry = { id: string; qty: number }

export default function StoreScreen({
  onBack,
  onComplete,
  persona = 'EC'
}:{
  onBack:()=>void;
  onComplete:(payload:{
    cart: CartEntry[];
    startingBars: Bars;
    carryPenalty: number;
    weight: number;
    capacity: number;
    budget: number;
    spent: number;
  })=>void;
  persona?: 'EC'|'PR';
}){
  // Persona economics & capacity
  const startingBudget = persona==='EC' ? 300 : 150
  const capacity = persona==='EC' ? 25 : 30 // lbs; tweak later with gender variants

  const items = useMemo<Item[]>(()=> (storeItems as any) as Item[], [])
  const [qty, setQty] = useState<Record<string, number>>({})
  const [spent, setSpent] = useState(0)
  const [weight, setWeight] = useState(0)
  const [bars, setBars] = useState<Bars>(BASE_BARS)

  function clamp(v:number){ return Math.max(0, Math.min(100, v)) }

  useEffect(()=>{
    let s = 0, w = 0
    let e: Bars = { ...BASE_BARS }
    for (const it of items){
      const n = qty[it.id] ?? 0
      if (n > 0){
        s += it.cost * n
        w += it.weight * n
        e = {
          water: clamp(e.water + (it.effects.water ?? 0) * n),
          food: clamp(e.food + (it.effects.food ?? 0) * n),
          health: clamp(e.health + (it.effects.health ?? 0) * n),
          morale: clamp(e.morale + (it.effects.morale ?? 0) * n),
        }
      }
    }
    setSpent(s); setWeight(parseFloat(w.toFixed(2))); setBars(e)
  }, [qty, items])

  const budgetLeft = startingBudget - spent
  const overBudget = budgetLeft < 0
  const carryPenalty = Math.max(0, Math.min(3, weight > capacity ? (1 + Math.floor((weight - capacity)/5)) : 0))

  function inc(id:string, cost:number){
    // Prevent going over budget by more than one step (so UX feels responsive)
    if (budgetLeft - cost < -0.0001) return
    setQty(prev => ({...prev, [id]: (prev[id] ?? 0) + 1}))
  }
  function dec(id:string){
    setQty(prev => {
      const next = {...prev}
      next[id] = Math.max(0, (prev[id] ?? 0) - 1)
      if (next[id] === 0) delete next[id]
      return next
    })
  }

  function complete(){
    if (overBudget) return
    const cart: CartEntry[] = Object.entries(qty).map(([id, n]) => ({ id, qty: n }))
    onComplete({ cart, startingBars: bars, carryPenalty, weight, capacity, budget: startingBudget, spent })
  }

  const categories = Array.from(new Set(items.map(i=>i.category)))

  return (
    <div className="panel">
      <div className="kicker">MSS Store</div>
      <div className="title">Build Your GoBag</div>
      <div className="small">Persona: {persona==='EC' ? 'Everyday Civilian (more cash)' : 'Prepper (less cash, stronger kit later)'}</div>

      <div className="grid cols-2" style={{marginTop:12}}>
        <div className="vstack">
          <div className="card">
            <div className="kicker">Budget & Carry</div>
            <div className="small">Budget left: ${budgetLeft.toFixed(2)} (spent ${spent.toFixed(2)} of ${startingBudget})</div>
            <div className="small">Weight: {weight.toFixed(2)} lb / Capacity: {capacity} lb</div>
            {carryPenalty>0 && <div className="small">Carry penalty: -{carryPenalty} mi per move (over capacity)</div>}
            {overBudget && <div className="small" style={{color:'#C0392B'}}>Over budget — remove items to proceed.</div>}
          </div>
          <div className="card">
            <div className="kicker">Projected Start</div>
            <ResourceBars bars={bars} />
          </div>
          <div className="card">
            <div className="kicker">Your Cart</div>
            {Object.keys(qty).length === 0 ? <div className="small">No items yet.</div> :
              <ul className="small">
                {Object.entries(qty).map(([id, n])=>{
                  const it = items.find(x=>x.id===id)!
                  return <li key={id}>{n}× {it.name} — ${ (it.cost*n).toFixed(2) } • {(it.weight*n).toFixed(2)} lb</li>
                })}
              </ul>
            }
          </div>
          <div className="hstack" style={{marginTop:10}}>
            <button className="btn" onClick={onBack}>Back</button>
            <button className="btn primary" onClick={complete} disabled={overBudget}>Start Evacuation</button>
          </div>
        </div>

        <div className="vstack">
          <div className="kicker">Inventory</div>
          {categories.map(cat => (
            <div key={cat} className="vstack" style={{marginBottom:12}}>
              <div className="small" style={{textTransform:'uppercase', letterSpacing:'.12em'}}>{cat}</div>
              <div className="grid cols-2">
                {items.filter(i=>i.category===cat).map(it=>{
                  const n = qty[it.id] ?? 0
                  const nextOverBudget = (budgetLeft - it.cost) < -0.0001
                  return (
                    <div key={it.id} className="card">
                      <div className="title">{it.name}</div>
                      <div className="small">Cost: ${it.cost} • {it.weight} lb</div>
                      <div className="small" style={{marginTop:6}}>
                        Effects:&nbsp;
                        {Object.entries(it.effects).map(([k,v])=>(<span key={k} style={{marginRight:8}}>{k} {v>0?'+':''}{v}</span>))}
                      </div>
                      <div className="hstack" style={{marginTop:8, alignItems:'center', gap:8}}>
                        <button className="btn" onClick={()=>dec(it.id)} disabled={n===0}>−</button>
                        <div className="small" style={{minWidth:24, textAlign:'center'}}>{n}</div>
                        <button className="btn" onClick={()=>inc(it.id, it.cost)} disabled={nextOverBudget}>+</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
