// api/track-proxy.js
// Vercel Serverless Function for the GAME repo.
// Purpose: accept browser POSTs without any shared secret and forward
// to the Admin API with server-held ADMIN_SHARED_SECRET.
// This keeps secrets out of the client. CORS is not required here if
// the game calls same-origin (/api/track-proxy).

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const adminUrl = process.env.ADMIN_TRACK_ENDPOINT; // e.g. https://admin.gobagready72.com/api/track
    const adminSecret = process.env.ADMIN_SHARED_SECRET;
    if (!adminUrl || !adminSecret) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    // pass through only required fields; ignore any env/alias attempts from client
    const { session_id, persona, category, outcome } = req.body || {};
    if (!session_id || !persona || !category || !outcome) {
      return res.status(400).json({ error: 'Missing field(s)' });
    }

    // Forward server-to-server with the secret header
    const forwardResp = await fetch(adminUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-secret': adminSecret,
        // Propagate Origin to let admin map env by origin if desired
        'origin': process.env.FORWARDED_ORIGIN || ''
      },
      body: JSON.stringify({ session_id, persona, category, outcome })
    });

    const text = await forwardResp.text();
    res.status(forwardResp.status).send(text);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Proxy failure' });
  }
}
