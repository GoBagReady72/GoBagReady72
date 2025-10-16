import React, { useEffect, useMemo, useState } from "react";

/**
 * Ready72 Wireframes v0.3 — Intro, Persona, Briefing with Command HUD & HazAssist colors
 * Single-file preview component.
 * 
 * Usage (already wired): App.tsx imports and renders this component.
 * Assumes Tailwind may exist; but uses inline styles so it still looks right without it.
 */

// ---------- HazAssist Color Tokens ----------
const HA = {
  bg: "#020817",          // background
  surface: "#0B1220",     // panels/cards
  border: "#1E293B",      // borders/dividers
  text: "#FFFFFF",        // main text
  muted: "#94A3B8",       // secondary text
  accent: "#F97316",      // primary accent (orange)
  gradG: "#22C55E",       // gradient green
  gradY: "#EAB308",       // gradient yellow
  gradR: "#EF4444",       // gradient red
};

// ---------- Shared UI ----------
const Shell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="min-h-screen" style={{ backgroundColor: HA.bg, color: HA.text }}>
    <header className="sticky top-0 z-40" style={{ backgroundColor: HA.bg, borderBottom: `1px solid ${HA.border}` }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">
          <span style={{ color: HA.accent }}>GoBag:</span> Ready72
        </div>
        <div style={{ color: HA.muted }} className="text-sm">{title}</div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }>= ({ children, className }) => (
  <div className={className} style={{ backgroundColor: HA.surface, border: `1px solid ${HA.border}`, borderRadius: 16 }}>{children}</div>
);

const GradientBar: React.FC<{ height?: number }> = ({ height = 6 }) => (
  <div style={{ height, width: "100%", borderRadius: 9999, background: `linear-gradient(90deg, ${HA.gradG}, ${HA.gradY}, ${HA.gradR})` }} />
);

const AdvisorChat: React.FC<{ lines: string[] }>= ({ lines }) => (
  <Card className="p-4 h-full flex flex-col">
    <div className="text-xs uppercase tracking-wide mb-2" style={{ color: HA.muted }}>HazAssist · System Advisor</div>
    <div className="flex-1 space-y-3 overflow-auto pr-1">
      {lines.map((l, i) => (
        <div key={i} className="rounded-lg px-3 py-2 text-sm leading-relaxed" style={{ backgroundColor: HA.bg, border: `1px solid ${HA.border}` }}>
          {l}
        </div>
      ))}
    </div>
  </Card>
);

// ---------- Top Command HUD (persistent) ----------
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
  region: string;
  hoursRemain: number;
  mssPercent: number;
  promptLines: string[];
}> = ({ show, persona, cash, region, hoursRemain, mssPercent, promptLines }) => {
  const prompt = useRotating(promptLines, 5000);
  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <Card className="p-3 mb-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div><span style={{ color: HA.muted }}>Profile:</span> {persona === 'EC' ? 'Everyday Civilian' : 'Prepper'}</div>
            <div><span style={{ color: HA.muted }}>Cash:</span> ${cash}</div>
            <div><span style={{ color: HA.muted }}>Region:</span> {region}</div>
            <div className="flex-1" />
            <div><span style={{ color: HA.muted }}>Time until impact:</span> {hoursRemain} hours</div>
            <div><span style={{ color: HA.muted }}>MSS alignment:</span> {mssPercent}%</div>
          </div>
          <div className="text-sm rounded-md px-3 py-2" style={{ backgroundColor: HA.bg, border: `1px solid ${HA.border}` }}>
            <span style={{ color: HA.muted }}>Advisor:</span> {" "}{prompt}
          </div>
        </div>
      </Card>
    </div>
  );
};

// ---------- Bottom Status HUD ----------
const StatusBar: React.FC<{ label: string; percent: number }>= ({ label, percent }) => (
  <div className="w-full">
    <div className="text-xs mb-1" style={{ color: HA.muted }}>{label}: {Math.max(0, Math.min(100, percent))}%</div>
    <div className="h-2 rounded-full" style={{ backgroundColor: HA.bg, border: `1px solid ${HA.border}` }}>
      <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: HA.accent }} />
    </div>
  </div>
);

