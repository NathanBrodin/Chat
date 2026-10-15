"use client"

import {
  type ChatMessagePart,
  type ChatUIMessage,
  type TextMessagePart,
} from "@/tools"
import { MessageActions } from "@/components/message-actions"
import { AskUserPart } from "@/components/parts/ask-user-part"
import { GithubRepoPart } from "@/components/parts/github-repo-part"
import { ReasoningPart } from "@/components/parts/reasoning-part"
import { SourcesPart } from "@/components/parts/sources-part"
import { TextPart } from "@/components/parts/text-part"
import { WebSearchPart } from "@/components/parts/web-search-part"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import { Trace } from "@/components/ui/trace"

type StepPart = Extract<
  ChatMessagePart,
  {
    type: "reasoning" | "tool-github_repo" | "tool-ask_user" | "tool-web_search"
  }
>

export function ChatMessage({
  message,
  isStreaming = false,
  onRetry,
}: {
  message: ChatUIMessage
  isStreaming?: boolean
  onRetry?: () => void
}) {
  if (message.role === "user") {
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              {message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  const blocks = groupParts(message.parts)
  const reasoningParts = message.parts.filter(
    (part) => part.type === "reasoning"
  )
  const text = blocks
    .flatMap((block) => (Array.isArray(block) ? [] : block.text))
    .join("\n\n")

  return (
    <Message align="start">
      <MessageContent>
        {blocks.map((block, index) =>
          Array.isArray(block) ? (
            <Trace key={index}>
              {block.map((part, partIndex) => {
                switch (part.type) {
                  case "reasoning":
                    return (
                      <ReasoningPart
                        key={partIndex}
                        part={part}
                        isStreaming={isStreaming}
                        duration={
                          message.metadata?.reasoningDurations?.[
                            reasoningParts.indexOf(part)
                          ]
                        }
                      />
                    )
                  case "tool-github_repo":
                    return (
                      <GithubRepoPart
                        key={part.toolCallId}
                        part={part}
                        isStreaming={isStreaming}
                      />
                    )
                  case "tool-ask_user":
                    return <AskUserPart key={part.toolCallId} part={part} />
                  case "tool-web_search":
                    return (
                      <WebSearchPart
                        key={part.toolCallId}
                        part={part}
                        isStreaming={isStreaming}
                      />
                    )
                }
              })}
            </Trace>
          ) : (
            <TextPart key={index} part={block} />
          )
        )}
        {!isStreaming && <SourcesPart parts={message.parts} />}
        {!isStreaming && text && (
          <MessageActions text={text} onRetry={onRetry} />
        )}
      </MessageContent>
    </Message>
  )
}

// Text splits the steps into runs, and each run of steps gets its own Trace.
function groupParts(parts: ChatMessagePart[]) {
  return mergeTextParts(parts).reduce<(TextMessagePart | StepPart[])[]>(
    (blocks, part) => {
      if (part.type === "text") {
        if (part.text.trim()) {
          blocks.push(part)
        }
        return blocks
      }

      if (!isStepPart(part)) {
        return blocks
      }

      const last = blocks.at(-1)
      if (Array.isArray(last)) {
        last.push(part)
      } else {
        blocks.push([part])
      }
      return blocks
    },
    []
  )
}

function isStepPart(part: ChatMessagePart): part is StepPart {
  // An unanswered question shows in the QuestionCard, not in the Trace.
  if (part.type === "tool-ask_user") {
    return part.state === "output-available"
  }

  return (
    part.type === "reasoning" ||
    part.type === "tool-github_repo" ||
    part.type === "tool-web_search"
  )
}

// Web search replies stream one text part per citation, so join them back
// into one markdown document.
function mergeTextParts(parts: ChatMessagePart[]) {
  return parts
    .filter((part) => part.type !== "source-url")
    .reduce<ChatMessagePart[]>((merged, part) => {
      const last = merged.at(-1)
      if (part.type === "text" && last?.type === "text") {
        merged[merged.length - 1] = { ...part, text: last.text + part.text }
        return merged
      }
      merged.push(part)
      return merged
    }, [])
}
