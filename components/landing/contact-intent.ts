import type { ContactTopic } from "@/lib/contact"

// Lets any CTA on the page ("Book a demo", a pricing plan) preselect the
// contact form's topic. The CTA stays a plain href="#contact" link, so it
// still scrolls to the form without JavaScript; this only adds the preset.
export const CONTACT_INTENT_EVENT = "deafference:contact-intent"

export interface ContactIntentDetail {
  topic: ContactTopic
}

export function requestContact(topic: ContactTopic) {
  window.dispatchEvent(new CustomEvent<ContactIntentDetail>(CONTACT_INTENT_EVENT, { detail: { topic } }))
}
