
// src/koe/regions.wildfire.ts
import type { KOE, Region } from './types';

const KOE_WF_EARLY_EVAC: KOE = {
  id: 'wf-early-evac',
  name: 'Wildfire — Early Evacuation',
  summary: 'A fast-moving fire is 15 miles out; evacuation orders are imminent. Grid is stressed; smoke already impacting air quality.',
  kickoffEffects: { timeMinutes: 10, morale: -4, airQuality: -1, roadAccess: -1 },
  timeline: [
    {
      id: 'prep',
      atMinutes: 15,
      description: 'You have 30 minutes to prep the vehicle and household.',
      branches: [
        {
          id: 'go_bag_ready',
          description: 'You grab a pre-packed go-bag and documents.',
          condition: { requiresAll: [{ category: 'SUSTAINABILITY', itemId: 'go_bag', qty: 1 }] },
          effects: { timeMinutes: 10, morale: +4 },
        },
      ],
      fallback: {
        id: 'scramble',
        description: 'You scramble to find essentials; precious time lost.',
        effects: { timeMinutes: 30, morale: -6 },
      },
    },
    {
      id: 'smoke',
      atMinutes: 40,
      description: 'Smoke density increases; visibility deteriorates.',
      branches: [
        {
          id: 'respirator',
          description: 'You wear N95/P100 respirators and eye protection.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'respirator', qty: 1 },
              { category: 'HEALTH', itemId: 'goggles', qty: 1 },
            ],
          },
          effects: { morale: +2, airQuality: +1 },
        },
      ],
      fallback: {
        id: 'no_respirator',
        description: 'Breathing becomes difficult; coughing slows you.',
        effects: { morale: -6, airQuality: -1, timeMinutes: 10 },
      },
    },
    {
      id: 'route',
      atMinutes: 60,
      description: 'Primary highway is closed by CHP; detours available.',
      branches: [
        {
          id: 'offline_fire_maps',
          description: 'Offline maps show a safe detour around closures.',
          condition: { requiresAll: [{ category: 'COMMS_NAV', itemId: 'offline_maps', qty: 1 }] },
          effects: { timeMinutes: 15, morale: +2, roadAccess: +1 },
        },
      ],
      fallback: {
        id: 'stuck',
        description: 'You get stuck in gridlock; time burns while fire advances.',
        effects: { timeMinutes: 60, morale: -8, roadAccess: -1 },
      },
    },
    {
      id: 'arrival',
      atMinutes: 150,
      description: 'You reach a fairgrounds shelter site.',
      branches: [
        {
          id: 'self_sustain',
          description: 'Your headlamp & battery bank keep you functional; rest improves morale.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
            ],
          },
          effects: { morale: +6, hydration: +5, calories: +200 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'low_prepared',
        description: 'You struggle without light/power; poor rest and organization.',
        effects: { morale: -8, hydration: -5, calories: -200 },
        outcome: 'neutral',
      },
    },
  ],
};

const KOE_WF_SIP: KOE = {
  id: 'wf-shelter-in-place',
  name: 'Wildfire Smoke — Shelter-in-Place',
  summary: 'AQI spikes above 300; authorities advise staying indoors and filtering air for 48 hours.',
  kickoffEffects: { morale: -3, airQuality: -1, cellService: 0 },
  timeline: [
    {
      id: 'seal',
      atMinutes: 10,
      description: 'You need to seal a room and reduce particulates.',
      branches: [
        {
          id: 'filter_fans',
          description: 'You make a DIY Corsi–Rosenthal box; AQI improves indoors.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'box_fan', qty: 1 },
              { category: 'HEALTH', itemId: 'furnace_filters', qty: 2 },
            ],
          },
          effects: { airQuality: +1, morale: +3, timeMinutes: 20 },
        },
      ],
      fallback: {
        id: 'no_filters',
        description: 'Particulates remain high; headaches and fatigue.',
        effects: { morale: -6, airQuality: -1 },
      },
    },
    {
      id: 'hydration_food',
      atMinutes: 120,
      description: 'Staying inside increases dehydration/fatigue.',
      branches: [
        {
          id: 'water_food',
          description: 'You maintain fluids and eat high-cal snacks.',
          condition: {
            requiresAll: [
              { category: 'WATER', itemId: 'bottled_water', qty: 2 },
              { category: 'FOOD', itemId: '2400kcal_bar', qty: 1 },
            ],
          },
          effects: { hydration: +10, calories: +300, morale: +2 },
        },
      ],
      fallback: {
        id: 'drag',
        description: 'You under-hydrate and skip meals; cognition drops.',
        effects: { hydration: -10, calories: -300, morale: -4 },
      },
    },
    {
      id: 'sleep',
      atMinutes: 360,
      description: 'Sleep quality matters with bad air.',
      branches: [
        {
          id: 'blanket',
          description: 'Wool blanket and eye mask help you rest despite fans.',
          condition: { requiresAll: [{ category: 'CLOTHING', itemId: 'wool_blanket', qty: 1 }] },
          effects: { morale: +5, calories: +100 },
        },
      ],
      fallback: {
        id: 'poor_sleep',
        description: 'Poor sleep compounds fatigue and irritability.',
        effects: { morale: -6 },
      },
    },
  ],
};

const KOE_WF_EMBERS: KOE = {
  id: 'wf-embers',
  name: 'Wind Shift — Ember Shower',
  summary: 'Wind shifts send embers across your route; you have minutes to protect yourself and the vehicle.',
  kickoffEffects: { morale: -6, airQuality: -1 },
  timeline: [
    {
      id: 'ppe',
      atMinutes: 5,
      description: 'Sparks in the air; eye and respiratory protection needed.',
      branches: [
        {
          id: 'ppe_ready',
          description: 'You don PPE (respirator + goggles) and close vents; proceed carefully.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'respirator', qty: 1 },
              { category: 'HEALTH', itemId: 'goggles', qty: 1 },
            ],
          },
          effects: { morale: +3, airQuality: +1, timeMinutes: 5 },
        },
      ],
      fallback: {
        id: 'unprotected',
        description: 'Eyes and lungs burn; you hesitate and lose time.',
        effects: { morale: -8, airQuality: -1, timeMinutes: 20 },
      },
    },
    {
      id: 'navigation',
      atMinutes: 30,
      description: 'Your primary route is threatened.',
      branches: [
        {
          id: 'maps',
          description: 'Offline maps direct you to a safer corridor.',
          condition: { requiresAll: [{ category: 'COMMS_NAV', itemId: 'offline_maps', qty: 1 }] },
          effects: { roadAccess: +1, timeMinutes: 10 },
        },
      ],
      fallback: {
        id: 'delay',
        description: 'You double back in confusion.',
        effects: { roadAccess: -1, timeMinutes: 40, morale: -5 },
      },
    },
    {
      id: 'regroup',
      atMinutes: 80,
      description: 'You regroup at a community center.',
      branches: [
        {
          id: 'light_power',
          description: 'Headlamp + battery bank help organize and rest.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
            ],
          },
          effects: { morale: +6, hydration: +5, calories: +200 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'disorganized',
        description: 'In the dark, you misplace items and miss briefings.',
        effects: { morale: -7, hydration: -5 },
        outcome: 'loss',
      },
    },
  ],
};

export const RegionWildfire: Region = {
  id: 'wildfire',
  name: 'Wildfire (Smoke / Evacuation)',
  hazards: ['Wildfire', 'Smoke', 'Road Closures', 'Power Disruptions'],
  koeOptions: [KOE_WF_EARLY_EVAC, KOE_WF_SIP, KOE_WF_EMBERS],
};
