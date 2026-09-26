"use client"

import { ChevronRight } from "lucide-react"
import { FAQ_ITEMS } from "@/lib/constants"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function FaqPreview() {
  const preview = FAQ_ITEMS.slice(0, 3)

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-[#0F172A]">FAQ</h3>

      <ul className="mt-3 flex-1 divide-y divide-border">
        {preview.map((item) => (
          <li key={item.title}>
            <a
              href="#faq"
              className={`group flex items-start justify-between gap-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-[#0F172A] ${FOCUS_RING}`}
            >
              {item.title}
              <ChevronRight
                className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#0F172A]"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#faq"
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:underline ${FOCUS_RING}`}
      >
        View all FAQs
        <ChevronRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  )
}
