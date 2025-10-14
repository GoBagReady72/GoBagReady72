import * as React from "react";
export function Badge({ className = "", children, variant = "secondary" }: React.PropsWithChildren<{ className?: string; variant?: "secondary" | "default" }>) {
  const base = variant === "secondary" ? "bg-slate-100 text-slate-700" : "bg-slate-900 text-white";
  return <span className={`text-xs px-2 py-1 rounded ${base} ${className}`}>{children}</span>;
}
