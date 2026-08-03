"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { X, Play, RefreshCw, Sparkles, CheckCircle2, Send } from "lucide-react"
import confetti from "canvas-confetti"
import type { FeatureCardData } from "./feature-card-grid"

const SIMULATION_STEPS: Record<string, { delays: [number, number]; result: (inputText: string) => string }> = {
  "speech-to-sign": {
    delays: [1200, 2800],
    result: () =>
      'Speech Recognized: "Welcome to Deafference. How can I help you today?" -> [Sign Gesture Sequence Rendered]',
  },
  "sign-to-speech": {
    delays: [1000, 2600],
    result: () => "Signs Detected: [HELLO] [THANK YOU] [WELCOME] -> Synthesizing Speech Audio...",
  },
  "text-to-sign": {
    delays: [800, 2000],
    result: (inputText) => `Text Stream: "${inputText || "Hello world"}" -> 3D Sign Avatar Keyframes Generated.`,
  },
  "sign-to-text": {
    delays: [1000, 2600],
    result: () => "Webcam Gesture Matrix: Capturing ASL/ISL gestures -> Transcribing live document captions in real time.",
  },
}

function playChime(freq: number) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Web Audio unsupported in this browser — demo continues silently.
  }
}

export function DemoModal({ card, onClose }: { card: FeatureCardData | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [translatedText, setTranslatedText] = useState("")
  const [inputText, setInputText] = useState("")

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (card && !dialog.open) dialog.showModal()
    if (!card && dialog.open) dialog.close()
  }, [card])

  useEffect(() => {
    if (!card) return
    setIsSimulating(false)
    setActiveStep(1)
    setTranslatedText("")
    setInputText(card.id === "text-to-sign" ? "Hello! Welcome to the Deafference accessibility platform." : "")
  }, [card])

  if (!card) {
    return (
      <dialog ref={dialogRef} onClose={onClose} className="backdrop:bg-slate-950/80 backdrop:backdrop-blur-md" />
    )
  }

  const { title, pillText, icon: Icon, badgeTag } = card
  const steps = SIMULATION_STEPS[card.id]

  const handleStartSimulation = () => {
    playChime(587.33)
    setIsSimulating(true)
    setActiveStep(1)
    setTranslatedText("")

    const [midDelay, endDelay] = steps.delays
    setTimeout(() => {
      setActiveStep(2)
      playChime(659.25)
    }, midDelay)
    setTimeout(() => {
      setActiveStep(3)
      setTranslatedText(steps.result(inputText))
      playChime(880)
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } })
      setIsSimulating(false)
    }, endDelay)
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="w-[min(92vw,42rem)] rounded-3xl border border-slate-800 bg-slate-900 p-0 text-white shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <div className="h-2 w-full bg-gradient-to-r from-[#EE6C2B] via-amber-400 to-sky-400" />

        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-6 sm:p-7">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EE6C2B] text-white shadow-lg shadow-orange-500/20">
              <Icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold tracking-tight">{title} Simulator</h2>
                <span className="rounded-full border border-orange-500/30 bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-[#EE6C2B]">
                  {badgeTag}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">Deafference Interactive Translation Sandbox</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800/80 p-2.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6 sm:p-7">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center space-x-3">
              <span className="rounded-full bg-[#EE6C2B] px-4 py-1.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-sm">
                {pillText}
              </span>
              <span className="text-xs font-semibold text-slate-300">Target Translation Pipeline</span>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" /> Engine Ready
            </span>
          </div>

          {card.id === "text-to-sign" && (
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Type Text for Sign Translation:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter sentence..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-[#EE6C2B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="flex items-center space-x-2 rounded-xl bg-[#EE6C2B] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>Translate</span>
                </button>
              </div>
            </div>
          )}

          <div className="relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">STATUS: {isSimulating ? "TRANSLATING IN REAL-TIME..." : "IDLE / READY"}</span>
              <span className="font-mono">LATENCY: 12ms (60 FPS)</span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
              {isSimulating ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 animate-bounce rounded-full bg-[#EE6C2B]" />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-amber-400 [animation-delay:0.2s]" />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-sky-400 [animation-delay:0.4s]" />
                  </div>
                  <p className="text-xs font-semibold text-orange-200">
                    Step {activeStep}/3: Processing Neural Sign-to-Text Matrix...
                  </p>
                </div>
              ) : translatedText ? (
                <div className="max-w-md space-y-2">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs font-semibold text-slate-200 sm:text-sm">
                    {translatedText}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Sparkles className="mx-auto h-8 w-8 animate-pulse text-[#EE6C2B]" />
                  <p className="text-xs font-medium text-slate-400">
                    Click &ldquo;Run Interactive Demo&rdquo; below to test the live micro-interaction pipeline.
                  </p>
                </div>
              )}
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full bg-gradient-to-r from-[#EE6C2B] to-amber-400 transition-all duration-500"
                style={{ width: isSimulating ? `${(activeStep / 3) * 100}%` : translatedText ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className="flex items-center space-x-2 rounded-xl bg-[#EE6C2B] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Run Interactive Demo</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </dialog>
  )
}
