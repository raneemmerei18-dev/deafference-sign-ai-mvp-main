"use client"

import { useRef } from "react"
import { AlertCircle, Eraser, FileText, Keyboard, Mic, MicOff, Sparkles, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useSettings } from "./settings-provider"
import type { Status } from "./data"
import type { RecognitionErrorCode } from "./use-speech-recognition"

type Mode = "speak" | "type"

const WAVE_BARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MODES: Mode[] = ["speak", "type"]

export type SpeechInputState = {
  /** `null` while unknown (before mount). */
  supported: boolean | null
  listening: boolean
  interim: string
  error: RecognitionErrorCode | null
  start: () => void
  stop: () => void
}

export function InputPanel({
  mode,
  setMode,
  input,
  setInput,
  status,
  speech,
  onTranslate,
  onClear,
  onShowTextCard,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  input: string
  setInput: (v: string) => void
  status: Status
  speech: SpeechInputState
  onTranslate: () => void
  onClear: () => void
  onShowTextCard: () => void
}) {
  const { settings } = useSettings()
  const { t, fmt, locale, dir } = useI18n()
  const s = t.studio.input
  const big = settings.largeButtons
  const listening = speech.listening
  const busy = status === "understanding" || status === "preparing"
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({ speak: null, type: null })

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const nativeComposing = (e.nativeEvent as unknown as { isComposing?: boolean }).isComposing || e.keyCode === 229
    if (e.key === "Enter" && !e.shiftKey && !nativeComposing) {
      e.preventDefault()
      onTranslate()
    }
  }

  function handleTabKey(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight"
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft"
    let next = index
    if (e.key === forward) next = index + 1
    else if (e.key === back) next = index - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = MODES.length - 1
    else return
    e.preventDefault()
    const target = MODES[(next + MODES.length) % MODES.length]
    setMode(target)
    tabRefs.current[target]?.focus()
  }

  const speechError = speech.error ? s.errors[speech.error] : null

  return (
    <div className="flex h-full flex-col gap-5">
      <div role="tablist" aria-label={s.tablist} className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {MODES.map((m, index) => (
          <button
            key={m}
            ref={(node) => {
              tabRefs.current[m] = node
            }}
            type="button"
            role="tab"
            id={`avatar-input-tab-${m}`}
            aria-selected={mode === m}
            aria-controls="avatar-input-panel"
            tabIndex={mode === m ? 0 : -1}
            onClick={() => setMode(m)}
            onKeyDown={(e) => handleTabKey(e, index)}
            className={cn(
              "flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "speak" ? <Mic className="size-4" aria-hidden="true" /> : <Keyboard className="size-4" aria-hidden="true" />}
            {m === "speak" ? s.speak : s.type}
          </button>
        ))}
      </div>

      <div id="avatar-input-panel" role="tabpanel" aria-labelledby={`avatar-input-tab-${mode}`} className="flex flex-1 flex-col">
        {mode === "speak" ? (
          speech.supported === false ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border p-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                <MicOff className="size-6 text-muted-foreground" aria-hidden="true" />
              </span>
              <p className="text-sm text-muted-foreground text-balance">{s.unsupported}</p>
              <Button variant="outline" className="h-10" onClick={() => setMode("type")}>
                <Keyboard aria-hidden="true" />
                {s.typeInstead}
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 py-2">
              <div className="relative flex items-center justify-center">
                {listening && (
                  <>
                    <span className="absolute size-36 animate-ping rounded-full bg-brand-orange/20 [animation-duration:1.6s]" />
                    <span className="absolute size-32 rounded-full bg-brand-orange/10" />
                  </>
                )}
                <button
                  type="button"
                  aria-label={listening ? s.stopListening : s.startListening}
                  aria-pressed={listening}
                  disabled={speech.supported === null || busy}
                  onClick={listening ? speech.stop : speech.start}
                  className={cn(
                    "brand-gradient relative flex size-24 items-center justify-center rounded-full text-white shadow-lg transition-transform focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60",
                    listening ? "scale-105 brand-glow" : "hover:scale-105 active:scale-95",
                  )}
                >
                  {listening ? <Square className="size-9" aria-hidden="true" /> : <Mic className="size-10" aria-hidden="true" />}
                </button>
              </div>

              <div
                aria-hidden="true"
                className={cn("flex h-7 items-center gap-1 transition-opacity", listening ? "opacity-100" : "opacity-30")}
              >
                {WAVE_BARS.map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-brand-red"
                    style={{
                      height: listening ? "100%" : "22%",
                      animation: listening ? `waveform-bounce ${0.7 + (i % 4) * 0.18}s ease-in-out ${i * 0.05}s infinite` : "none",
                    }}
                  />
                ))}
              </div>

              <div aria-live="polite" className="w-full space-y-2 text-center">
                <p className="text-sm font-medium text-foreground">{listening ? s.listeningNow : s.tapToSpeak}</p>
                <p className="text-xs text-muted-foreground">
                  {fmt(s.listeningIn, { language: locale === "ar" ? s.arabic : s.english })}
                </p>
                {(listening || speech.interim) && speech.interim ? (
                  <p dir="auto" className="rounded-xl bg-muted/70 px-3 py-2 text-start text-sm text-foreground">
                    <span className="block text-xs font-semibold text-muted-foreground">{s.heard}</span>
                    {speech.interim}
                  </p>
                ) : null}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-1 flex-col">
            <label htmlFor="avatar-phrase" className="sr-only">
              {s.label}
            </label>
            <textarea
              id="avatar-phrase"
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={s.placeholder}
              rows={5}
              aria-describedby="avatar-phrase-hint"
              className="w-full flex-1 resize-none rounded-xl border border-border bg-background p-4 text-base leading-relaxed text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
            <div id="avatar-phrase-hint" className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{s.hint}</span>
              <span>{fmt(s.chars, { count: input.length })}</span>
            </div>
          </div>
        )}

        {speechError ? (
          <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{speechError}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          onClick={onTranslate}
          disabled={input.trim().length === 0 || busy || listening}
          className={cn("brand-gradient w-full border-0 font-semibold text-white", big ? "h-14 text-lg" : "h-12 text-base")}
        >
          <Sparkles className="size-5" aria-hidden="true" />
          {s.translate}
        </Button>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" onClick={onClear} className={cn(big ? "h-12" : "h-10")}>
            <Eraser className="size-4" aria-hidden="true" />
            {s.clear}
          </Button>
          <Button variant="outline" onClick={onShowTextCard} className={cn("whitespace-normal", big ? "h-12" : "h-10")}>
            <FileText className="size-4" aria-hidden="true" />
            {s.showTextCard}
          </Button>
        </div>
      </div>
    </div>
  )
}