const BottomHUD: React.FC<{ hydration: number; calories: number; morale: number; mss: number; weightPct: number }>= (p) => (
  <Card className="p-3 mt-4">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <StatusBar label="Hydration" percent={p.hydration} />
      <StatusBar label="Calories" percent={p.calories} />
      <StatusBar label="Morale" percent={p.morale} />
      <StatusBar label="MSS alignment" percent={p.mss} />
      <StatusBar label="Pack weight (limit %)" percent={p.weightPct} />
    </div>
  </Card>
);

// ---------- Scene 0: Intro ----------
const SceneIntro: React.FC<{ onStart: () => void }>= ({ onStart }) => (
  <Shell title="Scene 0 · Introduction">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Card className="md:col-span-2 p-6">
        <h1 className="text-2xl font-bold mb-2">Ready72 — Learn to prepare for seventy-two hours</h1>
        <p style={{ color: HA.muted }} className="mb-3">This experience uses the Minimum Survival Standard. It shows how to plan and make good choices during an emergency.</p>
        <GradientBar />
        <ul className="mt-4 text-[15px] space-y-1" style={{ color: HA.muted }}>
          <li>You will see simple ideas first. You will add skills as you play.</li>
          <li>Every item fits into a survival category like Water, Food, or Shelter.</li>
          <li>Your choices change your speed, energy, and safety.</li>
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={onStart} className="px-4 py-2 rounded-lg font-semibold hover:brightness-110" style={{ backgroundColor: HA.accent, color: HA.text }}>Start</button>
          <button className="px-4 py-2 rounded-lg" style={{ border: `1px solid ${HA.border}` }}>What is the Minimum Survival Standard?</button>
        </div>
      </Card>
      <AdvisorChat
        lines={[
          "Welcome to Ready72.",
          "You will choose a profile and see a simple risk preview.",
          "Balanced gear is better than carrying too much weight.",
        ]}
      />
    </div>
  </Shell>
);

// ---------- Scene 1: Persona Cards ----------
const PERSONA: Array<{key: 'EC'|'PR'; title: string; cash: number; blurb: string; stats: string[];}> = [
  { key: 'EC', title: 'Everyday Civilian', cash: 300, blurb: 'Older store-bought kit. Some parts may be missing. You learn as you go.', stats: ['Start level: about ten to twenty percent of the standard', 'Bag limit: about ten percent of your body weight', 'Morale: low at first, improves after small wins']},
  { key: 'PR', title: 'Prepper', cash: 150, blurb: 'Fitter but often carries too much. Strong early. Slows down later.', stats: ['Start level: about sixty to seventy percent of the standard', 'Bag limit: about fifteen to twenty percent of your body weight', 'Heavy bags slow you down']},
];

