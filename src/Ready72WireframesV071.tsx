// Ready72WireframesV071.tsx — IntroStart v0.7.3
// Robust start-at-Intro logic + URL override (?scene=0..5)
import React, { useMemo, useState } from 'react';

// Minimal stand-in layout so this file compiles even if other assets are present.
// Replace with your full v0.7.1 content; we only need to guarantee initial scene handling.

function Shell({children}:{children:React.ReactNode}){
  return <div style={{ color: '#fff', background:'#020817', minHeight:'100vh', padding:'24px', fontFamily:'ui-sans-serif,system-ui' }}>{children}</div>;
}

function SceneIntro({onStart}:{onStart:()=>void}){
  return (
    <Shell>
      <h1 style={{margin:0}}>GoBag: Ready72</h1>
      <p style={{color:'#9FB2C9'}}>72 Hours to Survive &amp; Thrive</p>
      <button onClick={onStart} style={{padding:'8px 12px'}}>Begin HazAssist Briefing</button>
    </Shell>
  );
}

function ScenePersona(){
  return (
    <Shell>
      <h2>Scene 1 · Choose Your Profile</h2>
      <p>Everyday Civilian or Prepper</p>
    </Shell>
  );
}

export default function Ready72WireframesV071(): JSX.Element {
  // Robust initial scene selection:
  const initialScene = useMemo<0|1|2|3|4|5>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('scene');
      if (fromQuery !== null) {
        const v = Number(fromQuery);
        if (Number.isFinite(v) && v >= 0 && v <= 5) return v as 0|1|2|3|4|5;
      }
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && /^\d$/.test(hash)) {
        const v = Number(hash);
        if (v >= 0 && v <= 5) return v as 0|1|2|3|4|5;
      }
    } catch {}
    return 0; // default: Intro
  }, []);

  const [scene, setScene] = useState<0|1|2|3|4|5>(initialScene);

  return (
    <div>
      {scene===0 && <SceneIntro onStart={()=>setScene(1)} />}
      {scene===1 && <ScenePersona />}
      {/* In your full file, keep Scenes 2–5 as-is */}
    </div>
  );
}