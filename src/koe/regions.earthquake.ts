
// src/koe/regions.earthquake.ts
import type { KOE, Region } from './types';

/**
 * Earthquake region focuses on urban building hazards, aftershocks,
 * utility loss, and blocked routes. It intentionally reuses items
 * already present in the inventory UI: respirator, goggles, gloves,
 * headlamp, battery_bank, radio, tarp, bottled_water, 2400kcal_bar, offline_maps.
 */

// KOE 1: Immediate Aftershock — Shelter-in-Place vs. Unsafe Structure
const KOE_EQ_AFTERSHOCK: KOE = {
  id: 'eq-aftershock',
  name: 'Aftershock — Secure or Evacuate',
  summary: 'A strong aftershock hits; dust and broken glass. You must avoid interior collapse hazards.',
  kickoffEffects: { morale: -6, airQuality: -1 },
  timeline: [
    {
      id: 'ppe',
      atMinutes: 2,
      description: 'Dust and glass in the air; vision obscured.',
      branches: [
        {
          id: 'ppe_on',
          description: 'Respirator + goggles on; you move deliberately.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'respirator', qty: 1 },
              { category: 'HEALTH', itemId: 'goggles', qty: 1 },
            ],
          },
          effects: { airQuality: +1, morale: +2, timeMinutes: 3 },
        },
      ],
      fallback: {
        id: 'unprotected',
        description: 'Breathing and visibility worsen decisions.',
        effects: { airQuality: -1, morale: -4, timeMinutes: 10 },
      },
    },
    {
      id: 'egress',
      atMinutes: 15,
      description: 'Stairwell has debris; elevator unsafe.',
      branches: [
        {
          id: 'gloves_headlamp',
          description: 'Gloves + headlamp let you clear and descend safely.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'work_gloves', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
            ],
          },
          effects: { timeMinutes: 10, morale: +3, roadAccess: +1 },
        },
      ],
      fallback: {
        id: 'slow_descent',
        description: 'You inch along in the dark; minor cuts, big delay.',
        effects: { timeMinutes: 35, morale: -6 },
      },
    },
    {
      id: 'assembly_area',
      atMinutes: 45,
      description: 'You reach an outdoor assembly area.',
      branches: [
        {
          id: 'water_food',
          description: 'You hydrate and eat; stabilize energy.',
          condition: {
            requiresAll: [
              { category: 'WATER', itemId: 'bottled_water', qty: 2 },
              { category: 'FOOD', itemId: '2400kcal_bar', qty: 1 },
            ],
          },
          effects: { hydration: +10, calories: +300, morale: +4 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'hungry_thirsty',
        description: 'Fatigue rises without water/food.',
        effects: { hydration: -10, calories: -300, morale: -6 },
        outcome: 'neutral',
      },
    },
  ],
};

// KOE 2: Urban Communications Outage — Information & Coordination
const KOE_EQ_OUTAGE: KOE = {
  id: 'eq-outage',
  name: 'Citywide Outage — Info Gap',
  summary: 'Power and cell networks are patchy; rumors spread. You need reliable updates and coordination.',
  kickoffEffects: { morale: -3, cellService: -1 },
  timeline: [
    {
      id: 'radio_status',
      atMinutes: 20,
      description: 'Local stations broadcast shelter and road updates.',
      branches: [
        {
          id: 'radio_bank',
          description: 'Hand-crank radio + battery bank keep comms going.',
          condition: {
            requiresAll: [
              { category: 'COMMS_NAV', itemId: 'radio', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
            ],
          },
          effects: { morale: +4, cellService: +1 },
        },
      ],
      fallback: {
        id: 'no_updates',
        description: 'No trustworthy info; you miss critical windows.',
        effects: { morale: -6 },
      },
    },
    {
      id: 'shelter',
      atMinutes: 120,
      description: 'Overnight exposure risk; find a safe spot.',
      branches: [
        {
          id: 'tarp_setup',
          description: 'Tarp and blankets make a dry, visible corner.',
          condition: {
            requiresAll: [
              { category: 'SHELTER', itemId: 'tarp', qty: 1 },
              { category: 'CLOTHING', itemId: 'wool_blanket', qty: 1 },
            ],
          },
          effects: { morale: +5, calories: +100 },
        },
      ],
      fallback: {
        id: 'exposed',
        description: 'Cold concrete sleep; aches and fatigue build.',
        effects: { morale: -8, calories: -200 },
      },
    },
    {
      id: 'mutual_aid',
      atMinutes: 300,
      description: 'Neighbors organize mutual aid at a school gym.',
      branches: [
        {
          id: 'light_nav',
          description: 'Headlamp + offline maps speed your contribution.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
              { category: 'COMMS_NAV', itemId: 'offline_maps', qty: 1 },
            ],
          },
          effects: { morale: +6 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'missed_connection',
        description: 'You arrive late and miss critical supplies.',
        effects: { morale: -6 },
        outcome: 'loss',
      },
    },
  ],
};

// KOE 3: Debris-Choked Egress — Route Selection
const KOE_EQ_EGRESS: KOE = {
  id: 'eq-egress',
  name: 'Debris Route — Egress to Relief Hub',
  summary: 'Bridges may be closed; overpasses inspected; debris on arterials.',
  kickoffEffects: { morale: -4, roadAccess: -1 },
  timeline: [
    {
      id: 'route_pick',
      atMinutes: 25,
      description: 'Which corridor? Avoid older overpasses and glass canyons.',
      branches: [
        {
          id: 'offline_maps',
          description: 'Offline maps reveal a surface-street corridor.',
          condition: { requiresAll: [{ category: 'COMMS_NAV', itemId: 'offline_maps', qty: 1 }] },
          effects: { timeMinutes: 15, roadAccess: +1, morale: +2 },
        },
      ],
      fallback: {
        id: 'stalled',
        description: 'You hit closures and double back repeatedly.',
        effects: { timeMinutes: 60, roadAccess: -1, morale: -6 },
      },
    },
    {
      id: 'aid_point',
      atMinutes: 120,
      description: 'You reach a relief hub; triage line long.',
      branches: [
        {
          id: 'hydration_energy',
          description: 'Water and calories keep you functional while waiting.',
          condition: {
            requiresAll: [
              { category: 'WATER', itemId: 'bottled_water', qty: 2 },
              { category: 'FOOD', itemId: '2400kcal_bar', qty: 1 },
            ],
          },
          effects: { hydration: +10, calories: +300, morale: +3 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'fade',
        description: 'Dehydration and hunger erode decisions.',
        effects: { hydration: -10, calories: -300, morale: -6 },
        outcome: 'loss',
      },
    },
  ],
};

export const RegionEarthquake: Region = {
  id: 'earthquake',
  name: 'Urban Earthquake (Aftershock / Outage)',
  hazards: ['Aftershocks', 'Debris', 'Utility Outage', 'Blocked Routes'],
  koeOptions: [KOE_EQ_AFTERSHOCK, KOE_EQ_OUTAGE, KOE_EQ_EGRESS],
};
