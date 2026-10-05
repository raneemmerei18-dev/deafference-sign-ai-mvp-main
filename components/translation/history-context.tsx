"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface HistoryItem {
  id: string
  type: "sign-to-text" | "text-to-speech" | "speech-to-sign"
  inputText: string
  outputText: string
  category: string
  timestamp: number
}

interface HistoryContextType {
  items: HistoryItem[]
  addItem: (item: Omit<HistoryItem, "id" | "timestamp">) => void
  deleteItem: (id: string) => void
  clearAll: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

const STORAGE_KEY = "translationHistory"
const MAX_HISTORY_ITEMS = 100

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setItems(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      // Silently fail on parse errors
    }
    setIsHydrated(true)
  }, [])

  const addItem = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    const updated = [newItem, ...items].slice(0, MAX_HISTORY_ITEMS)
    setItems(updated)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Silently fail if localStorage unavailable
    }
  }

  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id)
    setItems(updated)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Silently fail if localStorage unavailable
    }
  }

  const clearAll = () => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Silently fail if localStorage unavailable
    }
  }

  if (!isHydrated) {
    return <>{children}</>
  }

  return (
    <HistoryContext.Provider value={{ items, addItem, deleteItem, clearAll }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider")
  }
  return context
}
