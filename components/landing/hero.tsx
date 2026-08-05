"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Play } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { HeroIllustration } from "./hero-illustration"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const HEADLINE_WORDS = ["BREAKING", "COMMUNICATION", "BARRIERS"]

const TRUST_BADGES = ["Privacy-first AI", "Runs on-device", "Real-time Translation", "Built for Accessibility", "AI Powered"] as const

const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const headlineWord = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#FAF8F4] pt-16 sm:pt-24"
      data-mira-zone="0.62"
      data-mira-mood="happy"
      data-mira-line="Hi — I'm Mira. I'll walk you through it."
    >
      {/* Very light radial glow behind the hero object -- almost no visible gradients elsewhere */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_75%_20%,_rgba(255,122,26,0.1),_transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(rgba(14,35,68,0.6) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        aria-hidden="true"
      />

      <Container className="pb-24 sm:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy shadow-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-orange" />
              </span>
              Live, on-device, 0.3s
            </motion.span>

            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-2xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-brand-navy sm:text-6xl lg:text-[4.75rem]"
            >
              {HEADLINE_WORDS.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden align-bottom">
                  <motion.span variants={headlineWord} className="inline-block">
                    {word}
                    {i < HEADLINE_WORDS.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="mt-6 max-w-lg text-lg leading-8 text-pretty text-muted-foreground"
            >
              Deafference transforms sign language into natural speech—and speech back into sign—in real time,
              helping Deaf and hearing people communicate naturally across workplaces, education, healthcare, and
              everyday life. Intelligent, private, and designed for everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href={APP_ROUTES.translate}
                data-mira-say="This is the one."
                data-mira-cheer=""
                className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(14,35,68,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-14px_rgba(14,35,68,0.6)] ${FOCUS_RING}`}
              >
                Request a demo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#demo"
                data-mira-say="Good idea — let's look."
                className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-navy/20 px-6 text-base font-medium text-brand-navy transition-all hover:-translate-y-0.5 hover:border-brand-navy/40 hover:bg-brand-navy/[0.03] hover:shadow-[0_14px_28px_-16px_rgba(14,35,68,0.35)] ${FOCUS_RING}`}
              >
                <Play className="size-4 fill-current" />
                Watch it in action
              </a>
              <Link
                href={APP_ROUTES.scenarios}
                className={`inline-flex h-12 items-center justify-center rounded-full border border-[#14B8A6]/50 bg-background px-6 text-base font-medium text-[#0F766E] transition-colors hover:border-[#14B8A6] hover:bg-[#14B8A6]/10 ${FOCUS_RING}`}
              >
                Explore Scenarios
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.85 }}
              className="mt-10 flex flex-wrap items-center gap-2.5"
            >
              {TRUST_BADGES.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Check className="size-3.5 text-brand-orange" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
