import { SettingsProvider } from "@/components/deafference/settings-provider"
import { DeafferenceApp } from "@/components/deafference/deafference-app"
import { AppShell } from "@/components/app-shell/app-shell"

export default function TranslatePage() {
  return (
    <AppShell>
      <SettingsProvider>
        <DeafferenceApp />
      </SettingsProvider>
    </AppShell>
  )
}
