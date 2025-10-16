// src/lib/telemetry.ts
import type { TelemetryEvent } from "@/types/telemetry";

const ADMIN_TRACK_PROXY =
  (import.meta as any).env?.VITE_ADMIN_TRACK_PROXY ||
  "/api/track-proxy";

export async function postEvent(ev: TelemetryEvent, signal?: AbortSignal): Promise<{ ok: boolean }> {
  if (!ev?.session_id || !ev?.persona) {
    return Promise.reject(new Error("TelemetryEvent missing required fields: session_id and/or persona"));
  }
  const res = await fetch(ADMIN_TRACK_PROXY, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(ev),
    signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`track-proxy HTTP ${res.status} ${text}`);
  }
  return { ok: true };
}
