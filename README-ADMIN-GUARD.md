# Vite Admin Guard (Vercel Edge)

This adds Basic Auth and admin subdomain routing for a Vite app on Vercel.

## What it does
- Prompts for username/password on `admin.gobagready72.com` **and** on `/admin`.
- If a user hits `admin.gobagready72.com` (root), it rewrites to `/admin`.
- Everything else remains public.

## Files
- `vercel.json` – routes traffic for admin host/path to the Edge Function
- `api/admin-guard.ts` – Edge Function implementing Basic Auth
- `.env.example` – env vars to set in Vercel
- `src/pages/Admin.tsx` – optional page to test `/admin`

## Setup
1. Copy files into your Vite project root (create `api/` if missing).
2. In Vercel → Project → **Settings → Environment Variables**:
   - `ADMIN_USER=yourname`
   - `ADMIN_PASS=supersecret`
3. In GoDaddy DNS, create CNAME: `admin` → `cname.vercel-dns.com`.
4. In Vercel → **Settings → Domains** → add `admin.gobagready72.com` and **Assign Deployment**.
5. Deploy. Visit `https://admin.gobagready72.com` → enter creds → should show your `/admin` page.

> If your app doesn’t have routing to `/admin` yet, add a route that renders `src/pages/Admin.tsx` (React Router or your own).
