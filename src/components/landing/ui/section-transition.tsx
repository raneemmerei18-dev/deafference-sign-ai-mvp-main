"use client"

import { useRef, type ReactNode } from "react"
import { easeIn, easeOut, motion, useScroll, useTransform } from "framer-motion"
import { useLandingReducedMotion } from "../calm-mode"

/**
 * Scroll-linked "page turn" for landing sections: each section rises and fades
 * in as its top enters the viewport, then recedes (dims, eases back, shrinks a
 * touch) as its bottom leaves — so scrolling feels like moving between pages
 * while staying one page at one URL. Only opacity/transform are animated
 * (compositor-only, no layout). Disabled entirely under calm mode or OS
 * reduced motion. `first` skips the entrance for the above-the-fold section.
 */
export function SectionTransition({ children, first = false }: { children: ReactNode; first?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useLandingReducedMotion()

  // Entrance: section top travels from viewport bottom to 55% of the viewport.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.55"] })
  // Exit: section bottom travels from 45% of the viewport to the top edge.
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end 0.45", "end start"] })

  const opacity = useTransform([enter, leave], ([e, l]: number[]) => {
    const inPart = first ? 1 : 0.15 + 0.85 * easeOut(e)
    return inPart * (1 - 0.7 * easeIn(l))
  })
  const y = useTransform([enter, leave], ([e, l]: number[]) => {
    const inPart = first ? 0 : (1 - easeOut(e)) * 64
    // Slight lag on the way out reads as parallax: the old page falls behind.
    return inPart + easeIn(l) * 32
  })
  const scale = useTransform(leave, [0, 1], [1, 0.965], { ease: easeIn })

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { opacity, y, scale, transformOrigin: "50% 0%" }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}
