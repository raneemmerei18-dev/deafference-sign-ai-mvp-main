import { ContactSection } from "@/components/landing/contact-section"
import { DemoSection } from "@/components/landing/demo-section"
import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { PricingSection } from "@/components/landing/pricing-section"
import { SkipLink } from "@/components/landing/skip-link"
import { AboutSection } from "@/components/landing/about-section"
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { PerformanceSection } from "@/components/landing/performance-section"
import { PrivacyFaqSection } from "@/components/landing/privacy-faq-section"

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <DemoSection />
        <WhyChooseUsSection />
        <AboutSection />
        <FeaturesSection />
        <PerformanceSection />
        <PricingSection />
        <PrivacyFaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
