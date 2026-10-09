"use client"

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { useSettings } from "./settings-provider"

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export function useStableCallback<T extends (...args: any[]) => any>(callback: T) {
  const ref = useRef(callback)
  useEffect(() => {
    ref.current = callback
  }, [callback])
  return useCallback((...args: Parameters<T>) => ref.current(...args), [])
}

const noopSubscribe = () => () => {}

/** False during SSR and the hydration pass, true afterwards — for "loading while hydrating" states. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

/** Live `matchMedia` result; `false` on the server. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Honours both the OS preference and the in-app "Reduce motion" setting. */
export function useReducedMotion() {
  const { settings } = useSettings()
  const prefers = useMediaQuery("(prefers-reduced-motion: reduce)")
  return prefers || settings.reduceMotion
}
