"use client"

import { BadgeCheck, Languages, Loader2, SearchX, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { SIGN_LIBRARY, type Status, type TranslationResult } from "./data"

function Field({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p dir="auto" className={cn("mt-1 text-pretty text-foreground", emphasize ? "text-lg font-semibold" : "text-base")}>
        {value}
      </p>
    </div>
  )
}

export function ResultPanel({
  result,
  status,
  noMatch = false,
}: {
  result: TranslationResult | null
  status: Status
  /** True when the last lookup found nothing in the demo library. */
  noMatch?: boolean
}) {
  const { t, fmt } = useI18n()
  const s = t.studio.result
  const working = status === "understanding" || status === "preparing"

  if (!result) {
    return (
      <div className="flex h-full flex-col">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{s.heading}</span>
        <div
          aria-live="polite"
          className={cn(
            "mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center",
            noMatch ? "border-destructive/40" : "border-border",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            {noMatch ? (
              <SearchX className="size-6 text-destructive" aria-hidden="true" />
            ) : working ? (
              <Loader2 className="size-6 text-muted-foreground motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <Languages className="size-6 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          {noMatch ? (
            <>
              <p className="text-sm font-semibold text-foreground text-balance">{s.noMatchTitle}</p>
              <p className="text-sm text-muted-foreground text-balance">{s.noMatchBody}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-balance">{working ? s.working : s.emptyIdle}</p>
          )}
        </div>
      </div>
    )
  }

  const display = t.studio.phrases[result.matchedSign] ?? result.matchedSign

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{s.heading}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {t.studio.categories[result.category]}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <Field label={s.original} value={result.original} />
        <Field label={s.matched} value={display} emphasize />
      </div>

      <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{s.match}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <BadgeCheck className={cn("size-4", result.matchType === "exact" ? "text-emerald-600" : "text-brand-orange")} aria-hidden="true" />
          {result.matchType === "exact" ? s.exact : fmt(s.close, { score: result.score })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field label={s.category} value={t.studio.categories[result.category]} />
        <Field label={s.source} value={fmt(s.sourceValue, { count: SIGN_LIBRARY.length })} />
      </div>
    </div>
  )
}
