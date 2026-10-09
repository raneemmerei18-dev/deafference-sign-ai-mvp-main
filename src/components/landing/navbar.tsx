"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, X } from "lucide-react"
import { Container } from "@/components/shared/container"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { LANDING_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { AuthNavActions } from "@/components/auth/auth-nav-actions"
import { CalmModeToggle } from "./calm-mode-toggle"
import { navLabel, resolveLandingHref } from "./nav-links"
import { Magnetic, focusRingPop, popArrowIcon, popButtonSizes, popPrimaryButton } from "./ui/pop"

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
    "relative z-10 block rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors xl:px-4",
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
  const pathname = usePathname()
  const { t } = useI18n()
  const nav = t.landing.nav
  const navItems = LANDING_NAV.map((item) => ({
    key: item.href,
    href: resolveLandingHref(item.href, pathname),
    label: navLabel(nav.links, item.href, item.label),
  }))
  const demoHref = resolveLandingHref("#demo", pathname)

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
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        menuToggleRef.current?.focus()
      }
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
          <a
            href={pathname === "/" ? "#top" : "/"}
            aria-label={nav.home}
            className={cn("flex shrink-0 items-center gap-2.5 rounded-lg", focusRingPop)}
          >
            {/* The landing surface is always light, so always use the light-surface wordmark. */}
            <img src="/deafference-wordmark.png" alt="" className="h-10 w-auto sm:h-12" />
          </a>

          <nav aria-label={nav.desktopLabel} className="hidden lg:block">
            <ul className="relative flex items-center gap-0.5 rounded-full border border-[color:var(--primary)]/12 bg-white/50 p-1">
              {navItems.map((item) => (
                <li key={item.key} className="relative">
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
            <div className="hidden items-center gap-2 lg:flex">
              <CalmModeToggle labelClassName="hidden xl:inline" />
              <LanguageToggle />
            </div>

            <Magnetic className="hidden lg:inline-block">
              <a href={demoHref} className={cn(popPrimaryButton, popButtonSizes.sm, "whitespace-nowrap")}>
                {nav.requestDemo}
                <ArrowRight className={popArrowIcon} aria-hidden="true" />
              </a>
            </Magnetic>

            <LanguageToggle className="lg:hidden" />

            <AuthNavActions className="hidden lg:flex" />

            <button
              ref={menuToggleRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? nav.closeMenu : nav.openMenu}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-[color:var(--primary)]/10 lg:hidden",
                focusRingPop,
              )}
            >
              {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
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
              <nav id="mobile-nav" aria-label={nav.mobileLabel}>
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.key}
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
                <a
                  href={demoHref}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(popPrimaryButton, popButtonSizes.md, "w-full")}
                >
                  {nav.requestDemo}
                  <ArrowRight className={popArrowIcon} aria-hidden="true" />
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
