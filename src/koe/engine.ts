import type {
  Branch, EffectDelta, InventoryItem, KOE, Region, SimState, TimedEvent, Requirement,
} from './types';

export interface RunOptions {
  seed?: number;
  maxMinutes?: number;
}

function rng(seed: number) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) / 4294967295);
  };
}

function hasRequirement(inv: InventoryItem[], r: Requirement): boolean {
  const items = inv.filter(i => i.category === r.category && (!r.itemId || i.id === r.itemId));
  if (items.length === 0) return false;
  if (r.qty == null) return true;
  const total = items.reduce((s, i) => s + i.qty, 0);
  return total >= (r.qty as number);
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

function applyEffects(state: SimState, eff?: EffectDelta) {
  if (!eff) return;
  state.hydration = clamp(state.hydration + (eff.hydration ?? 0), 0, 100);
  state.calories = clamp(state.calories + (eff.calories ?? 0), 0, 5000);
  state.morale = clamp(state.morale + (eff.morale ?? 0), 0, 100);
  state.encumbrance += eff.encumbrance ?? 0;
  state.roadAccess = clamp(state.roadAccess + (eff.roadAccess ?? 0), -2, 2);
  state.cellService = clamp(state.cellService + (eff.cellService ?? 0), -2, 2);
  state.airQuality = clamp(state.airQuality + (eff.airQuality ?? 0), -2, 2);
  if (eff.timeMinutes) state.minute += eff.timeMinutes;
}

function evalBranches(state: SimState, branches: Branch[] | undefined, rnd: () => number): Branch | undefined {
  if (!branches || branches.length === 0) return;
  for (const b of branches) {
    const c = b.condition;
    if (!c) return b;
    const passAll = (c.requiresAll ?? []).every(r => hasRequirement(state.inventory, r));
    const passAny = (c.requiresAny ? (c.requiresAny.some(r => hasRequirement(state.inventory, r))) : true);
    const p = c.probability ?? 1;
    const luck = rnd();
    if (passAll && passAny && luck <= p) return b;
  }
  return;
}

export function runKOE(region: Region, koeId: string, initial: SimState, opts?: RunOptions): SimState {
  const seed = opts?.seed ?? 12345;
  const rnd = rng(seed);
  const koe = region.koeOptions.find(k => k.id === koeId);
  if (!koe) throw new Error(`KOE not found: ${koeId}`);

  const state: SimState = { ...initial, log: [...(initial.log ?? [])] };
  state.log.push(`KOE: ${koe.name} — ${koe.summary}`);

  applyEffects(state, koe.kickoffEffects);

  const sorted = [...koe.timeline].sort((a, b) => a.atMinutes - b.atMinutes);
  const cap = opts?.maxMinutes ?? 8 * 60;

  for (const e of sorted) {
    if (state.outcome) break;
    if (state.minute < e.atMinutes) state.minute = e.atMinutes;

    const chosen = evalBranches(state, e.branches, rnd) ?? e.fallback;
    if (!chosen) continue;

    state.log.push(`t+${e.atMinutes}m: ${e.description} → ${chosen.description}`);
    applyEffects(state, chosen.effects);

    if (chosen.outcome) {
      state.outcome = chosen.outcome;
      state.log.push(`Outcome: ${chosen.outcome.toUpperCase()}`);
      break;
    }
    if (chosen.nextEventId) {
      const jump = sorted.find(x => x.id === chosen.nextEventId);
      if (jump) state.minute = Math.max(state.minute, jump.atMinutes);
    }
    if (state.minute >= cap) {
      state.log.push(`Time cap reached (${cap}m).`);
      break;
    }
  }

  if (!state.outcome) {
    const okHydration = state.hydration >= 30;
    const okCalories = state.calories >= 1200;
    const okMorale = state.morale >= 25;
    state.outcome = (okHydration && okCalories && okMorale) ? 'win' : 'loss';
    state.log.push(`Auto-evaluated Outcome: ${state.outcome.toUpperCase()}`);
  }

  return state;
}
