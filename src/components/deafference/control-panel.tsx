"use client"

import { motion } from "framer-motion"
import { Camera, RotateCcw, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/use-i18n"

export interface ControlPanelProps {
  onStartCamera?: () => void
  onClearTranslation?: () => void
  /** True while the camera is streaming — the primary button then restarts it. */
  cameraActive?: boolean
}

export function ControlPanel({ onStartCamera, onClearTranslation, cameraActive = false }: ControlPanelProps) {
  const { t } = useI18n()
  const copy = t.app.controls

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <Card className="p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">{copy.eyebrow}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Button className="h-12 rounded-full" onClick={onStartCamera}>
            {cameraActive ? (
              <RotateCcw className="size-4" aria-hidden="true" />
            ) : (
              <Camera className="size-4" aria-hidden="true" />
            )}
            {cameraActive ? copy.restartCamera : copy.startCamera}
          </Button>
          <Button variant="outline" className="h-auto min-h-12 flex-col gap-0 rounded-full py-1.5" disabled>
            <span className="inline-flex items-center gap-1.5">
              <Upload className="size-4" aria-hidden="true" />
              {copy.uploadVideo}
            </span>
            <span className="text-[11px] font-normal">{copy.comingSoon}</span>
          </Button>
          <Button variant="outline" className="h-12 rounded-full" onClick={onClearTranslation}>
            <Trash2 className="size-4" aria-hidden="true" />
            {copy.clear}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
