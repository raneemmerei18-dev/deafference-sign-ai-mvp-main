"use client"

import { useId, useState, type FormEvent, type ReactNode } from "react"
import { motion } from "framer-motion"
import { HeadphonesIcon, Mail, Send, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { GlassPanel, GlowOrb, Magnetic, Reveal, staggerContainer, staggerItem } from "./ui/pop"

const contactChannels = [
  {
    icon: Mail,
    title: "General inquiries",
    description: "Questions about the product or a demo walkthrough.",
    href: "mailto:hello@deafference.ai",
    label: "hello@deafference.ai",
  },
  {
    icon: Users,
    title: "Partnerships & sales",
    description: "Piloting Deafference across a clinic, campus, or agency.",
    href: "mailto:partners@deafference.ai",
    label: "partners@deafference.ai",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description: "Already using the app and need a hand.",
    href: "mailto:support@deafference.ai",
    label: "support@deafference.ai",
  },
]

/** Floating-label field: label shrinks/lifts and the border glows soft blue on focus or when filled. */
function FloatingField({
  id,
  label,
  value,
  children,
}: {
  id: string
  label: string
  value: string
  children: (props: { onFocus: () => void; onBlur: () => void }) => ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 z-10 origin-left transition-all duration-200 ease-out ${
          active
            ? "top-0 -translate-y-1/2 scale-75 bg-card px-1.5 text-[color:var(--primary)] font-semibold"
            : "top-1/2 -translate-y-1/2 scale-100 text-muted-foreground"
        }`}
      >
        {label}
      </label>
      <div
        className={`rounded-xl transition-shadow duration-200 ${
          focused ? "shadow-[0_0_0_3px_rgba(59,130,246,0.18)]" : ""
        }`}
      >
        {children({ onFocus: () => setFocused(true), onBlur: () => setFocused(false) })}
      </div>
    </div>
  )
}

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = encodeURIComponent(`Website inquiry from ${name || "a visitor"}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:hello@deafference.ai?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-y border-border/60 py-28 sm:py-32"
    >
      {/* Ambient ground + drifting orbs behind the whole workspace */}
      <div className="pop-atmosphere pop-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <GlowOrb className="pop-float top-[-6rem] left-[-4rem] size-72" color="rgba(59,130,246,0.22)" />
      <GlowOrb className="pop-float-delay right-[-5rem] bottom-[-4rem] size-80" color="rgba(167,180,255,0.24)" />
      <GlowOrb className="pop-float top-1/3 right-[8%] size-40" color="rgba(255,138,61,0.14)" />

      <Container className="relative">
        <SectionTitle
          eyebrow="Contact"
          title="Let's talk about your rollout"
          description="Tell us about your team or use case and we'll follow up with next steps, no matter how early you are."
        />

        <div className="relative mt-16 lg:min-h-[560px]">
          {/* Form: offset glass panel, asymmetric placement */}
          <Reveal className="relative z-10 lg:w-[62%]" y={26}>
            <GlassPanel glow className="p-6 sm:p-9">
              <span className="pop-orbit absolute top-6 right-6 hidden size-16 rounded-full border border-dashed border-[color:var(--primary)]/25 sm:block" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--primary)] uppercase">
                Start a conversation
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">Send us a message</h3>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FloatingField id={nameId} label="Name" value={name}>
                    {({ onFocus, onBlur }) => (
                      <Input
                        id={nameId}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                        className="h-12 border-transparent bg-background/70"
                      />
                    )}
                  </FloatingField>
                  <FloatingField id={emailId} label="Email" value={email}>
                    {({ onFocus, onBlur }) => (
                      <Input
                        id={emailId}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                        className="h-12 border-transparent bg-background/70"
                      />
                    )}
                  </FloatingField>
                </div>

                <FloatingField id={messageId} label="Message" value={message}>
                  {({ onFocus, onBlur }) => (
                    <Textarea
                      id={messageId}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                      className="min-h-32 border-transparent bg-background/70"
                    />
                  )}
                </FloatingField>

                <Magnetic className="mt-1 w-full sm:w-fit">
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full justify-center gap-2 rounded-xl bg-[color:var(--primary)] text-base text-primary-foreground shadow-[0_16px_40px_-14px_rgba(59,130,246,0.55)] hover:bg-[color:var(--primary)]/90 sm:w-fit sm:px-8"
                  >
                    <Send className="size-4" />
                    Send message
                  </Button>
                </Magnetic>
              </form>
            </GlassPanel>
          </Reveal>

          {/* Contact channels: floating cards scattered around the form */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 mt-6 grid gap-5 sm:grid-cols-2 lg:absolute lg:top-6 lg:right-0 lg:mt-0 lg:grid-cols-1 lg:w-[38%] lg:pl-8"
          >
            {contactChannels.map((channel, i) => {
              const Icon = channel.icon
              return (
                <motion.div
                  key={channel.title}
                  variants={staggerItem}
                  className={i === 1 ? "sm:translate-y-6 lg:translate-y-10" : i === 2 ? "sm:col-span-2 lg:translate-y-4" : ""}
                >
                  <GlassPanel className="p-5" tilt>
                    <div className="flex items-start gap-4">
                      <IconBadge icon={Icon} size="compact" />
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{channel.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{channel.description}</p>
                        <a
                          href={channel.href}
                          className="mt-2 inline-block text-sm font-medium text-[color:var(--primary)] transition-colors hover:text-brand-red"
                        >
                          {channel.label}
                        </a>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
