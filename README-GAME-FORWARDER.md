# Ready72 GAME Forwarder (v0.1)

This drops a single serverless function into your GAME repo:
- `api/track-proxy.js`

## Why
Keeps `ADMIN_SHARED_SECRET` **out of the browser**. The game posts to `/api/track-proxy` (same origin), which then forwards to the Admin `/api/track` with the secret from server-side env.

## Setup
1) Add files to your GAME repo (at project root).
2) On Vercel (GAME project), set environment variables:
   - `ADMIN_TRACK_ENDPOINT` = `https://admin.gobagready72.com/api/track`
   - `ADMIN_SHARED_SECRET` = your admin secret
   - `FORWARDED_ORIGIN` = `https://beta.gobagready72.com` (optional; helps Admin map env by origin)
3) Deploy.

## Client Usage
```js
await fetch('/api/track-proxy', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ session_id, persona, category, outcome })
});
```

No secrets in the client. Admin still enforces env/alias server-side.
