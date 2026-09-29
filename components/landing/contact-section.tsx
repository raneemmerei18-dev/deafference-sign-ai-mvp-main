"use client"

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import {
  CONTACT_FIELDS,
  CONTACT_MAX_LENGTHS,
  CONTACT_METHODS,
  CONTACT_TOPICS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactRequest,
} from "@/lib/contact"
import { CONTACT_EMAILS } from "@/lib/site-config"
import { CONTACT_INTENT_EVENT, type ContactIntentDetail } from "./contact-intent"
import { AlertIcon, CheckCircleIcon, HandshakeIcon, LifeBuoyIcon, MessageIcon, SendIcon } from "./icons"
import { SectionHeader } from "./section-header"
import styles from "./contact-section.module.css"

type Status = "idle" | "submitting" | "success" | "error"

const EMPTY_FORM: ContactRequest = {
  name: "",
  email: "",
  organization: "",
  topic: "",
  contactMethod: "email",
  message: "",
}

const CHANNELS = [
  { id: "general", email: CONTACT_EMAILS.general, Icon: MessageIcon },
  { id: "partners", email: CONTACT_EMAILS.partners, Icon: HandshakeIcon },
  { id: "support", email: CONTACT_EMAILS.support, Icon: LifeBuoyIcon },
] as const

