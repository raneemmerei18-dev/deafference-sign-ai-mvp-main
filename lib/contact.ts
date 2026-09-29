import { EMAIL_PATTERN } from "@/lib/validation"

export const CONTACT_TOPICS = ["demo", "sales", "support", "partnership", "general"] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export const CONTACT_METHODS = ["email", "video", "text"] as const
export type ContactMethod = (typeof CONTACT_METHODS)[number]

export const MIN_MESSAGE_LENGTH = 10

export const CONTACT_MAX_LENGTHS = {
  name: 120,
  email: 254,
  organization: 160,
  message: 5000,
} as const

export interface ContactRequest {
  name: string
  email: string
  organization: string
  topic: ContactTopic | ""
  contactMethod: ContactMethod | ""
  message: string
}

export type ContactField = keyof ContactRequest
export type ContactErrorCode = "required" | "email" | "messageShort" | "tooLong"
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>

// Field order matters: the form focuses the first invalid field.
export const CONTACT_FIELDS: ContactField[] = ["name", "email", "organization", "topic", "contactMethod", "message"]

/** Shared by the form and the API route so both enforce the same rules. */
export function validateContact(input: ContactRequest): ContactErrors {
  const errors: ContactErrors = {}
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (!name) errors.name = "required"
  else if (name.length > CONTACT_MAX_LENGTHS.name) errors.name = "tooLong"

  if (!email) errors.email = "required"
  else if (email.length > CONTACT_MAX_LENGTHS.email) errors.email = "tooLong"
  else if (!EMAIL_PATTERN.test(email)) errors.email = "email"

  if (input.organization.trim().length > CONTACT_MAX_LENGTHS.organization) errors.organization = "tooLong"

  if (!CONTACT_TOPICS.includes(input.topic as ContactTopic)) errors.topic = "required"
  if (!CONTACT_METHODS.includes(input.contactMethod as ContactMethod)) errors.contactMethod = "required"

  if (!message) errors.message = "required"
  else if (message.length < MIN_MESSAGE_LENGTH) errors.message = "messageShort"
  else if (message.length > CONTACT_MAX_LENGTHS.message) errors.message = "tooLong"

  return errors
}

/** Coerces an untrusted JSON body into the ContactRequest shape. */
export function normalizeContact(body: Record<string, unknown>): ContactRequest {
  const text = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "")
  const topic = text("topic")
  const contactMethod = text("contactMethod")

  return {
    name: text("name"),
    email: text("email").toLowerCase(),
    organization: text("organization"),
    topic: CONTACT_TOPICS.includes(topic as ContactTopic) ? (topic as ContactTopic) : "",
    contactMethod: CONTACT_METHODS.includes(contactMethod as ContactMethod) ? (contactMethod as ContactMethod) : "",
    message: text("message"),
  }
}
