import React, { useState } from 'react'
import TitleScreen from './routes/TitleScreen'
import BriefingScreen from './routes/BriefingScreen'
import StoreScreen from './routes/StoreScreen'
import SimulationScreen from './routes/SimulationScreen'
import DebriefScreen from './routes/DebriefScreen'

type Screen = 'title'|'brief'|'store'|'sim'|'debrief'
type Bars = { water:number; food:number; health:number; morale:number }

export default function App(){
  const [screen,setScreen] = useState<Screen>('title')
  const [seed,setSeed] = useState<number>(()=>Math.floor(Math.random()*1e9))
  const [result,setResult] = useState<any>(null)
  const [persona,setPersona] = useState<'EC'|'PR'>('EC')
  const [startingBars, setStartingBars] = useState<Bars|undefined>(undefined)
  const [carryPenalty, setCarryPenalty] = useState<number>(0)
  const [cart, setCart] = useState<{id:string; qty:number}[]>([])

  const to = (s:Screen)=>()=>setScreen(s)

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">GoBag: Ready72 — Survival Simulator</div>
        <div className="small">Powered by HazMSS360</div>
      </div>
      <div className="container">
        {screen==='title' && <TitleScreen onNext={(p)=>{setPersona(p); setScreen('brief')}} />}
        {screen==='brief' && <BriefingScreen seed={seed} onNext={()=>setScreen('store')} onBack={to('title')} />}
        {screen==='store' && <StoreScreen persona={persona} onBack={to('brief')} onComplete={(payload)=>{
          setCart(payload.cart);
          setStartingBars(payload.startingBars);
          setCarryPenalty(payload.carryPenalty);
          setScreen('sim')
        }} />}
        {screen==='sim' && <SimulationScreen persona={persona} seed={seed} startingBars={startingBars} carryPenalty={carryPenalty}
          onDone={(r)=>{ setResult({...r, cart}); setScreen('debrief') }} onBack={to('store')} />}
        {screen==='debrief' && <DebriefScreen result={result} onRestart={()=>{
            setSeed(Math.floor(Math.random()*1e9));
            setStartingBars(undefined);
            setCarryPenalty(0);
            setCart([]);
            setScreen('title')
          }} />}
      </div>
      <footer>© GoBag: Ready72 — Powered by HazMSS360 • MVP prototype</footer>
    </div>
  )
}
