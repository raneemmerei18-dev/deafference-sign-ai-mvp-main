"use client"

import type { ComponentType } from "react"
import { motion } from "framer-motion"
import { FileText, Mic, MessageSquare, Volume2, type LucideIcon } from "lucide-react"
import { FeatureCard } from "./feature-card"
import { SpeechToSignIllustration } from "./illustrations/speech-to-sign-illustration"
import { SignToSpeechIllustration } from "./illustrations/sign-to-speech-illustration"
import { TextToSignIllustration } from "./illustrations/text-to-sign-illustration"
import { SignToTextIllustration } from "./illustrations/sign-to-text-illustration"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "../calm-mode"
import { staggerContainer, staggerItem } from "../ui/pop"

export interface FeatureCardData {
  id: string
  title: string
  subtitle: string
  pillText: string
  icon: LucideIcon
  illustration: ComponentType<{ reducedMotion?: boolean }>
  badgeTag: string
  /** Extra line: revealed on hover/focus on large screens, always visible on smaller ones. */
  detail: string
  learnMore: string
  learnMoreHref: string
}

/** Icons/illustrations, zipped by index with `t.landing.features.cards`. */
const FEATURE_VISUALS: { id: string; icon: LucideIcon; illustration: ComponentType<{ reducedMotion?: boolean }> }[] = [
  { id: "speech-to-sign", icon: Mic, illustration: SpeechToSignIllustration },
  { id: "sign-to-speech", icon: Volume2, illustration: SignToSpeechIllustration },
  { id: "text-to-sign", icon: MessageSquare, illustration: TextToSignIllustration },
  { id: "sign-to-text", icon: FileText, illustration: SignToTextIllustration },
]

export function FeatureCardGrid() {
  const { t } = useI18n()
  const copy = t.landing.features
  const reducedMotion = useLandingReducedMotion()
  const cards: FeatureCardData[] = FEATURE_VISUALS.map((visual, i) => {
    const text = copy.cards[i]
    return {
      ...visual,
      title: text?.title ?? "",
      subtitle: text?.subtitle ?? "",
      pillText: text?.pill ?? "",
      badgeTag: text?.badge ?? "",
      detail: text?.detail ?? "",
      learnMore: copy.learnMore,
      learnMoreHref: "#demo",
    }
  })

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
    >
      {cards.map((card) => (
        <motion.div key={card.id} variants={staggerItem} className="h-full">
          <FeatureCard card={card} reducedMotion={reducedMotion} />
        </motion.div>
      ))}
    </motion.div>
  )
}
