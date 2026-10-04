"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Container } from "@/components/shared/container"
import { LANDING_NAV, APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { AuthNavActions } from "@/components/auth/auth-nav-actions"
import { CalmModeToggle } from "./calm-mode-toggle"
import { Magnetic, focusRingPop } from "./ui/pop"

function NavLink({
  href,
  label,
  onClick,
  onHover,
  isActive,
}: {
  href: string
  label: string
  onClick?: () => void
  onHover?: (hovering: boolean) => void
  isActive?: boolean
}) {
  const className = cn(
    "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors",
    isActive ? "text-brand-navy" : "text-foreground/65 hover:text-brand-navy",
    focusRingPop,
  )
  const props = {
    className,
    onClick,
    onMouseEnter: () => onHover?.(true),
    onMouseLeave: () => onHover?.(false),
  }
  return href.startsWith("#") ? (
    <a href={href} {...props}>
      {label}
    </a>
  ) : (
    <Link href={href} {...props}>
      {label}
    </Link>
  )
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
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
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none sticky top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <motion.div
        animate={{ width: isScrolled ? "min(100%, 68rem)" : "min(100%, 80rem)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto w-full rounded-[1.75rem] transition-all duration-300",
          isScrolled ? "glass-pop shadow-[0_18px_50px_-28px_rgba(30,64,175,0.45)]" : "border border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <a href="#top" className={cn("flex items-center gap-2.5 rounded-lg", focusRingPop)}>
            {/* Transparent wordmark; the grey-ink variant keeps it readable in dark mode. */}
            <img src="/deafference-wordmark.png" alt="Deafference" className="h-11 w-auto dark:hidden sm:h-12" />
            <img src="/deafference-wordmark-dark.png" alt="Deafference" className="hidden h-11 w-auto dark:block sm:h-12" />
          </a>

          <nav aria-label="Main Navigation" className="hidden lg:block">
            <ul className="relative flex items-center gap-0.5 rounded-full border border-[color:var(--primary)]/12 bg-white/50 p-1">
              {LANDING_NAV.map((item) => (
                <li key={item.href} className="relative">
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover-indicator"
                      className="absolute inset-0 rounded-full bg-[color:var(--primary)]/12"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <NavLink
                    href={item.href}
                    label={item.label}
                    isActive={hovered === item.href}
                    onHover={(hovering) =>
                      setHovered((prev) => {
                        if (hovering) return item.href
                        return prev === item.href ? null : prev
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <CalmModeToggle />
            </div>

            <Magnetic className="hidden lg:inline-block">
              <Link
                href={APP_ROUTES.translate}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(59,130,246,0.65)] transition-all hover:shadow-[0_18px_36px_-10px_rgba(59,130,246,0.75)]",
                  focusRingPop,
                )}
              >
                Request a demo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>

            <AuthNavActions className="hidden lg:flex" />

            <button
              ref={menuToggleRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-[color:var(--primary)]/10 lg:hidden",
                focusRingPop,
              )}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuPanelRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-pop pointer-events-auto absolute inset-x-3 top-[4.75rem] rounded-3xl p-2 shadow-[0_24px_60px_-24px_rgba(30,64,175,0.5)] lg:hidden"
          >
            <Container className="py-2">
              <nav id="mobile-nav" aria-label="Main Navigation">
                <ul className="flex flex-col gap-1">
                  {LANDING_NAV.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                    >
                      <NavLink
                        href={item.href}
                        label={item.label}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="mt-3 flex flex-col gap-3 border-t border-[color:var(--primary)]/12 pt-3">
                <CalmModeToggle className="self-start" />
                <AuthNavActions className="self-start" />
                <Link
                  href={APP_ROUTES.translate}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-3 text-sm font-semibold text-white",
                    focusRingPop,
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
