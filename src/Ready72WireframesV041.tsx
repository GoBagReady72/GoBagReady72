import React, { useEffect, useMemo, useState } from "react";

/**
 * Ready72 Wireframes v0.4.1 — Canon-aligned, Tailwind-free
 * - No Tailwind classes: all layout/spacing/colors are inline or injected CSS
 * - Ensures full-viewport dark background by injecting a small style block
 * - Same Scenes 0–2, same copy
 */

// Inject minimal CSS (no Tailwind needed)
function useMinimalCSS() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'ready72-mincss';
    style.textContent = `
      html, body, #root { height: 100%; }
      body { margin: 0; background: #020817; color: #FFFFFF; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .r72-container { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
      .r72-card { border-radius: 16px; border: 1px solid #1E293B; background: #0B1220; }
      .r72-row { display: flex; gap: 20px; }
      .r72-col { flex: 1 1 0; }
      .r72-btn { border-radius: 10px; border: 1px solid #1E293B; background: transparent; color: #FFFFFF; padding: 10px 12px; cursor: pointer; }
      .r72-btn.primary { background: #F97316; border-color: #F97316; color: #FFFFFF; }
      .r72-btn:disabled { opacity: .5; filter: grayscale(40%); cursor: not-allowed; }
      .r72-muted { color: #94A3B8; }
      .r72-header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid #1E293B; background: #020817; }
      .r72-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .r72-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      .r72-chipbar button { border-radius: 8px; padding: 8px 12px; border: 1px solid #1E293B; background: transparent; color: #FFFFFF; }
      .r72-chipbar button.active { color: #F97316; border-color: #F97316; }
      .r72-list { padding-left: 18px; }
      .r72-aspect-video { position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; border: 1px solid #1E293B; background: #020817; color: #94A3B8; display: grid; place-items: center; }
      .r72-status-rail { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .r72-status-track { height: 8px; border-radius: 9999px; border: 1px solid #1E293B; background: #020817; }
      .r72-status-fill { height: 8px; border-radius: 9999px; background: #F97316; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('ready72-mincss'); if (el) el.remove(); };
  }, []);
}

// HazAssist Colors
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

const Shell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
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

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }>= ({ children, style, className }) => (
  <div className={`r72-card ${className||''}`} style={style}>{children}</div>
);

const GradientBar: React.FC<{ height?: number }> = ({ height = 6 }) => (
  <div style={{ height, width: "100%", borderRadius: 9999, background: `linear-gradient(90deg, ${HA.gradG}, ${HA.gradY}, ${HA.gradR})` }} />
);

const AdvisorChat: React.FC<{ lines: string[] }>= ({ lines }) => (
  <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div className="r72-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>HazAssist · System Advisor</div>
    <div style={{ flex: 1, display: 'grid', gap: 10, overflow: 'auto', paddingRight: 4 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ borderRadius: 10, padding: '8px 10px', fontSize: 14, lineHeight: 1.4, background: HA.bg, border: `1px solid ${HA.border}` }}>{l}</div>
      ))}
    </div>
  </Card>
);

function useRotating(messages: string[], ms = 4500) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), ms);
    return () => clearInterval(id);
  }, [messages, ms]);
  return messages[idx];
}

const CommandHUD: React.FC<{
  show: boolean;
  persona: 'EC'|'PR';
  cash: number;
  region?: string;
  hoursRemain: number;
  mssPercent: number;
  promptLines: string[];
}> = ({ show, persona, cash, region, hoursRemain, mssPercent, promptLines }) => {
  const prompt = useRotating(promptLines, 5000);
  return (
    <div style={{ opacity: show ? 1 : 0, transition: 'opacity .4s ease' }}>
      <Card style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 14 }}>
            <div><span className="r72-muted">Profile:</span> {persona === 'EC' ? 'Everyday Civilian' : 'Prepper'}</div>
            <div><span className="r72-muted">Cash:</span> ${cash}</div>
            {region ? (<div><span className="r72-muted">Region:</span> {region}</div>) : null}
            <div style={{ flex: 1 }} />
            <div><span className="r72-muted">Time until impact:</span> {hoursRemain} hours</div>
            <div><span className="r72-muted">MSS alignment:</span> {mssPercent}%</div>
          </div>
          <div style={{ fontSize: 14, borderRadius: 8, padding: '8px 10px', background: HA.bg, border: `1px solid ${HA.border}` }}>
            <span className="r72-muted">Advisor:</span> {` ${prompt}`}
          </div>
        </div>
      </Card>
    </div>
  );
};

const StatusBar: React.FC<{ label: string; percent: number }>= ({ label, percent }) => {
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

const BottomHUD: React.FC<{ hydration: number; calories: number; morale: number; mss: number; weightPct: number }>= (p) => (
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

// Scene 0 — Intro
const SceneIntro: React.FC<{ onStart: () => void }>= ({ onStart }) => (
  <Shell title="Scene 0 · Introduction">
    <div className="r72-row" style={{ gap: 20, alignItems: 'stretch' }}>
      <Card style={{ padding: 24, flex: 2 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Ready72 — Learn to prepare for seventy-two hours</h1>
        <p className="r72-muted" style={{ margin: '0 0 12px' }}>This experience uses the Minimum Survival Standard. It shows how to plan and make good choices during an emergency.</p>
        <GradientBar />
        <ul className="r72-muted r72-list" style={{ marginTop: 12 }}>
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

// Scene 1 — Persona
const PERSONA: Array<{key: 'EC'|'PR'; title: string; cash: number; blurb: string; stats: string[];}> = [
  { key: 'EC', title: 'Everyday Civilian', cash: 300, blurb: 'Older store-bought kit. Some parts may be missing. You learn as you go.', stats: [
    'Start level: about ten to twenty percent of the standard',
    'Bag weight goal: about one tenth of your body weight',
    'Morale: low at first, improves after small wins'
  ]},
  { key: 'PR', title: 'Prepper', cash: 150, blurb: 'Fitter but often carries too much. Strong early. Slows down later.', stats: [
    'Start level: about sixty to seventy percent of the standard',
    'Bag weight goal: about one sixth to one fifth of your body weight',
    'Carrying too much can slow your travel speed'
  ]},
];

const ScenePersona: React.FC<{ onContinue: (persona: 'EC'|'PR', cash: number) => void }>= ({ onContinue }) => {
  const [picked, setPicked] = useState<'EC'|'PR'|'RAND'|null>(null);
  return (
    <Shell title="Scene 1 · Choose your profile">
      <CommandHUD
        show={true}
        persona={picked==='PR'?'PR':'EC'}
        cash={picked==='PR'?150:300}
        region={undefined}
        hoursRemain={72}
        mssPercent={picked==='PR'?65:15}
        promptLines={[
          'Most people can carry about ten to twenty percent of their body weight.',
          'Buying water and a simple filter improves safety quickly.',
          'Heavy bags reduce travel speed and can lower morale.',
        ]}
      />

      <div className="r72-row" style={{ gap: 20 }}>
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
          {PERSONA.map(p => (
            <button
              key={p.key}
              onClick={() => setPicked(p.key)}
              className="r72-card"
              style={{ textAlign: 'left', padding: 16, border: `1px solid ${picked===p.key? HA.accent : HA.border}`, borderRadius: 16, background: HA.surface }}
            >
              <div style={{ fontSize: 18, fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 14, marginTop: 4, color: HA.muted }}>{p.blurb}</div>
              <div className="r72-muted" style={{ fontSize: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>What to expect</div>
              <ul style={{ fontSize: 14, marginTop: 6, paddingLeft: 18 }}>
                {p.stats.map((s,i)=>(<li key={i}>{s}</li>))}
              </ul>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <GradientBar />
                <div style={{ fontSize: 14, fontWeight: 600, marginLeft: 12 }}>Cash on hand: ${p.cash}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={()=>setPicked('RAND')} className="r72-btn">Pick for me</button>
        <button
          disabled={!picked}
          onClick={()=> onContinue((picked==='PR'?'PR':'EC'), picked==='PR'?150:300)}
          className="r72-btn primary"
          style={{ opacity: picked ? 1 : 0.5, filter: picked ? 'none' : 'grayscale(40%)' }}
        >Continue to briefing</button>
      </div>
    </Shell>
  );
};

// Scene 2 — Briefing
const SceneBriefing: React.FC<{ persona: 'EC'|'PR'; cash: number; onAdvance: ()=>void }>= ({ persona, cash, onAdvance }) => {
  const promptLines = useMemo(()=>[
    `${persona === 'EC' ? 'Everyday Civilian' : 'Prepper'} profile is active. Cash available: $${cash}.`,
    'If you evacuate early, roads may be clearer and shelters more open.',
    'If you stock up, weight can slow you down. Balance is better than more.',
  ], [persona, cash]);

  return (
    <Shell title="Scene 2 · Emergency scenario briefing">
      <CommandHUD
        show={true}
        persona={persona}
        cash={cash}
        region="Coastal region (example)"
        hoursRemain={12}
        mssPercent={persona==='PR'?65:20}
        promptLines={promptLines}
      />

      <div className="r72-row" style={{ gap: 20, alignItems: 'stretch' }}>
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
              <div className="r72-grid-3">
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

          <BottomHUD hydration={62} calories={55} morale={50} mss={persona==='PR'?65:20} weightPct={persona==='PR'?18:12} />
        </Card>
      </div>
    </Shell>
  );
};

// Demo container
export default function Ready72WireframesV041() {
  const [scene, setScene] = useState<0|1|2>(0);
  const [persona, setPersona] = useState<'EC'|'PR'>('EC');
  const [cash, setCash] = useState<number>(300);

  return (
    <div style={{ padding: 8 }}>
      <div className="r72-chipbar" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={scene===0 ? 'active' : ''} onClick={()=>setScene(0)}>Intro</button>
        <button className={scene===1 ? 'active' : ''} onClick={()=>setScene(1)}>Persona</button>
        <button className={scene===2 ? 'active' : ''} onClick={()=>setScene(2)}>Briefing</button>
      </div>

      {scene===0 && <SceneIntro onStart={()=>setScene(1)} />}
      {scene===1 && (
        <ScenePersona onContinue={(p, cashVal)=>{ setPersona(p); setCash(cashVal); setScene(2); }} />
      )}
      {scene===2 && (
        <SceneBriefing persona={persona} cash={cash} onAdvance={()=>alert('Next: Loadout / MSS Store (wireframe in next pass)')} />
      )}
    </div>
  );
}