import type { ChatStatus } from 'ai'

import { optimisticallySendMessage } from '@convex-dev/agent/react'
import { api } from '@convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'

import { useChatContext } from '.'
import { ChatModels } from './models'

export function ChatInput() {
  const [text, setText] = useState<string>('')
  const { threadId, results: messages } = useChatContext()

  const sendMessage = useMutation(api.chat.initiateAsyncStreaming).withOptimisticUpdate(
    optimisticallySendMessage(api.chat.listThreadMessages),
  )

  const abortStreamByOrder = useMutation(api.chat.abortStreamByOrder)

  const activeMessage = [...messages]
    .reverse()
    .find((message) => message.status === 'pending' || message.status === 'streaming')
  const isGenerating = Boolean(activeMessage)

  const inputStatus: ChatStatus = activeMessage
    ? activeMessage.status === 'streaming'
      ? 'streaming'
      : 'submitted'
    : messages.at(-1)?.status === 'failed'
      ? 'error'
      : 'ready'

  function handleSubmit() {
    if (text.trim() === '') return
    void sendMessage({ threadId, prompt: text }).catch(() => setText(text))
    setText('')
  }

  function handleStop() {
    if (!activeMessage) return
    void abortStreamByOrder({ threadId, order: activeMessage.order })
  }

  return (
    <div className="mx-auto w-full max-w-7xl shrink-0 p-2.5 px-4">
      <PromptInput onSubmit={handleSubmit} globalDrop multiple>
        {/*<PromptInputHeader>
          <PromptInputAttachmentsDisplay />
          {hasUnsupportedAttachments && (
            <p className="px-2 pt-2 text-sm text-warning">
              {unsupportedAttachmentNames.join(', ')} can&apos;t be sent with {model.name}. Remove
              them or switch models.
            </p>
          )}
        </PromptInputHeader>*/}
        <PromptInputBody>
          <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger tooltip={{ content: 'Attach files' }} />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
                <PromptInputActionAddScreenshot />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <ChatModels />
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!isGenerating && !text.trim()}
            onStop={handleStop}
            status={inputStatus}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
