import type { RequestLogger } from "evlog"
import { createError } from "evlog"
import { useRequest } from "nitro/context"

/** Returns the evlog logger attached to the current Nitro request. */
export function useLogger() {
  const log = useRequest().context?.log

  if (!log) {
    throw createError({
      code: "logger/not-initialized",
      message: "Logger is not available",
      status: 500,
      why: "useLogger was called outside a Nitro request",
      fix: "Call useLogger only inside server request work",
    })
  }

  return log as RequestLogger
}
