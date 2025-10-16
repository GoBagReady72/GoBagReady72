
// Prep-phase scaffolding
import type { Archetype } from './personas';

export const PREP_PHASE_DEFAULT = true; // toggle at scenario start

export function startingFundsFor(archetype: Archetype): number {
  switch (archetype) {
    case 'EC': return 300;
    case 'PR': return 120;
    case 'PRO': return 80;
  }
}
