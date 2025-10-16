
READY72 — v0.8 Canon Alignment (ONE ZIP)
----------------------------------------
Files included:
  • src/core/personas.ts         — canon persona traits (EC / PR / PRO)
  • src/core/mss.ts              — MSS compliance + weight/efficiency
  • src/core/economy.ts          — prep-phase scaffold
  • src/components/KOEPanel.tsx  — persona selector + MSS gauges + debrief

Install:
  1) Upload & extract at repo root.
  2) Let Vercel build, refresh live.

Notes:
  • This does NOT modify koe/engine internals; encumbrance & morale hints are passed via SimState.
  • Next step can wire persona traits deeper into engine timelines if desired.
