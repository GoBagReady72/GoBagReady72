// api/track-proxy.js
// Game-side serverless function that forwards telemetry to Admin /api/track
// with the shared secret and an Origin header. CORS-friendly and minimal.

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  try {
    setCors(res);

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const ADMIN_TRACK_ENDPOINT =
      process.env.ADMIN_TRACK_ENDPOINT || "https://admin.gobagready72.com/api/track";
    const ADMIN_SHARED_SECRET = process.env.ADMIN_SHARED_SECRET || "";
    const FORWARDED_ORIGIN =
      process.env.FORWARDED_ORIGIN || "https://beta.gobagready72.com";

    if (!ADMIN_SHARED_SECRET) {
      return res
        .status(500)
        .json({ error: "SERVER_MISCONFIG", message: "Missing ADMIN_SHARED_SECRET" });
    }

    // Parse body safely (Vercel may give you an object already)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {
        return res.status(400).json({ error: "BAD_JSON" });
      }
    }
    body = body || {};

    // Minimal contract check (don’t be too strict)
    const required = ["session_id", "persona", "category", "outcome"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: `Missing required fields: ${missing.join(", ")}`
      });
    }

    // Forward to Admin
    const fwd = await fetch(ADMIN_TRACK_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-secret": ADMIN_SHARED_SECRET,
        "Origin": FORWARDED_ORIGIN
      },
      body: JSON.stringify(body)
    });

    const text = await fwd.text();
    res.status(fwd.status);
    res.setHeader("Content-Type", fwd.headers.get("content-type") || "application/json; charset=utf-8");
    return res.send(text);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "PROXY_ERROR", message: (err && err.message) || String(err) });
  }
}
