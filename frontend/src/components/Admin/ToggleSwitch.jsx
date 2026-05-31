import React from "react";
import { cn } from "./utils";
import { Loader2 } from "lucide-react";

export function ToggleSwitch({ checked, disabled = false, onChange, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 p-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        checked ? "bg-green-500" : "bg-slate-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span className="sr-only">Toggle station status</span>
      
      {/* Track */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute h-full w-full rounded-full transition-colors duration-200"
        )}
      />
      
      {/* Thumb */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out flex items-center justify-center",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      >
        {disabled && (
          <Loader2 className="h-3 w-3 animate-spin text-slate-600" />
        )}
      </span>
    </button>
  );
}
