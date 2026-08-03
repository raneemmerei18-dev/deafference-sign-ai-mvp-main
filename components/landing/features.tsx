"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BrainCircuit, Radio, ShieldCheck, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { FeatureCardGrid, type FeatureCardData } from "@/components/landing/features/feature-card-grid"
import { DemoModal } from "@/components/landing/features/demo-modal"

const TRUST_CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description:
      "HIPAA- and GDPR-aligned by design, with on-device processing options so sensitive conversations never have to leave the room.",
  },
  {
    icon: BrainCircuit,
    title: "High AI Accuracy",
    description:
      "Deep learning models fine-tuned on regional sign dialects and medical terminology, built for the moments accuracy matters most.",
  },
] as const

function FeatureCard({
  icon: Icon,
  title,
  description,
  emphasized = false,
}: {
  icon: LucideIcon
  title: string
  description: string
  emphasized?: boolean
}) {
  return (
    <Card className={cn("h-full p-6", emphasized && "border-brand-red/20 bg-brand-orange/[0.04]")}>
      <IconBadge icon={Icon} variant={emphasized ? "solid" : "tint"} />
      <h4 className="mt-5 text-lg font-semibold text-foreground">{title}</h4>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </Card>
  )
}

export function Features() {
  const prefersReducedMotion = useReducedMotion()
  const [selectedCard, setSelectedCard] = useState<FeatureCardData | null>(null)

  return (
    <section id="features" className="py-24 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow="Features"
          title="Every direction of translation, covered"
          description="Deafference moves fluently between spoken, written, and signed language — with the speed and trust guarantees that high-stakes conversations need."
        />

        <div className="mt-12">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Core translation directions
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative mt-5 overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-10"
          >
            <div className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-[140px]" />
            <div className="relative">
              <FeatureCardGrid reducedMotion={Boolean(prefersReducedMotion)} onSelectCard={setSelectedCard} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-6"
        >
          <Card className="relative overflow-hidden border-foreground/10 bg-foreground p-6 text-background sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <IconBadge icon={Radio} variant="solid" className="bg-background/15" />
                <div>
                  <h3 className="text-lg font-semibold sm:text-xl">Live Translation</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-background/75 sm:text-base">
                    A low-latency, continuous, bi-directional stream — so a conversation flows both
                    ways at once instead of taking turns waiting on a translation.
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold text-background">
                &lt; 300ms round-trip
              </span>
            </div>
          </Card>
        </motion.div>

        <div className="mt-12">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Built on trust
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            {TRUST_CAPABILITIES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} emphasized />
            ))}
          </motion.div>
        </div>
      </Container>

      <DemoModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </section>
  )
}
