import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell/app-shell"
import { Container } from "@/components/shared/container"
import { TranslationHistory } from "@/components/deafference/translation-history"

export const metadata: Metadata = {
  title: "Deafference — History",
  description: "Your recent translations, stored only on this device.",
}

export default function HistoryPage() {
  return (
    <AppShell>
      <main className="py-8 sm:py-10 lg:py-12">
        <Container>
          <TranslationHistory />
        </Container>
      </main>
    </AppShell>
  )
}
