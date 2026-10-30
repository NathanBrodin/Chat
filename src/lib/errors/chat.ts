import { defineErrorCatalog } from "evlog"

export const chatErrors = defineErrorCatalog("chat", {
  RATE_LIMITED_BURST: {
    status: 429,
    message: ({ retryAfter }: { retryAfter: number }) =>
      `You're sending messages too quickly. Try again in ${retryAfter} seconds.`,
    why: "Burst limit of 5 requests per 30 seconds exceeded",
    fix: "Wait for the burst window to reset before retrying",
  },
  RATE_LIMITED_DAILY: {
    status: 429,
    message: "You've reached today's message limit. Try again later.",
    why: "Daily limit of 50 requests per 24 hours exceeded",
    fix: "Wait for the daily window to reset before retrying",
  },
  INVALID_JSON: {
    status: 400,
    message: "Your message couldn't be sent. Reload the page and try again.",
    why: "Request body is not valid JSON",
    fix: "Send a request body that parses as JSON",
  },
  INVALID_MESSAGES: {
    status: 422,
    message: "This conversation couldn't be loaded. Reload the page and start a new conversation.",
    why: "Message history failed AI SDK validation",
    fix: "Send messages that satisfy the ChatUIMessage schema",
  },
  INVALID_CHAT_ID: {
    status: 400,
    message: "This conversation couldn't be found. Reload the page and start a new conversation.",
    why: "The chat identifier is missing or malformed",
    fix: "Send a valid chat id",
  },
  STREAM_FAILED: {
    status: 500,
    message: "The response stopped before it finished. Try again.",
    why: "The model stream errored before completing",
    fix: "Check the request event for the underlying provider error",
  },
})

declare module "evlog" {
  interface RegisteredErrorCatalogs {
    chat: typeof chatErrors
  }
}
