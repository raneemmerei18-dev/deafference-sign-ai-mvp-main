'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, Pause, RotateCcw, Captions, Waves } from 'lucide-react'
import { SignalTrails } from '@/components/motion/signal-trails'

const EASE = [0.16, 1, 0.3, 1] as const
const RAIL = ['Speech detected', 'Phrase matched', 'Sign playing'] as const

// MOCK UI — no live inference. Scripted three-state playback.
export function Act6ProofCta() {
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [stage, setStage] = useState(0)
  const [captionsOn, setCaptionsOn] = useState(true)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current)
      return
    }
    timer.current = setInterval(() => {
      setStage((s) => {
        if (s >= RAIL.length - 1) {
          setPlaying(false)
          setDone(true)
          return s
        }
        return s + 1
      })
    }, 1500)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing])

  const start = () => {
    if (done) {
      setStage(0)
      setDone(false)
    }
    setPlaying(true)
  }
  const replay = () => {
    setStage(0)
    setDone(false)
    setPlaying(true)
  }

  return (
    <section id="business" aria-label="Product proof and next step" className="relative bg-paper">
      {/* Demo stage */}
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-black/10 sm:aspect-[3/4]">
          <Image
            src="/signer-stage.png"
            alt="A person signing a supported phrase on the demo stage"
            fill
            sizes="(max-width: 640px) 100vw, 28rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/30" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <SignalTrails active={playing && !reduce} className="h-3/5 w-3/5" />
          </div>

          {/* Caption */}
          {captionsOn && (
            <div className="absolute inset-x-0 bottom-24 flex justify-center px-4">
              <span className="caption-mono rounded-md bg-paper/75 px-3 py-1.5 text-base text-text-dark ring-1 ring-black/10">
                Good morning.
              </span>
            </div>
          )}

          {/* State rail */}
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 px-4">
            {RAIL.map((label, i) => (
              <div
                key={label}
                className={`caption-mono rounded-full px-2.5 py-1 text-[10px] transition-colors duration-500 sm:text-xs ${
                  i <= stage && (playing || done)
                    ? 'bg-signal/20 text-signal ring-1 ring-signal/40'
                    : 'bg-black/5 text-muted-dark'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (playing ? setPlaying(false) : start())}
            className="flex h-11 min-w-11 items-center gap-2 rounded-full bg-signal px-5 text-sm font-medium text-ink"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={replay}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-dark ring-1 ring-black/20 transition-colors hover:bg-black/5"
            aria-label="Replay"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCaptionsOn((c) => !c)}
            aria-pressed={captionsOn}
            className={`flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-colors ${
              captionsOn
                ? 'bg-black/10 text-text-dark ring-black/20'
                : 'text-muted-dark ring-black/10 hover:bg-black/5'
            }`}
            aria-label="Toggle captions"
          >
            <Captions className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden border-t border-black/5 px-5 py-28 md:px-8 md:py-40">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ originX: 0 }}
          className="mx-auto mb-12 h-px w-full max-w-3xl bg-gradient-to-r from-voice via-signal to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-text-dark text-balance sm:text-5xl md:text-6xl">
            Make the next conversation visible.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/translate"
              className="inline-flex min-h-11 items-center rounded-full bg-signal px-7 py-3 text-base font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Try the demo
            </Link>
            <Link
              href="mailto:hello@deafference.example"
              className="inline-flex min-h-11 items-center rounded-full px-7 py-3 text-base font-medium text-text-dark ring-1 ring-black/20 transition-colors hover:bg-black/5"
            >
              Plan a pilot
            </Link>
          </div>
        </div>
      </div>

      {/* Compact footer */}
      <footer className="border-t border-black/5 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link
              href="/"
              className="flex items-center gap-2.5 text-text-dark"
              aria-label="Deafference home"
            >
              <img src="/logo.png" alt="Deafference" className="h-8 w-auto" />
          </Link>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {['Product', 'Business', 'Accessibility', 'Contact'].map((l) => (
              <a
                key={l}
                href="#top"
                className="text-sm text-muted-dark transition-colors hover:text-text-dark"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </section>
  )
}
