"use client"

import { useMemo, useState } from "react"
import {
  MOCK_CONTACT_SUBMISSIONS,
  MOCK_FEEDBACK,
  MOCK_USERS,
  type AdminUser,
  type ContactSubmission,
  type FeedbackEntry,
  type FeedbackStatus,
  type UserRole,
} from "@/lib/mock-admin-data"

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS)
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(MOCK_FEEDBACK)
  const [contacts, setContacts] = useState<ContactSubmission[]>(MOCK_CONTACT_SUBMISSIONS)

  function updateUserRole(id: string, role: UserRole) {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)))
  }

  function toggleUserStatus(id: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user,
      ),
    )
  }

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  function updateFeedbackStatus(id: string, status: FeedbackStatus) {
    setFeedback((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)))
  }

  function markContactRead(id: string, read: boolean) {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, read } : contact)))
  }

  function deleteContact(id: string) {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeB2BSubscriptions: users.filter((user) => user.role === "Business" && user.status === "Active").length,
      unreadFeedback: feedback.filter((entry) => entry.status === "New").length,
      pendingContactInquiries: contacts.filter((contact) => !contact.read).length,
    }),
    [users, feedback, contacts],
  )

  return {
    users,
    feedback,
    contacts,
    stats,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    updateFeedbackStatus,
    markContactRead,
    deleteContact,
  }
}
