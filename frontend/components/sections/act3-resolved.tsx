'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Waveform } from '@/components/motion/waveform'
import { Hand } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export function Act3Resolved() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0) // 0 speak · 1 caption · 2 sign
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.34 ? 0 : v < 0.66 ? 1 : 2
    setPhase((p) => (p === next ? p : next))
  })

  return (
    <section ref={ref} aria-label="The same moment, resolved" className="relative h-[300vh] bg-paper">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <Image
          src="/clinic-counter.png"
          alt="A receptionist speaks with a Deaf woman at a clinic counter, a tablet between them"
          fill
          sizes="100vw"
          className="object-cover object-[55%_center]"
        />
        <div className="absolute inset-0 bg-paper/20" />

        {/* State 0 — receptionist speaks (coral) */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="absolute left-6 top-[28%] flex items-center gap-3 rounded-full bg-paper/70 px-4 py-2.5 ring-1 ring-black/10 backdrop-blur-sm md:left-[14%]"
            >
              <Waveform active bars={16} className="h-5" />
              <span className="caption-mono text-xs text-muted-dark">Speech detected</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State 1 — tablet caption + match (teal) */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute bottom-[30%] right-6 w-[min(20rem,78vw)] rounded-2xl bg-paper/80 p-5 ring-1 ring-black/10 backdrop-blur-md md:right-[14%]"
            >
              <p className="caption-mono text-xl text-text-dark">Good morning.</p>
              <p className="caption-mono mt-3 inline-flex items-center gap-1.5 text-xs text-signal">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Supported phrase found
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State 2 — sign playing */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute bottom-[30%] right-6 w-[min(20rem,78vw)] rounded-2xl bg-signal/15 p-5 ring-1 ring-signal/40 backdrop-blur-md md:right-[14%]"
            >
              <div className="flex items-center gap-2 text-signal">
                <Hand className="h-5 w-5" aria-hidden="true" />
                <span className="caption-mono text-xs">Sign playing</span>
              </div>
              <p className="mt-2 font-display text-lg text-text-dark">Good morning.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolution line */}
        <div className="absolute inset-x-0 bottom-12 flex justify-center gap-8 px-6 md:gap-24">
          {['Seen.', 'Understood.', 'Included.'].map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0.15 }}
              animate={{ opacity: phase === 2 ? 1 : 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: EASE }}
              className="font-display text-lg font-medium text-text-dark sm:text-2xl md:text-3xl"
            >
              {w}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
