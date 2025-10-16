// src/components/RegionCard.tsx
import React from "react";
import type { Region } from "@/config";

type Props = {
  region: Region;
  selected?: boolean;
  onSelect?: (id: Region["id"]) => void;
};

export default function RegionCard({ region, selected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect?.(region.id)}
      aria-pressed={selected}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 12,
        padding: 16,
        border: selected ? "2px solid #111827" : "1px solid #d1d5db",
        background: selected ? "#4338ca" : "#ffffff",
        color: selected ? "#ffffff" : "#111827",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{region.name}</div>
      <div style={{ fontSize: 13, opacity: 0.9 }}>
        <strong>{region.kickoff.title}:</strong> {region.kickoff.description}
      </div>
      {region.notes ? (
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>{region.notes}</div>
      ) : null}
    </button>
  );
}
