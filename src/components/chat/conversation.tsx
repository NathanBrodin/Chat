import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { useChatContext } from '.'
import { ChatMessage } from './message'

export function ChatConversation() {
  const { messages, status } = useChatContext()
  const isEmpty = messages.length === 0

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent className={isEmpty ? 'h-full flex-1' : undefined}>
        {isEmpty ? (
          <ConversationEmptyState />
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastMessage={index === messages.length - 1}
              isStreaming={status === 'streaming'}
            />
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