export function ContactSection() {
  const { dict } = useLanguage()
  const t = dict.contact

  const [values, setValues] = useState<ContactRequest>(EMPTY_FORM)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [showSummary, setShowSummary] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [isOffline, setIsOffline] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)

  // A "Book a demo" / plan CTA elsewhere on the page preselects the topic and
  // moves focus into the form once the anchor scroll has started.
  useEffect(() => {
    const handleIntent = (event: Event) => {
      const { topic } = (event as CustomEvent<ContactIntentDetail>).detail
      setStatus((current) => (current === "success" ? "idle" : current))
      setValues((current) => ({ ...current, topic }))
      setErrors((current) => ({ ...current, topic: undefined }))
      window.setTimeout(() => {
        formRef.current?.querySelector<HTMLInputElement>("#contact-name")?.focus({ preventScroll: true })
      }, 0)
    }
    window.addEventListener(CONTACT_INTENT_EVENT, handleIntent)
    return () => window.removeEventListener(CONTACT_INTENT_EVENT, handleIntent)
  }, [])

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus()
  }, [status])

  const updateField = (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    // Re-validate a field live only once it has been flagged, so errors clear
    // as the user fixes them without nagging while they first type.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateContact(next)[field] }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting") return

    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    const firstInvalid = CONTACT_FIELDS.find((field) => nextErrors[field])
    if (firstInvalid) {
      setShowSummary(true)
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }
    setShowSummary(false)

    if (!navigator.onLine) {
      setIsOffline(true)
      setStatus("error")
      return
    }

    setIsOffline(false)
    setStatus("submitting")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypotRef.current?.value ?? "" }),
      })
      if (!response.ok) throw new Error(`Contact request failed with ${response.status}`)
      setValues(EMPTY_FORM)
      setStatus("success")
    } catch {
      setIsOffline(!navigator.onLine)
      setStatus("error")
    }
  }

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    "data-field": field,
    value: values[field],
    onChange: updateField(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  })

  const errorText = (field: ContactField) =>
    errors[field] ? (
      <p id={`contact-${field}-error`} className={styles.fieldError}>
        {t.errors[errors[field]!]}
      </p>
    ) : null

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader id="contact-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className={styles.layout}>
          <div className={styles.formCard}>
            {status === "success" ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon}>
                  <CheckCircleIcon size={28} />
                </span>
                <h3 ref={successHeadingRef} tabIndex={-1} className={styles.successTitle}>
                  {t.successTitle}
                </h3>
                <p className={styles.successBody}>{t.successBody}</p>
                <button type="button" className="btn btn-secondary" onClick={() => setStatus("idle")}>
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
                {showSummary && Object.values(errors).some(Boolean) ? (
                  <p className={styles.alert} role="alert">
                    <AlertIcon size={18} />
                    {t.errors.summary}
                  </p>
                ) : null}

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="contact-name" className={styles.label}>
                      {t.fields.name}
                    </label>
                    <input
                      {...fieldProps("name")}
                      className={styles.input}
                      type="text"
                      autoComplete="name"
                      maxLength={CONTACT_MAX_LENGTHS.name}
                      required
                    />
                    {errorText("name")}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-email" className={styles.label}>
                      {t.fields.email}
                    </label>
                    <input
                      {...fieldProps("email")}
                      className={styles.input}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      dir="ltr"
                      maxLength={CONTACT_MAX_LENGTHS.email}
                      required
                    />
                    {errorText("email")}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="contact-organization" className={styles.label}>
                      {t.fields.organization} <span className={styles.optional}>{t.optional}</span>
                    </label>
                    <input
                      {...fieldProps("organization")}
                      className={styles.input}
                      type="text"
                      autoComplete="organization"
                      maxLength={CONTACT_MAX_LENGTHS.organization}
                    />
                    {errorText("organization")}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-topic" className={styles.label}>
                      {t.fields.topic}
                    </label>
                    <select {...fieldProps("topic")} className={styles.input} required>
                      <option value="" disabled>
                        {t.topicPlaceholder}
                      </option>
                      {CONTACT_TOPICS.map((topic) => (
                        <option key={topic} value={topic}>
                          {t.topics[topic]}
                        </option>
                      ))}
                    </select>
                    {errorText("topic")}
                  </div>
                </div>

                <fieldset
                  className={styles.fieldset}
                  aria-invalid={errors.contactMethod ? true : undefined}
                  aria-describedby={errors.contactMethod ? "contact-contactMethod-error" : undefined}
                >
                  <legend className={styles.label}>{t.fields.contactMethod}</legend>
                  <div className={styles.radioGroup}>
                    {CONTACT_METHODS.map((method, index) => (
                      <label key={method} className={styles.radioOption}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={values.contactMethod === method}
                          onChange={updateField("contactMethod")}
                          data-field={index === 0 ? "contactMethod" : undefined}
                        />
                        <span>{t.methods[method]}</span>
                      </label>
                    ))}
                  </div>
                  {errorText("contactMethod")}
                </fieldset>

                <div className={styles.field}>
                  <label htmlFor="contact-message" className={styles.label}>
                    {t.fields.message}
                  </label>
                  <textarea
                    {...fieldProps("message")}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder={t.messagePlaceholder}
                    maxLength={CONTACT_MAX_LENGTHS.message}
                    rows={5}
                    required
                  />
                  {errorText("message")}
                </div>

                {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input ref={honeypotRef} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {status === "error" ? (
                  <p className={styles.alert} role="alert">
                    <AlertIcon size={18} />
                    <span>
                      {isOffline ? t.errorOffline : t.errorGeneric}{" "}
                      <a href={`mailto:${CONTACT_EMAILS.general}`}>
                        <bdi>{CONTACT_EMAILS.general}</bdi>
                      </a>
                    </span>
                  </p>
                ) : null}

                <div className={styles.submitRow}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={status === "submitting"}>
                    <SendIcon size={18} className="icon-flip-rtl" />
                    {status === "submitting" ? t.submitting : t.submit}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className={styles.channels} aria-labelledby="contact-channels-title">
            <h3 id="contact-channels-title" className={styles.channelsTitle}>
              {t.channelsTitle}
            </h3>
            <ul className={styles.channelList}>
              {CHANNELS.map(({ id, email, Icon }) => (
                <li key={id} className={styles.channel}>
                  <span className={styles.channelIcon}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className={styles.channelTitle}>{t.channels[id].title}</p>
                    <p className={styles.channelDescription}>{t.channels[id].description}</p>
                    <a href={`mailto:${email}`} className={styles.channelLink}>
                      <bdi>{email}</bdi>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
