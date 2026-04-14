import type { UIMessage } from 'ai'

import { useChat } from '@ai-sdk/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DefaultChatTransport } from 'ai'
import { MessageSquare } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputHeader,
} from '@/components/ai-elements/prompt-input'
import { getConversation, getConversationMessages } from '@/lib/chat/functions'
import { isLocalConversation, loadLocalMessages, saveLocalMessages } from '@/lib/chat/local-storage'

import { PromptInputAttachmentsDisplay } from '../-components/attachments-display'
import { ChatHeader } from '../-components/header'
import { ChatModels } from '../-components/models'

export const Route = createFileRoute('/(app)/chat/$conversationId/')({
  validateSearch: (search: Record<string, unknown>) => ({
    initialMessage: (search.initialMessage as string) || undefined,
  }),
  loader: async ({ params }) => {
    const { conversationId } = params

    // Skip server-side loading for local (anonymous) conversations
    if (isLocalConversation(conversationId)) {
      return { conversation: null, initialMessages: [] as UIMessage[] }
    }

    const [conversation, rawMessages] = await Promise.all([
      getConversation({ data: { conversationId } }),
      getConversationMessages({ data: { conversationId } }),
    ])

    const initialMessages = rawMessages.map((m) => JSON.parse(m) as UIMessage)

    return { conversation, initialMessages }
  },
  component: ConversationPage,
})

function ConversationPage() {
  const { conversationId } = Route.useParams()
  const { initialMessage } = Route.useSearch()
  const { conversation, initialMessages: serverMessages } = Route.useLoaderData()
  const navigate = useNavigate()

  const [text, setText] = useState<string>('')
  const initialMessageSentRef = useRef(false)

  // For local conversations, load from localStorage
  const isLocal = isLocalConversation(conversationId)
  const [localMessages] = useState<UIMessage[]>(() =>
    isLocal ? loadLocalMessages(conversationId) : [],
  )

  const initialMessages = isLocal ? localMessages : serverMessages

  const { status, messages, sendMessage } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            message: messages[messages.length - 1],
            // For local conversations, don't pass ID so server won't try to persist
            id: isLocal ? null : conversationId,
          },
        }
      },
    }),
    onFinish: (event) => {
      // For local conversations, save to localStorage after each response
      if (isLocal) {
        // event.messages contains the full up-to-date array including the new assistant message
        saveLocalMessages(conversationId, event.messages)
      }
    },
  })

  // Auto-send the initial message if redirected from the new conversation page
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true
      void sendMessage({ text: initialMessage })
      // Clean up the search param from the URL
      void navigate({
        to: '/chat/$conversationId',
        params: { conversationId },
        search: { initialMessage: undefined },
        replace: true,
      })
    }
  }, [initialMessage, sendMessage, navigate, conversationId])

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    if (!hasText) {
      return
    }
    void sendMessage({ text: message.text })
    setText('')
  }

  const title = conversation?.title ?? (isLocal ? 'Local conversation' : 'Conversation')

  return (
    <>
      <ChatHeader title={title} conversationId={conversationId} />
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
      <div className="mx-auto w-full max-w-7xl shrink-0 p-2.5 px-4">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger
                  tooltip={{
                    content: 'Attach files',
                  }}
                />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <ChatModels />
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  )
}
