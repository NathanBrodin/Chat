import { useChat, type UIMessage } from '@ai-sdk/react'
import { useLocation } from '@tanstack/react-router'
import { DefaultChatTransport } from 'ai'
import { createContext, useContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { Model } from '@/lib/models/types'

import { ChatConversation } from './conversation'
import { ChatError } from './error'
import { ChatHeader } from './header'
import { ChatInput } from './input'
import { defaultModel } from './models'

type ChatContextValue = Omit<ReturnType<typeof useChat>, 'setMessages'> & {
  title?: string
  model: Model
  setModel: (model: Model) => void
  conversationId?: string
}

const ChatContext = createContext<ChatContextValue | null>(null)

type ChatProps = {
  initialMessages?: UIMessage[]
  title?: string
}

function extractChatId(pathname: string): string | undefined {
  const match = pathname.match(/\/chat\/([^/]+)/)
  return match ? match[1] : undefined
}

export function Chat({ initialMessages, title }: ChatProps) {
  const [model, setModel] = useLocalStorage<Model>('model', defaultModel)
  const location = useLocation()
  const conversationId = extractChatId(location.pathname)

  const chat = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id: conversationId,
            model: model.id,
          },
        }
      },
    }),
  })

  return (
    <ChatContext.Provider value={{ ...chat, title, model, setModel, conversationId }}>
      <ChatHeader />
      <ChatConversation />
      <ChatError />
      <ChatInput />
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
