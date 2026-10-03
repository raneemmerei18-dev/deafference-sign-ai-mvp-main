import { ContactSection } from "@/components/landing/contact-section"
import { DemoSection } from "@/components/landing/demo-section"
import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { PricingSection } from "@/components/landing/pricing-section"
import { SkipLink } from "@/components/landing/skip-link"

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <DemoSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
