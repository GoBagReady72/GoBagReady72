
// src/components/KOEPanel.tsx
import { useMemo, useState } from 'react';
import { runKOE } from '../koe/engine';
import { RegionCoastal } from '../koe/regions.coastal';
import { RegionWildfire } from '../koe/regions.wildfire';
import { RegionWinter } from '../koe/regions.winter';
import type { InventoryItem, SimState } from '../koe/types';

type KOEId =
  | 'early-evac' | 'shelter-in-place' | 'late-evac'
  | 'wf-early-evac' | 'wf-shelter-in-place' | 'wf-embers'
  | 'ws-alert' | 'ws-outage' | 'ws-stranded';

type RegionKey = 'coastal' | 'wildfire' | 'winter';

const REGIONS = {
  coastal: RegionCoastal,
  wildfire: RegionWildfire,
  winter: RegionWinter,
} as const;

export default function KOEPanel() {
  const [regionKey, setRegionKey] = useState<RegionKey>('coastal');
  const [koeId, setKoeId] = useState<KOEId>('early-evac');
  const [seed, setSeed] = useState<number>(42);

  const [inv, setInv] = useState({
    water_filter: true,
    bottled_water: 2,
    kcal_bar_2400: 1,
    insulation_layer: true,
    waterproof_boots: false,
    wool_blanket: false,
    tarp: true,
    offline_maps: true,
    work_gloves: false,
    goggles: false,
    respirator: false,
    bleach: false,
    fuel_can: true,
    cooler: false,
    ice_blocks: 0,
    toilet_liners: 0,
    headlamp: true,
    battery_bank: true,
    go_bag: true,
    box_fan: false,
    furnace_filters: 0,
    // winter-specific
    propane_heater: false,
    tire_chains: false,
    shovel: false,
    camp_stove: false,
    radio: false,
  });

  function setBool(key: keyof typeof inv, val: boolean) {
    setInv(prev => ({ ...prev, [key]: val }));
  }
  function setQty(key: keyof typeof inv, val: number) {
    const n = Math.max(0, Math.floor(val || 0));
    setInv(prev => ({ ...prev, [key]: n }));
  }

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
    inventory: buildInventory(inv),
    log: [],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [JSON.stringify(inv)]);

  function onRun() {
    try {
      const region = REGIONS[regionKey];
      const result = runKOE(region, koeId, initial, { seed, maxMinutes: 8 * 60 });
      setState(result);
    } catch (e) {
      console.error(e);
      alert('KOE run failed. Check console for details.');
    }
  }

  const koeOptions =
    regionKey === 'coastal'
      ? [
          { id: 'early-evac', label: 'Early Evacuation' },
          { id: 'shelter-in-place', label: 'Shelter-in-Place' },
          { id: 'late-evac', label: 'Late Evacuation (During Storm)' },
        ]
      : regionKey === 'wildfire'
      ? [
          { id: 'wf-early-evac', label: 'Wildfire — Early Evac' },
          { id: 'wf-shelter-in-place', label: 'Wildfire Smoke — Shelter-in-Place' },
          { id: 'wf-embers', label: 'Wildfire — Wind Shift / Embers' },
        ]
      : [
          { id: 'ws-alert', label: 'Winter — 24h Warning' },
          { id: 'ws-outage', label: 'Winter — Power Outage' },
          { id: 'ws-stranded', label: 'Winter — Stranded Vehicle' },
        ];

  return (
    <div style={{ padding: 16, border: '1px solid #222', borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>KOE Simulator — {REGIONS[regionKey].name}</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 14 }}>
          Region:&nbsp;
          <select
            value={regionKey}
            onChange={(e) => {
              const val = e.target.value as RegionKey;
              setRegionKey(val);
              setKoeId(val === 'coastal' ? 'early-evac' : val === 'wildfire' ? 'wf-early-evac' : 'ws-alert');
            }}
            style={{ padding: '4px 6px' }}
          >
            <option value="coastal">Coastal (Hurricane/Storm Surge)</option>
            <option value="wildfire">Wildfire (Smoke / Evacuation)</option>
            <option value="winter">Winter Storm (Ice / Outage)</option>
          </select>
        </label>

        <label style={{ fontSize: 14 }}>
          KOE:&nbsp;
          <select
            value={koeId}
            onChange={(e) => setKoeId(e.target.value as KOeId)}
            style={{ padding: '4px 6px' }}
          >
            {koeOptions.map(k => (
              <option key={k.id} value={k.id as any}>{k.label}</option>
            ))}
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
            <Check label="Wool Blanket" checked={inv.wool_blanket} onChange={(v) => setBool('wool_blanket', v)} />
          </Group>

          <Group title="SHELTER">
            <Check label="Tarp" checked={inv.tarp} onChange={(v) => setBool('tarp', v)} />
          </Group>

          <Group title="COMMS & NAV">
            <Check label="Offline Maps" checked={inv.offline_maps} onChange={(v) => setBool('offline_maps', v)} />
            <Check label="Radio (hand-crank)" checked={inv.radio} onChange={(v) => setBool('radio', v)} />
          </Group>

          <Group title="HEALTH / PPE">
            <Check label="Work Gloves" checked={inv.work_gloves} onChange={(v) => setBool('work_gloves', v)} />
            <Check label="Goggles" checked={inv.goggles} onChange={(v) => setBool('goggles', v)} />
            <Check label="Respirator (N95/P100)" checked={inv.respirator} onChange={(v) => setBool('respirator', v)} />
            <Check label="Bleach" checked={inv.bleach} onChange={(v) => setBool('bleach', v)} />
          </Group>

          <Group title="SUSTAINABILITY">
            <Check label="Fuel Can" checked={inv.fuel_can} onChange={(v) => setBool('fuel_can', v)} />
            <Check label="Cooler" checked={inv.cooler} onChange={(v) => setBool('cooler', v)} />
            <Qty label="Ice Blocks (qty)" value={inv.ice_blocks} onChange={(n) => setQty('ice_blocks', n)} />
            <Qty label="Toilet Liners (qty)" value={inv.toilet_liners} onChange={(n) => setQty('toilet_liners', n)} />
            <Check label="Headlamp" checked={inv.headlamp} onChange={(v) => setBool('headlamp', v)} />
            <Check label="Battery Bank" checked={inv.battery_bank} onChange={(v) => setBool('battery_bank', v)} />
            <Check label="Propane Heater" checked={inv.propane_heater} onChange={(v) => setBool('propane_heater', v)} />
            <Check label="Tire Chains" checked={inv.tire_chains} onChange={(v) => setBool('tire_chains', v)} />
            <Check label="Shovel" checked={inv.shovel} onChange={(v) => setBool('shovel', v)} />
            <Check label="Camp Stove" checked={inv.camp_stove} onChange={(v) => setBool('camp_stove', v)} />
          </Group>
        </div>
      </div>

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
          <Stat label="Morale" value={String(state.morale)} />
          <Stat label="Road" value={String(state.roadAccess)} />
          <Stat label="Cell" value={String(state.cellService)} />
        </div>
      )}

      <div>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Event Log</div>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#0f0f0f',
            color: '#eaeaea',
            padding: 12,
            borderRadius: 8,
            minHeight: 180,
            border: '1px solid #333',
            margin: 0,
          }}
        >
{state?.log?.length ? state.log.join('\n') : 'Choose a Region & KOE, set inventory, then Run.'}
        </pre>
      </div>
    </div>
  );
}

