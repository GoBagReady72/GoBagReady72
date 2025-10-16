
// src/koe/regions.winter.ts
import type { KOE, Region } from './types';

// KOE 1: Winter Storm — Early Warning
const KOE_WS_ALERT: KOE = {
  id: 'ws-alert',
  name: 'Winter Storm Warning — 24h Out',
  summary: 'Major snow + ice expected within 24 hours. Power loss likely; roads may become impassable.',
  kickoffEffects: { morale: -2, roadAccess: -1, airQuality: 0 },
  timeline: [
    {
      id: 'prep_supplies',
      atMinutes: 30,
      description: 'Last chance to top off supplies.',
      branches: [
        {
          id: 'water_food_ready',
          description: 'You already staged water and high-calorie food.',
          condition: {
            requiresAll: [
              { category: 'WATER', itemId: 'bottled_water', qty: 4 },
              { category: 'FOOD', itemId: '2400kcal_bar', qty: 2 },
            ],
          },
          effects: { hydration: +10, calories: +600, morale: +3, timeMinutes: 20 },
        },
      ],
      fallback: {
        id: 'late_store',
        description: 'Stores are crowded; shelves thin.',
        effects: { timeMinutes: 90, morale: -4 },
      },
    },
    {
      id: 'heat_backup',
      atMinutes: 120,
      description: 'Prepare backup heat and light sources.',
      branches: [
        {
          id: 'heater_kit',
          description: 'You set up safe alternate heat and lighting.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'propane_heater', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
            ],
          },
          effects: { morale: +5, calories: +100 },
        },
      ],
      fallback: {
        id: 'no_backup',
        description: 'You rely on blankets and body heat.',
        effects: { morale: -5 },
      },
    },
    {
      id: 'vehicle',
      atMinutes: 240,
      description: 'Vehicle winterization before temps plunge.',
      branches: [
        {
          id: 'chains_shovel',
          description: 'Tire chains and shovel loaded; windshield fluid topped.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'tire_chains', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'shovel', qty: 1 },
            ],
          },
          effects: { roadAccess: +1, morale: +2 },
        },
      ],
      fallback: {
        id: 'underprepared_vehicle',
        description: 'Vehicle skids become more likely; egress risky.',
        effects: { roadAccess: -1, morale: -2 },
      },
    },
  ],
};

// KOE 2: Shelter-in-Place — Power Outage
const KOE_WS_OUTAGE: KOE = {
  id: 'ws-outage',
  name: 'Power Outage in Freezing Temps',
  summary: 'Grid goes down during sub-freezing temps; indoor temps dropping.',
  kickoffEffects: { morale: -4, cellService: -1 },
  timeline: [
    {
      id: 'insulate',
      atMinutes: 15,
      description: 'You need to conserve heat.',
      branches: [
        {
          id: 'window_cover',
          description: 'Reflectix/blankets over windows; interior tenting.',
          condition: {
            requiresAll: [
              { category: 'CLOTHING', itemId: 'wool_blanket', qty: 1 },
              { category: 'SHELTER', itemId: 'tarp', qty: 1 },
            ],
          },
          effects: { morale: +4 },
        },
      ],
      fallback: {
        id: 'heat_loss',
        description: 'Heat loss accelerates; morale dips.',
        effects: { morale: -6 },
      },
    },
    {
      id: 'hot_fluids',
      atMinutes: 120,
      description: 'Hot fluids can stabilize core temp.',
      branches: [
        {
          id: 'stove_kit',
          description: 'You heat water with a safe camping stove.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'camp_stove', qty: 1 },
              { category: 'WATER', itemId: 'bottled_water', qty: 2 },
            ],
          },
          effects: { hydration: +10, morale: +4 },
        },
      ],
      fallback: {
        id: 'no_hot_drinks',
        description: 'Cold stress increases; decision quality drops.',
        effects: { hydration: -5, morale: -5 },
      },
    },
    {
      id: 'comms',
      atMinutes: 300,
      description: 'You need status updates and coordination.',
      branches: [
        {
          id: 'radio_power',
          description: 'Hand-crank radio + battery bank keep you informed.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
              { category: 'COMMS_NAV', itemId: 'radio', qty: 1 },
            ],
          },
          effects: { morale: +3, cellService: +1 },
        },
      ],
      fallback: {
        id: 'in_the_dark',
        description: 'No updates; uncertainty increases stress.',
        effects: { morale: -4 },
      },
    },
  ],
};

// KOE 3: Stranded Vehicle — Whiteout
const KOE_WS_STRANDED: KOE = {
  id: 'ws-stranded',
  name: 'Vehicle Stranded in Whiteout',
  summary: 'Whiteout forces you to stop; visibility near zero; risk of hypothermia.',
  kickoffEffects: { morale: -6, roadAccess: -1, airQuality: 0 },
  timeline: [
    {
      id: 'stay_or_go',
      atMinutes: 5,
      description: 'Stay with vehicle and signal, or attempt foot egress?',
      branches: [
        {
          id: 'stay_signal',
          description: 'You stay, run engine intermittently, and signal with high-vis + light.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
              { category: 'SUSTAINABILITY', itemId: 'battery_bank', qty: 1 },
            ],
          },
          effects: { morale: +3, calories: +100 },
        },
      ],
      fallback: {
        id: 'wander',
        description: 'You attempt to walk; wind chill crushes morale and energy.',
        effects: { morale: -10, calories: -400 },
      },
    },
    {
      id: 'heat_kit',
      atMinutes: 60,
      description: 'Deploy cold-weather kit.',
      branches: [
        {
          id: 'cold_kit',
          description: 'Wool blanket + insulation layer + hot drink stabilize you.',
          condition: {
            requiresAll: [
              { category: 'CLOTHING', itemId: 'wool_blanket', qty: 1 },
              { category: 'CLOTHING', itemId: 'insulation_layer', qty: 1 },
            ],
          },
          effects: { morale: +6, calories: +100 },
        },
      ],
      fallback: {
        id: 'shiver',
        description: 'Shivering continues; dexterity drops.',
        effects: { morale: -8, calories: -200 },
      },
    },
    {
      id: 'rescue',
      atMinutes: 180,
      description: 'Rescue convoy passes by.',
      branches: [
        {
          id: 'visible',
          description: 'Your signals and patience pay off.',
          condition: {
            requiresAll: [
              { category: 'SUSTAINABILITY', itemId: 'headlamp', qty: 1 },
            ],
          },
          effects: { morale: +8 },
          outcome: 'win',
        },
      ],
      fallback: {
        id: 'missed',
        description: 'You are not visible in time; you must endure overnight.',
        effects: { morale: -8, calories: -300 },
        outcome: 'loss',
      },
    },
  ],
};

export const RegionWinter: Region = {
  id: 'winter',
  name: 'Winter Storm (Ice / Outage)',
  hazards: ['Heavy Snow', 'Ice', 'Power Outage', 'Road Closure'],
  koeOptions: [KOE_WS_ALERT, KOE_WS_OUTAGE, KOE_WS_STRANDED],
};
