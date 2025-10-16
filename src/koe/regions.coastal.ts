import type { KOE, Region } from './types';

const KOE_EARLY_EVAC: KOE = {
  id: 'early-evac',
  name: 'Mandatory Evacuation Issued',
  summary: 'Traffic building; fuel and lodging scarce. You must clear a flood zone within 6 hours.',
  kickoffEffects: { timeMinutes: 5, morale: -5, roadAccess: -1 },
  timeline: [
    {
      id: 'gas',
      atMinutes: 30,
      description: 'You reach a gas station with a 1-hr line.',
      branches: [
        {
          id: 'has_fuel',
          description: 'You skip the line using your reserve fuel.',
          condition: { requiresAll: [{ category: 'SUSTAINABILITY', itemId: 'fuel_can', qty: 1 }] },
          effects: { timeMinutes: 5, morale: +5, roadAccess: +1 },
        },
        {
          id: 'no_fuel_wait',
          description: 'You wait 60 minutes and buy limited fuel.',
          effects: { timeMinutes: 60, morale: -5, roadAccess: 0 },
        },
      ],
    },
    {
      id: 'bridge',
      atMinutes: 120,
      description: 'Primary bridge is closed; backroads available.',
      branches: [
        {
          id: 'has_nav',
          description: 'Offline maps get you around closures.',
          condition: { requiresAll: [{ category: 'COMMS_NAV', itemId: 'offline_maps', qty: 1 }] },
          effects: { timeMinutes: 20, morale: +3, roadAccess: +1 },
        },
      ],
      fallback: {
        id: 'no_nav_delay',
        description: 'You lose 90 minutes rerouting.',
        effects: { timeMinutes: 90, morale: -8, roadAccess: -1 },
      },
    },
    {
      id: 'dry_lodging',
      atMinutes: 300,
      description: 'You arrive near high ground; shelters are crowded.',
      branches: [
        {
          id: 'has_shelter',
          description: 'You bivy safely with tarp + sleeping kit.',
          condition: {
            requiresAll: [
              { category: 'SHELTER', itemId: 'tarp', qty: 1 },
              { category: 'CLOTHING', itemId: 'insulation_layer', qty: 1 },
            ],
          },
          effects: { morale: +7 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'no_shelter',
        description: 'You stay in car; poor sleep, damp.',
        effects: { morale: -12, hydration: -10, calories: -300, airQuality: -1 },
        outcome: 'neutral',
      },
    },
  ],
};

const KOE_SHELTER_IN_PLACE: KOE = {
  id: 'shelter-in-place',
  name: 'Shelter-in-Place Advisory',
  summary: 'Power may fail for 48–72 hours; roads may be flooded.',
  kickoffEffects: { morale: -3, cellService: -1 },
  timeline: [
    {
      id: 'water',
      atMinutes: 20,
      description: 'Tap water becomes unsafe without boiling.',
      branches: [
        {
          id: 'has_filter',
          description: 'You filter and store 6 liters.',
          condition: { requiresAll: [{ category: 'WATER', itemId: 'water_filter', qty: 1 }] },
          effects: { hydration: +20, timeMinutes: 30, morale: +2 },
        },
      ],
      fallback: {
        id: 'no_filter',
        description: 'Risk dehydration or GI illness.',
        effects: { hydration: -15, morale: -5 },
      },
    },
    {
      id: 'power_out',
      atMinutes: 120,
      description: 'Power goes out; fridge warming.',
      branches: [
        {
          id: 'has_cooler_ice',
          description: 'You ice perishables; avoid spoilage.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'cooler', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'ice_blocks', qty: 2 },
            ],
          },
          effects: { calories: +300, morale: +3 },
        },
      ],
      fallback: {
        id: 'spoilage',
        description: 'Food spoils; caloric deficit sets in.',
        effects: { calories: -600, morale: -6 },
      },
    },
    {
      id: 'sanitation',
      atMinutes: 360,
      description: 'Toilet can’t flush; sanitation problem.',
      branches: [
        {
          id: 'has_bucket_liner',
          description: 'You set up bucket toilet w/ liners & bleach.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'bleach', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'toilet_liners', qty: 4 },
            ],
          },
          effects: { morale: +4 },
        },
      ],
      fallback: {
        id: 'no_sanitation',
        description: 'Unsanitary conditions erode morale & health.',
        effects: { morale: -10, calories: -200 },
      },
    },
  ],
};

const KOE_LATE_EVAC: KOE = {
  id: 'late-evac',
  name: 'Late Evacuation Attempt During Storm',
  summary: 'Wind and surge are rising; windows breaking nearby. You have 90 minutes to relocate to a hardened structure.',
  kickoffEffects: { morale: -8, roadAccess: -1, airQuality: -1 },
  timeline: [
    {
      id: 'egress',
      atMinutes: 10,
      description: 'Street flooding is knee-deep at corners.',
      branches: [
        {
          id: 'has_boots',
          description: 'You wade safely using waterproof boots.',
          condition: { requiresAll: [{ category: 'CLOTHING', itemId: 'waterproof_boots', qty: 1 }] },
          effects: { timeMinutes: 10, morale: +2 },
        },
      ],
      fallback: {
        id: 'no_boots',
        description: 'You soak clothing; risk hypothermia.',
        effects: { morale: -6, calories: -200 },
      },
    },
    {
      id: 'debris',
      atMinutes: 40,
      description: 'Downed lines & debris block path.',
      branches: [
        {
          id: 'has_gloves_goggles',
          description: 'You clear a path w/ gloves & goggles.',
          condition: {
            requiresAll: [
              { category: 'HEALTH', itemId: 'work_gloves', qty: 1 },
              { category: 'HEALTH', itemId: 'goggles', qty: 1 },
            ],
          },
          effects: { timeMinutes: 15, morale: +2, roadAccess: +1 },
        },
      ],
      fallback: {
        id: 'injury_risk',
        description: 'You cut your hand; lose time.',
        effects: { timeMinutes: 30, morale: -8 },
      },
    },
    {
      id: 'structure',
      atMinutes: 85,
      description: 'You reach a concrete stairwell high above surge.',
      branches: [
        {
          id: 'has_shelter_kit',
          description: 'You secure a dry, safe corner; distribute calories and water.',
          condition: {
            requiresAll: [
              { category: 'SHELTER', itemId: 'tarp', qty: 1 },
              { category: 'FOOD', itemId: '2400kcal_bar', qty: 1 },
              { category: 'WATER', itemId: 'bottled_water', qty: 2 },
            ],
          },
          effects: { morale: +8, calories: +400, hydration: +15 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'exposed',
        description: 'You shelter near a window; glass risk; poor rest.',
        effects: { morale: -12, hydration: -10, calories: -300 },
        outcome: 'loss',
      },
    },
  ],
};

export const RegionCoastal: Region = {
  id: 'coastal',
  name: 'Coastal (Hurricane/Storm Surge)',
  hazards: ['Hurricane', 'Storm Surge', 'Flooding', 'Power Outage'],
  koeOptions: [KOE_EARLY_EVAC, KOE_SHELTER_IN_PLACE, KOE_LATE_EVAC],
};
