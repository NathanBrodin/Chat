import type { FileUIPart, UIMessage } from 'ai'

export type ChatAttachmentMetadata = {
  storageId: string
  filename?: string
  mediaType: string
  size?: number
}

export type ChatMessageMetadata = {
  attachments?: ChatAttachmentMetadata[]
}

export type ChatMessage = UIMessage<ChatMessageMetadata>

export type PendingChatMessage =
  | {
      text: string
      files?: FileUIPart[]
      metadata?: ChatMessageMetadata
    }
  | {
      files: FileUIPart[]
      metadata?: ChatMessageMetadata
    }
