GoBag: Ready72 — Distance & Evac Goal Patch
===========================================

Adds a Distance meter + evacuation target. Fail if target not reached by cycle 18.

Modified files:
- src/components/DistanceProgress.tsx   (NEW)
- src/data/actions.json                 (UPDATED: added "distance")
- src/routes/SimulationScreen.tsx       (UPDATED: track/apply distance; outcome gate)
- src/routes/DebriefScreen.tsx          (UPDATED: show distance)

Apply:
1) Unzip at repo root (same level as /src).
2) Overwrite files.
3) Commit & push:
   git add .
   git commit -m "feat(sim): add Distance & Evac Goal + progress meter"
   git push
