import { Building2, Mail, MessageSquareWarning, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { IconBadge } from "@/components/shared/icon-badge"
import type { useAdminData } from "@/hooks/useAdminData"

type AdminStats = ReturnType<typeof useAdminData>["stats"]

export function SystemOverview({ stats }: { stats: AdminStats }) {
  const metrics = [
    { label: "Total Registered Users", value: stats.totalUsers, icon: Users },
    { label: "Active B2B Subscriptions", value: stats.activeB2BSubscriptions, icon: Building2 },
    { label: "Unread Feedback", value: stats.unreadFeedback, icon: MessageSquareWarning },
    { label: "Pending Contact Inquiries", value: stats.pendingContactInquiries, icon: Mail },
  ]

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        A snapshot of platform activity, derived live from the users, feedback, and contact records in the other
        sections.
      </p>

      <div role="group" aria-label="System overview metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="flex items-center gap-4">
            <IconBadge icon={metric.icon} />
            <div>
              <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
