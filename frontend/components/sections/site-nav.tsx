'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Waves } from 'lucide-react'

const LINKS = [
  { label: 'How it works', href: '/#how' },
  { label: 'Where it helps', href: '/#where' },
  { label: 'For business', href: '/#business' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-text-dark"
          aria-label="Deafference home"
        >
          <img src="/logo.png" alt="Deafference" className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-dark transition-colors hover:text-text-dark"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/translate"
            className="rounded-full bg-signal px-5 py-2 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Try the demo
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-text-dark md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="font-display text-lg font-semibold text-text-dark">
                Deafference
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-text-dark"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 px-6 pb-24">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.4 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl font-medium text-text-dark"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/translate"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-signal px-6 py-4 text-base font-medium text-ink"
              >
                Try the demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
