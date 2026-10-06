"use client"

import { Settings2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/shared/container"
import { useI18n } from "@/i18n/use-i18n"
import { Logo } from "./logo"

export function ApplicationHeader({
  onOpenAccessibility,
  onOpenSettings,
}: {
  onOpenAccessibility: () => void
  onOpenSettings: () => void
}) {
  const { t } = useI18n()
  const copy = t.app.header

  return (
    <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-3 py-3 sm:min-h-20 sm:gap-4 sm:py-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Logo className="hidden sm:inline-flex" />
          <div className="min-w-0 text-start">
            <p className="hidden truncate text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase sm:block">
              {copy.eyebrow}
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:mt-1 sm:text-xl">
              {copy.title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="size-10" aria-label={copy.openSettings} onClick={onOpenSettings}>
            <Settings2 className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={copy.openAccessibility}
            onClick={onOpenAccessibility}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </header>
  )
}
