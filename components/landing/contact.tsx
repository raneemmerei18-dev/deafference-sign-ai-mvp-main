"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { HeadphonesIcon, Mail, Send, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"

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

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = encodeURIComponent(`Website inquiry from ${name || "a visitor"}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:hello@deafference.ai?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      className="border-y border-border/60 bg-muted/20 py-24 sm:py-28"
      data-mira-zone="0.3"
      data-mira-mood="listen"
      data-mira-line="Say hello — we're listening."
    >
      <Container>
        <SectionTitle
          eyebrow="Contact"
          title="Let's talk about your rollout"
          description="Tell us about your team or use case and we'll follow up with next steps, no matter how early you are."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      id="contact-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Lee"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us a bit about your team and what you're hoping to solve."
                    className="mt-2"
                  />
                </div>

                <Button type="submit" size="lg" className="mt-2 h-12 w-full justify-center gap-2 rounded-xl text-base sm:w-fit sm:px-8">
                  <Send className="size-4" />
                  Send message
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="grid gap-4"
          >
            {contactChannels.map((channel) => {
              const Icon = channel.icon
              return (
                <Card key={channel.title} className="p-5">
                  <div className="flex items-start gap-4">
                    <IconBadge icon={Icon} size="compact" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{channel.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{channel.description}</p>
                      <a
                        href={channel.href}
                        className="mt-2 inline-block text-sm font-medium text-foreground hover:text-brand-red"
                      >
                        {channel.label}
                      </a>
                    </div>
                  </div>
                </Card>
              )
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
