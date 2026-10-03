"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sun } from "lucide-react"
import { cn } from "@/lib/utils"

// Visual-only for now: flips a local switch with a smooth spring knob, but
// doesn't (yet) dim motion or contrast site-wide. Wiring that up is a
// separate, larger pass beyond the hero.
export function CalmModeToggle({ className }: { className?: string }) {
  const [calm, setCalm] = useState(false)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={calm}
      onClick={() => setCalm((v) => !v)}
      className={cn(
        "glass-pop inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun className="size-4 text-brand-orange" aria-hidden="true" />
      <span className="hidden sm:inline">Calm mode</span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300",
          calm ? "bg-[color:var(--primary)]" : "bg-[color:var(--primary)]/15",
        )}
      >
        <motion.span
          className="inline-block size-3.5 rounded-full bg-white shadow-sm"
          animate={{ x: calm ? 18 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  )
}
