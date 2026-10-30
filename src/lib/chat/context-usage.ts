import type { LanguageModelUsage } from "ai"

import type { Model } from "@/lib/chat/model"

export type ConversationMetadata = {
  model: Model
  usage: LanguageModelUsage | null
  cost: number
}

export function getUsedTokens(usage: LanguageModelUsage | null | undefined) {
  return (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0)
}

export function getContextPercent(
  usage: LanguageModelUsage | null | undefined,
  contextWindow: number,
) {
  if (contextWindow <= 0) {
    return 0
  }

  return Math.min(100, Math.round((getUsedTokens(usage) / contextWindow) * 100))
}
