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
          <SettingsView />
        </Container>
      </main>
    </AppShell>
  )
}
