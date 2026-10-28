import { defineErrorCatalog } from "evlog"

export const chatErrors = defineErrorCatalog("chat", {
  RATE_LIMITED_BURST: {
    status: 429,
    message: ({ retryAfter }: { retryAfter: number }) =>
      `Too many chat requests (retry in ${retryAfter}s)`,
    why: "Burst limit of 5 requests per 30 seconds exceeded",
    fix: "Wait a few seconds and try again",
  },
  RATE_LIMITED_DAILY: {
    status: 429,
    message: ({ retryAfter }: { retryAfter: number }) =>
      `Daily chat limit reached (retry in ${retryAfter}s)`,
    why: "Daily limit of 50 requests per 24 hours exceeded",
    fix: "Try again tomorrow",
  },
  INVALID_JSON: {
    status: 400,
    message: "Invalid chat request",
    why: "Request body is not valid JSON",
    fix: "Reload the page and try again",
  },
  INVALID_MESSAGES: {
    status: 422,
    message: "Invalid chat messages",
    why: "Message history failed AI SDK validation",
    fix: "Reload the page and start a new conversation",
  },
  INVALID_CHAT_ID: {
    status: 400,
    message: "Invalid chat request",
    why: "The chat identifier is missing or malformed",
    fix: "Reload the page and try again",
  },
  STREAM_FAILED: {
    status: 500,
    message: "Chat response failed",
    why: "The model stream errored before completing",
    fix: "Try again",
  },
})

declare module "evlog" {
  interface RegisteredErrorCatalogs {
    chat: typeof chatErrors
  }
}
