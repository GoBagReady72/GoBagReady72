import React, { useEffect, useMemo, useState } from "react";

/**
 * Ready72 Wireframes v0.7.1 — Hotfix
 * - Fixes persona card visibility (higher contrast)
 * - Defensive rendering so cards never disappear
 * - Matches HazAssist palette
 * Flow: 0 Intro → 1 Persona → 2 Briefing → 3 Store → 4 Decision → 5 Debrief
 */

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
      .r72-btn { border-radius: 10px; border: 1px solid #1E293B; background: #0D1527; color: #FFFFFF; padding: 10px 12px; cursor: pointer; }
      .r72-btn.primary { background: #F97316; border-color: #F97316; color: #0B1220; }
      .r72-btn:disabled { opacity: .55; filter: grayscale(40%); cursor: not-allowed; }
      .r72-muted { color: #9FB2C9; }
      .r72-header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid #1E293B; background: #020817; }
      .r72-chipbar button { border-radius: 8px; padding: 8px 12px; border: 1px solid #1E293B; background: #0D1527; color: #FFFFFF; }
      .r72-chipbar button.active { color: #F97316; border-color: #F97316; }
      .r72-status-rail { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .r72-status-track { height: 8px; border-radius: 9999px; border: 1px solid #1E293B; background: #020817; }
      .r72-status-fill { height: 8px; border-radius: 9999px; background: #F97316; }
      .r72-log { display: grid; gap: 8px; max-height: 260px; overflow: auto; padding-right: 4px; }
      .r72-aspect-video { position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; border: 1px solid #1E293B; background: #020817; color: #9FB2C9; display: grid; place-items: center; }
      .r72-badge { display:inline-block; border:1px solid #1E293B; background:#0B1220; border-radius:9999px; padding:4px 8px; font-size:12px; color:#CBD5E1;}
      /* Persona card-specific contrast and layout */
      .persona-card { text-align: left; padding: 16px; border-radius: 16px; background: #0B1220; border: 1px solid #334155; color: #E5E7EB; }
      .persona-card.active { border-color: #F97316; box-shadow: 0 0 0 1px #F97316 inset; }
      .persona-title { font-size: 18px; font-weight: 700; color: #FFFFFF; }
      .persona-blurb { font-size: 14px; margin-top: 6px; color: #D1D5DB; }
      .persona-list { color: #E2E8F0; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('ready72-mincss'); if (el) el.remove(); };
  }, []);
}

const HA = {
  bg: "#020817",
  surface: "#0B1220",
  border: "#1E293B",
  text: "#FFFFFF",
  muted: "#9FB2C9",
  accent: "#F97316",
  gradG: "#22C55E",
  gradY: "#EAB308",
  gradR: "#EF4444",
};

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

type PersonaKey = 'EC' | 'PR';
type Persona = { key: PersonaKey; title: string; cash: number; blurb: string; stats: string[]; bodyWeightKg: number; bagLimitPct: number };
type CategoryKey = 'WATER' | 'FOOD' | 'SHELTER' | 'HEALTH' | 'COMMS' | 'SUSTAIN' | 'SPECIAL';
type Item = { id: string; name: string; category: CategoryKey; weightKg: number; cost: number; mssImpact: number; stackable?: boolean };
type Cart = Record<string, number>;

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

function sum<T>(arr: T[], fn: (x: T) => number): number { return arr.reduce((a, b) => a + fn(b), 0); }

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
  const [picked, setPicked] = useState<PersonaKey | 'RAND' | null>('EC');
  const selectedPersona: Persona = useMemo(() => {
    const key: PersonaKey = picked === 'PR' ? 'PR' : 'EC';
    // Defensive: if PERSONA array ever changes, fall back to EC
    return PERSONA.find(p => p.key === key) || PERSONA[0];
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
          {PERSONA.length === 0 ? (
            <Card style={{ padding: 16 }}>
              <div style={{ color:'#FCA5A5' }}>No personas available.</div>
            </Card>
          ) : (
            PERSONA.map((p: Persona) => (
              <button
                key={p.key}
                onClick={() => setPicked(p.key)}
                className={`persona-card ${picked===p.key ? 'active' : ''}`}
              >
                <div className="persona-title">{p.title}</div>
                <div className="persona-blurb">{p.blurb}</div>
                <div className="r72-muted" style={{ fontSize: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>What to expect</div>
                <ul className="persona-list" style={{ fontSize: 14, marginTop: 6, paddingLeft: 18 }}>
                  {p.stats.map((s: string, i: number)=>(<li key={i}>{s}</li>))}
                </ul>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, marginRight: 12 }}><GradientBar /></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color:'#FFFFFF' }}>Cash on hand: ${p.cash}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={()=>setPicked(Math.random() < 0.5 ? 'EC' : 'PR')} className="r72-btn">Pick for me</button>
        <button
          disabled={!picked}
          onClick={()=> onContinue(selectedPersona, selectedPersona.cash)}
          className="r72-btn primary"
          style={{ opacity: picked ? 1 : 0.55, filter: picked ? 'none' : 'grayscale(40%)' }}
        >Continue to briefing</button>
      </div>
    </Shell>
  );
};

type SceneBriefingProps = { persona: Persona; cash: number; onAdvance: ()=>void };
const SceneBriefing: React.FC<SceneBriefingProps> = ({ persona, cash, onAdvance }) => {
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
      </Card>

      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat lines={[
            "Choose a plan: Evacuate now, Monitor conditions, or Stock up locally.",
            "You will go to your loadout next to adjust your kit.",
          ]} />
        </div>

        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Severe Flood Watch — example region</div>
            <div className="r72-muted" style={{ fontSize: 14 }}>About twelve hours until the worst conditions</div>
          </div>
          <div style={{ marginTop: 12 }}><GradientBar /></div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onAdvance} className="r72-btn primary">Go to loadout</button>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

type SceneStoreProps = { persona: Persona; cash: number; onFinalize: (cart: Cart, weightKg: number, limitKg: number) => void };
const SceneStore: React.FC<SceneStoreProps> = ({ persona, cash, onFinalize }) => {
  const [cart, setCart] = useState<Cart>({});
  const packLimitKg = Math.round(persona.bodyWeightKg * persona.bagLimitPct * 10) / 10;
  const cashSpent = useMemo(()=>sum(Object.entries(cart), ([id, qty]) => (ITEMS.find(i=>i.id===id)!.cost * qty)), [cart]);
  const weightKg = useMemo(()=>sum(Object.entries(cart), ([id, qty]) => (ITEMS.find(i=>i.id===id)!.weightKg * qty)), [cart]);
  const cashRemain = cash - cashSpent;
  const overBudget = cashRemain < 0;
  const overWeight = weightKg > packLimitKg;
  function inc(id: string){ const it = ITEMS.find(i=>i.id===id)!; setCart(p=>({...p, [id]:(p[id]||0)+(it.stackable?1:(p[id]?0:1))})) }
  function dec(id: string){ setCart(p=>{const q=(p[id]||0)-1; if(q<=0){const{[id]:_,...r}=p; return r;} return {...p,[id]:q};}); }
  return (
    <Shell title="Scene 3 · MSS Store / Loadout">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, fontSize:14 }}>
          <div><span className="r72-muted">Profile:</span> {persona.title}</div>
          <div><span className="r72-muted">Cash:</span> ${cashRemain}</div>
          <div style={{ flex: 1 }} />
          <div><span className="r72-muted">Pack limit:</span> {packLimitKg.toFixed(1)} kg</div>
        </div>
      </Card>
      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat lines={[
            "This is the same checklist used in GoBag101 and HazAssist plans.",
            "Keep cash and weight under your limits.",
          ]} />
        </div>
        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {ITEMS.map(it=>{
              const qty = cart[it.id] || 0;
              return (
                <div key={it.id} className="r72-card" style={{ padding: 12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize: 14, color:'#E5E7EB' }}>{it.name}</div>
                    <div style={{ fontSize: 13 }}>${it.cost}</div>
                  </div>
                  <div className="r72-muted" style={{ fontSize: 12, marginTop: 4 }}>MSS impact ~{it.mssImpact} · {it.weightKg.toFixed(2)} kg</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6, marginTop: 8 }}>
                    <button className="r72-btn" onClick={()=>dec(it.id)}>-</button>
                    <div style={{ minWidth: 20, textAlign: 'center' }}>{qty}</div>
                    <button className="r72-btn" onClick={()=>inc(it.id)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="r72-card" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              <div><div className="r72-muted" style={{ fontSize:12, marginBottom:4 }}>Cash remaining</div><div className="r72-status-track"><div className="r72-status-fill" style={{ width:`${Math.max(0,Math.min(100,((cash-cashSpent)/cash)*100))}%` }} /></div></div>
              <div><div className="r72-muted" style={{ fontSize:12, marginBottom:4 }}>Pack weight: {weightKg.toFixed(1)} / {packLimitKg.toFixed(1)} kg</div><div className="r72-status-track"><div className="r72-status-fill" style={{ width:`${Math.min(100,Math.round((weightKg/packLimitKg)*100))}%` }} /></div></div>
              <div><div className="r72-muted" style={{ fontSize:12, marginBottom:4 }}>MSS balance preview</div><div className="r72-status-track"><div className="r72-status-fill" style={{ width:`48%` }} /></div></div>
            </div>
            {(overBudget || overWeight) && <div style={{ marginTop:8, fontSize:13, color:'#EAB308' }}>{overBudget?'Over budget. ':''}{overWeight?'Over weight limit.':''}</div>}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
            <button disabled={overBudget||overWeight} className="r72-btn primary" onClick={()=>onFinalize(cart, weightKg, packLimitKg)}>Finalize Loadout → Proceed</button>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

type SceneDecisionProps = { persona: Persona; cart: Cart; packKg: number; packLimitKg: number; onFinish: (win: boolean, log: string[]) => void };
function makeRng(seed: number){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/0x100000000; }; }
const SceneDecision: React.FC<SceneDecisionProps> = ({ persona, cart, packKg, packLimitKg, onFinish }) => {
  const [seed, setSeed] = useState<number>(42);
  const rng = useMemo(()=>makeRng(seed), [seed]);
  const [hoursLeft, setHoursLeft] = useState<number>(12);
  const [distanceLeft, setDistanceLeft] = useState<number>(30);
  const [hydration, setHydration] = useState<number>(60);
  const [calories, setCalories] = useState<number>(60);
  const [morale, setMorale] = useState<number>(60);
  const [log, setLog] = useState<string[]>(['KOE: Flood Watch — Reach high ground before the surge (demo).']);
  const weightRatio = Math.min(2, packKg/packLimitKg);
  function addLog(x:string){ setLog(p=>[x, ...p].slice(0,50)); }
  function tick(kind:'MOVE'|'REST'|'FAST'|'RATION'|'DIVERT'){
    let dist=0, h2o=-8, cal=-10, mor=-2, time=-4;
    if(kind==='MOVE'){ dist=12; h2o-=4; cal-=5; }
    if(kind==='FAST'){ dist=16; h2o-=8; cal-=10; mor-=4; }
    if(kind==='REST'){ dist=0;  h2o+=4; cal+=2; mor+=6; }
    if(kind==='RATION'){ dist=6; h2o-=12; cal-=14; mor-=4; }
    if(kind==='DIVERT'){ dist=10; time-=5; mor-=1; }
    dist = Math.max(0, Math.round(dist * (1 - Math.max(0,(weightRatio-1)*0.25))));
    const r=rng();
    if(r<0.2){ dist=Math.max(0,dist-3); mor-=2; addLog('t+4h: Road closure → -3 km'); }
    else if(r<0.3){ if(!cart['radio']){ mor-=2; addLog('t+4h: Signal lost → no radio.'); } else { addLog('t+4h: Signal lost → radio helps.'); } }
    else if(r<0.36){ if(!(cart['water-filter']||cart['tabs'])){ h2o-=6; addLog('t+4h: Bad water → need filter.'); } else { addLog('t+4h: Bad water → filter used.'); } }
    setDistanceLeft(d=>Math.max(0,d-dist));
    setHydration(h=>Math.max(0,Math.min(100,h+h2o)));
    setCalories(c=>Math.max(0,Math.min(100,c+cal)));
    setMorale(m=>Math.max(0,Math.min(100,m+mor)));
    setHoursLeft(t=>Math.max(0,t+time));
    addLog(`Action: ${kind.toLowerCase()} → ${dist} km; ΔH2O ${h2o}, ΔCal ${cal}, ΔMor ${mor}`);
  }
  useEffect(()=>{
    if(distanceLeft<=0){ addLog('Outcome: WIN'); onFinish(true, log); }
    else if(hoursLeft<=0 || hydration<=0 || calories<=0 || morale<=0){ addLog('Outcome: LOSS'); onFinish(false, log); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[distanceLeft,hoursLeft,hydration,calories,morale]);
  return (
    <Shell title="Scene 4 · Decision Loop (4-hour cycle)">
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, fontSize:14, alignItems:'center' }}>
          <div><span className="r72-muted">Profile:</span> {persona.title}</div>
          <div><span className="r72-muted">Seed:</span> <input type="number" value={seed} onChange={e=>setSeed(parseInt(e.target.value||'42',10))} style={{ width: 90, background:'#020817', color:'#fff', border:'1px solid #1E293B', borderRadius:6, padding:'4px 6px' }}/></div>
          <div style={{ flex:1 }}/>
          <div><span className="r72-muted">Time:</span> {hoursLeft} h</div>
          <div><span className="r72-muted">Distance:</span> {distanceLeft} km</div>
          <div><span className="r72-muted">Encumbrance:</span> {(packKg/packLimitKg).toFixed(2)}x</div>
        </div>
      </Card>
      <div className="r72-row">
        <div style={{ flex: 1 }}>
          <AdvisorChat lines={[
            "Pick your next move. Each choice changes speed, water, food, and morale.",
            "Overweight packs reduce your speed and increase fatigue.",
            "A radio or water filter can turn setbacks into neutral events.",
          ]} />
        </div>
        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                <button className="r72-btn" onClick={()=>tick('MOVE')}>Move — Normal</button>
                <button className="r72-btn" onClick={()=>tick('FAST')}>Move — Fast</button>
                <button className="r72-btn" onClick={()=>tick('REST')}>Rest</button>
                <button className="r72-btn" onClick={()=>tick('RATION')}>Ration</button>
                <button className="r72-btn" onClick={()=>tick('DIVERT')}>Divert</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <BottomHUD hydration={hydration} calories={calories} morale={morale} mss={50} weightPct={Math.min(100, Math.round((packKg/packLimitKg)*100))} />
              </div>
            </div>
            <div>
              <div className="r72-log">
                {log.map((line: string, i: number)=>(
                  <div key={i} style={{ background:'#020817', border:`1px solid #1E293B`, borderRadius:10, padding:'8px 10px', fontSize:14 }}>{line}</div>
                ))}
              </div>
              <div style={{ marginTop: 12, display:'flex', justifyContent:'flex-end', gap:8 }}>
                <button className="r72-btn" onClick={()=>{ (setHoursLeft as any)(0); }}>Force End</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

type SceneDebriefProps = { persona: Persona; cart: Cart; win: boolean; log: string[]; onRestart: ()=>void };
const CATS: Array<{ key: CategoryKey; label: string }> = [
  { key: 'WATER', label: 'Water' },
  { key: 'FOOD', label: 'Food' },
  { key: 'SHELTER', label: 'Shelter' },
  { key: 'HEALTH', label: 'Health & PPE' },
  { key: 'COMMS', label: 'Comms & Nav' },
  { key: 'SUSTAIN', label: 'Sustainability' },
  { key: 'SPECIAL', label: 'Special' },
];

function computeMssByCategory(cart: Cart): Record<CategoryKey, number> {
  const totals: Record<CategoryKey, number> = { WATER:0, FOOD:0, SHELTER:0, HEALTH:0, COMMS:0, SUSTAIN:0, SPECIAL:0 };
  for (const [id, qty] of Object.entries(cart)) {
    const it = ITEMS.find(x=>x.id===id);
    if (!it) continue;
    totals[it.category] += it.mssImpact * qty;
  }
  (Object.keys(totals) as CategoryKey[]).forEach(k=>{ totals[k] = Math.min(100, Math.round(totals[k])); });
  return totals;
}

const SceneDebrief: React.FC<SceneDebriefProps> = ({ persona, cart, win, log, onRestart }) => {
  const byCat = useMemo(()=>computeMssByCategory(cart), [cart]);
  const avg = useMemo(()=>Math.round(sum(Object.values(byCat), x=>x) / Object.keys(byCat).length), [byCat]);
  const frs = win ? (avg>=75 ? 'Thrived' : avg>=55 ? 'Recovered' : 'Survived') : 'At risk';
  const badge = win ? (avg>=60 ? 'IRU Preparedness Badge I' : 'IRU Participation') : 'Complete Ready72 again';

  return (
    <Shell title="Scene 5 · Debrief">
      <div className="r72-row">
        <Card style={{ flex: 2, padding: 16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>MSS Report Card</div>
            <div className="r72-badge">{win ? 'Outcome: WIN' : 'Outcome: LOSS'}</div>
          </div>
          <div style={{ marginTop: 10 }}><GradientBar /></div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 12 }}>
            {CATS.map(c=> (
              <div key={c.key} className="r72-card" style={{ padding: 12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontWeight:600 }}>{c.label}</div>
                  <div className="r72-muted" style={{ fontSize: 13 }}>{byCat[c.key]}%</div>
                </div>
                <div className="r72-status-track" style={{ marginTop: 6 }}>
                  <div className="r72-status-fill" style={{ width: `${byCat[c.key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="r72-card" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>FRS Outcome: {frs}</div>
                <div className="r72-muted" style={{ fontSize: 13 }}>Average MSS alignment: {avg}%</div>
              </div>
              <div className="r72-badge">{badge}</div>
            </div>
          </div>

          <div className="r72-card" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight:600, marginBottom:8 }}>Reflection</div>
            <ul className="r72-muted" style={{ fontSize: 14, paddingLeft: 18 }}>
              <li>What would you change before the next scenario?</li>
              <li>Which category fell below 60%? Focus there first.</li>
              <li>Could you reduce weight without losing balance?</li>
            </ul>
          </div>

          <div style={{ marginTop: 12, display:'flex', justifyContent:'space-between' }}>
            <button className="r72-btn" onClick={onRestart}>Play again</button>
            <button className="r72-btn primary" onClick={()=>alert('Open HazAssist dashboard (placeholder).')}>Open HazAssist Dashboard →</button>
          </div>
        </Card>

        <div style={{ flex: 1 }}>
          <AdvisorChat lines={[
            "This summary shows how balanced your kit was by category.",
            "Try to reach 60% or higher in each category to improve outcomes.",
            "In HazAssist, this connects to your real readiness plan.",
          ]} />
          <Card style={{ padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight:600, marginBottom:6 }}>Key Events</div>
            <div className="r72-log">
              {log.slice(0,6).map((l,i)=>(<div key={i} style={{ background:'#020817', border:`1px solid #1E293B`, borderRadius:10, padding:'8px 10px', fontSize:14 }}>{l}</div>))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default function Ready72WireframesV071(): JSX.Element {
  const [scene, setScene] = useState<0|1|2|3|4|5>(1);
  const [persona, setPersona] = useState<Persona>(PERSONA[0]);
  const [cash, setCash] = useState<number>(PERSONA[0].cash);
  const [cartFinal, setCartFinal] = useState<Cart>({});
  const [packKg, setPackKg] = useState<number>(0);
  const [packLimitKg, setPackLimitKg] = useState<number>(Math.round(PERSONA[0].bodyWeightKg*PERSONA[0].bagLimitPct*10)/10);
  const [win, setWin] = useState<boolean>(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  return (
    <div style={{ padding: 8 }}>
      <div className="r72-chipbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={scene===0 ? 'active' : ''} onClick={()=>setScene(0)}>Intro</button>
        <button className={scene===1 ? 'active' : ''} onClick={()=>setScene(1)}>Persona</button>
        <button className={scene===2 ? 'active' : ''} onClick={()=>setScene(2)}>Briefing</button>
        <button className={scene===3 ? 'active' : ''} onClick={()=>setScene(3)}>Store</button>
        <button className={scene===4 ? 'active' : ''} onClick={()=>setScene(4)}>Decision</button>
        <button className={scene===5 ? 'active' : ''} onClick={()=>setScene(5)}>Debrief</button>
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
          onFinish={(didWin, logs)=>{ setWin(didWin); setEventLog(logs); setScene(5); }}
        />
      )}
      {scene===5 && (
        <SceneDebrief
          persona={persona}
          cart={cartFinal}
          win={win}
          log={eventLog}
          onRestart={()=>{ setScene(1); }}
        />
      )}
    </div>
  );
}