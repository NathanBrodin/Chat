import type { FileUIPart } from 'ai'

import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'

import type { ChatAttachmentMetadata, PendingChatMessage } from '@/lib/chat/types'

import { PromptInputAttachmentsDisplay } from '@/components/ai-elements/attachments-display'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { toastManager } from '@/components/ui/toast'
import { setPendingMessage } from '@/lib/chat/pending-message'

import { useChatContext } from '.'
import { ChatModels } from './models'

function getAttachmentRequirement(file: FileUIPart) {
  if (file.mediaType.startsWith('image/')) {
    return 'image'
  }

  if (file.mediaType.startsWith('audio/')) {
    return 'audio'
  }

  if (file.mediaType.startsWith('video/')) {
    return 'video'
  }

  return 'file'
}

function getUnsupportedAttachments(
  files: FileUIPart[],
  model: ReturnType<typeof useChatContext>['model'],
) {
  return files.filter(
    (file) => !model.architecture.input_modalities.includes(getAttachmentRequirement(file)),
  )
}

function supportsAttachments(model: ReturnType<typeof useChatContext>['model']) {
  return model.architecture.input_modalities.some((modality) => modality !== 'text')
}

function ChatInputFormControls({
  isSubmitting,
  model,
  status,
  text,
  setText,
}: {
  isSubmitting: boolean
  model: ReturnType<typeof useChatContext>['model']
  status: ReturnType<typeof useChatContext>['status']
  text: string
  setText: (value: string) => void
}) {
  const attachments = usePromptInputAttachments()
  const unsupportedAttachments = getUnsupportedAttachments(attachments.files, model)
  const unsupportedAttachmentNames = unsupportedAttachments.map(
    (file) => file.filename ?? file.mediaType,
  )
  const hasUnsupportedAttachments = unsupportedAttachments.length > 0
  const canAttachFiles = supportsAttachments(model)

  return (
    <>
      <PromptInputHeader>
        <PromptInputAttachmentsDisplay />
        {hasUnsupportedAttachments && (
          <p className="px-2 pt-2 text-sm text-warning">
            {unsupportedAttachmentNames.join(', ')} can&apos;t be sent with {model.name}. Remove
            them or switch models.
          </p>
        )}
      </PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger
              tooltip={{ content: 'Attach files' }}
              disabled={!canAttachFiles}
            />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <ChatModels />
        </PromptInputTools>
        <PromptInputSubmit disabled={isSubmitting || hasUnsupportedAttachments} status={status} />
      </PromptInputFooter>
    </>
  )
}

export function ChatInput() {
  const { sendMessage, status, conversationId, model } = useChatContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createChat = useMutation(api.chat.create)
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl)
  const [text, setText] = useState<string>('')
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  const uploadFiles = async (files: FileUIPart[]) => {
    const unsupportedFiles = getUnsupportedAttachments(files, model)
    if (unsupportedFiles.length > 0) {
      throw new Error(
        `${unsupportedFiles.map((file) => file.filename ?? file.mediaType).join(', ')} not supported by ${model.name}`,
      )
    }

    const uploads = await Promise.all(
      files.map(async (file): Promise<ChatAttachmentMetadata> => {
        const uploadUrl = await generateUploadUrl({})
        const response = await fetch(file.url)
        if (!response.ok) {
          throw new Error(`Failed to read attachment ${file.filename ?? file.mediaType}`)
        }

        const blob = await response.blob()
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': blob.type || file.mediaType,
          },
          body: blob,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload attachment ${file.filename ?? file.mediaType}`)
        }

        const { storageId } = (await uploadResponse.json()) as { storageId: string }

        return {
          storageId,
          filename: file.filename,
          mediaType: file.mediaType,
          size: blob.size,
        }
      }),
    )

    return {
      files,
      metadata: uploads,
    }
  }

  const handleSubmit = async (message: PromptInputMessage) => {
    try {
      const trimmedText = message.text.trim()
      const hasText = Boolean(trimmedText)
      const hasFiles = message.files.length > 0

      if (!hasText && !hasFiles) {
        return
      }

      const unsupportedAttachmentNames = getUnsupportedAttachments(message.files, model).map(
        (file) => file.filename ?? file.mediaType,
      )

      if (unsupportedAttachmentNames.length > 0) {
        toastManager.add({
          type: 'warning',
          title: 'Unsupported attachments',
          description: `${unsupportedAttachmentNames.join(', ')} can't be sent with ${model.name}.`,
        })
        return
      }

      const { files, metadata } = await uploadFiles(message.files)

      const pendingMessage: PendingChatMessage = trimmedText
        ? {
            text: trimmedText,
            ...(files.length > 0 ? { files } : {}),
            ...(metadata.length > 0 ? { metadata: { attachments: metadata } } : {}),
          }
        : {
            files,
            ...(metadata.length > 0 ? { metadata: { attachments: metadata } } : {}),
          }

      if (!conversationId) {
        setIsCreatingConversation(true)

        const title =
          trimmedText.length > 50
            ? trimmedText.substring(0, 50).trimEnd() + '...'
            : trimmedText || files[0]?.filename || 'New chat'

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
            setPendingMessage(id, pendingMessage)
            setText('')
            await navigate({ to: '/chat/$id', params: { id } })
            return
          }
        } finally {
          setIsCreatingConversation(false)
        }
      }

      await sendMessage(pendingMessage)
      setText('')
    } catch (error) {
      console.error('Failed to send message:', error)
      toastManager.add({
        type: 'error',
        title: 'Failed to send message',
        description: error instanceof Error && error.message ? error.message : 'Please try again.',
      })
    }
  }

  const isSubmitting = isCreatingConversation || status === 'submitted' || status === 'streaming'

  return (
    <div className="mx-auto w-full max-w-7xl shrink-0 p-2.5 px-4">
      <PromptInput onSubmit={handleSubmit} globalDrop multiple>
        <ChatInputFormControls
          isSubmitting={isSubmitting}
          model={model}
          setText={setText}
          status={status}
          text={text}
        />
      </PromptInput>
    </div>
  )
}
