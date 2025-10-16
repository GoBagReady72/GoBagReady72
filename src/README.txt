Ready72 Wireframes v0.7 — Adds Scene 5 (Debrief)
------------------------------------------------
This package completes the first playable loop:
Intro → Persona → Briefing → Store → Decision → Debrief

Debrief features:
- Outcome badge (WIN/LOSS)
- MSS Report Card by category (Water, Food, Shelter, Health, Comms, Sustainability, Special)
- Average MSS %, heuristic FRS outcome (Thrived/Recovered/Survived/At risk)
- Key Events excerpt from the Decision loop
- Reflection prompts and CTAs (Play again / Open HazAssist Dashboard placeholder)

Files:
- Ready72WireframesV070.tsx  (Scenes 0–5)
- App.tsx                    (mounts v0.7 as live app)

Apply (GitHub web UI):
1) In your repo, open /src/
2) Upload both files (overwrite App.tsx)
3) Commit to main
4) Verify at https://beta.gobagready72.com/

Note:
If older wireframe files remain in /src/ (e.g., V042), delete or move them out of /src/
to avoid TypeScript build errors.