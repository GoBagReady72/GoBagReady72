import { useMemo, useState } from 'react';
import { runKOE } from './engine';
import { RegionCoastal } from './regions.coastal';
import type { SimState } from './types';

export function useKOE() {
  const [state, setState] = useState<SimState | null>(null);

  const initial: SimState = useMemo(() => ({
    minute: 0,
    hydration: 60,
    calories: 1800,
    morale: 60,
    roadAccess: 0,
    cellService: 0,
    airQuality: 0,
    encumbrance: 0,
    inventory: [
      { id: 'water_filter', category: 'WATER', qty: 1 },
      { id: 'tarp', category: 'SHELTER', qty: 1 },
      { id: 'insulation_layer', category: 'CLOTHING', qty: 1 },
      { id: 'offline_maps', category: 'COMMS_NAV', qty: 1 },
      { id: 'fuel_can', category: 'SUSTAINABILITY', qty: 1 },
      { id: 'bottled_water', category: 'WATER', qty: 2 },
      { id: '2400kcal_bar', category: 'FOOD', qty: 1 },
    ],
    log: [],
  }), []);

  function run(koeId: 'early-evac' | 'shelter-in-place' | 'late-evac', seed = 42) {
    const result = runKOE(RegionCoastal, koeId, initial, { seed, maxMinutes: 8 * 60 });
    setState(result);
    return result;
  }

  return { run, state, region: RegionCoastal };
}
