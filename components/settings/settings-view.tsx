"use client"

import { Tabs } from "@/components/ui/tabs"
import { AppearanceSection } from "./appearance-section"
import { LanguageAccessibilitySection } from "./language-accessibility-section"
import { NotificationsSection } from "./notifications-section"
import { PrivacySecuritySection } from "./privacy-security-section"
import { SettingsSaveBar } from "./save-bar"

export function SettingsView() {
  const tabs = [
    { value: "appearance", label: "Appearance", content: <AppearanceSection /> },
    {
      value: "language-accessibility",
      label: "Language & Accessibility",
      content: <LanguageAccessibilitySection />,
    },
    { value: "privacy-security", label: "Privacy & Security", content: <PrivacySecuritySection /> },
    { value: "notifications", label: "Notifications", content: <NotificationsSection /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} defaultValue="appearance" label="Settings sections" />
      <SettingsSaveBar />
    </div>
  )
}
