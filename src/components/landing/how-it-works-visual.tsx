"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mic } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { GlowOrb, PopEyebrow, Reveal, focusRingPop } from "./ui/pop"

const FOCUS_RING = focusRingPop

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
            stroke="var(--primary)"
            strokeWidth="1.5"
            animate={active ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.15 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          />
        ))}
        <circle cx={50} cy={50} r={9} fill="var(--primary)" />
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
        <circle cx="36" cy="20" r="16" fill="var(--brand-navy)" fillOpacity="0.12" />
        <path
          d="M8 84c0-24 8-38 28-38s28 14 28 38"
          stroke="var(--brand-navy)"
          strokeOpacity="0.12"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M40 48c8-6 16-6 20-14"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={active ? { pathLength: [0, 1, 1, 0] } : { pathLength: 0.6 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="60" cy="34" r="4" fill="var(--primary)" />
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

/** Animated connector that sits in the gap between two stages: a traveling
 * glow dot along a dashed line, plus a pulsing arrow node. Horizontal on
 * desktop (left-to-right flow), vertical on mobile (top-to-bottom flow). */
function StageConnector({ active }: { active: boolean }) {
  return (
    <>
      {/* Desktop: horizontal connector in the gap to the right of the card */}
      <div
        className="pointer-events-none absolute top-16 -right-4 z-20 hidden w-8 -translate-y-1/2 md:block"
        aria-hidden="true"
      >
        <div className="relative h-px w-full overflow-visible rounded-full bg-gradient-to-r from-[color:var(--primary)]/10 via-[color:var(--primary)]/45 to-[color:var(--primary)]/10">
          <motion.span
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[color:var(--primary)] shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]"
            animate={{ left: ["0%", "95%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "glass-pop absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--primary)] transition-colors",
            active && "pop-pulse",
          )}
        >
          <ArrowRight className="size-4" />
        </motion.span>
      </div>

      {/* Mobile: vertical connector below the card */}
      <div
        className="pointer-events-none absolute -bottom-8 left-1/2 z-20 block h-8 w-px -translate-x-1/2 md:hidden"
        aria-hidden="true"
      >
        <div className="relative h-full w-px overflow-visible rounded-full bg-gradient-to-b from-[color:var(--primary)]/10 via-[color:var(--primary)]/45 to-[color:var(--primary)]/10">
          <motion.span
            className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[color:var(--primary)] shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]"
            animate={{ top: ["0%", "95%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "glass-pop absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--primary)] transition-colors",
            active && "pop-pulse",
          )}
        >
          <ArrowRight className="size-3.5 rotate-90" />
        </motion.span>
      </div>
    </>
  )
}

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
      className="pop-atmosphere relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-20 -left-16 size-[24rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="top-24 -right-24 size-[26rem] pop-float-delay" color="rgba(167,180,255,0.18)" />

      <Container>
        <Reveal className="max-w-2xl">
          <PopEyebrow>⚡ Pipeline architecture</PopEyebrow>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-brand-navy sm:text-4xl">
            3 steps from spoken word to visual sign.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8">
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
                  "glass-pop group relative rounded-3xl border p-6 text-left transition-all duration-300",
                  isActive
                    ? "border-[color:var(--primary)]/45 shadow-[var(--pop-glow)]"
                    : "border-transparent hover:border-[color:var(--primary)]/20 hover:-translate-y-1",
                  FOCUS_RING,
                )}
              >
                {i < STAGES.length - 1 && <StageConnector active={isActive} />}

                <div className="flex items-center gap-3">
                  <motion.span
                    animate={
                      isActive
                        ? { scale: [1, 1.08, 1], opacity: 1 }
                        : { scale: 1, opacity: 0.7 }
                    }
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                      "relative flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isActive
                        ? "bg-[color:var(--primary)] text-white shadow-[0_0_0_6px_rgba(59,130,246,0.14)]"
                        : "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
                    )}
                  >
                    {stage.index}
                  </motion.span>
                  <span className="text-xl" aria-hidden="true">
                    {stage.emoji}
                  </span>
                </div>

                <Visual active={isActive} />

                <h3 className="mt-2 text-lg font-bold text-brand-navy">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.caption}</p>

                <div
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "border-[color:var(--primary)]/35 bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {"terminal" in stage && stage.terminal ? (
                    <>
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
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
