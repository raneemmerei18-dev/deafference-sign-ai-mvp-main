"use client"

import { useI18n } from "@/i18n/use-i18n"
import { InputPanel } from "./input-panel"
import { OutputPanel } from "./output-panel"
import { AvatarPreview } from "./avatar-preview"
import type { AvatarTranslator } from "./use-avatar-translator"

/** Three-panel Text/Speech → Sign layout: input, avatar preview, result. */
export function Translator({ controller: c }: { controller: AvatarTranslator }) {
  const { t } = useI18n()
  const errorTitle =
    c.error?.kind === "no-match"
      ? t.studio.result.noMatchTitle
      : c.error?.kind === "speech"
        ? t.studio.input.errors[c.error.code]
        : undefined
  const errorBody = c.error?.kind === "no-match" ? t.studio.result.noMatchBody : undefined

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.25fr_1fr]">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <InputPanel
          mode={c.inputMode}
          setMode={c.setInputMode}
          input={c.input}
          setInput={c.setInput}
          status={c.status}
          speech={c.recognition}
          onTranslate={c.translate}
          onClear={c.clear}
          onShowTextCard={() => c.setTextCardOpen(true)}
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <AvatarPreview
          status={c.status}
          paused={c.paused}
          phrase={c.displayPhrase}
          units={c.units}
          unitIndex={c.unitIndex}
          progress={c.progress}
          speed={c.speed}
          errorTitle={errorTitle}
          errorBody={errorBody}
          canReplay={c.result !== null && c.status !== "understanding" && c.status !== "preparing"}
          onPlay={c.play}
          onPause={c.pause}
          onReplay={c.replay}
          onSpeedChange={c.setSpeed}
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <OutputPanel result={c.result} status={c.status} noMatch={c.error?.kind === "no-match"} />
      </div>
    </div>
  )
}
