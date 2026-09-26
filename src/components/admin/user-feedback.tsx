"use client"

import { useMemo, useState, useId } from "react"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { FeedbackEntry, FeedbackStatus } from "@/lib/mock-admin-data"
import { EmptyState } from "./empty-state"
import { Pagination } from "./pagination"

const PAGE_SIZE = 5

export interface UserFeedbackProps {
  feedback: FeedbackEntry[]
  onUpdateStatus: (id: string, status: FeedbackStatus) => void
}

function statusBadgeClassName(status: FeedbackStatus) {
  switch (status) {
    case "New":
      return "border-accent-foreground/20 bg-accent text-accent-foreground"
    case "Reviewed":
      return "border-primary/30 bg-primary/10 text-primary"
    case "Archived":
      return "border-dashed text-muted-foreground"
    default:
      return ""
  }
}

export function UserFeedback({ feedback, onUpdateStatus }: UserFeedbackProps) {
  const idPrefix = useId()
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(feedback.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedFeedback = useMemo(
    () => feedback.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [feedback, currentPage],
  )

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          User Feedback
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="px-3 py-2">
                  ID
                </th>
                <th scope="col" className="px-3 py-2">
                  User / Email
                </th>
                <th scope="col" className="px-3 py-2">
                  Rating / Category
                </th>
                <th scope="col" className="px-3 py-2">
                  Feedback
                </th>
                <th scope="col" className="px-3 py-2">
                  Submitted
                </th>
                <th scope="col" className="px-3 py-2">
                  Status
                </th>
                <th scope="col" className="px-3 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedFeedback.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2">
                    <EmptyState icon={MessageSquare} title="No feedback entries found" />
                  </td>
                </tr>
              ) : (
                pagedFeedback.map((entry) => (
                  <tr key={entry.id} className="border-b border-border align-top last:border-0">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{entry.id}</td>
                    <td className="px-3 py-3 text-muted-foreground">{entry.userEmail}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge>{entry.category}</Badge>
                        {entry.rating !== null ? (
                          <span className="text-xs text-muted-foreground">{entry.rating}/5</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="max-w-xs px-3 py-3">
                      <p className="line-clamp-2 text-foreground">{entry.text}</p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(entry.submittedDate)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge className={statusBadgeClassName(entry.status)}>{entry.status}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          disabled={entry.status === "Reviewed"}
                          onClick={() => onUpdateStatus(entry.id, "Reviewed")}
                        >
                          Mark as Reviewed
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          disabled={entry.status === "Resolved"}
                          onClick={() => onUpdateStatus(entry.id, "Resolved")}
                        >
                          Resolve
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          disabled={entry.status === "Archived"}
                          onClick={() => onUpdateStatus(entry.id, "Archived")}
                        >
                          Archive
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </section>
    </Card>
  )
}
