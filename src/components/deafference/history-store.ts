"use client"

import { useSyncExternalStore } from "react"

/**
 * On-device translation history. There is no server-side history API: entries
 * live only in this browser's localStorage under `HISTORY_STORAGE_KEY`.
 * Callers decide whether to record (respect `settings.sessionHistoryEnabled`).
 */

export type HistoryMode = "avatar" | "speech" | "sign"

export type HistoryEntry = {
  id: string
  mode: HistoryMode
  input: string
  output?: string
  /** ISO timestamp. */
  createdAt: string
}

export const HISTORY_STORAGE_KEY = "df-translation-history"
export const HISTORY_MAX_ENTRIES = 200

const EMPTY: HistoryEntry[] = []
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedEntries: HistoryEntry[] = EMPTY

function isEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === "string" &&
    (entry.mode === "avatar" || entry.mode === "speech" || entry.mode === "sign") &&
    typeof entry.input === "string" &&
    typeof entry.createdAt === "string" &&
    (entry.output === undefined || typeof entry.output === "string")
  )
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(HISTORY_STORAGE_KEY)
  } catch {
    return null
  }
}

function getSnapshot(): HistoryEntry[] {
  const raw = readRaw()
  if (raw === cachedRaw) return cachedEntries
  cachedRaw = raw
  if (!raw) {
    cachedEntries = EMPTY
    return cachedEntries
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    cachedEntries = Array.isArray(parsed) ? parsed.filter(isEntry) : EMPTY
  } catch {
    cachedEntries = EMPTY
  }
  return cachedEntries
}

function getServerSnapshot(): HistoryEntry[] {
  return EMPTY
}

function write(entries: HistoryEntry[]) {
  try {
    if (entries.length === 0) window.localStorage.removeItem(HISTORY_STORAGE_KEY)
    else window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Storage full or blocked (private mode): history is best-effort.
  }
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === HISTORY_STORAGE_KEY) listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener("storage", onStorage)
  }
}

function makeId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  }
}

export function addHistoryEntry(entry: { mode: HistoryMode; input: string; output?: string }) {
  if (typeof window === "undefined") return
  const input = entry.input.trim()
  if (!input) return
  const current = getSnapshot()
  // Collapse an immediate repeat (e.g. pressing Listen twice) into one entry.
  const [latest] = current
  const rest =
    latest && latest.mode === entry.mode && latest.input === input && latest.output === entry.output
      ? current.slice(1)
      : current
  const next: HistoryEntry = { id: makeId(), mode: entry.mode, input, output: entry.output, createdAt: new Date().toISOString() }
  write([next, ...rest].slice(0, HISTORY_MAX_ENTRIES))
}

export function removeHistoryEntry(id: string) {
  if (typeof window === "undefined") return
  write(getSnapshot().filter((entry) => entry.id !== id))
}

/** Removes every on-device history entry. Safe to call from settings/privacy pages. */
export function clearTranslationHistory() {
  if (typeof window === "undefined") return
  write(EMPTY)
}

/** Newest-first history entries; `[]` during SSR and the first hydration pass. */
export function useTranslationHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
