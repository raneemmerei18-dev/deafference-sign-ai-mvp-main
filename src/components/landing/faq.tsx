"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { FAQ_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { GlassPanel, GlowOrb, focusRingPop, staggerContainer, staggerItem } from "./ui/pop"

function FaqItem({ title, content }: { title: string; content: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <motion.div variants={staggerItem}>
      <GlassPanel
        className={cn(
          "overflow-hidden transition-shadow duration-300",
          open && "shadow-[var(--pop-glow)]",
        )}
      >
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5",
              focusRingPop,
            )}
          >
            <span className={cn("text-sm font-medium text-foreground sm:text-base", open && "text-primary")}>
              {title}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/8 text-primary transition-all duration-300",
                open && "rotate-180 bg-[color:var(--primary)]/16",
              )}
            >
              <ChevronDown className="size-4" />
            </span>
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="content"
              id={panelId}
              role="region"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.25, ease: "easeInOut" } }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6 sm:pb-6">{content}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <GlowOrb className="pop-float left-[-10%] top-4 size-72" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="pop-float-delay right-[-8%] bottom-6 size-80" color="rgba(167,180,255,0.2)" />

      <Container className="relative">
        <SectionTitle
          eyebrow="FAQ"
          title="Common questions, answered simply"
          description="The goal is to make the product story easy to understand before the rest of the platform is built out."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 space-y-4"
        >
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.title} title={item.title} content={item.content} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
