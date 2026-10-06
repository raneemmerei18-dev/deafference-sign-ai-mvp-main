import type { Metadata } from "next"
import { ForbiddenContent } from "@/components/auth/forbidden-content"

export const metadata: Metadata = {
  title: "403 — Forbidden",
  description: "You don't have permission to access this page.",
}

export default function ForbiddenPage() {
  return <ForbiddenContent />
}
