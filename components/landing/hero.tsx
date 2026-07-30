"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"

const PIPELINE_STEPS = ["Detect", "Match", "Sign"] as const

const WAVE_BARS = [10, 22, 14, 28, 18, 24, 12, 20, 16, 26, 11, 19] as const

function Waveform() {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {WAVE_BARS.map((h, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-brand-orange"
          style={{ height: h }}
          animate={{ scaleY: [1, 1.6, 0.7, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

// Placeholder sign-output figure: an abstract silhouette + hand cue, not a
// photoreal avatar, kept consistent with the rest of the mockup's iconography.
function SignAvatar() {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" fill="none" aria-hidden="true">
      <circle cx="36" cy="20" r="16" fill="white" fillOpacity="0.14" />
      <path
        d="M8 84c0-24 8-38 28-38s28 14 28 38"
        stroke="white"
        strokeOpacity="0.14"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <g stroke="var(--brand-orange)" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M40 48c8-6 16-6 20-14" />
        <path d="M38 58c10-4 20-4 26-12" opacity="0.55" />
      </g>
      <circle cx="60" cy="34" r="4" fill="var(--brand-orange)" />
    </svg>
  )
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-slate-950 pt-16 sm:pt-24"
      data-mira-zone="0.62"
      data-mira-mood="happy"
      data-mira-line="Hi — I'm Mira. I'll walk you through it."
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,_rgba(240,165,28,0.22),_transparent_45%)]" />

      <Container className="pb-20 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-red/10 px-3 py-1.5 text-xs font-medium text-brand-orange">
              🤟 Real-Time Speech-to-Sign Bridge
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-extrabold tracking-tight text-balance text-white md:text-6xl">
              Say it. See it signed instantly.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-pretty text-slate-300">
              Deafference converts spoken words into fluid visual sign language in real time —
              eliminating communication barriers everywhere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={APP_ROUTES.translate}
                data-mira-say="This is the one."
                data-mira-cheer=""
                className={`brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white transition-all hover:scale-[1.02] ${FOCUS_RING}`}
              >
                <ArrowRight className="size-4" />
                Launch Translator
              </Link>
              <a
                href="#use-cases"
                data-mira-say="Good idea — let's look."
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 px-6 text-base font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white ${FOCUS_RING}`}
              >
                Explore Scenarios
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.5)] sm:p-8">
              {/* Header bar */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Live input
                </span>
                <span className="text-xs font-medium text-slate-400">Output mode: Sign animations</span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Audio input box */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
                    Audio input
                  </p>
                  <div className="mt-3">
                    <Waveform />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white">
                    &ldquo;Can you direct me to the reception area?&rdquo;
                  </p>
                </div>

                {/* Sign output box */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
                    Sign output
                  </p>
                  <div className="mt-2 flex items-center justify-center">
                    <SignAvatar />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {PIPELINE_STEPS.map((step, i) => (
                      <span
                        key={step}
                        className="rounded-full bg-brand-orange/15 px-2 py-1 text-[10px] font-semibold text-brand-orange"
                      >
                        {i + 1}. {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <span className="brand-gradient inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-white">
                  &lt; 300ms real-time translation
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
