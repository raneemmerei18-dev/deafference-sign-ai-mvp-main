"use client"

import type { ComponentType } from "react"
import { motion } from "framer-motion"
import { FileText, Mic, MessageSquare, Volume2, type LucideIcon } from "lucide-react"
import { FeatureCard } from "./feature-card"
import { SpeechToSignIllustration } from "./illustrations/speech-to-sign-illustration"
import { SignToSpeechIllustration } from "./illustrations/sign-to-speech-illustration"
import { TextToSignIllustration } from "./illustrations/text-to-sign-illustration"
import { SignToTextIllustration } from "./illustrations/sign-to-text-illustration"
import { staggerContainer, staggerItem } from "../ui/pop"

export interface FeatureCardData {
  id: string
  title: string
  subtitle: string
  pillText: string
  icon: LucideIcon
  illustration: ComponentType<{ reducedMotion?: boolean }>
  badgeTag: string
  /** Extra line revealed in an animated hover overlay — keeps the resting card compact. */
  detail: string
}

export const featureCardsData: FeatureCardData[] = [
  {
    id: "speech-to-sign",
    title: "Speech-to-Sign",
    subtitle: "Real-time audio wave input to animated sign translation",
    pillText: "SPEECH → SIGN",
    icon: Mic,
    illustration: SpeechToSignIllustration,
    badgeTag: "AI Voice",
    detail:
      "Streams live audio through on-device recognition, then renders a fluid avatar performing the matching sign sequence in under a second.",
  },
  {
    id: "sign-to-speech",
    title: "Sign-to-Speech",
    subtitle: "Camera sign gesture recognition to voice synthesis",
    pillText: "SIGN → SPEECH",
    icon: Volume2,
    illustration: SignToSpeechIllustration,
    badgeTag: "Vision AI",
    detail:
      "Vision AI tracks hand shape, motion, and facial grammar to synthesize natural, expressive spoken audio in real time.",
  },
  {
    id: "text-to-sign",
    title: "Text-to-Sign",
    subtitle: "Live typing input to digital 3D sign avatar output",
    pillText: "TEXT → SIGN",
    icon: MessageSquare,
    illustration: TextToSignIllustration,
    badgeTag: "Text Stream",
    detail:
      "Type or paste any message and watch it animate instantly into expressive, avatar-driven sign language.",
  },
  {
    id: "sign-to-text",
    title: "Sign-to-Text",
    subtitle: "Hand sign capture to real-time document transcription",
    pillText: "SIGN → TEXT",
    icon: FileText,
    illustration: SignToTextIllustration,
    badgeTag: "Captions",
    detail:
      "Continuous gesture capture transcribes into accurate captions and documents as the conversation happens.",
  },
]

export function FeatureCardGrid() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
    >
      {featureCardsData.map((card) => (
        <motion.div key={card.id} variants={staggerItem} className="h-full">
          <FeatureCard card={card} />
        </motion.div>
      ))}
    </motion.div>
  )
}
