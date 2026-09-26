"use client"

import { motion } from "framer-motion"
import { Camera, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface ControlPanelProps {
  onStartCamera?: () => void
  onClearTranslation?: () => void
}

export function ControlPanel({ onStartCamera, onClearTranslation }: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <Card className="p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          Controls
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Button
            className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
            onClick={onStartCamera}
          >
            <Camera className="size-4" />
            Start Camera
          </Button>
          <Button variant="outline" className="h-12 rounded-full" disabled title="Video upload isn't available yet — coming soon.">
            <Upload className="size-4" />
            Upload Video
          </Button>
          <Button variant="outline" className="h-12 rounded-full" onClick={onClearTranslation}>
            <Trash2 className="size-4" />
            Clear Translation
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
