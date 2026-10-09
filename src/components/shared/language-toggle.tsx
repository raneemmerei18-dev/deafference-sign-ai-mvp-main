"use client"

import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

/** Compact EN / عربي switch backed by the existing `settings.language` preference. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()
  const next = locale === "ar" ? "en" : "ar"

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={t.common.language.switchTo}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-border bg-background/70 px-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden="true" />
      <span lang={next}>{t.common.language.shortOther}</span>
    </button>
  )
}
