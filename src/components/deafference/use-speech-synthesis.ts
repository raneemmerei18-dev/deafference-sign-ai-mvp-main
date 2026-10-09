"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { StudioMessages } from "@/i18n/messages/studio"

/**
 * Browser text-to-speech (window.speechSynthesis). Everything runs on this
 * device — there is no server TTS. Unlike `lib/speech`, utterance errors are
 * surfaced (as `error`) instead of being swallowed, and rate/pitch/lang can
 * be set per call.
 */

export type SpeechErrorCode = keyof StudioMessages["speech"]["errors"]

export type SpeakOptions = {
  voiceURI?: string | null
  /** BCP-47 language used when no specific voice is chosen (e.g. "ar-SA"). */
  lang?: string
  rate?: number
  pitch?: number
  /** Queue after whatever is already speaking instead of interrupting it. */
  queue?: boolean
  /** Fires when the browser actually starts speaking this text. */
  onStart?: () => void
}

type Item = { id: string; text: string }

const KNOWN_ERRORS = new Set<string>([
  "audio-busy",
  "audio-hardware",
  "network",
  "synthesis-unavailable",
  "synthesis-failed",
  "language-unavailable",
  "voice-unavailable",
  "text-too-long",
  "invalid-argument",
  "not-allowed",
])

const VOICE_LOAD_TIMEOUT_MS = 2500

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function useSpeechSynthesis() {
  /** `null` until mounted (unknown during SSR). */
  const [supported, setSupported] = useState<boolean | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicesLoading, setVoicesLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [error, setError] = useState<SpeechErrorCode | null>(null)
  const itemsRef = useRef<Item[]>([])
  const counter = useRef(0)

  const sync = useCallback(() => setItems([...itemsRef.current]), [])

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false)
      setVoicesLoading(false)
      return
    }
    setSupported(true)
    const synth = window.speechSynthesis
    const load = () => {
      const list = synth.getVoices()
      if (list.length > 0) {
        setVoices(list)
        setVoicesLoading(false)
      }
    }
    load()
    synth.addEventListener("voiceschanged", load)
    // Some browsers never fire voiceschanged when no voices are installed.
    const timeout = window.setTimeout(() => setVoicesLoading(false), VOICE_LOAD_TIMEOUT_MS)
    return () => {
      synth.removeEventListener("voiceschanged", load)
      window.clearTimeout(timeout)
      // Don't keep talking after the studio that started it has gone.
      if (itemsRef.current.length > 0) synth.cancel()
      itemsRef.current = []
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    itemsRef.current = []
    setCurrentId(null)
    sync()
    window.speechSynthesis.cancel()
  }, [sync])

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}): boolean => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setError("unsupported")
        return false
      }
      const trimmed = text.trim()
      if (!trimmed) {
        setError("empty")
        return false
      }
      const synth = window.speechSynthesis
      if (!options.queue) {
        itemsRef.current = []
        setCurrentId(null)
        synth.cancel()
      }
      if (synth.paused) synth.resume()

      const item: Item = { id: `utt-${++counter.current}`, text: trimmed }
      const utterance = new SpeechSynthesisUtterance(trimmed)
      const voice = options.voiceURI ? synth.getVoices().find((v) => v.voiceURI === options.voiceURI) : undefined
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else if (options.lang) {
        utterance.lang = options.lang
      }
      utterance.rate = clamp(options.rate ?? 1, 0.1, 10)
      utterance.pitch = clamp(options.pitch ?? 1, 0, 2)

      const finish = () => {
        const before = itemsRef.current.length
        itemsRef.current = itemsRef.current.filter((entry) => entry.id !== item.id)
        if (itemsRef.current.length !== before) {
          setCurrentId((id) => (id === item.id ? null : id))
          sync()
        }
      }
      utterance.onstart = () => {
        if (!itemsRef.current.some((entry) => entry.id === item.id)) return
        setCurrentId(item.id)
        options.onStart?.()
      }
      utterance.onend = finish
      utterance.onerror = (event) => {
        const wasTracked = itemsRef.current.some((entry) => entry.id === item.id)
        finish()
        // "interrupted"/"canceled" are what Stop or a new Listen produce — not failures.
        if (!wasTracked || event.error === "interrupted" || event.error === "canceled") return
        setError(KNOWN_ERRORS.has(event.error) ? (event.error as SpeechErrorCode) : "unknown")
      }

      itemsRef.current = [...itemsRef.current, item]
      sync()
      setError(null)
      try {
        synth.speak(utterance)
      } catch {
        finish()
        setError("unknown")
        return false
      }
      return true
    },
    [sync],
  )

  const clearError = useCallback(() => setError(null), [])

  const current = items.find((item) => item.id === currentId) ?? null
  return {
    supported,
    voices,
    voicesLoading: supported !== false && voicesLoading && voices.length === 0,
    /** True from the moment text is handed to the browser until it finishes. */
    speaking: items.length > 0,
    current,
    /** Items waiting behind the one being spoken. */
    queue: current ? items.filter((item) => item.id !== current.id) : items.slice(1),
    error,
    speak,
    stop,
    clearError,
  }
}
