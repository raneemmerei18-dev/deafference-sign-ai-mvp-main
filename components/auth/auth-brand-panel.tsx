"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Sparkles, Zap } from "lucide-react"

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Privacy-first AI", detail: "Everything runs on-device by default." },
  { icon: Zap, label: "Real-time translation", detail: "Sign ⇄ speech in under a second." },
  { icon: Sparkles, label: "Built for accessibility", detail: "Designed with the Deaf community." },
] as const

const WAVE_BARS = [0.35, 0.7, 1, 0.55, 0.85, 0.4, 0.65] as const

function BrandMark() {
  return (
    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow shadow-[0_10px_30px_-10px_rgba(255,209,64,0.6)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="11" width="2.2" height="7" rx="1.1" fill="#0e2344" fillOpacity="0.55" />
        <rect x="7.5" y="7" width="2.2" height="14" rx="1.1" fill="#0e2344" fillOpacity="0.7" />
        <rect x="11" y="4" width="2.2" height="20" rx="1.1" fill="#0e2344" fillOpacity="0.85" />
        <path
          d="M15.5 15.5c0-4.6.9-8.3 1.9-8.3.9 0 1.5 2.6 1.5 5.5 0-3.7 1.3-6.8 2.3-6.6"
          stroke="#0e2344"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}

/**
 * Decorative left-hand showcase for the auth pages. Hidden below `lg` —
 * on small screens the form alone (with its own compact wordmark) carries
 * the page, so this never competes for space with the actual task.
 */
export function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-brand-navy px-10 py-12 text-white lg:flex xl:px-14">
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-orange/30 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-32 -left-16 size-96 rounded-full bg-brand-yellow/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 flex items-center gap-3">
        <BrandMark />
        <span className="text-xl font-bold tracking-tight">Deafference</span>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80 uppercase backdrop-blur-sm">
            AI communication platform
          </span>
          <h2 className="max-w-sm text-3xl leading-tight font-bold tracking-tight xl:text-4xl">
            Breaking communication barriers, one sign at a time.
          </h2>
          <p className="max-w-sm text-sm text-white/70">
            One account gets you real-time sign ⇄ speech translation, saved history, and settings that follow you
            everywhere.
          </p>
        </div>

        <div className="flex items-end gap-1.5" aria-hidden="true">
          {WAVE_BARS.map((height, index) => (
            <motion.span
              key={index}
              className="w-2 rounded-full bg-gradient-to-t from-brand-orange to-brand-yellow"
              style={{ height: `${28 + height * 40}px` }}
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
            />
          ))}
        </div>

        <ul className="flex flex-col gap-4">
          {TRUST_POINTS.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Icon className="size-4 text-brand-yellow" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/60">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-xs text-white/40">© {new Date().getFullYear()} Deafference. All rights reserved.</p>
    </div>
  )
}
