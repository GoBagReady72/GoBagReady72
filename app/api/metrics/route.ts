// If you use the App Router, use this API route.
import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.METRICS_UPSTREAM;
  if (!base) {
    return NextResponse.json({ message: "no METRICS_UPSTREAM set" }, { status: 200 });
  }
  const r = await fetch(`${base.replace(/\/$/, "")}/metrics`, {
    headers: process.env.METRICS_API_KEY ? { Authorization: `Bearer ${process.env.METRICS_API_KEY}` } : {},
    cache: "no-store",
  });
  const json = await r.json();
  return NextResponse.json(json);
}
