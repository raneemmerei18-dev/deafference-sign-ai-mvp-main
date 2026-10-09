"use client"

import { useEffect, useId } from "react"
import { Captions, Contrast, MousePointerClick, RotateCcw, Type, Volume2, Waves, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { LanguageSelector } from "./language-selector"
import { useSettings, type TextSize } from "./settings-provider"

function Row({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p id={id} className="text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch labelledBy={id} checked={checked} onChange={onChange} />
    </div>
  )
}

const TEXT_SIZES: TextSize[] = ["normal", "large", "xlarge"]

export function AccessibilityPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update, reset, save, isDirty } = useSettings()
  const { t } = useI18n()
  const copy = t.app.accessibility
  const titleId = useId()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Changes made here are applied live and persisted right away (the panel has
  // no Save button), so they survive a reload.
  useEffect(() => {
    if (open && isDirty) save()
  }, [open, isDirty, save])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="accessibility"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        className={cn(
          "fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col bg-card transition-transform duration-300 ease-out",
          open ? "translate-x-0 shadow-2xl" : "translate-x-full rtl:-translate-x-full shadow-none",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="text-start">
            <h2 id={titleId} className="text-lg font-semibold">
              {copy.title}
            </h2>
            <p className="text-xs text-muted-foreground">{copy.subtitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-10" aria-label={copy.close} onClick={onClose}>
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {/* Text size */}
          <div className="py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
                <Type className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{copy.textSize}</p>
                <p className="text-xs text-muted-foreground">{copy.textSizeDesc}</p>
              </div>
            </div>
            <div role="radiogroup" aria-label={copy.textSize} className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
              {TEXT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={settings.textSize === size}
                  onClick={() => update("textSize", size)}
                  className={cn(
                    "min-h-10 rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    settings.textSize === size
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {copy.sizes[size]}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            <Row
              icon={<Contrast className="size-4" />}
              title={copy.highContrast}
              desc={copy.highContrastDesc}
              checked={settings.highContrast}
              onChange={(v) => update("highContrast", v)}
            />
            <Row
              icon={<Waves className="size-4" />}
              title={copy.reduceMotion}
              desc={copy.reduceMotionDesc}
              checked={settings.reduceMotion}
              onChange={(v) => update("reduceMotion", v)}
            />
            <Row
              icon={<Captions className="size-4" />}
              title={copy.captions}
              desc={copy.captionsDesc}
              checked={settings.alwaysCaptions}
              onChange={(v) => update("alwaysCaptions", v)}
            />
            <Row
              icon={<Type className="size-4" />}
              title={copy.textOnly}
              desc={copy.textOnlyDesc}
              checked={settings.textOnly}
              onChange={(v) => update("textOnly", v)}
            />
            <Row
              icon={<MousePointerClick className="size-4" />}
              title={copy.largeButtons}
              desc={copy.largeButtonsDesc}
              checked={settings.largeButtons}
              onChange={(v) => update("largeButtons", v)}
            />
            <Row
              icon={<Volume2 className="size-4" />}
              title={copy.sound}
              desc={copy.soundDesc}
              checked={settings.sound}
              onChange={(v) => update("sound", v)}
            />
          </div>

          {/* Language */}
          <div className="py-4">
            <label htmlFor="panel-language" className="mb-2 block text-sm font-semibold text-foreground">
              {copy.language}
            </label>
            <LanguageSelector id="panel-language" />
          </div>
        </div>

        <div className="border-t border-border px-5 py-4">
          <Button variant="outline" onClick={reset} className="h-10 w-full">
            <RotateCcw className="size-4" aria-hidden="true" />
            {copy.reset}
          </Button>
        </div>
      </aside>
    </>
  )
}
