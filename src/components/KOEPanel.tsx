// src/components/KOEPanel.tsx
import { useMemo, useState } from 'react';
import { runKOE } from '../koe/engine';
import { RegionCoastal } from '../koe/regions.coastal';
import type { InventoryItem, SimState } from '../koe/types';

type KOEId = 'early-evac' | 'shelter-in-place' | 'late-evac';

export default function KOEPanel() {
  // --- Seed & KOE selection
  const [seed, setSeed] = useState<number>(42);
  const [koeId, setKoeId] = useState<KOEId>('early-evac');

  // --- Inventory controls (only items referenced by the Coastal region KOEs)
  const [inv, setInv] = useState({
    water_filter: true,
    bottled_water: 2,        // qty
    kcal_bar_2400: 1,        // qty
    tarp: true,
    insulation_layer: true,
    offline_maps: true,
    fuel_can: true,
    waterproof_boots: false,
    work_gloves: false,
    goggles: false,
    cooler: false,
    ice_blocks: 0,           // qty
    bleach: false,
    toilet_liners: 0,        // qty
  });

  function setBool(key: keyof typeof inv, val: boolean) {
    setInv(prev => ({ ...prev, [key]: val }));
  }
  function setQty(key: keyof typeof inv, val: number) {
    const n = Math.max(0, Math.floor(val || 0));
    setInv(prev => ({ ...prev, [key]: n }));
  }

  // --- Run state
  const [state, setState] = useState<SimState | null>(null);

  // Build SimState from UI each run (keeps single-file change)
  const initial: SimState = useMemo(() => ({
    minute: 0,
    hydration: 60,
    calories: 1800,
    morale: 60,
    roadAccess: 0,
    cellService: 0,
    airQuality: 0,
    encumbrance: 0,
    inventory: buildInventory(inv),
    log: [],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [JSON.stringify(inv)]); // stringify to avoid deep deps complexity

  function onRun() {
    try {
      const result = runKOE(RegionCoastal, koeId, initial, { seed, maxMinutes: 8 * 60 });
      setState(result);
    } catch (e) {
      console.error(e);
      alert('KOE run failed. Check console for details.');
    }
  }

  return (
    <div style={{ padding: 16, border: '1px solid #222', borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>KOE Simulator — {RegionCoastal.name}</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 14 }}>
          KOE:&nbsp;
          <select
            value={koeId}
            onChange={(e) => setKoeId(e.target.value as KOEId)}
            style={{ padding: '4px 6px' }}
          >
            <option value="early-evac">Early Evacuation</option>
            <option value="shelter-in-place">Shelter-in-Place</option>
            <option value="late-evac">Late Evacuation (During Storm)</option>
          </select>
        </label>

        <label style={{ fontSize: 14 }}>
          Seed:&nbsp;
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value || 0))}
            style={{ width: 110, padding: '4px 6px' }}
          />
        </label>

        <button onClick={onRun}>Run</button>
      </div>

      {/* Inventory Editor */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Inventory (MSS-aligned)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          <Group title="WATER">
            <Check label="Water Filter" checked={inv.water_filter} onChange={(v) => setBool('water_filter', v)} />
            <Qty label="Bottled Water (qty)" value={inv.bottled_water} onChange={(n) => setQty('bottled_water', n)} />
          </Group>

          <Group title="FOOD">
            <Qty label="2400 kcal Bars (qty)" value={inv.kcal_bar_2400} onChange={(n) => setQty('kcal_bar_2400', n)} />
          </Group>

          <Group title="CLOTHING">
            <Check label="Insulation Layer" checked={inv.insulation_layer} onChange={(v) => setBool('insulation_layer', v)} />
            <Check label="Waterproof Boots" checked={inv.waterproof_boots} onChange={(v) => setBool('waterproof_boots', v)} />
          </Group>

          <Group title="SHELTER">
            <Check label="Tarp" checked={inv.tarp} onChange={(v) => setBool('tarp', v)} />
          </Group>

          <Group title="COMMS & NAV">
            <Check label="Offline Maps" checked={inv.offline_maps} onChange={(v) => setBool('offline_maps', v)} />
          </Group>

          <Group title="HEALTH">
            <Check label="Work Gloves" checked={inv.work_gloves} onChange={(v) => setBool('work_gloves', v)} />
            <Check label="Goggles" checked={inv.goggles} onChange={(v) => setBool('goggles', v)} />
            <Check label="Bleach" checked={inv.bleach} onChange={(v) => setBool('bleach', v)} />
          </Group>

          <Group title="SUSTAINABILITY">
            <Check label="Fuel Can" checked={inv.fuel_can} onChange={(v) => setBool('fuel_can', v)} />
            <Check label="Cooler" checked={inv.cooler} onChange={(v) => setBool('cooler', v)} />
            <Qty label="Ice Blocks (qty)" value={inv.ice_blocks} onChange={(n) => setQty('ice_blocks', n)} />
            <Qty label="Toilet Liners (qty)" value={inv.toilet_liners} onChange={(n) => setQty('toilet_liners', n)} />
          </Group>
        </div>
      </div>

      {/* HUD */}
      {state && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 8,
            marginBottom: 12,
            fontSize: 13,
          }}
        >
          <Stat label="Outcome" value={state.outcome?.toUpperCase() || '—'} />
          <Stat label="Hydration" value={String(state.hydration)} />
          <Stat label="Calories" value={String(state.calories)} />