const ScenePersona: React.FC<{ onContinue: (persona: 'EC'|'PR', cash: number) => void }>= ({ onContinue }) => {
  const [picked, setPicked] = useState<'EC'|'PR'|'RAND'|null>(null);
  return (
    <Shell title="Scene 1 · Choose your profile">
      <div className="mb-3">
        <CommandHUD
          show={true}
          persona={picked==='PR'?'PR':'EC'}
          cash={picked==='PR'?150:300}
          region="Not set yet"
          hoursRemain={72}
          mssPercent={picked==='PR'?65:15}
          promptLines={[
            'Tip: Most people can carry about ten to twenty percent of their body weight.',
            'Buying water and a simple filter improves safety quickly.',
            'Heavy bags reduce travel speed and can lower morale.',
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AdvisorChat
          lines={[
            "Choose a profile or let the system pick for you.",
            "Everyday Civilian starts with more cash and less gear.",
            "Prepper starts with more gear and less cash.",
          ]}
        />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PERSONA.map(p => (
            <button
              key={p.key}
              onClick={() => setPicked(p.key)}
              className="text-left rounded-2xl p-4 transition"
              style={{ backgroundColor: HA.surface, border: `1px solid ${picked===p.key? HA.accent : HA.border}` }}
            >
              <div className="text-lg font-semibold">{p.title}</div>
              <div className="text-sm mt-1" style={{ color: HA.muted }}>{p.blurb}</div>
              <div className="mt-3 text-xs uppercase tracking-wide" style={{ color: HA.muted }}>Key facts</div>
              <ul className="mt-1 text-sm list-disc pl-5 space-y-1" style={{ color: HA.text }}>
                {p.stats.map((s,i)=>(<li key={i}>{s}</li>))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <GradientBar />
                <div className="text-sm font-semibold ml-3">Cash on hand: ${p.cash}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 flex items-center justify-between">
        <button onClick={()=>setPicked('RAND')} className="px-4 py-2 rounded-lg hover:brightness-110" style={{ border: `1px solid ${HA.border}` }}>Pick for me</button>
        <button
          disabled={!picked}
          onClick={()=> onContinue((picked==='PR'?'PR':'EC'), picked==='PR'?150:300)}
          className="px-4 py-2 rounded-lg font-semibold"
          style={{ backgroundColor: picked? HA.accent : HA.border, color: HA.text, opacity: picked? 1 : 0.6 }}
        >Continue to briefing</button>
      </div>
    </Shell>
  );
};

// ---------- Scene 2: Briefing ----------
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        <AdvisorChat
          lines={[
            "Choose a plan: Evacuate now, Monitor conditions, or Stock up locally.",
            "You will go to your loadout next to adjust your kit.",
          ]}
        />
        <Card className="md:col-span-2 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-lg font-semibold">Severe Flood Watch — example region</div>
            <div style={{ color: HA.muted }} className="text-sm">About twelve hours until the worst conditions</div>
          </div>
          <div className="mt-3"><GradientBar /></div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video rounded-xl grid place-items-center text-sm" style={{ backgroundColor: HA.bg, border: `1px solid ${HA.border}`, color: HA.muted }}>
              Map preview area (placeholder)
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: HA.bg, border: `1px solid ${HA.border}` }}>
              <div className="text-xs uppercase tracking-wide mb-2" style={{ color: HA.muted }}>Choose a plan</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="rounded-lg font-semibold px-3 py-2 hover:brightness-110" style={{ backgroundColor: HA.accent, color: HA.text }}>Evacuate now</button>
                <button className="rounded-lg px-3 py-2" style={{ border: `1px solid ${HA.border}` }}>Monitor conditions</button>
                <button className="rounded-lg px-3 py-2" style={{ border: `1px solid ${HA.border}` }}>Stock up locally</button>
              </div>
              <ul className="mt-3 text-sm space-y-1" style={{ color: HA.muted }}>
                <li>Evacuate now: faster travel and more shelter space.</li>
                <li>Monitor conditions: save money and time but risk being late.</li>
                <li>Stock up locally: better supplies but more weight and time.</li>
              </ul>
              <div className="mt-4 flex justify-end">
                <button onClick={onAdvance} className="px-4 py-2 rounded-lg font-semibold hover:brightness-110" style={{ backgroundColor: HA.accent, color: HA.text }}>Go to loadout</button>
              </div>
            </div>
          </div>

          <BottomHUD hydration={62} calories={55} morale={50} mss={persona==='PR'?65:20} weightPct={persona==='PR'?18:12} />
        </Card>
      </div>
    </Shell>
  );
};

// ---------- Demo Container ----------
export default function Ready72WireframesV03() {
  const [scene, setScene] = useState<0|1|2>(0);
  const [persona, setPersona] = useState<'EC'|'PR'>('EC');
  const [cash, setCash] = useState<number>(300);

  return (
    <div className="p-2">
      <div className="mb-3 flex gap-2 text-sm">
        <button onClick={()=>setScene(0)} className="px-3 py-1.5 rounded-md" style={{ border: `1px solid ${HA.border}`, color: scene===0? HA.accent : HA.text }}>Intro</button>
        <button onClick={()=>setScene(1)} className="px-3 py-1.5 rounded-md" style={{ border: `1px solid ${HA.border}`, color: scene===1? HA.accent : HA.text }}>Persona</button>
        <button onClick={()=>setScene(2)} className="px-3 py-1.5 rounded-md" style={{ border: `1px solid ${HA.border}`, color: scene===2? HA.accent : HA.text }}>Briefing</button>
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
