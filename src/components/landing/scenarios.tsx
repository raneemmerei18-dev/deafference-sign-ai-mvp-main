"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useInView, useReducedMotion } from "framer-motion"
import { Container } from "@/components/shared/container"
import { JudyCharacter, type JudyPose } from "@/components/judy/judy-character"
import { cn } from "@/lib/utils"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

// Spots are where Judy's feet go, as % of the illustration (left, top).
// scenarios-hub.png is 1672×941; the numbers were read off the artwork.
type Spot = { left: number; top: number }

type Scenario = {
  label: string
  /** Standing spot on the room's floor. */
  at: Spot
  /** Where the room's road meets the hub ring. */
  road: Spot
  /** Extra ring points to pass on the way to the next room, so she walks around the hub, not through it. */
  via?: Spot[]
  pose: JudyPose
  message: string
}

const SCENARIOS: Scenario[] = [
  { label: "Healthcare", at: { left: 52, top: 29 }, road: { left: 55.9, top: 34 }, pose: "listen", message: "Clear answers from the doctor." },
  { label: "Hospitality", at: { left: 77.2, top: 35.6 }, road: { left: 60.4, top: 36.1 }, pose: "wave", message: "Checking in, no barriers." },
  { label: "Workplaces", at: { left: 71.8, top: 63.8 }, road: { left: 60.4, top: 49.9 }, pose: "point", message: "Every voice in the meeting." },
  {
    label: "Emergencies",
    at: { left: 58.3, top: 85 },
    road: { left: 56.8, top: 60.6 },
    via: [{ left: 50.5, top: 64.8 }],
    pose: "listen",
    message: "Help understood, fast.",
  },
  { label: "Travel", at: { left: 28.7, top: 81.8 }, road: { left: 41.3, top: 59.5 }, pose: "phone", message: "Gate change? Got it." },
  { label: "Services & Public", at: { left: 19.7, top: 62.7 }, road: { left: 35.9, top: 48.9 }, pose: "point", message: "Paperwork, made simple." },
  {
    label: "Education",
    at: { left: 26.9, top: 39.3 },
    road: { left: 41.3, top: 35.1 },
    via: [{ left: 48.4, top: 33.5 }],
    pose: "cute-think",
    message: "Learning, live in sign.",
  },
]

// Must match `.judy-in-scene { width: 4.2% }` so her feet land on the spot.
const JUDY_HALF_WIDTH = 2.1
const IMAGE_ASPECT = 941 / 1672
const MS_PER_UNIT = 110
const VISIT_MS = 3800

export function Scenarios() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sceneRef, { amount: 0.3 })
  const reduceMotion = useReducedMotion()

  const [stopIndex, setStopIndex] = useState(0)
  const [spot, setSpot] = useState<Spot>(SCENARIOS[0].at)
  const [pose, setPose] = useState<JudyPose>("idle")
  const [facing, setFacing] = useState<"left" | "right">("right")
  const [message, setMessage] = useState("")
  const [travelMs, setTravelMs] = useState(0)
  // The loop reads these between awaits, so it resumes where she is when the section scrolls back in.
  const spotRef = useRef(spot)
  const stopRef = useRef(stopIndex)

  useEffect(() => {
    if (!inView || reduceMotion) return
    let cancelled = false
    const timers = new Set<number>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          resolve()
        }, ms)
        timers.add(id)
      })

    const walkTo = async (to: Spot) => {
      const from = spotRef.current
      const distance = Math.hypot(to.left - from.left, (to.top - from.top) * IMAGE_ASPECT)
      const ms = Math.max(350, Math.round(distance * MS_PER_UNIT))
      if (Math.abs(to.left - from.left) > 0.5) setFacing(to.left < from.left ? "left" : "right")
      setTravelMs(ms)
      setPose("walk")
      spotRef.current = to
      setSpot(to)
      await wait(ms)
    }

    const tour = async () => {
      while (!cancelled) {
        const here = SCENARIOS[stopRef.current]
        setPose(here.pose)
        setMessage(here.message)
        await wait(VISIT_MS)
        if (cancelled) return
        setMessage("")
        await wait(400)

        const nextIndex = (stopRef.current + 1) % SCENARIOS.length
        const next = SCENARIOS[nextIndex]
        stopRef.current = nextIndex
        setStopIndex(nextIndex)
        for (const point of [here.road, ...(here.via ?? []), next.road, next.at]) {
          if (cancelled) return
          await walkTo(point)
        }
      }
    }
    tour()

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
      setMessage("")
    }
  }, [inView, reduceMotion])

  const current = SCENARIOS[stopIndex]

  return (
    <section id="scenarios" aria-labelledby="scenarios-heading" className="pop-atmosphere relative overflow-hidden py-24 sm:py-28">
      <GlowOrb className="-top-24 right-0 size-[26rem] pop-float" color="rgba(45,212,191,0.16)" />

      <Container>
        <Reveal className="max-w-2xl">
          <PopEyebrow>🧭 Scenarios</PopEyebrow>
          <h2 id="scenarios-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-brand-navy sm:text-4xl">
            Follow Judy through a day with Deafference.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            From the doctor&apos;s office to the airport gate, Judy walks every place where a missing interpreter
            shouldn&apos;t mean a missed conversation.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-5xl">
          <div ref={sceneRef} className="relative aspect-[1672/941] w-full" style={{ ["--judy-travel" as string]: `${travelMs}ms` }}>
            <Image
              src="/scenarios-hub.png"
              alt="Where Deafference matters: Healthcare, Hospitality, Education, Workplaces, Services & Public, Travel, and Emergencies"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
            <JudyCharacter
              className="judy-in-scene"
              x={`${spot.left - JUDY_HALF_WIDTH}%`}
              y={`${100 - spot.top}%`}
              pose={pose}
              facing={facing}
              message={message}
            />
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Scenarios">
            {SCENARIOS.map((scenario) => (
              <li
                key={scenario.label}
                aria-current={scenario === current ? "true" : undefined}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  scenario === current
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                    : "border-[color:var(--primary)]/20 text-[color:var(--primary)]",
                )}
              >
                {scenario.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
