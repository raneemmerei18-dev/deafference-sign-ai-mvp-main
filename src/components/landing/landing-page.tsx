"use client"

import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { AboutUs } from "./about-us"
import { WhyChooseUs } from "./why-choose-us"
import { HowItWorksVisual } from "./how-it-works-visual"
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

export function LandingPage() {
  return (
    <div className="landing-pop relative min-h-dvh bg-background text-foreground">
      <div aria-hidden="true" className="pop-particles pointer-events-none fixed inset-0 z-0 opacity-60" />
      <JudyCharacter pose="idle" x={16} y={10} />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <AboutUs />
        <WhyChooseUs />
        <HowItWorksVisual />
        <DemoCenter />
        <Features />
        <Performance />
        <Pricing />
        <PrivacyPolicy />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
