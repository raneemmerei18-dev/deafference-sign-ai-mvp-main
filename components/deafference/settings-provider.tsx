"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { DEFAULT_SETTINGS, SETTINGS_COOKIE_NAME, type Settings } from "@/lib/settings"

export type { TextSize, Theme, Density, Settings } from "@/lib/settings"
export { DEFAULT_SETTINGS, SETTINGS_COOKIE_NAME, parseSettingsCookie } from "@/lib/settings"

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function writeSettingsCookie(settings: Settings) {
  document.cookie = `${SETTINGS_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(settings))}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
}

type SettingsContextValue = {
  settings: Settings
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  toggleTheme: () => void
  /** Persists the current (possibly unsaved) settings so they survive a reload. */
  save: () => void
  /** Resets to defaults in-memory *and* persists that reset. */
  reset: () => void
  /** True when there are changes since the last `save()`/`reset()`. */
  isDirty: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: Settings
  children: ReactNode
}) {
  const seed = initialSettings ?? DEFAULT_SETTINGS
  const [settings, setSettings] = useState<Settings>(seed)
  const [savedSettings, setSavedSettings] = useState<Settings>(seed)
  // The public landing page (/) isn't part of the authenticated app experience
  // these accessibility flags are meant for — it runs its own decorative
  // motion/theme system, so an account's saved "Reduce Motion" preference
  // shouldn't silently kill the marketing site's animations.
  const isLandingPage = usePathname() === "/"

  const update = useCallback<SettingsContextValue["update"]>((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }))
  }, [])

  const save = useCallback(() => {
    setSavedSettings(settings)
    writeSettingsCookie(settings)
  }, [settings])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setSavedSettings(DEFAULT_SETTINGS)
    writeSettingsCookie(DEFAULT_SETTINGS)
  }, [])

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
  )

  // Theme is applied live (not gated behind Save) so users can preview it —
  // "system" additionally tracks the OS preference while selected.
  useEffect(() => {
    const root = document.documentElement

    function applyTheme() {
      const resolvedDark =
        settings.theme === "dark" ||
        (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      root.classList.toggle("dark", resolvedDark)
      root.classList.toggle("light", !resolvedDark)
    }

    applyTheme()

    if (settings.theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", applyTheme)
    return () => media.removeEventListener("change", applyTheme)
  }, [settings.theme])

  // Same live-preview treatment for the other document-level accessibility flags.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("hc", settings.highContrast)
    root.classList.toggle("reduce-motion", settings.reduceMotion && !isLandingPage)
    root.dataset.textSize = settings.textSize
    root.dataset.density = settings.density
  }, [settings.highContrast, settings.reduceMotion, settings.textSize, settings.density, isLandingPage])

  const value = useMemo(
    () => ({ settings, update, toggleTheme, save, reset, isDirty }),
    [settings, update, toggleTheme, save, reset, isDirty],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider")
  return ctx
}
