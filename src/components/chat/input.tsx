import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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

import { useChatContext } from '.'
import { ChatModels } from './models'

export function ChatInput() {
  const { sendMessage, messages, status } = useChatContext()
  const navigate = useNavigate()
  const { mutateAsync: createConversation, isPending } = useMutation({
    mutationFn: useConvexMutation(api.chat.create),
  })
  const [text, setText] = useState<string>('')

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    if (!hasText) {
      return
    }

    if (messages.length === 0) {
      const title =
        message.text.length > 50 ? message.text.substring(0, 50).trimEnd() + '...' : message.text

      const id = await createConversation({ title })
      if (typeof id === 'string') {
        void navigate({ to: '/chat/$id', params: { id: id } })
      }
    }

    void sendMessage({ text: message.text })
    setText('')
  }

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
          <PromptInputSubmit disabled={!text && !status} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
