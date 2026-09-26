"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/components/deafference/settings-provider"
import { LANGUAGES } from "@/components/deafference/language-selector"

const SIGN_LANGUAGE_DIALECTS = [
  { value: "asl", label: "American Sign Language (ASL)" },
  { value: "bsl", label: "British Sign Language (BSL)" },
  { value: "isl", label: "Irish Sign Language (ISL)" },
  { value: "lsf", label: "Langue des signes française (LSF)" },
  { value: "other", label: "Other" },
]

export function LanguageAccessibilitySection() {
  const { settings, update } = useSettings()
  const idPrefix = useId()

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Language &amp; Accessibility
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-language`} className="text-sm font-medium text-foreground">
              Platform interface language
            </label>
            <Select
              id={`${idPrefix}-language`}
              value={settings.language}
              onChange={(event) => update("language", event.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-dialect`} className="text-sm font-medium text-foreground">
              Primary sign language dialect
            </label>
            <Select
              id={`${idPrefix}-dialect`}
              value={settings.signLanguageDialect}
              onChange={(event) => update("signLanguageDialect", event.target.value)}
            >
              {SIGN_LANGUAGE_DIALECTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <fieldset className="flex flex-col divide-y divide-border border-t border-border">
          <legend className="sr-only">Accessibility toggles</legend>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-hc-label`} htmlFor={`${idPrefix}-hc`} className="text-sm font-medium text-foreground">
              High contrast mode
            </label>
            <Switch
              id={`${idPrefix}-hc`}
              labelledBy={`${idPrefix}-hc-label`}
              checked={settings.highContrast}
              onChange={(value) => update("highContrast", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-rm-label`} htmlFor={`${idPrefix}-rm`} className="text-sm font-medium text-foreground">
              Reduce motion
            </label>
            <Switch
              id={`${idPrefix}-rm`}
              labelledBy={`${idPrefix}-rm-label`}
              checked={settings.reduceMotion}
              onChange={(value) => update("reduceMotion", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-cap-label`} htmlFor={`${idPrefix}-cap`} className="text-sm font-medium text-foreground">
              Auto-captioning defaults
            </label>
            <Switch
              id={`${idPrefix}-cap`}
              labelledBy={`${idPrefix}-cap-label`}
              checked={settings.alwaysCaptions}
              onChange={(value) => update("alwaysCaptions", value)}
            />
          </div>
        </fieldset>
      </section>
    </Card>
  )
}
