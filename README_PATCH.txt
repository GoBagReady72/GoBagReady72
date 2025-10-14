GoBag: Ready72 — MSS Canon Patch (Final)
=========================================

This patch locks the **canonical 8 MSS categories** in the Store and remaps all items accordingly.
It also documents the canon for your new GoBag: Ready72 DevGPT to inherit.

Canonical MSS Categories (fixed order)
1) Water
2) Food
3) Clothing
4) Shelter
5) Communications & Navigation
6) Health
7) Sustainability
8) Special Considerations

What this patch does
- Store UI renders **only** the 8 canonical categories in that exact order.
- Legacy labels (e.g., Health & Sanitation, Lighting, Docs/Pets) are remapped to the proper MSS bucket.
- `storeItems.json` is normalized and expanded to include starter SKUs for **Clothing** and **Special Considerations**.

Files changed
- src/routes/StoreScreen.tsx
- src/data/storeItems.json

Install
1) Unzip at repo root (same level as /src), overwrite files.
2) Commit & push:
   git add .
   git commit -m "chore(store): lock 8 MSS categories + remap items to canon"
   git push

Notes
- Clothing is now first-class (change of clothes, socks, waterproof jacket, hiking boots).
- Health includes hygiene/sanitation (N95, goggles, first-aid, wipes, soap, TP).
- Communications & Navigation includes radio, maps, and signal mirror/whistle.
- Special Considerations holds documents, small-bills cash, pet care, spare glasses, etc.
- Sustainability contains lighting, fire, tools, mess kit, can opener (and power/panels later).

Education-first reminder
All UI/UX and gameplay loops should reinforce MSS categories and teach via transparent trade-offs
(weight → carry penalty; kit choice → pace; poor balance → morale/health hits).

— End of patch —
