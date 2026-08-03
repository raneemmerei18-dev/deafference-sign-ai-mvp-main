"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Building, Building2, Check, HeartPulse, UserRound, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

type Billing = "monthly" | "annual"

type Plan = {
  icon: LucideIcon
  name: string
  audience: string
  monthlyPrice: string
  annualPrice: string
  cadenceSuffix: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
}

const PLANS: Plan[] = [
  {
    icon: UserRound,
    name: "Free",
    audience: "For individual Deaf/Hard of Hearing users & personal emergency prep",
    monthlyPrice: "$0",
    annualPrice: "$0",
    cadenceSuffix: "/month",
    features: ["Core Emergency Quick-Action Hub", "Basic offline phrases", "Standard text-to-sign capabilities"],
    cta: "Get Started",
    href: APP_ROUTES.translate,
  },
  {
    icon: Building,
    name: "Basic",
    audience: "For small clinics, private practices & local community offices",
    monthlyPrice: "$500",
    annualPrice: "$500",
    cadenceSuffix: "/month",
    features: [
      "Standard AI Real-Time Sign Translation",
      "Digital communication cards",
      "Single-device access",
      "Standard email support",
    ],
    cta: "Choose Basic",
    href: APP_ROUTES.signup,
  },
  {
    icon: HeartPulse,
    name: "Premium",
    audience: "For regional hospitals, educational institutions & mid-sized enterprises",
    monthlyPrice: "$5,000",
    annualPrice: "$5,000",
    cadenceSuffix: "/month",
    features: [
      "Full bi-directional Sign-to-Speech / Speech-to-Sign translation",
      "Multi-dialect support",
      "Waiting room visual & haptic alerts",
      "Priority 24/7 technical support",
    ],
    cta: "Upgrade to Premium",
    href: APP_ROUTES.signup,
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Enterprise",
    audience: "For large hospital networks, government agencies, universities & multi-location corporate networks",
    monthlyPrice: "$10,000–$50,000",
    annualPrice: "$10,000–$50,000",
    cadenceSuffix: "/year, custom",
    features: [
      "Full EHR/EMR & hospital system integration",
      "Custom regional dialect training",
      "Dedicated HIPAA/GDPR compliance reporting",
      "SLA guarantees",
      "Multi-department licensing",
    ],
    cta: "Contact Sales",
    href: "#contact",
  },
]

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (billing: Billing) => void }) {
  const isAnnual = billing === "annual"

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle annual billing"
        onClick={() => onChange(isAnnual ? "monthly" : "annual")}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
          isAnnual ? "bg-brand-red" : "bg-muted-foreground/30",
          FOCUS_RING,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block size-5 transform rounded-full bg-background shadow transition-transform",
            isAnnual ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>
        Annual
      </span>
    </div>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly")

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="border-y border-border/60 bg-muted/20 py-24 sm:py-28">
      <Container>
        <SectionTitle
          headingId="pricing-heading"
          eyebrow="Pricing"
          title="Plans built for every scale, from personal use to hospital networks"
          description="Every tier includes core translation. Higher tiers add bi-directional translation, integrations, and dedicated support as your deployment grows."
          align="center"
        />

        <BillingToggle billing={billing} onChange={setBilling} />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon
            const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice

            return (
              <Card
                key={plan.name}
                aria-labelledby={`plan-${plan.name}-heading`}
                className={cn(
                  "flex h-full flex-col p-6",
                  plan.highlighted && "border-brand-red/50 ring-2 ring-brand-orange/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-red" aria-hidden="true">
                      <Icon className="size-4" />
                    </span>
                    <h3 id={`plan-${plan.name}-heading`} className="text-lg font-semibold text-foreground">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.highlighted ? (
                    <Badge className="border-brand-red/30 bg-brand-red/10 text-brand-red">Most Popular</Badge>
                  ) : null}
                </div>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">{plan.audience}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">{price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadenceSuffix}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "mt-8 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all",
                    plan.highlighted
                      ? "brand-gradient text-[#0F172A] hover:brightness-105"
                      : "border border-border text-foreground hover:bg-muted",
                    FOCUS_RING,
                  )}
                >
                  {plan.cta}
                </Link>
              </Card>
            )
          })}
        </motion.div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prices shown are illustrative placeholders and subject to change before general availability.
          Enterprise pricing is a custom annual contract scoped to deployment size.
        </p>
      </Container>
    </section>
  )
}
