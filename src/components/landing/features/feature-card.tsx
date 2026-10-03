"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { FeatureCardData } from "./feature-card-grid"
import { TiltWrap } from "../ui/pop"

const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -10, scale: 1.015 },
}

const revealVariants = {
  rest: { y: "100%", opacity: 0 },
  hover: { y: "0%", opacity: 1 },
}

export function FeatureCard({ card }: { card: FeatureCardData }) {
  const { title, pillText, icon: Icon, illustration: Illustration, subtitle, badgeTag, detail } = card

  return (
    <TiltWrap className="h-full">
      <motion.div
        className="group relative flex h-full flex-col items-center select-none"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="glass-pop glow-border-pop relative flex h-[390px] w-full flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-[0_20px_50px_-20px_rgba(59,130,246,0.35)] transition-shadow duration-300 group-hover:shadow-[0_28px_64px_-16px_rgba(59,130,246,0.45)] sm:p-7"
        >
          {/* Soft blue gradient wash + a single sparing orange glow accent */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/8 via-transparent to-[color:var(--pop-lavender)]/12" />
          <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-[color:var(--primary)]/18 blur-2xl transition-all duration-300 group-hover:bg-[color:var(--primary)]/30" />
          <div className="pointer-events-none absolute bottom-0 left-0 -mb-14 -ml-14 h-40 w-40 rounded-full bg-brand-orange/10 blur-2xl transition-all duration-300 group-hover:bg-brand-orange/16" />

          <div className="relative z-10 flex items-center space-x-2.5 sm:space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[color:var(--primary)]/15 transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
              <Icon className="h-5 w-5 text-[color:var(--primary)] sm:h-6 sm:w-6" strokeWidth={2.3} />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="text-lg leading-tight font-extrabold tracking-tight text-foreground sm:text-xl">
                  {title}
                </h3>
                {badgeTag && (
                  <span className="hidden items-center rounded-full bg-brand-orange/14 px-2 py-0.5 text-[10px] font-bold text-brand-red xl:inline-flex">
                    {badgeTag}
                  </span>
                )}
              </div>
              <p className="line-clamp-1 text-xs font-medium text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="relative z-10 my-2 flex w-full flex-1 items-center justify-center">
            <Illustration />
          </div>

          {/* Hover-reveal: slides up from the bottom to surface extra detail without shifting layout */}
          <motion.div
            variants={revealVariants}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 bottom-0 z-20 rounded-b-3xl bg-gradient-to-t from-white via-white/95 to-white/0 px-6 pt-12 pb-5 sm:px-7"
          >
            <p className="text-xs leading-6 text-muted-foreground">{detail}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--primary)]">
              Learn more
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        </motion.div>

        <div className="relative z-20 -mt-6">
          <span className="flex items-center justify-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-white px-6 py-3 text-sm font-extrabold tracking-wider text-[color:var(--primary)] shadow-lg sm:text-base">
            <span className="uppercase">{pillText}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          </span>
        </div>
      </motion.div>
    </TiltWrap>
  )
}
