"use client"

import { useState } from "react"
import { Captions, Hand, MessageSquare, Mic, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { FaqPreview } from "./faq-preview"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const STEPS: Array<{ icon: LucideIcon; tint: string; title: string; description: string }> = [
  {
    icon: Mic,
    tint: "bg-[#DCEEFF] text-[#0369A1]",
    title: "Step 1",
    description: "Deafference converts spoken words.",
  },
  {
    icon: MessageSquare,
    tint: "bg-[#FCE7F3] text-[#BE185D]",
    title: "Step 2",
    description: "Signs your speech through real-time matching.",
  },
  {
    icon: Hand,
    tint: "bg-[#CCFBF1] text-[#0F766E]",
    title: "Step 3",
    description: "Enables live, two-way interactive translation.",
  },
  {
    icon: Captions,
    tint: "bg-[#DBEAFE] text-[#1D4ED8]",
    title: "Step 4",
    description: "Renders natural, native visual sign output.",
  },
]

export function HowItWorksVisual() {
  const [active, setActive] = useState(0)

  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-stretch">
          <div className="rounded-3xl bg-accent p-6 sm:p-8">
            <h2 className="text-sm font-bold tracking-[0.14em] text-[#0F172A] uppercase">How It Works</h2>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                const isActive = active === i
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex flex-col items-start gap-3 rounded-2xl p-3 text-left transition-colors",
                      isActive ? "bg-card shadow-sm" : "hover:bg-card/60",
                      FOCUS_RING,
                    )}
                  >
                    <span className={cn("flex size-10 items-center justify-center rounded-xl", step.tint)}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{step.title}</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/70">{step.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <FaqPreview />
        </div>
      </Container>
    </section>
  )
}