// ---------- UI helpers ----------
function Group(props: { title: string; children: any }) {
  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, opacity: 0.85, marginBottom: 8 }}>
        {props.title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
        {props.children}
      </div>
    </div>
  );
}

function Check(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span>{props.label}</span>
    </label>
  );
}

function Qty(props: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
    <span>{props.label}</span>
      <input
        type="number"
        min={0}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value || 0))}
        style={{ width: 90, padding: '2px 6px' }}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 8, border: '1px solid #333', borderRadius: 6 }}>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

// ---------- builder ----------
function buildInventory(inv: any): InventoryItem[] {
  const items: InventoryItem[] = [];

  if (inv.water_filter) items.push({ id: 'water_filter', category: 'WATER', qty: 1 });
  if (inv.bottled_water > 0) items.push({ id: 'bottled_water', category: 'WATER', qty: inv.bottled_water });

  if (inv.kcal_bar_2400 > 0) items.push({ id: '2400kcal_bar', category: 'FOOD', qty: inv.kcal_bar_2400 });

  if (inv.insulation_layer) items.push({ id: 'insulation_layer', category: 'CLOTHING', qty: 1 });
  if (inv.waterproof_boots) items.push({ id: 'waterproof_boots', category: 'CLOTHING', qty: 1 });
  if (inv.wool_blanket) items.push({ id: 'wool_blanket', category: 'CLOTHING', qty: 1 });

  if (inv.tarp) items.push({ id: 'tarp', category: 'SHELTER', qty: 1 });

  if (inv.offline_maps) items.push({ id: 'offline_maps', category: 'COMMS_NAV', qty: 1 });
  if (inv.radio) items.push({ id: 'radio', category: 'COMMS_NAV', qty: 1 });

  if (inv.work_gloves) items.push({ id: 'work_gloves', category: 'HEALTH', qty: 1 });
  if (inv.goggles) items.push({ id: 'goggles', category: 'HEALTH', qty: 1 });
  if (inv.respirator) items.push({ id: 'respirator', category: 'HEALTH', qty: 1 });
  if (inv.bleach) items.push({ id: 'bleach', category: 'HEALTH', qty: 1 });

  if (inv.fuel_can) items.push({ id: 'fuel_can', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.cooler) items.push({ id: 'cooler', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.ice_blocks > 0) items.push({ id: 'ice_blocks', category: 'SUSTAINABILITY', qty: inv.ice_blocks });
  if (inv.toilet_liners > 0) items.push({ id: 'toilet_liners', category: 'SUSTAINABILITY', qty: inv.toilet_liners });
  if (inv.headlamp) items.push({ id: 'headlamp', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.battery_bank) items.push({ id: 'battery_bank', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.propane_heater) items.push({ id: 'propane_heater', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.tire_chains) items.push({ id: 'tire_chains', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.shovel) items.push({ id: 'shovel', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.camp_stove) items.push({ id: 'camp_stove', category: 'SUSTAINABILITY', qty: 1 });

  if (inv.go_bag) items.push({ id: 'go_bag', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.box_fan) items.push({ id: 'box_fan', category: 'SUSTAINABILITY', qty: 1 });
  if (inv.furnace_filters > 0) items.push({ id: 'furnace_filters', category: 'HEALTH', qty: inv.furnace_filters });

  return items;
}
