import { NextRequest, NextResponse } from 'next/server'
export const config = { runtime: 'edge' }

const MSS = ['WATER','FOOD','CLOTHING','SHELTER','COMMS & NAV','HEALTH','SUSTAINABILITY','SPECIAL CONSIDERATIONS'] as const

type Query = {
  env?: string
  alias?: string
  from?: string
  to?: string
  deployment_id?: string
}

function emptyKpis(){
  const wins_by_category: Record<string, number> = {}
  for (const k of MSS) wins_by_category[k] = 0
  return {
    total_plays: 0,
    completions: 0,
    completion_rate: 0,
    wins_total: 0,
    wins_by_category,
    wins_by_persona: {} as Record<string, number>,
  }
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q: Query = {
    env: searchParams.get('env') ?? undefined,
    alias: searchParams.get('alias') ?? undefined,
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    deployment_id: searchParams.get('deployment_id') ?? undefined,
  }

  const env = process.env.VERCEL_ENV ?? 'local'
  const host = req.headers.get('host') || process.env.VERCEL_URL || ''
  const isBeta = host.startsWith('beta.')
  const deploymentId = req.headers.get('x-vercel-deployment-id')

  return NextResponse.json({
    ok: true,
    data: {
      ...emptyKpis(),
      meta: { env, alias: isBeta ? 'beta' : null, deployment_id: deploymentId ?? null, now: new Date().toISOString() },
      filters: q
    }
  })
}
