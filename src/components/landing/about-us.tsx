"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Accessibility,
  Building2,
  Compass,
  Cpu,
  Globe2,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Target,
  WifiOff,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import {
  Reveal,
  staggerContainer,
  staggerItem,
  PopEyebrow,
  GlassPanel,
  GlowOrb,
  AnimatedNumber,
  focusRingPop,
  popMotionProps,
} from "./ui/pop"

const CORE_VALUES = [
  {
    icon: Accessibility,
    title: "Accessibility-First",
    description: "Every design decision starts from how a Deaf or Hard of Hearing user will experience it — not as an afterthought bolted onto a hearing-first product.",
  },
  {
    icon: ShieldCheck,
    title: "Patient Safety",
    description: "In clinical settings a mistranslation isn't a UX bug, it's a safety risk. Output is built to be unambiguous, especially for medical and emergency phrasing.",
  },
  {
    icon: Globe2,
    title: "Cultural Intelligence",
    description: "Sign languages are full languages with their own grammar and regional variation, developed alongside Deaf linguists and interpreters, not translated word-for-word from English.",
  },
  {
    icon: Cpu,
    title: "Technical Precision",
    description: "Real-time performance and translation accuracy are treated as one requirement, not a trade-off — because a delayed or wrong sign is a missed conversation.",
  },
] as const

type TeamMember = { name: string; role: string; note: string }

const TEAM_GROUPS: { heading: string; members: TeamMember[] }[] = [
  {
    heading: "Leadership",
    members: [
      { name: "Jordan Ellis", role: "Co-Founder & CEO", note: "Former healthcare accessibility consultant." },
      { name: "Priya Nandakumar", role: "Co-Founder & Head of Product", note: "10 years building assistive communication tools." },
    ],
  },
  {
    heading: "Engineering",
    members: [
      { name: "Sam Okafor", role: "Lead ML Engineer", note: "Real-time speech and sign recognition models." },
      { name: "Diego Alvarez", role: "Frontend Engineering Lead", note: "Accessible interfaces and product architecture." },
    ],
  },
  {
    heading: "Accessibility Advisors",
    members: [
      { name: "Marisol Vega", role: "Deaf Community Advisor, CDI", note: "Certified Deaf Interpreter guiding sign accuracy." },
      { name: "Theo Whitfield", role: "Clinical Accessibility Consultant", note: "Advises on hospital and emergency-care workflows." },
    ],
  },
]

const FUTURE_GOALS = [
  {
    icon: Languages,
    title: "Multi-dialect expansion",
    timeframe: "2026 Q4",
    description: "Support for regional sign variation and additional national sign languages beyond the current core language pack.",
  },
  {
    icon: Building2,
    title: "Broader enterprise integration",
    timeframe: "2027",
    description: "SSO, EHR/clinical system connectors, and team analytics so hospitals and agencies can deploy at department scale.",
  },
  {
    icon: WifiOff,
    title: "Offline-first accessibility",
    timeframe: "Ongoing",
    description: "On-device processing so translation keeps working in low-connectivity clinics, classrooms, and rural service centers.",
  },
] as const

const ABOUT_TABS = [
  { value: "mission", label: "Mission" },
  { value: "vision", label: "Vision" },
  { value: "values", label: "Core Values" },
  { value: "team", label: "Our Team" },
  { value: "future", label: "Future Goals" },
] as const

type AboutTabValue = (typeof ABOUT_TABS)[number]["value"]

function TeamAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background" aria-hidden="true">
      {initials}
    </div>
  )
}

function MissionPanel() {
  return (
    <article aria-label="Mission">
      <GlassPanel glow className="p-6 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <IconBadge icon={Target} variant="solid" />
          <div>
            <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">Our mission</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Bridge the communication gap for Deaf and Hard of Hearing individuals the moment it
              matters most — at a hospital intake desk, in an emergency room, at a service counter —
              by turning spoken language into clear, real-time sign output. No scheduling an
              interpreter, no waiting: the translation is there when the conversation happens.
            </p>
          </div>
        </div>
      </GlassPanel>
    </article>
  )
}

function VisionPanel() {
  return (
    <article aria-label="Vision">
      <GlassPanel glow className="p-6 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <IconBadge icon={Compass} variant="solid" />
          <div>
            <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">Our vision</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              A world where medical and social communication barriers are no longer something Deaf
              and Hard of Hearing people have to plan around. We see Deafference as infrastructure —
              as ordinary and dependable as captioning or a wheelchair ramp — available everywhere a
              spoken conversation can happen.
            </p>
          </div>
        </div>
      </GlassPanel>
    </article>
  )
}

function ValuesPanel() {
  return (
    <article aria-label="Core values">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {CORE_VALUES.map((value) => {
          const Icon = value.icon
          return (
            <motion.div key={value.title} variants={staggerItem}>
              <GlassPanel tilt glow className="h-full p-6">
                <IconBadge icon={Icon} />
                <h3 className="mt-5 text-lg font-semibold text-brand-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.description}</p>
              </GlassPanel>
            </motion.div>
          )
        })}
      </motion.div>
    </article>
  )
}

