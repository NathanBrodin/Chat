import { parseError } from "evlog"

/**
 * Unwrap what the AI SDK chat transport hands us before `parseError()`.
 *
 * Non-2xx chat responses arrive as `APICallError`, whose `message` is the raw
 * response body text — our JSON-serialized `EvlogError`. Mid-stream failures
 * arrive as plain errors whose message is the JSON envelope written by the
 * route's `onError`. Recover the structured body first so callers can branch
 * on `code` and render `why` / `fix`; fall back to `parseError()` for
 * anything else (network failures, aborts, plain messages).
 */
export function parseChatError(error: unknown) {
  const record =
    error && typeof error === "object" ? (error as Record<string, unknown>) : undefined

  const text =
    typeof record?.responseBody === "string"
      ? record.responseBody
      : error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : undefined

  const body = parseErrorBody(text)
  if (body) {
    // The envelope may predate the transport status (stream payloads carry no
    // HTTP status), so let the transport's status fill the gap, if any.
    const statusCode = typeof record?.statusCode === "number" ? record.statusCode : undefined
    return parseError(
      statusCode !== undefined && body.status === undefined && body.statusCode === undefined
        ? { ...body, statusCode }
        : body,
    )
  }

  return parseError(error)
}

type ErrorBody = Record<string, unknown> & {
  status?: unknown
  statusCode?: unknown
}

/** Accept an EvlogError envelope or a flat `{ code, message, ... }` payload. */
function parseErrorBody(text: string | undefined): ErrorBody | undefined {
  if (!text || !text.startsWith("{")) {
    return undefined
  }

  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    return undefined
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined
  }

  const body = value as ErrorBody
  if (typeof body.message !== "string") {
    return undefined
  }

  if ("data" in body) {
    const data = body.data
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return undefined
    }
  } else if (typeof body.code !== "string") {
    return undefined
  }

  return body
}
