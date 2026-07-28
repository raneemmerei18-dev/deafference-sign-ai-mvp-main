"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: "Free",
    cadence: "for individuals",
    description: "Try real-time translation for personal, one-off conversations.",
    features: ["Up to 30 translations / month", "Core language pack", "Community support"],
    href: APP_ROUTES.translate,
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per seat / month",
    description: "For clinics, front desks, and classrooms with daily usage.",
    features: [
      "Unlimited translations",
      "All supported languages",
      "Priority processing speed",
      "Shared team history",
      "Email support",
    ],
    href: APP_ROUTES.contact,
    cta: "Start a trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "for organizations",
    description: "Custom deployment, SSO, and compliance review for larger teams.",
    features: [
      "Everything in Team",
      "SSO & access controls",
      "Custom data retention policy",
      "Dedicated onboarding",
      "SLA-backed support",
    ],
    href: APP_ROUTES.contact,
    cta: "Talk to sales",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-y border-border/60 bg-muted/20 py-24 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow="Pricing"
          title="Simple plans that grow with how often you need it"
          description="Start free, upgrade when a team relies on it daily. No hidden usage fees, cancel anytime."
        />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-12 grid gap-4 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex h-full flex-col p-6 sm:p-7",
                plan.highlighted && "border-brand-red/50 ring-2 ring-brand-orange/30",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                {plan.highlighted ? <Badge className="border-brand-red/30 bg-brand-red/10 text-brand-red">Most popular</Badge> : null}
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.cadence}</span>
              </div>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-red" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "mt-8 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all",
                  plan.highlighted
                    ? "brand-gradient text-white hover:brightness-110"
                    : "border border-border text-foreground hover:bg-muted",
                )}
              >
                {plan.cta}
              </Link>
            </Card>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prices shown are illustrative placeholders and subject to change before general availability.
        </p>
      </Container>
    </section>
  )
}
