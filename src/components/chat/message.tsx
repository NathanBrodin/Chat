import type { UIMessage } from '@convex-dev/agent'

import { MessageAttachmentsDisplay } from '../ai-elements/attachments-display'
import { Message, MessageContent, MessageResponse } from '../ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '../ai-elements/reasoning'

export function ChatMessage({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: UIMessage
  isLastMessage: boolean
  isStreaming: boolean
}) {
  // Consolidate all reasoning parts into one block
  const reasoningParts = message.parts.filter((part) => part.type === 'reasoning')

  const reasoningText = reasoningParts.map((part) => part.text).join('\n\n')
  const hasReasoning = reasoningParts.length > 0

  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1)
  const isReasoningStreaming = isLastMessage && isStreaming && lastPart?.type === 'reasoning'

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent>
        {hasReasoning && (
          <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
            <ReasoningTrigger />
            <ReasoningContent>{reasoningText}</ReasoningContent>
          </Reasoning>
        )}
        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            return <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
          }
          return null
        })}
      </MessageContent>
      <MessageAttachmentsDisplay message={message} />
    </Message>
  )
}
