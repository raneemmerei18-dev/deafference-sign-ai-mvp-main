"use client"

import type { ComponentType } from "react"
import { FileText, Mic, MessageSquare, Volume2, type LucideIcon } from "lucide-react"
import { FeatureCard } from "./feature-card"
import { SpeechToSignIllustration } from "./illustrations/speech-to-sign-illustration"
import { SignToSpeechIllustration } from "./illustrations/sign-to-speech-illustration"
import { TextToSignIllustration } from "./illustrations/text-to-sign-illustration"
import { SignToTextIllustration } from "./illustrations/sign-to-text-illustration"

export interface FeatureCardData {
  id: string
  title: string
  subtitle: string
  pillText: string
  icon: LucideIcon
  illustration: ComponentType<{ reducedMotion?: boolean }>
  badgeTag: string
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
  },
  {
    id: "sign-to-speech",
    title: "Sign-to-Speech",
    subtitle: "Camera sign gesture recognition to voice synthesis",
    pillText: "SIGN → SPEECH",
    icon: Volume2,
    illustration: SignToSpeechIllustration,
    badgeTag: "Vision AI",
  },
  {
    id: "text-to-sign",
    title: "Text-to-Sign",
    subtitle: "Live typing input to digital 3D sign avatar output",
    pillText: "TEXT → SIGN",
    icon: MessageSquare,
    illustration: TextToSignIllustration,
    badgeTag: "Text Stream",
  },
  {
    id: "sign-to-text",
    title: "Sign-to-Text",
    subtitle: "Hand sign capture to real-time document transcription",
    pillText: "SIGN → TEXT",
    icon: FileText,
    illustration: SignToTextIllustration,
    badgeTag: "Captions",
  },
]

export function FeatureCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {featureCardsData.map((card) => (
        <FeatureCard key={card.id} card={card} />
      ))}
    </div>
  )
}
