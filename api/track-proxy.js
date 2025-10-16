// api/track-proxy.ts
// Vercel Serverless Function (Node.js) for the *game* app.
// Forwards telemetry to the Admin endpoint with shared secret + correct Origin.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_TRACK_ENDPOINT =
  process.env.ADMIN_TRACK_ENDPOINT || 'https://admin.gobagready72.com/api/track';
const ADMIN_SHARED_SECRET = process.env.ADMIN_SHARED_SECRET || '';
const FORWARDED_ORIGIN = process.env.FORWARDED_ORIGIN || 'https://beta.gobagready72.com';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!ADMIN_SHARED_SECRET) {
      return res.status(500).json({ error: 'SERVER_MISCONFIG', message: 'Missing ADMIN_SHARED_SECRET' });
    }

    // Minimal validation (keep loose to avoid blocking telemetry)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!body?.session_id || !body?.persona || !body?.category || !body?.outcome) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing required fields (session_id, persona, category, outcome)' });
    }

    // Forward to Admin /api/track with shared secret + Origin header
    const fwd = await fetch(ADMIN_TRACK_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-secret': ADMIN_SHARED_SECRET,
        // Preserve intent: Admin validates Origin; ensure it receives the game origin
        'Origin': FORWARDED_ORIGIN
      },
      body: JSON.stringify(body),
    });

    const text = await fwd.text(); // pass through body (Admin returns JSON)
    // Mirror Admin’s status so callers can see success/failure
    res.status(fwd.status);
    // Forward useful headers
    res.setHeader('Content-Type', fwd.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.send(text);
  } catch (err: any) {
    return res.status(500).json({ error: 'PROXY_ERROR', message: err?.message || String(err) });
  }
}
