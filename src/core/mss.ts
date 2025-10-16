
// MSS compliance logic & weight/efficiency scoring
import type { InventoryItem } from '../koe/types';

export type MSSCategory =
  | 'WATER' | 'FOOD' | 'CLOTHING' | 'SHELTER'
  | 'COMMS_NAV' | 'HEALTH' | 'SUSTAINABILITY' | 'SPECIAL';

export const CATEGORY_WEIGHTS: Record<MSSCategory, number> = {
  WATER: 0.22,
  FOOD: 0.20,
  CLOTHING: 0.10,
  SHELTER: 0.10,
  COMMS_NAV: 0.10,
  HEALTH: 0.12,
  SUSTAINABILITY: 0.12,
  SPECIAL: 0.04,
};

// very lightweight weight-estimates (kg) per item id
export const ITEM_WEIGHT_KG: Record<string, number> = {
  water_filter: 0.25,
  bottled_water: 1.0, // per unit
  '2400kcal_bar': 0.5,
  insulation_layer: 0.8,
  waterproof_boots: 1.2,
  wool_blanket: 1.4,
  tarp: 0.6,
  offline_maps: 0.0,
  radio: 0.4,
  work_gloves: 0.2,
  goggles: 0.15,
  respirator: 0.1,
  bleach: 0.5,
  fuel_can: 2.5,
  cooler: 3.0,
  ice_blocks: 1.0,
  toilet_liners: 0.2,
  headlamp: 0.1,
  battery_bank: 0.4,
  propane_heater: 3.5,
  tire_chains: 5.0,
  shovel: 1.5,
  camp_stove: 0.7,
  go_bag: 1.0,
  box_fan: 2.8,
  furnace_filters: 0.3,
};

export interface ComplianceResult {
  mssPercent: number;    // 0..100
  weightKg: number;
  efficiency: number;    // 0..100, penalized for overpacking
}

export function computeWeight(inv: InventoryItem[]): number {
  return inv.reduce((sum, it) => sum + (ITEM_WEIGHT_KG[it.id] || 0) * (it.qty ?? 1), 0);
}

// Simple ratio per category: presence => progress toward 1.0
export function computeCompliance(inv: InventoryItem[]): number {
  // naive: if any item in a category present, give full for now (until per-item targets are defined)
  const present: Record<MSSCategory, boolean> = {
    WATER: false, FOOD: false, CLOTHING: false, SHELTER: false,
    COMMS_NAV: false, HEALTH: false, SUSTAINABILITY: false, SPECIAL: false
  };
  inv.forEach(it => {
    const cat = it.category as MSSCategory;
    if (cat in present) present[cat] = true;
  });
  let score = 0;
  (Object.keys(CATEGORY_WEIGHTS) as MSSCategory[]).forEach(cat => {
    score += present[cat] ? CATEGORY_WEIGHTS[cat] : 0;
  });
  return Math.min(1, Math.max(0, score));
}

export function complianceWithEfficiency(inv: InventoryItem[], bagLimitKg: number): ComplianceResult {
  const base = computeCompliance(inv);
  const weight = computeWeight(inv);
  // Overpacking penalty: linear penalty when exceeding bagLimitKg by up to +50%
  const over = Math.max(0, weight - bagLimitKg);
  const penalty = over <= 0 ? 0 : Math.min(0.25, over / (bagLimitKg * 1.5)) * 0.25; // cap 25% penalty
  const eff = Math.max(0, base * (1 - penalty));
  return {
    mssPercent: Math.round(base * 100),
    weightKg: Math.round(weight * 10) / 10,
    efficiency: Math.round(eff * 100),
  };
}
