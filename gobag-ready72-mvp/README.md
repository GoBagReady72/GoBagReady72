# GoBag: Ready72 — Survival Simulator (MVP)
**Powered by HazMSS360™**

This is a lightweight web MVP scaffold built with **React + TypeScript + Vite**.
It implements the core 4‑hour decision loop, resource meters, a basic action system,
and a deterministic screen flow: Title → Briefing → Store → Simulation → Debrief.

## Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:5173

## What’s inside
- `/src/routes/` — screens (Title, Briefing, Store, Simulation, Debrief)
- `/src/components/` — ResourceBars, DecisionPanel, EventLog, PersonaCard
- `/src/data/actions.json` — example action definitions with simple effects

## Next steps
- Wire in real **MSS** math and inventory from your JSON catalogs.
- Replace the Store screen with your **MSS shop** UI and item weights/budget logic.
- Add seed-based persona randomization and KOE events (HazAssist flavored).
- Persist runs (localStorage or backend) and generate a **Readiness Profile** at Debrief.
