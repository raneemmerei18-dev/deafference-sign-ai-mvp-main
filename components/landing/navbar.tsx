"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Container } from "@/components/shared/container"
import { LANDING_NAV, APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { CalmModeToggle } from "./calm-mode-toggle"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const className = cn(
    "rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
    FOCUS_RING,
  )
  return href.startsWith("#") ? (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className} onClick={onClick}>
      {label}
    </Link>
  )
}

// Waveform + open-hand fusion mark, now a single solid-orange symbol rather
// than the old multi-color gradient chip.
function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="var(--brand-orange)" />
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled ? "border-black/[0.06] bg-[#FAF8F4]/85 shadow-[0_8px_30px_-20px_rgba(14,35,68,0.25)] backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <a href="#top" className={cn("flex items-center gap-2.5 rounded-lg", FOCUS_RING)} aria-label="Deafference home">
          <BrandMark />
          <span className="text-xl font-bold tracking-tight text-brand-navy">Deafference</span>
        </a>

        <nav aria-label="Main Navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LANDING_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <CalmModeToggle />
          </div>

          <Link
            href={APP_ROUTES.translate}
            className={cn(
              "group hidden items-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(14,35,68,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-10px_rgba(14,35,68,0.6)] lg:inline-flex",
              FOCUS_RING,
            )}
          >
            Request a demo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-lg text-brand-navy transition-colors hover:bg-black/5 lg:hidden",
              FOCUS_RING,
            )}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuPanelRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-black/[0.06] bg-[#FAF8F4] lg:hidden"
          >
            <Container className="py-4">
              <nav id="mobile-nav" aria-label="Main Navigation">
                <ul className="flex flex-col gap-1">
                  {LANDING_NAV.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-3 flex flex-col gap-3 border-t border-black/[0.06] pt-3">
                <CalmModeToggle className="self-start" />
                <Link
                  href={APP_ROUTES.translate}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-4 py-3 text-sm font-semibold text-white",
                    FOCUS_RING,
                  )}
                >
                  Request a demo
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
