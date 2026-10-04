"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/i18n/language-provider"
import styles from "./translation-nav.module.css"

export const TRANSLATION_MODES = [
  { id: "sign-to-text", label: "Sign → Text/Speech", href: "/translate/sign-to-text" },
  { id: "text-to-speech", label: "Text → Speech & Sign", href: "/translate/text-to-speech" },
  { id: "speech-to-sign", label: "Speech → Sign", href: "/translate/speech-to-sign" },
] as const

export function TranslationNav() {
  const pathname = usePathname()
  const { dict } = useLanguage()

  return (
    <nav className={styles.nav} aria-label="Translation modes">
      <div className={styles.navList}>
        {TRANSLATION_MODES.map((mode) => {
          const isActive = pathname === mode.href
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.navLabel}>{mode.label}</span>
              {isActive && <div className={styles.navIndicator} aria-hidden="true" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
