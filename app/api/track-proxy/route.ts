// Next.js App Router proxy → Admin /api/track
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const adminEndpoint   = process.env.ADMIN_TRACK_ENDPOINT; // e.g. https://admin.gobagready72.com/api/track
    const adminSecret     = process.env.ADMIN_SHARED_SECRET;
    const forwardedOrigin = process.env.FORWARDED_ORIGIN || 'https://beta.gobagready72.com';

    if (!adminEndpoint || !adminSecret) {
      return Response.json({ error: 'Proxy env not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));

    const upstream = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-secret': adminSecret,
        'Origin': forwardedOrigin
      },
      body: JSON.stringify(body)
    });

    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return Response.json(json, { status: upstream.status });
    } catch {
      return Response.json({ ok: false, passthrough: text }, { status: upstream.status });
    }
  } catch (e: any) {
    return Response.json({ error: 'Proxy failure', detail: String(e?.message || e) }, { status: 500 });
  }
}
