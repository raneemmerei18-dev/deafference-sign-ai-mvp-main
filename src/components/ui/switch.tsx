"use client"

import { cn } from "@/lib/utils"

export function Switch({
  id,
  checked,
  onChange,
  label,
  labelledBy,
  className,
}: {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** Accessible name. Omit when `labelledBy` points to a visible <label> instead. */
  label?: string
  labelledBy?: string
  className?: string
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        checked ? "brand-gradient" : "bg-muted",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  )
}
