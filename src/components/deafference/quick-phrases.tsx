"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { CATEGORIES, QUICK_PHRASES, type CategoryId } from "./data"

/**
 * Phrase picker for the demo sign library. `onSelect` receives the canonical
 * (English) library phrase; buttons show it in the UI language.
 */
export function QuickPhrases({
  activeCategory,
  setCategory,
  onSelect,
  heading,
  description,
  compact = false,
}: {
  activeCategory: CategoryId
  setCategory: (c: CategoryId) => void
  onSelect: (phrase: string) => void
  heading?: string
  description?: string
  compact?: boolean
}) {
  const { t } = useI18n()
  const s = t.studio.quick
  const headingId = useId()
  const group = QUICK_PHRASES.find((g) => g.id === activeCategory) ?? QUICK_PHRASES[0]
  const title = heading ?? s.heading
  const body = description === undefined ? s.description : description

  return (
    <section aria-labelledby={headingId} className="scroll-mt-20">
      <div className={cn("mb-4", compact ? "text-start" : "text-center")}>
        <h2
          id={headingId}
          className={cn("font-semibold tracking-tight text-balance", compact ? "text-base" : "text-2xl sm:text-3xl")}
        >
          {title}
        </h2>
        {body ? (
          <p className={cn("mt-1.5 text-pretty text-muted-foreground", compact ? "text-sm" : "mx-auto max-w-lg")}>{body}</p>
        ) : null}
      </div>

      <div
        role="group"
        aria-label={s.categoryLabel}
        className={cn("mb-4 flex flex-wrap gap-2", compact ? "justify-start" : "justify-center")}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={activeCategory === c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              activeCategory === c.id
                ? "brand-gradient border-transparent text-white shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.studio.categories[c.id]}
          </button>
        ))}
      </div>

      <div className={cn("grid gap-3", compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
        {group.phrases.map((phrase) => (
          <button
            key={phrase}
            type="button"
            onClick={() => onSelect(phrase)}
            className={cn(
              "flex items-center justify-center rounded-2xl border border-border bg-card px-4 py-3 text-center font-semibold text-balance text-foreground shadow-sm transition-all hover:border-brand-orange/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-safe:hover:-translate-y-0.5",
              compact ? "min-h-12 text-sm" : "min-h-16 text-base",
            )}
          >
            {t.studio.phrases[phrase] ?? phrase}
          </button>
        ))}
      </div>
    </section>
  )
}
