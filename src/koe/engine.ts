
// src/koe/engine.ts — v0.8.1 (Canon Engine Hooks)
// Backward-compatible drop-in replacing older engine.
// Adds persona-aware hooks: encumbrance → time & morale cost; stamina buffering.

/* Expected minimal types (kept loose for compatibility) */
export type SimState = {
  minute: number;
  hydration: number;
  calories: number;
  morale: number;
  roadAccess: number;
  cellService: number;
  airQuality: number;
  encumbrance?: number;     // 0..n (0 = light; >0 = heavy); optional
  inventory: Array<{ id: string; category: string; qty?: number }>;
  log: string[];
  outcome?: 'win' | 'loss' | 'neutral';
};

type BranchCond = {
  requiresAll?: Array<{ category: string; itemId: string; qty?: number }>;
};

type Effect = {
  timeMinutes?: number;
  hydration?: number;
  calories?: number;
  morale?: number;
  roadAccess?: number;
  cellService?: number;
  airQuality?: number;
};

type TimelineNode = {
  id: string;
  atMinutes: number;
  description: string;
  branches?: Array<{
    id: string;
    description: string;
    condition?: BranchCond;
    effects?: Effect;
    outcome?: 'win' | 'loss' | 'neutral';
  }>;
  fallback?: {
    id: string;
    description: string;
    effects?: Effect;
    outcome?: 'win' | 'loss' | 'neutral';
  };
};

type KOE = {
  id: string;
  name: string;
  summary: string;
  kickoffEffects?: Effect;
  timeline: TimelineNode[];
};

type Region = {
  id: string;
  name: string;
  hazards: string[];
  koeOptions: KOE[];
};

type RunOpts = { seed?: number; maxMinutes?: number };

/* Deterministic RNG (mulberry32) */
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Inventory helpers */
function hasAll(inv: SimState['inventory'], requires?: BranchCond['requiresAll']): boolean {
  if (!requires || !requires.length) return true;
  for (const need of requires) {
    const got = inv.find(i => i.category === need.category && i.id === need.itemId);
    const qty = got?.qty ?? 0;
    if (!got || qty < (need.qty ?? 1)) return false;
  }
  return true;
}

/* Clamp utility */
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

/* Apply effects with persona-aware hooks */
function applyEffects(s: SimState, eff?: Effect, persona: { encFactor: number; stam: number }) {
  if (!eff) return;

  // Time cost: heavier packs (encFactor > 0) increase time; stamina offsets.
  const baseTime = eff.timeMinutes ?? 0;
  const timeMult = 1 + persona.encFactor;          // e.g., enc 2 => +2*X
  const stamMult = 1 / Math.max(0.5, persona.stam); // higher stamina reduces time
  const dt = Math.round(baseTime * timeMult * stamMult);

  s.minute += dt;

  // Resource drains per minute of elapsed time (simple, tunable)
  const hours = dt / 60;
  const fatigue = persona.encFactor * hours;        // morale drain from weight over time
  s.hydration -= Math.round(2 * hours * (1 + persona.encFactor * 0.5));
  s.calories  -= Math.round(120 * hours * (1 + persona.encFactor * 0.3));
  s.morale    -= Math.round(fatigue);

  // Direct stat effects
  if (eff.hydration) s.hydration += eff.hydration;
  if (eff.calories)  s.calories  += eff.calories;
  if (eff.morale)    s.morale    += eff.morale;
  if (eff.roadAccess) s.roadAccess += eff.roadAccess;
  if (eff.cellService) s.cellService += eff.cellService;
  if (eff.airQuality) s.airQuality += eff.airQuality;

  // Clamp
  s.hydration = clamp(s.hydration, 0, 100);
  // calories allowed to go negative to represent deficit; cap upper bound
  s.calories = Math.min(s.calories, 4000);
  s.morale = clamp(s.morale, 0, 100);
  s.roadAccess = clamp(s.roadAccess, -2, 3);
  s.cellService = clamp(s.cellService, -2, 3);
  s.airQuality = clamp(s.airQuality, -3, 3);
}

/* Main runner */
export function runKOE(region: Region, koeId: string, initial: SimState, opts: RunOpts = {}): SimState {
  const rng = mulberry32((opts.seed ?? 42) | 0);
  const maxMinutes = opts.maxMinutes ?? 8 * 60;

  const s: SimState = JSON.parse(JSON.stringify(initial));
  const enc = Math.max(0, (s.encumbrance ?? 0));     // higher => heavier
  const persona = {
    encFactor: enc * 0.05,   // each encumbrance point adds 5% time & fatigue
    stam: 1.0,               // optional: override via (initial as any).staminaBase
  };
  const maybeStam = (initial as any).staminaBase;
  if (typeof maybeStam === 'number' && isFinite(maybeStam) && maybeStam > 0) persona.stam = maybeStam;

  const koe = region.koeOptions.find(k => k.id === koeId);
  if (!koe) {
    s.log.push(`KOE not found: ${koeId}`);
    s.outcome = 'loss';
    return s;
  }

  // Kickoff
  s.log.push(`KOE: ${koe.name} — ${koe.summary}`);
  applyEffects(s, koe.kickoffEffects, persona);

  // Timeline (ordered by atMinutes)
  const nodes = [...koe.timeline].sort((a, b) => a.atMinutes - b.atMinutes);
  for (const node of nodes) {
    if (s.minute >= maxMinutes) break;

    // Advance to node time (affected by encumbrance as movement / setup)
    if (node.atMinutes > s.minute) {
      const travelEff: Effect = { timeMinutes: node.atMinutes - s.minute };
      applyEffects(s, travelEff, persona);
    }

    s.log.push(`${fmtTime(s.minute)}: ${node.description}`);

    // Pick first satisfied branch; else fallback
    let appliedOutcome: 'win' | 'loss' | 'neutral' | undefined;
    const branches = node.branches || [];
    let picked = null as null | typeof branches[number];
    for (const b of branches) {
      if (hasAll(s.inventory, b.condition?.requiresAll)) { picked = b; break; }
    }
    if (picked) {
      s.log.push(`→ ${picked.description}`);
      applyEffects(s, picked.effects, persona);
      appliedOutcome = picked.outcome;
    } else if (node.fallback) {
      s.log.push(`→ ${node.fallback.description}`);
      applyEffects(s, node.fallback.effects, persona);
      appliedOutcome = node.fallback.outcome;
    }

    if (appliedOutcome) s.outcome = appliedOutcome;
    if (s.minute >= maxMinutes) break;
  }

  // Outcome resolution: if none set by branches, infer from core stats
  if (!s.outcome) {
    const ok = s.hydration >= 30 && s.morale >= 40;
    s.outcome = ok ? 'neutral' : 'loss';
  }

  // Hard stop at max time horizon
  s.minute = Math.min(s.minute, maxMinutes);

  // Final summary line
  s.log.push(`Outcome: ${String(s.outcome).toUpperCase()}`);
  return s;
}

function fmtTime(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `t+${h ? h + 'h' : ''}${h && m ? ' ' : ''}${m ? m + 'm' : ''}`.replace(/t\+$/, 't+0m');
}
