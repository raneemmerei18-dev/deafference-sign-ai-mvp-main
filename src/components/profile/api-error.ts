/** Error thrown by profile API calls. `status` is 0 when the request never reached the server. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/** fetch + JSON parse that throws `ApiError` (with the HTTP status and server `error` message) on failure. */
export async function requestJson<T = Record<string, unknown>>(input: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(input, init)
  } catch {
    throw new ApiError("Network error", 0)
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = typeof data?.error === "string" ? data.error : ""
    throw new ApiError(message, response.status)
  }
  return data as T
}

/** Translated message for errors that don't need a field-specific mapping. */
export function genericErrorMessage(error: unknown, messages: { generic: string; network: string }) {
  if (error instanceof ApiError && error.status === 0) return messages.network
  return messages.generic
}
