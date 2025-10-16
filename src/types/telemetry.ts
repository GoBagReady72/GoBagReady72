// src/types/telemetry.ts
export type GameVersion = `r72-game v${number}.${number}.${number}`;
export type TelemetryOutcome = "win" | "loss" | "info";

export type TelemetryEvent = {
  session_id: string;
  persona: string;
  category: string;
  outcome: TelemetryOutcome;
  timestamp_iso?: string;
  region?: import("../config/regions").RegionId;
  ko_event?: string;
  bag_weight_kg?: number;
  total_kcal?: number;
  mss_score?: number;
  game_version?: GameVersion;
};
