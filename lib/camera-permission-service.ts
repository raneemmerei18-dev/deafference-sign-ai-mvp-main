// lib/camera-permission-service.ts
//
// Client-side service for persisting camera permission state to the backend
// (server/routes/cameraPermissionRoutes.ts, mounted at /api/users). Shapes
// here mirror server/types/camera-permission.ts and server/types/user.ts;
// duplicated rather than imported since the Express server and the Next.js
// app are separate build targets.

import { getOrCreateUserId } from "@/lib/identity"

export type CameraPermissionStatus = "granted" | "denied" | "prompted"

export interface CameraPermissionRecord {
  id: number
  userId: number
  status: CameraPermissionStatus
  createdAt: string
  updatedAt: string
}

interface ApiSuccess<T> {
  success: true
  data: T
}

interface ApiFailure {
  success: false
  error: { code: string; message: string }
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure

interface UserRecord {
  id: number
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "")

const DEMO_USER_ID_STORAGE_KEY = "deafference:cameraPermissionUserId"

function generateAnonId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// BE-7: every outgoing request identifies the calling device via this
// header, alongside the numeric demo userId already carried in the
// path/body below. See lib/identity.ts and docs/IDENTITY.md.
function withIdentityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return { ...headers, "X-User-Id": getOrCreateUserId() }
}

async function parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null
  if (!body) {
    return {
      success: false,
      error: { code: "PARSE_ERROR", message: `Received an unreadable response (HTTP ${res.status}).` },
    }
  }
  return body
}

/**
 * There is no auth/session layer in this app yet — CameraPermission rows
 * are keyed off a real User.id, so we lazily mint one anonymous user per
 * browser (cached in localStorage) and reuse it for every camera-permission
 * call. Swap this out once real auth lands.
 */
async function getOrCreateDemoUserId(): Promise<number> {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateDemoUserId can only run in the browser.")
  }

  const cached = window.localStorage.getItem(DEMO_USER_ID_STORAGE_KEY)
  if (cached) {
    const parsed = Number(cached)
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed
    }
  }

  const email = `anon-${generateAnonId()}@deafference.local`
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email }),
  })
  const body = await parseApiResponse<UserRecord>(res)
  if (!body.success) {
    throw new Error(`Failed to create demo user: ${body.error.code} ${body.error.message}`)
  }

  window.localStorage.setItem(DEMO_USER_ID_STORAGE_KEY, String(body.data.id))
  return body.data.id
}

/**
 * GET /api/users/camera-permission/:userId
 * Returns the persisted record, or null if none exists yet (HTTP 404).
 */
export async function fetchCameraPermission(userId: number): Promise<CameraPermissionRecord | null> {
  const res = await fetch(`${API_BASE_URL}/api/users/camera-permission/${userId}`, {
    method: "GET",
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
  })

  if (res.status === 404) {
    return null
  }

  const body = await parseApiResponse<CameraPermissionRecord>(res)
  if (!body.success) {
    throw new Error(`Failed to fetch camera permission: ${body.error.code} ${body.error.message}`)
  }
  return body.data
}

/**
 * POST /api/users/camera-permission
 * Upserts the permission record for the given user.
 */
export async function updateCameraPermission(
  userId: number,
  status: CameraPermissionStatus,
): Promise<CameraPermissionRecord> {
  const res = await fetch(`${API_BASE_URL}/api/users/camera-permission`, {
    method: "POST",
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ userId, status }),
  })

  const body = await parseApiResponse<CameraPermissionRecord>(res)
  if (!body.success) {
    throw new Error(`Failed to update camera permission: ${body.error.code} ${body.error.message}`)
  }
  return body.data
}

/**
 * Resolves the demo user id and fetches their persisted permission record
 * in one call — used by the camera view on initial mount.
 */
export async function loadPersistedCameraPermission(): Promise<{
  userId: number
  permission: CameraPermissionRecord | null
}> {
  const userId = await getOrCreateDemoUserId()
  const permission = await fetchCameraPermission(userId)
  return { userId, permission }
}
