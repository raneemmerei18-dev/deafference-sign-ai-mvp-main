"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const WAVE_BARS = [6, 12, 8, 14, 9] as const

function LiveWaveform() {
  return (
    <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {WAVE_BARS.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-white"
          style={{ height: h }}
          animate={{ scaleY: [1, 1.6, 0.7, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

// Shown only if /hero-avatar.png hasn't been added yet (or fails to load) —
// tuned for visibility against the light warm background so a missing asset
// never reads as a blank box.
function SignAvatarFallback() {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full max-w-xs" aria-hidden="true">
      <path
        d="M20 236c0-70 24-110 80-110s80 40 80 110"
        fill="var(--brand-yellow)"
      />
      <circle cx="100" cy="60" r="52" fill="var(--brand-yellow)" />
      <g stroke="#0F172A" strokeWidth="8" strokeLinecap="round" fill="none">
        <path d="M112 138c24-17 47-17 59-40" />
        <path d="M104 168c30-12 58-12 75-35" opacity="0.6" />
      </g>
      <circle cx="176" cy="98" r="12" fill="#0F172A" />
    </svg>
  )
}

/** Hero character art. Points at /hero-avatar.png — falls back to an abstract
 *  mark if that file is missing or fails to load, so the layout never shows
 *  a blank box while the real asset is pending. */
function HeroAvatar() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <SignAvatarFallback />
      </div>
    )
  }

  return (
    <Image
      src="/hero-avatar.png"
      alt="Friendly animated avatar demonstrating fluid sign language hand gestures"
      fill
      priority
      onError={() => setFailed(true)}
      className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(255,143,0,0.25)]"
    />
  )
}

export function Hero() {
  return (
    <section id="top" className="warm-glow relative overflow-hidden pt-16 sm:pt-24">
      <Container className="pb-0 sm:pb-0">
        <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pb-12 lg:self-center lg:pb-20"
          >
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-balance text-[#0F172A] uppercase md:text-6xl">
              Say it. See it signed. Instantly.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-pretty text-foreground/70">
              Deafference converts spoken words into fluid visual sign language in real time —
              eliminating communication barriers everywhere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={APP_ROUTES.translate}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8F00] px-6 text-base font-bold text-[#0F172A] shadow-[0_12px_32px_-12px_rgba(255,143,0,0.55)] transition-all hover:scale-[1.03] hover:shadow-[0_16px_40px_-12px_rgba(255,143,0,0.7)] ${FOCUS_RING}`}
              >
                <ArrowRight className="size-4" />
                Launch Translator
              </Link>
              <Link
                href={APP_ROUTES.scenarios}
                className={`inline-flex h-12 items-center justify-center rounded-full border border-[#14B8A6]/50 bg-background px-6 text-base font-medium text-[#0F766E] transition-colors hover:border-[#14B8A6] hover:bg-[#14B8A6]/10 ${FOCUS_RING}`}
              >
                Explore Scenarios
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#22C55E]">
                <LiveWaveform />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Real-Time</p>
                <p className="text-sm font-bold text-[#0F172A]">Speech-to-Sign Bridge</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
          >
            <div
              aria-hidden="true"
              className="warm-glow absolute -inset-10 -z-10 rounded-[3rem] opacity-90 blur-2xl"
            />
            <div
              className="relative h-[440px] w-full sm:h-[560px] lg:h-[86vh] lg:max-h-[900px]"
              style={{ animation: "avatar-float 5s ease-in-out infinite" }}
            >
              <HeroAvatar />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
