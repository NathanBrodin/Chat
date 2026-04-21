import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { ChatMessage } from '@/lib/chat/types'
import type { Model } from '@/lib/models/types'

import { consumePendingMessage } from '@/lib/chat/pending-message'

import { ChatConversation } from './conversation'
import { ChatError } from './error'
import { ChatHeader } from './header'
import { ChatInput } from './input'
import { defaultModel } from './models'

type ChatContextValue = Omit<ReturnType<typeof useChat<ChatMessage>>, 'setMessages'> & {
  title?: string
  model: Model
  setModel: (model: Model) => void
  conversationId?: string
}

const ChatContext = createContext<ChatContextValue | null>(null)

type ChatProps = {
  conversationId?: string
  initialMessages?: ChatMessage[]
  title?: string
}

export function Chat({ conversationId, initialMessages, title }: ChatProps) {
  const [model, setModel] = useLocalStorage<Model>('model', defaultModel)

  const chat = useChat<ChatMessage>({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ id, messages }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id: id ?? null,
            model: model.id,
          },
        }
      },
    }),
  })

  useEffect(() => {
    if (!conversationId) {
      return
    }

    const pendingMessage = consumePendingMessage(conversationId)

    if (!pendingMessage) {
      return
    }

    void chat.sendMessage(pendingMessage)
  }, [conversationId, chat])

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
