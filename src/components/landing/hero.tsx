"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Play } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { HeroIllustration } from "./hero-illustration"
import { GlowOrb, Magnetic, focusRingPop } from "./ui/pop"

const FOCUS_RING = focusRingPop

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
      className="pop-atmosphere relative overflow-hidden pt-16 sm:pt-24"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-24 -left-24 size-[26rem] pop-float" color="rgba(59,130,246,0.22)" />
      <GlowOrb className="top-10 -right-32 size-[30rem] pop-float-delay" color="rgba(167,180,255,0.22)" />
      <GlowOrb className="bottom-0 left-1/3 size-72" color="rgba(255,138,61,0.12)" />

      <Container className="pb-24 sm:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass-pop inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-brand-navy"
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
                  <motion.span
                    variants={headlineWord}
                    className={i === HEADLINE_WORDS.length - 1 ? "pop-gradient-text inline-block" : "inline-block"}
                  >
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
              <Magnetic>
                <Link
                  href={APP_ROUTES.translate}
                  className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-6 text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(37,99,235,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-14px_rgba(37,99,235,0.65)] ${FOCUS_RING}`}
                >
                  Request a demo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
              <a
                href="#demo"
                className={`glass-pop group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-medium text-brand-navy transition-all hover:-translate-y-0.5 ${FOCUS_RING}`}
              >
                <Play className="size-4 fill-current text-brand-orange" />
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
                  className="glass-pop inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
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
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
              className="glass-pop pop-float absolute -top-4 left-2 z-40 hidden rounded-2xl px-3.5 py-2 sm:block"
            >
              <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">Latency</p>
              <p className="text-sm font-bold text-brand-navy">
                0.3s <span className="text-brand-orange">live</span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
              className="glass-pop pop-float-delay absolute -bottom-3 right-0 z-40 hidden rounded-2xl px-3.5 py-2 sm:block"
            >
              <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">On-device</p>
              <p className="text-sm font-bold text-brand-navy">100% private</p>
            </motion.div>
            <HeroIllustration />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
