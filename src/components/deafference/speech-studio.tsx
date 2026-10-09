"use client"

import { useId, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Square, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useSettings } from "./settings-provider"
import { addHistoryEntry } from "./history-store"
import { QuickPhrases } from "./quick-phrases"
import { useSpeechSynthesis } from "./use-speech-synthesis"
import type { CategoryId } from "./data"

type VoiceLanguage = "en" | "ar" | "all"
type ToneId = "calm" | "neutral" | "clear"

const TONES: Record<ToneId, { rate: number; pitch: number }> = {
  calm: { rate: 0.85, pitch: 0.9 },
  neutral: { rate: 1, pitch: 1 },
  clear: { rate: 0.9, pitch: 1.1 },
}
const FALLBACK_LANG: Record<Exclude<VoiceLanguage, "all">, string> = { en: "en-US", ar: "ar-SA" }

const near = (a: number, b: number) => Math.abs(a - b) < 0.001

/** Text → Speech mode, using the browser's speech synthesis on this device. */
export function SpeechStudio() {
  const { t, fmt, locale } = useI18n()
  const s = t.studio.speech
  const { settings } = useSettings()
  const speech = useSpeechSynthesis()
  const ids = useId()

  const [text, setText] = useState("")
  const [language, setLanguage] = useState<VoiceLanguage>(locale)
  const [voiceURI, setVoiceURI] = useState("")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [category, setCategory] = useState<CategoryId>("General")

  const voices = useMemo(
    () => (language === "all" ? speech.voices : speech.voices.filter((voice) => voice.lang.toLowerCase().startsWith(language))),
    [speech.voices, language],
  )
  // A voice picked under another language filter falls back to the browser default.
  const selectedVoice = voices.some((voice) => voice.voiceURI === voiceURI) ? voiceURI : ""
  const tone = (Object.keys(TONES) as ToneId[]).find((id) => near(TONES[id].rate, rate) && near(TONES[id].pitch, pitch)) ?? null

  function speakText(value: string) {
    const trimmed = value.trim()
    speech.speak(trimmed, {
      voiceURI: selectedVoice || null,
      lang: language === "all" ? undefined : FALLBACK_LANG[language],
      rate,
      pitch,
      onStart: () => {
        if (settings.sessionHistoryEnabled) addHistoryEntry({ mode: "speech", input: trimmed })
      },
    })
  }

  function applyTone(id: ToneId) {
    setRate(TONES[id].rate)
    setPitch(TONES[id].pitch)
  }

  const statusIcon = speech.error ? AlertCircle : speech.voicesLoading ? Loader2 : speech.speaking ? Volume2 : CheckCircle2
  const StatusIcon = statusIcon
  const statusText = speech.error
    ? s.errors[speech.error]
    : speech.voicesLoading
      ? s.loadingVoices
      : speech.speaking
        ? s.speaking
        : s.ready

  if (speech.supported === false) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground">{s.heading}</h2>
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-4 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {s.unsupported}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col gap-4 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{s.heading}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          </div>

          <div>
            <label htmlFor={`${ids}-text`} className="mb-1.5 block text-sm font-medium text-foreground">
              {s.textLabel}
            </label>
            <Textarea
              id={`${ids}-text`}
              dir="auto"
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (speech.error === "empty") speech.clearError()
              }}
              placeholder={s.placeholder}
              rows={6}
              className="text-base"
              aria-describedby={`${ids}-count`}
            />
            <p id={`${ids}-count`} className="mt-1.5 text-end text-xs text-muted-foreground">
              {fmt(s.chars, { count: text.length })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => speakText(text)}
              disabled={speech.supported === null}
              className="brand-gradient h-11 min-w-32 border-0 px-5 text-base font-semibold text-white"
            >
              <Volume2 className="size-5 rtl:-scale-x-100" aria-hidden="true" />
              {s.listen}
            </Button>
            <Button variant="outline" onClick={speech.stop} disabled={!speech.speaking} className="h-11 min-w-28 px-5">
              <Square aria-hidden="true" />
              {s.stop}
            </Button>
          </div>

          <p
            role={speech.error ? "alert" : "status"}
            aria-live={speech.error ? "assertive" : "polite"}
            className={cn(
              "flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
              speech.error ? "border border-destructive/30 bg-destructive/10 text-destructive" : "bg-muted/70 text-foreground",
            )}
          >
            <StatusIcon
              className={cn("mt-0.5 size-4 shrink-0", speech.voicesLoading && !speech.error && "motion-safe:animate-spin")}
              aria-hidden="true"
            />
            <span>
              {statusText}
              {speech.speaking && speech.current ? (
                <span dir="auto" className="ms-1 text-muted-foreground">
                  “{speech.current.text.length > 80 ? `${speech.current.text.slice(0, 80)}…` : speech.current.text}”
                </span>
              ) : null}
            </span>
          </p>
        </Card>

        <Card className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <label htmlFor={`${ids}-lang`} className="mb-1.5 block text-sm font-medium text-foreground">
                {s.languageLabel}
              </label>
              <Select id={`${ids}-lang`} value={language} onChange={(e) => setLanguage(e.target.value as VoiceLanguage)}>
                <option value="en">{s.langEnglish}</option>
                <option value="ar">{s.langArabic}</option>
                <option value="all">{s.langAll}</option>
              </Select>
            </div>
            <div>
              <label htmlFor={`${ids}-voice`} className="mb-1.5 block text-sm font-medium text-foreground">
                {s.voiceLabel}
              </label>
              <Select
                id={`${ids}-voice`}
                value={selectedVoice}
                onChange={(e) => setVoiceURI(e.target.value)}
                disabled={speech.voicesLoading}
                aria-describedby={!speech.voicesLoading && voices.length === 0 ? `${ids}-novoices` : undefined}
              >
                <option value="">{s.defaultVoice}</option>
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {!speech.voicesLoading && voices.length === 0 ? (
            <p id={`${ids}-novoices`} className="-mt-2 text-xs text-muted-foreground">
              {s.noVoices}
            </p>
          ) : null}

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-foreground">{s.tone}</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TONES) as ToneId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tone === id}
                  onClick={() => applyTone(id)}
                  className={cn(
                    "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    tone === id ? "brand-gradient text-white shadow-sm" : "border border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.tones[id]}
                </button>
              ))}
              {tone === null ? (
                <span className="inline-flex min-h-10 items-center rounded-full border border-dashed border-border px-4 text-sm text-muted-foreground">
                  {s.toneCustom}
                </span>
              ) : null}
            </div>
          </fieldset>

          <Slider
            id={`${ids}-rate`}
            label={s.rate}
            value={rate}
            valueText={fmt(s.rateValue, { value: rate.toFixed(2) })}
            onChange={setRate}
          />
          <Slider
            id={`${ids}-pitch`}
            label={s.pitch}
            value={pitch}
            valueText={fmt(s.pitchValue, { value: pitch.toFixed(2) })}
            onChange={setPitch}
          />

          <Button variant="ghost" onClick={() => applyTone("neutral")} disabled={tone === "neutral"} className="h-10 self-start">
            <RotateCcw aria-hidden="true" />
            {s.reset}
          </Button>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <QuickPhrases
          compact
          heading={s.quickHeading}
          description=""
          activeCategory={category}
          setCategory={setCategory}
          onSelect={(phrase) => {
            const display = t.studio.phrases[phrase] ?? phrase
            setText(display)
            speakText(display)
          }}
        />
      </Card>
    </div>
  )
}

function Slider({
  id,
  label,
  value,
  valueText,
  onChange,
}: {
  id: string
  label: string
  value: number
  valueText: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-muted-foreground" aria-hidden="true">
          {valueText}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0.5}
        max={1.5}
        step={0.05}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full cursor-pointer accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  )
}
