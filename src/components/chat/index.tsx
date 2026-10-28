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
import { SiteLinks } from "@/components/site-links"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyHeader } from "@/components/ui/empty"
import { Message, MessageContent } from "@/components/ui/message"
import { MessageScrollerItem } from "@/components/ui/message-scroller"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"
import { parseChatError } from "@/lib/errors/parse-chat-error"
import { type ChatUIMessage } from "@/tools"

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

  // The transport surfaces HTTP failures as APICallError carrying the raw
  // response body, so unwrap with parseChatError and branch on stable codes,
  // never on user-facing messages.
  const parsedError = error ? parseChatError(error) : null
  const errorTitle =
    parsedError?.code === "chat.RATE_LIMITED_BURST" ||
    parsedError?.code === "chat.RATE_LIMITED_DAILY"
      ? "Slow down — rate limited"
      : parsedError?.code === "chat.INVALID_JSON" || parsedError?.code === "chat.INVALID_MESSAGES"
        ? "Couldn't process that"
        : parsedError?.code === "chat.STREAM_FAILED"
          ? "Response interrupted"
          : "Request failed"

  return (
    <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <ChatHeader messages={messages} title={title} />
      {messages.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6">
          <Empty className="gap-6">
            <EmptyHeader className="max-w-3xl gap-4">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Nathan&apos;s AI
              </p>
              <Dazzle as="h1" text="Ask my AI anything about Nathan Brodin" />
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Get answers about my experience, projects, and approach to building fast, accessible
                products for the web.
              </p>
            </EmptyHeader>
            <EmptyContent className="max-w-2xl gap-6">
              <Suggestions onSelect={handleSend} />
              <SiteLinks className="justify-center" />
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
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>
              <span>{parsedError.message}</span>
              {parsedError.why && <span>{parsedError.why}</span>}
              {parsedError.fix && <span className="font-medium">{parsedError.fix}</span>}
              {parsedError.link && (
                <a className="underline" href={parsedError.link}>
                  Learn more
                </a>
              )}
            </AlertDescription>
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
