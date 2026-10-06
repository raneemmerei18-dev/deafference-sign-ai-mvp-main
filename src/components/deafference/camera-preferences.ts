"use client"

import { useSyncExternalStore } from "react"

/**
 * Device-local camera/translation preferences. Kept out of `lib/settings.ts`
 * (whose `Settings` shape is shared with the backend) and persisted in
 * localStorage only, so they apply per browser.
 */
export type CameraPreferences = {
  mirrorVideo: boolean
  showFramingGuide: boolean
  showLandmarks: boolean
  preferredDeviceId: string | null
  speakOutLoud: boolean
}

export const DEFAULT_CAMERA_PREFERENCES: CameraPreferences = {
  mirrorVideo: true,
  showFramingGuide: true,
  showLandmarks: true,
  preferredDeviceId: null,
  speakOutLoud: false,
}

const STORAGE_KEY = "df-camera-prefs"

let cache: CameraPreferences | null = null
const listeners = new Set<() => void>()

function sanitize(value: unknown): CameraPreferences {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
  const bool = (key: keyof CameraPreferences) =>
    typeof raw[key] === "boolean" ? (raw[key] as boolean) : (DEFAULT_CAMERA_PREFERENCES[key] as boolean)
  return {
    mirrorVideo: bool("mirrorVideo"),
    showFramingGuide: bool("showFramingGuide"),
    showLandmarks: bool("showLandmarks"),
    speakOutLoud: bool("speakOutLoud"),
    preferredDeviceId:
      typeof raw.preferredDeviceId === "string" && raw.preferredDeviceId ? raw.preferredDeviceId : null,
  }
}

function read(): CameraPreferences {
  if (cache) return cache
  if (typeof window === "undefined") return DEFAULT_CAMERA_PREFERENCES
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    cache = sanitize(stored ? JSON.parse(stored) : null)
  } catch {
    cache = DEFAULT_CAMERA_PREFERENCES
  }
  return cache
}

function notify() {
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return
  cache = null
  notify()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1 && typeof window !== "undefined") window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage)
  }
}

const getServerSnapshot = () => DEFAULT_CAMERA_PREFERENCES

export function setCameraPreference<K extends keyof CameraPreferences>(key: K, value: CameraPreferences[K]) {
  cache = { ...read(), [key]: value }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Storage unavailable (private mode / blocked): keep the in-memory value for this session.
  }
  notify()
}

export function useCameraPreferences(): [CameraPreferences, typeof setCameraPreference] {
  const prefs = useSyncExternalStore(subscribe, read, getServerSnapshot)
  return [prefs, setCameraPreference]
}
