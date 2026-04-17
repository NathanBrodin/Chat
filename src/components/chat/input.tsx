import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'

import { PromptInputAttachmentsDisplay } from '@/components/ai-elements/attachments-display'
import {
  PromptInput,
  PromptInputBody,
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
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { setPendingMessage } from '@/lib/chat/pending-message'

import { useChatContext } from '.'
import { ChatModels } from './models'

export function ChatInput() {
  const { sendMessage, status, conversationId } = useChatContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createChat = useMutation(api.chat.create)
  const [text, setText] = useState<string>('')
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  const handleSubmit = async (message: PromptInputMessage) => {
    const trimmedText = message.text.trim()
    const hasText = Boolean(trimmedText)
    if (!hasText) {
      return
    }

    if (!conversationId) {
      setIsCreatingConversation(true)

      const title =
        trimmedText.length > 50 ? trimmedText.substring(0, 50).trimEnd() + '...' : trimmedText

      try {
        const id = await createChat({ title })
        if (id && typeof id === 'string') {
          queryClient.setQueryData(
            convexQuery(api.chat.get, { conversationId: id as never }).queryKey,
            {
              _id: id,
              _creationTime: Date.now(),
              title,
              userId: '',
            },
          )
          queryClient.setQueryData(
            convexQuery(api.chat.getMessages, { conversationId: id as never }).queryKey,
            [],
          )
          setPendingMessage(id, trimmedText)
          setText('')
          await navigate({ to: '/chat/$id', params: { id } })
          return
        }
      } finally {
        setIsCreatingConversation(false)
      }

      void sendMessage({ text: trimmedText })
      setText('')
      return
    }

    void sendMessage({ text: trimmedText })
    setText('')
  }

  const isSubmitting = isCreatingConversation || status === 'submitted' || status === 'streaming'

  return (
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
          <PromptInputSubmit disabled={!text.trim() || isSubmitting} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
