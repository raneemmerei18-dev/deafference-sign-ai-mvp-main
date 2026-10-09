import { Suspense } from "react"
import { AppShell } from "@/components/app-shell/app-shell"
import { Loading } from "@/components/shared/loading"
import { TranslateWorkspace } from "@/components/deafference/translate-workspace"

export default function TranslatePage() {
  return (
    <AppShell>
      {/* useSearchParams (mode sync) needs a Suspense boundary for static rendering. */}
      <Suspense fallback={<div className="p-6"><Loading /></div>}>
        <TranslateWorkspace />
      </Suspense>
    </AppShell>
  )
}
