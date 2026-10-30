import { useChat } from "@ai-sdk/react"
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai"

import { ChatConversation } from "@/components/chat/chat-conversation"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatHeader } from "@/components/chat/header"
import { useChatResponseState } from "@/components/chat/hooks/use-chat-response-state"
import { PromptForm } from "@/components/chat/prompt-form"
import { QuestionCard } from "@/components/chat/question-card"
import { StatusIcon } from "@/components/chat/status-icon"
import { Suggestions } from "@/components/chat/suggestions"
import { Dazzle } from "@/components/dazzle"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyHeader } from "@/components/ui/empty"
import { Message, MessageContent } from "@/components/ui/message"
import { MessageScrollerItem } from "@/components/ui/message-scroller"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"
import { siteConfig } from "@/config/site"
import { type ChatUIMessage } from "@/lib/chat/tools"
import { parseChatError } from "@/lib/errors/parse-chat-error"

export function Chat({
  id,
  initialMessages,
  title,
}: {
  id?: string
  initialMessages?: ChatUIMessage[]
  title?: string
} = {}) {
  const { messages, sendMessage, regenerate, status, stop, error, clearError, addToolOutput } =
    useChat<ChatUIMessage>({
      id,
      messages: initialMessages,
      // Resume the conversation automatically once the user has answered the
      // ask_user questionnaire.
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    })

  const isBusy = status === "submitted" || status === "streaming"
  const responseState = useChatResponseState(status, messages)

  const lastMessage = messages.at(-1)
  const pendingQuestion =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.find(
          (part): part is Extract<typeof part, { type: "tool-ask_user" }> =>
            part.type === "tool-ask_user" &&
            (part.state === "input-streaming" || part.state === "input-available"),
        )
      : undefined

  function handleSend(prompt: string) {
    sendMessage({ text: prompt })
  }

  const parsedError = error ? parseChatError(error) : null

  return (
    <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <ChatHeader messages={messages} title={title} />
      {messages.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <Empty className="gap-0">
            <EmptyHeader className="max-w-3xl">
              <h1 className="sr-only">{siteConfig.title}</h1>
              <p className="sr-only">{siteConfig.description}</p>
              <Dazzle text="What can I help with?" />
            </EmptyHeader>
            <EmptyContent className="max-w-xl">
              <Suggestions onSelect={handleSend} />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <ChatConversation
          label="Conversation"
          busy={isBusy}
          contentClassName="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6"
        >
          {messages.map((message) => (
            <MessageScrollerItem
              key={message.id}
              messageId={message.id}
              scrollAnchor={message.role === "user"}
            >
              <ChatMessage
                message={message}
                isStreaming={isBusy && message.id === lastMessage?.id}
                onRetry={
                  !isBusy && message.id === lastMessage?.id
                    ? () =>
                        regenerate({
                          messageId: message.id,
                        })
                    : undefined
                }
              />
            </MessageScrollerItem>
          ))}
          {status === "submitted" && (
            <MessageScrollerItem messageId="thinking">
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
            </MessageScrollerItem>
          )}
          {pendingQuestion && (
            <MessageScrollerItem messageId="pending-question">
              <QuestionCard
                part={pendingQuestion}
                onAnswer={(toolCallId, answer) => {
                  addToolOutput({
                    tool: "ask_user",
                    toolCallId,
                    output: answer,
                  })
                }}
              />
            </MessageScrollerItem>
          )}
        </ChatConversation>
      )}

      <div className="mx-auto flex w-full max-w-2xl shrink-0 flex-col gap-2 px-6 pb-2">
        {parsedError && (
          <Alert variant="error">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{parsedError.message}</AlertDescription>
            <AlertAction>
              <Button variant="ghost" size="xs" onClick={() => clearError()}>
                Dismiss
              </Button>
            </AlertAction>
          </Alert>
        )}
        <PromptForm
          isBusy={isBusy}
          responseState={responseState}
          onSubmit={handleSend}
          onStop={() => stop()}
        />
        <p className="text-center text-xs text-muted-foreground">
          All conversations are public. Do not share personal information.{" "}
          <a className="underline underline-offset-4 hover:text-foreground" href="/privacy">
            Privacy
          </a>
        </p>
      </div>
    </div>
  )
}
