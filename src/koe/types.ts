export type MSSCategory =
  | 'WATER'
  | 'FOOD'
  | 'CLOTHING'
  | 'SHELTER'
  | 'COMMS_NAV'
  | 'HEALTH'
  | 'SUSTAINABILITY'
  | 'SPECIAL';

export type Outcome = 'win' | 'loss' | 'neutral';

export interface Requirement {
  category: MSSCategory;
  itemId?: string;
  qty?: number;
}

export interface EffectDelta {
  hydration?: number;
  calories?: number;
  morale?: number;
  timeMinutes?: number;
  encumbrance?: number;
  roadAccess?: -1 | 0 | 1;
  cellService?: -1 | 0 | 1;
  airQuality?: -1 | 0 | 1;
}

export interface BranchCondition {
  requiresAll?: Requirement[];
  requiresAny?: Requirement[];
  probability?: number; // 0..1
}

export interface Branch {
  id: string;
  description: string;
  condition?: BranchCondition;
  effects?: EffectDelta;
  nextEventId?: string;
  outcome?: Outcome;
}

export interface TimedEvent {
  id: string;
  atMinutes: number;
  description: string;
  branches?: Branch[];
  fallback?: Branch;
}

export interface KOE {
  id: string;
  name: string;
  summary: string;
  kickoffEffects?: EffectDelta;
  timeline: TimedEvent[];
}

export interface Region {
  id: string;
  name: string;
  hazards: string[];
  koeOptions: KOE[];
}

export interface InventoryItem {
  id: string;
  category: MSSCategory;
  qty: number;
}

export interface SimState {
  minute: number;
  hydration: number;
  calories: number;
  morale: number;
  roadAccess: number;
  cellService: number;
  airQuality: number;
  encumbrance: number;
  inventory: InventoryItem[];
  log: string[];
  outcome?: Outcome;
}
