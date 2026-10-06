"use client"

import { Tabs } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { CameraSettingsCard } from "@/components/deafference/camera-settings"
import { useI18n } from "@/i18n/use-i18n"
import { AccountRoleSection } from "./account-role-section"
import { AppearanceSection } from "./appearance-section"
import { LanguageAccessibilitySection } from "./language-accessibility-section"
import { NotificationsSection } from "./notifications-section"
import { PrivacySecuritySection } from "./privacy-security-section"
import { SettingsSaveBar } from "./save-bar"

export function SettingsView() {
  const { user } = useAuth()
  const { t } = useI18n()
  const m = t.settings

  const tabs = [
    { value: "account", label: m.tabs.account, content: <AccountRoleSection /> },
    { value: "appearance", label: m.tabs.appearance, content: <AppearanceSection /> },
    {
      value: "language-accessibility",
      label: m.tabs.languageAccessibility,
      content: <LanguageAccessibilitySection />,
    },
    { value: "camera", label: m.tabs.camera, content: <CameraSettingsCard /> },
    { value: "privacy-security", label: m.tabs.privacySecurity, content: <PrivacySecuritySection /> },
    { value: "notifications", label: m.tabs.notifications, content: <NotificationsSection /> },
  ]

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{m.page.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{m.page.subtitle}</p>

      <div className="mt-8 flex flex-col gap-6">
        <Tabs tabs={tabs} defaultValue={user ? "appearance" : "account"} label={m.tabs.label} />
        <SettingsSaveBar />
      </div>
    </>
  )
}
