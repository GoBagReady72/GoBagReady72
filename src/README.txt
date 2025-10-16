GoBag: Ready72 — IntroStart v0.7.3 (Robust)
-------------------------------------------
Purpose: Guarantee the app starts at the Intro screen, with an optional URL override.

What it adds
- Default start at Intro (scene 0)
- URL override for quick QA: ?scene=0..5 (or #0..#5)
  Example: https://beta.gobagready72.com/?scene=0

How to apply (GitHub web UI)
1) In your repo, open /src/
2) Upload both files from this ZIP (overwrite App.tsx and Ready72WireframesV071.tsx)
3) Commit to main
4) Hard refresh (Ctrl/Cmd+Shift+R)

Notes
- If your App.tsx imports a different wireframe file, either update that import to Ready72WireframesV071,
  or copy the initial-scene logic into the file your App actually imports.
- If older wireframes (e.g., V042, V070, V072Patch) remain in /src, they are fine to keep, but ensure App.tsx imports V071.
- To test quickly: open /?scene=1 to start at Persona; /?scene=0 to start at Intro.