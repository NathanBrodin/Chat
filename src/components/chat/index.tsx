import { useChat, type UIMessage } from '@ai-sdk/react'
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
}

const ChatContext = createContext<ChatContextValue | null>(null)

type ChatProps = {
  id?: string
  initialMessages?: UIMessage[]
  title?: string
}

export function Chat({ id, initialMessages, title }: ChatProps) {
  const [model, setModel] = useLocalStorage<Model>('model', defaultModel)

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
            model: model.id,
          },
        }
      },
    }),
  })

  return (
    <ChatContext.Provider value={{ ...chat, title, model, setModel }}>
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
