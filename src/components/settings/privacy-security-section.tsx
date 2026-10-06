"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { SETTINGS_COOKIE_NAME, useSettings } from "@/components/deafference/settings-provider"
import { clearTranslationHistory } from "@/components/deafference/history-store"
import { useI18n } from "@/i18n/use-i18n"

type PendingAction = "clear-history" | "clear-local-data" | null
type StatusKey = "exportStarted" | "historyCleared" | "localCleared"

export function PrivacySecuritySection() {
  const { settings, update, reset } = useSettings()
  const { t } = useI18n()
  const m = t.settings.privacy
  const idPrefix = useId()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  // Store a key so the message stays in the active language.
  const [statusKey, setStatusKey] = useState<StatusKey | null>(null)

  function announce(key: StatusKey) {
    setStatusKey(key)
    window.setTimeout(() => setStatusKey((current) => (current === key ? null : current)), 4000)
  }

  function handleExportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "deafference-account-data.json"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    announce("exportStarted")
  }

  function handleConfirmPendingAction() {
    if (pendingAction === "clear-history") {
      clearTranslationHistory()
      announce("historyCleared")
    } else if (pendingAction === "clear-local-data") {
      window.localStorage.clear()
      clearTranslationHistory()
      document.cookie = `${SETTINGS_COOKIE_NAME}=; path=/; max-age=0`
      reset()
      announce("localCleared")
    }
    setPendingAction(null)
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        <fieldset className="flex flex-col divide-y divide-border">
          <legend className="text-sm font-medium text-foreground">{m.sharing}</legend>

          <div className="flex min-h-11 items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-analytics-label`}
              htmlFor={`${idPrefix}-analytics`}
              className="text-sm text-foreground"
            >
              {m.analytics}
            </label>
            <Switch
              id={`${idPrefix}-analytics`}
              labelledBy={`${idPrefix}-analytics-label`}
              checked={settings.shareUsageAnalytics}
              onChange={(value) => update("shareUsageAnalytics", value)}
            />
          </div>

          <div className="flex min-h-11 items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-model-label`} htmlFor={`${idPrefix}-model`} className="text-sm text-foreground">
              {m.modelData}
            </label>
            <Switch
              id={`${idPrefix}-model`}
              labelledBy={`${idPrefix}-model-label`}
              checked={settings.shareModelImprovementData}
              onChange={(value) => update("shareModelImprovementData", value)}
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 border-t border-border pt-4">
          <legend className="text-sm font-medium text-foreground">{m.history}</legend>

          <div className="flex min-h-11 items-center justify-between gap-4">
            <label
              id={`${idPrefix}-history-label`}
              htmlFor={`${idPrefix}-history`}
              className="text-sm text-foreground"
            >
              {m.storeHistory}
            </label>
            <Switch
              id={`${idPrefix}-history`}
              labelledBy={`${idPrefix}-history-label`}
              checked={settings.sessionHistoryEnabled}
              onChange={(value) => update("sessionHistoryEnabled", value)}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-10 w-fit px-4"
            onClick={() => setPendingAction("clear-history")}
          >
            {m.clearHistory}
          </Button>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">{m.exportDeletion}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-10 px-4" onClick={handleExportData}>
              {m.export}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 px-4"
              onClick={() => setPendingAction("clear-local-data")}
            >
              {m.clearLocal}
            </Button>
          </div>
        </div>

        <p role="status" aria-live="polite" className="text-sm text-muted-foreground empty:hidden">
          {statusKey ? m[statusKey] : null}
        </p>
      </section>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={pendingAction === "clear-history" ? m.clearHistoryTitle : m.clearLocalTitle}
        description={pendingAction === "clear-history" ? m.clearHistoryBody : m.clearLocalBody}
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="h-11 px-4" onClick={() => setPendingAction(null)}>
            {t.common.actions.cancel}
          </Button>
          <Button type="button" variant="destructive" className="h-11 px-4" onClick={handleConfirmPendingAction}>
            {m.confirm}
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}
