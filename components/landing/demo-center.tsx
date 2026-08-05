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

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

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
    <article aria-labelledby="flagship-demo-heading" className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.5)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="flagship-demo-heading" className="text-lg font-bold text-white sm:text-xl">
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
                  i === step ? "border-brand-orange/50 bg-brand-orange/10" : "border-white/5 bg-black/20 opacity-50",
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
                  {captionsOn ? <p className="text-xs text-slate-400">{s.caption}</p> : null}
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
                captionsOn ? "border-brand-orange/40 bg-brand-orange/10 text-brand-orange" : "border-slate-700 text-slate-400 hover:text-white",
                FOCUS_RING,
              )}
            >
              <Captions className="size-4" />
              Captions
            </button>
          </div>
        </div>

        <figure className="rounded-2xl border border-white/10 bg-black/30 p-6">
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
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
    >
      <figure className="relative m-0 aspect-video overflow-hidden bg-slate-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,_rgba(240,165,28,0.18),_transparent_60%)]"
        >
          <Icon
            className={cn(
              "size-10 text-brand-orange/40 transition-transform duration-500",
              isPlaying && "scale-110 text-brand-orange/70",
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
          <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform hover:scale-105">
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
        <h3 className="text-base font-bold text-white">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
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
        <div role="tablist" aria-label="Demo center categories" className="flex flex-wrap gap-2">
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
                  "rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                  selected
                    ? "border-brand-orange/50 bg-brand-orange/15 text-brand-orange"
                    : "border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white",
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
      className="relative overflow-hidden bg-slate-950 py-24 sm:py-28"
      data-mira-zone="0.78"
      data-mira-mood="listen"
      data-mira-line="Watch it translate live."
    >
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
            See it in action, then explore how to set it up.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Interactive product walkthroughs and step-by-step setup tutorials — no microphone or
            account required to preview.
          </p>
        </motion.div>

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
          className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8"
        >
          <p className="text-base font-semibold text-white sm:text-lg">
            Ready to go beyond the preview?
          </p>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            Launch the full live demo sandbox and try real-time translation with your own voice or
            camera.
          </p>
          <Link
            href={APP_ROUTES.translate}
            className={cn(
              "brand-gradient mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white transition-all hover:brightness-110",
              FOCUS_RING,
            )}
          >
            Launch the demo sandbox
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
