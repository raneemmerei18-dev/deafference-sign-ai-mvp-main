"use client"

import { useState } from "react"
import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { AboutUs } from "./about-us"
import { WhyChooseUs } from "./why-choose-us"
import { HowItWorksVisual } from "./how-it-works-visual"
import { Scenarios } from "./scenarios"
import { DemoCenter } from "./demo-center"
import { Features } from "./features"
import { Performance } from "./performance"
import { Pricing } from "./pricing"
import { PrivacyPolicy } from "./privacy-policy"
import { FAQ } from "./faq"
import { Contact } from "./contact"
import { CTA } from "./cta"
import { Footer } from "./footer"
import { JudyCharacter } from "@/components/judy/judy-character"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { CalmModeProvider, useCalmMode } from "./calm-mode"
import { SectionTransition } from "./ui/section-transition"
import "./landing.css"

export function LandingPage() {
  return (
    <CalmModeProvider>
      <LandingContent />
    </CalmModeProvider>
  )
}

function LandingContent() {
  const { t, dir } = useI18n()
  const calm = useCalmMode()?.calm ?? false
  // Where the visitor last dropped Judy; she returns here after her auto-play moves.
  const [judyPos, setJudyPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <div className={cn("landing-pop relative min-h-dvh bg-background text-foreground", calm && "reduce-motion")}>
      <div aria-hidden="true" className="pop-particles pointer-events-none fixed inset-0 z-0 opacity-60" />
      {/* Decorative companion: hidden below `sm` (landing.css) so it never covers content on phones. */}
      {/* Rests on the start side so she never sits under the emergency button (end side). */}
      <JudyCharacter
        x={judyPos?.x ?? (dir === "rtl" ? "calc(100% - 148px)" : 16)}
        y={judyPos?.y ?? 10}
        draggable
        onDragEnd={setJudyPos}
        autoPlay={!calm}
        autoPlayLines={t.common.judyLines}
        announce={false}
        label={t.landing.judy.floatingLabel}
        className="landing-judy"
      />
      <Navbar />
      <main className="relative z-10">
        <SectionTransition first>
          <Hero />
        </SectionTransition>
        <SectionTransition>
          <AboutUs />
        </SectionTransition>
        <SectionTransition>
          <WhyChooseUs />
        </SectionTransition>
        <SectionTransition>
          <HowItWorksVisual />
        </SectionTransition>
        <SectionTransition>
          <Scenarios />
        </SectionTransition>
        <SectionTransition>
          <DemoCenter />
        </SectionTransition>
        <SectionTransition>
          <Features />
        </SectionTransition>
        <SectionTransition>
          <Performance />
        </SectionTransition>
        <SectionTransition>
          <Pricing />
        </SectionTransition>
        <SectionTransition>
          <PrivacyPolicy />
        </SectionTransition>
        <SectionTransition>
          <FAQ />
        </SectionTransition>
        <SectionTransition>
          <Contact />
        </SectionTransition>
        <SectionTransition>
          <CTA />
        </SectionTransition>
      </main>
      <Footer />
    </div>
  )
}
