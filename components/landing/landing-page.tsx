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
import { ScenarioGrid } from "./scenario-grid"
import { PrivacyPolicy } from "./privacy-policy"
import { FAQ } from "./faq"
import { Contact } from "./contact"
import { CTA } from "./cta"
import { Footer } from "./footer"
import { MiraCompanion } from "./mira-companion"

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MiraCompanion />
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <WhyChooseUs />
        <HowItWorksVisual />
        <DemoCenter />
        <Features />
        <Performance />
        <Pricing />
        <ScenarioGrid />
        <PrivacyPolicy />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
