// src/pages/Start.tsx
// Region → KOE selection page.
import React, { useMemo, useState } from "react";
import { REGIONS, REGION_BY_ID, type RegionId, type Region } from "@/config";
import RegionCard from "@/components/RegionCard";
import KOEConfirm from "@/components/KOEConfirm";
import { postEvent } from "@/lib/telemetry";

export default function StartPage() {
  const [selected, setSelected] = useState<RegionId | null>(null);
  const region = useMemo(() => (selected ? REGION_BY_ID[selected] : null), [selected]);
  const [showKOE, setShowKOE] = useState(false);

  async function handleConfirm() {
    if (!region) return;
    try {
      await postEvent({
        session_id: crypto.randomUUID(),
        persona: "everyday_female", // TODO: replace with actual persona state
        category: "region_select",
        outcome: "info",
        region: region.id,
        ko_event: region.kickoff.id,
        game_version: "r72-game v0.3.0"
      });
    } catch {
      // non-fatal
    }
    setShowKOE(false);
    alert(`Selected: ${region.name} – ${region.kickoff.title}\n(Navigation to Store will be wired next step.)`);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 20, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ marginTop: 0 }}>Choose Your Region</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Pick where your scenario begins. Each region has a kickoff event and different hazard multipliers.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {REGIONS.map((r: Region) => (
          <RegionCard key={r.id} region={r} selected={selected === r.id} onSelect={setSelected} />
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          disabled={!selected}
          onClick={() => setShowKOE(true)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #111827",
            background: selected ? "#111827" : "#e5e7eb",
            color: selected ? "#fff" : "#9ca3af",
            cursor: selected ? "pointer" : "not-allowed",
            fontWeight: 600
          }}
        >
          Review Kickoff Event
        </button>
        <button
          onClick={() => setSelected(null)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}
        >
          Reset
        </button>
      </div>

      {showKOE && region ? (
        <KOEConfirm region={region} onCancel={() => setShowKOE(false)} onConfirm={handleConfirm} />
      ) : null}
    </div>
  );
}
