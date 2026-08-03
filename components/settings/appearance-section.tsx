"use client"

import { useId } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSettings, type Density, type Theme } from "@/components/deafference/settings-provider"

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System Default", icon: Monitor },
]

const DENSITY_OPTIONS: Array<{ value: Density; label: string; description: string }> = [
  { value: "comfortable", label: "Comfortable", description: "More breathing room between elements" },
  { value: "compact", label: "Compact", description: "Tighter spacing, more content per screen" },
]

function handleRovingKeyDown<T extends string>(
  event: React.KeyboardEvent<HTMLButtonElement>,
  values: T[],
  current: T,
  activate: (value: T) => void,
) {
  const index = values.indexOf(current)
  let nextIndex: number | null = null

  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % values.length
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + values.length) % values.length
  else if (event.key === "Home") nextIndex = 0
  else if (event.key === "End") nextIndex = values.length - 1

  if (nextIndex === null) return
  event.preventDefault()
  activate(values[nextIndex])
}

export function AppearanceSection() {
  const { settings, update } = useSettings()
  const idPrefix = useId()

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-6">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Appearance
        </h2>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">Theme</legend>
          <div role="radiogroup" aria-label="Theme" className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon
              const selected = settings.theme === option.value
              const values = THEME_OPTIONS.map((o) => o.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => update("theme", option.value)}
                  onKeyDown={(event) => handleRovingKeyDown(event, values, settings.theme, (v) => update("theme", v))}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">Display density</legend>
          <div role="radiogroup" aria-label="Display density" className="mt-2 grid grid-cols-2 gap-2">
            {DENSITY_OPTIONS.map((option) => {
              const selected = settings.density === option.value
              const values = DENSITY_OPTIONS.map((o) => o.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => update("density", option.value)}
                  onKeyDown={(event) =>
                    handleRovingKeyDown(event, values, settings.density, (v) => update("density", v))
                  }
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "border-primary bg-primary/10" : "border-border hover:bg-muted",
                  )}
                >
                  <span className={cn("text-sm font-medium", selected ? "text-primary" : "text-foreground")}>
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      </section>
    </Card>
  )
}
