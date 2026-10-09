"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/components/deafference/settings-provider"
import { LANGUAGES } from "@/components/deafference/language-selector"
import { useI18n } from "@/i18n/use-i18n"

const SIGN_LANGUAGE_DIALECTS = ["asl", "bsl", "isl", "lsf", "other"] as const

export function LanguageAccessibilitySection() {
  const { settings, update, setLanguage } = useSettings()
  const { t } = useI18n()
  const m = t.settings.language
  const idPrefix = useId()

  const toggles = [
    { key: "highContrast", id: "hc", label: m.highContrast },
    { key: "reduceMotion", id: "rm", label: m.reduceMotion },
    { key: "alwaysCaptions", id: "cap", label: m.captions },
  ] as const

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-language`} className="text-sm font-medium text-foreground">
              {m.interface}
            </label>
            {/* Interface language applies + persists immediately (not gated behind the save bar). */}
            <Select
              id={`${idPrefix}-language`}
              value={settings.language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-describedby={`${idPrefix}-language-hint`}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
            <p id={`${idPrefix}-language-hint`} className="text-xs text-muted-foreground">
              {m.interfaceHint}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-dialect`} className="text-sm font-medium text-foreground">
              {m.dialect}
            </label>
            <Select
              id={`${idPrefix}-dialect`}
              value={settings.signLanguageDialect}
              onChange={(event) => update("signLanguageDialect", event.target.value)}
            >
              {SIGN_LANGUAGE_DIALECTS.map((value) => (
                <option key={value} value={value}>
                  {t.profile.signLanguages[value]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <fieldset className="flex flex-col divide-y divide-border border-t border-border">
          <legend className="sr-only">{m.togglesLegend}</legend>

          {toggles.map((toggle) => (
            <div key={toggle.key} className="flex min-h-11 items-center justify-between gap-4 py-3.5">
              <label
                id={`${idPrefix}-${toggle.id}-label`}
                htmlFor={`${idPrefix}-${toggle.id}`}
                className="text-sm font-medium text-foreground"
              >
                {toggle.label}
              </label>
              <Switch
                id={`${idPrefix}-${toggle.id}`}
                labelledBy={`${idPrefix}-${toggle.id}-label`}
                checked={settings[toggle.key]}
                onChange={(value) => update(toggle.key, value)}
              />
            </div>
          ))}
        </fieldset>
      </section>
    </Card>
  )
}
