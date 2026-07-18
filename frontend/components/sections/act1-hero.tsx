'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Waveform } from '@/components/motion/waveform'
import { SignalTrails } from '@/components/motion/signal-trails'

const EASE = [0.16, 1, 0.3, 1] as const

export function Act1Hero() {
  const reduce = useReducedMotion()
  // step: 0 waveform, 1 caption, 2 matched, 3 trails/settled
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduce) {
      setStep(3)
      return
    }
    const timers = [
      setTimeout(() => setStep(1), 1400),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 4400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-paper"
    >
      {/* Signer */}
      <div className="absolute inset-0 md:left-[42%]">
        <Image
          src="/signer-hero.png"
          alt="A Deaf woman signing, both hands and face clearly visible"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover object-[65%_20%] md:object-[center_15%]"
        />
        {/* Vignette shaped around person */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/40 to-transparent md:from-paper md:via-paper/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/60 md:via-transparent" />
        {/* Teal motion trails around hands */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SignalTrails
            active={step >= 3 && !reduce}
            className="h-[70%] w-[70%] translate-y-4"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-0">
        <div className="max-w-xl">
          {/* Signal transformation strip */}
          <div className="mb-8 flex h-8 items-center gap-3" aria-hidden="true">
            <motion.div
              animate={{ opacity: step === 0 ? 1 : 0.25, width: step >= 1 ? 0 : 'auto' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden"
            >
              <Waveform active={step === 0} bars={22} className="h-6" />
            </motion.div>

            {step >= 1 && (
              <motion.span
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="caption-mono rounded-md bg-black/8 px-3 py-1 text-sm text-text-dark ring-1 ring-black/10"
              >
                Good morning.
              </motion.span>
            )}

            {step >= 2 && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="caption-mono inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-signal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Supported phrase found
              </motion.span>
            )}
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-text-dark text-balance sm:text-6xl md:text-7xl">
            Say it.
            <br />
            See it signed.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-dark text-pretty">
            Supported speech becomes caption and sign.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/translate"
              className="inline-flex min-h-11 items-center rounded-full bg-signal px-7 py-3 text-base font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Try the demo
            </Link>
            <Link
              href="/#business"
              className="inline-flex min-h-11 items-center rounded-full px-7 py-3 text-base font-medium text-text-dark ring-1 ring-black/20 transition-colors hover:bg-black/5"
            >
              Plan a pilot
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
