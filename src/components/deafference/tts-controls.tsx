"use client"

import { useId, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Square, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/i18n/use-i18n"
import { useSpeechSynthesis } from "./use-speech-synthesis"

export interface TTSControlsProps {
  /** Lifted up to `DeafferenceApp` and shared with `TranslationPanel` — manual entry
   * for now; once the AI pipeline produces real translations, feed its output into
   * that same shared state instead. */
  translationText: string
  onTranslationTextChange: (value: string) => void
}

export function TTSControls({ translationText, onTranslationTextChange }: TTSControlsProps) {
  const { t, fmt } = useI18n()
  const s = t.studio.tts
  const errors = t.studio.speech.errors
  const speech = useSpeechSynthesis()
  const [voiceURI, setVoiceURI] = useState("")
  const ids = useId()

  const hasText = translationText.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">{s.eyebrow}</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/12 px-3 py-1 text-xs font-semibold text-brand-red">
            <Volume2 className="size-3.5" aria-hidden="true" />
            {s.badge}
          </span>
        </div>

        {speech.supported === false ? (
          <p role="alert" className="mt-4 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-4 text-sm text-muted-foreground">
            {t.studio.speech.unsupported}
          </p>
        ) : (
          <>
            <div className="mt-4">
              <label
                htmlFor={`${ids}-text`}
                className="mb-1.5 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase"
              >
                {s.label}
              </label>
              <Textarea
                id={`${ids}-text`}
                dir="auto"
                value={translationText}
                onChange={(e) => onTranslationTextChange(e.target.value)}
                placeholder={s.placeholder}
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${ids}-voice`}
                className="mb-1.5 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase"
              >
                {s.voice}
              </label>
              {speech.voicesLoading ? (
                <p className="text-sm text-muted-foreground" aria-live="polite">{t.studio.speech.loadingVoices}</p>
              ) : speech.voices.length === 0 ? (
                <p className="text-sm text-muted-foreground">{s.noVoices}</p>
              ) : (
                <Select id={`${ids}-voice`} value={voiceURI} onChange={(e) => setVoiceURI(e.target.value)} className="h-10">
                  <option value="">{t.studio.speech.defaultVoice}</option>
                  {speech.voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                className="h-11 rounded-full"
                onClick={() => speech.speak(translationText, { voiceURI: voiceURI || null, queue: true })}
                disabled={!hasText || speech.supported === null}
              >
                <Volume2 className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                {s.speak}
              </Button>
              <Button variant="outline" className="h-11 rounded-full" onClick={speech.stop} disabled={!speech.speaking}>
                <Square className="size-4" aria-hidden="true" />
                {s.stop}
              </Button>
            </div>

            {speech.error ? (
              <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {errors[speech.error]}
              </p>
            ) : null}

            <div aria-live="polite">
              {speech.speaking ? (
                <div className="mt-4 space-y-2">
                  {speech.current && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.speakingNow}</span>{" "}
                      <span dir="auto">{speech.current.text}</span>
                    </p>
                  )}
                  {speech.queue.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        {fmt(s.queued, { count: speech.queue.length })}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {speech.queue.map((item) => (
                          <Badge key={item.id} className="max-w-[12rem] truncate" dir="auto">
                            {item.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}
