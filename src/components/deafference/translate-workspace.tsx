"use client"

import { useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AudioLines, Hand, MessageSquareText } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { DeafferenceApp } from "./deafference-app"
import { AvatarStudio } from "./avatar-studio"
import { SpeechStudio } from "./speech-studio"

export type TranslateMode = "sign" | "avatar" | "speech"

const MODES: { id: TranslateMode; icon: typeof Hand }[] = [
  { id: "sign", icon: Hand },
  { id: "avatar", icon: MessageSquareText },
  { id: "speech", icon: AudioLines },
]

export function parseTranslateMode(value: string | null): TranslateMode {
  return value === "avatar" || value === "speech" ? value : "sign"
}

/** /translate: one route, three modes, synced to `?mode=sign|avatar|speech`. */
export function TranslateWorkspace() {
  const { t, dir } = useI18n()
  const s = t.studio.modes
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = parseTranslateMode(searchParams.get("mode"))
  const initialText = mode === "avatar" ? searchParams.get("text") ?? "" : ""
  const tabRefs = useRef<Record<TranslateMode, HTMLButtonElement | null>>({ sign: null, avatar: null, speech: null })

  function select(next: TranslateMode) {
    if (next === mode) return
    // Drop ?text= when switching: it only prefills the avatar studio once.
    router.replace(`${pathname}?mode=${next}`, { scroll: false })
  }

  // Manual activation: arrows move focus, Enter/Space selects — so passing over
  // "Sign" doesn't start the camera.
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight"
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft"
    let next: number
    if (event.key === forward) next = index + 1
    else if (event.key === back) next = index - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = MODES.length - 1
    else return
    event.preventDefault()
    tabRefs.current[MODES[(next + MODES.length) % MODES.length].id]?.focus()
  }

  const label = { sign: s.sign, avatar: s.avatar, speech: s.speech }
  const hint = { sign: s.signHint, avatar: s.avatarHint, speech: s.speechHint }

  return (
    <div>
      <div className="border-b border-border/70 bg-background/80 pt-5 pb-4">
        <Container>
          <div
            role="tablist"
            aria-label={s.label}
            className="grid grid-cols-1 gap-1 rounded-2xl border border-border bg-muted p-1 sm:inline-grid sm:grid-cols-3"
          >
            {MODES.map(({ id, icon: Icon }, index) => {
              const selected = id === mode
              return (
                <button
                  key={id}
                  ref={(node) => {
                    tabRefs.current[id] = node
                  }}
                  type="button"
                  role="tab"
                  id={`translate-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="translate-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={cn(
                    "flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    selected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label[id]}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{hint[mode]}</p>
        </Container>
      </div>

      <div id="translate-panel" role="tabpanel" aria-labelledby={`translate-tab-${mode}`}>
        {mode === "sign" ? (
          <DeafferenceApp />
        ) : (
          <main className="py-8 sm:py-10">
            <Container>{mode === "avatar" ? <AvatarStudio key={initialText} initialText={initialText} /> : <SpeechStudio />}</Container>
          </main>
        )}
      </div>
    </div>
  )
}
