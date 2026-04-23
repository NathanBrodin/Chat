import type { UIMessage } from '@convex-dev/agent'

import { MessageAttachmentsDisplay } from '../ai-elements/attachments-display'
import {
  Message,
  MessageActions,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from '../ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '../ai-elements/reasoning'
import { CopyButton } from '../copy-button/copy-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function ChatMessage({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: UIMessage
  isLastMessage: boolean
  isStreaming: boolean
}) {
  const textParts = message.parts.filter((part) => part.type === 'text')
  const messageText = textParts.map((part) => part.text).join('\n\n')

  // Consolidate all reasoning parts into one block
  const reasoningParts = message.parts.filter((part) => part.type === 'reasoning')

  const reasoningText = reasoningParts.map((part) => part.text).join('\n\n')
  const hasReasoning = reasoningParts.length > 0

  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1)
  const isMessageLoading = isLastMessage && isStreaming
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
      {message.role === 'assistant' && !isMessageLoading && (
        <MessageToolbar className="pointer-events-none opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
          <div></div>
          <MessageActions>
            <Tooltip>
              <TooltipTrigger
                delay={0}
                render={<CopyButton variant="ghost" size="icon-sm" text={messageText} />}
              />
              <TooltipContent>
                <p>Copy Message</p>
              </TooltipContent>
            </Tooltip>
          </MessageActions>
        </MessageToolbar>
      )}
    </Message>
  )
}
