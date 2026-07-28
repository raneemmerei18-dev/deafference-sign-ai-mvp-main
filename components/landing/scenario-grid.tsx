"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, GraduationCap, Landmark, Play, Stethoscope, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"

type Scenario = {
  icon: LucideIcon
  emoji: string
  title: string
  description: string
  workflow: string[]
}

const SCENARIOS: Scenario[] = [
  {
    icon: Stethoscope,
    emoji: "🏥",
    title: "Doctor & Patient Care",
    description: "Instant spoken medical advice converted into visual sign language.",
    workflow: ["Doctor speaks", "Deafference", "Patient sees sign"],
  },
  {
    icon: Landmark,
    emoji: "🏛️",
    title: "Public Desks & Service Counters",
    description: "Seamless service counter interactions without needing specialized interpreters.",
    workflow: ["Staff voice", "Live sign screen", "Citizen"],
  },
  {
    icon: GraduationCap,
    emoji: "🏫",
    title: "Classrooms & Lectures",
    description: "Accessible real-time classroom lecture streams for Deaf students.",
    workflow: ["Teacher speech", "Instant avatar stream"],
  },
]

function ScenarioCard({ scenario, index }: { scenario: Scenario; index: number }) {
  const [active, setActive] = useState(false)
  const Icon = scenario.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "group relative rounded-2xl border border-slate-700/70 bg-slate-800/40 p-6 transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-brand-orange/50 hover:shadow-xl hover:shadow-brand-orange/10",
        active && "-translate-y-1.5 border-brand-orange/60 shadow-xl shadow-brand-orange/10",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
          <Icon className="size-6" />
        </div>
        <span className="text-2xl" aria-hidden="true">
          {scenario.emoji}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">{scenario.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.description}</p>

      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        className={cn(
          "-mx-1 mt-5 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-semibold text-brand-orange transition-colors hover:text-white",
          FOCUS_RING,
        )}
      >
        <Play className="size-3" fill="currentColor" aria-hidden="true" />
        {active ? "Hide workflow" : "Preview workflow"}
      </button>

      <div
        className={cn(
          "mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-slate-700 bg-black/30 px-3 py-2.5 text-[11px] font-medium text-slate-300 transition-all duration-300",
          active && "border-brand-orange/50 bg-brand-orange/5 text-white",
        )}
      >
        {scenario.workflow.map((step, i) => (
          <span key={step} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <ArrowRight
                className={cn("size-3 text-brand-orange/70 transition-colors", active && "text-brand-orange")}
                aria-hidden="true"
              />
            )}
            {step}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function ScenarioGrid() {
  return (
    <section id="use-cases" className="border-y border-white/5 bg-[#0B0F19] py-24 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-red/10 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase">
            🌍 Real-world impact
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            Designed for where communication matters most.
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {SCENARIOS.map((scenario, index) => (
            <ScenarioCard key={scenario.title} scenario={scenario} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}
