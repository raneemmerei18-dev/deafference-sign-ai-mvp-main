import { Navbar } from '@/components/sections/navbar'
import { Act1Hero } from '@/components/sections/act1-hero'
import { Act2Missed } from '@/components/sections/act2-missed'
import { Act3Resolved } from '@/components/sections/act3-resolved'
import { Act4Pipeline } from '@/components/sections/act4-pipeline'
import { Act5Environments } from '@/components/sections/act5-environments'
import { Act6ProofCta } from '@/components/sections/act6-proof-cta'

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Act1Hero />
        <Act2Missed />
        <Act3Resolved />
        <Act4Pipeline />
        <Act5Environments />
        <Act6ProofCta />
      </main>
    </>
  )
}
