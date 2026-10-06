"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/use-i18n"

/**
 * A large, high-contrast text card intended to be shown to the other person
 * in the conversation as a text-only fallback.
 */
export function TextCard({
  open,
  phrase,
  onClose,
}: {
  open: boolean
  phrase: string
  onClose: () => void
}) {
  const { t } = useI18n()
  const s = t.studio.textCard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {s.title}
        </span>
        <Button variant="ghost" size="icon-lg" aria-label={s.close} onClick={onClose} autoFocus>
          <X />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <p dir="auto" className="max-w-4xl text-center text-4xl leading-tight font-bold text-balance text-foreground sm:text-6xl">
          {phrase || s.empty}
        </p>
      </div>
      <p className="pb-8 text-center text-sm text-muted-foreground">
        {s.hint}
      </p>
    </div>
  )
}
