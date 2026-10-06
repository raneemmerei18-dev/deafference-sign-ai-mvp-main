'use client'

import { useId } from 'react'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/use-i18n'
import type { Locale } from '@/i18n/locale'

/**
 * Interface-language switch (English / العربية). Uses the existing `settings.language`
 * preference via `setLocale`, which applies and persists the choice immediately.
 */
export function LanguageSection() {
  const { t, locale, setLocale } = useI18n()
  const idPrefix = useId()

  const options: Array<{ value: Locale; label: string; lang: string }> = [
    { value: 'en', label: t.profile.language.english, lang: 'en' },
    { value: 'ar', label: t.profile.language.arabic, lang: 'ar' },
  ]

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const next = options[(index + 1) % options.length]
    setLocale(next.value)
    requestAnimationFrame(() => document.getElementById(`${idPrefix}-${next.value}`)?.focus())
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
            {t.profile.language.heading}
          </h2>
          <p id={`${idPrefix}-desc`} className="text-sm text-muted-foreground">
            {t.profile.language.description}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-labelledby={`${idPrefix}-heading`}
          aria-describedby={`${idPrefix}-desc`}
          className="grid grid-cols-2 gap-2 sm:max-w-sm"
        >
          {options.map((option, index) => {
            const selected = locale === option.value
            return (
              <button
                key={option.value}
                id={`${idPrefix}-${option.value}`}
                type="button"
                role="radio"
                lang={option.lang}
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setLocale(option.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  'flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-foreground hover:bg-muted',
                )}
              >
                {selected ? <Check className="size-4" aria-hidden="true" /> : null}
                {option.label}
              </button>
            )
          })}
        </div>
      </section>
    </Card>
  )
}
