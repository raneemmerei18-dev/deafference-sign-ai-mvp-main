"use client"

import { useLanguage } from "@/components/i18n/language-provider"

export function SkipLink() {
  const { dict } = useLanguage()
  return (
    <a href="#main-content" className="skip-link">
      {dict.skipToContent}
    </a>
  )
}
