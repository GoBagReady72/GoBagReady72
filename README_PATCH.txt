GoBag: Ready72 — Store & Load‑out MVP Patch
===========================================

Adds a functional MSS Store:
- Budget & capacity by persona (EC: $300/25 lb; PR: $150/30 lb)
- Item selection with cost, weight, and effects on starting bars
- Carry penalty if weight exceeds capacity (up to -3 mi per move)
- Start simulation with projected bars and penalty applied

Files:
- src/data/storeItems.json
- src/routes/StoreScreen.tsx
- src/routes/SimulationScreen.tsx (accepts startingBars + carryPenalty)
- src/App.tsx (wires store → simulation)

Apply:
1) Unzip at repo root (same level as /src), overwrite files.
2) Commit & push:
   git add .
   git commit -m "feat(store): MSS Store with budget/weight and starting bars"
   git push

Tuneables:
- Persona budget/capacity (StoreScreen.tsx)
- Item catalog & effects (storeItems.json)
- Evac target distance and penalty math (SimulationScreen.tsx)
