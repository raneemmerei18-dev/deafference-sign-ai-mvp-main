"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface TranslationState {
  cameraEnabled: boolean
  landmarkOverlay: boolean
  signDialect: string
  mode: "sign-to-text" | "text-to-speech" | "speech-to-sign"
}

interface TranslationContextType {
  state: TranslationState
  setState: (state: Partial<TranslationState>) => void
  setMode: (mode: TranslationState["mode"]) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const DEFAULT_STATE: TranslationState = {
  cameraEnabled: true,
  landmarkOverlay: false,
  signDialect: "asl",
  mode: "sign-to-text",
}

const STORAGE_KEY = "translationState"

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<TranslationState>(DEFAULT_STATE)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setStateInternal({ ...DEFAULT_STATE, ...parsed })
      }
    } catch {
      // Silently fail on parse errors
    }
  }, [])

  // Save state to localStorage whenever it changes
  const setState = (newState: Partial<TranslationState>) => {
    setStateInternal((prev) => {
      const updated = { ...prev, ...newState }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Silently fail if localStorage unavailable
      }
      return updated
    })
  }

  const setMode = (mode: TranslationState["mode"]) => {
    setState({ mode })
  }

  return (
    <TranslationContext.Provider value={{ state, setState, setMode }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }
  return context
}
