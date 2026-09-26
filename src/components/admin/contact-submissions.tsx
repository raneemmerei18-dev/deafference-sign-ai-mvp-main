"use client"

import { useId, useState } from "react"
import { Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { cn, formatDate } from "@/lib/utils"
import type { ContactSubmission } from "@/lib/mock-admin-data"
import { EmptyState } from "./empty-state"

export interface ContactSubmissionsProps {
  contacts: ContactSubmission[]
  onMarkRead: (id: string, read: boolean) => void
  onDelete: (id: string) => void
}

export function ContactSubmissions({ contacts, onMarkRead, onDelete }: ContactSubmissionsProps) {
  const idPrefix = useId()
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null)
  const [pendingDeleteContact, setPendingDeleteContact] = useState<ContactSubmission | null>(null)

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Contact Submissions
        </h2>

        {contacts.length === 0 ? (
          <EmptyState icon={Mail} title="No contact submissions found" />
        ) : (
          <ul className="flex flex-col gap-4">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <article
                  aria-labelledby={`${idPrefix}-${contact.id}-subject`}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border border-border border-l-4 p-4",
                    contact.read ? "border-l-transparent" : "border-l-primary",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 id={`${idPrefix}-${contact.id}-subject`} className="font-medium text-foreground">
                        {contact.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.name}
                        {contact.organization ? ` · ${contact.organization}` : ""} ·{" "}
                        <a href={`mailto:${contact.email}`} className="underline-offset-2 hover:underline">
                          {contact.email}
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!contact.read ? <Badge className="border-primary/30 bg-primary/10 text-primary">Unread</Badge> : null}
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(contact.receivedDate)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground">{contact.message}</p>

                  <div className="flex flex-wrap gap-2">
                    {!contact.read ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => onMarkRead(contact.id, true)}>
                        Mark as Read
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={replyOpenId === contact.id}
                      aria-controls={`${idPrefix}-${contact.id}-reply`}
                      onClick={() => setReplyOpenId((current) => (current === contact.id ? null : contact.id))}
                    >
                      Reply Draft Placeholder
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDeleteContact(contact)}
                    >
                      Delete
                    </Button>
                  </div>

                  {replyOpenId === contact.id ? (
                    <div id={`${idPrefix}-${contact.id}-reply`} className="flex flex-col gap-2 border-t border-border pt-3">
                      <label htmlFor={`${idPrefix}-${contact.id}-reply-text`} className="text-sm font-medium">
                        Reply draft
                      </label>
                      <textarea
                        id={`${idPrefix}-${contact.id}-reply-text`}
                        rows={3}
                        placeholder="Type your reply…"
                        className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                      />
                      <Button type="button" size="sm" className="w-fit" disabled>
                        Send Reply
                      </Button>
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={pendingDeleteContact !== null}
        onOpenChange={(open) => !open && setPendingDeleteContact(null)}
        title="Delete this submission?"
        description={
          pendingDeleteContact
            ? `The message from ${pendingDeleteContact.name} will be permanently removed. This cannot be undone.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setPendingDeleteContact(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (pendingDeleteContact) onDelete(pendingDeleteContact.id)
              setPendingDeleteContact(null)
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}
