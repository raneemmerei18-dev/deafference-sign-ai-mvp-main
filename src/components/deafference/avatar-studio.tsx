"use client"

import { Translator } from "./translator"
import { QuickPhrases } from "./quick-phrases"
import { TextCard } from "./text-card"
import { useAvatarTranslator } from "./use-avatar-translator"

/** Text/Speech → Sign mode: Judy previews phrases from the demo sign library. */
export function AvatarStudio({ initialText = "" }: { initialText?: string }) {
  const controller = useAvatarTranslator({ initialText, autoTranslate: initialText.trim().length > 0 })

  return (
    <div className="space-y-8">
      <Translator controller={controller} />
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <QuickPhrases
          compact
          activeCategory={controller.category}
          setCategory={controller.setCategory}
          onSelect={controller.selectPhrase}
        />
      </div>
      <TextCard
        open={controller.textCardOpen}
        phrase={controller.displayPhrase || controller.input}
        onClose={() => controller.setTextCardOpen(false)}
      />
    </div>
  )
}
