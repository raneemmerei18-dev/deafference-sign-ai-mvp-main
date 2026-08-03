"use client"

import { useId, useMemo, useState } from "react"
import { Users as UsersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import type { AdminUser, UserRole, UserStatus } from "@/lib/mock-admin-data"
import { EmptyState } from "./empty-state"
import { Pagination } from "./pagination"

const PAGE_SIZE = 5
const ROLE_OPTIONS: UserRole[] = ["Admin", "Business", "Individual"]
const STATUS_OPTIONS: UserStatus[] = ["Active", "Suspended"]

export interface UsersManagementProps {
  users: AdminUser[]
  onUpdateRole: (id: string, role: UserRole) => void
  onToggleStatus: (id: string) => void
  onDeleteUser: (id: string) => void
}

function roleBadgeClassName(role: UserRole) {
  switch (role) {
    case "Admin":
      return "border-primary/30 bg-primary/10 text-primary"
    case "Business":
      return "border-accent-foreground/20 bg-accent text-accent-foreground"
    default:
      return ""
  }
}

function statusBadgeClassName(status: UserStatus) {
  return status === "Suspended" ? "border-destructive/30 bg-destructive/10 text-destructive" : ""
}

export function UsersManagement({ users, onUpdateRole, onToggleStatus, onDeleteUser }: UsersManagementProps) {
  const idPrefix = useId()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [pendingDeleteUser, setPendingDeleteUser] = useState<AdminUser | null>(null)
  const [page, setPage] = useState(1)

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const matchesTerm =
        term.length === 0 || user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      return matchesTerm && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value)
    setPage(1)
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Users Management
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor={`${idPrefix}-search`} className="sr-only">
              Search users by name or email
            </label>
            <Input
              id={`${idPrefix}-search`}
              type="search"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div>
              <label htmlFor={`${idPrefix}-role-filter`} className="sr-only">
                Filter by role
              </label>
              <Select
                id={`${idPrefix}-role-filter`}
                value={roleFilter}
                onChange={(event) => updateFilter(setRoleFilter, event.target.value as "all" | UserRole)}
              >
                <option value="all">All roles</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor={`${idPrefix}-status-filter`} className="sr-only">
                Filter by status
              </label>
              <Select
                id={`${idPrefix}-status-filter`}
                value={statusFilter}
                onChange={(event) => updateFilter(setStatusFilter, event.target.value as "all" | UserStatus)}
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="px-3 py-2">
                  User ID
                </th>
                <th scope="col" className="px-3 py-2">
                  Name
                </th>
                <th scope="col" className="px-3 py-2">
                  Email
                </th>
                <th scope="col" className="px-3 py-2">
                  Role
                </th>
                <th scope="col" className="px-3 py-2">
                  Status
                </th>
                <th scope="col" className="px-3 py-2">
                  Joined Date
                </th>
                <th scope="col" className="px-3 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2">
                    <EmptyState
                      icon={UsersIcon}
                      title="No users found"
                      description="Try adjusting your search term or filters."
                    />
                  </td>
                </tr>
              ) : (
                pagedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{user.id}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-3 py-3">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <label htmlFor={`${idPrefix}-role-${user.id}`} className="sr-only">
                            Role for {user.name}
                          </label>
                          <Select
                            id={`${idPrefix}-role-${user.id}`}
                            compact
                            defaultValue={user.role}
                            autoFocus
                            onChange={(event) => {
                              onUpdateRole(user.id, event.target.value as UserRole)
                              setEditingUserId(null)
                            }}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </Select>
                          <Button type="button" variant="ghost" size="xs" onClick={() => setEditingUserId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Badge className={roleBadgeClassName(user.role)}>{user.role}</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge className={statusBadgeClassName(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{formatDate(user.joinedDate)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="xs" onClick={() => setEditingUserId(user.id)}>
                          Edit Role
                        </Button>
                        <Button type="button" variant="outline" size="xs" onClick={() => onToggleStatus(user.id)}>
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="xs"
                          onClick={() => setPendingDeleteUser(user)}
                        >
                          Delete User
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

      <Dialog
        open={pendingDeleteUser !== null}
        onOpenChange={(open) => !open && setPendingDeleteUser(null)}
        title="Delete this user?"
        description={
          pendingDeleteUser
            ? `${pendingDeleteUser.name} (${pendingDeleteUser.email}) will be permanently removed. This cannot be undone.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setPendingDeleteUser(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (pendingDeleteUser) onDeleteUser(pendingDeleteUser.id)
              setPendingDeleteUser(null)
            }}
          >
            Delete User
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}
