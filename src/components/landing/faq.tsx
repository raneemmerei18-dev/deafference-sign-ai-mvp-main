"use client"

import { motion } from "framer-motion"
import { Accordion } from "@/components/ui/accordion"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { FAQ_ITEMS } from "@/lib/constants"

export function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 sm:py-28"
      data-mira-zone="0.6"
      data-mira-mood="think"
      data-mira-line="Got questions? I've got answers."
    >
      <Container>
        <SectionTitle
          eyebrow="FAQ"
          title="Common questions, answered simply"
          description="The goal is to make the product story easy to understand before the rest of the platform is built out."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-12"
        >
          <Accordion items={[...FAQ_ITEMS]} />
        </motion.div>
      </Container>
    </section>
  )
}
