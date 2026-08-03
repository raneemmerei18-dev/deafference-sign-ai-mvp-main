'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Why Us', href: '/#how' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Scenarios', href: '/#where' },
  { label: 'Features', href: '/#business' },
  { label: 'FAQ', href: 'mailto:hello@deafference.example' },
] as const

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink'

// Waveform + open-hand fusion mark: the two motifs the rest of the site
// already uses (Waveform, SignalTrails) collapsed into a single lockup.
function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="var(--signal)" />
      <rect x="7" y="16" width="2.2" height="7" rx="1.1" fill="white" fillOpacity="0.55" />
      <rect x="10.5" y="12" width="2.2" height="14" rx="1.1" fill="white" fillOpacity="0.7" />
      <rect x="14" y="9" width="2.2" height="20" rx="1.1" fill="white" fillOpacity="0.85" />
      <path
        d="M18.5 21.5c0-4.6.9-8.3 1.9-8.3.9 0 1.5 2.6 1.5 5.5 0-3.7 1.3-6.8 2.3-6.6.9.2 1.1 3 1 5.9.9-2.7 2-4.5 2.8-4.1.8.4.3 3.6-.6 5.8-.9 2.3-2.6 4.3-5 4.3-2.7 0-3.9-1.3-3.9-2.5Z"
        fill="white"
      />
    </svg>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Blur lives on this inner wrapper, not the fixed <header> itself —
          backdrop-filter on a fixed ancestor would otherwise become the
          containing block for the fixed-position mobile drawer below. */}
      <div className="border-b border-white/10 bg-ink/85 shadow-[0_1px_24px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8"
        >
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-lg ${FOCUS_RING}`}
            aria-label="Deafference home"
          >
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-white">Deafference</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white ${FOCUS_RING}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/translate"
              className={`hidden items-center gap-2 rounded-lg bg-gradient-to-r from-signal to-signal-deep px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 md:inline-flex ${FOCUS_RING}`}
            >
              Try App / Translate
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`flex h-11 w-11 items-center justify-center rounded-lg text-white md:hidden ${FOCUS_RING}`}
            >
              {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 flex flex-col bg-ink md:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-2 px-6 pb-24">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg py-3 text-3xl font-medium text-slate-300 transition-colors hover:text-white ${FOCUS_RING}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/translate"
                onClick={() => setOpen(false)}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-signal to-signal-deep px-6 py-4 text-base font-semibold text-white ${FOCUS_RING}`}
              >
                Try App / Translate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
