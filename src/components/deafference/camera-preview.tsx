"use client"

import { Camera } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/use-i18n"

export function CameraPreview() {
  const { t } = useI18n()
  return (
    <Card className="flex min-h-56 items-center justify-center border-dashed">
      <div className="text-center">
        <Camera className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-foreground">{t.app.cameraPreview.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.app.cameraPreview.desc}</p>
      </div>
    </Card>
  )
}
