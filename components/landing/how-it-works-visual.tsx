"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mic } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

const WAVE_BARS = [8, 16, 11, 20, 13, 18, 9, 15] as const

function SpeechCaptureVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-24 items-center justify-center" aria-hidden="true">
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          className="absolute rounded-full border border-brand-orange/40"
          style={{ width: 56, height: 56 }}
          animate={active ? { scale: [1, 2.2], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: ring * 0.9, ease: "easeOut" }}
        />
      ))}
      <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
        <Mic className="size-6" />
      </div>
      <div className="absolute bottom-0 flex items-end gap-1">
        {WAVE_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-brand-orange/70"
            style={{ height: h }}
            animate={active ? { scaleY: [1, 1.7, 0.6, 1] } : { scaleY: 0.4 }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  )
}

function AIProcessingVisual({ active }: { active: boolean }) {
  const nodes = [
    [50, 12],
    [14, 62],
    [50, 88],
    [86, 62],
  ]
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="100" height="96" viewBox="0 0 100 96" fill="none">
        {nodes.map(([x, y], i) => (
          <motion.line
            key={i}
            x1={50}
            y1={50}
            x2={x}
            y2={y}
            stroke="var(--brand-orange)"
            strokeWidth="1.5"
            animate={active ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.15 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          />
        ))}
        <circle cx={50} cy={50} r={9} fill="var(--brand-orange)" />
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill="var(--brand-red)" fillOpacity={0.85} />
        ))}
      </svg>
    </div>
  )
}

function SignStreamVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="72" height="88" viewBox="0 0 72 88" fill="none">
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
          animate={active ? { pathLength: [0, 1, 1, 0] } : { pathLength: 0.6 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="60" cy="34" r="4" fill="var(--brand-orange)" />
      </svg>
    </div>
  )
}

const STAGES = [
  {
    emoji: "🎙️",
    index: "01",
    title: "Speech Capture",
    caption: "Continuous real-time microphone stream ingestion.",
    tag: "Audio waveform",
    Visual: SpeechCaptureVisual,
  },
  {
    emoji: "⚡",
    index: "02",
    title: "AI Processing Engine",
    caption: "Instant phrase alignment & sign syntax conversion.",
    tag: "Sign syntax data",
    Visual: AIProcessingVisual,
  },
  {
    emoji: "🤟",
    index: "03",
    title: "Real-Time Sign Stream",
    caption: "Fluid, high-definition visual sign animation.",
    tag: "Live playback ready",
    Visual: SignStreamVisual,
    terminal: true,
  },
] as const

export function HowItWorksVisual() {
  const [active, setActive] = useState(0)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (locked) return
    const id = setInterval(() => setActive((s) => (s + 1) % STAGES.length), 2800)
    return () => clearInterval(id)
  }, [locked])

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#090D16] py-24 sm:py-28"
      data-mira-zone="0.2"
      data-mira-mood="think"
      data-mira-line="Three steps, both directions."
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_50%_0%,_rgba(240,165,28,0.16),_transparent_50%)]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-red/10 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase shadow-[0_0_24px_-6px_rgba(240,165,28,0.5)]">
            ⚡ Pipeline architecture
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            3 steps from spoken word to visual sign.
          </h2>
        </motion.div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STAGES.map((stage, i) => {
            const isActive = active === i
            const Visual = stage.Visual
            return (
              <button
                key={stage.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setActive(i)
                  setLocked(true)
                }}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group relative rounded-2xl border p-6 text-left transition-all duration-300",
                  isActive
                    ? "border-brand-orange/60 bg-slate-900/80 shadow-xl shadow-brand-orange/10"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700",
                  FOCUS_RING,
                )}
              >
                {/* connector to next stage */}
                {i < STAGES.length - 1 && (
                  <span
                    className="pointer-events-none absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 md:block"
                    aria-hidden="true"
                  >
                    <motion.span
                      animate={isActive ? { x: [0, 4, 0], opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="flex size-8 items-center justify-center rounded-full border border-slate-700 bg-[#090D16] text-brand-orange"
                    >
                      <ArrowRight className="size-4" />
                    </motion.span>
                  </span>
                )}

                <Visual active={isActive} />

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    {stage.emoji}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {stage.index}. {stage.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{stage.caption}</p>

                <div
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "border-brand-orange/50 bg-brand-orange/10 text-brand-orange"
                      : "border-slate-700 text-slate-400",
                  )}
                >
                  {"terminal" in stage && stage.terminal ? (
                    <>
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {stage.tag}
                    </>
                  ) : (
                    <>
                      {stage.tag}
                      <ArrowRight className="size-3" />
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
