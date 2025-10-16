Ready72 Wireframes v0.6 — Adds Scene 4 (Decision Loop, 4-hour ticks)
--------------------------------------------------------------------
This package extends the live wireframes with the Decision Loop screen.
- Deterministic hazards via a seeded RNG (default seed 42)
- Actions: Move (easy/normal/fast), Rest, Ration, Divert
- Real-time updates: time, distance, hydration, calories, morale
- Event Log with HazAssist-styled notes
- Flow: Intro → Persona → Briefing → Store → Decision

Files:
- Ready72WireframesV060.tsx  (Scenes 0–4)
- App.tsx                    (mounts v0.6 as live app)

Apply (GitHub web UI):
1) In your repo, open /src/
2) Upload both files (overwrite App.tsx)
3) Commit to main
4) Verify at https://beta.gobagready72.com/

Rollback:
- Revert App.tsx from history or restore previous App.tsx
- You may keep Ready72WireframesV060.tsx for future iterations