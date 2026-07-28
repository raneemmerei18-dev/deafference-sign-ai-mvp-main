"use client"

import { motion } from "framer-motion"
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
import { Card } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"

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

function PanelHeading({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <IconBadge icon={Icon} variant="solid" />
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
  )
}

function MissionPanel() {
  return (
    <article aria-label="Mission">
      <Card className="p-6 sm:p-8">
        <PanelHeading icon={Target} title="Our mission" />
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Bridge the communication gap for Deaf and Hard of Hearing individuals the moment it
          matters most — at a hospital intake desk, in an emergency room, at a service counter —
          by turning spoken language into clear, real-time sign output. No scheduling an
          interpreter, no waiting: the translation is there when the conversation happens.
        </p>
      </Card>
    </article>
  )
}

function VisionPanel() {
  return (
    <article aria-label="Vision">
      <Card className="p-6 sm:p-8">
        <PanelHeading icon={Compass} title="Our vision" />
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          A world where medical and social communication barriers are no longer something Deaf
          and Hard of Hearing people have to plan around. We see Deafference as infrastructure —
          as ordinary and dependable as captioning or a wheelchair ramp — available everywhere a
          spoken conversation can happen.
        </p>
      </Card>
    </article>
  )
}

function ValuesPanel() {
  return (
    <article aria-label="Core values">
      <div className="grid gap-4 sm:grid-cols-2">
        {CORE_VALUES.map((value) => {
          const Icon = value.icon
          return (
            <Card key={value.title} className="p-6">
              <IconBadge icon={Icon} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.description}</p>
            </Card>
          )
        })}
      </div>
    </article>
  )
}

function TeamPanel() {
  return (
    <article aria-label="Our team" className="space-y-6">
      {TEAM_GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="text-sm font-semibold text-foreground">{group.heading}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {group.members.map((member) => (
              <li key={member.name}>
                <Card className="flex items-start gap-4 p-5">
                  <TeamAvatar name={member.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs font-medium text-brand-red">{member.role}</p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{member.note}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </article>
  )
}

function FutureGoalsPanel() {
  return (
    <article aria-label="Future goals">
      <ul className="space-y-3">
        {FUTURE_GOALS.map((goal) => {
          const Icon = goal.icon
          return (
            <li key={goal.title}>
              <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <IconBadge icon={Icon} size="compact" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{goal.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex w-fit shrink-0 items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground",
                    "sm:mt-0.5",
                  )}
                >
                  {goal.timeframe}
                </span>
              </Card>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function AboutUs() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-28">
      <Container>
        <SectionTitle
          headingId="about-heading"
          eyebrow="About us"
          title="A small team building the bridge between spoken and signed language"
          description="Deafference started from a simple observation: everyday spoken interactions still leave Deaf and hard-of-hearing people waiting on an interpreter who isn't always there. We're building the software that closes that gap."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-12"
        >
          <Card className="p-6 sm:p-8">
            <PanelHeading icon={HeartHandshake} title="Our story" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Deafference began after watching a routine clinic visit turn stressful for reasons
              that had nothing to do with the diagnosis: no interpreter was booked, the front desk
              defaulted to writing notes back and forth, and a five-minute check-in took forty.
              That gap — the everyday moments too small to schedule an interpreter for, but too
              important to get wrong — is what we set out to close.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              We started in healthcare and public-service settings because the stakes are highest
              there, then built the same real-time speech-to-sign pipeline to work anywhere a
              spoken conversation happens without a visual alternative on standby.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-6"
        >
          <Tabs
            label="About us subsections"
            defaultValue="mission"
            tabs={[
              { value: "mission", label: "Mission", content: <MissionPanel /> },
              { value: "vision", label: "Vision", content: <VisionPanel /> },
              { value: "values", label: "Core Values", content: <ValuesPanel /> },
              { value: "team", label: "Our Team", content: <TeamPanel /> },
              { value: "future", label: "Future Goals", content: <FutureGoalsPanel /> },
            ]}
          />
        </motion.div>
      </Container>
    </section>
  )
}
