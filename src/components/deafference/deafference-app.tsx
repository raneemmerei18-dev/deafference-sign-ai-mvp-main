"use client"

import { useRef, useState } from "react"
import { Container } from "@/components/shared/container"
import { useI18n } from "@/i18n/use-i18n"
import { Pipeline } from "./pipeline"
import { AccessibilityPanel } from "./accessibility-panel"
import { SettingsDebugPanel } from "./settings-debug-panel"
import { ApplicationHeader } from "./application-header"
import { CameraView, type CameraStatus, type CameraViewHandle } from "./camera-view"
import { StatusCard, type RecognitionStatus } from "./status-card"
import { TranslationPanel } from "./translation-panel"
import { TTSControls } from "./tts-controls"
import { ControlPanel } from "./control-panel"
import { RecentTranslations } from "./recent-translations"
import { TipsCard } from "./tips-card"

// Top-level switch for the "Demo pipeline" disclosure badge and the honest
// "recognition not connected" copy. Flip to `false` only once /translate is
// wired to a real hand-tracking + recognition model that feeds `transcript`,
// `confidence` and `landmarks` below.
const isMockMode = true

/** Maps the real camera lifecycle onto the status card. Recognizer-driven states need a model. */
function statusFromCamera(camera: CameraStatus): RecognitionStatus {
  if (camera === "loading") return "camera-loading"
  if (camera === "streaming") return "ready"
  return "error"
}

export function DeafferenceApp() {
  const { t } = useI18n()
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [translationText, setTranslationText] = useState("")
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("loading")
  const [statusPreview, setStatusPreview] = useState<RecognitionStatus | null>(null)
  const cameraRef = useRef<CameraViewHandle>(null)

  // No recognizer exists yet: transcript/confidence/landmarks stay empty rather than faked.
  const recognitionConnected = !isMockMode
  const transcript = ""
  const confidence: number | null = null

  const cameraStates = t.app.camera.states
  const cameraErrorTitle: Partial<Record<CameraStatus, string>> = {
    denied: cameraStates.denied.title,
    unsupported: cameraStates.unsupported.title,
    error: cameraStates.error.title,
    "no-devices": cameraStates.noDevices.title,
    simulation: cameraStates.simulation.title,
  }
  const liveStatus = statusFromCamera(cameraStatus)
  const status = statusPreview ?? liveStatus
  const statusDescription = !statusPreview && liveStatus === "error" ? cameraErrorTitle[cameraStatus] : undefined

  return (
    <div id="top" className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_32%)]">
      <ApplicationHeader
        onOpenAccessibility={() => setAccessibilityOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="py-6 sm:py-10 lg:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr] lg:items-start">
            <section className="space-y-6">
              <CameraView ref={cameraRef} onStateChange={setCameraStatus} />
            </section>

            <section className="space-y-5">
              <StatusCard status={status} recognitionConnected={recognitionConnected} description={statusDescription} />
              <TranslationPanel
                transcript={transcript}
                confidence={confidence}
                recognitionConnected={recognitionConnected}
              />
              <TTSControls translationText={translationText} onTranslationTextChange={setTranslationText} />
              <ControlPanel
                cameraActive={cameraStatus === "streaming"}
                onStartCamera={() => cameraRef.current?.restart()}
                onClearTranslation={() => setTranslationText("")}
              />
              <Pipeline currentStep={0} isMockMode={isMockMode} />
              <RecentTranslations />
              <TipsCard />
            </section>
          </div>
        </Container>
      </main>

      <AccessibilityPanel open={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
      <SettingsDebugPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        statusPreview={statusPreview}
        onStatusPreviewChange={setStatusPreview}
      />
    </div>
  )
}
