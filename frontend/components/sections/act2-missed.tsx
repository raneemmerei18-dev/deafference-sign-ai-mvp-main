'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export function Act2Missed() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Scene desaturates as the missed moment lands, then recovers.
  const saturate = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [1, 0.35, 0.35, 0.7])
  const filter = useTransform(saturate, (s) => `saturate(${s})`)

  // Coral signal stops mid-way, teal signal takes over and heads onward.
  const coralLen = useTransform(scrollYProgress, [0.1, 0.45], [0, 0.55])
  const tealLen = useTransform(scrollYProgress, [0.5, 0.9], [0, 1])
  const lineOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])

  return (
    <section
      id="how"
      ref={ref}
      aria-label="A missed moment"
      className="relative min-h-[100svh] w-full overflow-hidden bg-paper"
    >
      <motion.div style={reduce ? undefined : { filter }} className="absolute inset-0">
        <Image
          src="/clinic-waiting.png"
          alt="A Deaf woman sits in a clinic waiting room while a receptionist calls a name in the background"
          fill
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-paper/50" />
      </motion.div>

      {/* Stalled coral → teal signal */}
      <motion.svg
        style={{ opacity: reduce ? 1 : lineOpacity }}
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="absolute left-0 top-1/2 h-24 w-full -translate-y-1/2"
        aria-hidden="true"
      >
        <motion.path
          d="M0 15 C 20 5, 30 25, 45 15"
          stroke="var(--voice)"
          strokeWidth={0.5}
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: reduce ? 0.55 : coralLen }}
        />
        <motion.path
          d="M45 15 C 60 6, 75 24, 100 12"
          stroke="var(--signal)"
          strokeWidth={0.5}
          fill="none"
          strokeLinecap="round"
          style={{
            pathLength: reduce ? 1 : tealLen,
            filter: 'drop-shadow(0 0 3px var(--signal))',
          }}
        />
        <circle cx="45" cy="15" r="1.1" fill="var(--voice)" />
      </motion.svg>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl items-end px-5 pb-24 md:items-center md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl font-serif text-4xl leading-tight text-text-dark text-balance sm:text-5xl md:text-6xl"
        >
          It shouldn&apos;t take luck to be understood.
        </motion.p>
      </div>
    </section>
  )
}
