# Ready72 Admin v0.1 (Vite + Edge API stubs)

Two-panel admin (BETA & SANDBOX) and Edge API endpoints with **env/alias/deployment** awareness.

## What you get
- Vite + React admin UI (`/src`) with two sections:
  - **BETA** → fixed filter `env=production&alias=beta`
  - **SANDBOX** → `env=preview` (optional `deployment_id`)
- `/api/track` — validates events, derives `env/alias/deployment` on the server (no client trust), logs only (no DB yet)
- `/api/kpis` — accepts `env`, `alias`, `from`, `to`, `deployment_id`; returns zeros + meta to wire the UI now
- No secrets, no `node_modules`

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
- Create project (or separate admin project); attach `admin.yourdomain.com`
- Enable **Vercel Authentication** on this project to restrict to team members (free)
- Keep **Preview Deployments ON**; **disable auto-deploy to Production** if you want manual promotion

## Promote preview → beta (milestone workflow)
- Choose the successful preview you like in **Deployments**
- **Aliases → Add →** `beta.yourdomain.com`
- Tag your repo: `git tag -a beta-milestone-YYYYMMDD -m "Promoted"`; `git push --tags`

## Next steps (when ready)
- Wire `/api/track` to Postgres (events table) + Redis (counters)
- Make `/api/kpis` compute real stats with filtering
- Add “same build” banner if BETA and SANDBOX deployment IDs match
