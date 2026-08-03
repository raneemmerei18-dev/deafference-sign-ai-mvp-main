"use client"

import { useId, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Banknote,
  Briefcase,
  Dumbbell,
  GraduationCap,
  Hospital,
  Landmark,
  Plane,
  School,
  ShoppingCart,
  Siren,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

type Scenario = {
  icon: LucideIcon
  title: string
  context: string
  solution: string
}

const SCENARIO_CATEGORIES: { key: string; label: string; scenarios: Scenario[] }[] = [
  {
    key: "healthcare",
    label: "Healthcare",
    scenarios: [
      {
        icon: Hospital,
        title: "Hospital",
        context: "In an ER, there's rarely time to book a certified interpreter before triage decisions get made.",
        solution: "Intake staff and doctors get an instant, on-screen sign channel, so triage and consultations don't wait on interpreter availability.",
      },
      {
        icon: Stethoscope,
        title: "Clinic",
        context: "Routine visits get rescheduled or cut short when an interpreter can't be arranged for a short appointment slot.",
        solution: "A signer and clinician can hold a full checkup or specialist consult in real time, with medical history questions translated both ways.",
      },
    ],
  },
  {
    key: "education",
    label: "Education",
    scenarios: [
      {
        icon: School,
        title: "School",
        context: "A Deaf student can fall behind mid-lesson while waiting for an interpreter to catch up on a fast-moving class discussion.",
        solution: "The teacher's speech streams into sign alongside the lesson, so a student can participate in the moment, not after the fact.",
      },
      {
        icon: GraduationCap,
        title: "University",
        context: "Lecture halls and labs move fast, and a single interpreter can't always be scheduled for every office hour or study group.",
        solution: "Lectures, lab discussions, and office hours all get the same live translation pipeline, available on demand rather than by appointment.",
      },
    ],
  },
  {
    key: "everyday",
    label: "Everyday Life",
    scenarios: [
      {
        icon: UtensilsCrossed,
        title: "Restaurant",
        context: "Ordering food, asking about allergens, or flagging a dietary restriction often turns into pointing at a menu and hoping.",
        solution: "A server's spoken explanation of specials or ingredients renders into sign instantly, and the guest's questions translate back the same way.",
      },
      {
        icon: Banknote,
        title: "Bank",
        context: "Financial conversations are detail-heavy and private — writing them back and forth on paper isn't fast or discreet.",
        solution: "Account inquiries and teller transactions happen through a private, real-time sign channel instead of handwritten notes at the counter.",
      },
      {
        icon: ShoppingCart,
        title: "Supermarket",
        context: "Asking an associate where to find an item, or resolving a checkout issue, usually means typing notes back and forth on a phone.",
        solution: "A quick question to staff or a checkout hiccup gets resolved through live sign translation instead of typing on a shared screen.",
      },
    ],
  },
  {
    key: "public",
    label: "Public & Government",
    scenarios: [
      {
        icon: Landmark,
        title: "Government Services",
        context: "Government offices rarely have on-site interpreters, so appointments for paperwork or civil registry get delayed or rebooked.",
        solution: "Front-desk staff can walk through forms, IDs, and registry steps in real time without waiting on a scheduled interpreter.",
      },
      {
        icon: Siren,
        title: "Police / Law Enforcement",
        context: "A traffic stop or a statement to an officer is a high-stakes moment where miscommunication can escalate quickly.",
        solution: "Officers and civilians get a clear, real-time sign channel for instructions, questions, and statements — reducing the risk of it escalating.",
      },
      {
        icon: Plane,
        title: "Airport",
        context: "Gate changes and security instructions are announced over a PA system or spoken quickly at a checkpoint, easy to miss entirely.",
        solution: "Spoken announcements and check-in or security instructions can be signed live from any staff member's device, no interpreter required.",
      },
    ],
  },
  {
    key: "workplace",
    label: "Workplace & Fitness",
    scenarios: [
      {
        icon: Briefcase,
        title: "Company / Workplace",
        context: "Team meetings and onboarding sessions move at hearing-employee pace, leaving a Deaf colleague to piece things together after the fact.",
        solution: "HR onboarding, stand-ups, and team meetings get real-time sign translation so a Deaf employee participates in the moment.",
      },
      {
        icon: Dumbbell,
        title: "Gym / Fitness Center",
        context: "Trainers give quick verbal cues mid-set, and safety orientations are often a single spoken walkthrough with no visual backup.",
        solution: "Coaching cues and safety orientations are signed in real time, so form corrections and facility rules land exactly when they're needed.",
      },
    ],
  },
]

const TABS = [
  { key: "all", label: "All Scenarios", scenarios: SCENARIO_CATEGORIES.flatMap((category) => category.scenarios) },
  ...SCENARIO_CATEGORIES,
]

function ScenarioCard({ scenario, index }: { scenario: Scenario; index: number }) {
  const Icon = scenario.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: Math.min(index, 7) * 0.04, ease: "easeOut" }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF8F00]/50 hover:shadow-xl hover:shadow-[#FF8F00]/10"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-[#FFC107]/20 text-[#0F172A]" aria-hidden="true">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#0F172A]">{scenario.title}</h3>

      <div className="mt-4 space-y-3 text-sm leading-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Pain point</p>
          <p className="mt-1 text-foreground/70">{scenario.context}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B45309] uppercase">Deafference solution</p>
          <p className="mt-1 text-foreground/70">{scenario.solution}</p>
        </div>
      </div>
    </motion.article>
  )
}

function ScenarioTabs() {
  const [active, setActive] = useState(TABS[0].key)
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const current = TABS.find((tab) => tab.key === active) ?? TABS[0]

  function focusTabAt(index: number) {
    const target = TABS[(index + TABS.length) % TABS.length]
    if (!target) return
    setActive(target.key)
    tabRefs.current[target.key]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        focusTabAt(index + 1)
        break
      case "ArrowLeft":
        event.preventDefault()
        focusTabAt(index - 1)
        break
      case "Home":
        event.preventDefault()
        focusTabAt(0)
        break
      case "End":
        event.preventDefault()
        focusTabAt(TABS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Scenario categories" className="flex flex-wrap gap-2">
        {TABS.map((tab, index) => {
          const selected = tab.key === current.key
          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[tab.key] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                selected
                  ? "border-[#FF8F00]/50 bg-[#FF8F00]/15 text-[#B45309]"
                  : "border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground",
                FOCUS_RING,
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${baseId}-panel-${tab.key}`}
          aria-labelledby={`${baseId}-tab-${tab.key}`}
          hidden={tab.key !== current.key}
          tabIndex={0}
          className={cn("mt-8 rounded-lg", FOCUS_RING)}
        >
          {tab.key === current.key ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tab.scenarios.map((scenario, index) => (
                <ScenarioCard key={scenario.title} scenario={scenario} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ScenarioGrid() {
  return (
    <section id="use-cases" aria-labelledby="scenarios-heading" className="border-y border-border bg-background py-24 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/40 bg-[#FFC107]/15 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#0F172A] uppercase">
            Real-world impact
          </span>
          <h2 id="scenarios-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-[#0F172A] sm:text-4xl">
            Designed for where communication matters most.
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/70">
            Twelve everyday environments where a missing interpreter shouldn&apos;t mean a missed
            conversation. Filter by category or browse all of them at once.
          </p>
        </motion.div>

        <div className="mt-12">
          <ScenarioTabs />
        </div>
      </Container>
    </section>
  )
}
