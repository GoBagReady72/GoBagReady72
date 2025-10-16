// src/components/KOEConfirm.tsx
import React from "react";
import type { Region } from "@/config";

type Props = {
  region: Region;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function KOEConfirm({ region, onCancel, onConfirm }: Props) {
  return (
    <div role="dialog" aria-modal="true" style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "grid", placeItems: "center", padding: 16
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 20,
        maxWidth: 520, width: "100%", border: "1px solid #e5e7eb"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Kickoff Event</h2>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{region.kickoff.title}</div>
        <p style={{ marginTop: 0 }}>{region.kickoff.description}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "#111827", color: "#fff" }}>Continue</button>
        </div>
      </div>
    </div>
  );
}
