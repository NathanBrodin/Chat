import { type InferUITools, type LanguageModelUsage, type UIDataTypes, type UIMessage } from "ai"

import type { Model } from "@/lib/chat/model"

import { askUser } from "./ask_user"
import { githubRepo } from "./github_repo"
import { webFetch } from "./web_fetch"
import { getWebSearch } from "./web_search"

const baseTools = {
  github_repo: githubRepo,
  ask_user: askUser,
  web_fetch: webFetch,
}

export function getTools() {
  return { ...baseTools, web_search: getWebSearch() }
}

export type ChatMessageMetadata = {
  // Milliseconds per reasoning part, keyed by its index in the message.
  reasoningDurations?: Record<number, number>
  // Usage of the final model call, which reflects the context window pressure.
  usage?: LanguageModelUsage
  // Snapshot of the model that generated the response.
  model?: Model
  // Accumulated cost reported by OpenRouter for the response, in USD.
  cost?: number
}

export type ChatUIMessage = UIMessage<
  ChatMessageMetadata,
  UIDataTypes,
  InferUITools<typeof baseTools> & {
    web_search: {
      input: { query?: string }
      output: unknown
    }
  }
>

export type ChatMessagePart = ChatUIMessage["parts"][number]

export type TextMessagePart = Extract<ChatMessagePart, { type: "text" }>

export type ReasoningMessagePart = Extract<ChatMessagePart, { type: "reasoning" }>

export type SourceUrlPart = Extract<ChatMessagePart, { type: "source-url" }>

export type GithubRepoToolPart = Extract<ChatMessagePart, { type: "tool-github_repo" }>

export type AskUserToolPart = Extract<ChatMessagePart, { type: "tool-ask_user" }>

export type WebSearchToolPart = Extract<ChatMessagePart, { type: "tool-web_search" }>

export type WebFetchToolPart = Extract<ChatMessagePart, { type: "tool-web_fetch" }>
