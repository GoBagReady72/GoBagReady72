// If you use the Pages Router, use this API route.
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.METRICS_UPSTREAM;
  if (!base) return res.status(200).json({ message: "no METRICS_UPSTREAM set" });

  const r = await fetch(`${base.replace(/\/$/, "")}/metrics`, {
    headers: process.env.METRICS_API_KEY ? { Authorization: `Bearer ${process.env.METRICS_API_KEY}` } : {},
    cache: "no-store",
  });
  const json = await r.json();
  return res.status(200).json(json);
}
