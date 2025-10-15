export type Kpis = {
  total_plays: number
  completions: number
  completion_rate: number
  wins_total: number
  wins_by_category: Record<string, number>
  wins_by_persona: Record<string, number>
  meta: { env: string, alias: string|null, deployment_id: string|null, now: string }
}

export async function fetchKpis(params: Record<string,string|undefined>) {
  const qs = new URLSearchParams()
  for (const [k,v] of Object.entries(params)) if (v) qs.append(k, v)
  const res = await fetch(`/api/kpis?${qs.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch KPIs: ${res.status}`)
  const json = await res.json()
  return json.data as Kpis
}
