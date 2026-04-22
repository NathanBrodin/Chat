import { useUIMessages } from '@convex-dev/agent/react'
import { api } from '@convex/_generated/api'
import { createContext, useContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { Model } from '@/lib/models/types'

import { ChatConversation } from './conversation'
import { ChatHeader } from './header'
import { ChatInput } from './input'
import { defaultModel } from './models'

type ChatValue = ReturnType<typeof useUIMessages<typeof api.chat.listThreadMessages>>

type ChatContextValue = ChatValue & {
  threadId: string
  model: Model
  setModel: (model: Model) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

type ChatProps = {
  threadId: string
}

export function Chat({ threadId }: ChatProps) {
  const [model, setModel] = useLocalStorage<Model>('model', defaultModel)

  const chat = useUIMessages(
    api.chat.listThreadMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  )

  return (
    <ChatContext.Provider value={{ ...chat, threadId, model, setModel }}>
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
