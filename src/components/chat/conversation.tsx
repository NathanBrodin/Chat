import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { useChatContext } from '.'
import { ChatMessage } from './message'

export function ChatConversation() {
  const { results } = useChatContext()
  const isEmpty = results.length === 0

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent className={isEmpty ? 'h-full flex-1' : undefined}>
        {isEmpty ? (
          <ConversationEmptyState />
        ) : (
          results.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastMessage={index === results.length - 1}
              isStreaming={message.status === 'streaming'}
            />
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
