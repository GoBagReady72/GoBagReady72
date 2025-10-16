Ready72 Wireframes v0.7.2 — Play Again Loop Patch
-------------------------------------------------
Feature:
- Adds proper reset logic after Debrief so "Play again" resets stats and restarts smoothly.
- Keeps current persona (or randomizes if you change resetGame(false)).

To apply (GitHub web UI, no CLI needed):
1) In your repo, open /src/
2) Upload this new App.tsx (overwrite existing)
3) Upload Ready72WireframesV072Patch.tsx (keep next to existing wireframes)
4) Commit to main
5) Deploy as usual on Vercel

Test:
- Finish a run → Debrief → click "Play again" → should return cleanly to Persona selection with reset values.