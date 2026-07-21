// lib/identity.ts
//
// Anonymous device identity (BE-7). See docs/IDENTITY.md for the
// architecture note. Distinct from the numeric demo User.id minted in
// lib/camera-permission-service.ts — this UUID is the device-level
// identifier attached to every outgoing request via the X-User-Id header.

const USER_ID_STORAGE_KEY = "deafference_user_id"

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateUserId can only run in the browser.")
  }

  const existing = window.localStorage.getItem(USER_ID_STORAGE_KEY)
  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  window.localStorage.setItem(USER_ID_STORAGE_KEY, id)
  return id
}