function TeamPanel() {
  return (
    <article aria-label="Our team">
      <div className="relative pl-8 sm:pl-10">
        <div
          className="absolute top-2 bottom-2 left-[11px] w-px bg-gradient-to-b from-[color:var(--primary)]/45 via-[color:var(--primary)]/15 to-transparent sm:left-[15px]"
          aria-hidden="true"
        />
        <div className="space-y-10">
          {TEAM_GROUPS.map((group, groupIndex) => (
            <Reveal key={group.heading} delay={groupIndex * 0.08} className="relative">
              <span
                className="pop-pulse absolute top-1 -left-8 size-[11px] rounded-full bg-[color:var(--primary)] sm:-left-10"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold tracking-wide text-brand-navy uppercase">{group.heading}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {group.members.map((member) => (
                  <motion.li key={member.name} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <GlassPanel glow className="flex h-full items-start gap-4 p-5">
                      <TeamAvatar name={member.name} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                        <p className="text-xs font-medium text-brand-red">{member.role}</p>
                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{member.note}</p>
                      </div>
                    </GlassPanel>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  )
}

function FutureGoalsPanel() {
  return (
    <article aria-label="Future goals">
      <div className="relative pl-8 sm:pl-10">
        <div
          className="absolute top-2 bottom-2 left-[11px] w-px bg-gradient-to-b from-brand-orange/45 via-[color:var(--primary)]/20 to-transparent sm:left-[15px]"
          aria-hidden="true"
        />
        <ul className="space-y-5">
          {FUTURE_GOALS.map((goal, index) => {
            const Icon = goal.icon
            return (
              <motion.li key={goal.title} {...popMotionProps(index * 0.08)} className="relative list-none">
                <span
                  className="pop-pulse absolute top-6 -left-8 size-[11px] rounded-full bg-brand-orange sm:-left-10"
                  aria-hidden="true"
                />
                <GlassPanel tilt glow className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <IconBadge icon={Icon} size="compact" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{goal.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex w-fit shrink-0 items-center rounded-full border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/8 px-2.5 py-1 text-xs font-medium text-[color:var(--primary)]",
                      "sm:mt-0.5",
                    )}
                  >
                    {goal.timeframe}
                  </span>
                </GlassPanel>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

const ABOUT_PANELS: Record<AboutTabValue, ReactNode> = {
  mission: <MissionPanel />,
  vision: <VisionPanel />,
  values: <ValuesPanel />,
  team: <TeamPanel />,
  future: <FutureGoalsPanel />,
}

function AboutTabs() {
  const [active, setActive] = useState<AboutTabValue>("mission")
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function focusTabAt(index: number) {
    const target = ABOUT_TABS[(index + ABOUT_TABS.length) % ABOUT_TABS.length]
    if (!target) return
    setActive(target.value)
    tabRefs.current[target.value]?.focus()
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
        focusTabAt(ABOUT_TABS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="About us subsections"
        className="glass-pop relative flex flex-wrap gap-1 rounded-full p-1.5"
      >
        {ABOUT_TABS.map((tab, index) => {
          const selected = tab.value === active
          return (
            <button
              key={tab.value}
              ref={(node) => {
                tabRefs.current[tab.value] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative z-10 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selected ? "text-white" : "text-muted-foreground hover:text-brand-navy",
                focusRingPop,
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="about-tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3b82f6] shadow-[0_10px_24px_-8px_rgba(37,99,235,0.55)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              ) : null}
              <span className="relative">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`${baseId}-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={focusRingPop}
          >
            {ABOUT_PANELS[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function AboutUs() {
  const teamCount = TEAM_GROUPS.reduce((total, group) => total + group.members.length, 0)

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-32 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="bottom-0 -left-24 size-80 pop-float-delay" color="rgba(255,138,61,0.1)" />

      <Container>
        <SectionTitle
          headingId="about-heading"
          eyebrow="About us"
          title="A small team building the bridge between spoken and signed language"
          description="Deafference started from a simple observation: everyday spoken interactions still leave Deaf and hard-of-hearing people waiting on an interpreter who isn't always there. We're building the software that closes that gap."
        />

        <div className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7 lg:pt-4">
            <PopEyebrow>Our story</PopEyebrow>
            <p className="mt-5 max-w-xl text-base leading-8 text-pretty text-muted-foreground sm:text-lg">
              <span className="block text-2xl leading-snug font-semibold text-brand-navy sm:text-3xl">
                Deafference began after watching a routine clinic visit turn stressful for reasons
                that had nothing to do with the diagnosis:
              </span>
              <span className="mt-4 block">
                no interpreter was booked, the front desk defaulted to writing notes back and forth,
                and a five-minute check-in took forty. That gap — the everyday moments too small to
                schedule an interpreter for, but too important to get wrong — is what we set out to
                close.
              </span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              We started in healthcare and public-service settings because the stakes are highest
              there, then built the same real-time speech-to-sign pipeline to work anywhere a
              spoken conversation happens without a visual alternative on standby.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <GlassPanel glow tilt className="relative mx-auto max-w-sm p-6 sm:p-8 lg:mt-10 lg:ml-auto">
              <IconBadge icon={HeartHandshake} variant="solid" />
              <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                At a glance
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <AnimatedNumber value={CORE_VALUES.length} className="text-3xl font-bold text-brand-navy" />
                  <p className="mt-1 text-xs text-muted-foreground">Core values</p>
                </div>
                <div>
                  <AnimatedNumber value={teamCount} className="text-3xl font-bold text-brand-navy" />
                  <p className="mt-1 text-xs text-muted-foreground">Team members</p>
                </div>
                <div>
                  <AnimatedNumber value={FUTURE_GOALS.length} className="text-3xl font-bold text-brand-orange" />
                  <p className="mt-1 text-xs text-muted-foreground">Goals ahead</p>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 lg:mt-16">
          <AboutTabs />
        </Reveal>
      </Container>
    </section>
  )
}
