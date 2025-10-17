Ready72 — Scene 0 · Introduction (Baseline Wireframe Spec)
======================================================
ExportTag: #R72-BWS-Scene0-Intro-v1

Purpose
- Canonical static intro screen; establish HazAssist look & MSS framing.

Files
- ready_72_scene_0_intro_pixel_rebuild.jsx  (approved pixel-lock)
- Ready72_Scene0_Intro_PixelLock.tsx        (canonical TSX; same layout, BWS header)

How to Preview
- Import the TSX in your app and render as root:
  import Scene from './Ready72_Scene0_Intro_PixelLock';
  export default function App(){ return <Scene/>; }

Layout Notes
- Tabs: Intro active
- Header row: 'GoBag: Ready72' (left), 'Scene 0 · Introduction' (right)
- Content grid ≈ 65/35: left intro card (dominant), right HazAssist advisor (narrow, top-aligned)
- Decorative progress bar: green→yellow→red; static

Canon Constraints
- No icons; text-only
- Keep advisor column capped (~360px max)
- Maintain HazAssist dark palette
