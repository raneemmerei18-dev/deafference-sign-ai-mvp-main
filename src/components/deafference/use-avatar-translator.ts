"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useI18n } from "@/i18n/use-i18n"
import { useSettings } from "./settings-provider"
import { addHistoryEntry } from "./history-store"
import { useSpeechRecognition, type RecognitionErrorCode } from "./use-speech-recognition"
import { matchSign, type CategoryId, type Status, type TranslationResult } from "./data"

/**
 * Controller for the Text/Speech → Sign studio. It wires the input (typed or
 * real browser speech recognition), the demo sign-library lookup and a
 * frontend playback timeline that drives the avatar's progress and poses.
 *
 * There is no sign translation backend: results come only from the demo
 * phrase library in data.ts, and "signing" is an illustrative timeline.
 */

export type InputMode = "speak" | "type"
export type PlaybackSpeed = 0.5 | 0.75 | 1
export type StudioError = { kind: "no-match" } | { kind: "speech"; code: RecognitionErrorCode }

/** How long one sign (word) of the phrase plays at 1× speed. */
const UNIT_MS = 1100
const UNDERSTAND_MS = 350
const PREPARE_MS = 350

export function useAvatarTranslator({ initialText = "", autoTranslate = false }: { initialText?: string; autoTranslate?: boolean } = {}) {
  const { t, locale } = useI18n()
  const { settings } = useSettings()
  const [inputMode, setInputMode] = useState<InputMode>("type")
  const [input, setInput] = useState(initialText)
  const [category, setCategory] = useState<CategoryId>("General")
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [error, setError] = useState<StudioError | null>(null)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const [elapsed, setElapsed] = useState(0)
  const [textCardOpen, setTextCardOpen] = useState(false)

  const timers = useRef<number[]>([])
  const elapsedRef = useRef(0)

  const phrases = t.studio.phrases
  const displayPhrase = result ? phrases[result.matchedSign] ?? result.matchedSign : ""
  const units = displayPhrase ? displayPhrase.split(/\s+/).filter(Boolean) : []
  const total = Math.max(1, units.length) * UNIT_MS
  const progress = result ? Math.min(100, (elapsed / total) * 100) : 0
  const unitIndex = units.length ? Math.min(units.length - 1, Math.floor(elapsed / UNIT_MS)) : -1

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const startTimeline = useCallback(() => {
    elapsedRef.current = 0
    setElapsed(0)
    setPaused(false)
    setStatus("signing")
  }, [])

  // Playback timeline: advances while signing and not paused, scaled by speed.
  const totalRef = useRef(total)
  totalRef.current = total
  useEffect(() => {
    if (status !== "signing" || paused) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsedRef.current += (now - last) * speed
      last = now
      if (elapsedRef.current >= totalRef.current) {
        elapsedRef.current = totalRef.current
        setElapsed(totalRef.current)
        setStatus("complete")
        return
      }
      setElapsed(elapsedRef.current)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [status, paused, speed])

  useEffect(() => clearTimers, [clearTimers])

  const translate = useCallback(
    (text?: string, { record = true }: { record?: boolean } = {}) => {
      const value = (text ?? input).trim()
      if (!value) return
      clearTimers()
      setError(null)
      setResult(null)
      setPaused(false)
      elapsedRef.current = 0
      setElapsed(0)
      setStatus("understanding")
      later(() => setStatus("preparing"), UNDERSTAND_MS)
      later(() => {
        const match = matchSign(value, category, phrases)
        if (!match) {
          setError({ kind: "no-match" })
          setStatus("error")
          return
        }
        setResult(match)
        startTimeline()
        if (record && settings.sessionHistoryEnabled) {
          addHistoryEntry({ mode: "avatar", input: value, output: phrases[match.matchedSign] ?? match.matchedSign })
        }
      }, UNDERSTAND_MS + PREPARE_MS)
    },
    [input, category, phrases, clearTimers, later, startTimeline, settings.sessionHistoryEnabled],
  )

  const recognition = useSpeechRecognition({
    lang: locale === "ar" ? "ar-SA" : "en-US",
    onFinal: (transcript) => {
      setInput(transcript)
      translate(transcript)
    },
    onEnd: (heard, code) => {
      if (code) {
        setError({ kind: "speech", code })
        setStatus("error")
      } else if (!heard) {
        setStatus((current) => (current === "listening" ? "idle" : current))
      }
    },
  })

  const { start: startRecognition, stop: stopListening } = recognition
  const startListening = useCallback(() => {
    clearTimers()
    setError(null)
    setResult(null)
    if (startRecognition()) {
      setStatus("listening")
    } else {
      setError({ kind: "speech", code: "generic" })
      setStatus("error")
    }
  }, [clearTimers, startRecognition])

  const clear = useCallback(() => {
    clearTimers()
    stopListening()
    setInput("")
    setResult(null)
    setError(null)
    setPaused(false)
    elapsedRef.current = 0
    setElapsed(0)
    setStatus("idle")
  }, [clearTimers, stopListening])

  const play = useCallback(() => {
    if (!result) return
    if (status === "complete") startTimeline()
    else setPaused(false)
  }, [result, status, startTimeline])

  const pause = useCallback(() => {
    if (status === "signing") setPaused(true)
  }, [status])

  const replay = useCallback(() => {
    if (result) startTimeline()
  }, [result, startTimeline])

  const selectPhrase = useCallback(
    (phrase: string) => {
      const display = phrases[phrase] ?? phrase
      setInputMode("type")
      setInput(display)
      translate(display)
    },
    [phrases, translate],
  )

  // Prefill from ?text=… and, when coming from History, play it straight away.
  const autoRan = useRef(false)
  useEffect(() => {
    if (!autoTranslate || autoRan.current || !initialText.trim()) return
    autoRan.current = true
    translate(initialText, { record: false })
  }, [autoTranslate, initialText, translate])

  return {
    inputMode,
    setInputMode,
    input,
    setInput,
    category,
    setCategory,
    status,
    paused,
    result,
    error,
    displayPhrase,
    units,
    unitIndex,
    progress,
    speed,
    setSpeed,
    translate: () => translate(),
    selectPhrase,
    clear,
    play,
    pause,
    replay,
    recognition: {
      ...recognition,
      // Errors live in controller state so Clear / a new attempt resets them.
      error: error?.kind === "speech" ? error.code : null,
      start: startListening,
      stop: stopListening,
    },
    textCardOpen,
    setTextCardOpen,
  }
}

export type AvatarTranslator = ReturnType<typeof useAvatarTranslator>
