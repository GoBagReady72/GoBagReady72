import { NextRequest, NextResponse } from 'next/server'
export const config = { runtime: 'edge' }

type Event = {
  session_id: string;
  ts: string;
  persona?: string;
  event_type: string;
  win_category?: string | null;
  payload?: Record<string, unknown>;
}

type Body = { events: Event[] }

const ALLOWED_EVENTS = new Set([
  'session_start',
  'persona_selected',
  'store_entered',
  'item_added',
  'checkout',
  'run_complete',
  'win',
  'abandon'
])

const MSS_CATEGORIES = new Set([
  'WATER','FOOD','CLOTHING','SHELTER','COMMS & NAV','HEALTH','SUSTAINABILITY','SPECIAL CONSIDERATIONS'
])

function validate(evt: Event) {
  if (!evt || typeof evt !== 'object') throw new Error('Invalid event')
  if (!evt.session_id) throw new Error('Missing session_id')
  if (!evt.ts) throw new Error('Missing ts')
  if (!ALLOWED_EVENTS.has(evt.event_type)) throw new Error('Unknown event_type')
  if (evt.event_type === 'win') {
    if (!evt.win_category || !MSS_CATEGORIES.has(evt.win_category)) {
      throw new Error('win_category must be one of the 8 MSS categories')
    }
  }
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }
  try {
    const body = (await req.json()) as Body
    if (!body || !Array.isArray(body.events)) throw new Error('Body must be { events: [] }')
    for (const e of body.events) validate(e)

    const env = process.env.VERCEL_ENV ?? 'local'
    const host = req.headers.get('host') || process.env.VERCEL_URL || ''
    const isBeta = host.startsWith('beta.')
    const deploymentId = req.headers.get('x-vercel-deployment-id')

    console.log('[track]', JSON.stringify({ env, alias: isBeta ? 'beta':'', deploymentId, ...body }))

    return NextResponse.json({ ok: true, received: body.events.length })
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message ?? 'Invalid payload' }, { status: 400 })
  }
}
