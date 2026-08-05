"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  BrainCircuit,
  Captions,
  Hand,
  Mic,
  Monitor,
  Radio,
  ShieldCheck,
  Tablet,
  Volume2,
  type LucideIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"

const TRANSLATION_DIRECTIONS = [
  {
    badgeIcon: Mic,
    deviceIcon: Monitor,
    label: "Speech-to-Sign",
    pill: "SPEECH → SIGN",
    tint: "bg-[#DCEEFF] text-[#0369A1]",
    figure: "bg-gradient-to-br from-[#FF8F00] to-[#FFC107]",
    image: "/speech-to-sign.png",
    fullCardImage: true,
  },
  {
    badgeIcon: Hand,
    deviceIcon: Volume2,
    label: "Sign-to-Speech",
    pill: "SIGN → SPEECH",
    tint: "bg-[#FCE7F3] text-[#BE185D]",
    figure: "bg-gradient-to-br from-[#FF8F00] to-[#FFC107]",
    image: "/sign-to-speech.png",
    fullCardImage: true,
  },
  {
    badgeIcon: Monitor,
    deviceIcon: Hand,
    label: "Text-to-Sign",
    pill: "TEXT → SIGN",
    tint: "bg-[#CCFBF1] text-[#0F766E]",
    figure: "bg-gradient-to-br from-[#FF8F00] to-[#FFC107]",
    image: "/text-to-sign.png",
    fullCardImage: true,
  },
  {
    badgeIcon: Tablet,
    deviceIcon: Captions,
    label: "Sign-to-Text",
    pill: "SIGN → TEXT",
    tint: "bg-[#DBEAFE] text-[#1D4ED8]",
    figure: "bg-gradient-to-br from-[#FF8F00] to-[#FFC107]",
    image: "/sign-to-text.png",
    fullCardImage: true,
  },
] as const satisfies ReadonlyArray<{
  badgeIcon: LucideIcon
  deviceIcon: LucideIcon
  label: string
  pill: string
  tint: string
  figure: string
  image: string | undefined
  fullCardImage: boolean
}>

// Flat figure used across every direction card — a person mid-gesture, one
// hand raised to signal "signing." Recolored via `currentColor` and paired
// with a small device-icon bubble so each card reads as a distinct scenario
// without needing four separate illustration assets.
function SigningFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <circle cx="60" cy="30" r="20" fill="currentColor" />
      <path d="M22 128c0-30 15-50 38-50s38 20 38 50" fill="currentColor" />
      <path
        d="M78 76c14-6 22-18 24-30"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DirectionCard({
  badgeIcon: BadgeIcon,
  deviceIcon: DeviceIcon,
  label,
  pill,
  tint,
  figure,
  image,
  fullCardImage,
}: (typeof TRANSLATION_DIRECTIONS)[number]) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image) && !imageFailed

  // This direction's asset is a complete pre-composed card (badge and pill
  // already baked into the artwork) rather than a bare illustration — render
  // it as-is instead of layering our own badge/pill on top of it.
  if (showImage && fullCardImage) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-start">
        <div className="relative h-56 w-full sm:h-64">
          <Image
            src={image!}
            alt={`${label}: illustrated card showing the ${pill.toLowerCase()} translation flow`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain drop-shadow-sm"
            onError={() => setImageFailed(true)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className={cn("relative flex h-56 w-full flex-col justify-between overflow-hidden rounded-3xl p-4", figure)}>
        {showImage && (
          <Image
            src={image!}
            alt={`${label} illustration`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        )}

        <span className="relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0F172A] shadow-sm">
          <BadgeIcon className={cn("size-3.5 rounded-full p-0.5", tint)} aria-hidden="true" />
          {label}
        </span>

        {!showImage && (
          <div className="relative mx-auto flex items-end">
            <SigningFigure className="h-32 w-32 text-white/95 drop-shadow-sm" />
            <span
              className={cn(
                "absolute -right-1 top-1 flex size-9 items-center justify-center rounded-full shadow-sm",
                tint,
              )}
            >
              <DeviceIcon className="size-4" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>

      <span
        className={cn(
          "rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.08em] uppercase",
          tint,
        )}
      >
        {pill}
      </span>
    </div>
  )
}

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
  return (
    <section
      id="features"
      className="py-24 sm:py-28"
      data-mira-zone="0.3"
      data-mira-mood="happy"
      data-mira-line="Built for real conversations."
    >
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
            className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {TRANSLATION_DIRECTIONS.map((direction) => (
              <DirectionCard key={direction.label} {...direction} />
            ))}
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
    </section>
  )
}
