"use client"

import { Globe } from "lucide-react"
import { useSettings } from "./settings-provider"
import { useI18n } from "@/i18n/use-i18n"

export const LANGUAGES = [
  "English",
  "Español",
  "Français",
  "Deutsch",
  "العربية",
  "中文",
]

export function LanguageSelector({ id }: { id?: string }) {
  const { settings, setLanguage } = useSettings()
  const { t } = useI18n()

  return (
    <div className="relative inline-flex items-center">
      <Globe className="pointer-events-none absolute start-2.5 size-4 text-muted-foreground" aria-hidden="true" />
      <select
        id={id}
        aria-label={t.common.language.label}
        value={settings.language}
        // Applies and persists the interface language immediately.
        onChange={(e) => setLanguage(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-background py-0 ps-8 pe-7 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute end-2.5 size-3.5 text-muted-foreground"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
