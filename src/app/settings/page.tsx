import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell/app-shell"
import { Container } from "@/components/shared/container"
import { SettingsView } from "@/components/settings/settings-view"

export const metadata: Metadata = {
  title: "Deafference — Settings",
  description: "Manage appearance, language, privacy, and notification preferences.",
}

export default function SettingsPage() {
  return (
    <AppShell>
      <main className="py-8 sm:py-10 lg:py-12">
        <Container>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage your appearance, language, privacy, and notification preferences.
          </p>

          <div className="mt-8">
            <SettingsView />
          </div>
        </Container>
      </main>
    </AppShell>
  )
}
