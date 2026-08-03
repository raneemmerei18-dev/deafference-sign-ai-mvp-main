"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { SETTINGS_COOKIE_NAME, useSettings } from "@/components/deafference/settings-provider"

type PendingAction = "clear-history" | "clear-local-data" | null

export function PrivacySecuritySection() {
  const { settings, update, reset } = useSettings()
  const idPrefix = useId()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  function announce(message: string) {
    setStatusMessage(message)
    window.setTimeout(() => setStatusMessage((current) => (current === message ? null : current)), 4000)
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
    announce("Your data export has started downloading.")
  }

  function handleConfirmPendingAction() {
    if (pendingAction === "clear-history") {
      window.localStorage.removeItem("deafference.translation-history")
      announce("Saved translation logs have been cleared.")
    } else if (pendingAction === "clear-local-data") {
      window.localStorage.clear()
      document.cookie = `${SETTINGS_COOKIE_NAME}=; path=/; max-age=0`
      reset()
      announce("Local data cleared and settings reset to defaults.")
    }
    setPendingAction(null)
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Privacy &amp; Security
        </h2>

        <fieldset className="flex flex-col divide-y divide-border">
          <legend className="text-sm font-medium text-foreground">Data sharing preferences</legend>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-analytics-label`}
              htmlFor={`${idPrefix}-analytics`}
              className="text-sm text-foreground"
            >
              Usage analytics sharing
            </label>
            <Switch
              id={`${idPrefix}-analytics`}
              labelledBy={`${idPrefix}-analytics-label`}
              checked={settings.shareUsageAnalytics}
              onChange={(value) => update("shareUsageAnalytics", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-model-label`}
              htmlFor={`${idPrefix}-model`}
              className="text-sm text-foreground"
            >
              Model improvement data feedback
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
          <legend className="text-sm font-medium text-foreground">Search &amp; history visibility</legend>

          <div className="flex items-center justify-between gap-4">
            <label
              id={`${idPrefix}-history-label`}
              htmlFor={`${idPrefix}-history`}
              className="text-sm text-foreground"
            >
              Store session &amp; translation history
            </label>
            <Switch
              id={`${idPrefix}-history`}
              labelledBy={`${idPrefix}-history-label`}
              checked={settings.sessionHistoryEnabled}
              onChange={(value) => update("sessionHistoryEnabled", value)}
            />
          </div>

          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setPendingAction("clear-history")}>
            Clear saved translation logs
          </Button>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">Data export &amp; deletion</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleExportData}>
              Export My Data (JSON)
            </Button>
            <Button type="button" variant="destructive" onClick={() => setPendingAction("clear-local-data")}>
              Clear Local Data
            </Button>
          </div>
        </div>

        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {statusMessage}
        </p>
      </section>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={pendingAction === "clear-history" ? "Clear saved translation logs?" : "Clear all local data?"}
        description={
          pendingAction === "clear-history"
            ? "This removes your stored translation history from this device. This cannot be undone."
            : "This clears locally stored data on this device and resets all settings to their defaults. This cannot be undone."
        }
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setPendingAction(null)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirmPendingAction}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}
