import React, { useEffect, useMemo, useState } from 'react'
import { KpiTile } from './components/KpiTile'
import { fetchKpis, Kpis } from './api'

type Panel = 'beta'|'sandbox'

function usePolling<T>(fn:()=>Promise<T>, deps:any[], ms:number){
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(()=>{
    let mounted = true
    let timer: any
    const tick = async () => {
      try {
        const v = await fn()
        if (mounted) setData(v as any), setError(null)
      } catch(e:any){
        if (mounted) setError(e?.message ?? 'Error')
      } finally {
        if (mounted) timer = setTimeout(tick, ms)
      }
    }
    tick()
    return ()=>{ mounted=false; clearTimeout(timer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, error }
}

function Section({panel}:{panel:Panel}){
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [deploymentId, setDeploymentId] = useState<string>('')
  const query = useMemo(()=>{
    if (panel==='beta'){
      return { env: 'production', alias: 'beta', from, to }
    } else {
      return { env: 'preview', deployment_id: deploymentId || undefined, from, to }
    }
  }, [panel, from, to, deploymentId])

  const { data, error } = usePolling<Kpis>(
    ()=> fetchKpis(query),
    [JSON.stringify(query)],
    5000
  )

  return (
    <div className="section">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2>{panel==='beta' ? 'BETA' : 'SANDBOX'}</h2>
        <div className="row">
          {panel==='sandbox' &&
            <>
              <label>Deployment ID</label>
              <input placeholder="(optional)" value={deploymentId} onChange={e=>setDeploymentId(e.target.value)} />
            </>
          }
          <label>From</label>
          <input type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)} />
          <label>To</label>
          <input type="datetime-local" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
      </div>
      {error && <div className="warn">{error}</div>}
      <div className="grid">
        <KpiTile label="Total Plays" value={data?.total_plays ?? 0} />
        <KpiTile label="Completions" value={data?.completions ?? 0} />
        <KpiTile label="Completion Rate" value={((data?.completion_rate ?? 0)*100).toFixed(1)+'%'} />
        <KpiTile label="Wins Total" value={data?.wins_total ?? 0} />
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="subtitle">Wins by MSS Category</div>
        <table>
          <thead><tr><th>Category</th><th>Wins</th></tr></thead>
          <tbody>
            {Object.entries(data?.wins_by_category ?? {}).map(([k,v])=>(
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="subtitle">Wins by Persona</div>
        <table>
          <thead><tr><th>Persona</th><th>Wins</th></tr></thead>
          <tbody>
            {Object.entries(data?.wins_by_persona ?? {}).map(([k,v])=>(
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="muted" style={{marginTop:8}}>
        Meta: env={data?.meta.env ?? '—'}, alias={data?.meta.alias ?? '—'}, deployment={data?.meta.deployment_id ?? '—'}, now={data?.meta.now ?? '—'}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <div className="container">
      <h1 className="title">Ready72 Admin</h1>
      <div className="subtitle">Two hard-separated panels. BETA only reads production+beta alias; SANDBOX reads preview (optionally scoped to a specific deployment).</div>
      <Section panel="beta" />
      <Section panel="sandbox" />
    </div>
  )
}
