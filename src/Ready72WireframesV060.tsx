import React, { useEffect, useMemo, useState } from "react";

/**
 * Ready72 Wireframes v0.6 — Adds Scene 4: Decision Loop (4-hour ticks)
 * - Tailwind-free (inline + injected CSS)
 * - Fully typed
 * - Flow: Scenes 0 (Intro) → 1 (Persona) → 2 (Briefing) → 3 (Store) → 4 (Decision Loop)
 */

// ---- Minimal CSS injection ----
function useMinimalCSS(): void {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'ready72-mincss';
    style.textContent = `
      html, body, #root { height: 100%; }
      body { margin: 0; background: #020817; color: #FFFFFF; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .r72-container { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
      .r72-card { border-radius: 16px; border: 1px solid #1E293B; background: #0B1220; }
      .r72-row { display: flex; gap: 20px; align-items: stretch; }
      .r72-btn { border-radius: 10px; border: 1px solid #1E293B; background: transparent; color: #FFFFFF; padding: 10px 12px; cursor: pointer; }
      .r72-btn.primary { background: #F97316; border-color: #F97316; color: #FFFFFF; }
      .r72-btn:disabled { opacity: .5; filter: grayscale(40%); cursor: not-allowed; }
      .r72-muted { color: #94A3B8; }
      .r72-header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid #1E293B; background: #020817; }
      .r72-chipbar button { border-radius: 8px; padding: 8px 12px; border: 1px solid #1E293B; background: transparent; color: #FFFFFF; }
      .r72-chipbar button.active { color: #F97316; border-color: #F97316; }
      .r72-aspect-video { position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; border: 1px solid #1E293B; background: #020817; color: #94A3B8; display: grid; place-items: center; }
      .r72-status-rail { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .r72-status-track { height: 8px; border-radius: 9999px; border: 1px solid #1E293B; background: #020817; }
      .r72-status-fill { height: 8px; border-radius: 9999px; background: #F97316; }
      .r72-log { display: grid; gap: 8px; max-height: 260px; overflow: auto; padding-right: 4px; }
      .r72-pill { border-radius: 9999px; padding: 6px 10px; border: 1px solid #1E293B; background: transparent; color: #FFFFFF; }
      .r72-pill.active { border-color: #F97316; color: #F97316; }
      .r72-map { border-radius: 12px; border: 1px solid #1E293B; background: #020817; height: 220px; display: grid; place-items: center; color: #94A3B8; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('ready72-mincss'); if (el) el.remove(); };
  }, []);
}

// ---- HazAssist Colors ----
const HA = {
  bg: "#020817",
  surface: "#0B1220",
  border: "#1E293B",
  text: "#FFFFFF",
  muted: "#94A3B8",
  accent: "#F97316",
  gradG: "#22C55E",
  gradY: "#EAB308",
  gradR: "#EF4444",
};

// ---- Shared UI ----
type ShellProps = { title: string; children: React.ReactNode };
const Shell: React.FC<ShellProps> = ({ title, children }) => {
  useMinimalCSS();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: HA.bg, color: HA.text }}>
      <header className="r72-header">
        <div className="r72-container" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
            <span style={{ color: HA.accent }}>GoBag:</span> Ready72
          </div>
          <div className="r72-muted" style={{ fontSize: 14 }}>{title}</div>
        </div>
      </header>
      <main className="r72-container" style={{ padding: '24px 16px' }}>{children}</main>
    </div>
  );
};

type CardProps = { children: React.ReactNode; style?: React.CSSProperties; className?: string };
const Card: React.FC<CardProps> = ({ children, style, className }) => (
  <div className={`r72-card ${className || ''}`} style={style}>{children}</div>
);

const GradientBar: React.FC<{ height?: number }> = ({ height = 6 }) => (
  <div style={{ height, width: "100%", borderRadius: 9999, background: `linear-gradient(90deg, ${HA.gradG}, ${HA.gradY}, ${HA.gradR})` }} />
);

type AdvisorChatProps = { lines: string[] };
const AdvisorChat: React.FC<AdvisorChatProps> = ({ lines }) => (
  <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div className="r72-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>HazAssist · System Advisor</div>
    <div className="r72-log">
      {lines.map((l: string, i: number) => (
        <div key={i} style={{ borderRadius: 10, padding: '8px 10px', fontSize: 14, lineHeight: 1.4, background: HA.bg, border: `1px solid ${HA.border}` }}>{l}</div>
      ))}
    </div>
  </Card>
);

function useRotating(messages: string[], ms = 4500): string {
  const [idx, setIdx] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), ms);
    return () => clearInterval(id);
  }, [messages, ms]);
  return messages[idx];
}

type PersonaKey = 'EC' | 'PR';
type Persona = { key: PersonaKey; title: string; cash: number; blurb: string; stats: string[]; bodyWeightKg: number; bagLimitPct: number };
type CategoryKey = 'WATER' | 'FOOD' | 'SHELTER' | 'HEALTH' | 'COMMS' | 'SUSTAIN' | 'SPECIAL';
type Item = { id: string; name: string; category: CategoryKey; weightKg: number; cost: number; mssImpact: number; stackable?: boolean };
type Cart = Record<string, number>;

// ---- Status HUD ----
const StatusBar: React.FC<{ label: string; percent: number }> = ({ label, percent }) => {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="r72-muted" style={{ fontSize: 12, marginBottom: 4 }}>{label}: {pct}%</div>
      <div className="r72-status-track">
        <div className="r72-status-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const BottomHUD: React.FC<{ hydration: number; calories: number; morale: number; mss: number; weightPct: number }> = (p) => (
  <Card style={{ padding: 12, marginTop: 16 }}>
    <div className="r72-status-rail">
      <StatusBar label="Hydration" percent={p.hydration} />
      <StatusBar label="Calories" percent={p.calories} />
      <StatusBar label="Morale" percent={p.morale} />
      <StatusBar label="MSS alignment" percent={p.mss} />
      <StatusBar label="Pack weight (limit %)" percent={p.weightPct} />
    </div>
  </Card>
);

// ---- Utility ----
function sum<T>(arr: T[], fn: (x: T) => number): number { return arr.reduce((a, b) => a + fn(b), 0); }

// ---- Seeded RNG (LCG) for deterministic events ----
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}

// ---- Scenes 0–3 (trimmed to essentials) ----
const PERSONA: Persona[] = [
  { key: 'EC', title: 'Everyday Civilian', cash: 300, blurb: 'Older store-bought kit. Some parts may be missing. You learn as you go.', stats: [
    'Start level: about ten to twenty percent of the standard',
    'Bag weight goal: about one tenth of your body weight',
    'Morale: low at first, improves after small wins'
  ], bodyWeightKg: 84, bagLimitPct: 0.12 },
  { key: 'PR', title: 'Prepper', cash: 150, blurb: 'Fitter but often carries too much. Strong early. Slows down later.', stats: [
    'Start level: about sixty to seventy percent of the standard',
    'Bag weight goal: about one sixth to one fifth of your body weight',
    'Carrying too much can slow your travel speed'
  ], bodyWeightKg: 68, bagLimitPct: 0.18 },
];

const ITEMS: Item[] = [
  { id: 'water-filter', name: 'Water Filter', category: 'WATER', weightKg: 0.2, cost: 35, mssImpact: 40 },
  { id: 'bottled-water', name: 'Bottled Water (2L)', category: 'WATER', weightKg: 2.0, cost: 4, mssImpact: 15, stackable: true },
  { id: 'tabs', name: 'Purification Tablets', category: 'WATER', weightKg: 0.05, cost: 8, mssImpact: 10 },
  { id: 'bars2400', name: '2400 kcal Bars', category: 'FOOD', weightKg: 0.5, cost: 12, mssImpact: 30, stackable: true },
  { id: 'mre', name: 'MRE (Self-Heating)', category: 'FOOD', weightKg: 0.6, cost: 10, mssImpact: 25, stackable: true },
  { id: 'tarp', name: 'Tarp', category: 'SHELTER', weightKg: 0.8, cost: 18, mssImpact: 20 },
  { id: 'sleepkit', name: 'Sleeping Kit', category: 'SHELTER', weightKg: 1.8, cost: 65, mssImpact: 45 },
  { id: 'ppe', name: 'Respirator (N95) + Goggles', category: 'HEALTH', weightKg: 0.25, cost: 20, mssImpact: 25 },
  { id: 'firstaid', name: 'First-Aid Kit (Basic)', category: 'HEALTH', weightKg: 0.4, cost: 22, mssImpact: 35 },
  { id: 'radio', name: 'Radio (hand-crank)', category: 'COMMS', weightKg: 0.5, cost: 29, mssImpact: 30 },
  { id: 'maps', name: 'Offline Maps (preloaded)', category: 'COMMS', weightKg: 0.1, cost: 5, mssImpact: 10 },
  { id: 'powerbank', name: 'Battery Bank', category: 'COMMS', weightKg: 0.3, cost: 25, mssImpact: 15 },
  { id: 'gloves', name: 'Work Gloves', category: 'SUSTAIN', weightKg: 0.2, cost: 9, mssImpact: 8 },
  { id: 'fire', name: 'Fire Kit', category: 'SUSTAIN', weightKg: 0.15, cost: 7, mssImpact: 10 },
  { id: 'multitool', name: 'Multi-tool', category: 'SUSTAIN', weightKg: 0.25, cost: 24, mssImpact: 12 },
  { id: 'docs', name: 'Documents Pouch', category: 'SPECIAL', weightKg: 0.1, cost: 6, mssImpact: 10 },
  { id: 'meds', name: 'Personal Meds (3 days)', category: 'SPECIAL', weightKg: 0.05, cost: 12, mssImpact: 20 },
];

type SceneIntroProps = { onStart: () => void };
const SceneIntro: React.FC<SceneIntroProps> = ({ onStart }) => (
  <Shell title="Scene 0 · Introduction">
    <div className="r72-row">
      <Card style={{ padding: 24, flex: 2 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Ready72 — Learn to prepare for seventy-two hours</h1>
        <p className="r72-muted" style={{ margin: '0 0 12px' }}>This experience uses the Minimum Survival Standard. It shows how to plan and make good choices during an emergency.</p>
        <GradientBar />
        <ul className="r72-muted" style={{ marginTop: 12, paddingLeft: 18 }}>
          <li>You will see simple ideas first. You will add skills as you play.</li>
          <li>Every item fits into a survival category like Water, Food, or Shelter.</li>
          <li>Your choices change your speed, energy, and safety.</li>
        </ul>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={onStart} className="r72-btn primary">Start</button>
          <button className="r72-btn">What is the Minimum Survival Standard?</button>
        </div>
      </Card>
      <div style={{ flex: 1 }}>
        <AdvisorChat
          lines={[
            "Welcome to Ready72.",
            "You will choose a profile and see a simple risk preview.",
            "Balanced gear is better than carrying too much weight.",
          ]}
        />
      </div>
    </div>
  </Shell>
);

type ScenePersonaProps = { onContinue: (persona: Persona, cash: number) => void };
const ScenePersona: React.FC<ScenePersonaProps> = ({ onContinue }) => {
  const [picked, setPicked] = useState<PersonaKey | 'RAND' | null>(null);
  const selectedPersona: Persona = useMemo(() => {
    const key: PersonaKey = picked === 'PR' ? 'PR' : 'EC';
    return PERSONA.find(p => p.key === key)!;
  }, [picked]);

  return (
    <Shell title="Scene 1 · Choose your profile">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <div><span className="r72-muted">Profile:</span> {selectedPersona.title}</div>
          <div><span className="r72-muted">Cash:</span> ${selectedPersona.cash}</div>
          <div style={{ flex: 1 }} />
          <div><span className="r72-muted">Time until impact:</span> 72 hours</div>
          <div><span className="r72-muted">MSS alignment:</span> {selectedPersona.key==='PR'?65:15}%</div>
        </div>
      </Card>

      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat
            lines={[
              "Choose a profile or let the system pick for you.",
              "Everyday Civilian starts with more cash and less gear.",
              "Prepper starts with more gear and less cash.",
            ]}
          />
        </div>

        <div style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {PERSONA.map((p: Persona) => (
            <button
              key={p.key}
              onClick={() => setPicked(p.key)}
              className="r72-card"
              style={{ textAlign: 'left', padding: 16, border: `1px solid ${picked===p.key? HA.accent : HA.border}`, borderRadius: 16, background: HA.surface }}
            >
              <div style={{ fontSize: 18, fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 14, marginTop: 4, color: '#CBD5E1' }}>{p.blurb}</div>
              <div className="r72-muted" style={{ fontSize: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>What to expect</div>
              <ul style={{ fontSize: 14, marginTop: 6, paddingLeft: 18, color: '#E5E7EB' }}>
                {p.stats.map((s: string, i: number)=>(<li key={i}>{s}</li>))}
              </ul>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: 12 }}><GradientBar /></div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Cash on hand: ${p.cash}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={()=>setPicked('RAND')} className="r72-btn">Pick for me</button>
        <button
          disabled={!picked}
          onClick={()=> onContinue(selectedPersona, selectedPersona.cash)}
          className="r72-btn primary"
          style={{ opacity: picked ? 1 : 0.5, filter: picked ? 'none' : 'grayscale(40%)' }}
        >Continue to briefing</button>
      </div>
    </Shell>
  );
};

type SceneBriefingProps = { persona: Persona; cash: number; onAdvance: ()=>void };
const SceneBriefing: React.FC<SceneBriefingProps> = ({ persona, cash, onAdvance }) => {
  const promptLines = useMemo<string[]>(() => [
    `${persona.title} profile is active. Cash available: $${cash}.`,
    'If you evacuate early, roads may be clearer and shelters more open.',
    'If you stock up, weight can slow you down. Balance is better than more.',
  ], [persona, cash]);

  return (
    <Shell title="Scene 2 · Emergency scenario briefing">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <div><span className="r72-muted">Profile:</span> {persona.title}</div>
          <div><span className="r72-muted">Cash:</span> ${cash}</div>
          <div><span className="r72-muted">Region:</span> Coastal region (example)</div>
          <div style={{ flex: 1 }} />
          <div><span className="r72-muted">Time until impact:</span> 12 hours</div>
          <div><span className="r72-muted">MSS alignment:</span> {persona.key==='PR'?65:20}%</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 14, borderRadius: 8, padding: '8px 10px', background: HA.bg, border: `1px solid ${HA.border}` }}>
          <span className="r72-muted">Advisor:</span> {` ${promptLines[0]}`}
        </div>
      </Card>

      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat
            lines={[
              "Choose a plan: Evacuate now, Monitor conditions, or Stock up locally.",
              "You will go to your loadout next to adjust your kit.",
            ]}
          />
        </div>

        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Severe Flood Watch — example region</div>
            <div className="r72-muted" style={{ fontSize: 14 }}>About twelve hours until the worst conditions</div>
          </div>
          <div style={{ marginTop: 12 }}><GradientBar /></div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="r72-aspect-video">Map preview area (placeholder)</div>
            <div style={{ borderRadius: 12, padding: 12, background: HA.bg, border: `1px solid ${HA.border}` }}>
              <div className="r72-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Choose a plan</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <button className="r72-btn primary">Evacuate now</button>
                <button className="r72-btn">Monitor conditions</button>
                <button className="r72-btn">Stock up locally</button>
              </div>
              <ul className="r72-muted" style={{ fontSize: 14, marginTop: 10, paddingLeft: 18 }}>
                <li>Evacuate now: faster travel and more shelter space.</li>
                <li>Monitor conditions: save money and time but risk being late.</li>
                <li>Stock up locally: better supplies but more weight and time.</li>
              </ul>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onAdvance} className="r72-btn primary">Go to loadout</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

// ---- Scene 3 — MSS Store / Loadout ----
type SceneStoreProps = { persona: Persona; cash: number; onFinalize: (cart: Cart, weightKg: number, limitKg: number) => void };
const SceneStore: React.FC<SceneStoreProps> = ({ persona, cash, onFinalize }) => {
  const [active, setActive] = useState<'WATER'|'FOOD'|'SHELTER'|'HEALTH'|'COMMS'|'SUSTAIN'|'SPECIAL'>('WATER');
  const [cart, setCart] = useState<Cart>({});

  const itemsByCat = useMemo(() => ITEMS.filter(i => i.category === active), [active]);
  const cashSpent = useMemo(() => sum(Object.entries(cart), ([id, qty]) => (ITEMS.find(i=>i.id===id)!.cost * qty)), [cart]);
  const weightKg = useMemo(() => sum(Object.entries(cart), ([id, qty]) => (ITEMS.find(i=>i.id===id)!.weightKg * qty)), [cart]);
  const packLimitKg = useMemo(() => Math.round(persona.bodyWeightKg * persona.bagLimitPct * 10) / 10, [persona]);
  const cashRemain = cash - cashSpent;
  const weightPct = Math.min(100, Math.round((weightKg / packLimitKg) * 100));
  const overBudget = cashRemain < 0;
  const overWeight = weightKg > packLimitKg;

  function inc(id: string): void {
    const it = ITEMS.find(i=>i.id===id)!;
    setCart(prev => ({ ...prev, [id]: (prev[id]||0) + (it.stackable ? 1 : (prev[id]?0:1)) }));
  }
  function dec(id: string): void {
    setCart(prev => {
      const qty = (prev[id]||0) - 1;
      if (qty <= 0) { const { [id]:_, ...rest } = prev; return rest; }
      return { ...prev, [id]: qty };
    });
  }

  return (
    <Shell title="Scene 3 · MSS Store / Loadout">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <div><span className="r72-muted">Profile:</span> {persona.title}</div>
          <div><span className="r72-muted">Cash:</span> ${cashRemain}</div>
          <div><span className="r72-muted">Region:</span> Coastal region (example)</div>
          <div style={{ flex: 1 }} />
          <div><span className="r72-muted">Time until impact:</span> 8 hours</div>
          <div><span className="r72-muted">Pack limit:</span> {packLimitKg.toFixed(1)} kg</div>
        </div>
      </Card>

      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat
            lines={[
              "This is the same checklist used in GoBag101 and HazAssist plans.",
              "Keep cash and weight under your limits.",
              "Finish when you reach a balanced kit for 72 hours.",
            ]}
          />
        </div>

        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Build your kit</div>
            <div className="r72-muted" style={{ fontSize: 14 }}>Persona: {persona.title}</div>
          </div>
          <div style={{ marginTop: 12 }}><GradientBar /></div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {['WATER','FOOD','SHELTER','HEALTH','COMMS','SUSTAIN','SPECIAL'].map((c: any) => (
              <button key={c} className={`r72-pill ${active===c?'active':''}`} onClick={()=>setActive(c)}>{c}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 12 }}>
            {itemsByCat.map((it: Item) => {
              const qty = cart[it.id] || 0;
              return (
                <div key={it.id} className="r72-card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, color: '#E5E7EB' }}>{it.name}</div>
                    <div style={{ fontSize: 13 }}>${it.cost}</div>
                  </div>
                  <div className="r72-muted" style={{ fontSize: 12, marginTop: 4 }}>MSS impact ~{it.mssImpact} · {it.weightKg.toFixed(2)} kg</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
                    <button className="r72-btn" onClick={()=>dec(it.id)}>-</button>
                    <div style={{ minWidth: 20, textAlign: 'center' }}>{qty}</div>
                    <button className="r72-btn" onClick={()=>inc(it.id)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="r72-card" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <div>
                <div className="r72-muted" style={{ fontSize: 12, marginBottom: 4 }}>Cash remaining: ${cash - cashSpent}</div>
                <div className="r72-status-track"><div className="r72-status-fill" style={{ width: `${Math.max(0, Math.min(100, ((cash-cashSpent)/cash)*100))}%` }} /></div>
              </div>
              <div>
                <div className="r72-muted" style={{ fontSize: 12, marginBottom: 4 }}>Pack weight: {weightKg.toFixed(1)} / {packLimitKg.toFixed(1)} kg</div>
                <div className="r72-status-track"><div className="r72-status-fill" style={{ width: `${Math.min(100, Math.round((weightKg/packLimitKg)*100))}%` }} /></div>
              </div>
              <div>
                <div className="r72-muted" style={{ fontSize: 12, marginBottom: 4 }}>MSS balance preview (placeholder)</div>
                <div className="r72-status-track"><div className="r72-status-fill" style={{ width: `48%` }} /></div>
              </div>
            </div>
            {(cash-cashSpent < 0 || weightKg > packLimitKg) && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#EAB308' }}>
                {(cash-cashSpent < 0) ? 'Over budget. ' : ''}{(weightKg > packLimitKg) ? 'Over weight limit.' : ''}
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div className="r72-muted" style={{ fontSize: 13 }}>Tip: Balance first, then upgrade items as you learn.</div>
            <button
              className="r72-btn primary"
              onClick={()=> onFinalize(cart, weightKg, packLimitKg)}
              disabled={(cash-cashSpent < 0) || (weightKg > packLimitKg)}
            >
              Finalize Loadout → Proceed
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

// ---- Scene 4 — Decision Loop (4-hour ticks) ----
type TickChoice = 'MOVE_EASY'|'MOVE_NORMAL'|'MOVE_FAST'|'REST'|'RATION'|'DIVERT';
type SceneDecisionProps = {
  persona: Persona;
  cart: Cart;
  packKg: number;
  packLimitKg: number;
  onFinish: (win: boolean, log: string[]) => void;
};
const SceneDecision: React.FC<SceneDecisionProps> = ({ persona, cart, packKg, packLimitKg, onFinish }) => {
  const [seed, setSeed] = useState<number>(42);
  const rng = useMemo(()=>makeRng(seed), [seed]);

  const [hoursLeft, setHoursLeft] = useState<number>(12);
  const [distanceLeft, setDistanceLeft] = useState<number>(30); // km to safety for demo
  const [hydration, setHydration] = useState<number>(60);
  const [calories, setCalories] = useState<number>(60);
  const [morale, setMorale] = useState<number>(60);
  const [log, setLog] = useState<string[]>([
    'KOE: Flood Watch — Reach high ground before the surge (demo).',
  ]);

  const weightRatio = Math.min(2, packKg / packLimitKg);
  const encumbrancePenalty = (weightRatio - 1) * 20; // up to +20% cost if overloaded

  function addLog(line: string): void {
    setLog(prev => [line, ...prev].slice(0, 50));
  }

  function applyTick(choice: TickChoice): void {
    // Base deltas per 4h tick
    let dist = 0;
    let h2o = -8;
    let cal = -10;
    let mor = -2;
    let time = -4;

    if (choice === 'MOVE_EASY') {
      dist = 8;
      h2o -= 2;
      cal -= 2;
    } else if (choice === 'MOVE_NORMAL') {
      dist = 12;
      h2o -= 4;
      cal -= 5;
    } else if (choice === 'MOVE_FAST') {
      dist = 16;
      h2o -= 8;
      cal -= 10;
      mor -= 4;
    } else if (choice === 'REST') {
      dist = 0;
      h2o += 4;
      cal += 2;
      mor += 6;
    } else if (choice === 'RATION') {
      dist = 6;
      h2o -= 12;
      cal -= 14;
      mor -= 4;
    } else if (choice === 'DIVERT') {
      dist = 10;
      time -= 5; // taking longer
      mor -= 1;
    }

    // Encumbrance slows distance, increases consumption if overweight
    const enc = 1 - Math.max(0, (weightRatio - 1) * 0.25);
    dist = Math.max(0, Math.round(dist * enc));

    // Random hazard (deterministic by seed)
    const r = rng();
    if (r < 0.18) {
      // Minor setback
      dist = Math.max(0, dist - 3);
      mor -= 3;
      addLog('t+4h: Road closure ahead → minor detour (-3 km).');
    } else if (r < 0.30) {
      // Communication loss (comms item helps)
      const hasRadio = !!cart['radio'];
      if (!hasRadio) {
        mor -= 2;
        addLog('t+4h: Signal lost → morale drops. Radio would help.');
      } else {
        addLog('t+4h: Signal lost → your hand-crank radio keeps info flowing.');
      }
    } else if (r < 0.36) {
      // Water issue (filter/tablets help)
      const hasFilter = !!cart['water-filter'] || !!cart['tabs'];
      if (!hasFilter) {
        h2o -= 6;
        addLog('t+4h: Water source questionable → no filter, hydration suffers.');
      } else {
        addLog('t+4h: Water source questionable → your filter keeps you safe.');
      }
    }

    setDistanceLeft(d => Math.max(0, d - dist));
    setHydration(h => Math.max(0, Math.min(100, h + h2o)));
    setCalories(c => Math.max(0, Math.min(100, c + cal)));
    setMorale(m => Math.max(0, Math.min(100, m + mor)));
    setHoursLeft(t => Math.max(0, t + time));

    addLog(`Choice: ${choice.replace('_',' ').toLowerCase()} → ${dist} km; ΔH2O ${h2o}, ΔCal ${cal}, ΔMor ${mor}`);
  }

  useEffect(() => {
    // End conditions
    if (distanceLeft <= 0) {
      addLog('Outcome: WIN — You reached high ground before surge.');
      onFinish(true, log);
    } else if (hoursLeft <= 0 || hydration <= 0 || calories <= 0 || morale <= 0) {
      addLog('Outcome: LOSS — Resources depleted or out of time.');
      onFinish(false, log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distanceLeft, hoursLeft, hydration, calories, morale]);

  return (
    <Shell title="Scene 4 · Decision Loop (4-hour cycle)">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <div><span className="r72-muted">Profile:</span> {persona.title}</div>
          <div><span className="r72-muted">Seed:</span> <input type="number" value={seed} onChange={e=>setSeed(parseInt(e.target.value||'42',10))} style={{ width: 90, background:'#020817', color:'#fff', border:'1px solid #1E293B', borderRadius:6, padding:'4px 6px' }}/></div>
          <div style={{ flex: 1 }} />
          <div><span className="r72-muted">Time remaining:</span> {hoursLeft} h</div>
          <div><span className="r72-muted">Distance to safety:</span> {distanceLeft} km</div>
          <div><span className="r72-muted">Encumbrance ratio:</span> {(packKg/packLimitKg).toFixed(2)}x</div>
        </div>
      </Card>

      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat
            lines={[
              "Pick your next move. Each choice changes speed, water, food, and morale.",
              "Overweight packs reduce your speed and increase fatigue.",
              "A radio or water filter can turn setbacks into neutral events.",
            ]}
          />
        </div>

        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Choose an action</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <button className="r72-btn" onClick={()=>applyTick('MOVE_EASY')}>Move — Easy</button>
                <button className="r72-btn" onClick={()=>applyTick('MOVE_NORMAL')}>Move — Normal</button>
                <button className="r72-btn" onClick={()=>applyTick('MOVE_FAST')}>Move — Fast</button>
                <button className="r72-btn" onClick={()=>applyTick('REST')}>Rest</button>
                <button className="r72-btn" onClick={()=>applyTick('RATION')}>Ration</button>
                <button className="r72-btn" onClick={()=>applyTick('DIVERT')}>Divert Route</button>
              </div>

              <div className="r72-map" style={{ marginTop: 12 }}>Route map placeholder</div>

              <div style={{ marginTop: 12 }}>
                <BottomHUD hydration={hydration} calories={calories} morale={morale} mss={50} weightPct={Math.min(100, Math.round((packKg/packLimitKg)*100))} />
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Event Log</div>
              <div className="r72-log">
                {log.map((line: string, i: number)=>(
                  <div key={i} style={{ background: '#020817', border: `1px solid ${HA.border}`, borderRadius: 10, padding: '8px 10px', fontSize: 14 }}>{line}</div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="r72-btn" onClick={()=>{ setHoursLeft(0); }}>Force End</button>
                <button className="r72-btn primary" onClick={()=> onFinish(distanceLeft<=0, log)}>Finish & Debrief</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

// ---- Demo container with Scenes 0–4 ----
export default function Ready72WireframesV060(): JSX.Element {
  const [scene, setScene] = useState<0|1|2|3|4>(0);
  const [persona, setPersona] = useState<Persona>(PERSONA[0]);
  const [cash, setCash] = useState<number>(PERSONA[0].cash);
  const [cartFinal, setCartFinal] = useState<Cart>({});
  const [packKg, setPackKg] = useState<number>(0);
  const [packLimitKg, setPackLimitKg] = useState<number>(Math.round(PERSONA[0].bodyWeightKg*PERSONA[0].bagLimitPct*10)/10);

  return (
    <div style={{ padding: 8 }}>
      <div className="r72-chipbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={scene===0 ? 'active' : ''} onClick={()=>setScene(0)}>Intro</button>
        <button className={scene===1 ? 'active' : ''} onClick={()=>setScene(1)}>Persona</button>
        <button className={scene===2 ? 'active' : ''} onClick={()=>setScene(2)}>Briefing</button>
        <button className={scene===3 ? 'active' : ''} onClick={()=>setScene(3)}>Store</button>
        <button className={scene===4 ? 'active' : ''} onClick={()=>setScene(4)}>Decision</button>
      </div>

      {scene===0 && <SceneIntro onStart={()=>setScene(1)} />}
      {scene===1 && (
        <ScenePersona onContinue={(p, cashVal)=>{ 
          setPersona(p); 
          setCash(cashVal); 
          setPackLimitKg(Math.round(p.bodyWeightKg*p.bagLimitPct*10)/10);
          setScene(2); 
        }} />
      )}
      {scene===2 && (
        <SceneBriefing persona={persona} cash={cash} onAdvance={()=>setScene(3)} />
      )}
      {scene===3 && (
        <SceneStore
          persona={persona}
          cash={cash}
          onFinalize={(cart, wKg, limitKg)=>{ 
            setCartFinal(cart); 
            setPackKg(wKg); 
            setPackLimitKg(limitKg);
            setScene(4); 
          }}
        />
      )}
      {scene===4 && (
        <SceneDecision
          persona={persona}
          cart={cartFinal}
          packKg={packKg}
          packLimitKg={packLimitKg}
          onFinish={(win, logs)=>{ 
            alert((win?'WIN':'LOSS') + ' — Debrief placeholder.'); 
          }}
        />
      )}
    </div>
  );
}