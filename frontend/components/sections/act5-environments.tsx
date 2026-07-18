'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ENVIRONMENTS } from '@/lib/mock-demo'

function Portal({ env }: { env: (typeof ENVIRONMENTS)[number] }) {
  return (
    <div className="group relative h-full w-[82vw] shrink-0 overflow-hidden md:w-[38vw]">
      <Image
        src={env.image}
        alt={`${env.name} — ${env.moment}`}
        fill
        sizes="(max-width: 768px) 82vw, 38vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className="font-display text-3xl font-medium text-text-dark md:text-4xl">
          {env.name}
        </h3>
        {/* Caption sample revealed on hover / focus */}
        <div className="mt-3 max-w-xs">
          <span className="caption-mono inline-block translate-y-1 rounded-md bg-signal/15 px-3 py-1.5 text-sm text-text-dark opacity-0 ring-1 ring-signal/30 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {env.caption}
          </span>
        </div>
      </div>

      {/* Focus target for keyboard users */}
      <button
        type="button"
        className="absolute inset-0 h-full w-full"
        aria-label={`${env.name}: sample caption "${env.caption}"`}
      />
    </div>
  )
}

export function Act5Environments() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  // Desktop pinned horizontal travel.
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-64%'])

  return (
    <section id="where" ref={ref} aria-label="Where it helps" className="bg-paper md:h-[400vh]">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-5 pt-24 md:absolute md:left-0 md:right-0 md:z-20 md:px-8">
        <h2 className="font-display text-3xl font-semibold text-text-dark md:text-4xl">
          Everywhere the signal travels
        </h2>
      </div>

      {/* Desktop: pinned horizontal strip */}
      <div className="sticky top-0 hidden h-[100svh] items-center overflow-hidden md:flex">
        <motion.div style={{ x: reduce ? '0%' : x }} className="flex h-[70vh] gap-5 pl-8">
          {ENVIRONMENTS.map((env) => (
            <Portal key={env.id} env={env} />
          ))}
        </motion.div>
      </div>

      {/* Mobile: native horizontal scroll-snap */}
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-16 pt-8 md:hidden">
        {ENVIRONMENTS.map((env) => (
          <div key={env.id} className="h-[60vh] snap-center">
            <Portal env={env} />
          </div>
        ))}
      </div>
    </section>
  )
}
