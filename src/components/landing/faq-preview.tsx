"use client"

import { ChevronRight, HelpCircle } from "lucide-react"
import { FAQ_ITEMS } from "@/lib/constants"
import { GlassPanel, focusRingPop } from "./ui/pop"

export function FaqPreview() {
  const preview = FAQ_ITEMS.slice(0, 3)

  return (
    <GlassPanel className="flex h-full flex-col p-6" glow>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-primary">
          <HelpCircle className="size-4" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold text-foreground">FAQ</h3>
      </div>

      <ul className="mt-4 flex-1 space-y-2">
        {preview.map((item) => (
          <li key={item.title}>
            <a
              href="#faq"
              className={`group flex items-start justify-between gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium text-foreground/80 transition-all hover:border-[color:var(--primary)]/15 hover:bg-[color:var(--primary)]/6 hover:text-foreground ${focusRingPop}`}
            >
              {item.title}
              <ChevronRight
                className="mt-0.5 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#faq"
        className={`mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary hover:underline ${focusRingPop}`}
      >
        View all FAQs
        <span className="inline-flex size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
        <ChevronRight className="size-4" aria-hidden="true" />
      </a>
    </GlassPanel>
  )
}

