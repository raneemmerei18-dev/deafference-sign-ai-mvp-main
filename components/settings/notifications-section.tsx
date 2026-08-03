"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/components/deafference/settings-provider"

export function NotificationsSection() {
  const { settings, update } = useSettings()
  const idPrefix = useId()

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-6">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Notifications
        </h2>

        <fieldset className="flex flex-col divide-y divide-border">
          <legend className="text-sm font-medium text-foreground">Email notifications</legend>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-product-label`}
              htmlFor={`${idPrefix}-product`}
              className="text-sm text-foreground"
            >
              Product updates
            </label>
            <Switch
              id={`${idPrefix}-product`}
              labelledBy={`${idPrefix}-product-label`}
              checked={settings.notifyProductUpdatesEmail}
              onChange={(value) => update("notifyProductUpdatesEmail", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-security-label`}
              htmlFor={`${idPrefix}-security`}
              className="text-sm text-foreground"
            >
              Account security alerts
            </label>
            <Switch
              id={`${idPrefix}-security`}
              labelledBy={`${idPrefix}-security-label`}
              checked={settings.notifySecurityAlertsEmail}
              onChange={(value) => update("notifySecurityAlertsEmail", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-usage-label`} htmlFor={`${idPrefix}-usage`} className="text-sm text-foreground">
              Usage reports
            </label>
            <Switch
              id={`${idPrefix}-usage`}
              labelledBy={`${idPrefix}-usage-label`}
              checked={settings.notifyUsageReportsEmail}
              onChange={(value) => update("notifyUsageReportsEmail", value)}
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col divide-y divide-border border-t border-border">
          <legend className="text-sm font-medium text-foreground">In-app alerts</legend>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label id={`${idPrefix}-status-label`} htmlFor={`${idPrefix}-status`} className="text-sm text-foreground">
              Live system status
            </label>
            <Switch
              id={`${idPrefix}-status`}
              labelledBy={`${idPrefix}-status-label`}
              checked={settings.notifySystemStatusInApp}
              onChange={(value) => update("notifySystemStatusInApp", value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <label
              id={`${idPrefix}-announcements-label`}
              htmlFor={`${idPrefix}-announcements`}
              className="text-sm text-foreground"
            >
              Feature announcements
            </label>
            <Switch
              id={`${idPrefix}-announcements`}
              labelledBy={`${idPrefix}-announcements-label`}
              checked={settings.notifyFeatureAnnouncementsInApp}
              onChange={(value) => update("notifyFeatureAnnouncementsInApp", value)}
            />
          </div>
        </fieldset>
      </section>
    </Card>
  )
}
