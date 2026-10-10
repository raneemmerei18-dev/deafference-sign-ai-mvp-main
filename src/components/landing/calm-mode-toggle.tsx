"use client"

import { motion } from "framer-motion"
import { Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useCalmMode } from "./calm-mode"
import { focusRingPop } from "./ui/pop"

// Reduces motion across the landing page (see calm-mode.tsx). Pages that reuse
// the navbar without the landing provider (e.g. /terms) simply don't show it.
export function CalmModeToggle({ className, labelClassName }: { className?: string; labelClassName?: string }) {
  const ctx = useCalmMode()
  const { t, dir } = useI18n()
  if (!ctx) return null
  const { calm, setCalm } = ctx
  const knobX = (calm ? 18 : 3) * (dir === "rtl" ? -1 : 1)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={calm}
      aria-label={t.landing.calm.ariaLabel}
      onClick={() => setCalm(!calm)}
      className={cn(
        "glass-pop inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:text-foreground",
        focusRingPop,
        className,
      )}
    >
      <Sun className="size-4 text-[#C2410C]" aria-hidden="true" />
      <span className={labelClassName}>{t.landing.calm.label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300",
          calm ? "bg-[#2563EB]" : "bg-[color:var(--primary)]/20",
        )}
      >
        <motion.span
          className="inline-block size-3.5 rounded-full bg-white shadow-sm"
          animate={{ x: knobX }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  )
}

