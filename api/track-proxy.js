// api/track-proxy.js — adds GET diagnostics so we can see what's wrong
export default async function handler(req, res) {
  // GET: lightweight diagnostics (no secrets revealed)
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const adminEndpoint   = process.env.ADMIN_TRACK_ENDPOINT;
    const adminSecret     = process.env.ADMIN_SHARED_SECRET;
    const forwardedOrigin = process.env.FORWARDED_ORIGIN || 'https://beta.gobagready72.com';

    if (!adminEndpoint || !adminSecret) {
      return res.status(500).json({
        error: 'Proxy env not configured',
        have: {
          ADMIN_TRACK_ENDPOINT: !!adminEndpoint,
          ADMIN_SHARED_SECRET: !!adminSecret,
          FORWARDED_ORIGIN: !!forwardedOrigin
        }
      });
    }

    const body = req.body || {};

    let upstream;
    try {
      upstream = await fetch(adminEndpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-admin-secret': adminSecret,
          'Origin': forwardedOrigin
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      return res.status(502).json({
        error: 'Upstream fetch threw',
        detail: String(e?.message || e)
      });
    }

    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      return res.status(upstream.status).json({ passthrough: text, status: upstream.status });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'Proxy failure',
      detail: String(e?.message || e)
    });
  }
}
