import * as React from "react";
export function Button({ className = "", disabled, onClick, children }: React.PropsWithChildren<{ className?: string; disabled?: boolean; onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
