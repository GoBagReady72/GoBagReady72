import React, { useState } from 'react'
import TitleScreen from './routes/TitleScreen'
import BriefingScreen from './routes/BriefingScreen'
import StoreScreen from './routes/StoreScreen'
import SimulationScreen from './routes/SimulationScreen'
import DebriefScreen from './routes/DebriefScreen'

type Screen = 'title'|'brief'|'store'|'sim'|'debrief'

export default function App(){
  const [screen,setScreen] = useState<Screen>('title')
  const [seed,setSeed] = useState<number>(()=>Math.floor(Math.random()*1e9))
  const [result,setResult] = useState<any>(null)
  const [persona,setPersona] = useState<'EC'|'PR'>('EC')

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
        {screen==='store' && <StoreScreen onNext={()=>setScreen('sim')} onBack={to('brief')} />}
        {screen==='sim' && <SimulationScreen persona={persona} seed={seed} onDone={(r)=>{setResult(r); setScreen('debrief')}} onBack={to('store')} />}
        {screen==='debrief' && <DebriefScreen result={result} onRestart={()=>{setSeed(Math.floor(Math.random()*1e9)); setScreen('title')}} />}
      </div>
      <footer>© GoBag: Ready72 — Powered by HazMSS360 • MVP prototype</footer>
    </div>
  )
}
