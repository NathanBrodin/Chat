import type { LanguageModelUsage } from "ai"

// Context window of the model hardcoded in src/routes/api/chat/route.ts
// (glm-flash: 128k). The AI SDK does not send it, so keep it in sync
// with the model.
export const CONTEXT_LIMIT = 131_072

export function getContextPercent(usage: LanguageModelUsage | null | undefined) {
  if (!usage) {
    return 0
  }

  const used = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0)
  return Math.min(100, Math.round((used / CONTEXT_LIMIT) * 100))
}
