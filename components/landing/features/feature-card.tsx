"use client"

import { motion } from "framer-motion"
import type { FeatureCardData } from "./feature-card-grid"

export function FeatureCard({ card }: { card: FeatureCardData }) {
  const { title, pillText, icon: Icon, illustration: Illustration, subtitle, badgeTag } = card

  return (
    <motion.div
      className="group relative flex flex-col items-center select-none"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative flex h-[390px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-orange-400/30 bg-[#EE6C2B] p-6 shadow-[0_12px_32px_-8px_rgba(238,108,43,0.3),0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover:shadow-[0_24px_48px_-12px_rgba(238,108,43,0.45),0_12px_24px_-6px_rgba(0,0,0,0.15)] sm:p-7">
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/15" />
        <div className="pointer-events-none absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 flex items-center space-x-2.5 sm:space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
            <Icon className="h-5 w-5 text-[#EE6C2B] sm:h-6 sm:w-6" strokeWidth={2.3} />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <h3 className="text-lg leading-tight font-extrabold tracking-tight text-white sm:text-xl">{title}</h3>
              {badgeTag && (
                <span className="hidden items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md xl:inline-flex">
                  {badgeTag}
                </span>
              )}
            </div>
            <p className="line-clamp-1 text-xs font-medium text-orange-100/90">{subtitle}</p>
          </div>
        </div>

        <div className="relative z-10 my-2 flex w-full flex-1 items-center justify-center">
          <Illustration />
        </div>
      </div>

      <div className="relative z-20 -mt-6">
        <span className="flex items-center justify-center space-x-2 rounded-full border border-orange-100/80 bg-white px-6 py-3 text-sm font-extrabold tracking-wider text-[#EE6C2B] shadow-lg sm:text-base">
          <span className="uppercase">{pillText}</span>
        </span>
      </div>
    </motion.div>
  )
}
