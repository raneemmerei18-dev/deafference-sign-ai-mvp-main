"use client"

import { motion } from "framer-motion"
import { Database, Eye, Lock, ShieldCheck, UserCheck } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { ConnectorPath, GlassPanel, GlowOrb, Reveal, staggerContainer, staggerItem } from "./ui/pop"

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
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <GlowOrb className="pop-float left-[-10%] top-6 size-72" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="pop-float-delay right-[-8%] bottom-0 size-80" color="rgba(167,180,255,0.2)" />

      <Container className="relative">
        <SectionTitle
          eyebrow="Privacy policy"
          title="Privacy that respects the conversation"
          description="A summary of how Deafference handles audio, video, and account data. This page is a placeholder overview — the full legal policy will be published before general availability."
        />

        {/* Trust hub: a pulsing shield with a small "verified" accent, gesturing at a
            connected, transparent system rather than a wall of legal text. */}
        <Reveal className="mt-14 flex flex-col items-center" delay={0.05}>
          <div className="relative flex size-24 items-center justify-center rounded-full">
            <div className="pop-pulse absolute inset-0 rounded-full bg-[color:var(--primary)]/15" />
            <div className="glass-pop glow-border-pop relative flex size-20 items-center justify-center rounded-full">
              <ShieldCheck className="size-9 text-primary" />
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/8 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            <span className="size-1.5 rounded-full bg-brand-orange" />
            Verified data practices
          </span>

          <div className="relative mt-4 hidden h-16 w-full max-w-xs sm:block" aria-hidden="true">
            <ConnectorPath d="M 30 0 C 90 45, 130 45, 165 60" className="left-1/2 top-0 h-16 w-[340px] -translate-x-1/2" delay={0} />
            <ConnectorPath d="M 310 0 C 250 45, 210 45, 175 60" className="left-1/2 top-0 h-16 w-[340px] -translate-x-1/2" delay={0.8} />
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-2 grid gap-5 sm:grid-cols-2"
        >
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} variants={staggerItem} className="h-full">
                <GlassPanel className="h-full p-6 transition-transform duration-300 hover:-translate-y-1" glow>
                  <div className="flex items-start gap-4">
                    <IconBadge icon={Icon} className="bg-[color:var(--primary)]/10 text-primary" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>

        <Reveal delay={0.1} className="mt-4">
          <GlassPanel className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <p className="text-sm leading-7 text-muted-foreground">
              Questions about data handling? Reach the team directly at{" "}
              <a href="mailto:privacy@deafference.ai" className="font-medium text-foreground hover:text-primary">
                privacy@deafference.ai
              </a>
              .
            </p>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Last updated July 2026
            </p>
          </GlassPanel>
        </Reveal>
      </Container>
    </section>
  )
}
