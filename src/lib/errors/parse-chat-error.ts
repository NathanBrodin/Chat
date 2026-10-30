import { parseError } from "evlog"

/**
 * The AI SDK transport hands HTTP failures over as an `APICallError` whose
 * `responseBody` is the raw JSON error envelope, and mid-stream failures as an
 * `Error` whose message is the envelope written by the route's `onError`.
 * `parseError()` expects the decoded body, so unwrap the JSON first and fall
 * back to the original error for anything else (network failures, aborts).
 */
export function parseChatError(error: unknown) {
  const responseBody =
    error && typeof error === "object" && "responseBody" in error ? error.responseBody : undefined
  const text =
    typeof responseBody === "string"
      ? responseBody
      : error instanceof Error
        ? error.message
        : undefined

  if (text?.startsWith("{")) {
    try {
      return parseError(JSON.parse(text))
    } catch {
      // The body is not JSON; parse the original error instead.
    }
  }

  return parseError(error)
}
