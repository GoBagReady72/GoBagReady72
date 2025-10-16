// api/admin-guard.ts
// Type-safe admin guard for Vercel Edge/Node without @types/node.
// Avoids TS18048 ("process.env is possibly undefined") by using optional chaining + fallbacks.

type HeadersInitKV = Record<string, string>;

function env(name: string, fallback = ""): string {
  // Optional-chain process and env to avoid strict TS errors in edge builds.
  // Works even when process is not defined in the runtime type space.
  const v = (typeof process !== "undefined" ? process?.env?.[name] : undefined);
  return (v ?? fallback).trim();
}

const ORIGIN_ALLOWLIST = env("ORIGIN_ALLOWLIST", "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const ADMIN_SECRET = env("ADMIN_SECRET", "");

/** Gets the request Origin header (empty string if not present). */
export function getRequestOrigin(req: Request): string {
  return req.headers.get("origin") ?? "";
}

/** Returns the allowed origin if present in allowlist, else null. */
export function getAllowedOrigin(req: Request): string | null {
  const origin = getRequestOrigin(req);
  if (ORIGIN_ALLOWLIST.length === 0) return null;
  return ORIGIN_ALLOWLIST.includes(origin) ? origin : null;
}

/** True if the request includes the correct admin secret header. */
export function isAuthorized(req: Request): boolean {
  // If no ADMIN_SECRET is configured, always unauthorized.
  if (!ADMIN_SECRET) return false;
  const provided = req.headers.get("x-admin-secret") ?? "";
  return provided === ADMIN_SECRET;
}

/** Adds CORS headers for a given origin (or '*' if none supplied). */
export function withCORS(res: Response, origin: string | null): Response {
  const corsOrigin = origin ?? "*";
  const headers: HeadersInitKV = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-admin-secret",
    "Access-Control-Max-Age": "600",
  };
  const merged = new Headers(res.headers);
  for (const [k, v] of Object.entries(headers)) merged.set(k, v);
  return new Response(res.body, { status: res.status, headers: merged });
}

/** Handles CORS preflight. Return a Response to short-circuit; otherwise null. */
export function handlePreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  const origin = getAllowedOrigin(req) ?? getRequestOrigin(req) || "*";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, x-admin-secret",
      "Access-Control-Max-Age": "600",
    },
  });
}

/** Guard helper for POST-only admin endpoints. */
export async function guardPOST(req: Request, handler: () => Promise<Response> | Response): Promise<Response> {
  // Preflight first
  const pre = handlePreflight(req);
  if (pre) return pre;

  // Method check
  if (req.method !== "POST") {
    return withCORS(new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }), getAllowedOrigin(req));
  }

  // Origin check: allow only configured origins (if any configured)
  const allowed = getAllowedOrigin(req);
  if (ORIGIN_ALLOWLIST.length > 0 && !allowed) {
    return withCORS(new Response(JSON.stringify({ ok: false, error: "forbidden_origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }), null);
  }

  // Auth check
  if (!isAuthorized(req)) {
    return withCORS(new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }), allowed);
  }

  // Run the handler
  const res = await handler();
  return withCORS(res, allowed);
}
