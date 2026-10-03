"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { Building, Building2, Check, HeartPulse, UserRound, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { GlassPanel, GlowOrb, Magnetic, staggerContainer, staggerItem } from "./ui/pop"

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
    <div className="glass-pop mx-auto mt-8 flex w-fit items-center gap-3 rounded-full px-5 py-2.5">
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
          isAnnual ? "bg-blue-accent" : "bg-muted-foreground/30",
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
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-y border-border/60 py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="pop-atmosphere absolute inset-0" />
        <div className="pop-grid absolute inset-0 opacity-30" />
        <GlowOrb className="left-[-10%] top-10 size-80" color="rgba(59,130,246,0.16)" />
        <GlowOrb className="right-[-8%] bottom-10 size-72" color="rgba(109,124,246,0.16)" />
      </div>

      <Container className="relative">
        <SectionTitle
          headingId="pricing-heading"
          eyebrow="Pricing"
          title="Plans built for every scale, from personal use to hospital networks"
          description="Every tier includes core translation. Higher tiers add bi-directional translation, integrations, and dedicated support as your deployment grows."
          align="center"
        />

        <BillingToggle billing={billing} onChange={setBilling} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon
            const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice

            return (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={cn("relative h-full", plan.highlighted && "lg:-translate-y-4 lg:scale-[1.05] z-10")}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3.5 left-1/2 z-20 -translate-x-1/2">
                    <Badge className="border-brand-orange/40 bg-brand-orange/15 text-brand-orange shadow-sm">
                      Most Popular
                    </Badge>
                  </span>
                ) : null}

                <GlassPanel
                  as="div"
                  glow={plan.highlighted}
                  className={cn(
                    "flex h-full flex-col p-6 transition-shadow duration-300",
                    plan.highlighted && "ring-1 ring-[color:var(--primary)]/35",
                  )}
                >
                  <div
                    aria-labelledby={`plan-${plan.name}-heading`}
                    className="flex flex-1 flex-col"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          plan.highlighted ? "bg-brand-orange/15 text-brand-orange" : "bg-blue-accent/12 text-blue-accent",
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                      <h3 id={`plan-${plan.name}-heading`} className="text-lg font-semibold text-foreground">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{plan.audience}</p>

                    <div className="mt-5 flex items-baseline gap-1.5 overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={price}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="pop-gradient-text text-3xl font-semibold tracking-tight"
                        >
                          {price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-muted-foreground">{plan.cadenceSuffix}</span>
                    </div>

                    <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <Check className="mt-0.5 size-4 shrink-0 text-blue-accent" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Magnetic strength={8} className="mt-8 block w-full">
                      <Link
                        href={plan.href}
                        className={cn(
                          "inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all",
                          plan.highlighted
                            ? "bg-gradient-to-r from-blue-accent to-[#1d4ed8] text-white shadow-[0_14px_32px_-14px_rgba(59,130,246,0.65)] hover:brightness-110"
                            : "border border-border text-foreground hover:bg-muted",
                          FOCUS_RING,
                        )}
                      >
                        {plan.cta}
                      </Link>
                    </Magnetic>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Prices shown are illustrative placeholders and subject to change before general availability.
          Enterprise pricing is a custom annual contract scoped to deployment size.
        </p>
      </Container>
    </section>
  )
}
