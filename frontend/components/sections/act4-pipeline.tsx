'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion'
import { Mic } from 'lucide-react'
import { Waveform } from '@/components/motion/waveform'

const EASE = [0.16, 1, 0.3, 1] as const
const STAGES = ['Speak', 'Caption', 'Match', 'Sign'] as const

const CANDIDATES = ['Good morning.', 'Good evening.', 'Good afternoon.']

export function Act4Pipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3
    setPhase((p) => (p === next ? p : next))
  })

  return (
    <section id="how-it-works" ref={ref} aria-label="How it moves" className="relative h-[360vh] bg-paper">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Stage rail */}
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-24 md:px-8">
          {STAGES.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                    i <= phase ? 'bg-voice' : 'bg-black/15'
                  } ${i === 3 && phase === 3 ? 'bg-signal-deep' : ''}`}
                />
                <span
                  className={`caption-mono text-xs transition-colors duration-500 ${
                    i <= phase ? 'text-text-dark' : 'text-black/30'
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="mx-2 h-px flex-1 bg-black/10">
                  <motion.div
                    className="h-full bg-voice"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: i < phase ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ originX: 0 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Morphing stage */}
        <div className="relative flex flex-1 items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="speak"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-voice/20" />
                  <span className="absolute inset-4 rounded-full bg-voice/15" />
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-voice text-paper-raised">
                    <Mic className="h-9 w-9" aria-hidden="true" />
                  </span>
                </div>
                <Waveform active bars={30} className="h-8" />
              </motion.div>
            )}

            {phase === 1 && (
              <motion.div
                key="caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex items-center"
              >
                <span className="caption-mono text-4xl text-text-dark sm:text-6xl">
                  Good morning.
                </span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="ml-1 inline-block h-10 w-[3px] bg-voice sm:h-14"
                />
              </motion.div>
            )}

            {phase === 2 && (
              <motion.div
                key="match"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-3"
              >
                {CANDIDATES.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, y: 12 }}
                    animate={
                      i === 0
                        ? { opacity: 1, y: 0, scale: 1.05 }
                        : { opacity: 0.25, y: 0, filter: 'blur(2px)' }
                    }
                    transition={{ duration: 0.6, delay: 0.1 * i, ease: EASE }}
                    className={`caption-mono rounded-lg px-5 py-3 text-2xl sm:text-3xl ${
                      i === 0
                        ? 'bg-signal/15 text-text-dark ring-1 ring-signal-deep/40'
                        : 'text-black/40'
                    }`}
                  >
                    {c}
                  </motion.div>
                ))}
                <span className="caption-mono mt-2 text-xs text-signal-deep">
                  Supported phrase found
                </span>
              </motion.div>
            )}

            {phase === 3 && (
              <motion.div
                key="sign"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative"
              >
                <div className="relative h-72 w-56 overflow-hidden rounded-3xl ring-1 ring-signal-deep/30 sm:h-96 sm:w-72">
                  <Image
                    src="/signer-stage.png"
                    alt="A person completing a sign for the phrase"
                    fill
                    sizes="18rem"
                    className="object-cover"
                    style={{ filter: 'saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-signal-deep/25 mix-blend-multiply" />
                  <span className="caption-mono absolute bottom-3 left-3 rounded bg-paper/70 px-2 py-1 text-xs text-text-dark">
                    Sign playing
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Honesty label */}
        <div className="mx-auto w-full max-w-5xl px-5 pb-20 text-center md:px-8">
          <span className="caption-mono text-sm text-muted-dark">
            Today: controlled phrase matching.
          </span>
        </div>
      </div>
    </section>
  )
}
