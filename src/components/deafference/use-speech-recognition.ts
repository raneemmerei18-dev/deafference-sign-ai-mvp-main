"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useIsClient } from "./hooks"

/**
 * Browser speech-to-text via the Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition). Availability varies: Chrome/Edge stream audio to
 * the browser vendor's service, Safari runs it on-device, Firefox has none.
 */

export type RecognitionErrorCode = "notAllowed" | "noSpeech" | "network" | "audioCapture" | "language" | "generic"

// Minimal typings — the Web Speech recognition API isn't in every TS DOM lib.
type RecognitionAlternative = { transcript: string }
type RecognitionResult = { isFinal: boolean; length: number; [index: number]: RecognitionAlternative }
type RecognitionEvent = { resultIndex: number; results: { length: number; [index: number]: RecognitionResult } }
type RecognitionErrorEvent = { error: string }
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type RecognitionConstructor = new () => Recognition

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function mapError(code: string): RecognitionErrorCode | null {
  switch (code) {
    case "aborted":
      return null
    case "not-allowed":
    case "service-not-allowed":
      return "notAllowed"
    case "no-speech":
      return "noSpeech"
    case "network":
      return "network"
    case "audio-capture":
      return "audioCapture"
    case "language-not-supported":
      return "language"
    default:
      return "generic"
  }
}

export function useSpeechRecognition({
  lang,
  onFinal,
  onEnd,
}: {
  /** BCP-47 recognition language, e.g. "en-US" or "ar-SA". */
  lang: string
  /** Called once with the full transcript when the user stops talking. */
  onFinal: (transcript: string) => void
  /** Called when listening stops for any reason; `heard` is false when nothing usable came through. */
  onEnd?: (heard: boolean, error: RecognitionErrorCode | null) => void
}) {
  const isClient = useIsClient()
  const supported = isClient ? getRecognitionConstructor() !== null : null
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState("")
  const [error, setError] = useState<RecognitionErrorCode | null>(null)
  const recognitionRef = useRef<Recognition | null>(null)
  const callbacks = useRef({ onFinal, onEnd })
  useEffect(() => {
    callbacks.current = { onFinal, onEnd }
  })

  useEffect(() => () => recognitionRef.current?.abort(), [])

  const start = useCallback(() => {
    const Ctor = getRecognitionConstructor()
    if (!Ctor) return false
    recognitionRef.current?.abort()

    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    let finalText = ""
    let lastError: RecognitionErrorCode | null = null

    recognition.onresult = (event) => {
      let interimText = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ""
        if (result.isFinal) finalText += transcript
        else interimText += transcript
      }
      setInterim(`${finalText}${interimText}`.trim())
    }
    recognition.onerror = (event) => {
      lastError = mapError(event.error)
      if (lastError) setError(lastError)
    }
    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null
      setListening(false)
      const text = finalText.trim()
      if (text && !lastError) callbacks.current.onFinal(text)
      callbacks.current.onEnd?.(Boolean(text) && !lastError, lastError)
    }

    recognitionRef.current = recognition
    setError(null)
    setInterim("")
    try {
      recognition.start()
      setListening(true)
      return true
    } catch {
      recognitionRef.current = null
      setError("generic")
      return false
    }
  }, [lang])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { supported, listening, interim, error, start, stop, clearError }
}
