// src/koe/engine.ts — v0.8.1a (Canon Engine Hooks, type-safe with existing types)
// NOTE: We intentionally export ONLY runKOE to avoid type name collisions with src/koe/types.
// This file uses minimal 'any' typing to stay compatible with your Region/KOE/SimState shapes.

type Effect = {
  timeMinutes?: number;
  hydration?: number;
  calories?: number;
  morale?: number;
  roadAccess?: number;
  cellService?: number;
  airQuality?: number;
};

// ---------- utils ----------
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

function fmtTime(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `t+${h ? h + 'h' : ''}${h && m ? ' ' : ''}${m ? m + 'm' : ''}`.replace(/t\+$/, 't+0m');
}

// Deterministic RNG (mulberry32)
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Inventory requirement check.
// Supports requiresAll entries where itemId may be omitted (meaning "any item in category").
function hasAll(inv: any[], requires?: Array<{ category: string; itemId?: string; qty?: number }>): boolean {
  if (!requires || !requires.length) return true;
  for (const need of requires) {
    const matches = inv.filter(i => i?.category === need.category && (need.itemId ? i?.id === need.itemId : true));
    const totalQty = matches.reduce((s, it) => s + (it?.qty ?? 0), 0);
    const needed = need.qty ?? 1;
    if (totalQty < needed) return false;
  }
  return true;
}

// Apply effects with persona-aware hooks (encumbrance & stamina)
function applyEffects(s: any, eff: Effect | undefined, persona: { encFactor: number; stam: number }) {
  if (!eff) return;

  const baseTime = eff.timeMinutes ?? 0;
  const timeMult = 1 + persona.encFactor;             // heavier -> slower
  const stamMult = 1 / Math.max(0.5, persona.stam);   // fitter -> faster
  const dt = Math.round(baseTime * timeMult * stamMult);

  s.minute += dt;

  // Drains proportional to elapsed time and weight burden
  const hours = dt / 60;
  const fatigue = persona.encFactor * hours;
  s.hydration -= Math.round(2 * hours * (1 + persona.encFactor * 0.5));
  s.calories  -= Math.round(120 * hours * (1 + persona.encFactor * 0.3));
  s.morale    -= Math.round(fatigue);

  if (eff.hydration) s.hydration += eff.hydration;
  if (eff.calories)  s.calories  += eff.calories;
  if (eff.morale)    s.morale    += eff.morale;
  if (eff.roadAccess) s.roadAccess += eff.roadAccess;
  if (eff.cellService) s.cellService += eff.cellService;
  if (eff.airQuality) s.airQuality += eff.airQuality;

  s.hydration = clamp(s.hydration, 0, 100);
  s.calories = Math.min(s.calories, 4000);
  s.morale = clamp(s.morale, 0, 100);
  s.roadAccess = clamp(s.roadAccess, -2, 3);
  s.cellService = clamp(s.cellService, -2, 3);
  s.airQuality = clamp(s.airQuality, -3, 3);
}

// ---------- main ----------
export function runKOE(region: any, koeId: string, initial: any, opts: { seed?: number; maxMinutes?: number } = {}) {
  const rng = mulberry32((opts.seed ?? 42) | 0);
  const maxMinutes = opts.maxMinutes ?? 8 * 60;

  // clone
  const s: any = JSON.parse(JSON.stringify(initial));

  // Ensure encumbrance exists for downstream typing expectations
  if (typeof s.encumbrance !== 'number' || !isFinite(s.encumbrance)) s.encumbrance = 0;

  // Persona hooks
  const enc = Math.max(0, s.encumbrance);
  const persona = {
    encFactor: enc * 0.05, // each encumbrance point adds ~5% time/fatigue
    stam: 1.0,
  };
  if (typeof s.staminaBase === 'number' && isFinite(s.staminaBase) && s.staminaBase > 0) {
    persona.stam = s.staminaBase;
  }

  // Find KOE by id from region
  const koe = (region?.koeOptions || []).find((k: any) => k?.id === koeId);
  if (!koe) {
    s.log?.push?.(`KOE not found: ${koeId}`);
    s.outcome = 'loss';
    return s;
  }

  // Kickoff
  if (!Array.isArray(s.log)) s.log = [];
  s.log.push(`KOE: ${koe.name} — ${koe.summary}`);
  applyEffects(s, koe.kickoffEffects as Effect | undefined, persona);

  // Timeline (sorted)
  const nodes: any[] = [...(koe.timeline || [])].sort((a, b) => (a.atMinutes ?? 0) - (b.atMinutes ?? 0));
  for (const node of nodes) {
    if (s.minute >= maxMinutes) break;

    // advance (movement/setup cost)
    const targetMin = node.atMinutes ?? s.minute;
    if (targetMin > s.minute) {
      applyEffects(s, { timeMinutes: targetMin - s.minute }, persona);
    }

    s.log.push(`${fmtTime(s.minute)}: ${node.description}`);

    let appliedOutcome: 'win' | 'loss' | 'neutral' | undefined;
    const branches: any[] = node.branches || [];

    // first satisfied branch
    let picked: any = null;
    for (const b of branches) {
      const reqs = b?.condition?.requiresAll as Array<{ category: string; itemId?: string; qty?: number }> | undefined;
      if (hasAll(s.inventory || [], reqs)) { picked = b; break; }
    }

    if (picked) {
      s.log.push(`→ ${picked.description}`);
      applyEffects(s, picked.effects as Effect | undefined, persona);
      appliedOutcome = picked.outcome;
    } else if (node.fallback) {
      s.log.push(`→ ${node.fallback.description}`);
      applyEffects(s, node.fallback.effects as Effect | undefined, persona);
      appliedOutcome = node.fallback.outcome;
    }

    if (appliedOutcome) s.outcome = appliedOutcome;
    if (s.minute >= maxMinutes) break;
  }

  if (!s.outcome) {
    const ok = (s.hydration ?? 0) >= 30 && (s.morale ?? 0) >= 40;
    s.outcome = ok ? 'neutral' : 'loss';
  }

  s.minute = Math.min(s.minute ?? 0, maxMinutes);
  s.log.push(`Outcome: ${String(s.outcome).toUpperCase()}`);

  return s;
}
