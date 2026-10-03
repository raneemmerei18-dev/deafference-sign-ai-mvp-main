"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Captions,
  HeartPulse,
  Pause,
  Play,
  RotateCcw,
  Siren,
  Sparkles,
  Type,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { GlowOrb, Magnetic, PopEyebrow, Reveal, focusRingPop } from "./ui/pop"

const FOCUS_RING = focusRingPop

const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] font-bold text-white shadow-[0_18px_36px_-14px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-14px_rgba(37,99,235,0.6)]"

const DEMO_STEPS = [
  { label: "Speech detected", caption: "“Where is the nearest exit?”" },
  { label: "Phrase matched", caption: "Normalizing intent → sign syntax" },
  { label: "Sign playing", caption: "Streaming visual output" },
] as const

const WAVE_BARS = [9, 17, 12, 21, 14, 19, 10, 16, 13, 20] as const

type MediaItem = {
  icon: LucideIcon
  title: string
  description: string
  duration: string
  audience?: string
}

const PRODUCT_DEMOS: MediaItem[] = [
  {
    icon: Zap,
    title: "Emergency Hub Quick-Actions",
    description: "One-tap presets for common emergency phrases, signed instantly without typing or speaking a full sentence.",
    duration: "1:20",
  },
  {
    icon: Type,
    title: "Text-to-Sign Rendering",
    description: "Type or paste a phrase and watch it render into fluid, animated sign language in real time.",
    duration: "0:55",
  },
]

const TUTORIALS: MediaItem[] = [
  {
    icon: Sparkles,
    title: "Getting Started for Deaf Users",
    description: "Set up your profile, permissions, and preferred sign language pack in under five minutes.",
    duration: "4:10",
    audience: "New users",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Provider Integration",
    description: "Connect Deafference to a front-desk or exam-room workflow, including intake and consult presets.",
    duration: "6:35",
    audience: "Healthcare staff",
  },
  {
    icon: Siren,
    title: "Emergency Preset Setup",
    description: "Configure one-tap emergency phrases and quick-actions for high-stress, time-critical situations.",
    duration: "3:45",
    audience: "Admins",
  },
]

