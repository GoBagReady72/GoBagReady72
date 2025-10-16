// Ready72WireframesV071.tsx — IntroStart Fix
import React, { useState } from 'react';

export default function Ready72WireframesV071(): JSX.Element {
  // ✅ Start at Intro (scene 0) instead of Persona (scene 1)
  const [scene, setScene] = useState<0|1|2|3|4|5>(0);

  return (
    <div style={{ color: 'white', background: '#001F3F', minHeight: '100vh', padding: '2rem' }}>
      {scene === 0 && (
        <div>
          <h1>GoBag: Ready72</h1>
          <p>72 Hours to Survive & Thrive</p>
          <button onClick={() => setScene(1)}>Begin HazAssist Briefing</button>
        </div>
      )}
      {scene === 1 && (
        <div>
          <h2>Scene 1: Choose Your Profile</h2>
          <p>Everyday Civilian or Prepper</p>
        </div>
      )}
    </div>
  );
}