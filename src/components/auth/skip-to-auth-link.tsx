"use client"

import { useI18n } from "@/i18n/use-i18n"

/** Translated "skip to form" link for the server-rendered /login and /signup pages. */
export function SkipToAuthLink({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useI18n()
  return (
    <a
      href="#auth"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      {t.auth.skipLink[mode]}
    </a>
  )
}
