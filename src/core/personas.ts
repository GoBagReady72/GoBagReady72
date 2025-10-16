// src/core/personas.ts
// Canon personas and visual variants (Ready72 Canon v1)

export type Archetype = 'EC' | 'PR' | 'PRO';

export interface PersonaSpec {
  id: Archetype;
  name: string;
  mssStart: number;      // 0..1
  mssCap: number;        // 0..1
  bagLimitPct: number;   // % of body weight advisable to carry (0..1)
  staminaBase: number;   // baseline endurance multiplier (1.0 = neutral)
  moraleSlope: number;   // negative => slower morale decay (e.g., -0.1)
  kitDurability: number; // 0..1 average condition/maintenance
  startingFunds: number; // prep-phase budget
}

export const PERSONAS: Record<Archetype, PersonaSpec> = {
  EC: {
    id: 'EC',
    name: 'Everyday Civilian',
    mssStart: 0.15,
    mssCap: 0.95,
    bagLimitPct: 0.10,
    staminaBase: 1.0,
    moraleSlope: -0.05,
    kitDurability: 0.2,
    startingFunds: 300,
  },
  PR: {
    id: 'PR',
    name: 'Prepper',
    mssStart: 0.65,         // canon start (≤ 0.70 max)
    mssCap: 0.98,
    bagLimitPct: 0.20,
    staminaBase: 1.15,
    moraleSlope: -0.02,
    kitDurability: 0.8,
    startingFunds: 120,
  },
  PRO: {
    id: 'PRO',
    name: 'Professional Civilian / Instructor',
    mssStart: 0.95,
    mssCap: 1.0,
    bagLimitPct: 0.16,
    staminaBase: 1.1,
    moraleSlope: -0.08,
    kitDurability: 0.95,
    startingFunds: 80,
  },
};

// ---------- Representation Layer (visual skins) ----------

export type Gender = 'male' | 'female';
export type Ethnicity = 'black' | 'white' | 'latino' | 'asian';

export interface VisualSkin {
  id: string;            // e.g., "EC_female_latino"
  archetype: Archetype;
  gender: Gender;
  ethnicity: Ethnicity;
  label: string;         // e.g., "Everyday Civilian — Female / Latino(a)"
}

const genders: Gender[] = ['male', 'female'];
const ethnicities: Ethnicity[] = ['black', 'white', 'latino', 'asian'];

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ethnicityLabel(e: Ethnicity): string {
  return e === 'latino' ? 'Latino(a)' : titleCase(e);
}

function makeLabel(prefix: string, g: Gender, e: Ethnicity): string {
  const gLabel = g === 'male' ? 'Male' : 'Female';
  return `${prefix} — ${gLabel} / ${ethnicityLabel(e)}`;
}

export const VISUALS: VisualSkin[] = [
  ...genders.flatMap((g) =>
    ethnicities.map((e) => ({
      id: `EC_${g}_${e}`,
      archetype: 'EC' as const,
      gender: g,
      ethnicity: e,
      label: makeLabel('Everyday Civilian', g, e),
    }))
  ),
  ...genders.flatMap((g) =>
    ethnicities.map((e) => ({
      id: `PR_${g}_${e}`,
      archetype: 'PR' as const,
      gender: g,
      ethnicity: e,
      label: makeLabel('Prepper', g, e),
    }))
  ),
  ...genders.flatMap((g) =>
    ethnicities.map((e) => ({
      id: `PRO_${g}_${e}`,
      archetype: 'PRO' as const,
      gender: g,
      ethnicity: e,
      label: makeLabel('Instructor', g, e),
    }))
  ),
];
