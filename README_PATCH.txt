GoBag: Ready72 — Store Quantities Fix
====================================

This patch updates BOTH the Store and App to support **per-item quantities**.

Changes:
- Store has + / − controls per item; budget/weight scale by quantity.
- `onComplete` now returns `cart: {id, qty}[]` in addition to startingBars/carryPenalty.
- App saves `cart` and includes it in the Debrief result for future analytics.

Files:
- src/routes/StoreScreen.tsx
- src/App.tsx

Install:
1) Unzip at repo root (same level as /src).
2) Overwrite files.
3) Commit & push:
   git add .
   git commit -m "fix(store): enable per-item quantities and wire payload to App"
   git push
