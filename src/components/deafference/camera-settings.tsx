"use client"

import { useEffect, useId, useState, useSyncExternalStore } from "react"
import { Camera, FlipHorizontal2, Info, ScanEye, SquareDashed, Volume2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/speech"
import { useCameraPreferences, type CameraPreferences } from "./camera-preferences"

type DeviceState =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "ready"; devices: { deviceId: string; label: string }[] }

function useVideoInputs(): DeviceState {
  const [state, setState] = useState<DeviceState>({ kind: "loading" })

  useEffect(() => {
    const media = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined
    if (!media?.enumerateDevices) {
      setState({ kind: "unavailable" })
      return
    }
    let cancelled = false
    async function load() {
      try {
        const all = await media!.enumerateDevices()
        if (cancelled) return
        setState({
          kind: "ready",
          devices: all
            .filter((d) => d.kind === "videoinput")
            .map((d) => ({ deviceId: d.deviceId, label: d.label })),
        })
      } catch {
        if (!cancelled) setState({ kind: "unavailable" })
      }
    }
    void load()
    media.addEventListener?.("devicechange", load)
    return () => {
      cancelled = true
      media.removeEventListener?.("devicechange", load)
    }
  }, [])

  return state
}

function ToggleRow({
  icon,
  title,
  description,
  note,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  description: string
  note?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p id={`${id}-label`} className="text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
          {note ? (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>{note}</span>
            </p>
          ) : null}
        </div>
      </div>
      <div className={cn("flex min-h-10 items-center", disabled && "pointer-events-none opacity-50")}>
        <Switch labelledBy={`${id}-label`} checked={checked} onChange={onChange} />
      </div>
    </div>
  )
}

/** Camera device + live-view preferences, persisted per browser via `useCameraPreferences`. */
export function CameraSettingsCard({ className, bare = false }: { className?: string; bare?: boolean }) {
  const { t, fmt } = useI18n()
  const copy = t.app.cameraSettings
  const [prefs, setPref] = useCameraPreferences()
  const devices = useVideoInputs()
  const speech = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const selectId = useId()

  const list = devices.kind === "ready" ? devices.devices : []
  const labelsHidden = list.length > 0 && list.every((d) => !d.label)
  const preferredMissing =
    prefs.preferredDeviceId !== null && devices.kind === "ready" && !list.some((d) => d.deviceId === prefs.preferredDeviceId)

  const toggle = (key: keyof CameraPreferences) => (value: boolean) => setPref(key, value as never)

  const body = (
    <>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
          <Camera className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{copy.title}</h3>
          <p className="text-xs text-muted-foreground">{copy.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-foreground">
          {copy.device}
        </label>
        <Select
          id={selectId}
          value={preferredMissing ? "" : (prefs.preferredDeviceId ?? "")}
          onChange={(e) => setPref("preferredDeviceId", e.target.value || null)}
          disabled={devices.kind !== "ready" || list.length === 0}
        >
          <option value="">{copy.defaultDevice}</option>
          {list
            .filter((d) => d.deviceId)
            .map((d, index) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || fmt(copy.unnamedDevice, { n: index + 1 })}
              </option>
            ))}
        </Select>
        {devices.kind === "unavailable" ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{copy.devicesUnavailable}</p>
        ) : devices.kind === "ready" && list.length === 0 ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{copy.noDevices}</p>
        ) : labelsHidden ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{copy.labelsHidden}</p>
        ) : null}
      </div>

      <div className="mt-2 divide-y divide-border">
        <ToggleRow
          icon={<FlipHorizontal2 className="size-4" />}
          title={copy.mirror}
          description={copy.mirrorDesc}
          checked={prefs.mirrorVideo}
          onChange={toggle("mirrorVideo")}
        />
        <ToggleRow
          icon={<SquareDashed className="size-4" />}
          title={copy.framing}
          description={copy.framingDesc}
          checked={prefs.showFramingGuide}
          onChange={toggle("showFramingGuide")}
        />
        <ToggleRow
          icon={<ScanEye className="size-4" />}
          title={copy.landmarks}
          description={copy.landmarksDesc}
          note={copy.landmarksNote}
          checked={prefs.showLandmarks}
          onChange={toggle("showLandmarks")}
        />
        <ToggleRow
          icon={<Volume2 className="size-4" />}
          title={copy.speak}
          description={copy.speakDesc}
          note={speech.supported ? undefined : copy.speakUnsupported}
          checked={prefs.speakOutLoud && speech.supported}
          onChange={toggle("speakOutLoud")}
          disabled={!speech.supported}
        />
      </div>
    </>
  )

  if (bare) return <div className={className}>{body}</div>
  return <Card className={cn("p-5 sm:p-6", className)}>{body}</Card>
}
