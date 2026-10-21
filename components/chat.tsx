"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"

import { type ChatModel } from "@/lib/models"
import { type ChatUIMessage } from "@/tools"
import { ChatMessage } from "@/components/chat-message"
import { PromptForm } from "@/components/prompt-form"
import { QuestionCard } from "@/components/question-card"
import { StatusIcon } from "@/components/status-icon"
import { Suggestions } from "@/components/suggestions"
import { ChatConversation } from "@/components/chat/chat-conversation"
import { useChatScroll } from "@/components/chat/hooks/use-chat-scroll"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Message, MessageContent } from "@/components/ui/message"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export function Chat({ models }: { models: ChatModel[] }) {
  const [model, setModel] = React.useState(models[0]?.id ?? "")

  const {
    messages,
    sendMessage,
    regenerate,
    status,
    stop,
    error,
    addToolOutput,
  } = useChat<ChatUIMessage>({
    // Resume the conversation automatically once the user has answered the
    // ask_user questionnaire.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  const scroll = useChatScroll({ itemCount: messages.length })

  const resolvedModel = models.some((m) => m.id === model)
    ? model
    : (models[0]?.id ?? "")

  const isBusy = status === "submitted" || status === "streaming"

  const lastMessage = messages.at(-1)
  const pendingQuestion =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.find(
          (part): part is Extract<typeof part, { type: "tool-ask_user" }> =>
            part.type === "tool-ask_user" &&
            (part.state === "input-streaming" ||
              part.state === "input-available")
        )
      : undefined

  function handleSend(prompt: string) {
    scroll.resetScroll()
    sendMessage({ text: prompt }, { body: { model: resolvedModel } })
  }

  return (
    <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col">
      {messages.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>What can I help with?</EmptyTitle>
              <EmptyDescription>
                Pick a model and start chatting. Responses stream through
                OpenRouter.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Suggestions onSelect={handleSend} />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <ChatConversation
          scroll={scroll}
          label="Conversation"
          jumpLabel="Jump to latest"
          contentClassName="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6"
        >
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                message={message}
                isStreaming={isBusy && message.id === lastMessage?.id}
                onRetry={
                  !isBusy && message.id === lastMessage?.id
                    ? () =>
                        regenerate({
                          messageId: message.id,
                          body: { model: resolvedModel },
                        })
                    : undefined
                }
              />
            </div>
          ))}
          {status === "submitted" && (
            <Message>
              <MessageContent>
                <Trace>
                  <TraceLine status="running">
                    <TraceIcon>
                      <StatusIcon status="running" />
                    </TraceIcon>
                    <TraceTitle>Thinking</TraceTitle>
                  </TraceLine>
                </Trace>
              </MessageContent>
            </Message>
          )}
          {pendingQuestion && (
            <QuestionCard
              part={pendingQuestion}
              onAnswer={(toolCallId, answer) => {
                scroll.resetScroll()
                addToolOutput({
                  tool: "ask_user",
                  toolCallId,
                  output: answer,
                  options: { body: { model: resolvedModel } },
                })
              }}
            />
          )}
        </ChatConversation>
      )}

      <div className="mx-auto flex w-full max-w-2xl shrink-0 flex-col gap-2 px-6 pb-6">
        {error && (
          <Alert variant="error">
            <AlertTitle>Request failed</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <PromptForm
          models={models}
          model={resolvedModel}
          onModelChange={setModel}
          isBusy={isBusy}
          onSubmit={handleSend}
          onStop={() => stop()}
        />
      </div>
    </div>
  )
}
