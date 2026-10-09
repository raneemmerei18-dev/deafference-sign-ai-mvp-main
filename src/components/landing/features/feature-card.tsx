"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FeatureCardData } from "./feature-card-grid"
import { TiltWrap, focusRingPop } from "../ui/pop"

const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -10, scale: 1.015 },
}

export function FeatureCard({ card, reducedMotion = false }: { card: FeatureCardData; reducedMotion?: boolean }) {
  const { title, pillText, icon: Icon, illustration: Illustration, subtitle, badgeTag, detail, learnMore, learnMoreHref } = card

  return (
    <TiltWrap className="h-full">
      <motion.div
        className="group relative flex h-full flex-col items-center"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="glass-pop glow-border-pop relative flex min-h-[390px] w-full flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-[0_20px_50px_-20px_rgba(59,130,246,0.35)] transition-shadow duration-300 group-hover:shadow-[0_28px_64px_-16px_rgba(59,130,246,0.45)] sm:p-7"
        >
          {/* Soft blue gradient wash + a single sparing orange glow accent */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/8 via-transparent to-[color:var(--pop-lavender)]/12" />
          <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-[color:var(--primary)]/18 blur-2xl transition-all duration-300 group-hover:bg-[color:var(--primary)]/30" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 -mb-14 -ml-14 h-40 w-40 rounded-full bg-brand-orange/10 blur-2xl transition-all duration-300 group-hover:bg-brand-orange/16" />

          <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[color:var(--primary)]/15 transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
            >
              <Icon className="h-5 w-5 text-[#2563EB] sm:h-6 sm:w-6" strokeWidth={2.3} />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="text-lg leading-tight font-extrabold tracking-tight text-foreground sm:text-xl">{title}</h3>
                {badgeTag && (
                  <span className="hidden items-center rounded-full bg-[color:var(--primary)]/10 px-2 py-0.5 text-xs font-bold text-[#1D4ED8] xl:inline-flex">
                    {badgeTag}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="relative z-10 my-2 flex min-h-[150px] w-full flex-1 items-center justify-center" aria-hidden="true">
            <Illustration reducedMotion={reducedMotion} />
          </div>

          {/* Detail: always in the flow below `lg` (touch-friendly); on large screens it slides up
              over the illustration on hover or when the link inside receives keyboard focus. */}
          <div
            className={cn(
              "relative z-20 mt-2 transition-all duration-300 ease-out",
              "lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:translate-y-full lg:rounded-b-3xl lg:bg-gradient-to-t lg:from-white lg:via-white/95 lg:to-white/0 lg:px-6 lg:pt-12 lg:pb-5 lg:opacity-0",
              "lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
            )}
          >
            <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
            <a
              href={learnMoreHref}
              className={cn(
                "group/link mt-2 inline-flex items-center gap-1 rounded-md text-sm font-bold text-[#1D4ED8] underline-offset-4 hover:underline",
                focusRingPop,
              )}
            >
              {learnMore}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <div className="relative z-20 -mt-6">
          <span className="flex items-center justify-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-white px-6 py-3 text-sm font-extrabold tracking-wider text-[#1D4ED8] shadow-lg sm:text-base">
            <span className="uppercase">{pillText}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
          </span>
        </div>
      </motion.div>
    </TiltWrap>
  )
}
