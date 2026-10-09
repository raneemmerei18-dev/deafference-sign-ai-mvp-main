"use client"

import { useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useSettings } from "@/components/deafference/settings-provider"
import { dictionaries } from "./dictionaries"
import { ARABIC_LANGUAGE, ENGLISH_LANGUAGE, dirFor, fmt, isLocaleExemptPath, localeFromLanguage, type Locale } from "./locale"

/**
 * UI translations driven by the existing `settings.language` preference.
 * `t` is the typed message tree for the active locale, e.g. `t.auth.login.title`.
 */
export function useI18n() {
  const { settings, setLanguage } = useSettings()
  const pathname = usePathname()
  const locale: Locale = isLocaleExemptPath(pathname) ? "en" : localeFromLanguage(settings.language)

  const setLocale = useCallback(
    (next: Locale) => setLanguage(next === "ar" ? ARABIC_LANGUAGE : ENGLISH_LANGUAGE),
    [setLanguage],
  )

  return useMemo(
    () => ({ locale, dir: dirFor(locale), t: dictionaries[locale], fmt, setLocale }),
    [locale, setLocale],
  )
}
