import type { Id } from '@convex/_generated/dataModel'
import type { ChatStatus } from 'ai'
import type { FormEvent } from 'react'

import { optimisticallySendMessage } from '@convex-dev/agent/react'
import { api } from '@convex/_generated/api'
import { useAction, useMutation } from 'convex/react'
import { useState } from 'react'

import { PromptInputAttachmentsDisplay } from '@/components/ai-elements/attachments-display'
import {
  type PromptInputMessage,
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputHeader,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input'

import { useChatContext } from '.'
import { ChatModels } from './models'

export function ChatInput() {
  const [text, setText] = useState<string>('')
  const { threadId, results: messages } = useChatContext()

  const sendMessage = useMutation(api.chat.initiateAsyncStreaming).withOptimisticUpdate(
    (store, args) => {
      if (!args.prompt?.trim()) {
        return
      }
      optimisticallySendMessage(api.chat.listThreadMessages)(store, {
        threadId: args.threadId,
        prompt: args.prompt,
      })
    },
  )
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl)
  const finalizeUploadedFile = useAction(api.chat.finalizeUploadedFile)

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

  async function handleSubmit(
    { files, text: submittedText }: PromptInputMessage,
    _event: FormEvent<HTMLFormElement>,
  ) {
    if (submittedText.trim() === '' && files.length === 0) {
      return
    }

    const uploadedAttachments = await Promise.all(
      files.map(async (file) => {
        const uploadUrl = await generateUploadUrl({ threadId })
        const blob = await fetch(file.url).then(async (response) => {
          if (!response.ok) {
            throw new Error('Failed to read selected file')
          }
          return await response.blob()
        })

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: blob.type ? { 'Content-Type': blob.type } : undefined,
          body: blob,
        })
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file')
        }

        const payload = (await uploadResponse.json()) as { storageId?: string }
        if (!payload.storageId) {
          throw new Error('Upload did not return a storage id')
        }

        return await finalizeUploadedFile({
          threadId,
          storageId: payload.storageId as Id<'_storage'>,
          filename: file.filename,
        })
      }),
    )

    await sendMessage({
      threadId,
      prompt: submittedText,
      attachments: uploadedAttachments,
    }).catch(() => {
      if (submittedText.trim()) {
        setText(submittedText)
      }
      throw new Error('Failed to send message')
    })

    setText('')
  }

  function handleStop() {
    if (!activeMessage) return
    void abortStreamByOrder({ threadId, order: activeMessage.order })
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
              <PromptInputActionMenuTrigger tooltip={{ content: 'Attach files' }} />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
                <PromptInputActionAddScreenshot />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <ChatModels />
          </PromptInputTools>
          <ChatInputSubmit
            inputStatus={inputStatus}
            isGenerating={isGenerating}
            onStop={handleStop}
            text={text}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

function ChatInputSubmit({
  inputStatus,
  isGenerating,
  onStop,
  text,
}: {
  inputStatus: ChatStatus
  isGenerating: boolean
  onStop: () => void
  text: string
}) {
  const attachments = usePromptInputAttachments()
  const hasInput = text.trim().length > 0 || attachments.files.length > 0

  return (
    <PromptInputSubmit disabled={!isGenerating && !hasInput} onStop={onStop} status={inputStatus} />
  )
}
