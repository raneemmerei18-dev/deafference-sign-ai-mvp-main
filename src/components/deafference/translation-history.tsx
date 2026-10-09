"use client"

import { useEffect, useId, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  AudioLines,
  Check,
  Copy,
  Hand,
  History as HistoryIcon,
  Info,
  MessageSquareText,
  Play,
  Search,
  Settings2,
  Square,
  Trash2,
  Volume2,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Loading } from "@/components/shared/loading"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useSettings } from "./settings-provider"
import { useIsClient } from "./hooks"
import { clearTranslationHistory, removeHistoryEntry, useTranslationHistory, type HistoryEntry, type HistoryMode } from "./history-store"
import { useSpeechSynthesis } from "./use-speech-synthesis"

type Filter = "all" | HistoryMode

const FILTERS: Filter[] = ["all", "avatar", "speech", "sign"]
const MODE_ICON: Record<HistoryMode, typeof Hand> = { avatar: MessageSquareText, speech: AudioLines, sign: Hand }
const ARABIC = /[؀-ۿ]/

type Notice = { tone: "success" | "error"; text: string } | null

/** On-device translation history (/history). Reads the localStorage-backed history store. */
export function TranslationHistory() {
  const { t, fmt, locale } = useI18n()
  const s = t.studio.history
  const { settings } = useSettings()
  const entries = useTranslationHistory()
  const isClient = useIsClient()
  const router = useRouter()
  const speech = useSpeechSynthesis()
  const ids = useId()

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(id)
  }, [notice])

  useEffect(() => {
    if (!speech.speaking) setSpeakingId(null)
  }, [speech.speaking])

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return entries.filter(
      (entry) =>
        (filter === "all" || entry.mode === filter) &&
        (!needle || entry.input.toLocaleLowerCase().includes(needle) || entry.output?.toLocaleLowerCase().includes(needle)),
    )
  }, [entries, filter, query])

  function replay(entry: HistoryEntry) {
    if (entry.mode === "avatar") {
      router.push(`/translate?mode=avatar&text=${encodeURIComponent(entry.input)}`)
      return
    }
    if (speakingId === entry.id) {
      speech.stop()
      return
    }
    const ok = speech.speak(entry.input, { lang: ARABIC.test(entry.input) ? "ar-SA" : "en-US" })
    if (ok) setSpeakingId(entry.id)
    else setNotice({ tone: "error", text: s.speechFailed })
  }

  async function copy(entry: HistoryEntry) {
    const text = entry.output && entry.output !== entry.input ? `${entry.input}\n${entry.output}` : entry.input
    try {
      await navigator.clipboard.writeText(text)
      setNotice({ tone: "success", text: s.copied })
    } catch {
      setNotice({ tone: "error", text: s.copyFailed })
    }
  }

  function remove(entry: HistoryEntry) {
    if (speakingId === entry.id) speech.stop()
    removeHistoryEntry(entry.id)
    setNotice({ tone: "success", text: s.deleted })
  }

  function clearAll() {
    speech.stop()
    clearTranslationHistory()
    setConfirmOpen(false)
    setNotice({ tone: "success", text: s.cleared })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{s.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{s.description}</p>
        </div>
        {isClient && entries.length > 0 ? (
          <Button variant="destructive" onClick={() => setConfirmOpen(true)} className="h-10 px-4">
            <Trash2 aria-hidden="true" />
            {s.clearAll}
          </Button>
        ) : null}
      </div>

      <p className="flex items-start gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {s.deviceNote}
      </p>

      {!settings.sessionHistoryEnabled ? (
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-brand-orange" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-foreground">{s.disabledTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.disabledBody}</p>
            </div>
          </div>
          <Link href="/settings" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
            <Settings2 aria-hidden="true" />
            {s.disabledCta}
          </Link>
        </Card>
      ) : null}

      <div role="status" aria-live="polite" className="min-h-0">
        {notice ? (
          <p
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
              notice.tone === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive",
            )}
          >
            {notice.tone === "success" ? <Check className="size-4" aria-hidden="true" /> : <AlertCircle className="size-4" aria-hidden="true" />}
            {notice.text}
          </p>
        ) : null}
      </div>

      {!isClient ? (
        <div>
          <Loading />
          <p className="sr-only">{s.loading}</p>
        </div>
      ) : entries.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <HistoryIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">{s.emptyTitle}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{s.emptyBody}</p>
          <Link href="/translate" className={cn(buttonVariants(), "brand-gradient mt-2 h-10 border-0 px-5 text-white")}>
            {s.emptyCta}
          </Link>
        </Card>
      ) : (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <label htmlFor={`${ids}-search`} className="sr-only">
                {s.searchLabel}
              </label>
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id={`${ids}-search`}
                type="search"
                dir="auto"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s.searchPlaceholder}
                className="h-11 w-full rounded-xl border border-input bg-background ps-9 pe-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
              />
            </div>
            <div role="group" aria-label={s.filterLabel} className="flex flex-wrap gap-1.5">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "min-h-10 rounded-full px-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    filter === value ? "bg-foreground text-background" : "border border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.filters[value]}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
            {visible.length === 1 ? s.countOne : fmt(s.count, { count: visible.length })}
          </p>

          {visible.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              {s.noResults}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {visible.map((entry) => {
                const Icon = MODE_ICON[entry.mode]
                const speakingThis = speakingId === entry.id && speech.speaking
                return (
                  <li key={entry.id} className="rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-semibold text-foreground">
                            <Icon className="size-3.5" aria-hidden="true" />
                            {s.filters[entry.mode]}
                          </span>
                          <time dateTime={entry.createdAt}>{dateFormat.format(new Date(entry.createdAt))}</time>
                        </div>
                        <p dir="auto" className="mt-1.5 text-base font-medium break-words text-foreground">
                          {entry.input}
                        </p>
                        {entry.output && entry.output !== entry.input ? (
                          <p dir="auto" className="mt-0.5 text-sm break-words text-muted-foreground">
                            <span className="font-semibold">{s.output}:</span> {entry.output}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-1.5">
                        {entry.mode !== "sign" ? (
                          <Button variant="outline" onClick={() => replay(entry)} className="h-10 px-3">
                            {entry.mode === "avatar" ? (
                              <Play className="rtl:-scale-x-100" aria-hidden="true" />
                            ) : speakingThis ? (
                              <Square aria-hidden="true" />
                            ) : (
                              <Volume2 className="rtl:-scale-x-100" aria-hidden="true" />
                            )}
                            {entry.mode === "avatar" ? s.replayAvatar : speakingThis ? s.stopSpeech : s.replaySpeech}
                          </Button>
                        ) : null}
                        <Button variant="outline" onClick={() => copy(entry)} className="h-10 px-3">
                          <Copy aria-hidden="true" />
                          {s.copy}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => remove(entry)}
                          aria-label={fmt(s.deleteLabel, { text: entry.input.length > 40 ? `${entry.input.slice(0, 40)}…` : entry.input })}
                          className="h-10 px-3 text-destructive hover:text-destructive"
                        >
                          <Trash2 aria-hidden="true" />
                          <span className="sm:sr-only">{s.delete}</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} title={s.confirmTitle} description={s.confirmBody}>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)} className="h-10 px-4">
            {s.confirmCancel}
          </Button>
          <Button variant="destructive" onClick={clearAll} className="h-10 px-4">
            <Trash2 aria-hidden="true" />
            {s.confirmClear}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
