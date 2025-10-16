
READY72 — v0.8.1 (Engine Hooks)
-------------------------------
Drop-in replacement for src/koe/engine.ts.

What changes:
  • Applies encumbrance to time & morale automatically:
      time += baseTime * (1 + encumbrance * 0.05)
  • Supports optional staminaBase on initial SimState (KOEPanel can add later).
  • Adds gentle resource drains proportional to elapsed time and weight.
  • Keeps deterministic RNG & existing KOE timeline semantics.

How to install:
  1) Upload & extract this ZIP at repo root.
  2) Let Vercel build, then refresh.

Non-breaking:
  • Signature: runKOE(region, koeId, initial, { seed, maxMinutes })
  • Types: loose and compatible with prior regions.* definitions.
