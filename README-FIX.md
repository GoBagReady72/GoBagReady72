# Vite Admin Guard — Fix Patch

This patch removes Next.js middleware usage and routes admin traffic via a Vercel Edge Function.

## Apply
1. Delete any `middleware.ts` / `middleware.js` and `next.config.js` from your repo.
2. Copy `vercel.json` and `api/admin-guard.ts` into your project root (create `api/` if missing).
3. (Optional) Add `src/pages/Admin.tsx` and wire your router so /admin renders it.
4. Set env vars in Vercel: `ADMIN_USER`, `ADMIN_PASS`.
5. Ensure Vercel Framework = Vite; Build = `npm run build`; Output = `dist`.
6. Deploy → test https://admin.gobagready72.com.

## Notes
- `vercel.json` includes a SPA fallback to `/index.html` for client-side routing.
- Admin guard only intercepts requests for admin subdomain or `/admin` path.
