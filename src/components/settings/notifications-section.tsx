"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useSettings, type Settings } from "@/components/deafference/settings-provider"
import { useI18n } from "@/i18n/use-i18n"

type BooleanSettingKey = {
  [K in keyof Settings]: Settings[K] extends boolean ? K : never
}[keyof Settings]

export function NotificationsSection() {
  const { settings, update } = useSettings()
  const { t } = useI18n()
  const m = t.settings.notifications
  const idPrefix = useId()

  const groups: Array<{ legend: string; className: string; items: Array<{ key: BooleanSettingKey; id: string; label: string }> }> = [
    {
      legend: m.email,
      className: "flex flex-col divide-y divide-border",
      items: [
        { key: "notifyProductUpdatesEmail", id: "product", label: m.productUpdates },
        { key: "notifySecurityAlertsEmail", id: "security", label: m.securityAlerts },
        { key: "notifyUsageReportsEmail", id: "usage", label: m.usageReports },
      ],
    },
    {
      legend: m.inApp,
      className: "flex flex-col divide-y divide-border border-t border-border",
      items: [
        { key: "notifySystemStatusInApp", id: "status", label: m.systemStatus },
        { key: "notifyFeatureAnnouncementsInApp", id: "announcements", label: m.announcements },
      ],
    },
  ]

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-6">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        {groups.map((group) => (
          <fieldset key={group.legend} className={group.className}>
            <legend className="text-sm font-medium text-foreground">{group.legend}</legend>

            {group.items.map((item) => (
              <div key={item.key} className="flex min-h-11 items-center justify-between gap-4 py-3.5">
                <label
                  id={`${idPrefix}-${item.id}-label`}
                  htmlFor={`${idPrefix}-${item.id}`}
                  className="text-sm text-foreground"
                >
                  {item.label}
                </label>
                <Switch
                  id={`${idPrefix}-${item.id}`}
                  labelledBy={`${idPrefix}-${item.id}-label`}
                  checked={settings[item.key]}
                  onChange={(value) => update(item.key, value)}
                />
              </div>
            ))}
          </fieldset>
        ))}
      </section>
    </Card>
  )
}
