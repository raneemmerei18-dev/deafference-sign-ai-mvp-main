"use client"

import { useState } from "react"
import { RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/deafference/settings-provider"

export function SettingsSaveBar() {
  const { save, reset, isDirty } = useSettings()
  const [feedback, setFeedback] = useState<string | null>(null)

  function announce(message: string) {
    setFeedback(message)
    window.setTimeout(() => setFeedback((current) => (current === message ? null : current)), 3000)
  }

  function handleSave() {
    save()
    announce("Settings saved.")
  }

  function handleReset() {
    reset()
    announce("Settings reset to defaults.")
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {feedback ?? (isDirty ? "You have unsaved changes." : "All changes saved.")}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset to Defaults
          </Button>
          <Button type="button" onClick={handleSave} disabled={!isDirty}>
            <Save className="size-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
