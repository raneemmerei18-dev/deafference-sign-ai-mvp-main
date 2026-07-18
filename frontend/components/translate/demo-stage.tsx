'use client'

// MOCK UI — no live inference. All state transitions are scripted timers over
// a controlled phrase library. No microphone, camera, speech recognition, or ML.

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Play,
  RotateCcw,
  Settings2,
  Type,
  Contrast,
  Sparkles,
  ChevronUp,
  Waves,
} from 'lucide-react'
import { SignalTrails } from '@/components/motion/signal-trails'
import { Waveform } from '@/components/motion/waveform'
import {
  PHRASE_LIBRARY,
  STATE_LABEL,
  UNAVAILABLE_SAMPLE,
  type DemoState,
  type Phrase,
} from '@/lib/mock-demo'

const EASE = [0.16, 1, 0.3, 1] as const

const STATE_TONE: Record<DemoState, string> = {
  ready: 'text-muted-dark',
  listening: 'text-voice',
  captioning: 'text-text-dark',
  matched: 'text-signal',
  signing: 'text-signal',
  unavailable: 'text-voice',
  complete: 'text-signal',
}

export function DemoStage() {
  const systemReduce = useReducedMotion()
  const [state, setState] = useState<DemoState>('ready')
  const [caption, setCaption] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Settings
  const [captionSize, setCaptionSize] = useState<'md' | 'lg' | 'xl'>('lg')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const reduce = systemReduce || reducedMotion

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const run = useCallback(
    (phrase: Phrase) => {
      clearTimers()
      setCaption('')
      setState('listening')
      const push = (fn: () => void, ms: number) =>
        timers.current.push(setTimeout(fn, ms))

      push(() => setState('captioning'), 1400)
      push(() => setCaption(phrase.text), 1600)
      if (phrase.supported) {
        push(() => setState('matched'), 2900)
        push(() => setState('signing'), 3900)
        push(() => setState('complete'), 7000)
      } else {
        push(() => setState('unavailable'), 2900)
      }
    },
    [],
  )

  const startDefault = () => run(PHRASE_LIBRARY[0])
  const tryUnavailable = () =>
    run({
      id: 'unavailable',
      text: UNAVAILABLE_SAMPLE,
      environment: 'General',
      supported: false,
    })
  const restart = () => {
    clearTimers()
    setCaption('')
    setState('ready')
  }

  const isActive = state !== 'ready'
  const captionCls =
    captionSize === 'xl' ? 'text-4xl sm:text-6xl' : captionSize === 'lg' ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'

  return (
    <div className={highContrast ? 'contrast-[1.35] saturate-[1.2]' : ''}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-text-dark"
          aria-label="Deafference home"
        >
          <img src="/logo.png" alt="Deafference" className="h-8 w-auto" />
        </Link>
        <span className="caption-mono text-xs text-muted-dark">Demo · Mock predictions</span>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-28 pt-4 md:px-8 lg:grid-cols-[1fr_18rem]">
        {/* Stage */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-black/10 sm:aspect-[16/11]">
          <Image
            src="/signer-stage.png"
            alt="Signing stage showing a person ready to sign a supported phrase"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48rem"
            className="object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-paper/40" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <SignalTrails active={state === 'signing' && !reduce} className="h-3/5 w-3/5" />
          </div>

          {/* State indicator */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-paper/70 px-3 py-1.5 ring-1 ring-black/10 backdrop-blur-sm">
            {state === 'listening' ? (
              <Waveform active={!reduce} bars={12} className="h-4" />
            ) : (
              <span
                className={`h-2 w-2 rounded-full ${
                  state === 'ready' ? 'bg-muted-light' : 'bg-signal'
                }`}
              />
            )}
            <span className={`caption-mono text-xs ${STATE_TONE[state]}`}>
              {STATE_LABEL[state]}
            </span>
          </div>

          {/* Dominant live caption */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {caption && state !== 'unavailable' && (
                <motion.p
                  key={caption}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`caption-mono font-medium text-text-dark ${captionCls}`}
                >
                  {caption}
                </motion.p>
              )}
              {state === 'unavailable' && (
                <motion.p
                  key="unavailable"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`caption-mono font-medium text-voice ${captionCls}`}
                >
                  That phrase is not available yet.
                </motion.p>
              )}
            </AnimatePresence>

            {state === 'matched' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="caption-mono mt-3 inline-flex items-center gap-1.5 text-sm text-signal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Supported phrase found
              </motion.span>
            )}
          </div>
        </div>

        {/* Side rail: settings + phrase drawer */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl bg-paper-raised p-4 ring-1 ring-black/10">
            <button
              type="button"
              onClick={() => setSettingsOpen((o) => !o)}
              aria-expanded={settingsOpen}
              className="flex w-full items-center justify-between text-sm font-medium text-text-dark"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" aria-hidden="true" /> Settings
              </span>
              <ChevronUp
                className={`h-4 w-4 transition-transform ${settingsOpen ? '' : 'rotate-180'}`}
                aria-hidden="true"
              />
            </button>

            {settingsOpen && (
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <span className="mb-2 flex items-center gap-2 text-xs text-muted-dark">
                    <Type className="h-3.5 w-3.5" aria-hidden="true" /> Caption size
                  </span>
                  <div className="flex gap-2" role="group" aria-label="Caption size">
                    {(['md', 'lg', 'xl'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCaptionSize(s)}
                        aria-pressed={captionSize === s}
                        className={`h-9 flex-1 rounded-lg text-xs uppercase ring-1 transition-colors ${
                          captionSize === s
                            ? 'bg-signal text-ink ring-signal'
                            : 'text-muted-dark ring-black/15 hover:bg-black/5'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow
                  icon={<Contrast className="h-3.5 w-3.5" aria-hidden="true" />}
                  label="High contrast"
                  on={highContrast}
                  onToggle={() => setHighContrast((v) => !v)}
                />
                <ToggleRow
                  icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                  label="Reduced motion"
                  on={reducedMotion}
                  onToggle={() => setReducedMotion((v) => !v)}
                />
              </div>
            )}
          </div>

          {/* Phrase drawer */}
          <div className="rounded-2xl bg-paper-raised p-4 ring-1 ring-black/10">
            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-expanded={drawerOpen}
              className="flex w-full items-center justify-between text-sm font-medium text-text-dark"
            >
              Supported phrases
              <ChevronUp
                className={`h-4 w-4 transition-transform ${drawerOpen ? '' : 'rotate-180'}`}
                aria-hidden="true"
              />
            </button>
            {drawerOpen && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {PHRASE_LIBRARY.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => run(p)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-dark ring-1 ring-black/10 transition-colors hover:bg-black/5 hover:text-text-dark"
                    >
                      <span className="caption-mono">{p.text}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={tryUnavailable}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs text-muted-dark ring-1 ring-dashed ring-black/15 transition-colors hover:bg-black/5"
                  >
                    Try an unsupported phrase
                  </button>
                </li>
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Control bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8">
          <span className={`caption-mono text-sm ${STATE_TONE[state]}`}>{STATE_LABEL[state]}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startDefault}
              disabled={isActive && state !== 'complete' && state !== 'unavailable'}
              className="flex h-11 items-center gap-2 rounded-full bg-signal px-6 text-sm font-medium text-ink transition-transform enabled:hover:scale-[1.03] disabled:opacity-40"
            >
              <Play className="h-4 w-4" aria-hidden="true" /> Say &ldquo;Good morning&rdquo;
            </button>
            <button
              type="button"
              onClick={restart}
              className="flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-text-dark ring-1 ring-black/20 transition-colors hover:bg-black/5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  on,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className="flex items-center justify-between"
    >
      <span className="flex items-center gap-2 text-xs text-muted-dark">
        {icon} {label}
      </span>
      <span
        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          on ? 'bg-signal' : 'bg-black/15'
        }`}
      >
        <span
          className={`absolute left-0.5 h-5 w-5 rounded-full bg-paper-raised transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}
