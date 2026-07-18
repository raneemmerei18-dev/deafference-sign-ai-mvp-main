import type { Metadata } from 'next'
import { DemoStage } from '@/components/translate/demo-stage'

export const metadata: Metadata = {
  title: 'Deafference — Demo',
  description:
    'A frontend-only demo: supported speech becomes caption and sign. Mock predictions, no live inference.',
}

export default function TranslatePage() {
  return (
    <>
      <a
        href="#demo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to demo
      </a>
      <main id="demo" className="min-h-[100svh] bg-paper">
        <h1 className="sr-only">Deafference demo — mock predictions</h1>
        <DemoStage />
      </main>
    </>
  )
}
