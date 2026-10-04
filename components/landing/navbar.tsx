"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { requestContact } from "./contact-intent"
import { CloseIcon, GlobeIcon, MenuIcon } from "./icons"
import { LogoMark } from "./logo"
import styles from "./navbar.module.css"

const NAV_LINKS = [
  { href: "#demo", key: "demo" },
  { href: "/translate/sign-to-text", key: "translate", external: true },
  { href: "#pricing", key: "pricing" },
  { href: "#contact", key: "contact" },
] as const

// Keep in sync with the desktop breakpoint in navbar.module.css.
const DESKTOP_QUERY = "(min-width: 960px)"

export function Navbar() {
  const { dict } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const handleBreakpoint = () => desktop.matches && setIsMenuOpen(false)

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    desktop.addEventListener("change", handleBreakpoint)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
      desktop.removeEventListener("change", handleBreakpoint)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)
  const bookDemo = () => {
    closeMenu()
    requestContact("demo")
  }

  return (
    <header ref={headerRef} className={styles.header} data-elevated={isScrolled || isMenuOpen}>
      <div className={`container ${styles.bar}`}>
        <a href="#top" className={styles.brand} aria-label={dict.nav.home}>
          <LogoMark />
          <span>Deafference</span>
        </a>

        <nav aria-label={dict.nav.mainNav} className={styles.desktopNav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.navLink} {...("external" in link && link.external ? { target: "_self" } : {})}>
                  {dict.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageToggle />
          <a href="#contact" onClick={bookDemo} className={`btn btn-primary ${styles.demoButton}`}>
            {dict.nav.bookDemo}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={styles.mobilePanel} hidden={!isMenuOpen}>
        <div className="container">
          <nav aria-label={dict.nav.mainNav}>
            <ul className={styles.mobileList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.mobileLink} onClick={closeMenu} {...("external" in link && link.external ? { target: "_self" } : {})}>
                    {dict.nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#contact" onClick={bookDemo} className={`btn btn-primary btn-block ${styles.mobileDemoButton}`}>
            {dict.nav.bookDemo}
          </a>
        </div>
      </div>
    </header>
  )
}

function LanguageToggle() {
  const { dict, locale, setLocale } = useLanguage()
  const nextLocale = locale === "en" ? "ar" : "en"

  // Accessible name reads "Switch language to العربية": it contains the
  // visible label (WCAG 2.5.3) and the target language is marked with its own
  // lang attribute so screen readers pronounce it correctly.
  return (
    <button type="button" className={styles.languageToggle} onClick={() => setLocale(nextLocale)}>
      <GlobeIcon size={18} />
      <span className="visually-hidden">{dict.nav.switchLanguageTo} </span>
      <span lang={nextLocale}>{dict.nav.otherLanguageName}</span>
    </button>
  )
}
