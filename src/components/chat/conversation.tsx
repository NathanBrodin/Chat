import { MessageSquare } from 'lucide-react'

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'

import { useChatContext } from '.'

export function ChatConversation() {
  const { messages, status } = useChatContext()

  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            icon={<MessageSquare className="size-12" />}
            title="Start a conversation"
            description="Type a message below to begin chatting"
          />
        ) : (
          messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <MessageResponse
                          key={`${message.id}-${i}`}
                          isAnimating={status === 'streaming' && message.role === 'assistant'}
                          animated={{ animation: 'blurIn' }}
                        >
                          {part.text}
                        </MessageResponse>
                      )
                    default:
                      return null
                  }
                })}
              </MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
