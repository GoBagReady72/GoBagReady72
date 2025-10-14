GoBag: Ready72 — Store Quantities Patch
======================================

This update lets players add **multiples of any item** in the MSS Store.
- Budget & weight update per quantity
- Starting bars scale by item effects × qty
- Cart shows totals; carry penalty computed from total weight
- Payload now returns `cart: { id, qty }[]` (instead of a flat `selected` list)

Files:
- src/routes/StoreScreen.tsx  (updated to support per-item quantities)

Install:
1) Unzip at repo root (same level as /src).
2) Overwrite files.
3) Commit & push:
   git add .
   git commit -m "feat(store): support per-item quantities and cart totals"
   git push

Notes:
- Simulation integration is unchanged; we still pass `startingBars` and `carryPenalty`.
- You can log the `cart` in App.tsx if you want to persist a run record for analytics.
