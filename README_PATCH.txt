GoBag: Ready72 — MSS Categories Patch
====================================

This patch enforces **MSS-only categories** in the Store and remaps legacy ones:

Visible order:
1) Water
2) Food
3) Shelter
4) Health & Sanitation
5) Comms & Navigation
6) Sustainability & Tools

Changes:
- Store UI now renders only the above categories (in that order).
- Legacy categories (e.g., "Lighting", "Sanitation", "Comms & Nav") are mapped to MSS buckets.
- Item catalog updated to use MSS categories consistently.

Files:
- src/routes/StoreScreen.tsx
- src/data/storeItems.json

Install:
1) Unzip at repo root (same level as /src), overwrite files.
2) Commit & push:
   git add .
   git commit -m "chore(store): enforce MSS-only categories and remap items"
   git push

You can add more SKUs later; just set `category` to one of the six allowed buckets.
