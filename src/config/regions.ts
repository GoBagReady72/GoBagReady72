// src/config/regions.ts

export type RegionId = "coastal" | "wildland_urban" | "floodplain" | "winter";

export type HazardMultiplier = {
  water: number;
  food: number;
  shelter: number;
  commsRisk: number;
  injuryRisk: number;
};

export type KickoffEvent = {
  id: string;
  title: string;
  description: string;
};

export type Region = {
  id: RegionId;
  name: string;
  kickoff: KickoffEvent;
  multipliers: HazardMultiplier;
  notes?: string;
};

export const REGIONS: Region[] = [
  {
    id: "coastal",
    name: "Coastal Hurricane",
    kickoff: {
      id: "hurricane_watch",
      title: "Hurricane Watch",
      description: "48–72h to evacuate; fuel/water shortages and road closures likely.",
    },
    multipliers: { water: 1.2, food: 1.0, shelter: 1.5, commsRisk: 1.3, injuryRisk: 1.1 },
    notes: "Shelter integrity and comms reliability are key."
  },
  {
    id: "wildland_urban",
    name: "Wildfire / WUI",
    kickoff: {
      id: "red_flag",
      title: "Red Flag Warning",
      description: "Fast fire spread; smoke/ash; unpredictable road closures.",
    },
    multipliers: { water: 1.1, food: 1.0, shelter: 1.2, commsRisk: 1.4, injuryRisk: 1.2 },
    notes: "Respiratory protection and navigation redundancy matter."
  },
  {
    id: "floodplain",
    name: "Inland Floodplain",
    kickoff: {
      id: "river_crested",
      title: "River Crested",
      description: "Flash-flood risk; contamination; limited egress.",
    },
    multipliers: { water: 1.0, food: 1.1, shelter: 1.3, commsRisk: 1.2, injuryRisk: 1.3 },
    notes: "Water treatment and dry shelter gear prioritized."
  },
  {
    id: "winter",
    name: "Winter / Blizzard",
    kickoff: {
      id: "blizzard_warning",
      title: "Blizzard Warning",
      description: "Sub-zero temps; power loss probable; mobility limited.",
    },
    multipliers: { water: 1.0, food: 1.2, shelter: 1.6, commsRisk: 1.1, injuryRisk: 1.3 },
    notes: "Insulation and heat retention dominate; higher calorie burn."
  }
];

export const REGION_BY_ID: Record<RegionId, Region> = REGIONS.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {} as Record<RegionId, Region>);

export const REGION_IDS: Readonly<RegionId[]> = Object.freeze(REGIONS.map(r => r.id));