function FlagshipDemo() {
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
    <article
      aria-labelledby="flagship-demo-heading"
      className="glass-pop glow-border-pop relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="flagship-demo-heading" className="text-lg font-bold text-brand-navy sm:text-xl">
          Real-Time Sign Translation
        </h3>
        <span className="inline-flex items-center rounded-full bg-brand-orange/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange">
          Interactive
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <div className="flex items-end gap-1" aria-hidden="true">
            {WAVE_BARS.map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-[color:var(--primary)]"
                style={{ height: h }}
                animate={playing ? { scaleY: [1, 1.6, 0.7, 1] } : { scaleY: 0.5 }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Progress indicator synced to the active demo step */}
          <div
            className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--primary)]/10"
            role="progressbar"
            aria-label="Demo progress"
            aria-valuemin={1}
            aria-valuemax={DEMO_STEPS.length}
            aria-valuenow={step + 1}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
              animate={{ width: `${((step + 1) / DEMO_STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="mt-5 space-y-3">
            {DEMO_STEPS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300",
                  i === step
                    ? "border-[color:var(--primary)]/35 bg-[color:var(--primary)]/8"
                    : "border-border bg-muted/40 opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                    i === step ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--primary)]/10 text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{s.label}</p>
                  {captionsOn ? <p className="text-xs text-muted-foreground">{s.caption}</p> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={handlePlay} className={cn(PRIMARY_BUTTON, "h-11 px-5 text-sm", FOCUS_RING)}>
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                {playing ? "Pause" : step >= DEMO_STEPS.length - 1 && !playing ? "Replay" : "Play demo"}
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={handleReplay}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-[color:var(--primary)]/35 hover:text-brand-navy",
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
                  : "border-border text-muted-foreground hover:text-brand-navy",
                FOCUS_RING,
              )}
            >
              <Captions className="size-4" />
              Captions
            </button>
          </div>
        </div>

        {/* Inset device-style preview screen — deliberately kept dark for contrast, like a real screen mockup */}
        <figure className="rounded-2xl border border-white/10 bg-[#0b1220] p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.5)]">
          <figcaption className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
            Sign output preview
          </figcaption>
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
                animate={step === 2 && playing ? { pathLength: [0, 1, 1, 0] } : { pathLength: 0.6 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle cx="60" cy="34" r="4" fill="var(--brand-orange)" />
            </svg>
          </div>
          <p className="mt-6 text-center text-sm leading-6 text-slate-300">
            {captionsOn ? DEMO_STEPS[step].caption : "Captions hidden"}
          </p>
        </figure>
      </div>
    </article>
  )
}

function MediaCard({ item }: { item: MediaItem }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const Icon = item.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-pop group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--pop-glow)]"
    >
      {/* Inset device-style preview screen — deliberately kept dark, like a real screen mockup */}
      <figure className="relative m-0 aspect-video overflow-hidden bg-[#0b1220]">
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,_rgba(59,130,246,0.22),_transparent_60%)]"
        >
          <Icon
            className={cn(
              "size-10 text-[color:var(--primary)]/45 transition-transform duration-500",
              isPlaying && "scale-110 text-[color:var(--primary)]/80",
            )}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-pressed={isPlaying}
          aria-label={`${isPlaying ? "Pause" : "Play"} preview: ${item.title}`}
          className={cn("absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/10", FOCUS_RING)}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-lg transition-transform group-hover:scale-105 hover:scale-105">
            {isPlaying ? (
              <Pause className="size-6" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 size-6" fill="currentColor" />
            )}
          </span>
        </button>

        <span className="absolute right-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {isPlaying ? "Playing…" : item.duration}
        </span>

        {item.audience ? (
          <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-brand-orange uppercase">
            {item.audience}
          </span>
        ) : null}

        <figcaption className="sr-only">{item.title}</figcaption>
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-brand-navy">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </motion.article>
  )
}

type TabKey = "demos" | "tutorials"
const TABS: { key: TabKey; label: string }[] = [
  { key: "demos", label: "Product Demos" },
  { key: "tutorials", label: "Video & Interactive Tutorials" },
]

function DemoCenterTabs() {
  const [active, setActive] = useState<TabKey>("demos")
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function focusTabAt(index: number) {
    const target = TABS[(index + TABS.length) % TABS.length]
    if (!target) return
    setActive(target.key)
    tabRefs.current[target.key]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        focusTabAt(index + 1)
        break
      case "ArrowLeft":
        event.preventDefault()
        focusTabAt(index - 1)
        break
      case "Home":
        event.preventDefault()
        focusTabAt(0)
        break
      case "End":
        event.preventDefault()
        focusTabAt(TABS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <nav aria-label="Demo center categories">
        <div role="tablist" aria-label="Demo center categories" className="glass-pop inline-flex flex-wrap gap-1.5 rounded-full p-1.5">
          {TABS.map((tab, index) => {
            const selected = tab.key === active
            return (
              <button
                key={tab.key}
                ref={(node) => {
                  tabRefs.current[tab.key] = node
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.key)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                  selected
                    ? "bg-[color:var(--primary)] text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)]"
                    : "text-muted-foreground hover:text-brand-navy",
                  FOCUS_RING,
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div
        role="tabpanel"
        id={`${baseId}-panel-demos`}
        aria-labelledby={`${baseId}-tab-demos`}
        hidden={active !== "demos"}
        tabIndex={0}
        className={cn("mt-8 space-y-5 rounded-lg", FOCUS_RING)}
      >
        {active === "demos" ? (
          <>
            <FlagshipDemo />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {PRODUCT_DEMOS.map((item) => (
                <MediaCard key={item.title} item={item} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-tutorials`}
        aria-labelledby={`${baseId}-tab-tutorials`}
        hidden={active !== "tutorials"}
        tabIndex={0}
        className={cn("mt-8 rounded-lg", FOCUS_RING)}
      >
        {active === "tutorials" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TUTORIALS.map((item) => (
              <MediaCard key={item.title} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function DemoCenter() {
  return (
    <section
      id="demo"
      className="pop-atmosphere relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="top-0 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="-bottom-24 -left-16 size-[24rem] pop-float-delay" color="rgba(127,224,224,0.18)" />

      <Container>
        <Reveal className="max-w-2xl">
          <PopEyebrow>▶ Demo center</PopEyebrow>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-brand-navy sm:text-4xl">
            See it in action, then explore how to set it up.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Interactive product walkthroughs and step-by-step setup tutorials — no microphone or
            account required to preview.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-12"
        >
          <DemoCenterTabs />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="glass-pop glow-border-pop mt-10 flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:p-8"
        >
          <p className="text-base font-semibold text-brand-navy sm:text-lg">
            Ready to go beyond the preview?
          </p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Launch the full live demo sandbox and try real-time translation with your own voice or
            camera.
          </p>
          <Magnetic className="mt-2">
            <Link href={APP_ROUTES.translate} className={cn(PRIMARY_BUTTON, "h-12 px-6 text-base", FOCUS_RING)}>
              Launch the demo sandbox
              <ArrowRight className="size-4" />
            </Link>
          </Magnetic>
        </motion.div>
      </Container>
    </section>
  )
}
