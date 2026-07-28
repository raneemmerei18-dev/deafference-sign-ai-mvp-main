"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Container } from "@/components/shared/container"
import { LANDING_NAV, APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"

const navLinkClassName = cn(
  "rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white",
  FOCUS_RING,
)

const loginLinkClassName = cn(
  "hidden items-center rounded-lg border border-transparent px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700 hover:bg-white/5 hover:text-white md:inline-flex",
  FOCUS_RING,
)

const signUpLinkClassName = cn(
  "brand-gradient hidden items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 md:inline-flex",
  FOCUS_RING,
)

function NavLink({ href, label, className, onClick }: { href: string; label: string; className: string; onClick?: () => void }) {
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

// Waveform + open-hand fusion mark — the two ideas the product is built on
// (spoken input, signed output) collapsed into a single icon.
function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="brandMarkGradient" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="var(--brand-yellow)" />
          <stop offset="38%" stopColor="var(--brand-orange)" />
          <stop offset="72%" stopColor="var(--brand-red)" />
          <stop offset="100%" stopColor="var(--brand-magenta)" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="9" fill="url(#brandMarkGradient)" />
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
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <a href="#top" className={cn("flex items-center gap-2.5 rounded-lg", FOCUS_RING)} aria-label="Deafference home">
          <BrandMark />
          <span className="text-xl font-bold tracking-tight text-white">Deafference</span>
        </a>

        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LANDING_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} className={navLinkClassName} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href={APP_ROUTES.login} className={loginLinkClassName}>
            Login
          </Link>
          <Link href={APP_ROUTES.signup} className={signUpLinkClassName}>
            Sign Up
          </Link>

          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden",
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
            className="overflow-hidden border-t border-slate-800 bg-slate-900 md:hidden"
          >
            <Container className="py-4">
              <nav id="mobile-nav" aria-label="Main Navigation">
                <ul className="flex flex-col gap-1">
                  {LANDING_NAV.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        className={cn(navLinkClassName, "block w-full text-left text-base")}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-3">
                <Link
                  href={APP_ROUTES.login}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white",
                    FOCUS_RING,
                  )}
                >
                  Login
                </Link>
                <Link
                  href={APP_ROUTES.signup}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "brand-gradient inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white",
                    FOCUS_RING,
                  )}
                >
                  Sign Up
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
