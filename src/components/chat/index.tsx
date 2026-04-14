import { useChat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { createContext, useContext } from 'react'

import { ChatConversation } from './conversation'
import { ChatHeader } from './header'
import { ChatInput } from './input'

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null)

export function Chat({ id, initialMessages }: { id?: string; initialMessages?: UIMessage[] }) {
  const chat = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
          },
        }
      },
    }),
  })

  return (
    <ChatContext.Provider value={chat}>
      <ChatHeader />
      <ChatConversation />
      <ChatInput />
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
