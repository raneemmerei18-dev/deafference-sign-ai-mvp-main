"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import {
  dictionaries,
  dirFor,
  LOCALE_COOKIE,
  type Dictionary,
  type Direction,
  type Locale,
} from "@/lib/i18n/dictionaries"

interface LanguageContextValue {
  locale: Locale
  dir: Direction
  dict: Dictionary
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    // The server reads this cookie to render the right lang/dir on the next
    // load; update <html> now so the switch applies without a reload.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
    document.documentElement.lang = next
    document.documentElement.dir = dirFor(next)
    document.title = dictionaries[next].meta.title
  }, [])

  const value = useMemo(
    () => ({ locale, dir: dirFor(locale), dict: dictionaries[locale], setLocale }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>.")
  return context
}
