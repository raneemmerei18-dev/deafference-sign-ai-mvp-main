"use client"

import { motion } from "framer-motion"
import { Database, Eye, Lock, UserCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"

const principles = [
  {
    icon: Lock,
    title: "No recordings kept by default",
    description: "Audio is processed in memory to generate a translation and is not stored unless you explicitly opt in to session history.",
  },
  {
    icon: Database,
    title: "Data minimization",
    description: "We collect only what the translation pipeline needs to run — no unrelated profiling or resale of usage data.",
  },
  {
    icon: UserCheck,
    title: "You control your history",
    description: "Anyone can view, export, or delete their saved translation history from account settings at any time.",
  },
  {
    icon: Eye,
    title: "Transparent by design",
    description: "Camera and microphone permissions are requested explicitly, and access can be revoked without losing access to the app.",
  },
]

export function PrivacyPolicy() {
  return (
    <section
      id="privacy"
      className="py-24 sm:py-28"
      data-mira-zone="0.2"
      data-mira-mood="neutral"
      data-mira-line="Nothing leaves your device."
    >
      <Container>
        <SectionTitle
          eyebrow="Privacy policy"
          title="Privacy that respects the conversation"
          description="A summary of how Deafference handles audio, video, and account data. This page is a placeholder overview — the full legal policy will be published before general availability."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-12 grid gap-4 md:grid-cols-2"
        >
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="p-6">
                <div className="flex items-start gap-4">
                  <IconBadge icon={Icon} />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-4"
        >
          <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <p className="text-sm leading-7 text-muted-foreground">
              Questions about data handling? Reach the team directly at{" "}
              <a href="mailto:privacy@deafference.ai" className="font-medium text-foreground hover:text-brand-red">
                privacy@deafference.ai
              </a>
              .
            </p>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Last updated July 2026
            </p>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
}
