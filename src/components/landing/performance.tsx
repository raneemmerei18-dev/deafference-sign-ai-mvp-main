"use client"

import { motion } from "framer-motion"
import { Gauge, GitBranch, Percent, ShieldCheck, Timer, Zap } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { AnimatedNumber, GlassPanel, GlowOrb, staggerContainer, staggerItem } from "./ui/pop"

const metrics = [
  { value: "< 300ms", label: "to animate core UI transitions" },
  { value: "100%", label: "responsive layouts across breakpoints" },
  { value: "Zero coupling", label: "between landing and translation features" },
]

/** Per-metric visual accents, kept separate from `metrics` so the copy/data above stays verbatim. */
const metricMeta = [
  { icon: Timer, progress: 92 },
  { icon: Percent, progress: 100 },
  { icon: GitBranch, progress: 78 },
]

const features = [
  { icon: Gauge, title: "Lightweight", text: "Minimal overhead and deliberate surface area." },
  { icon: Zap, title: "Responsive", text: "Layouts adapt cleanly from mobile to desktop." },
  { icon: ShieldCheck, title: "Predictable", text: "Reusable primitives reduce visual drift." },
]

/** Splits a metric string like "< 300ms" or "100%" into an animatable number plus its
 * surrounding text, so figures can count up without altering the source copy. Returns
 * null for non-numeric metrics (e.g. "Zero coupling"), which render as plain text. */
function parseMetric(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/)
  if (!match || match.index === undefined) return null
  return {
    prefix: value.slice(0, match.index),
    number: Number(match[0]),
    suffix: value.slice(match.index + match[0].length),
  }
}

export function Performance() {
  return (
    <section
      id="performance"
      className="relative py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="pop-atmosphere absolute inset-0" />
        <div className="pop-grid absolute inset-0 opacity-40" />
        <GlowOrb className="left-[-8%] top-6 size-72" color="rgba(59,130,246,0.18)" />
        <GlowOrb className="right-[-6%] bottom-0 size-80" color="rgba(255,138,61,0.10)" />
      </div>

      <Container>
        <SectionTitle
          eyebrow="Performance"
          title="Fast to scan, fast to extend"
          description="The visual system aims for clarity first, while the architecture keeps runtime concerns simple and separated."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
          >
            {metrics.map((metric, index) => {
              const meta = metricMeta[index]
              const Icon = meta.icon
              const parsed = parseMetric(metric.value)

              return (
                <motion.div key={metric.label} variants={staggerItem}>
                  <GlassPanel
                    glow={index === 1}
                    className={cn(
                      "flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1",
                      index % 2 === 0 ? "pop-float" : "pop-float-delay",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <IconBadge icon={Icon} variant="solid" size="compact" />
                      <span className="size-1.5 rounded-full bg-brand-orange pop-pulse" aria-hidden="true" />
                    </div>

                    {parsed ? (
                      <p className="mt-4 text-3xl font-semibold tracking-tight">
                        <span className="pop-gradient-text">
                          {parsed.prefix}
                          <AnimatedNumber value={parsed.number} suffix={parsed.suffix} />
                        </span>
                      </p>
                    ) : (
                      <p className="mt-4 text-2xl font-semibold tracking-tight pop-gradient-text">{metric.value}</p>
                    )}

                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{metric.label}</p>

                    <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-[color:var(--primary)]/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-accent to-brand-orange"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${meta.progress}%` }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 * index }}
                      />
                      <motion.span
                        aria-hidden="true"
                        className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,138,61,0.65)]"
                        style={{ left: "0%" }}
                        animate={{ left: ["4%", `${meta.progress}%`, "4%"] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                      />
                    </div>
                  </GlassPanel>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          >
            <GlassPanel className="h-full p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {features.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-[color:var(--primary)]/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[color:var(--primary)]/8"
                    >
                      <IconBadge icon={Icon} variant="solid" size="compact" />
                      <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
