"use client"

import { useRef, useState } from "react"
import { Container } from "@/components/shared/container"
import { Pipeline } from "./pipeline"
import { AccessibilityPanel } from "./accessibility-panel"
import { SettingsDebugPanel } from "./settings-debug-panel"
import { ApplicationHeader } from "./application-header"
import { CameraView, type CameraViewHandle } from "./camera-view"
import { StatusCard } from "./status-card"
import { TranslationPanel } from "./translation-panel"
import { TTSControls } from "./tts-controls"
import { ControlPanel } from "./control-panel"
import { RecentTranslations } from "./recent-translations"
import { TipsCard } from "./tips-card"

// Top-level switch for the "Demo Pipeline Active" disclosure badge shown
// next to the pipeline's Hand Detection / AI Recognition steps. Flip to
// `false` once /translate is wired to the real recognition model.
const isMockMode = true

export function DeafferenceApp() {
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [translationText, setTranslationText] = useState("")
  const cameraRef = useRef<CameraViewHandle>(null)

  return (
    <div id="top" className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_32%)]">
      <ApplicationHeader
        onOpenAccessibility={() => setAccessibilityOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr] lg:items-start">
            <section className="space-y-6">
              <CameraView ref={cameraRef} />
            </section>

            <section className="space-y-5">
              <StatusCard />
              <Pipeline currentStep={0} isMockMode={isMockMode} />
              <TranslationPanel text={translationText} />
              <TTSControls translationText={translationText} onTranslationTextChange={setTranslationText} />
              <ControlPanel
                onStartCamera={() => cameraRef.current?.restart()}
                onClearTranslation={() => setTranslationText("")}
              />
              <RecentTranslations />
              <TipsCard />
            </section>
          </div>
        </Container>
      </main>

      <AccessibilityPanel open={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
      <SettingsDebugPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}