"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Captions, Pause, Play, RotateCcw } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

const DEMO_STEPS = [
  { label: "Speech detected", caption: "“Where is the nearest exit?”" },
  { label: "Phrase matched", caption: "Normalizing intent → sign syntax" },
  { label: "Sign playing", caption: "Streaming visual output" },
] as const

const WAVE_BARS = [9, 17, 12, 21, 14, 19, 10, 16, 13, 20] as const

export function DemoCenter() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(true)

  useEffect(() => {
    if (!playing) return
    if (step >= DEMO_STEPS.length - 1) {
      const timeout = setTimeout(() => setPlaying(false), 1400)
      return () => clearTimeout(timeout)
    }
    const timeout = setTimeout(() => setStep((s) => s + 1), 1400)
    return () => clearTimeout(timeout)
  }, [playing, step])

  function handlePlay() {
    if (!playing && step >= DEMO_STEPS.length - 1) setStep(0)
    setPlaying((p) => !p)
  }

  function handleReplay() {
    setStep(0)
    setPlaying(true)
  }

  return (
    <section id="demo" className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_50%_100%,_rgba(240,165,28,0.16),_transparent_50%)]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-red/10 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase">
            ▶ Demo center
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            See a translation run before you try it yourself.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            A self-contained walkthrough of the pipeline — no microphone or account required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-12"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.5)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <div className="flex items-end gap-1" aria-hidden="true">
                  {WAVE_BARS.map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 rounded-full bg-brand-orange"
                      style={{ height: h }}
                      animate={playing ? { scaleY: [1, 1.6, 0.7, 1] } : { scaleY: 0.5 }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                    />
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {DEMO_STEPS.map((s, i) => (
                    <div
                      key={s.label}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300",
                        i === step
                          ? "border-brand-orange/50 bg-brand-orange/10"
                          : "border-white/5 bg-black/20 opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          i === step ? "bg-brand-orange text-white" : "bg-white/10 text-slate-400",
                        )}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.label}</p>
                        {captionsOn ? (
                          <p className="text-xs text-slate-400">{s.caption}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlay}
                    className={cn(
                      "brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-all hover:brightness-110",
                      FOCUS_RING,
                    )}
                  >
                    {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                    {playing ? "Pause" : step >= DEMO_STEPS.length - 1 && !playing ? "Replay" : "Play demo"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReplay}
                    className={cn(
                      "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white",
                      FOCUS_RING,
                    )}
                  >
                    <RotateCcw className="size-4" />
                    Restart
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaptionsOn((c) => !c)}
                    aria-pressed={captionsOn}
                    className={cn(
                      "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
                      captionsOn
                        ? "border-brand-orange/40 bg-brand-orange/10 text-brand-orange"
                        : "border-slate-700 text-slate-400 hover:text-white",
                      FOCUS_RING,
                    )}
                  >
                    <Captions className="size-4" />
                    Captions
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
                  Sign output preview
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <svg width="88" height="108" viewBox="0 0 72 88" fill="none" aria-hidden="true">
                    <circle cx="36" cy="20" r="16" fill="white" fillOpacity="0.14" />
                    <path
                      d="M8 84c0-24 8-38 28-38s28 14 28 38"
                      stroke="white"
                      strokeOpacity="0.14"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M40 48c8-6 16-6 20-14"
                      stroke="var(--brand-orange)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      animate={
                        step === 2 && playing
                          ? { pathLength: [0, 1, 1, 0] }
                          : { pathLength: 0.6 }
                      }
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <circle cx="60" cy="34" r="4" fill="var(--brand-orange)" />
                  </svg>
                </div>
                <p className="mt-6 text-center text-sm leading-6 text-slate-300">
                  {captionsOn ? DEMO_STEPS[step].caption : "Captions hidden"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
